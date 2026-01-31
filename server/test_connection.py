import os
from dotenv import load_dotenv
import pymysql
from urllib.parse import quote_plus

load_dotenv()

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
port = int(os.getenv("DB_PORT", "3306"))
dbname = os.getenv("DB_NAME", "resume_lie_detector")

print(f"Attempting connection with:")
print(f"User: {user}")
print(f"Host: {host}")
print(f"Port: {port}")
print(f"Database: {dbname}")
print(f"Password Length: {len(password) if password else 0} (First char: {password[0] if password else 'None'})")

try:
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=dbname,
        port=port,
        cursorclass=pymysql.cursors.DictCursor
    )
    print("\n✅ SUCCESS: Connection successful!")
    connection.close()
except pymysql.MySQLError as e:
    print(f"\n❌ FAILURE: {e}")
    print("\nTroubleshooting Tips:")
    print("1. double-check the password in .env")
    print("2. If your password has '#' in it, wrap the entire password in double quotes in `.env` like: DB_PASSWORD=\"pass#word\"")
    print("3. Ensure the user 'root' has access from 'localhost'")
