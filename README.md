# KUSUM — THE PREMIUM DESIGNER WEAR

A high-end luxury e-commerce platform for women's couture ethnic wear, royal Pakistani lawn, bridal lehengas, festive formals, abayas, and kaftans.

> **Design System & Architecture**: For the full architectural specifications, UX decisions, brand guidelines, and verification rules, refer to [PROJECT_BLUEPRINT.md](./PROJECT_BLUEPRINT.md).

---

## ✦ Key Features

* **Unified Modern Luxury Header**:
  * Official Kusum circular ring logo with magenta pink ring.
  * Centered brand wordmark stack: `KUSUM` in geometric black sans on top of `THE PREMIUM DESIGNER WEAR` in serif with guaranteed zero glyph collisions.
  * Glossy translucent glass capsule navigation buttons with left/right glass borders and generous padding for all 7 main categories (`UNSTITCHED`, `READY TO WEAR`, `LUXURY FORMALS`, `ABAYAS & KAFTANS`, `BRIDAL`, `MOMMY & ME`, `SALE`).
  * Sliding search input that smoothly expands into the exact same middle navigation space on click.
* **Live 3-Layout Client Comparison Suite**:
  * **Option 1: The Royal Atelier** (Recommended): Soft 12px rounded frame, pearl border, hover silk shine sweep animation, and floating bottom-right Add to Cart bag button.
  * **Option 2: The Maria.B Runway**: Minimalist 8px frame, slow zoom, and slide-up frosted glass bar with unstitched/stitched quick-add.
  * **Option 3: The Heritage Trousseau**: Padded champagne canvas, gold handcrafted zari ribbon, and dual hover action buttons (Bag + WhatsApp Bespoke Stylist).
  * Interactive switcher active on all collection pages and side-by-side showcase section on the homepage.
* **High-Fashion Editorial Typography**:
  * Headings & Display: `Playfair Display` (bold weights 600/700, -0.01em tracking).
  * Taglines: `Cinzel` imperial Roman serif.
  * Brand Wordmark: `Montserrat` black 900.
  * Body & Interface: `Outfit` modern legible sans.
* **Dedicated Destinations**:
  * `/bridal`: Bespoke Bridal Atelier & consultation booking.
  * `/track-order`: Live shipment tracking simulator.
  * `/size-guide`: Comprehensive unstitched fabric cuts and stitched size matrices.
  * `/collections/[category]`: Dynamic collection routes.

---

## ✦ Tech Stack

* **Framework**: Next.js 16.3.2 (App Router & Turbopack)
* **React**: React 19.2.8
* **Styling**: Tailwind CSS v4
* **State Management**: Zustand 5
* **Carousels**: Embla Carousel React 8.6.0
* **Testing**: Vitest 4.1.11
* **Linting**: ESLint 9 (Next.js config)

---

## ✦ Development & Testing

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run unit tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```
