const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const serverless = require('serverless-http');
const app = require('../app');
const { initializeDatabase, testConnection } = require('../config/database');

let initialized = false;
const ensureInitialized = async () => {
  if (initialized) return;
  await initializeDatabase();
  await testConnection();
  initialized = true;
};

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await ensureInitialized();
    return handler(req, res);
  } catch (err) {
    console.error('Serverless init error:', err);
    res.statusCode = 500;
    res.end('Server initialization error');
  }
};
