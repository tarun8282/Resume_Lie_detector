import models
import database
from auth import get_password_hash
from sqlalchemy.orm import Session

# ==========================================
# CONFIGURATION: EDIT THESE VALUES
# ==========================================
NEW_USERNAME = "admin"
NEW_EMAIL = "admin@company.com"
NEW_PASSWORD = "securepassword123"
# ==========================================

def create_recruiter_user():
    db: Session = database.SessionLocal()
    try:
        # Check if user exists
        existing_user = db.query(models.User).filter(models.User.email == NEW_EMAIL).first()
        if existing_user:
            print(f"User with email {NEW_EMAIL} already exists.")
            # Optional: Update password/role if needed
            # existing_user.role = "recruiter"
            # existing_user.password_hash = get_password_hash(NEW_PASSWORD)
            # db.commit()
            return

        new_user = models.User(
            username=NEW_USERNAME,
            email=NEW_EMAIL,
            password_hash=get_password_hash(NEW_PASSWORD),
            role="recruiter" # Explicitly set as recruiter
        )
        db.add(new_user)
        db.commit()
        print(f"Successfully created recruiter user: {NEW_USERNAME} ({NEW_EMAIL})")
        
    except Exception as e:
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_recruiter_user()
