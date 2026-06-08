const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('Twilio client could not be initialized:', err.message || err);
  }
}

// Initialize email transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn('Email service not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env');
}

const sendInvoiceEmail = async (shipment) => {
  if (!transporter) {
    console.warn('Email service not configured. Invoice email not sent.');
    return false;
  }

  if (!shipment || !shipment.recipient_email) {
    console.warn('Recipient email not provided. Invoice email not sent.');
    return false;
  }

  try {
    // Generate invoice data
    const invoice = {
      invoice_number: shipment.tracking_id || `INV-${shipment.id}`,
      date: new Date().toLocaleDateString(),
      sender_name: shipment.sender_name || '',
      sender_address: shipment.sender_address || '',
      receiver_name: shipment.recipient_name || '',
      receiver_address: shipment.recipient_address || '',
      tracking_number: shipment.tracking_id || '',
      service_type: shipment.service_type || 'standard',
      origin: shipment.sender_city || shipment.sender_address || '',
      destination: shipment.recipient_city || shipment.recipient_address || '',
      weight: shipment.weight || '',
      base_fee: (shipment.shipment_cost != null) ? Number(shipment.shipment_cost).toFixed(2) : '0.00',
      insurance: (shipment.clearance_cost != null) ? Number(shipment.clearance_cost).toFixed(2) : '0.00',
      fuel_charge: (shipment.fuel_charge != null) ? Number(shipment.fuel_charge).toFixed(2) : '0.00',
      total_cost: (shipment.total_amount != null) ? Number(shipment.total_amount).toFixed(2) : '0.00'
    };

    // Load and render template
    const tplPath = path.join(__dirname, '..', 'templates', 'invoice_template.html');
    let htmlContent = fs.readFileSync(tplPath, 'utf8');
    htmlContent = htmlContent.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => invoice[key] ?? '');

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@midwestshipment.com',
      to: shipment.recipient_email,
      subject: `Invoice for Shipment ${shipment.tracking_id}`,
      html: htmlContent,
    });

    console.log('Invoice email sent to', shipment.recipient_email, 'Message ID:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending invoice email:', err.message);
    return false;
  }
};

const sendShipmentUpdateEmail = async (shipment, trackingUpdate) => {
  if (!transporter) {
    console.warn('Email service not configured. Update email not sent.');
    return false;
  }

  if (!shipment || !shipment.recipient_email) {
    console.warn('Recipient email not provided. Update email not sent.');
    return false;
  }

  try {
    const status = trackingUpdate.status || 'Update';
    const location = trackingUpdate.location || 'Not specified';
    const description = trackingUpdate.description || trackingUpdate.remarks || 'Your shipment has been updated.';
    const eventTime = trackingUpdate.event_time ? new Date(trackingUpdate.event_time).toLocaleString() : new Date().toLocaleString();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #003366; color: #fff; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { padding: 20px; }
          .status-badge { display: inline-block; background-color: #007bff; color: #fff; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
          .details { background-color: #f5f5f5; padding: 15px; border-radius: 3px; margin: 15px 0; }
          .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Shipment Update</h2>
          </div>
          <div class="content">
            <p>Hello ${shipment.recipient_name || 'Valued Customer'},</p>
            <p>Your shipment <strong>${shipment.tracking_id}</strong> has been updated:</p>
            
            <div class="details">
              <p><strong>Tracking Number:</strong> ${shipment.tracking_id}</p>
              <p><strong>Status:</strong> <span class="status-badge">${status}</span></p>
              <p><strong>Current Location:</strong> ${location}</p>
              <p><strong>Update Time:</strong> ${eventTime}</p>
              <p><strong>Details:</strong> ${description}</p>
            </div>

            <p>You can track your shipment anytime at: <strong><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track?id=${shipment.tracking_id}">Track Now</a></strong></p>
            
            <p>Thank you for choosing Midwest Shipment Company!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Midwest Shipment Company. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@midwestshipment.com',
      to: shipment.recipient_email,
      subject: `Shipment Update: ${shipment.tracking_id} - ${status}`,
      html: htmlContent,
    });

    console.log('Shipment update email sent to', shipment.recipient_email, 'Message ID:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending shipment update email:', err.message);
    return false;
  }
};

const sendSmsNotification = async (to, message) => {
  if (!to || !message) {
    throw new Error('SMS destination phone number and message are required.');
  }

  const normalizedTo = String(to).trim().replace(/[^+0-9]/g, '');
  if (!normalizedTo) {
    throw new Error('Invalid destination phone number.');
  }

  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.warn('SMS not sent: Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
    return false;
  }

  const payload = {
    body: String(message),
    from: TWILIO_PHONE_NUMBER,
    to: normalizedTo,
  };

  const response = await twilioClient.messages.create(payload);
  console.log('SMS sent:', response.sid, 'to', normalizedTo);
  return response;
};

module.exports = {
  sendInvoiceEmail,
  sendShipmentUpdateEmail,
  sendSmsNotification,
};