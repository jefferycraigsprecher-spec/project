const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL || 'devadmin@midwestshipment.com';
  const name = process.env.SEED_ADMIN_NAME || 'Dev Admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'DevAdmin@123';
  const role = process.env.SEED_ADMIN_ROLE || 'admin';

  const hash = await bcrypt.hash(password, 12);

  try {
    const [result] = await pool.execute(
      `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role)`,
      [name, email, hash, role]
    );

    console.log('Seed admin completed:', { email, name, role });
    console.log('Use password:', password);
  } catch (err) {
    console.error('Seed admin error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
