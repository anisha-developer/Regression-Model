from typing import Literal

from pydantic import BaseModel, Field, field_validator

Sex = Literal["male", "female"]
Smoker = Literal["yes", "no"]
Region = Literal["northeast", "northwest", "southeast", "southwest"]
Exercise = Literal["none", "low", "medium", "high"]
Chronic = Literal["none", "hypertension", "diabetes", "heart disease"]


class PredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=64, description="Applicant age")
    sex: Sex
    bmi: float = Field(..., ge=15.0, le=53.0)
    children: int = Field(..., ge=0, le=5)
    smoker: Smoker
    region: Region
    exercise_frequency: Exercise
    chronic_disease: Chronic
    annual_income: int = Field(..., ge=10000, le=150000)

    @field_validator("bmi")
    @classmethod
    def round_bmi(cls, value: float) -> float:
        return round(value, 1)


class PredictionResponse(BaseModel):
    predicted_cost: float
    formatted_cost: str
    risk_level: Literal["low", "moderate", "high", "very_high"]
    risk_label: str
    confidence_score: float
    confidence_label: str
    model_name: str
    model_r2: float
    factors: list[str]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str | None = None


class ModelInfoResponse(BaseModel):
    model_name: str
    r2: float
    mae: float
    rmse: float
    features: list[str]
    dataset_size: int
