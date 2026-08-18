import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    Text
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="tourist")  # 'tourist', 'admin', 'responder'
    profile_image = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    emergency_contacts = relationship("EmergencyContact", back_populates="user", cascade="all, delete-orphan")
    safety_reports = relationship("SafetyReport", back_populates="user")
    sos_alerts = relationship("SOSAlert", back_populates="user")
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    location_history = relationship("LocationHistory", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "profile_image": self.profile_image,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    relationship_type = Column("relationship", String(50), nullable=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="emergency_contacts")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "phone": self.phone,
            "relationship": self.relationship_type,
            "is_primary": self.is_primary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    country = Column(String(100), default="India")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    safety_score = Column(Float, default=8.50)
    crowd_density = Column(String(20), default="medium")  # 'low', 'medium', 'high', 'surge'
    lighting_condition = Column(String(20), default="good")  # 'poor', 'moderate', 'good', 'well-lit'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    safety_reports = relationship("SafetyReport", back_populates="location")
    safety_alerts = relationship("SafetyAlert", back_populates="location")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "safety_score": self.safety_score,
            "crowd_density": self.crowd_density,
            "lighting_condition": self.lighting_condition,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class GeofenceZone(Base):
    __tablename__ = "geofence_zones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    zone_type = Column(String(20), nullable=False)  # 'restricted', 'caution', 'safe', 'high_altitude'
    risk_level = Column(String(20), nullable=False)  # 'LOW', 'CAUTION', 'HIGH', 'CRITICAL'
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    radius_km = Column(Float, default=1.0)
    advisory_message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "zone_type": self.zone_type,
            "risk_level": self.risk_level,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "radius_km": self.radius_km,
            "advisory_message": self.advisory_message,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class SafetyReport(Base):
    __tablename__ = "safety_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    report_type = Column(String(100), nullable=False)
    severity = Column(String(20), default="medium")  # 'low', 'medium', 'high', 'critical'
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    status = Column(String(20), default="pending")  # 'pending', 'verified', 'resolved', 'dismissed'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="safety_reports")
    location = relationship("Location", back_populates="safety_reports")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "location_id": self.location_id,
            "report_type": self.report_type,
            "severity": self.severity,
            "description": self.description,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None
        }


class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    caller_name = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    emergency_type = Column(String(50), default="General SOS")
    message = Column(Text, nullable=True)
    status = Column(String(20), default="active", index=True)  # 'active', 'acknowledged', 'dispatched', 'resolved'
    dispatched_to = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sos_alerts")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "caller_name": self.caller_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "emergency_type": self.emergency_type,
            "message": self.message,
            "status": self.status,
            "dispatched_to": self.dispatched_to,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None
        }


class SafetyAlert(Base):
    __tablename__ = "safety_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(20), default="medium")  # 'low', 'medium', 'high', 'critical'
    status = Column(String(20), default="active")  # 'active', 'inactive'
    valid_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    location = relationship("Location", back_populates="safety_alerts")

    def to_dict(self):
        return {
            "id": self.id,
            "location_id": self.location_id,
            "title": self.title,
            "description": self.description,
            "alert_type": self.alert_type,
            "severity": self.severity,
            "status": self.status,
            "valid_until": self.valid_until.isoformat() if self.valid_until else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    destination = Column(String(150), nullable=False)
    start_location = Column(String(150), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    safety_rating = Column(String(20), default="SAFE")
    status = Column(String(20), default="planned")  # 'planned', 'ongoing', 'completed', 'cancelled'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="trips")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "destination": self.destination,
            "start_location": self.start_location,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "safety_rating": self.safety_rating,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class LocationHistory(Base):
    __tablename__ = "location_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_kmh = Column(Float, nullable=True)
    battery_level = Column(Integer, nullable=True)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="location_history")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "speed_kmh": self.speed_kmh,
            "battery_level": self.battery_level,
            "recorded_at": self.recorded_at.isoformat() if self.recorded_at else None
        }
