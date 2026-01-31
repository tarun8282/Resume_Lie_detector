import requests

BASE_URL = "http://localhost:8000"

def test_signup():
    print("\n--- Testing Signup ---")
    payload = {
        "username": "testapplicant",
        "email": "test@example.com",
        "password": "securepassword",
        "role": "applicant"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
    if response.status_code == 200:
        print("✅ Signup Successful:", response.json())
        return True
    elif response.status_code == 400 and "Email already registered" in response.text:
         print("⚠️ User already exists (Skipping signup)")
         return True
    else:
        print("❌ Signup Failed:", response.text)
        return False

def test_login():
    print("\n--- Testing Login ---")
    payload = {
        "username": "test@example.com", # OAuth2 form uses 'username' for the identifying field
        "password": "securepassword"
    }
    response = requests.post(f"{BASE_URL}/auth/login", data=payload)
    if response.status_code == 200:
        data = response.json()
        print("✅ Login Successful!")
        print(f"Token: {data['access_token'][:20]}...")
        return data['access_token']
    else:
        print("❌ Login Failed:", response.text)
        return None

def test_me(token):
    print("\n--- Testing /me Endpoint ---")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if response.status_code == 200:
        print("✅ Token Valid! User Info:", response.json())
    else:
        print("❌ Token Validation Failed:", response.text)

if __name__ == "__main__":
    if test_signup():
        token = test_login()
        if token:
            test_me(token)
