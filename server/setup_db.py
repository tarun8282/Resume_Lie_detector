from database import engine, Base
import models

def init_db():
    print("🔄 Initializing database tables on Supabase...")
    try:
        # This will create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    init_db()
