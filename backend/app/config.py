from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "models" / "insurance_model.pkl"
METRICS_PATH = ROOT / "models" / "model_metrics.json"
DATA_PATH = ROOT / "data" / "medical_insurance_dataset.csv"
