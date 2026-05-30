"""Reproduce notebook training pipeline and export insurance_model.pkl."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import Lasso
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ROOT = Path(__file__).resolve().parents[1]  # project root
DATA_PATH = ROOT / "data" / "medical_insurance_dataset.csv"
MODEL_PATH = ROOT / "models" / "insurance_model.pkl"
METRICS_PATH = ROOT / "models" / "model_metrics.json"


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["bmi_age"] = out["bmi"] * out["age"]
    out["family_size"] = out["children"] + 1
    out["is_obese"] = np.where(out["bmi"] >= 30, 1, 0)
    return out


def main() -> None:
    df = pd.read_csv(DATA_PATH)
    df = engineer_features(df)

    x = df.drop("insurance_cost", axis=1)
    y = df["insurance_cost"]

    cat_cols = x.select_dtypes(include="object").columns
    num_cols = x.select_dtypes(exclude="object").columns

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), num_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ]
    )

    model = Pipeline(
        [
            ("preprocessor", preprocessor),
            ("model", Lasso(random_state=42)),
        ]
    )

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )
    model.fit(x_train, y_train)

    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

    predictions = model.predict(x_test)
    mse = mean_squared_error(y_test, predictions)
    metrics = {
        "model_name": "Lasso Regression",
        "r2": float(r2_score(y_test, predictions)),
        "mae": float(mean_absolute_error(y_test, predictions)),
        "rmse": float(np.sqrt(mse)),
        "cost_p25": float(df["insurance_cost"].quantile(0.25)),
        "cost_p50": float(df["insurance_cost"].quantile(0.50)),
        "cost_p75": float(df["insurance_cost"].quantile(0.75)),
        "cost_min": float(df["insurance_cost"].min()),
        "cost_max": float(df["insurance_cost"].max()),
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    import json

    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved model to {MODEL_PATH}")
    print(f"Metrics: {metrics}")


if __name__ == "__main__":
    main()
