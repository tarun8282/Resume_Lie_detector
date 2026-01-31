from database import get_db
from models import User

db = next(get_db())
users = db.query(User).all()

print(f"\n--- Registered Users ({len(users)}) ---")
print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Role':<15}")
print("-" * 75)

for user in users:
    print(f"{user.id:<5} {user.username:<20} {user.email:<30} {user.role:<15}")

print("\n")
