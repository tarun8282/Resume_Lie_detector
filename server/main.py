from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routes import auth_routes, resume_routes, test_routes, recruiter_routes

# Create database tables
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables verified/created.")
except Exception as e:
    print(f"❌ DATABASE STARTUP ERROR: {e}")

app = FastAPI(
    title="Resume Lie Detector API",
    description="Backend for AI-Powered Resume Verification",
    version="1.0.0"
)

import os

# Configure CORS - Allowing ALL origins for troubleshooting
# This is safe because we use JWT and no cookies for sensitive state
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug: Print startup info to Render logs
print("🚀 Server starting with UNIVERSAL CORS (*)")
print(f"DATABASE_URL set: {'Yes' if os.getenv('DATABASE_URL') else 'No'}")
print(f"FRONTEND_URL set: {os.getenv('FRONTEND_URL')}")

app.include_router(auth_routes.router)
app.include_router(resume_routes.router)
app.include_router(test_routes.router)
app.include_router(recruiter_routes.router)

@app.get("/")
def read_root():
    return {"message": "Resume Lie Detector Backend is Running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
