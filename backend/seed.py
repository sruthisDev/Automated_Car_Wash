"""
Seed file — runs once on startup if the users table is empty.
Creates two users + sample memberships, bookings, and contact messages.

Login credentials:
  Admin  →  admin@luxewash.com   /  Admin@1234
  User   →  sarah@example.com    /  Sarah@1234
"""

from datetime import datetime, timedelta
import bcrypt
from database import SessionLocal
from models.models import User, Membership, Booking, ContactMessage


def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def run_seed():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        now = datetime.utcnow()

        admin = User(
            full_name="Admin LuxeWash",
            email="admin@luxewash.com",
            password_hash=hash_pw("Admin@1234"),
            is_admin=True,
            card_last4="4242",
            card_brand="visa",
            card_expiry="12/26",
        )

        sarah = User(
            full_name="Sarah Mitchell",
            email="sarah@example.com",
            password_hash=hash_pw("Sarah@1234"),
            is_admin=False,
            card_last4="5555",
            card_brand="mastercard",
            card_expiry="09/27",
        )

        db.add_all([admin, sarah])
        db.flush()  # get IDs before creating related records

        membership = Membership(
            user_id=sarah.id,
            plan="premium",
            price=49.0,
            status="active",
            starts_at=now - timedelta(days=12),
            renews_at=now + timedelta(days=18),
        )
        db.add(membership)

        bookings = [
            Booking(
                user_id=sarah.id,
                service="deluxe",
                price=22.0,
                tax=1.98,
                total=23.98,
                appointment_date=(now - timedelta(days=20)).strftime("%Y-%m-%d"),
                appointment_time="10:00 AM",
                status="completed",
                booking_ref="LW-20250218-1001",
            ),
            Booking(
                user_id=sarah.id,
                service="basic",
                price=12.0,
                tax=1.08,
                total=13.08,
                appointment_date=(now - timedelta(days=8)).strftime("%Y-%m-%d"),
                appointment_time="2:00 PM",
                status="completed",
                booking_ref="LW-20250302-1002",
            ),
            Booking(
                user_id=sarah.id,
                service="premium",
                price=35.0,
                tax=3.15,
                total=38.15,
                appointment_date=(now + timedelta(days=5)).strftime("%Y-%m-%d"),
                appointment_time="11:00 AM",
                status="upcoming",
                booking_ref="LW-20250315-1003",
            ),
            Booking(
                user_id=sarah.id,
                service="deluxe",
                price=22.0,
                tax=1.98,
                total=23.98,
                appointment_date=(now + timedelta(days=2)).strftime("%Y-%m-%d"),
                appointment_time="3:30 PM",
                status="cancelled",
                booking_ref="LW-20250312-1004",
            ),
            Booking(
                user_id=admin.id,
                service="premium",
                price=35.0,
                tax=3.15,
                total=38.15,
                appointment_date=(now - timedelta(days=15)).strftime("%Y-%m-%d"),
                appointment_time="9:00 AM",
                status="completed",
                booking_ref="LW-20250223-2001",
            ),
            Booking(
                user_id=admin.id,
                service="basic",
                price=12.0,
                tax=1.08,
                total=13.08,
                appointment_date=(now + timedelta(days=3)).strftime("%Y-%m-%d"),
                appointment_time="10:30 AM",
                status="upcoming",
                booking_ref="LW-20250313-2002",
            ),
            Booking(
                user_id=None,
                guest_name="Marcus Johnson",
                guest_email="marcus@gmail.com",
                service="deluxe",
                price=22.0,
                tax=1.98,
                total=23.98,
                appointment_date=(now + timedelta(days=7)).strftime("%Y-%m-%d"),
                appointment_time="1:00 PM",
                status="upcoming",
                booking_ref="LW-20250317-3001",
            ),
        ]
        db.add_all(bookings)

        messages = [
            ContactMessage(
                name="Tom Rivera",
                email="tom.rivera@email.com",
                subject="Question about Premium Wash",
                message="Hi, I wanted to ask if the Premium Wash includes tire shine? Looking to book for this weekend.",
            ),
            ContactMessage(
                name="Emily Chen",
                email="emily.chen@email.com",
                subject="Membership cancellation request",
                message="I would like to cancel my Standard membership. Please let me know the process. Thank you.",
            ),
        ]
        db.add_all(messages)

        db.commit()
        print("✅ Seed data created successfully.")

    except Exception as e:
        db.rollback()
        print(f"⚠️  Seed failed: {e}")
    finally:
        db.close()
