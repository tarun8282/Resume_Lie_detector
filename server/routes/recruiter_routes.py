import models, database, auth
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"]
)

@router.get("/applicants")
def get_all_applicants(
    skill: str | None = None,
    min_score: int | None = None,
    sort_by: str = "date_desc", # date_desc, score_desc, exp_desc
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied. Recruiter only.")

    # Fetch all applicants
    applicants = db.query(models.User).filter(models.User.role == "applicant").all()
    
    applicant_data = []
    for app in applicants:
        # Get latest resume
        latest_resume = db.query(models.Resume).filter(models.Resume.user_id == app.id).order_by(desc(models.Resume.created_at)).first()
        
        resume_info = None
        test_result_info = None
        skills_list = []
        score_val = 0
        exp_years = 0
        
        if latest_resume:
            skills_list = latest_resume.parsed_content.get("skills", []) if latest_resume.parsed_content else []
            exp_years = latest_resume.parsed_content.get("experience_years", 0) if latest_resume.parsed_content else 0
            
            resume_info = {
                "file_url": latest_resume.file_url,
                "skills": skills_list,
                "experience_years": exp_years
            }
            
            # Get latest test result for this resume
            test_result = db.query(models.TestResult).filter(models.TestResult.resume_id == latest_resume.id).first()
            if test_result:
                test_result_info = {
                    "score": test_result.score,
                    "trust_score": test_result.trust_score, # Add trust score
                    "created_at": test_result.created_at,
                    "details": test_result.details
                }

        # --- Filtering ---
        # 1. Skill Filter
        if skill:
            skill_lower = skill.lower()
            # Check if ANY skill contains the search string
            has_skill = any(skill_lower in s.lower() for s in skills_list)
            if not has_skill:
                continue

        # 2. Score Filter
        if min_score is not None:
            if score_val < min_score:
                continue

        applicant_data.append({
            "id": app.id,
            "username": app.username,
            "email": app.email,
            "resume": resume_info,
            "test_result": test_result_info,
            "_sort_score": score_val,
            "_sort_exp": exp_years,
            "_sort_date": latest_resume.created_at if latest_resume else app.created_at
        })
    
    # --- Sorting ---
    if sort_by == "score_desc":
        applicant_data.sort(key=lambda x: x["_sort_score"] or 0, reverse=True)
    elif sort_by == "exp_desc":
        applicant_data.sort(key=lambda x: x["_sort_exp"] or 0, reverse=True)
    else: # date_desc default
        applicant_data.sort(key=lambda x: x["_sort_date"], reverse=True)

    return applicant_data
