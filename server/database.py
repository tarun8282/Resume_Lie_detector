from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from urllib.parse import quote_plus

load_dotenv()

# Example: postgresql://postgres:password@db.supabase.co:5432/postgres
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Fallback to local MySQL if DATABASE_URL is not set (optional, but keep for safety during transition)
    from urllib.parse import quote_plus
    DB_USER = quote_plus(os.getenv("DB_USER", "root"))
    DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", ""))
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "resume_lie_detector")
    SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
