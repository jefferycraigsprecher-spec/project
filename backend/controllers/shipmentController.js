const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const { pool } = require('../config/database');
const { sendInvoiceEmail, sendShipmentUpdateEmail, sendSmsNotification } = require('../utilis/emailService');
const {
  generateTrackingId,
  TRACKING_STATUSES,
  STATUS_LABELS,
  STATUS_MESSAGES,
} = require('../models/trackingModel');

const normalizeStatus = (status) => String(status || 'processing').toLowerCase().replace(/\s+/g, '_');

const normalizeTrackingId = (raw) => {
  const value = String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
  if (!value) return ''
  if (value.startsWith('MSC-')) return value
  return `MSC-${value}`
}

const assertValidStatus = (status) => {
  if (!TRACKING_STATUSES.includes(status)) {
    const allowed = TRACKING_STATUSES.map((item) => STATUS_LABELS[item]).join(', ');
    const error = new Error(`Invalid status. Allowed statuses: ${allowed}.`);
    error.statusCode = 400;
    throw error;
  }
};

const generateOrderId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `MWL-ORD-${date}-${suffix}`;
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
    const trackingId = normalizeTrackingId(req.params.trackingId)
    // Only allow lookup by exact tracking ID for public tracking
    const [shipments] = await pool.execute('SELECT * FROM shipments WHERE tracking_id = ?', [trackingId.toUpperCase()]);
    if (!shipments.length) {
      return res.status(404).json({ success: false, message: 'Tracking details were not found for those customer details.' });
    }
    const shipment = shipments[0];
    const [events] = await pool.execute(
      'SELECT *, remarks AS description FROM tracking_updates WHERE shipment_id = ? ORDER BY event_time DESC', [shipment.id]
    );
    const [media] = await pool.execute(
      'SELECT * FROM shipment_media WHERE shipment_id = ? ORDER BY uploaded_at DESC', [shipment.id]
    );

    const publicShipment = {
      trackingNumber: shipment.tracking_id,
      status: shipment.status,
      currentStatus: shipment.current_status || shipment.status,
      currentLocation: shipment.current_location || 'In Transit - Processing Hub',
      lastUpdated: shipment.last_updated || shipment.updated_at || shipment.updatedAt || shipment.created_at,
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
    const searchTerm = String(search || '').trim();
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND s.status = ?'; params.push(normalizeStatus(status)); }
    if (searchTerm) {
      where += ' AND (s.tracking_id LIKE ? OR s.sender_name LIKE ? OR s.recipient_name LIKE ? OR s.recipient_email LIKE ? OR s.recipient_phone LIKE ?)';
      const q = `%${searchTerm}%`;
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
       ORDER BY s.created_at DESC, s.updated_at DESC 
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
      'SELECT te.*, a.name as created_by_name, te.remarks AS description FROM tracking_updates te LEFT JOIN admins a ON te.created_by = a.id WHERE te.shipment_id = ? ORDER BY te.event_time DESC',
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

exports.getShipmentByTracking = async (req, res) => {
  try {
    const trackingId = normalizeTrackingId(req.params.trackingId)
    let adminUser = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        adminUser = decoded && decoded.id ? decoded : null;
      }
    } catch (err) {
      adminUser = null;
    }
    const [rows] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s LEFT JOIN admins a ON s.created_by = a.id 
       WHERE s.tracking_id = ?`, [trackingId]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Tracking details were not found.' });
    const shipment = rows[0];
    res.json({ success: true, shipment });
  } catch (err) {
    console.error('Get shipment by tracking error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET INVOICE (PUBLIC/ADMIN/CUSTOMER) ───────
exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s LEFT JOIN admins a ON s.created_by = a.id 
       WHERE s.id = ?`, [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    
    const shipment = rows[0];
    let parcelItems = [];
    
    if (shipment.parcel_items) {
      try {
        parcelItems = typeof shipment.parcel_items === 'string'
          ? JSON.parse(shipment.parcel_items)
          : Array.isArray(shipment.parcel_items) ? shipment.parcel_items : [];
      } catch (err) {
        parcelItems = [];
      }
    }

    const invoice = {
      success: true,
      invoice: {
        // Basic Info
        tracking_id: shipment.tracking_id,
        shipment_id: shipment.id,
        created_at: shipment.created_at,
        
        // Sender Info
        sender_name: shipment.sender_name,
        sender_email: shipment.sender_email,
        sender_phone: shipment.sender_phone,
        sender_address: shipment.sender_address,
        sender_city: shipment.sender_city,
        sender_state: shipment.sender_state,
        sender_country: shipment.sender_country,
        sender_zip: shipment.sender_zip,
        
        // Recipient Info
        recipient_name: shipment.recipient_name,
        recipient_email: shipment.recipient_email,
        recipient_phone: shipment.recipient_phone,
        recipient_address: shipment.recipient_address,
        recipient_city: shipment.recipient_city,
        recipient_state: shipment.recipient_state,
        recipient_country: shipment.recipient_country,
        recipient_zip: shipment.recipient_zip,
        
        // Shipment Details
        description: shipment.description,
        weight: shipment.weight,
        weight_unit: shipment.weight_unit,
        dimensions: shipment.dimensions,
        package_type: shipment.package_type,
        declared_value: shipment.declared_value,
        quantity: shipment.quantity,
        
        // Service Details
        service_type: shipment.service_type,
        status: shipment.status,
        priority: shipment.priority,
        booking_mode: shipment.booking_mode,
        current_location: shipment.current_location,
        
        // Dates
        ship_date: shipment.ship_date,
        estimated_delivery: shipment.estimated_delivery,
        actual_delivery: shipment.actual_delivery,
        
        // Payment & Costs
        shipping_cost: shipment.shipping_cost ?? shipment.shipment_cost,
        clearance_cost: shipment.clearance_cost,
        total_amount: shipment.total_amount,
        amount_paid: shipment.amount_paid,
        payment_status: shipment.payment_status,
        payment_method: shipment.payment_method,
        card_last4: shipment.card_last4,
        
        // Parcel Items
        parcel_items: parcelItems,
        
        // Notes
        notes: shipment.notes,
        admin_notes: shipment.admin_notes,
        
        // Meta
        created_by_name: shipment.created_by_name,
        created_by: shipment.created_by
      }
    };

    res.json(invoice);
  } catch (err) {
    console.error('Get invoice error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const formatCurrency = (value) => {
  const amount = value != null ? Number(value) : 0;
  return Number.isFinite(amount) ? `₦${amount.toFixed(2)}` : '₦0.00';
};

const renderInvoicePdf = (res, shipment) => {
  const document = new PDFDocument({ size: 'A4', margin: 48 });
  const invoiceNumber = shipment.tracking_id || `INV-${shipment.id}`;
  const issuedAt = new Date().toLocaleDateString();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Invoice_${invoiceNumber}.pdf"`);

  document.pipe(res);

  document.fontSize(20).fillColor('#1f2937').text('Midwest Shipment Company', { align: 'left' });
  document.moveDown(0.25);
  document.fontSize(10).fillColor('#475569').text(`Invoice: ${invoiceNumber}`, { align: 'right' });
  document.text(`Date: ${issuedAt}`, { align: 'right' });

  document.moveDown(1);
  document.fontSize(12).fillColor('#0f172a').text('Sender', { underline: true });
  document.moveDown(0.25);
  document.fontSize(10).text(shipment.sender_name || 'N/A');
  if (shipment.sender_address) document.text(shipment.sender_address);
  if (shipment.sender_city || shipment.sender_state || shipment.sender_country) {
    document.text([shipment.sender_city, shipment.sender_state, shipment.sender_country].filter(Boolean).join(', '));
  }
  if (shipment.sender_phone) document.text(`Phone: ${shipment.sender_phone}`);
  if (shipment.sender_email) document.text(`Email: ${shipment.sender_email}`);

  document.moveDown(0.75);
  document.fontSize(12).text('Recipient', { underline: true });
  document.moveDown(0.25);
  document.fontSize(10).text(shipment.recipient_name || 'N/A');
  if (shipment.recipient_address) document.text(shipment.recipient_address);
  if (shipment.recipient_city || shipment.recipient_state || shipment.recipient_country) {
    document.text([shipment.recipient_city, shipment.recipient_state, shipment.recipient_country].filter(Boolean).join(', '));
  }
  if (shipment.recipient_phone) document.text(`Phone: ${shipment.recipient_phone}`);
  if (shipment.recipient_email) document.text(`Email: ${shipment.recipient_email}`);

  document.moveDown(1);
  document.fontSize(12).text('Shipment Details', { underline: true });
  document.moveDown(0.25);
  document.fontSize(10).text(`Tracking ID: ${shipment.tracking_id || 'N/A'}`);
  document.text(`Service type: ${shipment.service_type || 'Standard'}`);
  document.text(`Status: ${shipment.status || 'Pending'}`);
  if (shipment.current_location) document.text(`Current location: ${shipment.current_location}`);
  if (shipment.weight) document.text(`Weight: ${shipment.weight} ${shipment.weight_unit || ''}`);
  if (shipment.dimensions) document.text(`Dimensions: ${shipment.dimensions}`);
  if (shipment.package_type) document.text(`Package type: ${shipment.package_type}`);
  if (shipment.description) document.text(`Contents: ${shipment.description}`);

  const shippingCostValue = shipment.shipping_cost != null ? shipment.shipping_cost : shipment.shipment_cost;

  document.moveDown(1);
  document.fontSize(12).text('Charges', { underline: true });
  document.moveDown(0.25);
  document.fontSize(10).text(`Shipping fee: ${formatCurrency(shippingCostValue)}`);
  document.text(`Insurance / clearance: ${formatCurrency(shipment.clearance_cost)}`);
  document.text(`Total amount: ${formatCurrency(shipment.total_amount)}`);
  if (shipment.amount_paid != null) document.text(`Amount paid: ${formatCurrency(shipment.amount_paid)}`);
  if (shipment.payment_status) document.text(`Payment status: ${shipment.payment_status}`);
  if (shipment.payment_method) document.text(`Payment method: ${shipment.payment_method}`);
  if (shipment.notes) {
    document.moveDown(0.75);
    document.fontSize(12).text('Notes', { underline: true });
    document.moveDown(0.25);
    document.fontSize(10).text(shipment.notes);
  }

  if (shipment.parcel_items) {
    let parcelItems = [];
    try {
      parcelItems = typeof shipment.parcel_items === 'string' ? JSON.parse(shipment.parcel_items) : shipment.parcel_items;
    } catch (err) {
      parcelItems = [];
    }

    if (Array.isArray(parcelItems) && parcelItems.length > 0) {
      document.moveDown(1);
      document.fontSize(12).text('Parcel items', { underline: true });
      document.moveDown(0.25);
      parcelItems.forEach((item, index) => {
        document.fontSize(10).text(`${index + 1}. ${item.product || item.description || 'Parcel item'}`);
        if (item.qty != null) document.text(`   Qty: ${item.qty}`);
        if (item.parcel_shipping_cost != null) document.text(`   Shipping: ${formatCurrency(item.parcel_shipping_cost)}`);
        if (item.parcel_clearance_cost != null) document.text(`   Clearance: ${formatCurrency(item.parcel_clearance_cost)}`);
        if (item.parcel_total_cost != null) document.text(`   Total: ${formatCurrency(item.parcel_total_cost)}`);
        document.moveDown(0.25);
      });
    }
  }

  document.moveDown(1);
  document.fontSize(10).fillColor('#475569').text('Thank you for choosing Midwest Shipment Company.', { align: 'center' });
  document.end();
};

exports.getInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s LEFT JOIN admins a ON s.created_by = a.id 
       WHERE s.id = ?`, [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    renderInvoicePdf(res, rows[0]);
  } catch (err) {
    console.error('Get invoice PDF error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getInvoicePdfByTracking = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const [rows] = await pool.execute(
      `SELECT s.*, a.name as created_by_name 
       FROM shipments s LEFT JOIN admins a ON s.created_by = a.id 
       WHERE s.tracking_id = ?`, [trackingId.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    renderInvoicePdf(res, rows[0]);
  } catch (err) {
    console.error('Get invoice PDF by tracking error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── ADMIN: CREATE SHIPMENT ────────────────────
exports.createShipment = async (req, res) => {
  try {
    let tracking_id = String(req.body.tracking_id || '').trim().toUpperCase()
    if (tracking_id) {
      const [existing] = await pool.execute('SELECT id FROM shipments WHERE tracking_id = ?', [tracking_id])
      if (existing.length) {
        const error = new Error('Tracking ID already exists. Please generate a new one.')
        error.statusCode = 400
        throw error
      }
    } else {
      tracking_id = await generateTrackingId(pool)
    }
    const order_id = generateOrderId();
    const {
      sender_name, sender_email, sender_phone, sender_address, sender_city,
      sender_state, sender_country, sender_zip, sender_postal_code,
      recipient_name, recipient_email, recipient_phone, recipient_address,
      recipient_city, recipient_state, recipient_country, recipient_zip, recipient_postal_code,
      description, weight, weight_unit, dimensions, package_type, declared_value,
      service_type, status, priority, ship_date, estimated_delivery,
      current_location, notes, admin_notes,
      payment_status, booking_mode, payment_method, shipment_cost, clearance_cost, total_amount, amount_paid,
      parcel_quantity, parcel_items
    } = req.body;
    const normalizedStatus = normalizeStatus(status);
    assertValidStatus(normalizedStatus);

    const validatedParcelItems = validateParcelItems(parcel_items);
    const senderZip = sender_zip || sender_postal_code || null;
    const recipientZip = recipient_zip || recipient_postal_code || null;
    const numericShippingCost = shipment_cost != null ? Number(shipment_cost) : null;
    const numericClearanceCost = clearance_cost != null ? Number(clearance_cost) : null;
    const numericTotalAmount = total_amount != null ? Number(total_amount) : null;
    const numericDeclaredValue = declared_value != null ? Number(declared_value) : null;
    const numericQuantity = parcel_quantity != null ? Number(parcel_quantity) : null;
    const numericAmountPaid = amount_paid != null ? Number(amount_paid) : null;
    
    const [result] = await pool.execute(
      `INSERT INTO shipments (
        tracking_id, order_id, customer_id,
        sender_name, sender_email, sender_phone,
        sender_address, sender_city, sender_state, sender_country, sender_zip,
        recipient_name, recipient_email, recipient_phone, recipient_address,
        recipient_city, recipient_state, recipient_country, recipient_zip,
        shipment_cost, clearance_cost, total_amount, payment_status, payment_method, currency,
        parcel_quantity, parcel_product, parcel_status, parcel_description, parcel_shipping_cost, parcel_total_cost, parcel_items,
        description, weight, weight_unit, dimensions, package_type, declared_value,
        service_type, status, priority,
        ship_date, estimated_delivery, actual_delivery,
        current_location, current_status,
        notes, admin_notes, amount_paid,
        created_by, invoice_sent
      ) VALUES (${Array(51).fill('?').join(',')})`
      ,[
        tracking_id, order_id, null,
        sender_name, sender_email||null, sender_phone||null,
        sender_address, sender_city, sender_state||null, sender_country||'USA', senderZip,
        recipient_name, recipient_email||null, recipient_phone||null, recipient_address,
        recipient_city, recipient_state||null, recipient_country||'USA', recipientZip,
        numericShippingCost, numericClearanceCost, numericTotalAmount, payment_status||'pending', payment_method||'Credit Card', (req.body.currency || 'USD'),
        numericQuantity, null, null, null, null, null, validatedParcelItems ? JSON.stringify(validatedParcelItems) : null,
        description||null, weight||null, weight_unit||'lbs', dimensions||null, package_type||null, numericDeclaredValue,
        service_type||'standard', normalizedStatus, priority||'normal',
        ship_date||null, estimated_delivery||null, null,
        current_location||null, normalizedStatus,
        notes||null, admin_notes||null, numericAmountPaid,
        req.admin.id, 0
      ]
    );
    // Auto-create first tracking event
    await pool.execute(
      `INSERT INTO tracking_updates (shipment_id, status, location, remarks, created_by) 
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
    await logShipmentActivity(result.insertId, 'shipment_created', { tracking_id, status: normalizedStatus }, req.admin.id);
    
    // Send invoice email if recipient email is provided (non-blocking)
    if (recipient_email && recipient_email.trim()) {
      try {
        const shipmentData = {
          id: result.insertId,
          tracking_id,
          recipient_email: recipient_email.trim(),
          recipient_name,
          sender_name,
          sender_address,
          recipient_address,
          service_type: service_type || 'standard',
          sender_city,
          recipient_city,
          weight,
          shipping_cost: numericShippingCost,
          clearance_cost: numericClearanceCost,
          total_amount: numericTotalAmount
        };
        
        const emailSent = await sendInvoiceEmail(shipmentData);
        if (emailSent) {
          await pool.execute('UPDATE shipments SET invoice_sent = 1 WHERE id = ?', [result.insertId]);
        }
      } catch (emailErr) {
        console.warn('Email sending skipped for shipment', result.insertId, ':', emailErr.message);
        // Email failure does not affect shipment creation
      }
    }

    // Send SMS notification when a phone number is available (non-blocking)
    const phoneRecipient = recipient_phone || sender_phone;
    if (phoneRecipient) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const smsMessage = `Your shipment ${tracking_id} is created and is currently ${normalizedStatus}. Track it at ${frontendUrl}/track/${tracking_id}`;
      sendSmsNotification(phoneRecipient, smsMessage).catch((err) => console.warn('Shipment creation SMS failed:', err.message || err));
    }
    
    res.status(201).json({ success: true, message: 'Shipment created successfully.', tracking_id, order_id, id: result.insertId });
  } catch (err) {
    console.error('Create shipment error:', err.message);
    if (err.sql) console.error('Create shipment SQL:', err.sql);
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ 
      success: false, 
      message: err.statusCode ? err.message : 'Server error.',
      debug: err.message
    });
  }
};

