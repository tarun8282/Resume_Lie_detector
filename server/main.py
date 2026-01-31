from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routes import auth_routes, resume_routes, test_routes, recruiter_routes

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Lie Detector API",
    description="Backend for AI-Powered Resume Verification",
    version="1.0.0"
)

import os

# Configure CORS to allow requests from the React Frontend
origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in origins if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
