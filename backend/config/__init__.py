"""
Configuration for the backend application
"""
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("app.log"),
            logging.StreamHandler()
        ]
    )

# Setup logging when module is imported
setup_logging()

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "default_secret_key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
