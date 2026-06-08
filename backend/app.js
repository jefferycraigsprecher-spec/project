const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

const getAllowedOrigins = () => {
  const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL;
  const origins = new Set(['http://localhost:3000', 'http://localhost:3001']);

  if (rawOrigins) {
    rawOrigins
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((origin) => origins.add(origin));
  }

  return Array.from(origins);
};

const allowedOrigins = getAllowedOrigins();

const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error(`Origin ${origin} not allowed by CORS`));
};

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/support',   require('./routes/support'));
app.use('/barcodes', require('./routes/barcodes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Midwest Shipment API is running', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

module.exports = app;
