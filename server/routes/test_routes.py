from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, database, auth
from llm_utils import generate_combined_test_content
import random

router = APIRouter(
    prefix="/tests",
    tags=["Tests"]
)

@router.post("/generate")
def generate_test(
    resume_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # 1. Verify Resume Ownership
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this resume")

    # 1.5 Check if test already taken
    existing_result = db.query(models.TestResult).filter(models.TestResult.resume_id == resume.id).first()
    if existing_result:
        raise HTTPException(status_code=400, detail="You have already taken the test for this resume. You cannot retake it.")

    # 2. Extract Skills
    parsed_content = resume.parsed_content
    if not parsed_content or "skills" not in parsed_content:
        raise HTTPException(status_code=400, detail="Resume has no parsed skills. Please re-upload.")
    
    skills = parsed_content["skills"]
    if not skills:
        raise HTTPException(status_code=400, detail="No valid skills found in resume.")

    # 3. Generate Questions (MCQ + Syntax) via Gemini
    try:
        raw_questions = generate_combined_test_content(skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Generation Failed: {str(e)}")

    if not raw_questions:
        raise HTTPException(status_code=500, detail="Failed to generate questions.")

    # 4. Save COMPLETE Test (with answers) to Database
    new_test = models.GeneratedTest(
        user_id=current_user.id,
        resume_id=resume.id,
        questions=raw_questions
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    # 5. Sanitize Questions (Remove Answer) & Shuffle
    sanitized_questions = []
    for idx, q in enumerate(raw_questions):
        sanitized_questions.append({
            "id": idx, # Virtual ID for tracking answers
            "skill": q.get("skill"),
            "type": q.get("type"),
            "question": q.get("question"),
            "options": q.get("options")
        })
    
    random.shuffle(sanitized_questions)

    return {
        "test_id": new_test.id,
        "questions": sanitized_questions,
        "total_questions": len(sanitized_questions)
    }

from pydantic import BaseModel

class TestSubmission(BaseModel):
    answers: dict
    trust_metrics: dict

@router.post("/submit")
def submit_test(
    test_id: int,
    submission: TestSubmission,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # 1. Fetch Generated Test
    test_record = db.query(models.GeneratedTest).filter(models.GeneratedTest.id == test_id).first()
    if not test_record:
        raise HTTPException(status_code=404, detail="Test not found")
    if test_record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    user_answers = submission.answers
    trust_metrics = submission.trust_metrics
    
    # 2. Grade the Test
    correct_count = 0
    total_questions = len(test_record.questions)
    details = []

    for q_id_str, selected_option in user_answers.items():
        try:
            q_id = int(q_id_str)
            if q_id < 0 or q_id >= total_questions:
                continue
            
            original_q = test_record.questions[q_id]
            is_correct = (selected_option == original_q["correct_answer"])
            
            if is_correct:
                correct_count += 1
            
            details.append({
                "question": original_q["question"],
                "selected": selected_option,
                "correct": original_q["correct_answer"],
                "is_correct": is_correct,
                "skill": original_q["skill"]
            })

        except ValueError:
            continue

    score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0

    # 3. Calculate Trust Score
    # Formula: Start at 100. Deduct 10 per tab switch, 5 per copy attempt.
    tab_switches = trust_metrics.get("tab_switches", 0)
    copy_attempts = trust_metrics.get("copy_attempts", 0)
    
    trust_deduction = (tab_switches * 10) + (copy_attempts * 5)
    trust_score = max(0, 100 - trust_deduction)

    # 4. Save Result
    result = models.TestResult(
        user_id=current_user.id,
        resume_id=test_record.resume_id,
        score=score_percentage,
        trust_score=trust_score,
        details=details
    )
    db.add(result)
    db.commit()

    return {
        "score": score_percentage,
        "trust_score": trust_score,
        "correct_count": correct_count,
        "total": total_questions,
        "details": details
    }
