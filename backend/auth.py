<<<<<<< ours
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from passlib.context import CryptContext


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Demo secret — later this will move to an environment variable
SECRET_KEY = "CHANGE_THIS_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Temporary in-memory storage.
# Later we will replace this with the real database.
users = {}


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
=======
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from sqlalchemy.orm import Session
import hashlib
from database import get_db
import crud
import models

import bcrypt

router = APIRouter(prefix="/auth", tags=["Authentication"])


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password


# =========================================================
# SCHEMAS
# =========================================================
class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class UserLoginRequest(BaseModel):
>>>>>>> theirs
    email: str
    password: str


<<<<<<< ours
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@router.post("/register")
def register(user: RegisterRequest):

    if user.email in users:
        raise HTTPException(
            status_code=409,
            detail="User already registered"
        )

    users[user.email] = {
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password)
    }

    return {
        "message": "Registration successful",
        "email": user.email
    }


@router.post("/login")
def login(user: LoginRequest):

    stored_user = users.get(user.email)

    if not stored_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        stored_user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(user.email)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }
=======
class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    relationship: Optional[str] = None
    is_primary: bool = False


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

    # Hash password & create user
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

    contacts = crud.get_emergency_contacts(db, user.id)

    return {
        "status": "success",
        "message": "Login successful",
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
>>>>>>> theirs