// ── ADMIN: UPDATE SHIPMENT ────────────────────
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    
    const fields = [
      'sender_name','sender_email','sender_phone','sender_address','sender_city',
      'sender_state','sender_country','sender_zip',
      'recipient_name','recipient_email','recipient_phone','recipient_address',
      'recipient_city','recipient_state','recipient_country','recipient_zip',
      'shipment_cost','clearance_cost','total_amount','payment_status','booking_mode','payment_method','amount_paid',
      'currency','parcel_quantity','parcel_items',
      'description','weight','weight_unit','dimensions','package_type','declared_value',
      'service_type','status','priority','ship_date','estimated_delivery',
      'current_location','notes','admin_notes'
    ];
    const updates = [];
    const values = [];
    
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        if (f === 'current_location') {
          const locationValue = req.body[f] === null ? '' : String(req.body[f]).trim();
          if (locationValue === '') return;
          updates.push(`${f} = ?`);
          values.push(locationValue);
        } else if (f === 'status') {
          const normalizedStatus = normalizeStatus(req.body[f]);
          assertValidStatus(normalizedStatus);
          updates.push(`${f} = ?`);
          updates.push(`current_status = ?`);
          values.push(normalizedStatus, normalizedStatus);
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
    const currentLocationInput = req.body.current_location !== undefined && req.body.current_location !== null
      ? String(req.body.current_location).trim()
      : null;
    const currentLocationChanged = currentLocationInput !== null
      && currentLocationInput !== ''
      && currentLocationInput !== existing[0].current_location;
    const now = new Date();

    if (requestedStatus === 'delivered' && existing[0].status !== 'delivered') {
      updates.push('actual_delivery = ?');
      values.push(now);
    }

    updates.push('updated_at = ?');
    updates.push('last_updated = ?');
    values.push(now, now);
    
    if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update.' });
    
    values.push(id);
    await pool.execute(`UPDATE shipments SET ${updates.join(', ')} WHERE id = ?`, values);
    if (requestedStatus && requestedStatus !== existing[0].status) {
      await pool.execute(
        `INSERT INTO tracking_updates (shipment_id, status, location, remarks, event_time, created_by) VALUES (?,?,?,?,?,?)`,
        [
          id,
          STATUS_LABELS[requestedStatus],
          currentLocationInput || existing[0].current_location,
          STATUS_MESSAGES[requestedStatus] || 'Status updated.',
          now,
          req.admin.id
        ]
      );
    } else if (currentLocationChanged) {
      await pool.execute(
        `INSERT INTO tracking_updates (shipment_id, status, location, remarks, event_time, created_by) VALUES (?,?,?,?,?,?)`,
        [
          id,
          STATUS_LABELS[existing[0].current_status || existing[0].status],
          currentLocationInput,
          `Arrived at ${currentLocationInput}.`,
          now,
          req.admin.id
        ]
      );
    }
    const updatedLocation = currentLocationInput || existing[0].current_location;
    const updatedStatus = requestedStatus || existing[0].status;
    const customerEmail = req.body.recipient_email || existing[0].recipient_email;
    const customerPhone = req.body.recipient_phone || existing[0].recipient_phone;
    const recipientName = req.body.recipient_name || existing[0].recipient_name;
    const trackingId = existing[0].tracking_id;
    const changeSummaryParts = [];

    if (req.body.parcel_items) changeSummaryParts.push('Parcel details were updated.');
    if (req.body.status) changeSummaryParts.push(`Status changed to ${updatedStatus}.`);
    if (req.body.shipment_cost || req.body.clearance_cost || req.body.total_amount) changeSummaryParts.push('Pricing details were updated.');
    if (req.body.current_location) changeSummaryParts.push(`Current location updated to ${updatedLocation}.`);
    const changeSummary = changeSummaryParts.length > 0 ? changeSummaryParts.join(' ') : 'Your shipment details were updated.';

    if (customerEmail || customerPhone) {
      sendShipmentUpdateEmail(
        {
          id,
          tracking_id: trackingId,
          recipient_email: customerEmail,
          recipient_name: recipientName,
          current_location: updatedLocation,
          status: updatedStatus,
        },
        changeSummary
      ).catch((err) => console.warn('Shipment update email failed:', err.message || err));

      if (customerPhone) {
        sendSmsNotification(customerPhone, `Shipment ${trackingId} update: ${changeSummary} Current location: ${updatedLocation || 'Unknown'}.`).catch((err) => console.warn('Shipment update SMS failed:', err.message || err));
      }
    }

    let customerId = existing[0].customer_id;
    if (!customerId && customerEmail) {
      const [customers] = await pool.execute('SELECT id FROM customers WHERE email = ?', [String(customerEmail).trim().toLowerCase()]);
      if (customers.length) customerId = customers[0].id;
    }

    if (customerId) {
      await pool.execute(
        `INSERT INTO customer_notifications (customer_id, title, message, type)
         VALUES (?, ?, ?, ?)`,
        [customerId, 'Shipment updated', `Your shipment ${trackingId} has been updated. Current location: ${updatedLocation || 'Unknown'}.`, 'info']
      );
    }

    await logShipmentActivity(id, 'shipment_updated', { changed_fields: Object.keys(req.body), status: requestedStatus }, req.admin.id);
    
    res.json({ success: true, message: 'Shipment updated successfully.' });
  } catch (err) {
    console.error('Update shipment error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Server error.' });
  }
};

