from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, user

app = FastAPI()

# For Next.js frontend
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Needed for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
