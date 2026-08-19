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