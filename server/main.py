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

# Configure CORS
# Add your local and production URLs here
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)
    # Handle both with and without trailing slash automatically
    if frontend_url.endswith("/"):
        origins.append(frontend_url[:-1])
    else:
        origins.append(frontend_url + "/")

# Debug print to help verify in Render logs
print(f"DEBUG: Allowed CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
