from pathlib import Path


def _project_root() -> Path:
    """Resolve repo/task root where models/ lives (local monorepo or Vercel bundle)."""
    here = Path(__file__).resolve().parent
    for candidate in (here.parent.parent, here.parent, Path.cwd(), Path("/var/task")):
        if (candidate / "models" / "insurance_model.pkl").exists():
            return candidate
    return here.parent.parent


ROOT = _project_root()
MODEL_PATH = ROOT / "models" / "insurance_model.pkl"
METRICS_PATH = ROOT / "models" / "model_metrics.json"
DATA_PATH = ROOT / "data" / "medical_insurance_dataset.csv"
