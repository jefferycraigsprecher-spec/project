-- ============================================
-- Midwest Shipment Company - Database Schema
-- ============================================
CREATE DATABASE IF NOT EXISTS midwest_shipment
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE midwest_shipment;

-- ─── ADMINS TABLE ────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  email         VARCHAR(150)        NOT NULL UNIQUE,
  password_hash VARCHAR(255)        NOT NULL,
  role          ENUM('super_admin','admin') DEFAULT 'admin',
  created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(30),
  address        TEXT,
  city           VARCHAR(100),
  state          VARCHAR(100),
  country        VARCHAR(100) DEFAULT 'USA',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_email_verifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  token       VARCHAR(100) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_password_resets (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  token       VARCHAR(100) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── SHIPMENTS TABLE ─────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tracking_id       VARCHAR(20)  NOT NULL UNIQUE,
  order_id          VARCHAR(50) DEFAULT NULL,
  customer_id       INT UNSIGNED,
  
  -- Sender
  sender_name       VARCHAR(100) NOT NULL,
  sender_email      VARCHAR(150),
  sender_phone      VARCHAR(30),
  sender_address    TEXT         NOT NULL,
  sender_city       VARCHAR(100) NOT NULL,
  sender_state      VARCHAR(100),
  sender_country    VARCHAR(100) NOT NULL DEFAULT 'USA',
  sender_zip        VARCHAR(20),
  
  -- Recipient
  recipient_name    VARCHAR(100) NOT NULL,
  recipient_email   VARCHAR(150),
  recipient_phone   VARCHAR(30),
  recipient_address TEXT         NOT NULL,
  recipient_city    VARCHAR(100) NOT NULL,
  recipient_state   VARCHAR(100),
  recipient_country VARCHAR(100) NOT NULL DEFAULT 'USA',
  recipient_zip     VARCHAR(20),
  
  shipment_cost     DECIMAL(12,2),
  clearance_cost    DECIMAL(12,2),
  total_amount      DECIMAL(12,2),
  payment_status    ENUM('pending','paid','partially_paid','refunded','to_pay') DEFAULT 'pending',
  currency          VARCHAR(10) DEFAULT 'USD',
  parcel_quantity   INT DEFAULT 1,
  parcel_product    VARCHAR(255),
  parcel_status     VARCHAR(100),
  parcel_description TEXT,
  parcel_shipping_cost DECIMAL(12,2),
  parcel_total_cost DECIMAL(12,2),
  parcel_items      JSON,
  
  -- Package
  description       TEXT,
  weight            DECIMAL(10,2),
  weight_unit       ENUM('kg','lbs') DEFAULT 'lbs',
  dimensions        VARCHAR(100),
  package_type      VARCHAR(80),
  declared_value    DECIMAL(12,2),
  
  -- Logistics
  service_type      ENUM('standard','express','overnight','freight') DEFAULT 'standard',
  status            ENUM(
    'processing',
    'picked_up',
    'in_transit',
    'customs_clearance',
    'arrived_at_facility',
    'out_for_delivery',
    'delivered',
    'failed_delivery'
  ) DEFAULT 'processing',
  priority          ENUM('low','normal','high','urgent') DEFAULT 'normal',
  
  -- Dates
  ship_date         DATE,
  estimated_delivery DATE,
  actual_delivery   DATETIME,
  
  -- Location
  current_location  VARCHAR(255),
  
  -- Notes
  notes             TEXT,
  admin_notes       TEXT,
  
  -- Meta
  created_by        INT UNSIGNED,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── TRACKING EVENTS TABLE ───────────────────
CREATE TABLE IF NOT EXISTS tracking_events (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id   INT UNSIGNED        NOT NULL,
  status        VARCHAR(100)        NOT NULL,
  location      VARCHAR(255),
  description   TEXT,
  event_time    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by    INT UNSIGNED,
  created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by)  REFERENCES admins(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shipment_activity_logs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id   INT UNSIGNED NOT NULL,
  action        VARCHAR(100) NOT NULL,
  details       JSON,
  created_by    INT UNSIGNED,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by)  REFERENCES admins(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_delivery_documents (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT UNSIGNED NOT NULL,
  shipment_id   INT UNSIGNED NOT NULL,
  document_type VARCHAR(80) DEFAULT 'delivery_document',
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_size     INT UNSIGNED,
  mime_type     VARCHAR(100),
  uploaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  title       VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  type        ENUM('info','success','warning','error') DEFAULT 'info',
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_support_tickets (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id     INT UNSIGNED NULL,
  customer_name   VARCHAR(120) NOT NULL,
  customer_email  VARCHAR(150) NOT NULL,
  customer_phone  VARCHAR(30),
  shipment_id     INT UNSIGNED NULL,
  subject         VARCHAR(180),
  message         TEXT NOT NULL,
  status          ENUM('open','in_review','closed') DEFAULT 'open',
  priority        ENUM('low','normal','high','urgent') DEFAULT 'normal',
  channel         VARCHAR(40) DEFAULT 'web',
  issue_type      VARCHAR(80) DEFAULT 'general_inquiry',
  assigned_to     INT UNSIGNED NULL,
  last_reply_at   DATETIME NULL,
  resolution_notes TEXT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id    INT UNSIGNED NOT NULL,
  sender_type  ENUM('customer','agent','system') NOT NULL DEFAULT 'customer',
  sender_id    INT UNSIGNED NULL,
  message      TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read      BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ticket_id) REFERENCES customer_support_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── SHIPMENT MEDIA TABLE ────────────────────
CREATE TABLE IF NOT EXISTS shipment_media (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id   INT UNSIGNED        NOT NULL,
  media_type    ENUM('photo','video') NOT NULL,
  filename      VARCHAR(255)        NOT NULL,
  original_name VARCHAR(255),
  file_size     INT UNSIGNED,
  mime_type     VARCHAR(100),
  caption       VARCHAR(255),
  uploaded_by   INT UNSIGNED,
  uploaded_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES admins(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── CONTACT MESSAGES TABLE ──────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(30),
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── INDEXES ─────────────────────────────────
CREATE INDEX idx_shipments_tracking_id  ON shipments(tracking_id);
CREATE INDEX idx_shipments_customer     ON shipments(customer_id);
CREATE INDEX idx_shipments_status       ON shipments(status);
CREATE INDEX idx_shipments_order_id     ON shipments(order_id);
CREATE INDEX idx_tracking_events_ship   ON tracking_events(shipment_id);
CREATE INDEX idx_activity_logs_ship     ON shipment_activity_logs(shipment_id);
CREATE INDEX idx_media_shipment         ON shipment_media(shipment_id);
CREATE INDEX idx_customer_docs_customer ON customer_delivery_documents(customer_id);
CREATE INDEX idx_customer_notifs        ON customer_notifications(customer_id, is_read);
CREATE INDEX idx_support_tickets_status ON customer_support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON customer_support_tickets(priority);
CREATE INDEX idx_support_tickets_assigned ON customer_support_tickets(assigned_to);
CREATE INDEX idx_support_messages_ticket ON support_ticket_messages(ticket_id, created_at);

-- ─── DEFAULT ADMIN (password: Admin@123456) ──
INSERT INTO admins (name, email, password_hash, role) VALUES
('Super Admin', 'admin@midwestshipment.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5bO2yJVy5y', 'super_admin')
ON DUPLICATE KEY UPDATE name=name;
