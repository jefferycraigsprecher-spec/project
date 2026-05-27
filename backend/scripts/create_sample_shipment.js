const { pool } = require('../config/database');
const { generateTrackingId } = require('../models/trackingModel');

async function createSample() {
  try {
    const trackingId = await generateTrackingId(pool);
    const [res] = await pool.execute(
      `INSERT INTO shipments (tracking_id, sender_name, sender_email, recipient_name, recipient_email, description, weight, weight_unit, service_type, status, current_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [trackingId, 'Sample Sender', 'sender@example.com', 'Sample Recipient', 'recipient@example.com', 'Sample test package', 2.5, 'lbs', 'standard', 'processing', 'Columbus, Ohio']
    );

    await pool.execute(
      `INSERT INTO tracking_events (shipment_id, status, location, description, created_by) VALUES (?, ?, ?, ?, ?)`,
      [res.insertId, 'Processing', 'Columbus, Ohio', 'Shipment created for testing', null]
    );

    console.log('Sample shipment created:', { id: res.insertId, tracking_id: trackingId });
  } catch (err) {
    console.error('Error creating sample shipment:', err);
  } finally {
    await pool.end();
  }
}

createSample();
