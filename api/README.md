# Legacy serverless entry (optional)

Production deploys use **Vercel Services** with `backend/app/main.py` (see root `vercel.json`).

`index.py` + Mangum remain for classic serverless experiments only and are not used when `experimentalServices` is configured.
