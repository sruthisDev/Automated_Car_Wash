from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import User, Booking
from routes.auth import get_current_user

router = APIRouter()


class UpdateNameRequest(BaseModel):
    full_name: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ── GET full profile ──────────────────────────────────

@router.get("/profile")
def get_profile(token: str, db: Session = Depends(get_db)):
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
            "renews_at": str(membership.renews_at)[:10] if membership.renews_at else None,
            "ends_at": str(membership.ends_at)[:10] if membership.ends_at else None,
            "starts_at": str(membership.starts_at)[:10] if membership.starts_at else None,
        } if membership else None,
    }


# ── UPDATE name ───────────────────────────────────────

@router.put("/profile/name")
def update_name(payload: UpdateNameRequest, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    user.full_name = payload.full_name
    db.commit()
    # Update stored user data
    return {"full_name": user.full_name}


# ── CHANGE password ───────────────────────────────────

@router.put("/profile/password")
def change_password(payload: ChangePasswordRequest, token: str, db: Session = Depends(get_db)):
    import bcrypt

    user = get_current_user(token, db)
    if not bcrypt.checkpw(payload.current_password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password_hash = bcrypt.hashpw(payload.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db.commit()
    return {"message": "Password updated successfully"}


# ── GET appointments ──────────────────────────────────

@router.get("/appointments")
def get_appointments(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [
        {
            "id": b.id,
            "booking_ref": b.booking_ref,
            "service": b.service,
            "price": b.price,
            "total": b.total,
            "appointment_date": b.appointment_date,
            "appointment_time": b.appointment_time,
            "status": b.status,
            "created_at": str(b.created_at)[:10],
        }
        for b in bookings
    ]


# ── CANCEL appointment ────────────────────────────────

@router.put("/appointments/{booking_id}/cancel")
def cancel_appointment(booking_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == user.id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status != "upcoming":
        raise HTTPException(status_code=400, detail="Only upcoming bookings can be cancelled")

    booking.status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled"}


# ── CANCEL membership ─────────────────────────────────

@router.put("/membership/cancel")
def cancel_membership(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user.membership:
        raise HTTPException(status_code=404, detail="No active membership")

    user.membership.status = "cancelled"
    user.membership.ends_at = user.membership.renews_at   # access valid until paid-up date
    db.commit()
    return {"message": "Membership cancelled"}
