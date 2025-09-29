import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = "HS256"

