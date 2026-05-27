const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const {
  generateTrackingId,
  TRACKING_STATUSES,
  STATUS_LABELS,
  STATUS_MESSAGES,
} = require('../models/trackingModel');

const normalizeStatus = (status) => String(status || 'processing').toLowerCase().replace(/\s+/g, '_');

const assertValidStatus = (status) => {
  if (!TRACKING_STATUSES.includes(status)) {
    const allowed = TRACKING_STATUSES.map((item) => STATUS_LABELS[item]).join(', ');
    const error = new Error(`Invalid status. Allowed statuses: ${allowed}.`);
    error.statusCode = 400;
    throw error;
  }
};

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
};

const validateParcelItems = (items) => {
  if (items === undefined || items === null) return null;
  if (!Array.isArray(items)) createValidationError('parcel_items must be an array.');
  return items.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      createValidationError(`parcel_items[${index}] must be an object.`);
    }
    const qty = Number(item.qty || 0);
    if (Number.isNaN(qty) || qty < 0) {
      createValidationError(`parcel_items[${index}].qty must be a non-negative number.`);
    }
    const parcelShippingCost = item.parcel_shipping_cost != null ? Number(item.parcel_shipping_cost) : null;
    const parcelClearanceCost = item.parcel_clearance_cost != null ? Number(item.parcel_clearance_cost) : null;
    const parcelTotalCost = item.parcel_total_cost != null ? Number(item.parcel_total_cost) : null;
    if ((item.parcel_shipping_cost != null && Number.isNaN(parcelShippingCost)) || (item.parcel_clearance_cost != null && Number.isNaN(parcelClearanceCost)) || (item.parcel_total_cost != null && Number.isNaN(parcelTotalCost))) {
      createValidationError(`parcel_items[${index}] cost fields must be numeric.`);
    }
    return {
      qty,
      product: item.product != null ? String(item.product) : null,
      status: item.status != null ? String(item.status) : null,
      description: item.description != null ? String(item.description) : null,
      parcel_shipping_cost: parcelShippingCost,
      parcel_clearance_cost: parcelClearanceCost,
      parcel_total_cost: parcelTotalCost,
    };
  });
};

const logShipmentActivity = async (shipmentId, action, details, adminId = null) => {
  await pool.execute(
    `INSERT INTO shipment_activity_logs (shipment_id, action, details, created_by)
     VALUES (?, ?, ?, ?)`,
    [shipmentId, action, JSON.stringify(details || {}), adminId]
  );
};

