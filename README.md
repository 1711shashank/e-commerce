# Aurelia e-commerce

Next.js storefront + staff catalog portal in `src/ui`. Django microservices in `src/backend`.

## Store vs staff portal

| Surface | Who | Local (easy) | Local (host split / Docker nginx) |
|---|---|---|---|
| **Store** | Customers | http://localhost:3000 | http://localhost |
| **Staff portal** | Internal team | http://localhost:3000/admin | http://admin.localhost/admin |

Same Next.js app. Portal uses its own shell (no shop header/footer), login required, not linked from the public site.

### Open the admin portal locally (recommended)

1. Start the UI (and APIs if you need DB save/login):

```bash
# Option A — UI only (hot reload)
cd src/ui && cp -n .env.example .env.local
npm run dev
```

2. Open the portal:

**http://localhost:3000/admin**

- You’ll be redirected to `/admin/login` if not signed in.
- Leave `ADMIN_HOST` empty in `.env.local` for this path-based local mode.

3. Sign in with:
   - Email: `admin@gmail.com`
   - Password: `admin`

### Optional: local host split (closer to production)

Modern browsers resolve `*.localhost` → `127.0.0.1` (no `/etc/hosts` needed).

In `src/ui/.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://admin.localhost:3000
ADMIN_HOST=admin.localhost
STORE_HOSTS=localhost,127.0.0.1,www.localhost
```

Then:

- Store: http://localhost:3000  
- Portal: http://admin.localhost:3000 → redirects to `/admin`  
- Visiting `/admin` on the store host redirects to the admin host

### Docker Compose

```bash
cp src/backend/.env.example src/backend/.env
cp src/ui/.env.example src/ui/.env
make up
```

| URL | Purpose |
|---|---|
| http://localhost | Public store (nginx) |
| http://admin.localhost/admin | Staff portal (nginx) |
| http://localhost:3000 | UI container direct |
| http://localhost:8002/admin/ | Catalog Jazzmin admin (products) |
| http://localhost:8001/admin/ | Auth Jazzmin admin (users) |


Nginx sends store `/admin` → `admin.localhost`. Next middleware enforces host rules when `ADMIN_HOST` is set.

## Common commands

| Command | Purpose |
|---|---|
| `make up` | Start UI, Postgres ×5, Redis, Nginx, auth/catalog (when built) |
| `make down` | Stop containers |
| `make logs` | Tail logs |
| `make migrate-all` | Django migrations |
| `make shared-install` | Install shared Python libs |

Architecture plan: `ecommerce-microservices-backend-README.md`.
