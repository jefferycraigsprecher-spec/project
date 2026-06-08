const router = require('express').Router();
const ctrl = require('../controllers/shipmentController');
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

// Public
router.get('/track/:trackingId', ctrl.trackShipment);
router.get('/tracking/:trackingId', ctrl.getShipmentByTracking);
router.get('/tracking/:trackingId/invoice/pdf', ctrl.getInvoicePdfByTracking);

// Protected
router.use(authenticateAdmin);
router.get('/stats/dashboard', ctrl.getDashboardStats);
router.get('/', ctrl.getShipments);
router.get('/:id', ctrl.getShipment);
router.get('/:id/invoice', ctrl.getInvoice);
router.get('/:id/invoice/pdf', ctrl.getInvoicePdf);
// Render HTML invoice using the template (protected)
router.get('/:id/invoice/html', async (req, res) => {
	try {
		const id = req.params.id;
		const [rows] = await pool.execute('SELECT * FROM shipments WHERE id = ?', [id]);
		if (!rows || rows.length === 0) return res.status(404).send('Shipment not found');
		const s = rows[0];

		const invoice = {
			invoice_number: s.tracking_id || `INV-${s.id}`,
			date: new Date().toLocaleDateString(),
			sender_name: s.sender_name || '',
			sender_address: s.sender_address || '',
			receiver_name: s.recipient_name || '',
			receiver_address: s.recipient_address || '',
			tracking_number: s.tracking_id || '',
			service_type: s.service_type || 'standard',
			origin: s.sender_city || s.sender_address || '',
			destination: s.recipient_city || s.recipient_address || '',
			weight: s.weight || '',
			base_fee: (s.shipment_cost != null) ? Number(s.shipment_cost).toFixed(2) : '0.00',
			insurance: (s.clearance_cost != null) ? Number(s.clearance_cost).toFixed(2) : '0.00',
			fuel_charge: (s.fuel_charge != null) ? Number(s.fuel_charge).toFixed(2) : '0.00',
			total_cost: (s.total_amount != null) ? Number(s.total_amount).toFixed(2) : '0.00'
		};

		const tplPath = path.join(__dirname, '..', 'templates', 'invoice_template.html');
		let tpl = fs.readFileSync(tplPath, 'utf8');
		tpl = tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => invoice[key] ?? '');
		res.type('html').send(tpl);
	} catch (err) {
		console.error('Render invoice HTML error:', err);
		res.status(500).send('Server error');
	}
});
router.post('/', ctrl.createShipment);
router.put('/:id', ctrl.updateShipment);
router.delete('/:id', ctrl.deleteShipment);
router.post('/:id/events', ctrl.addTrackingEvent);
router.post('/:id/send-sms', ctrl.sendShipmentSms);
router.post('/:id/media', upload.single('file'), ctrl.uploadMedia);
router.delete('/:id/media/:mediaId', ctrl.deleteMedia);

module.exports = router;