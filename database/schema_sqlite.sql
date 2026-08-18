-- =========================================================
-- SAFETOUR AI DATABASE SCHEMA (SQLITE)
-- Smart Tourist Safety Monitoring & Incident Response System
-- =========================================================

PRAGMA foreign_keys = ON;

-- =========================================================
-- 1. USERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'tourist' CHECK (role IN ('tourist', 'admin', 'responder')),
    profile_image TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. EMERGENCY CONTACTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT,
    is_primary INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- 3. LOCATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    safety_score REAL DEFAULT 8.50,
    crowd_density TEXT DEFAULT 'medium' CHECK (crowd_density IN ('low', 'medium', 'high', 'surge')),
    lighting_condition TEXT DEFAULT 'good' CHECK (lighting_condition IN ('poor', 'moderate', 'good', 'well-lit')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. GEOFENCE ZONES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS geofence_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    zone_type TEXT NOT NULL CHECK (zone_type IN ('restricted', 'caution', 'safe', 'high_altitude')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'CAUTION', 'HIGH', 'CRITICAL')),
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    radius_km REAL NOT NULL DEFAULT 1.0,
    advisory_message TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. SAFETY REPORTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    location_id INTEGER,
    report_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =========================================================
-- 6. SOS ALERTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    caller_name TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    emergency_type TEXT DEFAULT 'General SOS',
    message TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'dispatched', 'resolved')),
    dispatched_to TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================
-- 7. SAFETY ALERTS / ADVISORIES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =========================================================
-- 8. TRIPS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    start_location TEXT,
    start_date TEXT,
    end_date TEXT,
    safety_rating TEXT DEFAULT 'SAFE',
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================
-- 9. LOCATION HISTORY TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS location_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    speed_kmh REAL,
    battery_level INTEGER,
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
CREATE INDEX IF NOT EXISTS idx_location_history_user ON location_history (user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips (user_id);
