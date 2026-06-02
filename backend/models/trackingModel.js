const { v4: uuidv4 } = require('uuid');

const generateTrackingId = async (pool) => {
  let trackingId;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const chars = uuidv4().replace(/-/g, '').toUpperCase().substring(0, 10);
    trackingId = `MSC-${chars}`;
    
    const [rows] = await pool.execute(
      'SELECT id FROM shipments WHERE tracking_id = ?', [trackingId]
    );
    
    if (!rows.length) isUnique = true;
    attempts++;
  }

  if (!isUnique) throw new Error('Could not generate unique tracking ID');
  return trackingId;
};

const TRACKING_STATUSES = [
  'pending',
  'shipment_created',
  'processing',
  'picked_up',
  'in_transit',
  'at_sorting_facility',
  'customs_clearance',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
  'on_hold',
  'returned',
];

const STATUS_LABELS = {
  pending: 'Pending',
  shipment_created: 'Shipment Created',
  processing: 'Processing',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_sorting_facility: 'At Sorting Facility',
  customs_clearance: 'Custom Clearance',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed_delivery: 'Failed Delivery',
  on_hold: 'On Hold',
  returned: 'Returned',
};

const STATUS_MESSAGES = {
  pending: 'Shipment is pending confirmation.',
  shipment_created: 'Shipment record has been created and is awaiting pickup.',
  processing: 'Shipment is being processed.',
  picked_up: 'Shipment has been picked up.',
  in_transit: 'Shipment is in transit.',
  at_sorting_facility: 'Shipment has arrived at a sorting facility.',
  customs_clearance: 'Shipment is undergoing custom clearance.',
  out_for_delivery: 'Shipment is out for delivery.',
  delivered: 'Shipment has been delivered successfully.',
  failed_delivery: 'Delivery attempt failed. A follow-up action is required.',
  on_hold: 'Shipment is currently on hold.',
  returned: 'Shipment is being returned to sender.',
};

module.exports = { generateTrackingId, TRACKING_STATUSES, STATUS_LABELS, STATUS_MESSAGES };
