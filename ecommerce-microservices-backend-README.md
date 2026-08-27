# E-Commerce Backend — Microservices Architecture (Django + PostgreSQL + Docker)

This document is both an **architecture reference** and a **phased build plan**. Each phase includes a ready-to-use prompt block you can feed to an AI coding assistant (or hand to a developer) to implement that phase in isolation. Build and ship one service at a time — don't try to build everything at once.

**Target scale:** ~10,000 DAU, horizontally scalable
**Stack:** Django + Django REST Framework, PostgreSQL (one DB per service), Docker + Docker Compose (local), AWS (production) — Redis for caching/queues, Celery for async jobs, Next.js frontend (separate repo)

---

## 1. Architecture Overview

### 1.1 Why microservices here
Each core e-commerce concern (auth, catalog, inventory, orders, payments, notifications) becomes its **own Django project**, with its **own database**, deployed as its **own container**. Services talk to each other over REST (sync) and a message broker (async, for events like "order placed" → decrement stock → send email).

```
                         ┌────────────────────┐
                         │   Next.js Frontend  │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   API Gateway /      │
                         │   Nginx Reverse Proxy│
                         └──────────┬──────────┘
        ┌───────────┬───────────┬──┴────────┬────────────┬─────────────┐
        │            │           │           │            │             │
   ┌────▼───┐  ┌─────▼────┐ ┌────▼────┐ ┌────▼─────┐ ┌────▼──────┐ ┌────▼─────┐
   │  Auth  │  │ Catalog/ │ │Inventory│ │  Order   │ │  Payment  │ │Notification│
   │Service │  │ Product  │ │ Service │ │ Service  │ │  Service  │ │  Service  │
   │(users, │  │ Service  │ │(stock)  │ │(cart,    │ │(Stripe/   │ │(email/SMS)│
   │ JWT)   │  │ +Admin   │ │         │ │ checkout)│ │ Razorpay) │ │           │
   └────┬───┘  └─────┬────┘ └────┬────┘ └────┬─────┘ └────┬──────┘ └────┬─────┘
        │            │           │           │            │             │
   ┌────▼───┐  ┌─────▼────┐ ┌────▼────┐ ┌────▼─────┐ ┌────▼──────┐ ┌────▼─────┐
   │Postgres│  │ Postgres │ │Postgres │ │ Postgres │ │ Postgres  │ │ Postgres  │
   │  (auth)│  │(catalog) │ │(inventory)│(orders) │ │(payments) │ │(optional) │
   └────────┘  └──────────┘ └─────────┘ └──────────┘ └───────────┘ └───────────┘

              Shared: Redis (cache + Celery broker) · RabbitMQ/Redis (event bus)
              Shared: S3 (product images) · CloudFront (CDN) · SES (email)
```

### 1.2 Core principle: database-per-service
Each service owns its data — no service reaches into another service's database directly. Cross-service data needs go through the other service's API, or are pre-computed/synced via events. This keeps services independently deployable and prevents tight coupling.

### 1.3 Sync vs Async communication
- **Synchronous (REST, via internal network / API Gateway):** used when an immediate response is needed — e.g. Order service calls Inventory service to check stock before confirming an order.
- **Asynchronous (event bus — Redis Streams or RabbitMQ + Celery):** used for side effects that don't need to block the main request — e.g. "OrderPlaced" event triggers Inventory to decrement stock, Payment to charge, Notification to send confirmation email — all independently, with retries.

**Rule of thumb:** anything in the critical path of "did this request succeed" = sync API call. Anything that's a downstream side-effect = async event.

### 1.4 Services list

| Service | Responsibility | Own DB |
|---|---|---|
| **Auth Service** | User registration/login, JWT issuing/refresh, password reset, roles (customer/admin/staff) | `auth_db` |
| **Catalog Service** | Products, categories, variants, images, descriptions, pricing — **includes the Admin Dashboard** | `catalog_db` |
| **Inventory Service** | Stock levels per SKU/variant, availability, reservations during checkout | `inventory_db` |
| **Order Service** | Cart, checkout, order lifecycle (placed/confirmed/shipped/delivered/cancelled) | `order_db` |
| **Payment Service** | Payment gateway integration (Stripe/Razorpay), transaction records, refunds | `payment_db` |
| **Notification Service** | Transactional emails/SMS (order confirmation, shipping updates) via SES/Twilio | `notification_db` (or stateless) |
| **API Gateway** | Single entry point, routing, auth token validation, rate limiting | none (Nginx or Kong) |
| **Search Service** *(later, optional)* | Fast product search/filter at scale (Meilisearch/OpenSearch) | index only |

---

## 2. Repository Structure

Recommended: **one repo per service** (polyrepo) once mature, but for building it out, start as a **monorepo** with each service in its own folder + its own `docker-compose` entry — easiest to develop and reason about locally, and each folder can be split into its own repo later without pain.

```
e-commerce/
├── docker-compose.yml              # orchestrates all services locally
├── nginx/                          # API Gateway config
│   └── nginx.conf
├── src/
│   ├── ui/                     # Next.js frontend
│   │   └── .env.example
│   └── backend/                     # Django backend
│       ├── .env.example
│       ├── services/
│       │   ├── auth-service/
│       │   │   ├── Dockerfile
│       │   │   ├── manage.py
│       │   │   ├── auth_service/   # Django project settings
│       │   │   └── users/          # Django app
│       │   ├── catalog-service/
│       │   │   ├── Dockerfile
│       │   │   ├── manage.py
│       │   │   ├── catalog_service/
│       │   │   └── products/       # includes Django Admin customization
│       │   ├── inventory-service/
│       │   ├── order-service/
│       │   ├── payment-service/
│       │   └── notification-service/
│       └── shared/
│           └── libs/               # JWT helpers, event schemas (pip-installable)
└── infra/
    ├── aws/                        # Terraform/CDK for AWS resources
    └── scripts/                    # deploy/migrate helper scripts
```

Each service is a **fully independent Django project** — its own `requirements.txt`, `Dockerfile`, settings, migrations. They only share a small `src/backend/shared/libs` package for things like JWT validation logic and event message schemas.

---

## 3. Inter-Service Communication Details

- **Auth:** Auth Service issues JWTs. Every other service validates the JWT locally (shared public key / secret via a shared library) — they don't call Auth Service on every request, just to validate signature + expiry + role. This avoids Auth becoming a bottleneck.
- **API Gateway (Nginx):** routes `/api/auth/*` → Auth Service, `/api/products/*` → Catalog Service, `/api/orders/*` → Order Service, etc. Also handles CORS, rate limiting, and SSL termination.
- **Event Bus (Redis Streams or RabbitMQ):** each service publishes domain events (`OrderPlaced`, `PaymentSucceeded`, `StockReserved`, `StockDepleted`) that other services subscribe to via Celery workers.

---

## 4. Admin Dashboard (Product / Inventory Management)

This lives inside the **Catalog Service**, using **Django Admin** as the foundation (fastest path to a working, secure, production-usable admin panel).

### What staff can do from the admin:
- Add/edit/delete products: name, description (rich text), price, category, tags
- Upload multiple product images (drag-and-drop gallery), reorder, set primary image
- Manage variants (size/color combinations) with per-variant SKU
- Set/update **availability & stock** (either directly, or synced from Inventory Service)
- Bulk actions: mark products active/inactive, bulk price update, bulk category assignment
- Manage categories/sub-categories
- View basic order info relevant to a product (optional, via API call to Order Service)

### Implementation notes:
- Use `django.contrib.admin` customized with `ModelAdmin` classes (`list_display`, `list_filter`, `search_fields`, inline image upload via `TabularInline`).
- **Image uploads → S3 directly** using `django-storages` + `boto3`, so images are served via CloudFront, not from the app server's disk.
- Use `django-imagekit` or Pillow-based signal to auto-generate thumbnails on upload.
- Add role-based permissions via Django's built-in `Group`/`Permission` system (e.g. "Catalog Staff" group can edit products but not delete categories).
- For a nicer UI than stock Django Admin (optional, later phase): swap in **Django Unfold** or **Django Jazzmin** — drop-in prettier admin themes, minimal code change.
- Inventory numbers can either live directly on the Product/Variant model in Catalog Service (simplest, good enough at 10k DAU) **or** be fully owned by Inventory Service with Catalog displaying a synced read-only value (more "correct" microservices separation — recommended once you have real concurrent-order stock contention to handle).

**Recommendation for your phase 1 build:** keep stock/availability fields directly on the Catalog Service's Product/Variant model for simplicity, and only split out a dedicated Inventory Service in a later phase once checkout concurrency (overselling) becomes a real concern. This is called out explicitly in the phase plan below.

---

## 5. Phased Build Plan

Build and deploy one phase at a time. Each phase is runnable and testable on its own before moving to the next.

---

### **Phase 0 — Foundation & Local Dev Environment**

**Goal:** Repo scaffolding, Docker Compose setup, shared conventions, nothing business-specific yet.

**Deliverables:**
- Monorepo structure as shown in Section 2
- `docker-compose.yml` with placeholder services (Postgres containers for each future service, Redis, Nginx)
- `src/backend/.env.example` with all expected backend environment variables
- `src/ui/.env.example` with Next.js public API URL vars
- Shared `src/backend/shared/libs` package skeleton (JWT validation helper, base event schema)
- Basic CI setup (lint + test on push) — GitHub Actions is fine

**Prompt:**
```
Set up a monorepo for a Django + PostgreSQL + Docker microservices e-commerce
backend. Create the folder structure: services/ (empty subfolders for
auth-service, catalog-service, inventory-service, order-service,
payment-service, notification-service), shared/libs/, infra/, nginx/.

Create a docker-compose.yml that defines: one Postgres container per future
service (auth_db, catalog_db, inventory_db, order_db, payment_db), a shared
Redis container, and an nginx container for the API gateway (config file can
be minimal for now). Use Docker named volumes for each Postgres instance's
data. Add a .env.example listing all env vars each service will need
(DB credentials, SECRET_KEY placeholders, REDIS_URL, JWT signing key).

Add a shared/libs Python package (installable via pip -e in each service)
containing: a JWT validation utility function, and a base Pydantic/dataclass
schema for internal event messages (event_type, payload, timestamp,
source_service).

Add a root README section explaining how to run `docker-compose up` to bring
up the base infra, and a Makefile with common commands (up, down, logs,
migrate-all).
```

---

### **Phase 1 — Auth Service**

**Goal:** Standalone Django service for registration, login, JWT issuing/refresh, roles.

**Deliverables:**
- Django project + DRF, `djangorestframework-simplejwt` for JWT
- Custom `User` model (email-based login, roles: customer/staff/admin)
- Endpoints: `POST /register`, `POST /login`, `POST /token/refresh`, `POST /logout`, `GET /me`
- Password reset flow (email link, can stub email sending until Notification Service exists)
- Dockerfile + service-specific `docker-compose` entry wired into the gateway
- Basic tests for auth flows

**Prompt:**
```
Build the Auth Service for an e-commerce microservices backend, as a
standalone Django + Django REST Framework project inside
services/auth-service/, with its own PostgreSQL database (auth_db).

Requirements:
- Custom User model using email as the username field, with a `role` field
  (customer, staff, admin).
- JWT auth using djangorestframework-simplejwt (access + refresh tokens).
- Endpoints: POST /api/auth/register, POST /api/auth/login,
  POST /api/auth/token/refresh, POST /api/auth/logout (blacklist refresh
  token), GET /api/auth/me (current user profile), POST
  /api/auth/password-reset/request, POST /api/auth/password-reset/confirm.
- Password validation (Django's built-in validators), email uniqueness,
  proper error responses (400 with field-level errors).
- Add a Dockerfile (python:3.12-slim base, gunicorn for production serving)
  and wire this service into the root docker-compose.yml on its own port,
  connected to the auth_db Postgres container from Phase 0.
- Write unit tests for register/login/refresh/me using DRF's APITestCase.
- Document all endpoints (request/response examples) in a README inside
  services/auth-service/.

This service must be fully independent — no imports from other services
except the shared JWT validation helper in shared/libs, which other services
will later use to validate tokens issued here.
```

---

### **Phase 2 — Catalog Service + Admin Dashboard**

**Goal:** Product/category management with a working, image-capable admin panel — the "add new items for public to see" requirement.

**Deliverables:**
- Models: `Category`, `Product`, `ProductVariant` (size/color/SKU), `ProductImage`
- Fields on `Product`: name, slug, description (rich text via `django-ckeditor` or similar), price, discount price, category FK, is_active, is_new, created_at
- Fields on `ProductVariant`: size, color, SKU, stock quantity, price override (optional)
- Django Admin customized: inline image upload (multiple images per product, drag-to-reorder), inline variant editing, list filters (category, active status, stock), search by name/SKU, bulk actions (activate/deactivate, bulk price change)
- Image uploads go to S3 via `django-storages` (local dev can fall back to filesystem storage using an env flag)
- Public read-only REST API for the Next.js frontend: `GET /api/products`, `GET /api/products/{slug}`, `GET /api/categories`, with filtering (category, price range, in-stock) and search query params
- Role-based admin permissions (Catalog Staff group)

**Prompt:**
```
Build the Catalog Service for an e-commerce microservices backend, as a
standalone Django + DRF project inside services/catalog-service/, with its
own PostgreSQL database (catalog_db).

Models:
- Category (name, slug, parent (self FK, nullable), image)
- Product (name, slug, description (rich text), category FK, base_price,
  discount_price nullable, is_active, is_new boolean, fabric/material text
  optional, created_at, updated_at)
- ProductVariant (product FK, size, color, sku unique, stock_quantity,
  price_override nullable)
- ProductImage (product FK, image file, is_primary boolean, sort_order)

Admin dashboard (Django Admin, customized):
- ProductAdmin: list_display shows name, category, price, stock summary,
  is_active; list_filter by category/is_active/is_new; search by name and
  SKU; inline TabularInline for ProductImage (multiple image upload) and for
  ProductVariant (size/color/stock editable inline); add bulk actions to
  activate/deactivate products and bulk-adjust price by percentage.
- Configure image storage via django-storages with S3Boto3Storage, reading
  bucket name/region/credentials from environment variables, with a
  USE_S3=False fallback to local filesystem storage for local dev.
- Create a "Catalog Staff" Django Group with permissions to add/change
  products and images but not delete categories; document how to assign
  staff users to this group.

Public REST API (read-only, no auth required):
- GET /api/products/ — paginated list, supports query params: category,
  min_price, max_price, size, color, search, sort (newest|price_asc|
  price_desc|popularity), in_stock=true
- GET /api/products/{slug}/ — full product detail with variants and images
- GET /api/categories/ — list, with nested sub-categories

Add a Dockerfile and wire into root docker-compose.yml with its own port and
catalog_db connection. Seed a management command
(python manage.py seed_products) that creates ~20 sample products across a
few categories for testing. Write tests for the public API's filtering and
sorting logic. Document setup (including how to configure S3 credentials)
in services/catalog-service/README.md.
```

---

### **Phase 3 — Inventory Concurrency Handling (extend or split out)**

**Goal:** Prevent overselling when multiple customers buy the last unit simultaneously. Decide here whether to keep stock on Catalog's `ProductVariant` (simpler) or split into a dedicated Inventory Service (safer at higher concurrency).

**Deliverables (recommended path — extend Catalog, add reservation logic):**
- `stock_quantity` updates wrapped in `select_for_update()` DB transactions to prevent race conditions
- "Reserve stock" step during checkout (short-lived hold, released if payment fails/times out)
- If you later split into a true Inventory Service: separate DB, API endpoints (`POST /reserve`, `POST /release`, `POST /commit`), and Order Service calls it synchronously during checkout

**Prompt:**
```
Extend the Catalog Service's ProductVariant stock handling to safely support
concurrent checkout attempts (prevent overselling).

Requirements:
- Add a StockReservation model (variant FK, quantity, order_reference,
  expires_at, status: held/committed/released).
- Add an internal API endpoint POST /api/internal/stock/reserve (variant_id,
  quantity, order_reference) that, inside a DB transaction using
  select_for_update() on the ProductVariant row, checks available stock
  (stock_quantity - sum of active reservations) and creates a
  StockReservation with a short expiry (e.g. 10 minutes) if enough stock is
  available; returns 409 if not.
- Add POST /api/internal/stock/commit (order_reference) that marks matching
  reservations as committed and decrements stock_quantity permanently —
  called by Order Service once payment succeeds.
- Add POST /api/internal/stock/release (order_reference) that marks
  reservations released (no stock change) — called on payment failure or
  reservation expiry.
- Add a Celery periodic task (via celery-beat) that expires stale
  'held' reservations past their expires_at.
- These /api/internal/* endpoints should only be callable by other backend
  services (protect with a shared internal service-to-service secret header,
  not customer JWTs).
- Write tests simulating two concurrent reservation requests for the last
  unit of stock to confirm only one succeeds.
```

---

### **Phase 4 — Order Service**

**Goal:** Cart and order lifecycle, orchestrating calls to Catalog (stock reservation) and later Payment.

