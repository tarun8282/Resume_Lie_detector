from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("=== MODELS YOU CAN ACTUALLY USE ===\n")

for m in client.models.list():
    print(m.name, "→", m.supported_actions)
