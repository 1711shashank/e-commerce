
Claude finished the response
Screenshot 2026-08-27 at 10.30.28 PM.png
for a non technical person this is very diffecult to add a new item form the django admin dashboard,  

can we have a page same as the product details page but editable, where a admin can add/edit name, images, available sizes and its stock quintity, colors, discription all fields which are there in the UI  and a cancel, save btn 

give me a details promt to implement this


Created a file, read a file
Created a file, read a file

You are out of free messages until 1:30 AM
Write a message…


Claude is AI and can make mistakes.


Admin product editor spec · MD
# Implementation Prompt: Storefront-Style Admin Product Editor (Django)
 
## Context / Problem
Non-technical admins currently have to add/edit products through the raw Django admin dashboard, which is confusing (raw model fields, no visual preview, no image management UI, no per-size stock control). We need a custom-built admin page that **looks and behaves like the actual Product Detail Page (PDP)** the customer sees, but every field is directly editable inline. This makes it obvious to a non-technical person what they're changing and how it will look live.
 
Reference: the attached PDP screenshot shows the target visual layout (gallery on left, product info panel on right, accordions below).
 
---
 
## 1. Goal
Build a route like `/admin-panel/products/<id>/edit` (and `/admin-panel/products/new`) that:
- Visually mirrors the live PDP layout (same components, same positions).
- Makes every visible field an inline-editable form control instead of static text.
- Has **Save** and **Cancel** buttons pinned near the top or bottom of the info panel.
- Is restricted to staff/admin users only (`@staff_member_required` or a custom permission).
This should NOT replace Django admin entirely — it's a focused "visual editor" for the Product model, built as a custom Django view + template (or a small React/HTML component), sitting alongside the default `/django-admin/`.
 
---
 
## 2. Page Layout & Editable Fields
 
Mirror the screenshot section by section:
 
### A. Image Gallery (left column)
- Grid/list of thumbnail images, main large preview on the right of thumbnails.
- Each thumbnail needs:
  - Hover/click to set as **main display image**
  - An "×" delete button
  - Drag-to-reorder (or simple up/down arrows if drag-and-drop is too complex)
