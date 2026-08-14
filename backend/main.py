
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# =========================================================
# YATRA SAFE AI - FastAPI Application
# =========================================================

app = FastAPI(
    title="YATRA SAFE AI",
    description="AI-powered travel safety and assistance system",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "project": "YATRA SAFE AI",
        "status": "running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "project": "YATRA SAFE AI",
        "status": "healthy"
    }


# =========================================================
# SAFETY REQUEST MODEL
# =========================================================

class SafetyRequest(BaseModel):
    location: str
    time: str
    crowd_level: str
    emergency: bool = False


# =========================================================
# SAFETY ANALYSIS API
# =========================================================

@app.post("/analyze-safety")
def analyze_safety(data: SafetyRequest):

    risk_score = 0

    # Crowd analysis
    if data.crowd_level.lower() == "low":
        risk_score += 2

    elif data.crowd_level.lower() == "medium":
        risk_score += 1

    # Emergency condition
    if data.emergency:
        risk_score += 5

    # Time analysis
    if data.time.lower() in ["night", "late night"]:
        risk_score += 2

    # Risk calculation
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
        "project": "YATRA SAFE AI",
        "location": data.location,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }
   # =========================================================
# EMERGENCY ALERT API
# =========================================================

class EmergencyRequest(BaseModel):
    name: str
    location: str
    emergency_type: str
    message: str


@app.post("/emergency-alert")
def emergency_alert(data: EmergencyRequest):

    return {
        "project": "YATRA SAFE AI",
        "alert_status": "ACTIVE",
        "message": "Emergency alert generated successfully",
        "name": data.name,
        "location": data.location,
        "emergency_type": data.emergency_type,
        "details": data.message
    }
     # =========================================================
# NEARBY SAFETY POINTS
# =========================================================

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
            "project": "YATRA SAFE AI",
            "count": len(places),
            "places": places
        }

    except Exception as error:

        return {
            "project": "YATRA SAFE AI",
            "count": 0,
            "places": [],
            "error": "Unable to fetch nearby safety points."
        }
    # =========================================================
# GEOFENCE / ZONE SAFETY CHECK
# =========================================================

DEMO_ZONES = [
    {
        "name": "Demo Restricted Zone",
        "latitude": 26.4499,
        "longitude": 80.3319,
        "radius_km": 1.0
    },
    {
        "name": "Demo Caution Zone",
        "latitude": 26.4600,
        "longitude": 80.3400,
        "radius_km": 1.5
    }
]


def calculate_distance(lat1, lon1, lat2, lon2):

    from math import radians, sin, cos, sqrt, atan2

    earth_radius = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c


@app.get("/zone-check")
def zone_check(latitude: float, longitude: float):

    for zone in DEMO_ZONES:

        distance = calculate_distance(
            latitude,
            longitude,
            zone["latitude"],
            zone["longitude"]
        )

        if distance <= zone["radius_km"]:

            return {
                "project": "YATRA SAFE AI",
                "inside_zone": True,
                "zone_name": zone["name"],
                "distance_km": round(distance, 2),
                "risk_level": "CAUTION",
                "message": (
                    "You are inside a configured caution zone. "
                    "Stay alert and follow local safety guidance."
                )
            }

    return {
        "project": "YATRA SAFE AI",
        "inside_zone": False,
        "zone_name": None,
        "distance_km": None,
        "risk_level": "LOW",
        "message": "No configured caution zone detected."
    }