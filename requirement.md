# Prompt: Build a Clothing E-Commerce Website (Next.js, Static Data)

Use this prompt as-is with an AI coding assistant (Claude, Cursor, etc.) or as a project brief for a developer.

---

## 1. Project Overview

Build a modern, responsive **clothing e-commerce website** using **Next.js**, inspired by the structure and shopping experience of sites like **mariab.ae** (a fashion/apparel store with collections such as lawn, unstitched, ready-to-wear, kids, menswear, and sale items).

For now, **all product, category, and banner data must come from static local data** (JSON/TS files in the project) — no backend or real API calls yet. Structure the code so a real backend/API can be swapped in later with minimal refactor (use a data-access layer / service functions instead of importing static data directly inside components).

---

## 2. Tech Stack

- **Framework:** Next.js (latest stable, App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Image handling:** `next/image` (use placeholder/stock images or local `/public` assets)
- **State management:** React Context or Zustand for cart/wishlist/filter state (client-side only, no persistence backend yet — localStorage is fine for now)
- **Carousel/Slider:** a lightweight library (e.g. `embla-carousel-react` or `swiper`) or a custom-built component
- **Forms:** native React state (no backend submission yet)
- **Data:** static `.ts`/`.json` files inside `/data`, accessed through service functions in `/lib` (e.g. `getProducts()`, `getCategories()`) so the source can later be swapped for real API/database calls without touching UI components

---

## 3. Site Structure & Pages

1. **Home Page (`/`)**
   - Top hero **carousel/slider** (auto-play, manual arrows, dot indicators) showing promotional banners (new arrivals, sale, seasonal collection)
   - **Category showcase / catalog section** — grid of clickable category cards (e.g. Women, Men, Kids, Unstitched, Ready to Wear, Sale) with image + label, linking to filtered product listing pages
   - **Featured / New Arrivals** product carousel or grid
   - **Best Sellers / Sale** section
   - Promotional banner strip (free shipping, offers, etc.)
   - Newsletter signup section (UI only, no backend)
   - Footer with links, social icons, payment icons, About/Contact/Policy links

2. **Product Listing Page (`/products` or `/collections/[category]`)**
   - Breadcrumb navigation
   - **Left/collapsible sidebar filters:**
     - Category / sub-category
     - Price range (min-max slider or input)
     - Size (S, M, L, XL, etc.)
     - Color (swatches)
     - Fabric/material (if applicable)
     - Availability (in stock / sold out)
   - **Top bar controls:**
     - Search box (filters by product name/tags/description in real time)
     - Sort dropdown: Newest, Price Low-High, Price High-Low, Best Selling, A-Z
     - Grid/List view toggle
     - Active filter chips with clear/remove option, "Clear all"
   - **Product grid:**
     - Responsive grid (2 cols mobile, 3–4 cols desktop)
     - Each card: image (with hover to show 2nd image), title, price (with strikethrough original price if on sale), "New" / "Sale" badge, quick "Add to Cart" or "Wishlist" icon
   - Pagination or "Load more" / infinite scroll
   - "No results found" empty state for search/filter with no matches

3. **Product Detail Page (`/products/[slug]`)**
   - Image gallery (thumbnails + main image, zoom on hover)
   - Title, price, discount %, short description
   - Size selector, color selector, quantity selector
   - Add to Cart / Buy Now / Wishlist buttons
   - Tabs or accordion: Description, Size Guide, Shipping & Returns
   - Related products carousel

4. **Cart Page / Cart Drawer**
   - Slide-in cart drawer accessible from header icon
   - List of items with image, name, size, qty (+/-), price, remove button
   - Subtotal, estimated total
   - "Proceed to Checkout" button (checkout page can be a simple static UI for now)

5. **Wishlist Page (`/wishlist`)**
   - Grid of saved items with remove/add-to-cart actions

6. **Category / Collections Page (`/collections`)**
   - Grid of all categories/collections, similar to a catalog page

7. **Static Info Pages**
   - About Us, Contact Us, Shipping & Returns, FAQs (basic static content)

8. **Header (sticky/global)**
   - Logo
   - Main nav menu (Women, Men, Kids, Sale, New Arrivals, etc.) with dropdown mega-menu on hover for sub-categories
   - Search icon (expands to search bar with live suggestions from static data)
   - Wishlist icon with count badge
   - Cart icon with count badge
   - Mobile: hamburger menu → slide-in nav drawer

9. **Footer**
   - Multi-column links (Shop, Help, Company, Legal)
   - Newsletter form
   - Social media icons
   - Payment method icons
   - Copyright

---

## 4. Core Features to Implement

- [ ] Hero carousel (auto-rotate + manual controls, responsive)
- [ ] Category catalog grid on homepage
- [ ] Product listing with **search**, **category filter**, **price filter**, **size/color filter**, **sort (newest, price, popularity)**
- [ ] Debounced live search
- [ ] Responsive product grid with hover effects and badges (New, Sale, Sold Out)
- [ ] Product detail page with variant selection (size/color)
- [ ] Cart drawer/page with quantity update and remove (client-side state, persist to localStorage)
- [ ] Wishlist functionality (client-side, localStorage)
- [ ] Fully responsive (mobile-first) across all breakpoints
- [ ] Loading skeletons for product grid
- [ ] Smooth transitions/animations (Framer Motion optional)
- [ ] SEO basics: proper `<title>`, meta description per page, semantic HTML
- [ ] Accessible components (keyboard navigation, alt text, aria labels)

---

## 5. Static Data Structure (example)

Create this under `/data/products.ts` and `/data/categories.ts`, and access it only through `/lib/services.ts` functions:

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;      // e.g. "women", "men", "kids", "unstitched"
  subCategory?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric?: string;
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  inStock: boolean;
  rating?: number;
  createdAt: string;     // ISO date, used for "newly listed" sort
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId?: string | null;
}
```

Seed at least **20–30 sample products** across 3–4 categories, with varied prices, sizes, colors, and `createdAt` dates so filtering/sorting is meaningfully testable. Use free stock/placeholder fashion images (e.g. from Unsplash) or simple colored placeholders.

---

## 6. Folder Structure (suggested)

```
/app
  /page.tsx                       -> Home
  /collections/page.tsx           -> All collections
  /collections/[category]/page.tsx-> Listing by category
  /products/[slug]/page.tsx       -> Product detail
  /wishlist/page.tsx
  /cart/page.tsx
  /about/page.tsx
  /contact/page.tsx
