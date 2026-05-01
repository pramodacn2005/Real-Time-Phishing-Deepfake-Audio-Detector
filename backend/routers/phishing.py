from fastapi import APIRouter
from schemas import TextAnalysisRequest, TextAnalysisResponse
import random

router = APIRouter(
    prefix="/analyze-text",
    tags=["Phishing Detection"]
)

@router.post("/", response_model=TextAnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    text = request.text.lower()
    
    # Mock ML Logic for Phishing Detection
    suspicious_keywords = ["urgent", "bank", "click here"]
    
    # Check if text contains any suspicious keywords
    is_phishing = any(keyword in text for keyword in suspicious_keywords)
    
    if is_phishing:
        # Generate a high risk score between 71 and 100
        risk_score = random.uniform(71.0, 100.0)
        label = "Phishing"
    else:
        # Generate a low/medium risk score between 0 and 70
        risk_score = random.uniform(0.0, 70.0)
        label = "Safe"
        
    return {"label": label, "risk_score": round(risk_score, 2)}
