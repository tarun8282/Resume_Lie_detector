from supabase_utils import supabase
import sys

def check_connection():
    try:
        print("🔄 Connecting to Supabase...")
        
        # Try to list buckets to verify admin/service_role access
        print("📂 Listing Storage Buckets:")
        buckets = supabase.storage.list_buckets()
        
        found_resumes = False
        for b in buckets:
            print(f" - {b.name} (Public: {b.public})")
            if b.name == "resumes":
                found_resumes = True
                
        if found_resumes:
            print("\n✅ 'resumes' bucket found!")
            
            # TEST UPLOAD
            print("📝 Attempting to upload a test file to verify WRITE permissions...")
            try:
                test_content = b"This is a test file to verify Supabase write access."
                supabase.storage.from_("resumes").upload("test_connection.txt", test_content, {"upsert": "true", "content-type": "text/plain"})
                print("✅ Write Access Confirmed! File 'test_connection.txt' uploaded successfully.")
                print("🚀 You are good to go! The 'Row-Level Security' error should be gone.")
            except Exception as up_err:
                print(f"❌ Write Failed: {up_err}")
                print("⚠️  You can list buckets but CANNOT upload.")
                print("SOLUTION: Make sure you are using the SERVICE ROLE KEY in .env (not the anon key).")
                
        else:
            print("\n⚠️  'resumes' bucket NOT found. Please create it in Supabase Dashboard (make it Public).")
            
    except Exception as e:
        print(f"\n❌ Connection Failed: {e}")
        print("Check your SUPABASE_URL and SUPABASE_KEY in .env")

if __name__ == "__main__":
    check_connection()
