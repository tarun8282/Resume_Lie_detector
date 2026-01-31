import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
print(f"API Key present: {bool(api_key)}")

if api_key:
    client = genai.Client(api_key=api_key)
    try:
        # Pager object, iterate to list
        print("Listing models...")
        for model in client.models.list():
            print(f"- {model.name}")
            
        print("\nTrying specific generation with 'gemini-1.5-flash'...")
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents='Hello, are you there?'
        )
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("GEMINI_API_KEY not found in env.")
