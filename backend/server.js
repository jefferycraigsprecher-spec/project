const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { testConnection, initializeDatabase } = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowed = [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'];
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

global.supportIO = io;
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'];
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── BODY PARSING ──────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── STATIC UPLOADS ────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── SOCKET.IO ─────────────────────────────────
io.on('connection', (socket) => {
  socket.on('support:join', ({ ticketId }) => {
    if (ticketId) socket.join(`support-ticket-${ticketId}`);
  });

  socket.on('support:leave', ({ ticketId }) => {
    if (ticketId) socket.leave(`support-ticket-${ticketId}`);
  });
});

// ── ROUTES ────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/support',   require('./routes/support'));
app.use('/barcodes', require('./routes/barcodes'));

// ── HEALTH CHECK ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Midwest Shipment API is running', timestamp: new Date() });
});

// ── 404 ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── ERROR HANDLER ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ── START ─────────────────────────────────────
const start = async () => {
  await initializeDatabase();
  await testConnection();

  server.listen(PORT, () => {
    console.log(`🚀 Midwest Shipment API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start();
