const { pool, initializeDatabase } = require('../config/database');
const { generateTrackingId } = require('../models/trackingModel');

async function createSample() {
  try {
    await initializeDatabase();
    const trackingId = await generateTrackingId(pool);
    const [res] = await pool.execute(
      `INSERT INTO shipments (tracking_id, sender_name, sender_email, sender_phone, sender_address, sender_city, sender_state, sender_country, recipient_name, recipient_email, recipient_phone, recipient_address, recipient_city, recipient_state, recipient_country, description, weight, weight_unit, service_type, status, current_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trackingId,
        'Sample Sender',
        'sender@example.com',
        '+1 555 123 4567',
        '123 Test Lane',
        'Columbus',
        'Ohio',
        'USA',
        'Sample Recipient',
        'recipient@example.com',
        '+1 555 987 6543',
        '456 Delivery Drive',
        'Cleveland',
        'Ohio',
        'USA',
        'Sample test package',
        2.5,
        'lbs',
        'standard',
        'processing',
        'Columbus, Ohio'
      ]
    );

    await pool.execute(
      `INSERT INTO tracking_updates (shipment_id, status, location, remarks, created_by) VALUES (?, ?, ?, ?, ?)`,
      [res.insertId, 'Processing', 'Columbus, Ohio', 'Shipment created for testing', null]
    );

    console.log('Sample shipment created:');
    console.log(`  id: ${res.insertId}`);
    console.log(`  tracking_id: ${trackingId}`);
    console.log(`  recipient_email: recipient@example.com`);
  } catch (err) {
    console.error('Error creating sample shipment:', err);
  } finally {
    await pool.end();
  }
}

createSample();
