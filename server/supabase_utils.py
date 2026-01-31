import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def upload_to_supabase(file_obj, filename: str, bucket_name: str = "resumes") -> str:
    """
    Uploads a file object to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    try:
        # Upload file (overwrites if exists)
        # file_obj.read() might be needed depending on the object type, 
        # but supabase-py usually expects bytes or a file-like object.
        # We'll read the bytes to be safe.
        file_content = file_obj.read()
        
        # Determine content type
        content_type = "application/pdf"
        if filename.endswith(".txt"):
            content_type = "text/plain"

        # 'upsert': 'true' to overwrite
        res = supabase.storage.from_(bucket_name).upload(
            path=filename,
            file=file_content,
            file_options={"content-type": content_type, "upsert": "true"}
        )
        
        # Get Public URL
        public_url_res = supabase.storage.from_(bucket_name).get_public_url(filename)
        return public_url_res
        
    except Exception as e:
        print(f"Supabase Upload Error: {e}")
        raise e
