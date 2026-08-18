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
    }


@router.get("/active")
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