// ── PUBLIC TRACKING ──────────────────────────
exports.trackShipment = async (req, res) => {
  try {
    const { trackingId } = req.params;
    let adminUser = null;

    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        adminUser = decoded && decoded.id ? decoded : null;
      }
    } catch (authErr) {
      adminUser = null;
    }

    const customerKey = String(req.query.customer || '').trim().toLowerCase();

    if (!customerKey && !adminUser) {
      return res.status(400).json({
        success: false,
        message: 'Enter the tracking code and recipient email or phone number to view this shipment.'
      });
    }

    const query = adminUser
      ? `SELECT * FROM shipments WHERE tracking_id = ?`
      : `SELECT * FROM shipments
         WHERE tracking_id = ?
         AND (
          LOWER(COALESCE(recipient_email, '')) = ?
          OR LOWER(COALESCE(sender_email, '')) = ?
          OR REPLACE(COALESCE(recipient_phone, ''), ' ', '') = ?
          OR REPLACE(COALESCE(sender_phone, ''), ' ', '') = ?
         )`;
    const params = adminUser
      ? [trackingId.toUpperCase()]
      : [
          trackingId.toUpperCase(),
          customerKey,
          customerKey,
          customerKey.replace(/\s+/g, ''),
          customerKey.replace(/\s+/g, ''),
        ];

    const [shipments] = await pool.execute(query, params);
    if (!shipments.length) {
      return res.status(404).json({ success: false, message: 'Tracking details were not found for those customer details.' });
    }
    const shipment = shipments[0];
    const [events] = await pool.execute(
      'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_time DESC', [shipment.id]
    );
    const [media] = await pool.execute(
      'SELECT * FROM shipment_media WHERE shipment_id = ? ORDER BY uploaded_at DESC', [shipment.id]
    );

    const publicShipment = {
      trackingNumber: shipment.tracking_id,
      status: shipment.status,
      currentLocation: shipment.current_location || 'In Transit - Processing Hub',
      estimatedDelivery: shipment.estimated_delivery,
      origin: shipment.sender_address || shipment.sender_city || 'Origin not available',
      destination: shipment.recipient_address || shipment.recipient_city || 'Destination not available',
      senderName: shipment.sender_name,
      recipientName: shipment.recipient_name,
      serviceType: shipment.service_type,
      packageType: shipment.package_type,
      weight: shipment.weight,
      weightUnit: shipment.weight_unit,
      shipmentCost: shipment.shipment_cost,
      clearanceCost: shipment.clearance_cost,
      totalAmount: shipment.total_amount,
      paymentStatus: shipment.payment_status,
      events: events.map((event) => ({
        id: event.id,
        status: event.status,
        location: event.location,
        description: event.description,
        eventTime: event.event_time,
      })),
    };

    delete shipment.admin_notes;
    res.json({ success: true, shipment: publicShipment, media });
  } catch (err) {
    console.error('Track shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: LIST SHIPMENTS ─────────────────────
exports.getShipments = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND s.status = ?'; params.push(normalizeStatus(status)); }
    if (search) {
      where += ' AND (s.tracking_id LIKE ? OR s.sender_name LIKE ? OR s.recipient_name LIKE ? OR s.recipient_email LIKE ? OR s.recipient_phone LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q, q, q);
    }
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM shipments s ${where}`, params
    );
    const total = countRows[0].total;
    const [shipments] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s 
       LEFT JOIN admins a ON s.created_by = a.id 
       ${where} 
       ORDER BY s.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    res.json({ success: true, shipments, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Get shipments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: GET SINGLE SHIPMENT ────────────────
exports.getShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s LEFT JOIN admins a ON s.created_by = a.id 
       WHERE s.id = ?`, [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    const [events] = await pool.execute(
      'SELECT te.*, a.name as created_by_name FROM tracking_events te LEFT JOIN admins a ON te.created_by = a.id WHERE te.shipment_id = ? ORDER BY te.event_time DESC',
      [id]
    );
    const [media] = await pool.execute(
      'SELECT * FROM shipment_media WHERE shipment_id = ? ORDER BY uploaded_at DESC', [id]
    );
    const [logs] = await pool.execute(
      `SELECT sal.*, a.name as created_by_name
       FROM shipment_activity_logs sal
       LEFT JOIN admins a ON sal.created_by = a.id
       WHERE sal.shipment_id = ?
       ORDER BY sal.created_at DESC`,
      [id]
    );
    res.json({ success: true, shipment: rows[0], events, media, logs });
  } catch (err) {
    console.error('Get shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: CREATE SHIPMENT ────────────────────
exports.createShipment = async (req, res) => {
  try {
    const tracking_id = await generateTrackingId(pool);
    const {
      sender_name, sender_email, sender_phone, sender_address, sender_city,
      sender_state, sender_country, sender_zip, sender_postal_code,
      order_id,
      recipient_name, recipient_email, recipient_phone, recipient_address,
      recipient_city, recipient_state, recipient_country, recipient_zip, recipient_postal_code,
      description, weight, weight_unit, dimensions, package_type, declared_value,
      service_type, status, priority, ship_date, estimated_delivery,
      current_location, notes, admin_notes,
      payment_status, currency, shipment_cost, clearance_cost, total_amount,
      parcel_quantity, parcel_product, parcel_status, parcel_description,
      parcel_shipping_cost, parcel_total_cost, parcel_items
    } = req.body;
    const normalizedStatus = normalizeStatus(status);
    assertValidStatus(normalizedStatus);

    // Generate or normalize order ID
    let orderId = order_id && String(order_id).trim() ? String(order_id).trim() : null;
    if (!orderId) {
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 5) {
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        orderId = `ORD-${Date.now().toString().slice(-6)}-${rand}`;
        const [rows] = await pool.execute('SELECT id FROM shipments WHERE order_id = ?', [orderId]);
        if (!rows.length) isUnique = true;
        attempts++;
      }
      if (!orderId) orderId = `ORD-${Date.now()}`;
    }

    const validatedParcelItems = validateParcelItems(parcel_items);
    const senderZip = sender_zip || sender_postal_code || null;
    const recipientZip = recipient_zip || recipient_postal_code || null;
    const numericShipmentCost = shipment_cost != null ? Number(shipment_cost) : null;
    const numericClearanceCost = clearance_cost != null ? Number(clearance_cost) : null;
    const numericTotalAmount = total_amount != null ? Number(total_amount) : null;
    const numericDeclaredValue = declared_value != null ? Number(declared_value) : null;
    const numericParcelQuantity = parcel_quantity != null ? Number(parcel_quantity) : null;
    const [result] = await pool.execute(
      `INSERT INTO shipments (
        tracking_id, order_id, sender_name, sender_email, sender_phone, sender_address,
        sender_city, sender_state, sender_country, sender_zip,
        recipient_name, recipient_email, recipient_phone, recipient_address,
        recipient_city, recipient_state, recipient_country, recipient_zip,
        shipment_cost, clearance_cost, total_amount, payment_status, currency,
        parcel_quantity, parcel_product, parcel_status, parcel_description,
        parcel_shipping_cost, parcel_total_cost, parcel_items,
        description, weight, weight_unit, dimensions, package_type, declared_value,
        service_type, status, priority, ship_date, estimated_delivery,
        current_location, notes, admin_notes, created_by
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        tracking_id, orderId, sender_name, sender_email||null, sender_phone||null, sender_address,
        sender_city, sender_state||null, sender_country||'USA', senderZip,
        recipient_name, recipient_email||null, recipient_phone||null, recipient_address,
        recipient_city, recipient_state||null, recipient_country||'USA', recipientZip,
        numericShipmentCost, numericClearanceCost, numericTotalAmount, payment_status||'pending', currency||'USD',
        numericParcelQuantity, parcel_product||null, parcel_status||null, parcel_description||null,
        parcel_shipping_cost||null, parcel_total_cost||null, validatedParcelItems ? JSON.stringify(validatedParcelItems) : null,
        description||null, weight||null, weight_unit||'lbs', dimensions||null, package_type||null, numericDeclaredValue,
        service_type||'standard', normalizedStatus, priority||'normal', ship_date||null, estimated_delivery||null,
        current_location||null, notes||null, admin_notes||null, req.admin.id
      ]
    );
    // Auto-create first tracking event
    await pool.execute(
      `INSERT INTO tracking_events (shipment_id, status, location, description, created_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [result.insertId, STATUS_LABELS[normalizedStatus], current_location || 'Columbus, Ohio', STATUS_MESSAGES[normalizedStatus], req.admin.id]
    );
    const linkedEmail = (recipient_email || sender_email || '').trim().toLowerCase();
    if (linkedEmail) {
      const [customers] = await pool.execute('SELECT id FROM customers WHERE email = ?', [linkedEmail]);
      if (customers.length) {
        await pool.execute('UPDATE shipments SET customer_id = ? WHERE id = ?', [customers[0].id, result.insertId]);
      }
    }
    await logShipmentActivity(result.insertId, 'shipment_created', { tracking_id, order_id: orderId, status: normalizedStatus }, req.admin.id);
    res.status(201).json({ success: true, message: 'Shipment created successfully.', tracking_id, order_id: orderId, id: result.insertId });
  } catch (err) {
    console.error('Create shipment error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Server error.' });
  }
};

// ── ADMIN: UPDATE SHIPMENT ────────────────────
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    
    const fields = [
      'order_id',
      'sender_name','sender_email','sender_phone','sender_address','sender_city',
      'sender_state','sender_country','sender_zip',
      'recipient_name','recipient_email','recipient_phone','recipient_address',
      'recipient_city','recipient_state','recipient_country','recipient_zip',
      'shipment_cost','clearance_cost','total_amount','payment_status','currency',
      'parcel_quantity','parcel_product','parcel_status','parcel_description','parcel_shipping_cost',
      'parcel_total_cost','parcel_items',
      'description','weight','weight_unit','dimensions','package_type','declared_value',
      'service_type','status','priority','ship_date','estimated_delivery',
      'current_location','notes','admin_notes'
    ];
    const updates = [];
    const values = [];
    
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        if (f === 'status') {
          const normalizedStatus = normalizeStatus(req.body[f]);
          assertValidStatus(normalizedStatus);
          updates.push(`${f} = ?`);
          values.push(normalizedStatus);
        } else if (f === 'parcel_items') {
          const validatedParcelItems = validateParcelItems(req.body[f]);
          updates.push(`${f} = ?`);
          values.push(validatedParcelItems ? JSON.stringify(validatedParcelItems) : null);
        } else {
          updates.push(`${f} = ?`);
          values.push(req.body[f]);
        }
      }
    });
    
    // Handle delivered status
    const requestedStatus = req.body.status ? normalizeStatus(req.body.status) : null;
    if (requestedStatus === 'delivered' && existing[0].status !== 'delivered') {
      updates.push('actual_delivery = NOW()');
    }
    
    if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update.' });
    
    values.push(id);
    await pool.execute(`UPDATE shipments SET ${updates.join(', ')} WHERE id = ?`, values);
    
    // Auto-add tracking event when status changes
    if (requestedStatus && requestedStatus !== existing[0].status) {
      await pool.execute(
        `INSERT INTO tracking_events (shipment_id, status, location, description, created_by) VALUES (?,?,?,?,?)`,
        [
          id,
          STATUS_LABELS[requestedStatus],
          req.body.current_location || existing[0].current_location,
          STATUS_MESSAGES[requestedStatus] || 'Status updated.',
          req.admin.id
        ]
      );
    }
    await logShipmentActivity(id, 'shipment_updated', { changed_fields: Object.keys(req.body), status: requestedStatus }, req.admin.id);
    
    res.json({ success: true, message: 'Shipment updated successfully.' });
  } catch (err) {
    console.error('Update shipment error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Server error.' });
  }
};

