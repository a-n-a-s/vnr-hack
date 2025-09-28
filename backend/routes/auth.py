from fastapi import APIRouter, HTTPException, Response
from schema.user import UserCreate, UserLogin
from db.db import users_collection
from utils.password import hash_password, verify_password
from auth.jwt import create_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(data: UserCreate):
    if await users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(data.password)
    user = {"email": data.email, "password": hashed}
    result = await users_collection.insert_one(user)
    return {"msg": "Account created", "id": str(result.inserted_id)}

@router.post("/login")
async def login(data: UserLogin, response: Response):
    user = await users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": str(user["_id"])})
    response.set_cookie("access_token", token, httponly=True, secure=True)
    return {"msg": "Logged in"}
