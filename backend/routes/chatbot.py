from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from database import get_db
from models.models import User, Membership, Booking
from routes.dashboard import auto_complete_past_bookings
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")

PLAN_LABELS = {
    "standard":     "Standard",
    "premium":      "Premium",
    "premium_plus": "Premium Plus",
}


class ChatRequest(BaseModel):
    message: str
    token: Optional[str] = None


def get_user_context(token: str, db: Session) -> Optional[dict]:
    """Decode token and return a dict with user's membership + upcoming bookings."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            return None

        ctx = {"name": user.full_name.split()[0]}

        m = db.query(Membership).filter(Membership.user_id == user.id).first()
        if m:
            ctx["membership"] = {
                "plan":      PLAN_LABELS.get(m.plan, m.plan),
                "status":    m.status,
                "starts_at": m.starts_at.strftime("%B %d, %Y") if m.starts_at else None,
                "renews_at": m.renews_at.strftime("%B %d, %Y") if m.renews_at else None,
                "ends_at":   m.ends_at.strftime("%B %d, %Y")   if m.ends_at   else None,
                "price":     m.price,
            }
        else:
            ctx["membership"] = None

        auto_complete_past_bookings(user.id, db)

        bookings = (
            db.query(Booking)
            .filter(Booking.user_id == user.id, Booking.status == "upcoming")
            .order_by(Booking.appointment_date, Booking.appointment_time)
            .all()
        )
        ctx["bookings"] = [
            {
                "service": b.service.title(),
                "date":    b.appointment_date,
                "time":    b.appointment_time,
                "ref":     b.booking_ref,
            }
            for b in bookings
        ]

        return ctx
    except (JWTError, Exception):
        return None


def get_response(msg: str, ctx: Optional[dict] = None) -> str:
    m = msg.lower().strip()

    is_personal = any(k in m for k in [
        'my appointment', 'my booking', 'next appointment', 'upcoming appointment',
        'my schedule', 'when is my', 'my next', 'my membership', 'my plan',
        'membership status', 'my status', 'when does it', 'when does my',
        'when did it start', 'when did my', 'membership start', 'membership end',
        'expire', 'expiry', 'renew', 'renewal', 'my account',
    ])

    if is_personal:
        if not ctx:
            return (
                "🔒 Please log in to view your personal information.\n\n"
                "Once logged in, I can tell you about your upcoming appointments, "
                "membership status, renewal dates, and more!"
            )

        name = ctx["name"]

        if any(k in m for k in ['appointment', 'booking', 'schedule', 'next', 'upcoming']):
            bookings = ctx.get("bookings", [])
            if not bookings:
                return (
                    f"📅 Hi {name}! You have no upcoming appointments right now.\n\n"
                    "Would you like to book one? Head to our Services section to get started!"
                )
            lines = [f"📅 Hi {name}! Here are your upcoming appointments:\n"]
            for i, b in enumerate(bookings[:3], 1):
                lines.append(f"{i}. {b['service']} Wash")
                lines.append(f"   📆 {b['date']}  🕐 {b['time']}")
                lines.append(f"   Ref: {b['ref']}\n")
            return "\n".join(lines).strip()

        mem = ctx.get("membership")
        if not mem:
            return (
                f"Hi {name}! You don't have an active membership yet.\n\n"
                "🏷️ Our plans start at just $29/mo. Check out the Memberships section to sign up!"
            )

        status_icon = "✅" if mem["status"] == "active" else "❌"
        reply = f"🏷️ Hi {name}! Here's your membership info:\n\n"
        reply += f"Plan:    {mem['plan']} — ${mem['price']:.0f}/mo\n"
        reply += f"Status:  {status_icon} {mem['status'].title()}\n"
        if mem["starts_at"]:
            reply += f"Started: {mem['starts_at']}\n"
        if mem["renews_at"] and mem["status"] == "active":
            reply += f"Renews:  {mem['renews_at']}\n"
        if mem["ends_at"] and mem["status"] == "cancelled":
            reply += f"Access until: {mem['ends_at']}\n"
        return reply.strip()

    if any(k in m for k in ['who are you', 'what are you', 'who r u', 'are you a bot', 'are you human',
                             'are you ai', 'your name', 'introduce yourself', 'what can you do',
                             'what do you do', 'how can you help']):
        return (
            "🚗 I'm the LuxeWash Assistant!\n\n"
            "I'm here to help you with:\n"
            "• Services & wash packages\n"
            "• Membership plans & pricing\n"
            "• Booking, hours & location\n"
            "• Your personal appointments & membership (when logged in)\n\n"
            "Just ask me anything!"
        )

    if any(k in m for k in ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup']):
        if ctx:
            return (
                f"👋 Hey {ctx['name']}! Welcome back to LuxeWash!\n\n"
                "I can help you with services, memberships, appointments, or your account details. "
                "What can I do for you today?"
            )
        return (
            "👋 Hi there! Welcome to LuxeWash!\n\n"
            "I can help you with:\n"
            "• 🚗 Services — wash packages & pricing\n"
            "• 🏷️ Memberships — monthly plans & benefits\n"
            "• 📅 Appointments — booking, hours & location\n\n"
            "What can I help you with today?"
        )

    if any(k in m for k in ['thank', 'thanks', 'thx', 'ty']):
        return "You're welcome! 😊 Feel free to ask anything else about our services, memberships, or appointments."

    if any(k in m for k in ['basic wash', 'basic']):
        return (
            "🚿 Basic Wash — $12\n\n"
            "A thorough exterior rinse with premium soap, high-pressure wash, and air dry.\n\n"
            "Includes:\n"
            "• Exterior rinse\n"
            "• Premium foam soap\n"
            "• High-pressure wash\n"
            "• Air dry"
        )

    if any(k in m for k in ['deluxe wash', 'deluxe']):
        return (
            "✨ Deluxe Wash — $22\n\n"
            "Everything in Basic plus interior vacuuming and streak-free window cleaning.\n\n"
            "Includes:\n"
            "• Everything in Basic\n"
            "• Interior vacuum\n"
            "• Window cleaning\n"
            "• Dashboard wipe"
        )

    if any(k in m for k in ['premium wash', 'full detail', 'hand wax', 'tire shine']):
        return (
            "💎 Premium Wash — $35\n\n"
            "Our full-detail experience — hand wax, tire shine, leather conditioning.\n\n"
            "Includes:\n"
            "• Everything in Deluxe\n"
            "• Hand wax & polish\n"
            "• Tire shine\n"
            "• Full interior detail"
        )

    if any(k in m for k in ['service', 'wash', 'price', 'cost', 'how much', 'package', 'offer', 'what do you']):
        return (
            "🚗 LuxeWash Services\n\n"
            "🚿 Basic Wash — $12\n"
            "Exterior rinse, foam soap, high-pressure wash, air dry\n\n"
            "✨ Deluxe Wash — $22\n"
            "Everything in Basic + interior vacuum, window cleaning, dashboard wipe\n\n"
            "💎 Premium Wash — $35\n"
            "Everything in Deluxe + hand wax, tire shine, full interior detail\n\n"
            "Ask me about any specific wash for more details!"
        )

    if any(k in m for k in ['standard plan', 'standard membership', 'standard']):
        return (
            "⭐ Standard Membership — $29/mo\n\n"
            "Great for everyday drivers who want a consistently clean car.\n\n"
            "Includes:\n"
            "• Unlimited Basic Washes\n"
            "• Priority booking\n"
            "• Member discounts\n\n"
            "Not included: Deluxe & Premium access, Priority lane"
        )

    if any(k in m for k in ['premium plus', 'premiumplus']):
        return (
            "👑 Premium Plus Membership — $79/mo\n\n"
            "The ultimate LuxeWash experience — nothing held back.\n\n"
            "Includes:\n"
            "• Unlimited All Washes\n"
            "• Priority lane access\n"
            "• Free monthly full detail\n"
            "• Dedicated support"
        )

    if any(k in m for k in ['premium membership', 'premium plan', 'premium']):
        return (
            "💎 Premium Membership — $49/mo  ⭐ Most Popular\n\n"
            "Covers all your regular car care needs.\n\n"
            "Includes:\n"
            "• Unlimited Basic & Deluxe Washes\n"
            "• Interior vacuum included\n"
            "• Window cleaning\n"
            "• Priority booking\n\n"
            "Not included: Premium Wash, Priority lane"
        )

    if any(k in m for k in ['memberships', 'membership', 'member', 'plan', 'subscribe', 'subscription', 'monthly', 'unlimited']):
        return (
            "🏷️ LuxeWash Memberships\n\n"
            "⭐ Standard — $29/mo\n"
            "Unlimited Basic Washes, priority booking, member discounts\n\n"
            "💎 Premium — $49/mo  ⭐ Most Popular\n"
            "Unlimited Basic & Deluxe, interior vacuum, window cleaning\n\n"
            "👑 Premium Plus — $79/mo\n"
            "Unlimited All Washes, priority lane, free monthly full detail, dedicated support\n\n"
            "Ask me about any specific plan for full details!"
        )

    if any(k in m for k in ['hour', 'open', 'close', 'timing', 'when are you', 'operating']):
        return (
            "🕐 LuxeWash Hours\n\n"
            "Monday – Saturday: 8:00 AM – 7:00 PM\n"
            "Sunday: 9:00 AM – 5:00 PM\n\n"
            "Same-day slots are often available — book online anytime!"
        )

    if any(k in m for k in ['address', 'location', 'where', 'find you', 'direction', 'located']):
        return (
            "📍 LuxeWash Location\n\n"
            "123 CleanRide Street\n"
            "Tracy, CA - 00000\n\n"
            "📞 +1 (555) 123-4567\n"
            "🕐 Mon–Sat: 8am–7pm  |  Sun: 9am–5pm"
        )

    if any(k in m for k in ['book', 'appointment', 'schedule', 'slot', 'reserve', 'available', 'walk']):
        return (
            "📅 Booking an Appointment\n\n"
            "1. Choose your service or membership\n"
            "2. Select a date & time — same-day slots often available\n"
            "3. Drive in and let our expert team handle the rest!\n\n"
            "🕐 Mon–Sat: 8am–7pm  |  Sun: 9am–5pm\n"
            "📍 123 CleanRide Street, Tracy, CA"
        )

    if any(k in m for k in ['contact', 'phone', 'call', 'email', 'reach', 'number']):
        return (
            "📞 Contact LuxeWash\n\n"
            "Phone: +1 (555) 123-4567\n"
            "📍 123 CleanRide Street, Tracy, CA\n\n"
            "🕐 Mon–Sat: 8am–7pm  |  Sun: 9am–5pm"
        )

    return (
        "I'm sorry, I can only assist with LuxeWash services, memberships, and appointments. "
        "For anything else, please contact us at +1 (555) 123-4567 or visit our Contact page."
    )


@router.post("/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    ctx = get_user_context(req.token, db) if req.token else None
    return {"reply": get_response(req.message, ctx)}