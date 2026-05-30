# PremiumIQ — Medical Insurance Cost Intelligence

AI-powered SaaS web application that forecasts annual medical insurance premiums using a **Lasso regression** model trained on your `medical_insurance_dataset.csv` (notebook pipeline reproduced in `scripts/train_model.py`).

## Stack

- **Frontend:** React + TypeScript + Vite (glassmorphism SaaS UI)
- **Backend:** FastAPI + scikit-learn
- **Deploy:** Vercel monorepo (static frontend + Python serverless API)

## Quick start

### 1. Train & export the model

```bash
pip install -r requirements.txt
python scripts/train_model.py
```

Creates `models/insurance_model.pkl` and `models/model_metrics.json`.

### 2. Run locally (one command)

From the project root:

```bash
npm install
npm run dev
```

This starts the FastAPI API on port **8000** and the Vite UI on **http://localhost:5173** (API requests are proxied automatically).

To run them separately:

```bash
npm run dev:api   # API only
npm run dev:web   # frontend only
```

## Deploy to Vercel

**Full step-by-step guide:** [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

1. `python scripts/train_model.py` — create `models/insurance_model.pkl`
2. Push the repo to GitHub (include the `models/` folder)
3. Import on [Vercel](https://vercel.com) → Deploy
4. Verify `https://<your-app>.vercel.app/api/health` shows `"model_loaded": true`

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service health & model status |
| GET | `/api/model-info` | Model metrics & features |
| POST | `/api/predict` | Premium forecast |

## Project structure

```
├── api/                 # Vercel serverless entry (Mangum)
├── backend/             # FastAPI application
├── frontend/            # React UI
├── models/              # Trained pickle + metrics
├── data/                # Dataset CSV
├── scripts/             # Training script
└── vercel.json
```

## Model notes

Based on your notebook:

- **Features:** age, sex, bmi, children, smoker, region, exercise_frequency, chronic_disease, annual_income, plus engineered `bmi_age`, `family_size`, `is_obese`
- **Best model:** Lasso (~95.7% R² on holdout)
- **Target:** `insurance_cost`
