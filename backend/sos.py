from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/sos",
    tags=["SOS"]
)


# Temporary in-memory storage
sos_alerts = []


class SOSRequest(BaseModel):
    tourist_email: str
    latitude: float
    longitude: float
    risk_level: str
    emergency_contact: str
    incident_type: str


@router.post("/create")
def create_sos(alert: SOSRequest):

    new_alert = {
        "id": len(sos_alerts) + 1,
        "tourist_email": alert.tourist_email,
        "latitude": alert.latitude,
        "longitude": alert.longitude,
        "risk_level": alert.risk_level,
        "emergency_contact": alert.emergency_contact,
        "incident_type": alert.incident_type,
        "status": "ACTIVE",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    sos_alerts.append(new_alert)

    return {
        "message": "SOS alert created successfully",
        "alert": new_alert
    }


@router.get("/active")
def get_active_sos():

    active_alerts = [
        alert
        for alert in sos_alerts
        if alert["status"] == "ACTIVE"
    ]

    return {
        "active_sos_count": len(active_alerts),
        "alerts": active_alerts
    }


@router.put("/{sos_id}/resolve")
def resolve_sos(sos_id: int):

    for alert in sos_alerts:

        if alert["id"] == sos_id:

            alert["status"] = "RESOLVED"

            return {
                "message": "SOS alert resolved successfully",
                "alert": alert
            }

    return {
        "message": "SOS alert not found"
    }