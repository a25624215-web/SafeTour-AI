from fastapi import FastAPI
from auth import router as auth_router
from tourist import router as tourist_router
from risk import router as risk_router
from geofence import router as geofence_router
from sos import router as sos_router
app = FastAPI(
    title="SafeTour AI Backend",
    description="Backend API for Smart Tourist Safety Monitoring System",
    version="1.0.0"
)
app.include_router(auth_router)
app.include_router(tourist_router)
app.include_router(risk_router)
app.include_router(geofence_router)
app.include_router(sos_router)
@app.get("/" )
def home():
    return {
        "message": "SafeTour AI Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }