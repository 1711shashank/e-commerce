# Kusum e-commerce

Next.js storefront + staff catalog portal in `src/ui`. Django microservices in `src/backend`.

For storefront design notes, see `PROJECT_BLUEPRINT.md` when present.

## Store vs staff portal

| Surface | Who | Local (easy) | Local (host split / Docker nginx) |
|---|---|---|---|
| **Store** | Customers | http://localhost:3000 | http://localhost |
| **Staff portal** | Internal team | http://localhost:3000/admin | http://admin.localhost/admin |

Same Next.js app. Portal uses its own shell (no shop header/footer), login required, not linked from the public site.

### Open the admin portal locally (recommended)

1. Start the UI (and APIs if you need DB save/login):

```bash
cd src/ui && cp -n .env.example .env.local
npm run dev
```

2. Open **http://localhost:3000/admin**

- You’ll be redirected to `/admin/login` if not signed in.
- Leave `ADMIN_HOST` empty in `.env.local` for this path-based local mode.

3. Sign in with:
   - Email: `admin@gmail.com`
   - Password: `admin`

### Optional: local host split

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://admin.localhost:3000
ADMIN_HOST=admin.localhost
STORE_HOSTS=localhost,127.0.0.1,www.localhost
```

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

## UI commands

```bash
cd src/ui
npm install
npm run dev
npm test
npm run lint
npm run build
```

Architecture plan: `ecommerce-microservices-backend-README.md`.
