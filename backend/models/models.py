from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    stripe_customer_id = Column(String, nullable=True)
    stripe_payment_method_id = Column(String, nullable=True)   # reused for saved-card payments
    card_last4 = Column(String, nullable=True)
    card_brand = Column(String, nullable=True)
    card_expiry = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    membership = relationship("Membership", back_populates="user", uselist=False)
    bookings = relationship("Booking", back_populates="user")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String, nullable=False)           # standard | premium | premium_plus
    price = Column(Float, nullable=False)
    status = Column(String, default="active")       # active | cancelled
    stripe_subscription_id = Column(String, nullable=True)
    starts_at = Column(DateTime(timezone=True), server_default=func.now())
    renews_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)   # set when cancelled — access valid until this date
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="membership")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = guest
    guest_name = Column(String, nullable=True)
    guest_email = Column(String, nullable=True)
    service = Column(String, nullable=False)        # basic | deluxe | premium
    price = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    appointment_date = Column(String, nullable=False)
    appointment_time = Column(String, nullable=False)
    status = Column(String, default="upcoming")     # upcoming | completed | cancelled
    stripe_payment_intent_id = Column(String, nullable=True)
    booking_ref = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
