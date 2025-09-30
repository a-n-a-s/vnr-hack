# db.py
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.vnr_hack
users_collection = db.users
financial_collection = db.financial_data
