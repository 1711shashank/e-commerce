# Dummy product — all fields

Sample catalog product you can paste into the staff portal, Jazzmin admin, or API.

## Field reference

| Field | Type | Value |
|---|---|---|
| `id` | string | `101` |
| `slug` | string | `ivory-lawn-kurta-set` |
| `name` | string | `Ivory Floral Lawn Kurta Set` |
| `category` | string | `women` |
| `subCategory` / `sub_category` | string | `lawn` |
| `price` | number | `11499` |
| `discountPrice` / `discount_price` | number | `9199` |
| `images` | string[] | see below |
| `sizes` | string[] | `XS`, `S`, `M`, `L`, `XL` |
| `colors` | string[] | `Ivory`, `Blush`, `Sage` |
| `fabric` | string | `Lawn` |
| `description` | text | see below |
| `isNew` / `is_new` | boolean | `true` |
| `isOnSale` / `is_on_sale` | boolean | `true` |
| `inStock` / `in_stock` | boolean | `true` |
| `is_active` | boolean | `true` *(backend only)* |
| `rating` | number | `4.7` |
| `tags` | string[] | `lawn`, `floral`, `summer`, `kurta` |
| `createdAt` / `created_at` | datetime | `2026-08-20T10:00:00Z` |
| `updated_at` | datetime | `2026-08-27T12:00:00Z` *(backend only)* |
| `created_by` | string | `1` *(backend only — staff user id)* |

### Description

```
A breezy three-piece lawn set with hand-inspired floral motifs, soft cotton
lining, and a relaxed silhouette made for warm days. Includes kurta, trousers,
and matching dupatta. Machine wash cold; iron on low.
```

### Images (one URL per line for the portal form)

```
https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80
https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80
https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80
```

---

## JSON (API / storefront shape)

```json
{
  "id": "101",
  "slug": "ivory-lawn-kurta-set",
  "name": "Ivory Floral Lawn Kurta Set",
  "category": "women",
  "subCategory": "lawn",
  "price": 11499,
  "discountPrice": 9199,
  "images": [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"
  ],
  "sizes": ["XS", "S", "M", "L", "XL"],
  "colors": ["Ivory", "Blush", "Sage"],
  "fabric": "Lawn",
  "description": "A breezy three-piece lawn set with hand-inspired floral motifs, soft cotton lining, and a relaxed silhouette made for warm days. Includes kurta, trousers, and matching dupatta. Machine wash cold; iron on low.",
  "isNew": true,
  "isOnSale": true,
  "inStock": true,
  "rating": 4.7,
  "tags": ["lawn", "floral", "summer", "kurta"],
  "createdAt": "2026-08-20T10:00:00Z"
}
```

---

## Portal form cheat sheet

Use these values on **Add product** (`/admin/products/new`):

| Form field | Value |
|---|---|
| Product name | `Ivory Floral Lawn Kurta Set` |
| Category | `Women` (`women`) |
| Sub-category | `Lawn` (`lawn`) |
| Description | *(text above)* |
| Price (INR) | `11499` |
| Sale price | `9199` |
| Available sizes | XS, S, M, L, XL |
| Colors | `Ivory, Blush, Sage` |
| Fabric | `Lawn` |
| In stock | checked |
| Mark as new | checked |
| On sale | checked |
| Image URLs | *(three Unsplash URLs above)* |
| Tags | `lawn, floral, summer, kurta` |
