import json
from functools import lru_cache

import joblib
import numpy as np
import pandas as pd

from backend.app.config import METRICS_PATH, MODEL_PATH
from backend.app.schemas import PredictionRequest, PredictionResponse

FEATURE_COLUMNS = [
    "age",
    "sex",
    "bmi",
    "children",
    "smoker",
    "region",
    "exercise_frequency",
    "chronic_disease",
    "annual_income",
    "bmi_age",
    "family_size",
    "is_obese",
]

DEFAULT_METRICS = {
    "model_name": "Lasso Regression",
    "r2": 0.957,
    "mae": 1200.0,
    "rmse": 1800.0,
    "cost_p25": 6500.0,
    "cost_p50": 9500.0,
    "cost_p75": 14000.0,
    "cost_min": 1000.0,
    "cost_max": 64000.0,
}


@lru_cache(maxsize=1)
def load_metrics() -> dict:
    if METRICS_PATH.exists():
        return json.loads(METRICS_PATH.read_text(encoding="utf-8"))
    return DEFAULT_METRICS.copy()


@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run: python scripts/train_model.py"
        )
    return joblib.load(MODEL_PATH)


def engineer_row(payload: PredictionRequest) -> dict:
    data = payload.model_dump()
    data["bmi_age"] = data["bmi"] * data["age"]
    data["family_size"] = data["children"] + 1
    data["is_obese"] = 1 if data["bmi"] >= 30 else 0
    return data


def risk_from_cost(cost: float, metrics: dict) -> tuple[str, str]:
    p25 = metrics["cost_p25"]
    p50 = metrics["cost_p50"]
    p75 = metrics["cost_p75"]

    if cost < p25:
        return "low", "Low Premium Risk"
    if cost < p50:
        return "moderate", "Moderate Premium Risk"
    if cost < p75:
        return "high", "Elevated Premium Risk"
    return "very_high", "High Premium Risk"


def confidence_score(payload: PredictionRequest, metrics: dict) -> tuple[float, str]:
    base = metrics.get("r2", 0.95) * 100

    penalties = 0.0
    if payload.smoker == "yes":
        penalties += 4
    if payload.bmi >= 35:
        penalties += 3
    if payload.chronic_disease != "none":
        penalties += 3
    if payload.age >= 55:
        penalties += 2

    score = max(62.0, min(99.0, base - penalties))
    if score >= 92:
        label = "Very High Confidence"
    elif score >= 85:
        label = "High Confidence"
    elif score >= 75:
        label = "Moderate Confidence"
    else:
        label = "Fair Confidence"
    return round(score, 1), label


def insight_factors(payload: PredictionRequest, cost: float) -> list[str]:
    factors: list[str] = []
    if payload.smoker == "yes":
        factors.append("Tobacco use significantly increases projected premiums.")
    if payload.bmi >= 30:
        factors.append("BMI in the obese range contributes to higher costs.")
    if payload.chronic_disease != "none":
        factors.append(f"Chronic condition ({payload.chronic_disease}) elevates risk.")
    if payload.exercise_frequency in {"none", "low"}:
        factors.append("Limited physical activity may increase long-term costs.")
    if payload.children >= 3:
        factors.append("Larger household size affects family coverage pricing.")
    if not factors:
        factors.append("Profile aligns with lower-risk cohorts in our training data.")
    if cost > 15000:
        factors.append("Predicted annual premium is above the portfolio median.")
    return factors[:4]


def predict(payload: PredictionRequest) -> PredictionResponse:
    model = load_model()
    metrics = load_metrics()

    row = engineer_row(payload)
    frame = pd.DataFrame([row])[FEATURE_COLUMNS]
    raw_prediction = float(model.predict(frame)[0])
    predicted_cost = max(metrics["cost_min"] * 0.5, raw_prediction)

    risk_level, risk_label = risk_from_cost(predicted_cost, metrics)
    confidence, confidence_label = confidence_score(payload, metrics)

    return PredictionResponse(
        predicted_cost=round(predicted_cost, 2),
        formatted_cost=f"${predicted_cost:,.2f}",
        risk_level=risk_level,
        risk_label=risk_label,
        confidence_score=confidence,
        confidence_label=confidence_label,
        model_name=metrics.get("model_name", "Lasso Regression"),
        model_r2=round(metrics.get("r2", 0.957), 4),
        factors=insight_factors(payload, predicted_cost),
    )
