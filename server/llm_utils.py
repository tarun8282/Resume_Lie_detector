import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize Client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def parse_resume_content(text: str):
    """
    Analyzes resume text using Google Gemini (google-genai SDK) to extract structured data.
    """
    if not text or len(text) < 10:
        return {"skills": [], "experience_years": 0, "summary": ""}

    print("DEBUG RESUME TEXT START")
    print(text[:1000])
    print("DEBUG RESUME TEXT END")

    # Defined Allowed Skills
    allowed_skills = ["Python", "C++", "Java", "Scala", "JavaScript", "C", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "TypeScript", "MySQL"]

    prompt = f"""
    You are an expert Resume Analyzer.
    
    INSTRUCTIONS:
    1. Analyze the resume text provided below.
    2. Extract specific data into a JSON object.
    
    STRICT REQUIREMENTS:
    - Extract 'skills' ONLY if they are in this list: {json.dumps(allowed_skills)}.
    - Calculate 'experience_years' (integer).
    - Write a brief 'summary'.

    RESUME TEXT:
    {text[:8000]}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={   
                    "type": "OBJECT",
                    "properties": {
                        "skills": {
                            "type": "ARRAY",
                            "items": {"type": "STRING"}
                        },
                        "experience_years": {"type": "INTEGER"},
                        "summary": {"type": "STRING"}
                    },
                    "required": ["skills", "experience_years", "summary"]
                }
            )
        )
        
        response_text = response.text
        print(f"DEBUG: Raw LLM Response:\n{response_text}")
        
        return json.loads(response_text)

    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "skills": [], 
            "experience_years": 0, 
            "summary": f"Error parsing with Gemini: {str(e)}"
        }

def generate_combined_test_content(skills: list):
    """
    Generates 5 MCQs and 5 Syntax questions for EACH skill in the list using Gemini.
    Returns a unified list of questions.
    """
    if not skills:
        return []

    prompt = f"""
    You are a Technical Interview Question Generator.
    
    INSTRUCTIONS:
    For EACH of the following skills: {json.dumps(skills)}
    Generate exactly:
    - 5 Multiple Choice Questions (MCQ) testing core concepts.
    - 5 Syntax/Snippet Questions testing code understanding (MCQ style).
    
    TOTAL QUESTIONS = {len(skills) * 10}

    OUTPUT SCHEMA (JSON List):
    [
        {{
            "skill": "Python",
            "type": "MCQ",
            "question": "What is the output of print(2**3)?",
            "options": ["6", "8", "9", "Error"],
            "correct_answer": "8"
        }},
        ...
    ]
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "skill": {"type": "STRING"},
                            "type": {"type": "STRING", "enum": ["MCQ", "SYNTAX"]},
                            "question": {"type": "STRING"},
                            "options": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            },
                            "correct_answer": {"type": "STRING"}
                        },
                        "required": ["skill", "type", "question", "options", "correct_answer"]
                    }
                }
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print(f"Test Generation Error: {e}")
        return []
