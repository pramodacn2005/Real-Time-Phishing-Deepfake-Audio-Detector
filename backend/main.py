from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import audio, phishing, risk, alerts, reports, auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CyberSentinel API",
    description="Real-Time Phishing & Deepfake Audio Detector API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(audio.router)
app.include_router(phishing.router)
app.include_router(risk.router)
app.include_router(alerts.router)
app.include_router(reports.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CyberSentinel API"}
