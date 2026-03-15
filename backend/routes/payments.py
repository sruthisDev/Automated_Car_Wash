from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import User, Booking, Membership
from routes.auth import get_current_user
from routes.email import send_confirmation_email
import stripe
import os
import random
import string
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

TAX_RATE = 0.09  # california state tax

SERVICE_PRICES = {
    "basic": 12.0,
    "deluxe": 22.0,
    "premium": 35.0,
}

MEMBERSHIP_PRICES = {
    "standard": 29.0,
    "premium": 49.0,
    "premium_plus": 79.0,
}

SERVICE_LABELS = {
    "basic": "Basic Wash",
    "deluxe": "Deluxe Wash",
    "premium": "Premium Wash",
}

MEMBERSHIP_LABELS = {
    "standard": "Standard Membership",
    "premium": "Premium Membership",
    "premium_plus": "Premium Plus Membership",
}

# Which services are free under each membership plan
MEMBERSHIP_COVERAGE = {
    "standard":     ["basic"],
    "premium":      ["basic", "deluxe"],
    "premium_plus": ["basic", "deluxe", "premium"],
}

# Discount % on non-covered services for each plan
MEMBERSHIP_DISCOUNTS = {
    "standard":     0.10,   # 10% off deluxe & premium
    "premium":      0.20,   # 20% off premium wash
    "premium_plus": 0.00,   # everything covered, no need for discount
}


def gen_booking_ref():
    date_str = datetime.now().strftime("%Y%m%d")
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"LW-{date_str}-{suffix}"


def _save_card_to_user(user: User, pm_id: str):
    """Retrieve PM details from Stripe and persist to user row."""
    pm = stripe.PaymentMethod.retrieve(pm_id)
    user.stripe_payment_method_id = pm_id
    user.card_last4 = pm.card.last4
    user.card_brand = pm.card.brand
    user.card_expiry = f"{pm.card.exp_month:02d}/{str(pm.card.exp_year)[-2:]}"


def _ensure_stripe_customer(user: User, db: Session) -> str:
    """Create Stripe customer if not already present, return customer_id."""
    if user.stripe_customer_id:
        return user.stripe_customer_id
    customer = stripe.Customer.create(email=user.email, name=user.full_name)
    user.stripe_customer_id = customer.id
    db.flush()
    return customer.id


class ConfirmationRequest(BaseModel):
    type: str
    customer_name: str | None = None
    customer_email: str | None = None
    service: str | None = None
    booking_ref: str | None = None
    appointment_date: str | None = None
    appointment_time: str | None = None
    price: float | None = None
    tax: float | None = None
    total: float | None = None
    plan: str | None = None
    renews_at: str | None = None
    card_last4: str | None = None
    card_brand: str | None = None
    covered_by_membership: bool = False


@router.post("/send-confirmation")
async def send_confirmation(payload: ConfirmationRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_confirmation_email, payload.model_dump())
    return {"message": "Email queued"}


class ServiceCheckoutRequest(BaseModel):
    service: str
    appointment_date: str
    appointment_time: str
    guest_name: str | None = None
    guest_email: str | None = None
    payment_method_id: str | None = None   # None = use saved card on file


class MembershipCheckoutRequest(BaseModel):
    plan: str
    payment_method_id: str | None = None   # None = use saved card on file


