<<<<<<< ours
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
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
import crud
import models

router = APIRouter(prefix="/sos", tags=["SOS & Emergency"])


class SOSCreateRequest(BaseModel):
    latitude: float
    longitude: float
    user_id: Optional[int] = None
    caller_name: Optional[str] = "Anonymous Tourist"
    emergency_type: Optional[str] = "General SOS"
    message: Optional[str] = "Emergency Assistance Requested"


class SOSResolveRequest(BaseModel):
    dispatched_to: Optional[str] = "PCR Patrol Unit"


@router.post("/trigger")
def trigger_sos(data: SOSCreateRequest, db: Session = Depends(get_db)):
    # 1. Save alert into DB
    sos_record = crud.create_sos_alert(
        db=db,
        latitude=data.latitude,
        longitude=data.longitude,
        user_id=data.user_id,
        caller_name=data.caller_name,
        emergency_type=data.emergency_type,
        message=data.message
    )

    # 2. If user_id is provided, retrieve user's emergency contacts
    emergency_contacts = []
    if data.user_id:
        contacts = crud.get_emergency_contacts(db, data.user_id)
        emergency_contacts = [c.to_dict() for c in contacts]

    return {
        "status": "EMERGENCY_DISPATCHED",
        "alert_id": sos_record.id,
        "message": "High-priority SOS alert broadcasted to emergency responders.",
        "details": {
            "sos": sos_record.to_dict(),
            "notified_contacts": emergency_contacts,
            "coordinates": {
                "latitude": data.latitude,
                "longitude": data.longitude
            },
            "dispatch_channels": [
                "Local Police PCR 112",
                "National Emergency Ambulance 108",
                "Tourist Help Desk"
            ]
        }
>>>>>>> theirs
    }


@router.get("/active")
<<<<<<< ours
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
=======
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = crud.get_active_sos_alerts(db)
    return {
        "count": len(alerts),
        "alerts": [a.to_dict() for a in alerts]
    }


@router.post("/{sos_id}/resolve")
def resolve_sos(sos_id: int, data: SOSResolveRequest, db: Session = Depends(get_db)):
    resolved = crud.resolve_sos_alert(db, sos_id, dispatched_to=data.dispatched_to)
    if not resolved:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    return {
        "status": "success",
        "message": f"SOS Alert #{sos_id} marked as resolved.",
        "alert": resolved.to_dict()
    }
>>>>>>> theirs