- "+ Add Image" tile at the end of the thumbnail list → opens file picker → uploads via AJAX → appends new thumbnail.
- Store images in a related `ProductImage` model (`product FK`, `image`, `sort_order`, `alt_text`) — not a single field — so multiple images + ordering works.
### B. Status Badge ("SALE")
- A dropdown/toggle for badge type: `None / Sale / New / Out of Stock` (editable enum), shown as the same colored pill in the mockup.
### C. Title
- `Linen Wrap Dress` → plain text `<input>` styled to look like the H1.
### D. Pricing
- `₹7,499` (current/sale price) and `₹9,399` (original price, strikethrough) with `-20%` auto-computed.
- Two numeric inputs: **Regular Price** and **Sale Price** (sale price optional).
- Discount % should be **auto-calculated and shown read-only** next to the inputs (don't let admin manually type the %, to avoid mismatches).
- If Sale Price is blank, hide the strikethrough/badge on save.
### E. Short Description
- Textarea (2–3 lines) bound to a `short_description` field — this is the paragraph under the price ("Effortless wrap dress in washed linen...").
### F. Fabric
- Simple text input, e.g. `Linen`. (Could later become a dropdown of predefined fabric types.)
### G. Color
- Editable list of color options (chips like `Sand / Olive / White`).
- Each chip: text label + optional hex color swatch picker + delete "×".
- "+ Add Color" button to append a new chip.
- One color should be markable as **default selected** (like "Sand" shown as active/black in the screenshot).
- Model: `ProductColor` (`product FK`, `name`, `hex_code`, `is_default`).
### H. Size + Stock (important — this is the part raw Django admin makes painful)
- Editable list of size rows: `XS / S / M / L` etc., but instead of just labels, show **each size as a row with: Size label, Stock quantity input, In-stock toggle**.
- "+ Add Size" button to append new size rows.
- Delete "×" per row.
- Model: `ProductVariant` (`product FK`, `size`, `stock_qty`, `is_active`) — optionally also FK to `color` if stock is tracked per color+size combination (recommended if the business actually tracks stock that granularly; otherwise keep it per-size only, matching the current UI).
- Default selected size (bold/active chip) = the first in-stock size, or an explicit `is_default` flag.
### I. Quantity Selector
- This is customer-facing only (default order quantity = 1) — **do not** expose this as an editable admin field; omit it from the editor entirely.
### J. Add to Cart / Buy Now / Wishlist buttons
- These are customer-facing actions — **not editable**, but you can show them grayed-out/disabled in the editor as a live preview of how the page will look, OR simply omit them from the edit view to reduce confusion. Recommendation: omit, keep the editor focused on data entry, not simulate the buying flow.
### K. Accordion Sections (Description / Size Guide / Shipping & Returns)
- Each accordion header stays as a collapsible section, but the body becomes a **rich text editor** (e.g. Django's `django-ckeditor` or a simple `<textarea>` if rich text isn't needed yet).
- Fields: `description_html`, `size_guide_html`, `shipping_returns_html`.
- Note: `Shipping & Returns` content is often store-wide, not per-product — confirm with the business whether this should be a global setting (one shared text block edited once, referenced everywhere) vs per-product. If global, don't duplicate this field per product — pull it from a `SiteSettings` singleton model instead.
---
 
## 3. Save / Cancel Behavior
- **Save button**: submits the whole form (all fields above) in one POST request.
  - Validate: title required, at least one image, at least one size with stock ≥ 0, regular price > 0, sale price (if set) < regular price.
  - On success: redirect to the product's live PDP (or back to admin product list) with a success toast: "Product saved."
  - On validation error: stay on the page, highlight the invalid field(s) inline, don't lose unsaved input.
- **Cancel button**: discard changes, navigate back to the product list without saving. If there are unsaved changes, show a confirm dialog ("Discard changes?").
- Autosave/draft is out of scope for v1 — keep it a single explicit Save action.
---
 
## 4. Data Model Summary (Django)
 
```python
class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    short_description = models.TextField(blank=True)
    fabric = models.CharField(max_length=100, blank=True)
    regular_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    badge = models.CharField(max_length=20, choices=[("none","None"),("sale","Sale"),("new","New")], default="none")
    description_html = models.TextField(blank=True)
    size_guide_html = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
 
class ProductColor(models.Model):
    product = models.ForeignKey(Product, related_name="colors", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True)
    is_default = models.BooleanField(default=False)
 
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    size = models.CharField(max_length=20)
    stock_qty = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
```
 
(Add `color = models.ForeignKey(ProductColor, null=True, blank=True)` on `ProductVariant` only if stock needs to be tracked per color+size combo.)
 
---
 
## 5. Implementation Approach
1. **Backend**: Django class-based views (`ProductEditView`) using a `ModelForm` for `Product` plus Django formsets for `ProductImage`, `ProductColor`, `ProductVariant` (inline formsets, since these are one-to-many).
2. **Frontend**: Reuse the exact same CSS/template partials as the live PDP template so the layout matches pixel-for-pixel — swap static `<span>`/`<p>` tags for `<input>`/`<textarea>` bound to the formset fields. This guarantees visual parity without duplicating design work.
3. **Image upload**: Handle via a small JS fetch call to an `/admin-panel/products/<id>/upload-image/` endpoint that returns the new image's URL + id, so it can be appended to the thumbnail list without a full page reload.
4. **Permissions**: Wrap the view in `@staff_member_required`, and additionally check a custom permission (e.g. `can_edit_products`) if you want finer-grained control than "any staff user."
5. **Validation feedback**: Use Django's form/formset `.errors` rendered inline next to each field (red text under the input), not a generic error banner, so a non-technical admin immediately sees which field is wrong.
---
 
## 6. Acceptance Criteria
- [ ] Admin can create a brand-new product entirely through this page (no need to touch `/django-admin/`).
- [ ] Admin can add, reorder, and delete product images visually.
- [ ] Admin can add/remove color options and size options, and set stock quantity per size.
- [ ] Price, discount %, and sale badge stay visually consistent with what's entered (auto-calculated discount).
- [ ] Description / Size Guide / Shipping & Returns are editable in the same accordion UI as the live page.
- [ ] Save persists all changes in one transaction (use `transaction.atomic()` so a partial save never leaves inconsistent data).
- [ ] Cancel discards changes and confirms before leaving if the form is dirty.
- [ ] Only staff users can access the page; anonymous/non-staff users get redirected to login or 403.
- [ ] The edit page's layout visually matches the live PDP (same spacing, same component order) so admins immediately understand what they're editing.
 