@router.post("/service")
async def checkout_service(
    payload: ServiceCheckoutRequest,
    db: Session = Depends(get_db),
    token: str = None,
):
    if payload.service not in SERVICE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid service")

    price = SERVICE_PRICES[payload.service]
    tax = round(price * TAX_RATE, 2)
    total = round(price + tax, 2)

    user = None
    if token:
        try:
            user = get_current_user(token, db)
        except Exception:
            pass  # guest checkout, token failure is non-fatal

    customer_email = user.email if user else payload.guest_email
    customer_name  = user.full_name if user else payload.guest_name

    if not customer_email:
        raise HTTPException(status_code=400, detail="Email is required for guest checkout")

    covered = False
    discount_pct = 0.0
    if user and user.membership and user.membership.status == "active":
        coverage = MEMBERSHIP_COVERAGE.get(user.membership.plan, [])
        if payload.service in coverage:
            covered = True
        else:
            discount_pct = MEMBERSHIP_DISCOUNTS.get(user.membership.plan, 0.0)

    if not covered and discount_pct > 0:
        price = round(price * (1 - discount_pct), 2)
        tax   = round(price * TAX_RATE, 2)
        total = round(price + tax, 2)

    if covered:
        booking = Booking(
            user_id=user.id,
            service=payload.service,
            price=0.0,
            tax=0.0,
            total=0.0,
            appointment_date=payload.appointment_date,
            appointment_time=payload.appointment_time,
            status="upcoming",
            stripe_payment_intent_id=None,
            booking_ref=gen_booking_ref(),
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {
            "success": True,
            "type": "service",
            "booking_ref": booking.booking_ref,
            "service": payload.service,
            "service_label": SERVICE_LABELS[payload.service],
            "appointment_date": payload.appointment_date,
            "appointment_time": payload.appointment_time,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "price": 0.0,
            "tax": 0.0,
            "total": 0.0,
            "covered_by_membership": True,
            "card_last4": None,
            "card_brand": None,
        }

    try:
        if payload.payment_method_id:
            pm_id = payload.payment_method_id
            if user:
                customer_id = _ensure_stripe_customer(user, db)
                stripe.PaymentMethod.attach(pm_id, customer=customer_id)
            else:
                customer = stripe.Customer.create(email=customer_email, name=customer_name)
                customer_id = customer.id
                stripe.PaymentMethod.attach(pm_id, customer=customer_id)
        elif user and user.stripe_payment_method_id:
            pm_id = user.stripe_payment_method_id
            customer_id = _ensure_stripe_customer(user, db)
        else:
            raise HTTPException(status_code=400, detail="No payment method provided")

        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),  # stripe expects cents
            currency="usd",
            customer=customer_id,
            payment_method=pm_id,
            confirm=True,
            automatic_payment_methods={"enabled": True, "allow_redirects": "never"},  # prevents 3DS redirects breaking server-side confirm
            description=f"LuxeWash — {SERVICE_LABELS[payload.service]}",
            receipt_email=customer_email,
        )

        if intent.status != "succeeded":
            raise HTTPException(status_code=400, detail="Payment failed")

        if user and payload.payment_method_id:
            _save_card_to_user(user, pm_id)

        booking = Booking(
            user_id=user.id if user else None,
            guest_name=customer_name if not user else None,
            guest_email=customer_email if not user else None,
            service=payload.service,
            price=price,
            tax=tax,
            total=total,
            appointment_date=payload.appointment_date,
            appointment_time=payload.appointment_time,
            status="upcoming",
            stripe_payment_intent_id=intent.id,
            booking_ref=gen_booking_ref(),
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {
            "success": True,
            "type": "service",
            "booking_ref": booking.booking_ref,
            "service": payload.service,
            "service_label": SERVICE_LABELS[payload.service],
            "appointment_date": payload.appointment_date,
            "appointment_time": payload.appointment_time,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "price": price,
            "tax": tax,
            "total": total,
            "covered_by_membership": False,
            "member_discount_pct": discount_pct,
            "card_last4": user.card_last4 if user else None,
            "card_brand": user.card_brand if user else None,
        }

    except stripe.error.CardError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))
    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e.user_message)}")


@router.post("/membership")
async def checkout_membership(
    payload: MembershipCheckoutRequest,
    token: str,
    db: Session = Depends(get_db),
):
    if payload.plan not in MEMBERSHIP_PRICES:
        raise HTTPException(status_code=400, detail="Invalid plan")

    user = get_current_user(token, db)
    price = MEMBERSHIP_PRICES[payload.plan]

    try:
        customer_id = _ensure_stripe_customer(user, db)

        if payload.payment_method_id:
            pm_id = payload.payment_method_id
            stripe.PaymentMethod.attach(pm_id, customer=customer_id)
        elif user.stripe_payment_method_id:
            pm_id = user.stripe_payment_method_id
        else:
            raise HTTPException(status_code=400, detail="No payment method provided")

        intent = stripe.PaymentIntent.create(
            amount=int(price * 100),
            currency="usd",
            customer=customer_id,
            payment_method=pm_id,
            confirm=True,
            automatic_payment_methods={"enabled": True, "allow_redirects": "never"},
            description=f"LuxeWash — {MEMBERSHIP_LABELS[payload.plan]}",
            receipt_email=user.email,
        )

        if intent.status != "succeeded":
            raise HTTPException(status_code=400, detail="Payment failed")

        if payload.payment_method_id:
            _save_card_to_user(user, pm_id)

        renews = datetime.utcnow() + timedelta(days=30)  # monthly billing cycle

        if user.membership:
            user.membership.plan = payload.plan
            user.membership.price = price
            user.membership.status = "active"
            user.membership.starts_at = datetime.utcnow()
            user.membership.renews_at = renews
            user.membership.ends_at = None
        else:
            membership = Membership(
                user_id=user.id,
                plan=payload.plan,
                price=price,
                status="active",
                renews_at=renews,
            )
            db.add(membership)

        db.commit()

        return {
            "success": True,
            "type": "membership",
            "plan": payload.plan,
            "plan_label": MEMBERSHIP_LABELS[payload.plan],
            "price": price,
            "customer_name": user.full_name,
            "customer_email": user.email,
            "renews_at": renews.strftime("%B %d, %Y"),
            "card_last4": user.card_last4,
            "card_brand": user.card_brand,
        }

    except stripe.error.CardError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))
    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e.user_message)}")


class UpdateCardRequest(BaseModel):
    payment_method_id: str


@router.put("/update-card")
async def update_card(
    payload: UpdateCardRequest,
    token: str,
    db: Session = Depends(get_db),
):
    user = get_current_user(token, db)
    try:
        customer_id = _ensure_stripe_customer(user, db)
        stripe.PaymentMethod.attach(payload.payment_method_id, customer=customer_id)
        _save_card_to_user(user, payload.payment_method_id)
        db.commit()
        return {
            "card_last4": user.card_last4,
            "card_brand": user.card_brand,
            "card_expiry": user.card_expiry,
        }
    except stripe.error.CardError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Card update failed: {str(e.user_message)}")