**Deliverables:**
- Models: `Cart`, `CartItem`, `Order`, `OrderItem`, order status enum (pending/awaiting_payment/paid/shipped/delivered/cancelled/refunded)
- Endpoints: cart CRUD, `POST /checkout` (creates order, calls Catalog's reserve-stock endpoint, returns order awaiting payment)
- Publishes `OrderPlaced` event to the event bus on successful checkout
- Subscribes to `PaymentSucceeded` / `PaymentFailed` events (from Payment Service, Phase 5) to commit/release stock and update order status

**Prompt:**
```
Build the Order Service for an e-commerce microservices backend, as a
standalone Django + DRF project inside services/order-service/, with its own
PostgreSQL database (order_db).

Models:
- Cart (user_id — reference by ID only, no FK across services), CartItem
  (cart FK, product_id, variant_id, quantity, price_at_add)
- Order (user_id, status [pending, awaiting_payment, paid, shipped,
  delivered, cancelled, refunded], total_amount, shipping_address JSON,
  created_at)
- OrderItem (order FK, product_id, variant_id, quantity, unit_price)

Endpoints (JWT-authenticated, validate token using the shared JWT helper
from shared/libs — do not call Auth Service per-request):
- GET/POST /api/cart/, PATCH/DELETE /api/cart/items/{id}
- POST /api/checkout/ — validates cart, calls Catalog Service's
  POST /api/internal/stock/reserve for each item (use the internal service
  secret header), creates an Order in 'awaiting_payment' status if all
  reservations succeed (roll back/release any partial reservations if one
  item fails), and publishes an 'OrderPlaced' event to Redis Streams
  containing order_id, user_id, items, total_amount.
- GET /api/orders/ (user's order history), GET /api/orders/{id}/

Add a Celery consumer that listens for 'PaymentSucceeded' and
'PaymentFailed' events (to be published by the Payment Service in Phase 5):
on success, call Catalog's stock/commit endpoint and set order status
'paid'; on failure, call stock/release and set order status 'cancelled'.

Add Dockerfile, wire into docker-compose.yml with order_db. Write tests for
checkout flow including the partial-failure rollback case (mock the Catalog
Service HTTP calls). Document the service in
services/order-service/README.md, including the internal API contract it
depends on from Catalog Service.
```

---

### **Phase 5 — Payment Service**

**Goal:** Integrate a real payment gateway, record transactions, publish success/failure events.

**Deliverables:**
- Models: `Transaction` (order_reference, amount, status, gateway_reference, created_at)
- Gateway integration: Stripe (or Razorpay if targeting a region where it's more common) — use their official Python SDK, never store raw card data (PCI compliance — let the gateway handle card capture via hosted fields/Checkout)
- Endpoints: `POST /api/payments/create-intent` (called by frontend after order is created), webhook endpoint to receive gateway confirmation (`POST /api/payments/webhook`)
- On webhook success/failure, publishes `PaymentSucceeded`/`PaymentFailed` events for Order Service to consume
- Refund endpoint for admin use

**Prompt:**
```
Build the Payment Service for an e-commerce microservices backend, as a
standalone Django + DRF project inside services/payment-service/, with its
own PostgreSQL database (payment_db).

Requirements:
- Integrate Stripe using the official stripe-python SDK. Never handle or
  store raw card details — use Stripe PaymentIntents with Stripe's hosted
  frontend elements (the Next.js frontend will use Stripe.js directly).
- Model: Transaction (order_reference, user_id, amount, currency, status
  [pending, succeeded, failed, refunded], stripe_payment_intent_id,
  created_at, updated_at).
- POST /api/payments/create-intent/ (JWT-authenticated) — accepts
  order_reference and amount, creates a Stripe PaymentIntent, stores a
  pending Transaction, returns the client_secret to the frontend.
- POST /api/payments/webhook/ — verifies Stripe webhook signature using the
  webhook secret from env vars, handles payment_intent.succeeded and
  payment_intent.payment_failed events, updates the Transaction status, and
  publishes 'PaymentSucceeded' or 'PaymentFailed' events (containing
  order_reference) to Redis Streams for the Order Service to consume.
- POST /api/payments/{transaction_id}/refund/ — admin/staff only (check role
  from JWT claims), issues a Stripe refund and updates Transaction status.
- Add a Dockerfile and wire into docker-compose.yml with payment_db. Use
  Stripe's test mode keys via env vars for local dev.
- Write tests using Stripe's test fixtures/mocked webhook payloads.
- Document webhook setup (including how to test locally with the Stripe
  CLI) in services/payment-service/README.md.
```

---

### **Phase 6 — Notification Service**

**Goal:** Transactional emails (order confirmation, shipping updates, password reset) — decoupled from other services via events.

**Deliverables:**
- Subscribes to events: `OrderPlaced`, `PaymentSucceeded`, `PaymentFailed`, `PasswordResetRequested`
- Sends emails via AWS SES (or SMTP in dev), using Django templates for email bodies
- Optional: SMS via Twilio for order/shipping updates

**Prompt:**
```
Build the Notification Service for an e-commerce microservices backend, as a
standalone Django project (no public API needed, primarily a Celery
consumer) inside services/notification-service/, with its own PostgreSQL
database (notification_db) for logging sent notifications.

Requirements:
- Celery worker that subscribes to Redis Streams events: 'OrderPlaced',
  'PaymentSucceeded', 'PaymentFailed', 'PasswordResetRequested' (published
  by Order, Payment, and Auth services respectively).
- On each event, render an HTML email from a Django template (order
  confirmation, payment receipt, payment failed notice, password reset
  link) and send via AWS SES using boto3 (fall back to Django's console
  email backend in local dev via an env flag).
- Log every sent notification in a NotificationLog model (event_type,
  recipient, status, sent_at, error_message if failed) for debugging/
  auditing.
- Add retry logic (Celery's built-in retry with backoff) for transient SES
  failures.
- Add a Dockerfile and wire into docker-compose.yml with notification_db and
  the shared Redis instance.
- Write tests that simulate incoming events and assert the correct email
  template/recipient is used (mock the SES call).
- Document required AWS SES setup (verified domain/sender) in
  services/notification-service/README.md.
```

---

### **Phase 7 — API Gateway & Service Wiring**

**Goal:** Single public entry point, proper routing, auth enforcement at the edge, rate limiting.

**Deliverables:**
- Nginx config routing `/api/auth/*`, `/api/products/*`, `/api/orders/*`, `/api/payments/*` to their respective services
- CORS configuration for the Next.js frontend origin
- Basic rate limiting (per-IP) at the gateway level
- Health check endpoints on every service (`GET /health`) aggregated for monitoring

**Prompt:**
```
Configure the Nginx API Gateway for the e-commerce microservices backend.

Requirements:
- nginx.conf routing (matching the docker-compose service names/ports from
  earlier phases): /api/auth/ -> auth-service, /api/products/ and
  /api/categories/ -> catalog-service, /api/cart/ and /api/orders/ ->
  order-service, /api/payments/ -> payment-service.
- Add CORS headers allowing the Next.js frontend's origin (configurable via
  env var), including proper preflight OPTIONS handling.
- Add basic rate limiting using nginx's limit_req_zone (e.g. 20 req/s per
  IP with burst) to protect against abuse, exempting the payment webhook
  path from aggressive limiting.
- Add a GET /health endpoint to each existing service (simple 200 OK JSON
  response checking DB connectivity) if not already present, and configure
  nginx to proxy /health/{service} to each for basic uptime checks.
- Update docker-compose.yml so nginx depends_on all services and is the only
  container with a published port to the host.
- Document the full routing table and how to add a new service's routes in
  a README section.
```

---

### **Phase 8 — Search & Filtering at Scale (Optional, later)**

**Goal:** Once catalog size and traffic grow, Postgres `ILIKE`/full-text search on Catalog Service may not be fast enough — add a dedicated search index.

**Prompt:**
```
Add a Search Service using Meilisearch (self-hosted, Docker container) to
the e-commerce microservices backend.

Requirements:
- Add a Meilisearch container to docker-compose.yml.
- In Catalog Service, add signal handlers (post_save/post_delete on Product)
  that push/update/remove the product document in the Meilisearch index
  (fields: name, description, category, price, tags, image_url, in_stock).
- Add a new endpoint GET /api/search/?q=... in Catalog Service that queries
  Meilisearch instead of Postgres for full-text search, with the same
  filter params (category, price range, in_stock) passed through as
  Meilisearch filters.
- Add a management command to bulk re-index all existing products (for
  initial setup or recovery).
- Document the tradeoff: Meilisearch index is eventually consistent with
  Postgres (a few ms to seconds lag after writes) — acceptable for product
  search.
```

---

### **Phase 9 — AWS Production Deployment**

**Goal:** Move from `docker-compose` local dev to a scalable AWS production setup.

**Deliverables:**
- Each service's Docker image pushed to **ECR**
- **ECS Fargate** (or EKS if you want full Kubernetes control) running each service as its own task/service, behind an **ALB**
- **RDS PostgreSQL** — one instance per service (or shared instance with separate databases, cheaper starting point), Multi-AZ for production
- **ElastiCache Redis** for caching + Celery broker + event streams
- **S3 + CloudFront** for product images and static files
- **SES** for transactional email (already wired in Phase 6)
- **Secrets Manager** or **SSM Parameter Store** for env vars/credentials (never bake secrets into images)
- **CloudWatch** for logs/metrics/alarms; consider adding **X-Ray** or **OpenTelemetry** for distributed tracing once you have multiple services calling each other
- CI/CD: GitHub Actions building/pushing images to ECR and triggering ECS deployment on merge to `main`
- Autoscaling policies per service based on CPU/request count (start conservative: min 2 tasks per service for availability, scale up on load)

**Prompt:**
```
Create the AWS deployment infrastructure for the e-commerce microservices
backend using Terraform, inside infra/aws/.

Requirements:
- VPC with public and private subnets across 2 AZs.
- ECR repository per service (auth, catalog, order, payment, notification).
- ECS Fargate cluster with one ECS service per microservice, each running
  behind an Application Load Balancer with path-based routing matching the
  Nginx routing table from Phase 7 (or replace Nginx entirely with ALB
  routing rules — document the tradeoff and pick one).
- RDS PostgreSQL instances (Multi-AZ) — start with one shared instance
  hosting separate databases per service to control cost, with a documented
  migration path to fully separate instances later.
- ElastiCache Redis cluster (single node to start) for caching and as the
  Celery/event-bus broker.
- S3 bucket for product images + CloudFront distribution in front of it,
  with an IAM policy scoped to only the Catalog Service's task role.
- Secrets Manager entries for DB credentials, JWT signing key, Stripe keys,
  SES config — referenced by ECS task definitions, never hardcoded.
- CloudWatch log groups per service and basic alarms (5xx rate, CPU > 80%,
  unhealthy target count).
- Output a GitHub Actions workflow (.github/workflows/deploy.yml) that:
  builds each changed service's Docker image, pushes to its ECR repo, and
  updates the corresponding ECS service to force a new deployment.
- Document the full setup, required AWS IAM permissions for the CI role,
  and manual first-time setup steps in infra/aws/README.md.
```

---

### **Phase 10 — Observability & Hardening (ongoing)**

**Goal:** Production readiness beyond "it works."

**Checklist / prompt to run once core services are live:**
```
Review and harden the e-commerce microservices backend for production:

- Add structured JSON logging (request ID propagated across services via a
  header, e.g. X-Request-ID, for tracing a single user action across
  services) to every Django service.
- Add Sentry (or CloudWatch-based alternative) for error tracking on every
  service.
- Add database connection pooling (PgBouncer) in front of each RDS
  instance if connection counts grow with traffic.
- Add rate limiting per-user (not just per-IP) on sensitive endpoints
  (login, checkout, payment) to prevent abuse.
- Add automated backups verification for RDS (not just backups enabled,
  but a periodic restore-and-check job).
- Load test the checkout flow (Order -> Catalog reserve -> Payment) with a
  tool like Locust, simulating ~10k DAU traffic patterns, and document
  findings/bottlenecks.
- Add a runbook (docs/runbook.md) covering: how to roll back a bad
  deployment, how to manually release stuck stock reservations, how to
  replay a failed notification event.
```

---

## 6. Local Development Quickstart

```bash
# Clone and start everything
git clone <repo-url>
cd ecommerce-backend
cp src/backend/.env.example src/backend/.env
cp src/ui/.env.example src/ui/.env.local
docker compose --env-file src/backend/.env up --build

# Run migrations for a specific service
docker-compose exec auth-service python manage.py migrate
docker-compose exec catalog-service python manage.py migrate

# Create a superuser for the Catalog admin dashboard
docker-compose exec catalog-service python manage.py createsuperuser

# Access:
# API Gateway:        http://localhost/api/
# Catalog Admin:       http://localhost/admin/  (via catalog-service)
```

---

## 7. Summary: Build Order

1. **Phase 0** — Repo + Docker scaffolding
2. **Phase 1** — Auth Service (login/register/JWT)
3. **Phase 2** — Catalog Service + Admin Dashboard (products, images, availability)
4. **Phase 3** — Stock reservation/concurrency safety
5. **Phase 4** — Order Service (cart, checkout)
6. **Phase 5** — Payment Service (Stripe integration)
7. **Phase 6** — Notification Service (emails)
8. **Phase 7** — API Gateway wiring
9. **Phase 8** — Search Service *(optional, once catalog grows)*
10. **Phase 9** — AWS deployment
11. **Phase 10** — Observability & hardening *(ongoing)*

Work through these in order — each phase produces something runnable and testable before you move to the next, and each prompt above is scoped so an AI assistant (or a developer) can implement it as a self-contained unit of work.
