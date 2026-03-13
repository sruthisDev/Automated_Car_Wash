from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import models
from routes import auth, contact, dashboard, payments
from seed import run_seed

# Create all tables, then seed if empty
Base.metadata.create_all(bind=engine)
run_seed()

app = FastAPI(title="LuxeWash API", version="1.0.0")

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])


@app.get("/")
def root():
    return {"message": "LuxeWash API is running"}
