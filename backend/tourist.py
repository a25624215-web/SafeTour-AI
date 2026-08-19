<<<<<<< ours
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/tourist",
    tags=["Tourist"]
)


# Temporary in-memory storage
tourist_profiles = {}


class TouristProfile(BaseModel):
    email: str
    destination: str
    trip_duration: int
    emergency_contact: str


@router.post("/profile")
def create_profile(profile: TouristProfile):

    tourist_profiles[profile.email] = {
        "email": profile.email,
        "destination": profile.destination,
        "trip_duration": profile.trip_duration,
        "emergency_contact": profile.emergency_contact
    }

    return {
        "message": "Tourist profile created successfully",
        "profile": tourist_profiles[profile.email]
    }


@router.get("/profile/{email}")
def get_profile(email: str):

    profile = tourist_profiles.get(email)

    if not profile:
        return {
            "message": "Tourist profile not found"
        }

    return profile
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import datetime
from sqlalchemy.orm import Session
from database import get_db
import crud
import models

router = APIRouter(prefix="/tourist", tags=["Tourist Management"])


class TripCreateRequest(BaseModel):
    destination: str
    start_location: Optional[str] = None
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    safety_rating: Optional[str] = "SAFE"


class LocationTelemetryRequest(BaseModel):
    latitude: float
    longitude: float
    speed_kmh: Optional[float] = None
    battery_level: Optional[int] = None


@router.get("/{user_id}/trips")
def get_trips(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Tourist not found")
    trips = crud.get_user_trips(db, user_id)
    return {
        "user_id": user_id,
        "count": len(trips),
        "trips": [t.to_dict() for t in trips]
    }


@router.post("/{user_id}/trips")
def create_trip(user_id: int, data: TripCreateRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Tourist not found")

    trip = models.Trip(
        user_id=user_id,
        destination=data.destination,
        start_location=data.start_location,
        start_date=data.start_date,
        end_date=data.end_date,
        safety_rating=data.safety_rating,
        status="planned"
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return {
        "status": "success",
        "trip": trip.to_dict()
    }


@router.post("/{user_id}/telemetry")
def submit_location_telemetry(user_id: int, data: LocationTelemetryRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Tourist not found")

    record = crud.record_location_history(
        db=db,
        user_id=user_id,
        latitude=data.latitude,
        longitude=data.longitude,
        speed_kmh=data.speed_kmh,
        battery_level=data.battery_level
    )
    return {
        "status": "success",
        "telemetry_id": record.id,
        "recorded_at": record.recorded_at.isoformat() if record.recorded_at else None
    }


@router.get("/{user_id}/telemetry")
def get_telemetry_history(user_id: int, limit: int = 50, db: Session = Depends(get_db)):
    history = crud.get_user_location_history(db, user_id, limit=limit)
    return {
        "user_id": user_id,
        "count": len(history),
        "history": [h.to_dict() for h in history]
    }
>>>>>>> theirs
