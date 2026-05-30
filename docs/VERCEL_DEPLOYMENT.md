# PremiumIQ — End-to-End Vercel Deployment Guide

Deploy the full-stack app (React UI + FastAPI ML API) to Vercel in one project. No separate backend host required.

---

## Architecture on Vercel (Services preset)

This project uses Vercel **Services** (`experimentalServices` in `vercel.json`) — one domain, two services:

```
Browser
   │
   ├─ GET  /, /assets/*         →  frontend service (Vite → static)
   │
   └─ GET/POST /api/*           →  api service (routePrefix /api → FastAPI /health, /predict, …)
                                      └─ loads models/insurance_model.pkl
```

| Path | Handler |
|------|---------|
| `/`, `/features`, etc. | **frontend** service (`frontend/`, framework: vite) |
| `/api/health` | **api** service (`backend/app/main.py`, framework: fastapi) |
| `/api/model-info` | FastAPI |
| `/api/predict` | FastAPI |

Configuration lives in **`vercel.json`** at the repo root.

> **Do not** use the auto-detected layout (`backend` + root `Python`). That happens when `experimentalServices` is missing. The committed `vercel.json` overrides it with **frontend** + **api**.

---

## Prerequisites

1. **Git** installed — [git-scm.com](https://git-scm.com/)
2. **Python 3.11+** (local training only)
3. **Node.js 18+** — [nodejs.org](https://nodejs.org/)
4. **GitHub account** — [github.com](https://github.com/)
5. **Vercel account** — [vercel.com](https://vercel.com/) (free tier works)

---

## Step 1 — Train the model locally

The API needs `models/insurance_model.pkl` in the repository. Vercel does not run your notebook at build time.

```powershell
cd "c:\Users\anish\Downloads\Regression Model"

pip install -r backend/requirements.txt
python scripts/train_model.py
```

**Verify these files exist:**

```
models/insurance_model.pkl
models/model_metrics.json
```

Test locally:

```powershell
npm install
npm run dev
```

- UI: http://localhost:5173  
- API: http://localhost:8000/api/health  

Submit a prediction on the site to confirm everything works.

---

## Step 2 — Initialize Git and push to GitHub

### 2.1 Create a GitHub repository

1. Go to https://github.com/new  
2. Name it e.g. `premiumiq` or `medical-insurance-predictor`  
3. **Do not** add a README, `.gitignore`, or license (this project already has them)  
4. Click **Create repository**

### 2.2 Commit and push from your machine

```powershell
cd "c:\Users\anish\Downloads\Regression Model"

git init
git add .
git status
```

**Confirm these are staged:**

- `models/insurance_model.pkl`
- `uv.lock` (locks Python **3.12** for Vercel)

If the model is missing, run `python scripts/train_model.py` again.

```powershell
git commit -m "Initial PremiumIQ app with trained model"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub details.

---

## Step 3 — Import the project on Vercel

### 3.1 Connect GitHub

1. Log in to [vercel.com](https://vercel.com/)  
2. Click **Add New…** → **Project**  
3. **Import** your GitHub repository  
4. Authorize Vercel to access the repo if prompted  

### 3.2 Configure the project (Services preset)

On the import screen:

| Setting | Value |
|---------|--------|
| **Application Preset** | **Services** |
| **Root Directory** | `./` (repository root — not `backend` or `frontend`) |

After Vercel reads **`vercel.json`**, you should see **two services**:

| Service | Path | Framework |
|---------|------|-----------|
| **frontend** | `frontend/` (`root` + `entrypoint: .`) | Vite → output `frontend/dist` |
| **api** | `backend/app/main.py` | FastAPI (`routePrefix: /api`) |

Public URLs stay `/api/health`, `/api/predict` — Vercel mounts the API service under `/api`; route handlers inside FastAPI use `/health`, `/predict`, etc.

If you still see `backend` as a Web Service and **Python** at `/`:

1. Push the latest `vercel.json` (with `experimentalServices`) to GitHub.
2. Refresh the import page or re-import the repo.
3. Do **not** use the broken template with `"routePrefix": "/../backend"`.

**Do not** override Build Command / Output Directory in the dashboard — `vercel.json` defines each service.

### 3.3 Node.js version (important)

In **Project Settings → General → Node.js Version**, choose **22.x** (or 20.x).

Vercel uses Node to orchestrate Python installs. Without Node 20+/22+, Python can fall back to older tooling and wrong versions.

### 3.4 Environment variables

None are required for the default setup. Optional later:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Only if API is on another domain (leave empty for same-origin `/api`) |

### 3.5 Deploy

Click **Deploy**. First build typically takes **2–5 minutes** (Python + Node install).

---

## Step 4 — Verify production

After deploy, Vercel gives you a URL like:

```
https://your-project.vercel.app
```

### 4.1 Health check

Open in browser or run:

```powershell
curl https://your-project.vercel.app/api/health
```

Expected:

```json
{
  "status": "ok",
  "model_loaded": true,
  "model_name": "Lasso Regression"
}
```

If `"model_loaded": false`, the pickle was not deployed — see [Troubleshooting](#troubleshooting).

### 4.2 Model info

```
https://your-project.vercel.app/api/model-info
```

### 4.3 Full UI test

1. Open `https://your-project.vercel.app`  
2. Scroll to **Premium prediction studio**  
3. Fill the form → **Generate forecast**  
4. Confirm price, risk meter, and confidence bar appear  

---

## Step 5 — Automatic deployments (CI/CD)

Every **push to `main`** triggers a new production deployment.

| Action | Result |
|--------|--------|
| Push to `main` | Production deploy |
| Pull request | Preview deploy (unique URL per PR) |

To redeploy after retraining:

```powershell
python scripts/train_model.py
git add models/
git commit -m "Retrain model"
git push
```

---

## Optional — Deploy with Vercel CLI

```powershell
npm i -g vercel
cd "c:\Users\anish\Downloads\Regression Model"
vercel login
vercel          # preview
vercel --prod   # production
```

---

## Project files Vercel relies on

```
vercel.json              # experimentalServices: frontend + api
pyproject.toml           # Python dependencies (source of truth)
uv.lock                  # MUST be in git — pins Python 3.12 + wheels
backend/app/main.py      # FastAPI app (api service entrypoint)
models/                  # MUST be in git — insurance_model.pkl
frontend/                # Vite React app (frontend service)
frontend/dist/           # Generated at build (not in git)
```

---

## Troubleshooting

### `model_loaded: false` or 503 on `/api/predict`

**Cause:** `insurance_model.pkl` not in the deployment bundle.

**Fix:**

1. Run `python scripts/train_model.py`  
2. Ensure `models/insurance_model.pkl` is **not** listed in `.gitignore`  
3. `git add models/insurance_model.pkl` and push  
4. Redeploy  

### `invalid runtime "python3.12"`

Do **not** put `"runtime": "python3.12"` in `experimentalServices`. That field only accepts specific Lambda identifiers (e.g. `python3.14`), not patch versions. Use `pyproject.toml` + `.python-version` instead.

### Build fails on `pip install` / `pydantic-core` / Python 3.14

**Symptom:** `Python interpreter version (3.14) is newer than PyO3's maximum supported version (3.13)` when building `pydantic-core`.

**Cause:** Vercel’s default `uv` resolver picked **Python 3.14**, which has no prebuilt wheels for some ML dependencies.

**Fix (already in this repo):** Python is pinned to **3.12** via:

- **`uv.lock`** committed at repo root (`requires-python = "==3.12.*"`) — forces binary wheels, no Rust compile
- `pyproject.toml` dependencies + `.python-version` (`3.12.13`)
- `vercel.json` → `build.env.UV_PYTHON=3.12` and `uv sync --frozen`
- Do **not** set `"runtime": "python3.12"` (invalid in Services)
- Vercel project setting: **Node.js 22.x**

Push the latest commit and redeploy. In the build log you should see **CPython 3.12**, not 3.14.

### Build fails on `pip install` (other)

- Confirm `backend/requirements.txt` exists  
- Check Vercel build logs for incompatible package versions  
- Train locally with Python **3.11 or 3.12** (not 3.14)  

### Build fails on `npm ci` in frontend

- Commit `frontend/package-lock.json`  
- Run `cd frontend && npm install` locally, commit lockfile, push  

### API works locally but not on Vercel

- Use **relative** `/api/...` URLs (already configured in the frontend)  
- Do not set `VITE_API_URL` unless the API is on a different host  

### `FUNCTION_INVOCATION_FAILED` / timeout

- First request after cold start can take a few seconds (loading sklearn + pickle)  
- Retry once; if it persists, check **Vercel → Project → Logs** for the Python stack trace  

### Port 8000 error locally

Unrelated to Vercel. Another process is using port 8000:

```powershell
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### `No Output Directory named "dist" found`

**Cause:** Vite builds to `frontend/dist`, but Vercel looked for `dist` at the repo root.

**Fix:** Root `vercel.json` sets `"outputDirectory": "frontend/dist"`. Ensure the latest commit is deployed.

### SPA routes 404 on refresh

`vercel.json` already rewrites non-API routes to `index.html`. If you changed `vercel.json`, keep:

```json
{ "source": "/((?!api/).*)", "destination": "/index.html" }
```

---

## Custom domain (optional)

1. Vercel project → **Settings** → **Domains**  
2. Add your domain and follow DNS instructions  
3. HTTPS is automatic  

No code changes needed — same `/api` routes work on the custom domain.

---

## Security checklist (production)

- [ ] Do not commit `.env` files with secrets (see `.gitignore`)  
- [ ] Keep `models/` artifacts versioned intentionally (not public training data secrets)  
- [ ] Review Vercel **Deployment Protection** if the app should not be public  

---

## Quick reference

| Task | Command / URL |
|------|----------------|
| Train model | `python scripts/train_model.py` |
| Local dev | `npm run dev` |
| Production URL | `https://<project>.vercel.app` |
| Health | `GET /api/health` |
| Predict | `POST /api/predict` |

---

## Support links

- [Vercel Python runtime](https://vercel.com/docs/functions/runtimes/python)  
- [Vercel monorepo / rewrites](https://vercel.com/docs/projects/project-configuration)  
- [FastAPI on Vercel (Mangum)](https://mangum.io/)
