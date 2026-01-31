from database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()

print("Existing tables:", tables)

required = {"users", "resumes", "test_results"}
if required.issubset(set(tables)):
    print("✅ All required tables exist!")
else:
    print(f"❌ Missing tables: {required - set(tables)}")
