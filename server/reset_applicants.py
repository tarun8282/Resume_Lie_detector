import models
import database
from sqlalchemy.orm import Session

def reset_applicants():
    db: Session = database.SessionLocal()
    try:
        print("⚠️  WARNING: This will delete ALL users with role='applicant' and their data.")
        print("Resumes, Test Results, and Generated Tests will be wiped.")
        confirm = input("Are you sure? Type 'DELETE' to confirm: ")
        
        if confirm != "DELETE":
            print("Operation cancelled.")
            return

        # Fetch applicants
        applicants = db.query(models.User).filter(models.User.role == "applicant").all()
        print(f"Found {len(applicants)} applicants to delete.")

        for app in applicants:
            print(f"Deleting data for: {app.username} ({app.email})")
            
            # Delete Test Results
            # We use synchronize_session=False for bulk deletes if ignoring session objects, 
            # but iterative delete via relationship logic or manual foreign key cleanup is safer
            # if we wanted to be very careful. Here, direct deletion by ID is fine.
            
            db.query(models.TestResult).filter(models.TestResult.user_id == app.id).delete()
            db.query(models.GeneratedTest).filter(models.GeneratedTest.user_id == app.id).delete()
            db.query(models.Resume).filter(models.Resume.user_id == app.id).delete()
            
            # Finally delete the user
            db.delete(app)
            
        db.commit()
        print("✅ Successfully deleted all applicant data.")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_applicants()
