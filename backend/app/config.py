from pathlib import Path


def _project_root() -> Path:
    """Resolve the runtime root where trained artifacts live."""
    here = Path(__file__).resolve().parent
    for candidate in (here.parent.parent, here.parent, Path.cwd(), Path("/var/task")):
        if (candidate / "models" / "insurance_model.pkl").exists():
            return candidate
    return here.parent.parent


ROOT = _project_root()
MODEL_PATH = ROOT / "models" / "insurance_model.pkl"
if not MODEL_PATH.exists():
    MODEL_PATH = ROOT / "backend" / "models" / "insurance_model.pkl"

METRICS_PATH = ROOT / "models" / "model_metrics.json"
if not METRICS_PATH.exists():
    METRICS_PATH = ROOT / "backend" / "models" / "model_metrics.json"

DATA_PATH = ROOT / "data" / "medical_insurance_dataset.csv"
