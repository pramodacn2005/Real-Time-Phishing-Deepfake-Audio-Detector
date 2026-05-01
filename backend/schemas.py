from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    type: str
    result: str
    risk_score: float

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    risk_level: str

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AudioAnalysisResponse(BaseModel):
    result: str
    confidence: float

class TextAnalysisRequest(BaseModel):
    text: str

class TextAnalysisResponse(BaseModel):
    label: str
    risk_score: float

class RiskCalculationRequest(BaseModel):
    audio_score: float
    text_score: float

class RiskCalculationResponse(BaseModel):
    risk_score: float
    classification: str
