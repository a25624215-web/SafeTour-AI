from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
import crud
import models

router = APIRouter(prefix="/sos", tags=["SOS & Emergency"])

# Temporary in-memory storage (Aapka database variable)
sos_alerts = []

# =========================================================
# SCHEMAS (Data Models)
# =========================================================

# Aapka Request Schema
class SOSRequest(BaseModel):
    tourist_email: str
    latitude: float
    longitude: float
    risk_level: str
    emergency_contact: str
    incident_type: str

# Team Member ke Request Schemas
class SOSCreateRequest(BaseModel):
    latitude: float
    longitude: float
    user_id: Optional[int] = None
    caller_name: Optional[str] = "Anonymous Tourist"
    emergency_type: Optional[str] = "General SOS"
    message: Optional[str] = "Emergency Assistance Requested"

class SOSResolveRequest(BaseModel):
    dispatched_to: Optional[str] = "PCR Patrol Unit"


# =========================================================
# ENDPOINTS
# =========================================================

# --- AAPKE ENDPOINTS ---

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


# --- TEAM MEMBER KE ENDPOINTS ---

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


# --- COMBINED ACTIVE & RESOLVE LOGIC ---

@router.get("/active")
def get_active_alerts(db: Session = Depends(get_db)):
    # Local in-memory active list (Aapka code fallback ke liye)
    local_active = [alert for alert in sos_alerts if alert["status"] == "ACTIVE"]
    
    # DB active list (Team member ka code)
    db_alerts = crud.get_active_sos_alerts(db)
    
    return {
        "count": len(db_alerts) + len(local_active),
        "db_alerts": [a.to_dict() for a in db_alerts],
        "local_alerts": local_active
    }


# Backward-compatible resolve for in-memory lists (Aapka check)
@router.put("/{sos_id}/resolve-local")
def resolve_sos_local(sos_id: int):
    for alert in sos_alerts:
        if alert["id"] == sos_id:
            alert["status"] = "RESOLVED"
            return {
                "message": "Local SOS alert resolved successfully",
                "alert": alert
            }
    raise HTTPException(status_code=404, detail="Local SOS alert not found")


# Real DB Resolve endpoint (Team Member ka check)
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
