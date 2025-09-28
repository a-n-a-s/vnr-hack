from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str