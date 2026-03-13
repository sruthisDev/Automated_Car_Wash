from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from database import get_db
from models.models import User
import os
import asyncio
import secrets
from dotenv import load_dotenv
from routes.email import send_confirmation_email, send_welcome_email, send_reset_email

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))


# ── Schemas ──────────────────────────────────────────

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UpdateNameRequest(BaseModel):
    full_name: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ── Helpers ──────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str, db: Session) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ── Routes ───────────────────────────────────────────

@router.post("/signup")
async def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    asyncio.create_task(send_welcome_email(user.full_name, user.email))
    return {
        "token": token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        }
    }


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    print("you are here")
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    m = user.membership
    return {
        "token": token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "card_last4": user.card_last4,
            "card_brand": user.card_brand,
            "card_expiry": user.card_expiry,
            "membership_plan": m.plan if m else None,
            "membership_status": m.status if m else None,
        }
    }


@router.get("/me")
def get_me(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    membership = user.membership
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "created_at": user.created_at,
        "card_last4": user.card_last4,
        "card_brand": user.card_brand,
        "card_expiry": user.card_expiry,
        "membership": {
            "plan": membership.plan,
            "status": membership.status,
            "price": membership.price,
            "renews_at": membership.renews_at,
        } if membership else None,
    }


@router.put("/change-password")
def change_password(payload: ChangePasswordRequest, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.put("/update-name")
def update_name(payload: UpdateNameRequest, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    user.full_name = payload.full_name
    db.commit()
    return {"message": "Name updated", "full_name": user.full_name}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return success to avoid email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        base_url = os.getenv("APP_BASE_URL", "http://localhost")
        reset_link = f"{base_url}/reset-password?token={token}"
        asyncio.create_task(send_reset_email(user.full_name, user.email, reset_link))
    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user or not user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    if datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Reset link has expired")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    user.password_hash = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    return {"message": "Password reset successful"}
