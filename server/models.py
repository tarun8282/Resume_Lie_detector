from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20)) # "applicant" or "recruiter"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resumes = relationship("Resume", back_populates="owner")
    test_results = relationship("TestResult", back_populates="user")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_url = Column(String(255)) # Cloudinary URL
    parsed_content = Column(JSON) # Stores extracted skills, experience, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="resumes")
    test_results = relationship("TestResult", back_populates="resume")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    score = Column(Float)
    trust_score = Column(Float) # Calculated based on answer consistency/anti-cheat
    details = Column(JSON) # Detailed breakdown of answers/analysis
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="test_results")
    resume = relationship("Resume", back_populates="test_results")

class GeneratedTest(Base):
    __tablename__ = "generated_tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    questions = Column(JSON) # List of all questions with correct answers
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
