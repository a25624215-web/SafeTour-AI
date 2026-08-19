<<<<<<< ours
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/geofence",
    tags=["Geofencing"]
)


# Temporary demo zones
geofences = [
    {
        "name": "Restricted Zone A",
        "latitude": 26.4500,
        "longitude": 80.3320,
        "radius": 0.002,
        "type": "RESTRICTED"
    },
    {
        "name": "High Risk Zone B",
        "latitude": 26.4520,
        "longitude": 80.3350,
        "radius": 0.003,
        "type": "HIGH_RISK"
    }
]


class LocationRequest(BaseModel):
    latitude: float
    longitude: float


def is_inside_zone(latitude, longitude, zone):

    lat_diff = abs(latitude - zone["latitude"])
    lon_diff = abs(longitude - zone["longitude"])

    return lat_diff <= zone["radius"] and lon_diff <= zone["radius"]


@router.post("/check")
def check_geofence(location: LocationRequest):

    detected_zones = []

    for zone in geofences:

        if is_inside_zone(
            location.latitude,
            location.longitude,
            zone
        ):
            detected_zones.append(zone)

    if not detected_zones:
        return {
            "inside_zone": False,
            "message": "Tourist is in a safe monitored area",
            "zones": []
        }

    return {
        "inside_zone": True,
        "message": "Tourist has entered a monitored risk zone",
        "zones": detected_zones
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
import crud
import models

router = APIRouter(prefix="/geofence", tags=["Geofencing & Hazard Zones"])


class GeofenceZoneCreate(BaseModel):
    name: str
    description: Optional[str] = None
    zone_type: str = "caution"  # 'restricted', 'caution', 'safe', 'high_altitude'
    risk_level: str = "CAUTION"  # 'LOW', 'CAUTION', 'HIGH', 'CRITICAL'
    latitude: float
    longitude: float
    radius_km: float = 1.0
    advisory_message: str


@router.get("/check")
def check_location(latitude: float, longitude: float, db: Session = Depends(get_db)):
    matched_zones = crud.check_point_in_geofences(db, latitude, longitude)

    if matched_zones:
        # Highest risk priority
        highest_risk = matched_zones[0]
        return {
            "inside_zone": True,
            "matched_zones_count": len(matched_zones),
            "primary_zone": highest_risk["name"],
            "zone_type": highest_risk["zone_type"],
            "risk_level": highest_risk["risk_level"],
            "distance_km": highest_risk["distance_km"],
            "radius_km": highest_risk["radius_km"],
            "message": highest_risk["advisory_message"],
            "all_zones": matched_zones
        }

    return {
        "inside_zone": False,
        "matched_zones_count": 0,
        "primary_zone": None,
        "zone_type": None,
        "risk_level": "LOW",
        "distance_km": None,
        "message": "No hazardous or restricted caution zones detected within proximity."
    }


@router.get("/zones")
def list_zones(db: Session = Depends(get_db)):
    zones = crud.get_active_geofence_zones(db)
    return {
        "count": len(zones),
        "zones": [z.to_dict() for z in zones]
    }


@router.post("/zones")
def create_zone(data: GeofenceZoneCreate, db: Session = Depends(get_db)):
    zone = models.GeofenceZone(
        name=data.name,
        description=data.description,
        zone_type=data.zone_type,
        risk_level=data.risk_level,
        latitude=data.latitude,
        longitude=data.longitude,
        radius_km=data.radius_km,
        advisory_message=data.advisory_message,
        is_active=True
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return {
        "status": "success",
        "zone": zone.to_dict()
>>>>>>> theirs
    }
