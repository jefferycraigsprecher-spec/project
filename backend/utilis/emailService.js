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

const sendInvoiceEmail = async () => {
  console.log('Placeholder: Invoice email sent!');
};

const sendShipmentUpdateEmail = async () => {
  console.log('Placeholder: Shipment update email sent!');
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