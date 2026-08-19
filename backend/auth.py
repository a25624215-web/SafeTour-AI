from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import hashlib
import bcrypt
from database import get_db
import crud
import models

router = APIRouter(prefix="/auth", tags=["Authentication"])

# JWT Settings
SECRET_KEY = "CHANGE_THIS_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =========================================================
# SCHEMAS (Data Models)
# =========================================================
class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    relationship: Optional[str] = None
    is_primary: bool = False


# =========================================================
# HELPER FUNCTIONS
# =========================================================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password

def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# =========================================================
# ENDPOINTS
# =========================================================
@router.post("/register")
def register(data: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = crud.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address is already registered."
        )

    # Hash password & create user in DB
    hashed = hash_password(data.password)
    user = crud.create_user(
        db=db,
        name=data.name,
        email=data.email,
        password_hash=hashed,
        phone=data.phone,
        role="tourist"
    )

    # Add emergency contact if provided
    if data.emergency_contact_phone:
        contact_name = data.emergency_contact_name or "Emergency Contact"
        crud.add_emergency_contact(
            db=db,
            user_id=user.id,
            name=contact_name,
            phone=data.emergency_contact_phone,
            relationship="Primary Emergency Contact",
            is_primary=True
        )

    return {
        "status": "success",
        "message": "Tourist registered successfully",
        "user": user.to_dict()
    }


@router.post("/login")
def login(data: UserLoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password."
        )

    token = create_access_token(user.email)
    contacts = crud.get_emergency_contacts(db, user.id)

    return {
        "status": "success",
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict(),
        "emergency_contacts": [c.to_dict() for c in contacts]
    }


@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    contacts = crud.get_emergency_contacts(db, user.id)
    return {
        "user": user.to_dict(),
        "emergency_contacts": [c.to_dict() for c in contacts]
    }


@router.post("/user/{user_id}/contacts")
def add_contact(user_id: int, data: EmergencyContactCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    contact = crud.add_emergency_contact(
        db=db,
        user_id=user_id,
        name=data.name,
        phone=data.phone,
        relationship=data.relationship,
        is_primary=data.is_primary
    )
    return {
        "status": "success",
        "contact": contact.to_dict()
    }
