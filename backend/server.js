const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { testConnection, initializeDatabase } = require('./config/database');
const server = http.createServer(app);

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
console.log('Allowed CORS origins:', allowedOrigins.join(', '));

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

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // reuse same allowed origin logic from app by reading envs
      const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL;
      const origins = ['http://localhost:3000', 'http://localhost:3001'];
      if (rawOrigins) {
        rawOrigins.split(',').map((v) => v.trim()).filter(Boolean).forEach((o) => origins.push(o));
      }
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

global.supportIO = io;
const PORT = process.env.PORT || 5000;

// Socket.IO connection handling (kept in server context)
io.on('connection', (socket) => {
  socket.on('support:join', ({ ticketId }) => {
    if (ticketId) socket.join(`support-ticket-${ticketId}`);
  });

  socket.on('support:leave', ({ ticketId }) => {
    if (ticketId) socket.leave(`support-ticket-${ticketId}`);
  });
});

// ── START ─────────────────────────────────────
const start = async () => {
  await initializeDatabase();
  await testConnection();

  server.listen(PORT);
};

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  if (error.code === 'EACCES') {
    console.error(`${bind} requires elevated privileges.`);
    process.exit(1);
  }
  if (error.code === 'EADDRINUSE') {
    console.error(`${bind} is already in use. Set PORT to an available port or stop the process using it.`);
    process.exit(1);
  }
  throw error;
});

server.on('listening', () => {
  console.log(`🚀 Midwest Shipment API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

start();
