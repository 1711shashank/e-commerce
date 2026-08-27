---
name: admin-visual-product-editor
description: >-
  Build a storefront-style (PDP-mirroring) staff product create/edit UI in the
  Next.js admin portal, not raw Django admin. Use when adding or improving
  admin product forms, visual catalog editors, staff portal product UX, or when
  non-technical admins struggle with Django admin product entry.
---

# Admin visual product editor

## Goal

Give staff a create/edit page that **looks like the live Product Detail Page**, with inline editable fields and Save / Cancel — not a flat Django admin form.

## Stack rules (this repo)

- Implement in **Next.js** under `/admin` (`src/ui`), not Django templates.
- Reuse PDP layout/components (`ProductGallery`, badges, pricing, size/color chips, accordions).
- Persist via catalog REST + staff JWT (`catalog-api.ts`), not Jazzmin alone.
- Keep Django `/admin/` as a power-user fallback only.

## Routes

| Action | Path |
|--------|------|
| List | `/admin` |
| Create | `/admin/products/new` |
| Edit | `/admin/products/[id]/edit` |

Host split: store on `localhost`, portal on `admin.localhost` (nginx + `middleware.ts`).

## Editor UX checklist

- [ ] Gallery left, info panel right (match PDP)
- [ ] Editable: name, regular/sale price (auto discount %), description, fabric
- [ ] Images: add (URL or upload), delete, reorder; click sets main preview
- [ ] Color chips: add / remove / select default
- [ ] Size chips (or per-size stock rows when the model supports it)
- [ ] Omit customer-only qty / Add to Cart / Buy Now / wishlist
- [ ] Save (one transaction) + Cancel (confirm if dirty)
- [ ] Staff-only (`RequireAuth` + JWT role staff/admin)

## Same-origin API (avoid CORS)

When portal and store use different hosts:

1. Leave `NEXT_PUBLIC_API_URL` **empty** so the browser calls `/api/...` on the current host.
2. Nginx must proxy `/api/auth/` and `/api/products/` on **both** hosts.
3. Add portal hostnames to Django `AUTH_ALLOWED_HOSTS` / `CATALOG_ALLOWED_HOSTS` (e.g. `admin.localhost`).

Never bake `NEXT_PUBLIC_API_URL=http://localhost` into the UI image if staff use `admin.localhost` — that causes CORS.

## Build / deploy gotchas

- Admin pages that touch zustand `persist` can crash static prerender — use `export const dynamic = "force-dynamic"` on `app/admin/layout.tsx` and make `usePersistHydrated` tolerate missing `persist`.
- After adding `/admin` routes, **rebuild the UI container**; an old image 404s admin paths while the storefront shell still renders.

## Model note

Current catalog `Product` uses JSON lists for `images` / `sizes` / `colors` and a single `in_stock`. Prefer visual editor first on that shape; add `ProductVariant` / uploads only when productizing per-size stock or file upload.

## Key files

- `src/ui/components/admin/ProductForm.tsx` — visual editor
- `src/ui/components/product/ProductDetail.tsx` — layout to mirror
- `src/ui/lib/catalog.ts` / `catalog-api.ts` — form + API
- `plan.md` — full product-editor spec
