from fastapi import APIRouter, HTTPException
from db.db import financial_collection
from utils.encryptions import decrypt_data
from bson import ObjectId

router = APIRouter()

@router.get("/financial-data/{user_id}")
async def get_financial_data(user_id: str):
    try:
        # Fetch latest encrypted financial data for this user
        record = await financial_collection.find_one(
            {"user_id": ObjectId(user_id)},
            sort=[("created_at", -1)]  # in case you store multiple versions
        )

        if not record:
            raise HTTPException(status_code=404, detail="No financial data found for user.")

        # Decrypt it
        decrypted = decrypt_data(
            encrypted_data_b64=record["encrypted_data"],
            iv_b64=record["iv"]
        )

        return {
            "user_id": user_id,
            "financial_data": decrypted
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
