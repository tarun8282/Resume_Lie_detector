# VeriResume AI: Authenticity Verification System

VeriResume is a high-precision, AI-powered platform designed to eliminate resume fraud. By combining deep learning analysis with dynamic skill assessments, it generates a definitive **Trust Index** for every candidate, ensuring that recruiters hire based on facts, not fiction.

![VeriResume Banner](https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop)

## 🚀 Vision
In a world of generative AI, resumes are easier to fake than ever. VeriResume sits between the applicant and the recruiter, acting as a "Proof of Skill" layer that verifies every claim in real-time.

## ✨ Core Features

### 🔍 Precision Parsing
- **Neural Extraction**: Beyond simple keyword matching, our engine understands the context, years of experience, and depth of each skill mentioned.
- **Multimodal Support**: Seamlessly parses PDF and Docx formats using advanced LLM-based logic.

### 🧠 Dynamic Assessment Engine
- **Unique Question Sets**: No two tests are the same. Questions are generated on-the-fly based specifically on the applicant's claimed skills.
- **Cheating Mitigation**: Real-time monitoring of tab switches, copy-paste attempts, and user focus ensures integrity.

### 🛡️ The Trust Index
- **0-100 Scoring**: A weighted score that combines technical performance with behavioral integrity metrics.
- **Risk Assessment**: Clear indicators for recruiters to identify high-potential candidates and potential red flags.

### 💎 Premium Interface
- **Glassmorphism Design**: A state-of-the-art "Matte" UI with fluid animations using `framer-motion`.
- **Dual Flow**: Specialized interfaces for both Applicants (Resume management & Testing) and Recruiters (Candidate tracking & Analytics).

## 🛠️ Tech Stack

### **Backend (Intelligence)**
- **Framework**: FastAPI (High-performance Python)
- **Database**: Supabase (PostgreSQL) / MySQL
- **AI Stack**: Gemini LLM (Skill Extraction & Question Generation)
- **Security**: Argon2 Hashing & JWT Authentication

### **Frontend (Experience)**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom Matte Design System)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MySQL or Supabase Account

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/veri-resume.git
   cd veri-resume
   ```

2. **Backend Setup**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
   *Create a `.env` file in `/server` using `.env.example`.*

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in `/client` with `VITE_API_BASE_URL=http://localhost:8000`.*

## 🚢 Deployment

- **Frontend**: Optimized for Vercel/Netlify with SPA routing support (`vercel.json`/`_redirects`).
- **Backend**: Deployable on Render, Heroku, or AWS via Uvicorn.

---
*Built with precision for the modern hiring landscape.*
