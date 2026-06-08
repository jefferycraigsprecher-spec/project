# Backend Deployment

This backend is a Node/Express API that supports the `midwest-shipment` frontend.

## Recommended deployment

1. Deploy the backend as a Node service on Render or any Docker-friendly host.
2. Use the provided `render.yaml` if you want a Render deployment manifest.
3. Set `DB_CLIENT=sqlite` by default, or switch to `mysql` with a managed database in production.

## Render deployment

- Add this repository to Render.
- Select `backend/render.yaml` as the service manifest.
- Configure any secrets as needed.

## Environment variables

Example variables:

- `PORT=5000`
- `DB_CLIENT=sqlite`
- `DB_PATH=./database.sqlite`
- `FRONTEND_URL=https://midwest-shipment.midwestlogistics.workers.dev`
- `FRONTEND_URLS=https://midwest-shipment.midwestlogistics.workers.dev,https://admin.example.com`
- `ADMIN_EMAIL=admin@midwestshipment.com`
- `ADMIN_PASSWORD=Admin@123456`

## Frontend configuration after backend is live

Once the backend is available at `https://<backend-host>`:

1. Set `NEXT_PUBLIC_API_URL=https://<backend-host>/api` in `frontend/.env.local`.
2. Set `NEXT_PUBLIC_SOCKET_URL=https://<backend-host>` if real-time support is used.
3. Rebuild and redeploy the frontend:

```powershell
cd frontend
set "NEXT_PUBLIC_API_URL=https://<backend-host>/api" \
    "NEXT_PUBLIC_SOCKET_URL=https://<backend-host>"
npm run opennext:build
npm run deploy
```

> If you are on Windows PowerShell, use `set "VAR=VALUE"` before the command, as shown above.
## Production database note

The default Render manifest uses `DB_CLIENT=sqlite` for convenience, but SQLite on most cloud hosts is best for lightweight staging only. For production, prefer a managed MySQL database and set:

- `DB_CLIENT=mysql`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
