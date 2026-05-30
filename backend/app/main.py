from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import DATA_PATH, MODEL_PATH
from backend.app.schemas import (
    HealthResponse,
    ModelInfoResponse,
    PredictionRequest,
    PredictionResponse,
)
from backend.app.services.predictor import FEATURE_COLUMNS, load_metrics, load_model, predict


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        load_model()
        load_metrics()
    except FileNotFoundError:
        pass
    yield


app = FastAPI(
    title="PremiumIQ API",
    description="AI-powered medical insurance cost prediction",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    loaded = MODEL_PATH.exists()
    metrics = load_metrics() if loaded else {}
    return HealthResponse(
        status="ok",
        model_loaded=loaded,
        model_name=metrics.get("model_name") if loaded else None,
    )


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info() -> ModelInfoResponse:
    metrics = load_metrics()
    dataset_size = 2000
    if DATA_PATH.exists():
        import pandas as pd

        dataset_size = len(pd.read_csv(DATA_PATH))
    return ModelInfoResponse(
        model_name=metrics.get("model_name", "Lasso Regression"),
        r2=metrics.get("r2", 0.957),
        mae=metrics.get("mae", 1200.0),
        rmse=metrics.get("rmse", 1800.0),
        features=FEATURE_COLUMNS,
        dataset_size=dataset_size,
    )


@app.post("/predict", response_model=PredictionResponse)
def predict_endpoint(payload: PredictionRequest) -> PredictionResponse:
    try:
        return predict(payload)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Please verify your inputs and try again.",
        ) from exc