/components
  /layout (Header, Footer, MobileNav)
  /home (HeroCarousel, CategoryGrid, FeaturedProducts)
  /product (ProductCard, ProductGrid, ProductGallery, VariantSelector)
  /filters (FilterSidebar, SortDropdown, SearchBar, ActiveFilters)
  /cart (CartDrawer, CartItem)
  /ui (Button, Badge, Skeleton, Modal, etc.)
/data
  products.ts
  categories.ts
  banners.ts
/lib
  services.ts     -> getProducts(), getProductBySlug(), getCategories(), filterProducts(), sortProducts()
  types.ts
  store.ts        -> cart/wishlist state (Zustand or Context)
/public
  /images
```

---

## 7. Design Guidelines

- Clean, minimal, fashion-forward aesthetic (lots of white space, large product imagery)
- Neutral base palette (white/black/beige) with one accent color
- Clear typography hierarchy (serif or elegant sans-serif for headings is common in fashion sites)
- Consistent spacing and card sizing across the grid
- Smooth hover states on product cards and buttons
- Mobile-first responsive breakpoints (sm, md, lg, xl)

---

## 8. Responsiveness Requirements (Mandatory)

The website **must be fully responsive across all devices** — mobile phones, tablets, laptops, and large desktop screens. This is not optional polish; build every component mobile-first from the start.

### Target breakpoints (Tailwind defaults)
| Breakpoint | Width | Target devices |
|---|---|---|
| Base (no prefix) | < 640px | Mobile phones (portrait) |
| `sm:` | ≥ 640px | Large phones / small phones landscape |
| `md:` | ≥ 768px | Tablets (portrait, e.g. iPad) |
| `lg:` | ≥ 1024px | Tablets landscape / small laptops |
| `xl:` | ≥ 1280px | Laptops / desktops |
| `2xl:` | ≥ 1536px | Large desktops / wide monitors |

### Layout behavior by component
- **Header/Nav:**
  - Mobile/Tablet (< `lg`): logo + hamburger icon + cart/wishlist/search icons only; full nav collapses into a slide-in drawer with accordion-style category/sub-category lists.
  - Laptop/Desktop (≥ `lg`): full horizontal nav bar with hover mega-menus for categories.
- **Hero Carousel:** full-width on all devices; reduce banner height on mobile (e.g. ~300–400px) vs desktop (~500–600px); ensure text/CTAs on banners remain legible and don't overflow on small screens; touch swipe enabled on mobile/tablet.
- **Category Catalog Grid:** 2 columns on mobile, 3 columns on tablet, 4+ columns on laptop/desktop.
- **Product Listing Page:**
  - Mobile/Tablet: filters hidden behind a "Filters" button that opens a bottom sheet or slide-in drawer; sort dropdown remains visible in a sticky top bar.
  - Laptop/Desktop: filters shown as a persistent left sidebar alongside the product grid.
  - Product grid: 2 columns on mobile, 2–3 on tablet, 3–4 on laptop, up to 5 on very large screens.
- **Product Detail Page:** image gallery and info stack vertically on mobile (image above details), side-by-side (gallery left, details right) from `lg` upward. Thumbnails scroll horizontally on mobile, vertically or in a grid on desktop.
- **Cart Drawer:** full-width slide-in panel on mobile, fixed-width (e.g. 400px) panel on desktop.
- **Footer:** stacked single column on mobile, multi-column grid from `md`/`lg` upward.
- **Touch targets:** all buttons, icons, and interactive elements must be at least 44x44px on mobile for comfortable tapping.
- **Typography & spacing:** scale down heading sizes and section padding on mobile; avoid horizontal scrolling anywhere except intentional carousels/swipers.
- **Images:** use `next/image` with responsive `sizes` prop so appropriately-sized images load per device (no oversized image downloads on mobile).

### Testing checklist
- [ ] Verify layout at common widths: 375px (mobile), 768px (tablet portrait), 1024px (tablet landscape/small laptop), 1440px (laptop/desktop), 1920px (large desktop)
- [ ] No horizontal overflow/scroll on any page at any breakpoint
- [ ] Filters, cart drawer, and nav menu all usable via touch on mobile/tablet
- [ ] Carousel supports both swipe (touch) and arrow-click (mouse) navigation
- [ ] Test on both portrait and landscape orientations for tablets

---

## 9. Non-Goals for This Phase

- No real backend, database, or payment integration yet
- No user authentication/login yet (can stub a login/register UI if desired)
- No real checkout processing — checkout page can just show a static order summary UI
- Keep the data layer abstracted so these can be added later without rewriting components

---

## 10. Deliverable

A working Next.js project (TypeScript + Tailwind) that runs locally with `npm run dev`, fully navigable, with static data powering the carousel, catalog, product listing (search/filter/sort/pagination), product detail, cart, and wishlist — ready for a future backend/API integration.