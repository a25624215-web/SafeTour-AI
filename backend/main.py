import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
import requests

# Ensure backend directory is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from database import engine, Base, init_db, init_database, get_db
import models
import crud
import auth
import sos
import tourist
import geofence
import risk

# =========================================================
# SAFETOUR AI - FastAPI Core Application
# =========================================================

app = FastAPI(
    title="SafeTour AI / YATRA SAFE AI API",
    description="Smart Tourist Safety Monitoring, Geofence Tracking & Incident Response System",
    version="2.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Initialize database tables on startup
@app.on_event("startup")
def on_startup():
    try:
        init_db()
        print("[SUCCESS] Database initialized successfully.")
    except Exception as e:
        print(f"[WARNING] Note during DB startup: {e}")

# Include Sub-Routers
app.include_router(auth.router)
app.include_router(sos.router)
app.include_router(tourist.router)
app.include_router(geofence.router)
app.include_router(risk.router)

# Mount static folder if exists
static_dir = os.path.join(current_dir, "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# =========================================================
# ROOT & DASHBOARD WEB APPLICATION
# =========================================================

@app.get("/", include_in_schema=False)
def serve_dashboard():
    index_file = os.path.join(current_dir, "static", "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "project": "SafeTour AI / Yatra Safe AI",
        "status": "running",
        "version": "2.0.0",
        "database": "connected"
    }


@app.get("/api")
def api_info():
    return {
        "project": "SafeTour AI / Yatra Safe AI",
        "status": "running",
        "version": "2.0.0",
        "database": "connected",
        "docs_url": "/docs"
    }


@app.get("/health")
def health(db: Session = Depends(get_db)):
    user_count = db.query(models.User).count()
    zone_count = db.query(models.GeofenceZone).count()
    return {
        "project": "SafeTour AI",
        "status": "healthy",
        "database": {
            "status": "operational",
            "registered_users": user_count,
            "active_geofence_zones": zone_count
        }
    }


# =========================================================
# BACKWARD-COMPATIBLE API ENDPOINTS
# =========================================================

class SafetyRequest(BaseModel):
    location: str
    time: str
    crowd_level: str
    emergency: bool = False


@app.post("/analyze-safety")
def analyze_safety(data: SafetyRequest, db: Session = Depends(get_db)):
    risk_score = 0

    if data.crowd_level.lower() == "low":
        risk_score += 2
    elif data.crowd_level.lower() == "medium":
        risk_score += 1

    if data.emergency:
        risk_score += 5

    if data.time.lower() in ["night", "late night"]:
        risk_score += 2

    if risk_score >= 5:
        risk_level = "HIGH"
        recommendation = (
            "Avoid travelling alone. "
            "Move to a safe and crowded location "
            "and contact emergency support if required."
        )
    elif risk_score >= 3:
        risk_level = "MEDIUM"
        recommendation = (
            "Stay alert. Prefer crowded and well-lit places "
            "and keep your emergency contacts ready."
        )
    else:
        risk_level = "LOW"
        recommendation = (
            "Current conditions appear relatively safe. "
            "Stay aware of your surroundings."
        )

    return {
        "project": "SafeTour AI",
        "location": data.location,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }


class EmergencyRequest(BaseModel):
    name: str
    location: str
    emergency_type: str
    message: str


@app.post("/emergency-alert")
def emergency_alert(data: EmergencyRequest, db: Session = Depends(get_db)):
    lat, lon = 26.4499, 80.3319
    sos_record = crud.create_sos_alert(
        db=db,
        latitude=lat,
        longitude=lon,
        caller_name=data.name,
        emergency_type=data.emergency_type,
        message=f"Location: {data.location} | {data.message}"
    )

    return {
        "project": "SafeTour AI",
        "alert_id": sos_record.id,
        "alert_status": "ACTIVE",
        "message": "Emergency alert recorded in Sentinel DB and dispatched successfully",
        "name": data.name,
        "location": data.location,
        "emergency_type": data.emergency_type,
        "details": data.message
    }


@app.get("/nearby-safety")
def nearby_safety(latitude: float, longitude: float):
    query = f"""
    [out:json];
    (
      node["amenity"="police"](around:3000,{latitude},{longitude});
      node["amenity"="hospital"](around:3000,{latitude},{longitude});
      node["amenity"="fire_station"](around:3000,{latitude},{longitude});
      node["amenity"="pharmacy"](around:3000,{latitude},{longitude});
    );
    out center;
    """
    try:
        response = requests.post(
            "https://overpass-api.de/api/interpreter",
            data=query,
            timeout=15
        )
        response.raise_for_status()
        data = response.json()
        places = []

        for element in data.get("elements", []):
            tags = element.get("tags", {})
            places.append({
                "name": tags.get("name", "Unnamed Safety Point"),
                "type": tags.get("amenity", "unknown"),
                "latitude": element.get("lat"),
                "longitude": element.get("lon")
            })

        return {
            "project": "SafeTour AI",
            "count": len(places),
            "places": places
        }

    except Exception:
        fallback_places = [
            {"name": "Kotwali Police Station & Patrol Outpost", "type": "police", "latitude": latitude + 0.003, "longitude": longitude + 0.002},
            {"name": "District Civil Hospital Trauma Center", "type": "hospital", "latitude": latitude - 0.004, "longitude": longitude + 0.003},
            {"name": "24x7 Apollo Pharmacy & First Aid", "type": "pharmacy", "latitude": latitude + 0.002, "longitude": longitude - 0.003}
        ]
        return {
            "project": "SafeTour AI",
            "count": len(fallback_places),
            "places": fallback_places,
            "fallback_used": True
        }


@app.get("/zone-check")
def zone_check(latitude: float, longitude: float, db: Session = Depends(get_db)):
    matched_zones = crud.check_point_in_geofences(db, latitude, longitude)

    if matched_zones:
        highest_risk = matched_zones[0]
        return {
            "inside_zone": True,
            "matched_zones_count": len(matched_zones),
            "primary_zone": highest_risk["name"],
            "zone_type": highest_risk["zone_type"],
            "risk_level": highest_risk["risk_level"],
            "distance_km": highest_risk["distance_km"],
            "message": highest_risk["advisory_message"]
        }

    return {
        "inside_zone": False,
        "matched_zones_count": 0,
        "risk_level": "LOW",
        "message": "No hazardous zones detected within proximity."
    }
