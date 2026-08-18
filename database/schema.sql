-- =========================================================
-- SAFETOUR AI DATABASE SCHEMA (MICROSOFT SQL SERVER)
-- Smart Tourist Safety Monitoring & Incident Response System
-- =========================================================

-- DATABASE CREATION
IF DB_ID('safetour_ai') IS NULL
BEGIN
    CREATE DATABASE safetour_ai;
END
GO

USE safetour_ai;
GO

-- =========================================================
-- 1. USERS TABLE
-- =========================================================
IF OBJECT_ID('users', 'U') IS NULL
CREATE TABLE users (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) DEFAULT 'tourist' CHECK (role IN ('tourist', 'admin', 'responder')),
    profile_image VARCHAR(255) NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-- =========================================================
-- 2. EMERGENCY CONTACTS TABLE
-- =========================================================
IF OBJECT_ID('emergency_contacts', 'U') IS NULL
CREATE TABLE emergency_contacts (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50) NULL,
    is_primary BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_emergency_contacts_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
GO

-- =========================================================
-- 3. LOCATIONS TABLE (Tourist Destinations & Landmarks)
-- =========================================================
IF OBJECT_ID('locations', 'U') IS NULL
CREATE TABLE locations (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(MAX) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    safety_score DECIMAL(5, 2) DEFAULT 8.50,
    crowd_density VARCHAR(20) DEFAULT 'medium' CHECK (crowd_density IN ('low', 'medium', 'high', 'surge')),
    lighting_condition VARCHAR(20) DEFAULT 'good' CHECK (lighting_condition IN ('poor', 'moderate', 'good', 'well-lit')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- =========================================================
-- 4. GEOFENCE ZONES TABLE (Danger, Caution, Safe Zones)
-- =========================================================
IF OBJECT_ID('geofence_zones', 'U') IS NULL
CREATE TABLE geofence_zones (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(MAX) NULL,
    zone_type VARCHAR(20) NOT NULL CHECK (zone_type IN ('restricted', 'caution', 'safe', 'high_altitude')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'CAUTION', 'HIGH', 'CRITICAL')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_km DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
    advisory_message VARCHAR(MAX) NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- =========================================================
-- 5. SAFETY REPORTS TABLE (Crowdsourced Incident Reports)
-- =========================================================
IF OBJECT_ID('safety_reports', 'U') IS NULL
CREATE TABLE safety_reports (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NULL,
    location_id INT NULL,
    report_type VARCHAR(100) NOT NULL, -- e.g., 'Harassment', 'Theft', 'Landslide', 'Poor Lighting', 'Scam'
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description VARCHAR(MAX) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'dismissed')),
    created_at DATETIME DEFAULT GETDATE(),
    resolved_at DATETIME NULL,
    CONSTRAINT FK_safety_reports_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT FK_safety_reports_locations FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL
);
GO

-- =========================================================
-- 6. SOS ALERTS TABLE (Emergency Panic Triggers)
-- =========================================================
IF OBJECT_ID('sos_alerts', 'U') IS NULL
CREATE TABLE sos_alerts (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NULL,
    caller_name VARCHAR(100) NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    emergency_type VARCHAR(50) DEFAULT 'General SOS', -- 'Medical', 'Assault', 'Lost', 'Natural Disaster'
    message VARCHAR(MAX) NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'dispatched', 'resolved')),
    dispatched_to VARCHAR(255) NULL, -- 'Local Police PCR', 'Medical Ambulance 108', 'Forest Ranger'
    created_at DATETIME DEFAULT GETDATE(),
    resolved_at DATETIME NULL,
    CONSTRAINT FK_sos_alerts_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
GO

-- =========================================================
-- 7. SAFETY ALERTS / ADVISORIES (Broadcasts & Warnings)
-- =========================================================
IF OBJECT_ID('safety_alerts', 'U') IS NULL
CREATE TABLE safety_alerts (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    location_id INT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(MAX) NOT NULL,
    alert_type VARCHAR(100) NOT NULL, -- 'Weather Advisory', 'Curfew', 'Avalanche Warning', 'Festival Surge'
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    valid_until DATETIME NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_safety_alerts_locations FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL
);
GO

-- =========================================================
-- 8. TRIPS & ITINERARY TABLE
-- =========================================================
IF OBJECT_ID('trips', 'U') IS NULL
CREATE TABLE trips (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    destination VARCHAR(150) NOT NULL,
    start_location VARCHAR(150) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    safety_rating VARCHAR(20) DEFAULT 'SAFE',
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_trips_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
GO

-- =========================================================
-- 9. LOCATION HISTORY & TELEMETRY TABLE
-- =========================================================
IF OBJECT_ID('location_history', 'U') IS NULL
CREATE TABLE location_history (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(5, 2) NULL,
    battery_level INT NULL,
    recorded_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_location_history_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
GO

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX idx_users_email ON users (email);
GO
CREATE INDEX idx_reports_user ON safety_reports (user_id);
GO
CREATE INDEX idx_reports_coords ON safety_reports (latitude, longitude);
GO
CREATE INDEX idx_sos_user ON sos_alerts (user_id);
GO
CREATE INDEX idx_sos_status ON sos_alerts (status);
GO
CREATE INDEX idx_zones_coords ON geofence_zones (latitude, longitude);
GO
CREATE INDEX idx_location_history_user ON location_history (user_id, recorded_at);
GO
CREATE INDEX idx_trips_user ON trips (user_id);
GO