// ── ADMIN: SEND SHIPMENT SMS ──────────────────
exports.sendShipmentSms = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Shipment not found.' });
    }

    const shipment = rows[0];
    const smsDestination = req.body.phone || shipment.recipient_phone || shipment.sender_phone;
    if (!smsDestination) {
      return res.status(400).json({ success: false, message: 'No destination phone number found. Provide phone or configure recipient/sender phone.' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const message = req.body.message ||
      `Shipment ${shipment.tracking_id} for ${shipment.recipient_name || shipment.sender_name || 'customer'} is currently ${shipment.status || 'processing'} at ${shipment.current_location || 'unknown location'}. Track it at ${frontendUrl}/track/${shipment.tracking_id}`;

    const result = await sendSmsNotification(smsDestination, message);
    if (result === false) {
      return res.status(500).json({ success: false, message: 'SMS service is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.' });
    }

    await logShipmentActivity(shipment.id, 'shipment_sms_sent', { to: smsDestination, message }, req.admin.id);
    res.json({ success: true, message: 'Shipment SMS sent successfully.', to: smsDestination });
  } catch (err) {
    console.error('Send shipment SMS error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to send SMS.' });
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
    const { status, location, remarks, admin_notes, event_time } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required.' });
    const normalizedStatus = normalizeStatus(status);
    assertValidStatus(normalizedStatus);

    const [shipmentRows] = await pool.execute('SELECT id FROM shipments WHERE id = ?', [id]);
    if (!shipmentRows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });

    const [result] = await pool.execute(
      `INSERT INTO tracking_updates (shipment_id, status, location, remarks, event_time, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, STATUS_LABELS[normalizedStatus], location||null, remarks || STATUS_MESSAGES[normalizedStatus], event_time || new Date(), req.admin.id]
    );
    await pool.execute(
      'UPDATE shipments SET status = ?, current_status = ?, current_location = COALESCE(?, current_location), admin_notes = COALESCE(?, admin_notes) WHERE id = ?',
      [normalizedStatus, normalizedStatus, location || null, admin_notes || null, id]
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
