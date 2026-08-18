-- ============================================================
-- SAFE TOUR AI - DATABASE SCHEMA
-- Smart Tourist Safety Monitoring & Incident Response System
-- ============================================================

-- ============================================================
-- 1. USERS TABLE
-- Tourist aur Authority dono ke accounts
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role VARCHAR(20) NOT NULL DEFAULT 'tourist'
        CHECK (role IN ('tourist', 'authority', 'admin')),

    profile_image VARCHAR(500),

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. TOURIST LOCATIONS
-- Tourist ki live/recent location
-- ============================================================

CREATE TABLE IF NOT EXISTS tourist_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tourist_id INTEGER NOT NULL,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    accuracy DECIMAL(10, 2),

    location_source VARCHAR(30) DEFAULT 'gps',

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tourist_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. TOURIST PLACES
-- SafeTour AI ke map par specific tourist places
-- ============================================================

CREATE TABLE IF NOT EXISTS tourist_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    address VARCHAR(500),

    city VARCHAR(100),

    state VARCHAR(100),

    category VARCHAR(50),

    opening_time TIME,

    closing_time TIME,

    emergency_contact VARCHAR(20),

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. GEOFENCES
-- Restricted / dangerous / monitored areas
-- ============================================================

CREATE TABLE IF NOT EXISTS geofences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    radius_meters DECIMAL(10, 2) NOT NULL,

    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (
            risk_level IN
            ('low', 'medium', 'high', 'critical')
        ),

    zone_type VARCHAR(30) DEFAULT 'danger',

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 5. INCIDENTS
-- SOS aur other safety incidents
-- ============================================================

CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tourist_id INTEGER NOT NULL,

    incident_type VARCHAR(50) NOT NULL,

    description TEXT,

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    risk_level VARCHAR(20) DEFAULT 'high'
        CHECK (
            risk_level IN
            ('low', 'medium', 'high', 'critical')
        ),

    status VARCHAR(30) DEFAULT 'active'
        CHECK (
            status IN
            ('active', 'acknowledged', 'in_progress', 'resolved', 'cancelled')
        ),

    assigned_authority_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP,

    FOREIGN KEY (tourist_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (assigned_authority_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 6. EMERGENCY CONTACTS
-- Police, Hospital, Ambulance etc.
-- ============================================================

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name VARCHAR(150) NOT NULL,

    contact_type VARCHAR(50) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    address VARCHAR(500),

    city VARCHAR(100),

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 7. NOTIFICATIONS
-- Tourist aur authority ko alerts
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    notification_type VARCHAR(50),

    severity VARCHAR(20) DEFAULT 'info'
        CHECK (
            severity IN
            ('info', 'warning', 'danger', 'critical')
        ),

    is_read BOOLEAN DEFAULT 0,

    related_incident_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (related_incident_id)
        REFERENCES incidents(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 8. INCIDENT REPORTS
-- Detailed report after incident
-- ============================================================

CREATE TABLE IF NOT EXISTS incident_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    incident_id INTEGER NOT NULL,

    authority_id INTEGER,

    report TEXT,

    action_taken TEXT,

    final_status VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
        ON DELETE CASCADE,

    FOREIGN KEY (authority_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- INDEXES
-- Faster location / incident / user searching
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tourist_locations_tourist
ON tourist_locations(tourist_id);

CREATE INDEX IF NOT EXISTS idx_tourist_locations_time
ON tourist_locations(recorded_at);

CREATE INDEX IF NOT EXISTS idx_incidents_tourist
ON incidents(tourist_id);

CREATE INDEX IF NOT EXISTS idx_incidents_status
ON incidents(status);

CREATE INDEX IF NOT EXISTS idx_incidents_risk
ON incidents(risk_level);

CREATE INDEX IF NOT EXISTS idx_geofences_active
ON geofences(is_active);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);


-- ============================================================
-- SAMPLE TOURIST PLACES
-- Demo ke liye
-- ============================================================

INSERT INTO tourist_places
(name, description, latitude, longitude, address, city, state, category)
VALUES
(
    'Taj Mahal',
    'Famous historical monument',
    27.1751,
    78.0421,
    'Dharmapuri, Forest Colony',
    'Agra',
    'Uttar Pradesh',
    'Historical'
),
(
    'Agra Fort',
    'Historic Mughal fort',
    27.1795,
    78.0211,
    'Agra Fort',
    'Agra',
    'Uttar Pradesh',
    'Historical'
),
(
    'India Gate',
    'National war memorial',
    28.6129,
    77.2295,
    'Kartavya Path',
    'New Delhi',
    'Delhi',
    'Monument'
);


-- ============================================================
-- SAMPLE EMERGENCY CONTACTS
-- Demo data
-- ============================================================

INSERT INTO emergency_contacts
(name, contact_type, phone, city, is_active)
VALUES
(
    'Police Emergency',
    'Police',
    '112',
    'All India',
    1
),
(
    'Ambulance Emergency',
    'Ambulance',
    '108',
    'Uttar Pradesh',
    1
);


-- ============================================================
-- SAMPLE GEOFENCE
-- Demo dangerous/restricted zone
-- ============================================================

INSERT INTO geofences
(name, description, latitude, longitude, radius_meters, risk_level, zone_type)
VALUES
(
    'Demo Restricted Zone',
    'Restricted area for SafeTour AI demonstration',
    27.1751,
    78.0421,
    500,
    'high',
    'restricted'
);
