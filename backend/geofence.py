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
    }
