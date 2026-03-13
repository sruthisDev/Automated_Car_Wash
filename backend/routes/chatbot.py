from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


def get_response(msg: str) -> str:
    m = msg.lower().strip()

    # ── GREETINGS ─────────────────────────────────────────────
    if any(k in m for k in ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup']):
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

    # ── SERVICES — specific ───────────────────────────────────
    if any(k in m for k in ['basic wash', 'basic']):
        return (
            "🚿 Basic Wash — $12\n\n"
            "A thorough exterior rinse with premium soap, high-pressure wash, and air dry. "
            "Perfect for a quick refresh.\n\n"
            "Includes:\n"
            "• Exterior rinse\n"
            "• Premium foam soap\n"
            "• High-pressure wash\n"
            "• Air dry"
        )

    if any(k in m for k in ['deluxe wash', 'deluxe']):
        return (
            "✨ Deluxe Wash — $22\n\n"
            "Everything in Basic plus interior vacuuming and streak-free window cleaning inside and out.\n\n"
            "Includes:\n"
            "• Everything in Basic\n"
            "• Interior vacuum\n"
            "• Window cleaning\n"
            "• Dashboard wipe"
        )

    if any(k in m for k in ['premium wash', 'full detail', 'hand wax', 'tire shine']):
        return (
            "💎 Premium Wash — $35\n\n"
            "Our full-detail experience — hand wax, tire shine, leather conditioning, and complete interior detail.\n\n"
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

    # ── MEMBERSHIPS — specific ────────────────────────────────
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

    if any(k in m for k in ['membership', 'member', 'plan', 'subscribe', 'subscription', 'monthly', 'unlimited']):
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

    # ── APPOINTMENTS / LOCATION / HOURS ───────────────────────
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

    # ── OFF-TOPIC DEFLECTION ──────────────────────────────────
    return (
        "I'm sorry, I can only assist with LuxeWash services, memberships, and appointments. "
        "For anything else, please contact us at +1 (555) 123-4567 or visit our Contact page."
    )


@router.post("/chat")
def chat(req: ChatRequest):
    return {"reply": get_response(req.message)}