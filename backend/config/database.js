const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_CLIENT = (process.env.DB_CLIENT || 'sqlite').toLowerCase();
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? ''
};
const databaseName = process.env.DB_NAME || 'midwest_shipment';

const pool = {
  execute: async () => {
    throw new Error('Database has not been initialized yet.');
  },
  query: async () => {
    throw new Error('Database has not been initialized yet.');
  },
  end: async () => {}
};

const configureSqlitePool = async (database) => {
  let sqliteDb = database;

  pool.execute = async (sql, params = []) => {
    const trimmed = String(sql).trim();
    const firstToken = trimmed.split(' ')[0].toUpperCase();

    if (firstToken === 'SELECT' || firstToken === 'PRAGMA') {
      const rows = await sqliteDb.all(sql, params);
      return [rows];
    }

    const result = await sqliteDb.run(sql, params);
    return [{ insertId: result.lastID, affectedRows: result.changes, changes: result.changes }];
  };

  pool.query = async (sql, params = []) => {
    return pool.execute(sql, params);
  };

  pool.end = async () => {
    await sqliteDb.close();
  };
};

const loadAndRunSqliteSchema = async (database) => {
  const schemaPath = path.join(__dirname, 'schema-sqlite.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const statements = schemaSql
    .split(/;\s*$/m)
    .map((stmt) => stmt.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await database.exec(statement);
  }
};

const seedSqliteAdmin = async (database) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@midwestshipment.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await database.run(`
    INSERT INTO admins (name, email, password_hash, role)
    VALUES ('Super Admin', ?, ?, 'super_admin')
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      password_hash = excluded.password_hash,
      role = excluded.role
  `, [adminEmail, adminPasswordHash]);

  console.log('✅ SQLite admin user seeded or updated');
};

const initializeSqlite = async () => {
  const sqlite3 = require('sqlite3').verbose();
  const sqlite = require('sqlite');
  const database = await sqlite.open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await database.run('PRAGMA foreign_keys = ON');
  await loadAndRunSqliteSchema(database);
  await seedSqliteAdmin(database);
  await configureSqlitePool(database);
};

const initializeMySql = async () => {
  const mysql = require('mysql2/promise');
  const poolInstance = mysql.createPool({
    ...dbConfig,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  pool.execute = poolInstance.execute.bind(poolInstance);
  pool.query = poolInstance.query.bind(poolInstance);
  pool.end = poolInstance.end.bind(poolInstance);

  const connection = await mysql.createConnection({ ...dbConfig, multipleStatements: true });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE ${databaseName}`);

    const [tables] = await connection.query("SHOW TABLES LIKE 'shipments'");
    if (!tables.length) {
      const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      await connection.query(schemaSql);
    }

    const requiredColumns = [
      { name: 'order_id', definition: 'VARCHAR(50) DEFAULT NULL' },
      { name: 'shipment_cost', definition: 'DECIMAL(12,2)' },
      { name: 'currency', definition: "VARCHAR(10) DEFAULT 'USD'" },
      { name: 'parcel_quantity', definition: 'INT DEFAULT 1' },
      { name: 'parcel_product', definition: 'VARCHAR(255)' },
      { name: 'parcel_status', definition: 'VARCHAR(100)' },
      { name: 'parcel_description', definition: 'TEXT' },
      { name: 'parcel_shipping_cost', definition: 'DECIMAL(12,2)' },
      { name: 'parcel_total_cost', definition: 'DECIMAL(12,2)' },
      { name: 'current_status', definition: "VARCHAR(100) DEFAULT 'processing'" },
      { name: 'invoice_sent', definition: 'TINYINT DEFAULT 0' },
      { name: 'payment_method', definition: "VARCHAR(100) DEFAULT 'Credit Card'" },
      { name: 'amount_paid', definition: 'DECIMAL(12,2) DEFAULT 0' }
    ];

    for (const column of requiredColumns) {
      const [existing] = await connection.query('SHOW COLUMNS FROM shipments LIKE ?', [column.name]);
      if (!existing.length) {
        await connection.query(`ALTER TABLE shipments ADD COLUMN ${column.name} ${column.definition}`);
      }
    }

    const requiredIndexes = [
      { name: 'idx_shipments_order_id', definition: 'ON shipments(order_id)' },
      { name: 'idx_invoice_sent', definition: 'ON shipments(invoice_sent)' }
    ];

    for (const idx of requiredIndexes) {
      const [existingIndex] = await connection.query('SHOW INDEX FROM shipments WHERE Key_name = ?', [idx.name]);
      if (!existingIndex.length) {
        await connection.query(`CREATE INDEX ${idx.name} ${idx.definition}`);
      }
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin','admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@midwestshipment.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

    await connection.query(`
      INSERT INTO admins (name, email, password_hash, role)
      VALUES ('Super Admin', ?, ?, 'super_admin')
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password_hash = VALUES(password_hash),
        role = VALUES(role)
    `, [adminEmail, adminPasswordHash]);

    console.log('✅ Admin authentication schema initialized');
  } finally {
    await connection.end();
  }
};

const initializeDatabase = async () => {
  if (DB_CLIENT === 'sqlite') {
    await initializeSqlite();
    console.log(`✅ SQLite database initialized at ${DB_PATH}`);
    return;
  }

  await initializeMySql();
  console.log('✅ MySQL database pool initialized');
};

const testConnection = async () => {
  try {
    if (DB_CLIENT === 'sqlite') {
      const [rows] = await pool.execute('SELECT 1 as result');
      if (!rows) throw new Error('SQLite test query failed');
      console.log('✅ SQLite database connected successfully');
      return;
    }

    const [rows] = await pool.execute('SELECT 1 as result');
    if (!rows) throw new Error('MySQL test query failed');
    console.log('✅ MySQL database connected successfully');
  } catch (error) {
    const details = error?.message || error || 'Unknown database error';
    console.error('❌ Database connection failed:', details);
    process.exit(1);
  }
};

module.exports = { pool, testConnection, initializeDatabase };