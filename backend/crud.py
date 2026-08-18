from sqlalchemy.orm import Session
from sqlalchemy import desc
import datetime
from math import radians, sin, cos, sqrt, atan2
import models


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two GPS coordinates using Haversine formula."""
    earth_radius = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return earth_radius * c


# =========================================================
# USER CRUD
# =========================================================
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, name: str, email: str, password_hash: str, phone: str = None, role: str = "tourist"):
    db_user = models.User(
        name=name,
        email=email,
        password_hash=password_hash,
        phone=phone,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# =========================================================
# EMERGENCY CONTACTS CRUD
# =========================================================
def get_emergency_contacts(db: Session, user_id: int):
    return db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == user_id).all()


def add_emergency_contact(db: Session, user_id: int, name: str, phone: str, relationship: str = None, is_primary: bool = False):
    contact = models.EmergencyContact(
        user_id=user_id,
        name=name,
        phone=phone,
        relationship_type=relationship,
        is_primary=is_primary
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


# =========================================================
# GEOFENCE ZONES & PROXIMITY
# =========================================================
def get_active_geofence_zones(db: Session):
    return db.query(models.GeofenceZone).filter(models.GeofenceZone.is_active == True).all()


def check_point_in_geofences(db: Session, latitude: float, longitude: float):
    zones = get_active_geofence_zones(db)
    matched_zones = []

    for zone in zones:
        distance = calculate_haversine_distance(latitude, longitude, zone.latitude, zone.longitude)
        if distance <= zone.radius_km:
            matched_zones.append({
                "zone_id": zone.id,
                "name": zone.name,
                "description": zone.description,
                "zone_type": zone.zone_type,
                "risk_level": zone.risk_level,
                "distance_km": round(distance, 2),
                "radius_km": zone.radius_km,
                "advisory_message": zone.advisory_message
            })

    return matched_zones


# =========================================================
# SOS ALERTS CRUD
# =========================================================
def create_sos_alert(db: Session, latitude: float, longitude: float, user_id: int = None, caller_name: str = None, emergency_type: str = "General SOS", message: str = None):
    sos = models.SOSAlert(
        user_id=user_id,
        caller_name=caller_name,
        latitude=latitude,
        longitude=longitude,
        emergency_type=emergency_type,
        message=message,
        status="active"
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    return sos


def get_active_sos_alerts(db: Session):
    return db.query(models.SOSAlert).filter(models.SOSAlert.status == "active").order_by(desc(models.SOSAlert.created_at)).all()


def resolve_sos_alert(db: Session, sos_id: int, dispatched_to: str = None):
    sos = db.query(models.SOSAlert).filter(models.SOSAlert.id == sos_id).first()
    if sos:
        sos.status = "resolved"
        sos.resolved_at = datetime.datetime.utcnow()
        if dispatched_to:
            sos.dispatched_to = dispatched_to
        db.commit()
        db.refresh(sos)
    return sos


# =========================================================
# SAFETY REPORTS CRUD
# =========================================================
def create_safety_report(db: Session, report_type: str, description: str, latitude: float, longitude: float, user_id: int = None, location_id: int = None, severity: str = "medium"):
    report = models.SafetyReport(
        user_id=user_id,
        location_id=location_id,
        report_type=report_type,
        severity=severity,
        description=description,
        latitude=latitude,
        longitude=longitude,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_recent_safety_reports(db: Session, limit: int = 50):
    return db.query(models.SafetyReport).order_by(desc(models.SafetyReport.created_at)).limit(limit).all()


# =========================================================
# TRIPS & LOCATION TELEMETRY
# =========================================================
def get_user_trips(db: Session, user_id: int):
    return db.query(models.Trip).filter(models.Trip.user_id == user_id).order_by(desc(models.Trip.created_at)).all()


def record_location_history(db: Session, user_id: int, latitude: float, longitude: float, speed_kmh: float = None, battery_level: int = None):
    record = models.LocationHistory(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        speed_kmh=speed_kmh,
        battery_level=battery_level
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_user_location_history(db: Session, user_id: int, limit: int = 50):
    return db.query(models.LocationHistory).filter(models.LocationHistory.user_id == user_id).order_by(desc(models.LocationHistory.recorded_at)).limit(limit).all()
