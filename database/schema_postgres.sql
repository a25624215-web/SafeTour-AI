-- =========================================================
-- SAFETOUR AI DATABASE SCHEMA (POSTGRESQL)
-- Smart Tourist Safety Monitoring & Incident Response System
-- =========================================================

-- Extension for UUID if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. USERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'tourist' CHECK (role IN ('tourist', 'admin', 'responder')),
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. EMERGENCY CONTACTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 3. LOCATIONS TABLE (Landmarks & Points of Interest)
-- =========================================================
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    safety_score NUMERIC(5, 2) DEFAULT 8.50,
    crowd_density VARCHAR(20) DEFAULT 'medium' CHECK (crowd_density IN ('low', 'medium', 'high', 'surge')),
    lighting_condition VARCHAR(20) DEFAULT 'good' CHECK (lighting_condition IN ('poor', 'moderate', 'good', 'well-lit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. GEOFENCE ZONES TABLE (Danger, Caution, Safe Zones)
-- =========================================================
CREATE TABLE IF NOT EXISTS geofence_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    zone_type VARCHAR(20) NOT NULL CHECK (zone_type IN ('restricted', 'caution', 'safe', 'high_altitude')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'CAUTION', 'HIGH', 'CRITICAL')),
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    radius_km NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
    advisory_message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. SAFETY REPORTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_reports (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    report_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================
-- 6. SOS ALERTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS sos_alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    caller_name VARCHAR(100),
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    emergency_type VARCHAR(50) DEFAULT 'General SOS',
    message TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'dispatched', 'resolved')),
    dispatched_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================
-- 7. SAFETY ALERTS / BROADCASTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS safety_alerts (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 8. TRIPS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(150) NOT NULL,
    start_location VARCHAR(150),
    start_date DATE,
    end_date DATE,
    safety_rating VARCHAR(20) DEFAULT 'SAFE',
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 9. LOCATION HISTORY TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS location_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    speed_kmh NUMERIC(5, 2),
    battery_level INT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
