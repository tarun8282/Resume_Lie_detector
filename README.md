# Resume Lie Detector (AI-Powered)

## Project Overview
A "Lie Detector" for resumes that uses **Python** and **Artificial Intelligence** to verify applicant skills.
Applicants upload resumes, and the Python backend extracts skills and generates dynamic, hard-to-cheat technical tests to verify if the applicant truly knows what they claim.

## Tech Stack
### **Core Logic (Python Heavy)**
*   **Backend**: Python (FastAPI)
*   **AI/NLP**: Python (LLM Integration for Parsing & Question Generation)
*   **Data Processing**: Python (Pandas/NumPy)
*   **Database**: MySQL

### **Frontend (UI Layer)**
*   **Framework**: React + Vite (Modern, High-Performance)
*   **Styling**: Tailwind CSS

## Architecture
The project is structured as a Monorepo:
*   `/server`: Contains all **Python** logic, API endpoints, AI models, and database interactions.
*   `/client`: Contains the User Interface.

## Key Features
1.  **AI Resume Parsing**: Extracts skills automatically.
2.  **Dynamic Test Engine**: Generates unique questions per applicant using Python.
3.  **Trust Score**: Calculates a reliability score based on test results.
