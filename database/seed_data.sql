-- =========================================================
-- SAFETOUR AI - INITIAL SEED DATA
-- Pre-populated datasets for locations, zones, users & telemetry
-- =========================================================

-- 1. USERS (Pass: 'password123' bcrypt hashed)
INSERT INTO users (id, name, email, password_hash, phone, role, is_active) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65VU305CdZqYTVq', '+919876543210', 'tourist', 1),
(2, 'Priya Patel', 'priya.patel@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65VU305CdZqYTVq', '+919876543211', 'tourist', 1),
(3, 'Officer Vikram Singh', 'vikram.police@safetour.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65VU305CdZqYTVq', '+919876543212', 'responder', 1),
(4, 'Admin Sentinel', 'admin@safetour.ai', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65VU305CdZqYTVq', '+919876543213', 'admin', 1);

-- 2. EMERGENCY CONTACTS
INSERT INTO emergency_contacts (id, user_id, name, phone, relationship, is_primary) VALUES
(1, 1, 'Ramesh Sharma', '+919811122233', 'Father', 1),
(2, 1, 'Sunita Sharma', '+919822233344', 'Mother', 0),
(3, 2, 'Kavita Patel', '+919833344455', 'Sister', 1);

-- 3. TOURIST LOCATIONS (India & Himalayan Safety Zones)
INSERT INTO locations (id, name, address, city, state, country, latitude, longitude, safety_score, crowd_density, lighting_condition) VALUES
(1, 'Hadimba Devi Temple', 'Hadimba Temple Rd, Old Manali', 'Manali', 'Himachal Pradesh', 'India', 32.2483, 77.1812, 9.20, 'high', 'good'),
(2, 'Solang Valley Adventure Point', 'Solang Valley, VPO Palchan', 'Manali', 'Himachal Pradesh', 'India', 32.3166, 77.1578, 8.70, 'high', 'well-lit'),
(3, 'Rohtang Pass Viewpoint', 'Leh Manali Hwy', 'Manali', 'Himachal Pradesh', 'India', 32.3716, 77.2466, 6.80, 'medium', 'poor'),
(4, 'Mall Road & Ridge', 'The Mall, Near Town Hall', 'Shimla', 'Himachal Pradesh', 'India', 31.1048, 77.1734, 9.50, 'surge', 'well-lit'),
(5, 'Baga Beach Tourism Circle', 'Baga Beach Rd, Calangute', 'North Goa', 'Goa', 'India', 15.5553, 73.7517, 8.10, 'high', 'well-lit'),
(6, 'Hawa Mahal Precinct', 'Badi Choupad, J.D.A. Market', 'Jaipur', 'Rajasthan', 'India', 26.9239, 75.8267, 8.90, 'surge', 'good'),
(7, 'Dashashwamedh Ghat', 'Bangali Tola', 'Varanasi', 'Uttar Pradesh', 'India', 25.3076, 83.0107, 8.40, 'surge', 'well-lit'),
(8, 'Pangong Tso Lake Shore', 'Lukung, Changthang', 'Leh Ladakh', 'Ladakh', 'India', 33.7595, 78.6674, 7.20, 'low', 'poor'),
(9, 'Kanpur Central Area Hub', 'Station Rd, Cantonment', 'Kanpur', 'Uttar Pradesh', 'India', 26.4499, 80.3319, 8.00, 'high', 'good');

-- 4. GEOFENCE ZONES (Hazard Areas, Caution Buffers & High Altitude Alert Zones)
INSERT INTO geofence_zones (id, name, description, zone_type, risk_level, latitude, longitude, radius_km, advisory_message, is_active) VALUES
(1, 'Kanpur Restricted Industrial Belt', 'Active industrial machinery and heavy freight transport route.', 'restricted', 'HIGH', 26.4499, 80.3319, 1.20, 'Restricted zone: Stay on the pedestrian path and avoid rail freight crossings.', 1),
(2, 'Kanpur Ganges Ghat Caution Perimeter', 'Steep river banks with strong undercurrents during monsoon.', 'caution', 'CAUTION', 26.4600, 80.3400, 1.50, 'Caution: Deep water edge ahead. Maintain distance from slippery stone steps.', 1),
(3, 'Rohtang Pass Steep Avalanche Corridor', 'High altitude snow zone prone to sudden fog and icy black roads.', 'high_altitude', 'CRITICAL', 32.3716, 77.2466, 3.00, 'Extreme Hazard: Icy roads and avalanche hazard. 4x4 vehicles and chains mandatory.', 1),
(4, 'Old Manali Dense Forest Trail', 'Unlit forest bypass trail after dark.', 'caution', 'CAUTION', 32.2530, 77.1750, 1.00, 'Caution: Low illumination after 19:00. Use marked tourist main road.', 1),
(5, 'Baga Beach High Tide Rip Current Sector', 'Deep ocean shelf with treacherous rip currents.', 'restricted', 'HIGH', 15.5580, 73.7480, 0.80, 'No Swimming: Active red flag zone monitored by Drishti Lifeguards.', 1);

-- 5. SAFETY INCIDENT REPORTS
INSERT INTO safety_reports (id, user_id, location_id, report_type, severity, description, latitude, longitude, status) VALUES
(1, 1, 1, 'Poor Lighting', 'low', 'Street lamps near the lower wooden temple bridge are flickering.', 32.2483, 77.1812, 'verified'),
(2, 2, 2, 'Unauthorized Guide Scam', 'medium', 'Unregistered touts demanding extra cash for snow gear rental.', 32.3166, 77.1578, 'verified'),
(3, 1, 3, 'Black Ice on Road', 'high', 'Road slippery near the bend at KM 14 towards Rohtang.', 32.3680, 77.2400, 'pending');

-- 6. SOS ALERTS (Emergency Telemetry)
INSERT INTO sos_alerts (id, user_id, caller_name, latitude, longitude, emergency_type, message, status, dispatched_to) VALUES
(1, 1, 'Aarav Sharma', 26.4499, 80.3319, 'Medical', 'Feeling dizzy and experiencing acute dehydration near transit station.', 'resolved', 'Ambulance Unit 108'),
(2, 2, 'Priya Patel', 32.2483, 77.1812, 'Lost in Fog', 'Dense fog descended on Solang trail. Lost orientation.', 'acknowledged', 'Himachal Police Quick Response Team');

-- 7. SAFETY BROADCASTS / ADVISORIES
INSERT INTO safety_alerts (id, location_id, title, description, alert_type, severity, status) VALUES
(1, 3, 'High Wind & Freezing Alert', 'Temperatures dropping to -4°C tonight. Rohtang pass closes at 16:00.', 'Weather Advisory', 'high', 'active'),
(2, 7, 'Ganga Aarti Massive Crowd Advisory', 'High pilgrim surge expected between 18:00 and 20:30 at Dashashwamedh.', 'Festival Surge', 'medium', 'active'),
(3, 5, 'Rough Sea & Monsoonal Red Flag', 'High swells recorded along North Goa beaches. Water activities suspended.', 'Sea Warning', 'critical', 'active');

-- 8. TRIPS
INSERT INTO trips (id, user_id, destination, start_location, start_date, end_date, safety_rating, status) VALUES
(1, 1, 'Manali, Himachal Pradesh', 'Delhi NCR', '2026-08-20', '2026-08-25', 'SAFE', 'ongoing'),
(2, 1, 'Goa Coastal Circuit', 'Mumbai', '2026-09-10', '2026-09-16', 'SAFE', 'planned'),
(3, 2, 'Leh Ladakh High Circuit', 'Chandigarh', '2026-07-01', '2026-07-10', 'CAUTION', 'completed');

-- 9. LOCATION HISTORY TELEMETRY
INSERT INTO location_history (id, user_id, latitude, longitude, speed_kmh, battery_level) VALUES
(1, 1, 26.4499, 80.3319, 0.0, 88),
(2, 1, 26.4520, 80.3340, 15.4, 85),
(3, 1, 26.4580, 80.3390, 22.1, 82),
(4, 2, 32.2483, 77.1812, 3.2, 94);
