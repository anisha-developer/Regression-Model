"""Legacy serverless entry (optional). Production uses Vercel Services → backend/app/main.py."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from mangum import Mangum

from app.main import app

handler = Mangum(app, lifespan="off")
