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
    email: str
    password: str


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