# RefCompo Monorepo

Full‑stack TypeScript monorepo ready for GitHub + Vercel:
- Frontend: React + TypeScript + Vite (static on Vercel)
- Backend: Express + TypeScript (Serverless on Vercel under `/api/*`)
- Shared: TypeScript types shared across apps

## Workspace Layout

root/
- rules/
- frontend/
- backend/
- shared/
- .github/workflows/ci.yml
- package.json (npm workspaces)

## Quickstart

1) Install deps
```
npm install
```

2) Create environment files
```
cp .env.example .env.local
```
Update values in `.env.local`. For frontend, also create `frontend/.env.local` if you need `VITE_*` variables locally.

3) Run dev (frontend + backend concurrently)
```
npm run dev
```
- Frontend: http://localhost:5173
- Backend (dev server): http://localhost:3001

4) Build everything
```
npm run build
```

5) Lint / Type‑check / Test
```
npm run lint
npm run typecheck
npm run test
```

## Environment Variables

Root `.env.local` (ignored by git):
```
GOOGLE_BOOKS_API_KEY=
CROSSREF_API_URL=
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

Frontend `frontend/.env.local` (Vite exposes only `VITE_*`):
```
VITE_GOOGLE_BOOKS_API_KEY=
VITE_CROSSREF_API_URL=
VITE_BACKEND_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Recommended `.env.example` files (commit these; never commit `.env.local`):

root `.env.example`
```
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
GOOGLE_BOOKS_API_KEY=
CROSSREF_API_URL=https://api.crossref.org/works
```

frontend `.env.example`
```
VITE_BACKEND_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173
# Optional when enabling Supabase:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
```

## Deployment

- Frontend: Vercel static site using Vite build (`dist/`), configured in `frontend/vercel.json`.
- Backend: Vercel Serverless API using catch‑all function `backend/api/[...route].ts`, configured in `backend/vercel.json`.
- CI: `.github/workflows/ci.yml` installs, lints, type‑checks, tests, builds, and validates Vercel configs.

## Shared Types

Use `@refcompo/shared` across apps:
```ts
import type { ApiResponse } from '@refcompo/shared';
```

## Notes

- CORS is enabled on the backend, controlled by `FRONTEND_URL`.
- TypeScript path alias: `@refcompo/shared/*` is mapped to `shared/src/*` via `tsconfig.base.json`.
- Node 22 LTS recommended (CI and engines target 22).

## Supabase Auth (Google)

- Enable Google provider in Supabase and set redirect URI:
  - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
- Add the two `VITE_SUPABASE_*` variables to the frontend (local + Vercel).
- In dev, the Home page has a “Continue with Google” button using these variables.

## Vercel Setup (Monorepo)

Frontend Project
- Root Directory: `frontend`
- Framework: Vite
- Node: 22
- Install: `cd .. && npm ci`
- Build: `cd .. && npm run build -w frontend`
- Output: `dist`
- Env:
  - `VITE_BACKEND_URL=https://YOUR-BACKEND.vercel.app`
  - `VITE_FRONTEND_URL=https://YOUR-FRONTEND.vercel.app`

Backend Project
- Root Directory: `backend`
- Framework: Other (Node)
- Node: 22
- Install: `cd .. && npm ci`
- Build: `true`
- Env:
  - `FRONTEND_URL=https://YOUR-FRONTEND.vercel.app`
  - `BACKEND_URL=https://YOUR-BACKEND.vercel.app`
  - `GOOGLE_BOOKS_API_KEY=...`
  - `CROSSREF_API_URL=https://api.crossref.org/works`


