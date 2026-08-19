<<<<<<< ours
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/risk",
    tags=["Risk Engine"]
)


class RiskRequest(BaseModel):
    location_risk: int
    time_risk: int
    weather_risk: int
    crowd_risk: int
    distance_risk: int
    route_deviation: bool
    current_alert: int


def calculate_risk(data: RiskRequest):

    score = (
        data.location_risk * 25
        + data.time_risk * 15
        + data.weather_risk * 10
        + data.crowd_risk * 10
        + data.distance_risk * 20
        + (15 if data.route_deviation else 0)
        + data.current_alert * 5
    )

    # Maximum possible score = 100
    score = min(score, 100)

    if score >= 75:
        risk_level = "CRITICAL"
    elif score >= 50:
        risk_level = "HIGH"
    elif score >= 25:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    return score, risk_level


@router.post("/calculate")
def calculate_safety_risk(data: RiskRequest):

    score, risk_level = calculate_risk(data)

    return {
        "safety_score": 100 - score,
        "risk_level": risk_level
    }
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
import crud
import models

router = APIRouter(prefix="/risk", tags=["Risk Engine & Incident Reporting"])


class SafetyAnalysisInput(BaseModel):
    location: str
    time: str  # 'day', 'night', 'late night'
    crowd_level: str  # 'high', 'medium', 'low'
    emergency: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SafetyReportCreate(BaseModel):
    user_id: Optional[int] = None
    location_id: Optional[int] = None
    report_type: str
    severity: str = "medium"  # 'low', 'medium', 'high', 'critical'
    description: str
    latitude: float
    longitude: float


@router.post("/analyze")
def analyze_safety(data: SafetyAnalysisInput, db: Session = Depends(get_db)):
    risk_score = 0
    factors = []

    # Crowd analysis
    if data.crowd_level.lower() == "low":
        risk_score += 2
        factors.append("Low crowd density (isolated area)")
    elif data.crowd_level.lower() == "medium":
        risk_score += 1

    # Emergency condition
    if data.emergency:
        risk_score += 5
        factors.append("Active emergency signal flagged")

    # Time of day analysis
    if data.time.lower() in ["night", "late night"]:
        risk_score += 2
        factors.append("Nighttime transit condition")

    # If coordinates are given, check if in DB geofence zones
    inside_geofence = False
    if data.latitude is not None and data.longitude is not None:
        matched = crud.check_point_in_geofences(db, data.latitude, data.longitude)
        if matched:
            inside_geofence = True
            risk_score += 3
            factors.append(f"Located within hazard geofence: {matched[0]['name']}")

    # Calculate final tier
    if risk_score >= 5:
        risk_level = "HIGH"
        recommendation = (
            "Avoid travelling alone. Move towards a safe, well-lit, populated location "
            "and alert your emergency contacts or police if necessary."
        )
    elif risk_score >= 3:
        risk_level = "MEDIUM"
        recommendation = (
            "Stay alert. Prefer crowded, well-lit avenues and keep your emergency contacts accessible."
        )
    else:
        risk_level = "LOW"
        recommendation = (
            "Current conditions appear safe. Maintain situational awareness and stay on marked paths."
        )

    return {
        "location": data.location,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "factors": factors,
        "inside_geofence": inside_geofence
    }


@router.post("/report")
def submit_safety_report(data: SafetyReportCreate, db: Session = Depends(get_db)):
    report = crud.create_safety_report(
        db=db,
        report_type=data.report_type,
        severity=data.severity,
        description=data.description,
        latitude=data.latitude,
        longitude=data.longitude,
        user_id=data.user_id,
        location_id=data.location_id
    )
    return {
        "status": "success",
        "message": "Incident report logged into Sentinel safety registry.",
        "report": report.to_dict()
    }


@router.get("/reports")
def get_safety_reports(limit: int = 50, db: Session = Depends(get_db)):
    reports = crud.get_recent_safety_reports(db, limit=limit)
    return {
        "count": len(reports),
        "reports": [r.to_dict() for r in reports]
    }
>>>>>>> theirs
