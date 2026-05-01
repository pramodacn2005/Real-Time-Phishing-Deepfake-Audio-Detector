from fastapi import APIRouter
from schemas import RiskCalculationRequest, RiskCalculationResponse

router = APIRouter(
    prefix="/calculate-risk",
    tags=["Risk Scoring"]
)

@router.post("/", response_model=RiskCalculationResponse)
async def calculate_risk(request: RiskCalculationRequest):
    # Formula: Risk Score = (Audio Score * 0.6) + (Text Score * 0.4)
    risk_score = (request.audio_score * 0.6) + (request.text_score * 0.4)
    
    # Classification: Low (0-30), Medium (31-70), High (71-100)
    if risk_score <= 30:
        classification = "Low"
    elif risk_score <= 70:
        classification = "Medium"
    else:
        classification = "High"
        
    return {"risk_score": round(risk_score, 2), "classification": classification}
