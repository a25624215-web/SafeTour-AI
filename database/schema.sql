-- =========================================================
-- SAFETOUR AI DATABASE SCHEMA
-- Smart Tourist Safety Monitoring & Incident Response System
-- =========================================================

-- =========================================================
-- 1. USERS TABLE
-- Tourist, Authority and Admin accounts
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'authority', 'admin', 'responder')),
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. EMERGENCY CONTACTS TABLE
-- Police, Hospital, Ambulance & Family Contacts
-- =========================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NULL,
    name VARCHAR(150) NOT NULL,
    contact_type VARCHAR(50) DEFAULT 'Family',
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_primary BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- 3. LOCATIONS & TOURIST PLACES
-- Tourist spots & safety scores
-- =========================================================
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    safety_score DECIMAL(5, 2) DEFAULT 8.50,
    crowd_density VARCHAR(20) DEFAULT 'medium' CHECK (crowd_density IN ('low', 'medium', 'high', 'surge')),
    lighting_condition VARCHAR(20) DEFAULT 'good' CHECK (lighting_condition IN ('poor', 'moderate', 'good', 'well-lit')),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. GEOFENCE ZONES
-- Restricted, danger & monitored areas
-- =========================================================
CREATE TABLE IF NOT EXISTS geofence_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    zone_type VARCHAR(30) NOT NULL DEFAULT 'danger' CHECK (zone_type IN ('danger', 'restricted', 'caution', 'safe', 'high_altitude')),
    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('LOW', 'CAUTION', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'critical')),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    radius_km DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
    radius_meters DECIMAL(10, 2) DEFAULT 1000.0,
    advisory_message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. SOS ALERTS & INCIDENTS
-- Real-time distress panic events
-- =========================================================
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    caller_name VARCHAR(100),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    emergency_type VARCHAR(50) DEFAULT 'General SOS',
    message TEXT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'dispatched', 'in_progress', 'resolved', 'cancelled')),
    dispatched_to VARCHAR(255),
    assigned_authority_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_authority_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================
-- 6. SAFETY REPORTS
-- Crowdsourced incident logs
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    location_id INTEGER,
    report_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =========================================================
-- 7. SAFETY ALERTS & NOTIFICATIONS
-- Tourist and Authority advisories
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER,
    user_id INTEGER,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    alert_type VARCHAR(100) DEFAULT 'General Advisory',
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('info', 'warning', 'low', 'medium', 'high', 'critical', 'danger')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    valid_until TIMESTAMP,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- 8. TRIPS & ITINERARIES
-- Tourist travel plans
-- =========================================================
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination VARCHAR(150) NOT NULL,
    start_location VARCHAR(150),
    start_date DATE,
    end_date DATE,
    safety_rating VARCHAR(20) DEFAULT 'SAFE',
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- 9. LOCATION HISTORY & TELEMETRY
-- Live GPS tracking breadcrumbs
-- =========================================================
CREATE TABLE IF NOT EXISTS location_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    speed_kmh DECIMAL(5, 2),
    battery_level INTEGER,
    accuracy DECIMAL(10, 2),
    location_source VARCHAR(30) DEFAULT 'gps',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_reports_user ON safety_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_reports_coords ON safety_reports (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_sos_user ON sos_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_sos_status ON sos_alerts (status);
CREATE INDEX IF NOT EXISTS idx_zones_coords ON geofence_zones (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_zones_active ON geofence_zones (is_active);
CREATE INDEX IF NOT EXISTS idx_location_history_user ON location_history (user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips (user_id);
