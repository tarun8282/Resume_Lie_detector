from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import models, database, auth
from supabase_utils import upload_to_supabase
from llm_utils import parse_resume_content
from pypdf import PdfReader
import io, time

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role != "applicant":
        raise HTTPException(status_code=403, detail="Only applicants can upload resumes")

    # 1. Read file content
    content = await file.read()
    
    # 2. Extract text (assuming PDF for now)
    text_content = ""
    try:
        if file.content_type == "application/pdf":
            pdf_file = io.BytesIO(content)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                text_content += page.extract_text()
        else:
            # Fallback for text files
            text_content = content.decode("utf-8")
    except Exception as e:
        print(f"Error reading file: {e}")
        text_content = "Could not extract text. Attempting based on file metadata."

    # 3. Upload to Supabase
    try:
        # Reset pointer for upload
        file_obj = io.BytesIO(content)
        # Use sanitized filename
        filename = f"resume_{current_user.id}_{int(time.time())}.{file.filename.split('.')[-1]}"
        file_url = upload_to_supabase(file_obj, filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage Upload Failed: {str(e)}")

    # 4. Parse with LLM
    parsed_data = parse_resume_content(text_content)

    # 5. Save to Database
    new_resume = models.Resume(
        user_id=current_user.id,
        file_url=file_url,
        parsed_content=parsed_data
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume uploaded and parsed successfully",
        "resume_id": new_resume.id,
        "file_url": file_url,
        "parsed_data": parsed_data
    }

@router.get("/my-resume")
def get_my_resume(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.created_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    
    # Check if a test result exists for this resume
    # We check relationships or query strictly (relationship is safer/easier if eager loaded or lazy loaded within session)
    has_test = db.query(models.TestResult).filter(models.TestResult.resume_id == resume.id).first() is not None

    return {
        "id": resume.id,
        "file_url": resume.file_url,
        "parsed_content": resume.parsed_content,
        "created_at": resume.created_at,
        "has_taken_test": has_test
    }
