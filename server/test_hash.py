from auth import get_password_hash, verify_password

password = "Tarun8282@"
print(f"Testing password: {password}")
print(f"Length: {len(password)}")

try:
    hashed = get_password_hash(password)
    print(f"Hash success: {hashed}")
except Exception as e:
    print(f"Hash failed: {e}")




