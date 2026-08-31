# SentinelCore SecureOps — Frontend (Milestone 1: Infrastructure Monitoring)

A React dashboard for the Asset Service backend, covering full CRUD (create, view, edit, delete)
plus live metrics updates — built against the real endpoints in `AssetController` and
`MonitoringController`.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Spring Boot backend must be running separately on
`http://localhost:8080` — Vite's dev proxy (see `vite.config.js`) forwards all `/api/*`
requests there automatically, so there's no CORS setup needed on the backend.

## What's wired up

| Feature | Backend endpoint used |
|---|---|
| List all assets | `GET /api/assets` |
| Create an asset | `POST /api/assets` |
| Edit an asset | `PUT /api/assets/{assetId}` |
| Delete an asset | `DELETE /api/assets/{assetId}` |
| Update live metrics | `PUT /api/monitoring/{assetId}` |
| Backend connectivity check | `GET /api/health` (used to show the live/offline indicator) |

There's currently no `/api/assets/summary` endpoint on the backend, so the healthy/warning/critical
counts and the uptime estimate are calculated client-side from the full asset list in `App.jsx`.

## Project structure

```
src/
├── api/assets.js          — all backend calls, one function per endpoint
├── components/
│   ├── AssetFormModal.jsx — create/edit form
│   └── ConfirmDialog.jsx  — delete confirmation
├── App.jsx                — main dashboard (pulse strip, table, filters, state)
├── main.jsx                — React entry point
└── index.css               — design tokens (colors, fonts)
```

## Design notes

Ink-navy background instead of pure black, teal/amber/rose status colors instead of a
neon red-alert look, monospace (JetBrains Mono) for asset IDs/timestamps so it reads like
real telemetry, and a "pulse strip" — one bar per asset, height/color driven by live CPU
usage and status — as the dashboard's signature visual element.

## If you deploy this separately from the backend

Create a `.env` file with:
```
VITE_API_BASE_URL=https://your-deployed-backend-url.com
```
and rebuild with `npm run build`. Without this, it defaults to relative `/api/...` calls,
which only works when the dev proxy or same-origin deployment handles routing.

## Known gaps to mention if asked in review

- No auth yet — the login/JWT flow (Person B's part) isn't merged, so this dashboard currently
  has no protected-route logic. Once it lands, add an Authorization header to every call in
  `src/api/assets.js` and a login screen before this dashboard renders.
- Metrics are entered manually via the edit form / a future "update metrics" action — there's no
  live telemetry agent actually pushing real server stats (that's out of scope for Milestone 1
  as a solo/small-team project, and is worth naming honestly rather than implying otherwise).