// ── ADMIN: DELETE SHIPMENT ────────────────────
exports.deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT id FROM shipments WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    await pool.execute('DELETE FROM shipments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Shipment deleted successfully.' });
  } catch (err) {
    console.error('Delete shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: ADD TRACKING EVENT ─────────────────
exports.addTrackingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, description, event_time } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required.' });
    const normalizedStatus = normalizeStatus(status);
    assertValidStatus(normalizedStatus);

    const [shipmentRows] = await pool.execute('SELECT id FROM shipments WHERE id = ?', [id]);
    if (!shipmentRows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });

    const [result] = await pool.execute(
      `INSERT INTO tracking_events (shipment_id, status, location, description, event_time, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, STATUS_LABELS[normalizedStatus], location||null, description||STATUS_MESSAGES[normalizedStatus], event_time || new Date(), req.admin.id]
    );
    await pool.execute(
      'UPDATE shipments SET status = ?, current_location = COALESCE(?, current_location) WHERE id = ?',
      [normalizedStatus, location || null, id]
    );
    await logShipmentActivity(id, 'tracking_event_added', { event_id: result.insertId, status: normalizedStatus, location }, req.admin.id);
    res.status(201).json({ success: true, message: 'Tracking event added.', id: result.insertId });
  } catch (err) {
    console.error('Add tracking event error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Server error.' });
  }
};

// ── ADMIN: UPLOAD MEDIA ───────────────────────
exports.uploadMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const isVideo = req.file.mimetype.startsWith('video/');
    await pool.execute(
      `INSERT INTO shipment_media (shipment_id, media_type, filename, original_name, file_size, mime_type, caption, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, isVideo ? 'video' : 'photo', req.file.filename, req.file.originalname, req.file.size, req.file.mimetype, caption||null, req.admin.id]
    );
    await logShipmentActivity(id, 'media_uploaded', { filename: req.file.filename, type: isVideo ? 'video' : 'photo' }, req.admin.id);
    res.status(201).json({ success: true, message: 'Media uploaded successfully.', filename: req.file.filename });
  } catch (err) {
    console.error('Upload media error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: DELETE MEDIA ───────────────────────
exports.deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM shipment_media WHERE id = ?', [mediaId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Media not found.' });
    const fs = require('fs');
    const path = require('path');
    const m = rows[0];
    const filePath = path.join(__dirname, '../uploads', m.media_type === 'video' ? 'videos' : 'photos', m.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.execute('DELETE FROM shipment_media WHERE id = ?', [mediaId]);
    await logShipmentActivity(rows[0].shipment_id, 'media_deleted', { media_id: Number(mediaId), filename: m.filename }, req.admin.id);
    res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: DASHBOARD STATS ────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totals] = await pool.execute('SELECT COUNT(*) as total FROM shipments');
    const [byStatus] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM shipments GROUP BY status'
    );
    const [recent] = await pool.execute(
      'SELECT id, tracking_id, recipient_name, recipient_city, status, created_at FROM shipments ORDER BY created_at DESC LIMIT 5'
    );
    const [todayCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM shipments WHERE DATE(created_at) = CURDATE()'
    );
    
    const statusMap = {};
    byStatus.forEach(r => { statusMap[r.status] = r.count; });
    
    res.json({
      success: true,
      stats: {
        total: totals[0].total,
        today: todayCount[0].count,
        processing: statusMap.processing || 0,
        picked_up: statusMap.picked_up || 0,
        in_transit: statusMap.in_transit || 0,
        customs_clearance: statusMap.customs_clearance || 0,
        arrived_at_facility: statusMap.arrived_at_facility || 0,
        delivered: statusMap.delivered || 0,
        failed_delivery: statusMap.failed_delivery || 0,
        out_for_delivery: statusMap.out_for_delivery || 0
      },
      recent
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
