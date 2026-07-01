# AGENTS.md — online_merkato-

## Repo structure

- **`backend/`** — NestJS v10 API, webpack builder, global prefix `/api`, Swagger at `/api`
- **`frontend/`** — Next.js 15 (App Router), Tailwind CSS v4, Radix UI, React Query, react-hook-form + zod, sonner toasts
- **`src/`** — shared libs (auth, chat, delivery, driver DTOs) — separate from `backend/src/`
- **`prisma/`** — Prisma v7 schema (PostgreSQL), config at root `prisma.config.ts`
- **`backend/prisma/`** — migrations + seed script (`seed.ts`)

`chat/`, `delivery/`, `driver/` directories exist under `backend/src/` but are **not** imported in `app.module.ts` (chat.module.ts is empty). Only modules in `AppModule` are wired: auth, shop, order, product, category, cart, buyer, admin, payment, review, notification, i18n.

## Quick start

```bash
npm run install:all           # installs root + backend + frontend
cp backend/.env.example backend/.env   # then edit DATABASE_URL for your PG
npm run dev                   # runs both concurrently
```

Backend: `http://localhost:<PORT>` (root `.env` sets `PORT=5001`, fallback 5000).
Frontend: `http://localhost:3000`.

**Port quirk:** root `.env` has `PORT=5001` but `frontend/next.config.js` rewrites `/api` to `localhost:5000`. If the backend is on 5001, the proxy won't reach it.

## Key scripts (root)

| Command | What it does |
|---|---|
| `npm run dev` | concurrently runs backend:dev + frontend:dev |
| `npm run backend:dev` | `dotenv -e .env -- npm run start:dev --prefix backend` (watch mode) |
| `npm run frontend:dev` | `npm run dev --prefix frontend` |
| `npm run build` | builds both packages |
| `npm run install:all` | installs deps for root, backend, frontend |

Root `.env` is loaded by `dotenv-cli` for `backend:dev`.

## Docker Compose

- PostgreSQL on port **5440** (not 5432), DB name `digital_merkato`
- Backend maps `:5002` → internal `:5001`
- Frontend via volume mount `./frontend:/app`
- Backend Dockerfile runs `npx prisma migrate deploy && node dist/main` on startup

## Database

```bash
cd backend
npx prisma generate          # generate Prisma client
npx prisma migrate dev       # apply migrations
npx prisma db seed           # run prisma/seed.ts
```

Prisma uses `@prisma/adapter-pg` (not default driver). `PrismaService` passes `connectionString` to `new PrismaPg()`.
Root `prisma.config.ts` is Prisma v7's defineConfig — schema at `./prisma/schema.prisma`.

## Backend architecture

- PrismaModule is `@Global()` — no need to import in feature modules
- Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform`
- Guards at `backend/src/common/guards/`: `JwtAuthGuard`, `RolesGuard`
- Decorators at `backend/src/common/decorators/`: `@CurrentUser`, `@Public`, `@Roles`
- Auth: JWT via Passport, roles: `SELLER`, `BUYER`, `ADMIN`, `DELIVERY`, `DRIVER`
- CORS: `FRONTEND_URL` env var (default `http://localhost:3000`)
- `start:dev-fix` script exists as fallback if webpack watch misbehaves

## Frontend architecture

- `'use client'` at root layout — entire app is client-side wrapped in `AuthProvider`
- Axios instance at `frontend/src/services/api.ts` — baseURL `/api` (rewritten to `localhost:5000`)
- Token: `localStorage` for Axios interceptors, cookie `token` for middleware
- Route groups: `(auth)`, `(dashboard)`, `admin/`, `driver/`
- Middleware protects `/dashboard`, `/shop/*`, `/products/*`; redirects to `/login?redirect=`

## Environment quirks

- `frontend/.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:3001` — **stale/unused**. The real proxy uses next.config.js rewrites to `localhost:5000`.
- `backend/.env` may have old creds (`postgres:password` on port 5432) — check against docker-compose (`postgres:4321` on port 5440).
- Full env example at `backend/.env.example` includes `CHAPA_SECRET_KEY` and `CHAPA_API_URL`.

## Code conventions

- TypeScript strict mode in both packages
- `@/*` path alias maps to `./src/*` in both backend and frontend
- Backend uses decorators (`@nestjs/common`, custom)
- No test runner, no spec files, no CI — do not assume any testing setup
- No lint/typecheck commands at root — `backend:lint` via eslint, `frontend:lint` via `next lint`
