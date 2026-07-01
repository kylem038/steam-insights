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

## Local dev (Docker only)

Everything runs inside Docker containers — never run npm/node commands directly on the host.

```sh
# Start (development)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Restart a single service (e.g., after next.config.ts changes)
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart frontend

# Rebuild and start (production)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Access

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001 |

### Testing

```sh
# Frontend / backend unit tests
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm test
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend  npm test

# All unit tests
scripts/test-all.sh

# E2E tests (also restores dev services afterward)
cd frontend && npm run test:e2e
# or: scripts/e2e-test.sh
```

## Stack quirks

- **Tailwind v4**: uses `@import "tailwindcss"` and `@theme inline {}` — NOT `@tailwind` directives or `tailwind.config`.
- **ESLint**: flat config (`eslint.config.mjs`), uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **TypeScript**: strict mode, `@/*` path alias maps to project root. The `tsconfig.json` includes `.next/dev/types/**/*.ts` for generated types.
- **`.env*` files**: gitignored in `frontend/.gitignore`.

## Project state

Early-stage scaffold. All services run in Docker (frontend, backend, PostgreSQL). The frontend uses Next.js 16 in the App Router, the backend is Express 5 with tsx watch for hot-reload, and PostgreSQL 18 stores game data.

## TODO documentation

When the user mentions updating `todo.md` or marks items as completed, load the
`documentcode` skill and document only the most recently completed item in
`features.md`.
