# SteamInsights

## Structure

```
frontend/   Next.js 16 App Router + React 19 + Tailwind v4 + TypeScript
backend/    Express 5 + TypeScript (tsx) — src/index.ts entrypoint
database/   empty (future home for SQL / migrations)
docs/       empty
docker-compose.yml   PostgreSQL 18 for local dev
```

- Git repo lives in `frontend/` only; root, `backend/`, etc. are NOT tracked.
- Each package manages its own dependencies — no root `package.json`.

## Before writing any Next.js or Express code

- **Next.js 16**: breaking changes from prior versions. Read `node_modules/next/dist/docs/01-app/` before writing code. See `frontend/AGENTS.md`.
- **Express 5**: also has breaking changes from v4 (`app.listen` signature, middleware API, etc.).

## Local dev

```sh
docker compose up -d              # start PostgreSQL on port 5432
cd frontend && npm run dev        # Next.js on http://localhost:3000
cd frontend && npm run lint       # ESLint 9 flat config
cd frontend && npm run build      # production build
cd frontend && npm start          # production server
cd backend && npm run dev         # Express 5 on http://localhost:3001
```

## Stack quirks

- **Tailwind v4**: uses `@import "tailwindcss"` and `@theme inline {}` — NOT `@tailwind` directives or `tailwind.config`.
- **ESLint**: flat config (`eslint.config.mjs`), uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **TypeScript**: strict mode, `@/*` path alias maps to project root. The `tsconfig.json` includes `.next/dev/types/**/*.ts` for generated types.
- **`.env*` files**: gitignored in `frontend/.gitignore`.

## Project state

Early-stage scaffold. The frontend is the default `create-next-app` template. The backend has Express installed and a basic server running (hits Steam API at `/api/steam/balatro`). The database directory is empty — the only DB setup is the `docker-compose.yml`.
