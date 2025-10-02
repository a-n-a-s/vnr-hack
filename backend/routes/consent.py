from fastapi import APIRouter, HTTPException
from utils.encryptions import encrypt_data
from db.db import financial_collection
import json
import os
from bson import ObjectId
from datetime import datetime


router = APIRouter()

@router.post("/consent")
async def user_consent(user_id: str):
    try:
        # Load dummy data
        # data_path = os.path.join("./dummy_financial_data.json")
        with open('realistic_financial_data.json', "r") as file:
            data = json.load(file)

        # Encrypt data
        encrypted = encrypt_data(data)

        # Store in separate financial_data collection
        await financial_collection.insert_one({
            "user_id": ObjectId(user_id),
            "iv": encrypted["iv"],
            "encrypted_data": encrypted["encrypted_data"],
            "consent_given": True,
            "created_at": datetime.utcnow()
        })



        return {
             "message": "Financial data encrypted and stored securely.",
            "user_id": user_id
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
