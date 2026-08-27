This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The Next.js app lives in `src/ui`. Django microservices live in `src/backend`.

**Docker (recommended):** `make up` starts the UI container on [http://localhost:3000](http://localhost:3000) (also via Nginx on port 80).

**Host dev server** (hot reload without rebuilding the image):

```bash
cd src/ui && npm run dev
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Backend (Phase 0 — local infra)

Microservices scaffolding lives alongside the frontend. UI + base infra (Postgres per service, Redis, Nginx gateway) run via Docker Compose.

```bash
cp src/backend/.env.example src/backend/.env   # backend / docker-compose
cp src/ui/.env.example src/ui/.env             # Next.js UI (Docker)
make up
make ps
curl http://localhost/health
# UI: http://localhost:3000  or  http://localhost/
make down
```

| Command | Purpose |
|---|---|
| `make up` | Start UI, Postgres ×5, Redis, Nginx |
| `make down` | Stop containers |
| `make logs` | Tail all logs |
| `make migrate-all` | Run Django migrations (once services exist) |
| `make shared-install` | `pip install -e ./src/backend/shared/libs` |

Service apps live under `src/backend/services/` (auth, catalog, inventory, order, payment, notification). Shared JWT/event helpers are in `src/backend/shared/libs`.

Architecture and phased build plan: see `ecommerce-microservices-backend-README.md`.
