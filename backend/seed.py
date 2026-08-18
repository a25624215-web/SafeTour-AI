import os
import sys
import datetime
import hashlib

# Ensure backend folder is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from database import engine, Base, SessionLocal
import models

import bcrypt

def hash_pwd(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def seed_database():
    print("[INIT] Initializing SafeTour-AI Database Schema...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Tables created successfully.")

    db = SessionLocal()
    try:
        if db.query(models.User).first():
            print("[INFO] Database already contains data. Skipping seeding.")
            return

        print("[SEED] Seeding initial datasets into database...")

        # 1. Users
        pwd_hash = hash_pwd("password123")
        users = [
            models.User(
                name="Aarav Sharma",
                email="aarav.sharma@example.com",
                password_hash=pwd_hash,
                phone="+919876543210",
                role="tourist",
                is_active=True
            ),
            models.User(
                name="Priya Patel",
                email="priya.patel@example.com",
                password_hash=pwd_hash,
                phone="+919876543211",
                role="tourist",
                is_active=True
            ),
            models.User(
                name="Officer Vikram Singh",
                email="vikram.police@safetour.gov.in",
                password_hash=pwd_hash,
                phone="+919876543212",
                role="responder",
                is_active=True
            ),
            models.User(
                name="Admin Sentinel",
                email="admin@safetour.ai",
                password_hash=pwd_hash,
                phone="+919876543213",
                role="admin",
                is_active=True
            )
        ]
        db.add_all(users)
        db.commit()

        # 2. Emergency Contacts
        contacts = [
            models.EmergencyContact(
                user_id=1,
                name="Ramesh Sharma",
                phone="+919811122233",
                relationship_type="Father",
                is_primary=True
            ),
            models.EmergencyContact(
                user_id=1,
                name="Sunita Sharma",
                phone="+919822233344",
                relationship_type="Mother",
                is_primary=False
            ),
            models.EmergencyContact(
                user_id=2,
                name="Kavita Patel",
                phone="+919833344455",
                relationship_type="Sister",
                is_primary=True
            )
        ]
        db.add_all(contacts)

        # 3. Locations
        locations = [
            models.Location(
                name="Hadimba Devi Temple",
                address="Hadimba Temple Rd, Old Manali",
                city="Manali",
                state="Himachal Pradesh",
                country="India",
                latitude=32.2483,
                longitude=77.1812,
                safety_score=9.20,
                crowd_density="high",
                lighting_condition="good"
            ),
            models.Location(
                name="Solang Valley Adventure Point",
                address="Solang Valley, VPO Palchan",
                city="Manali",
                state="Himachal Pradesh",
                country="India",
                latitude=32.3166,
                longitude=77.1578,
                safety_score=8.70,
                crowd_density="high",
                lighting_condition="well-lit"
            ),
            models.Location(
                name="Rohtang Pass Viewpoint",
                address="Leh Manali Hwy",
                city="Manali",
                state="Himachal Pradesh",
                country="India",
                latitude=32.3716,
                longitude=77.2466,
                safety_score=6.80,
                crowd_density="medium",
                lighting_condition="poor"
            ),
            models.Location(
                name="Mall Road & Ridge",
                address="The Mall, Near Town Hall",
                city="Shimla",
                state="Himachal Pradesh",
                country="India",
                latitude=31.1048,
                longitude=77.1734,
                safety_score=9.50,
                crowd_density="surge",
                lighting_condition="well-lit"
            ),
            models.Location(
                name="Baga Beach Tourism Circle",
                address="Baga Beach Rd, Calangute",
                city="North Goa",
                state="Goa",
                country="India",
                latitude=15.5553,
                longitude=73.7517,
                safety_score=8.10,
                crowd_density="high",
                lighting_condition="well-lit"
            ),
            models.Location(
                name="Kanpur Central Area Hub",
                address="Station Rd, Cantonment",
                city="Kanpur",
                state="Uttar Pradesh",
                country="India",
                latitude=26.4499,
                longitude=80.3319,
                safety_score=8.00,
                crowd_density="high",
                lighting_condition="good"
            )
        ]
        db.add_all(locations)

        # 4. Geofence Zones
        zones = [
            models.GeofenceZone(
                name="Kanpur Restricted Industrial Belt",
                description="Active industrial machinery and heavy freight transport route.",
                zone_type="restricted",
                risk_level="HIGH",
                latitude=26.4499,
                longitude=80.3319,
                radius_km=1.20,
                advisory_message="Restricted zone: Stay on the pedestrian path and avoid rail freight crossings."
            ),
            models.GeofenceZone(
                name="Kanpur Ganges Ghat Caution Perimeter",
                description="Steep river banks with strong undercurrents during monsoon.",
                zone_type="caution",
                risk_level="CAUTION",
                latitude=26.4600,
                longitude=80.3400,
                radius_km=1.50,
                advisory_message="Caution: Deep water edge ahead. Maintain distance from slippery stone steps."
            ),
            models.GeofenceZone(
                name="Rohtang Pass Steep Avalanche Corridor",
                description="High altitude snow zone prone to sudden fog and icy black roads.",
                zone_type="high_altitude",
                risk_level="CRITICAL",
                latitude=32.3716,
                longitude=77.2466,
                radius_km=3.00,
                advisory_message="Extreme Hazard: Icy roads and avalanche hazard. 4x4 vehicles and chains mandatory."
            ),
            models.GeofenceZone(
                name="Old Manali Dense Forest Trail",
                description="Unlit forest bypass trail after dark.",
                zone_type="caution",
                risk_level="CAUTION",
                latitude=32.2530,
                longitude=77.1750,
                radius_km=1.00,
                advisory_message="Caution: Low illumination after 19:00. Use marked tourist main road."
            )
        ]
        db.add_all(zones)

        # 5. Safety Incident Reports
        reports = [
            models.SafetyReport(
                user_id=1,
                location_id=1,
                report_type="Poor Lighting",
                severity="low",
                description="Street lamps near the lower wooden temple bridge are flickering.",
                latitude=32.2483,
                longitude=77.1812,
                status="verified"
            ),
            models.SafetyReport(
                user_id=2,
                location_id=2,
                report_type="Unauthorized Guide Scam",
                severity="medium",
                description="Unregistered touts demanding extra cash for snow gear rental.",
                latitude=32.3166,
                longitude=77.1578,
                status="verified"
            )
        ]
        db.add_all(reports)

        # 6. SOS Alerts
        sos_alerts = [
            models.SOSAlert(
                user_id=1,
                caller_name="Aarav Sharma",
                latitude=26.4499,
                longitude=80.3319,
                emergency_type="Medical",
                message="Feeling dizzy and experiencing acute dehydration near transit station.",
                status="resolved",
                dispatched_to="Ambulance Unit 108"
            ),
            models.SOSAlert(
                user_id=2,
                caller_name="Priya Patel",
                latitude=32.2483,
                longitude=77.1812,
                emergency_type="Lost in Fog",
                message="Dense fog descended on Solang trail. Lost orientation.",
                status="acknowledged",
                dispatched_to="Himachal Police Quick Response Team"
            )
        ]
        db.add_all(sos_alerts)

        # 7. Safety Advisories
        alerts = [
            models.SafetyAlert(
                location_id=3,
                title="High Wind & Freezing Alert",
                description="Temperatures dropping to -4°C tonight. Rohtang pass closes at 16:00.",
                alert_type="Weather Advisory",
                severity="high",
                status="active"
            )
        ]
        db.add_all(alerts)

        # 8. Trips
        trips = [
            models.Trip(
                user_id=1,
                destination="Manali, Himachal Pradesh",
                start_location="Delhi NCR",
                start_date=datetime.date(2026, 8, 20),
                end_date=datetime.date(2026, 8, 25),
                safety_rating="SAFE",
                status="ongoing"
            ),
            models.Trip(
                user_id=2,
                destination="Goa Coastal Circuit",
                start_location="Mumbai",
                start_date=datetime.date(2026, 9, 10),
                end_date=datetime.date(2026, 9, 16),
                safety_rating="SAFE",
                status="planned"
            )
        ]
        db.add_all(trips)

        # 9. Location History
        loc_history = [
            models.LocationHistory(
                user_id=1,
                latitude=26.4499,
                longitude=80.3319,
                speed_kmh=0.0,
                battery_level=88
            ),
            models.LocationHistory(
                user_id=1,
                latitude=26.4520,
                longitude=80.3340,
                speed_kmh=15.4,
                battery_level=85
            )
        ]
        db.add_all(loc_history)

        db.commit()
        print("[SUCCESS] Database successfully seeded with test users, destinations, geofences, and safety alerts!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
