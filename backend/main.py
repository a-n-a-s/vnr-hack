from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, user, consent, financials, anomaly

app = FastAPI()

# For Next.js frontend
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Needed for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(consent.router)
app.include_router(financials.router)
app.include_router(anomaly.router)


