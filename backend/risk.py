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