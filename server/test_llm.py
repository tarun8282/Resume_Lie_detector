from llm_utils import parse_resume_content
import json

dummy_resume = """
John Doe
Software Engineer
Email: john@example.com

Summary:
Experienced Python developer with 5 years of experience building backend systems.
Skilled in Django, Flask, and cloud deployments.

Skills:
- Python
- JavaScript
- SQL (MySQL)
- Docker
- AWS

Experience:
Senior Developer at Tech Corp (2020-Present)
- Built API using Python and FastAPI.
"""

print("Testing parse_resume_content...")
try:
    result = parse_resume_content(dummy_resume)
    print("\nResult:")
    print(json.dumps(result, indent=2))
    
    if result.get("skills") and isinstance(result["experience_years"], int):
        print("\nSUCCESS: Parsed valid JSON.")
    else:
        print("\nFAILURE: Invalid structure.")
except Exception as e:
    print(f"\nCRASHED: {e}")
