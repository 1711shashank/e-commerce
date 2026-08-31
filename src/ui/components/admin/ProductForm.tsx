"use client";

import { useMemo, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FABRIC_OPTIONS,
  buildProductFromForm,
  emptyProductForm,
  productToFormValues,
  sortSizes,
  type ProductFormValues,
} from "@/lib/catalog";
import { syncVariantStock } from "@/lib/variants";
import { ProductInventoryModal } from "@/components/admin/ProductInventoryModal";
import { ProductImagesModal } from "@/components/admin/ProductImagesModal";
import { ProductGallery } from "@/components/product/ProductGallery";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/catalog-api";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/services";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

function discountPercent(price: string, sale: string): number | null {
  const p = Number(price);
  const s = Number(sale);
  if (!Number.isFinite(p) || p <= 0 || !sale.trim()) return null;
  if (!Number.isFinite(s) || s <= 0 || s >= p) return null;
  return Math.round(((p - s) / p) * 100);
}

const variantToggleBase =
  "inline-flex h-11 shrink-0 items-center justify-center border px-4 text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const access = useAuthStore((s) => s.access);

  const [values, setValues] = useState<ProductFormValues>(() =>
    product ? productToFormValues(product) : emptyProductForm(),
  );
  const [initial] = useState(() =>
    product ? productToFormValues(product) : emptyProductForm(),
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newColor, setNewColor] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    () => (product?.colors[0] ?? "") || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    () => product?.sizes[0] ?? "M",
  );
  const [openTab, setOpenTab] = useState("description");
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewColor, setPreviewColor] = useState(
    () => (product?.colors[0] ?? "") || "",
  );

  const previewImages = useMemo(() => {
    if (!previewColor) return [];
    return (values.colorImages[previewColor] ?? []).filter(Boolean);
  }, [previewColor, values.colorImages]);

  const sizeStockByPreviewColor = useMemo(() => {
    const map = new Map<string, number>();
    for (const size of values.sizes) {
      if (previewColor) {
        const variant = values.variants.find(
          (v) => v.color === previewColor && v.size === size,
        );
        map.set(size, variant?.stockQty ?? 0);
      } else {
        map.set(
          size,
          values.variants
            .filter((v) => v.size === size)
            .reduce((sum, v) => sum + v.stockQty, 0),
        );
      }
    }
    return map;
  }, [values.sizes, values.variants, previewColor]);

  useEffect(() => {
    if (values.colors.length && !values.colors.includes(selectedColor)) {
      setSelectedColor(values.colors[0]);
    }
    if (values.colors.length && !values.colors.includes(previewColor)) {
      setPreviewColor(values.colors[0]);
    }
    if (values.sizes.length && !values.sizes.includes(selectedSize)) {
      setSelectedSize(values.sizes[0]);
    }
    const stockedSizes = sortSizes(values.sizes).filter(
      (size) => (sizeStockByPreviewColor.get(size) ?? 0) > 0,
    );
    if (
      values.sizes.length &&
      stockedSizes.length &&
      !stockedSizes.includes(selectedSize)
    ) {
      setSelectedSize(stockedSizes[0]);
    }
  }, [
    values.colors,
    values.sizes,
    selectedColor,
    selectedSize,
    previewColor,
    sizeStockByPreviewColor,
  ]);

  const parents = useMemo(
    () => categories.filter((c) => !c.parentId && c.slug !== "sale"),
    [categories],
  );

  const selectedParent = parents.find((c) => c.slug === values.category);
  const subs = selectedParent
    ? categories.filter((c) => c.parentId === selectedParent.id)
    : [];

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial],
  );

  const pct = discountPercent(values.price, values.discountPrice);
  const regular = Number(values.price);
  const sale = values.discountPrice.trim() ? Number(values.discountPrice) : null;
  const displayPrice =
    sale != null && Number.isFinite(sale) && sale > 0 ? sale : regular;
  const colorImagesForSelected = selectedColor
    ? (values.colorImages[selectedColor] ?? []).filter(Boolean)
    : [];
  const safeActive = colorImagesForSelected.length
    ? Math.min(activeImage, colorImagesForSelected.length - 1)
    : 0;

  const setColorImages = (color: string, images: string[]) => {
    setValues((prev) => ({
      ...prev,
      colorImages: { ...prev.colorImages, [color]: images },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      delete next.colorImages;
      return next;
    });
  };

  const setField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleSize = (size: string) => {
    setValues((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return {
        ...prev,
        sizes,
        variants: syncVariantStock(prev.colors, sizes, prev.variants),
      };
    });
    setSelectedSize(size);
    setError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.sizes;
      return next;
    });
  };

  const addImage = () => {
    if (!selectedColor) {
      setFieldErrors((prev) => ({
        ...prev,
        colors: "Add a color before uploading images.",
      }));
      return;
    }
    const url = newImageUrl.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setFieldErrors((prev) => ({
        ...prev,
        images: "Enter a valid image URL (https://…).",
      }));
      return;
    }
    const current = values.colorImages[selectedColor] ?? [];
    setColorImages(selectedColor, [...current, url]);
    setNewImageUrl("");
    setActiveImage(current.length);
  };

  const removeImage = (index: number) => {
    if (!selectedColor) return;
    const current = values.colorImages[selectedColor] ?? [];
    setColorImages(
      selectedColor,
      current.filter((_, i) => i !== index),
    );
    setActiveImage((prev) =>
      prev > index ? prev - 1 : prev === index ? 0 : prev,
    );
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    if (!selectedColor) return;
    const current = values.colorImages[selectedColor] ?? [];
    const target = index + dir;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setColorImages(selectedColor, next);
    setActiveImage(target);
  };

  const uploadImages = async (files: File[]) => {
    if (!selectedColor) {
      setFieldErrors((prev) => ({
        ...prev,
        colors: "Add a color before uploading images.",
      }));
      return;
    }
    if (!access) {
      setError("You must be logged in to upload images.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadProductImage(file, access));
      }
      const current = values.colorImages[selectedColor] ?? [];
      setColorImages(selectedColor, [...current, ...uploaded]);
      setActiveImage(current.length);
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        images:
          err instanceof ApiError
            ? err.message
            : "Could not upload image. Is the catalog service running?",
      }));
    } finally {
      setUploading(false);
    }
  };

  const addColor = () => {
    const name = newColor.trim();
    if (!name) return;
    if (values.colors.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setNewColor("");
      return;
    }
    setValues((prev) => {
      const colors = [...prev.colors, name];
      return {
        ...prev,
        colors,
        variants: syncVariantStock(colors, prev.sizes, prev.variants),
        colorImages: { ...prev.colorImages, [name]: [] },
      };
    });
    setSelectedColor(name);
    setActiveImage(0);
    setNewColor("");
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.colors;
      delete next.variants;
      return next;
    });
  };

  const removeColor = (color: string) => {
    setValues((prev) => {
      const colors = prev.colors.filter((c) => c !== color);
      const { [color]: _removed, ...colorImages } = prev.colorImages;
      return {
        ...prev,
        colors,
        colorImages,
        variants: syncVariantStock(colors, prev.sizes, prev.variants),
      };
    });
    if (selectedColor === color) {
      setSelectedColor(
        values.colors.find((c) => c !== color) ?? "",
      );
    }
  };

  const onCancel = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    router.push("/admin");
  };

  const validateInline = (): boolean => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = "Name is required.";
    if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
      errs.price = "Enter a valid regular price.";
    }
    if (values.discountPrice.trim()) {
      const d = Number(values.discountPrice);
      if (!Number.isFinite(d) || d <= 0) {
        errs.discountPrice = "Sale price must be a valid number.";
      } else if (d >= Number(values.price)) {
        errs.discountPrice = "Sale price must be lower than regular price.";
      }
    }
    if (!values.sizes.length) errs.sizes = "Add at least one size.";
    if (!values.colors.length) errs.colors = "Add at least one color.";
    if (!values.variants.some((v) => v.stockQty > 0)) {
      errs.variants = "Set stock for at least one color and size.";
    }
    for (const color of values.colors) {
      if (!(values.colorImages[color] ?? []).some(Boolean)) {
        errs.images = `Add at least one image for ${color}.`;
        break;
      }
    }
    if (!values.description.trim()) {
      errs.description = "Description is required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!access) {
      setError("You must be logged in to save products.");
      return;
    }
    if (!validateInline()) {
      setError("Fix the highlighted fields below.");
      return;
    }

    const result = buildProductFromForm(values, {
      id: product?.id,
      slug: product?.slug,
      createdAt: product?.createdAt,
    });

    if (result.error || !result.product) {
      setError(result.error ?? "Could not save product.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: result.product.name,
      category: result.product.category,
      subCategory: result.product.subCategory ?? "",
      price: result.product.price,
      discountPrice: result.product.discountPrice ?? null,
      images: result.product.images,
      colorImages: result.product.colorImages ?? {},
      sizes: result.product.sizes,
      colors: result.product.colors,
      variants: result.product.variants ?? [],
      fabric: result.product.fabric ?? "",
      description: result.product.description,
      isNew: result.product.isNew,
      isOnSale: result.product.isOnSale,
      tags: result.product.tags ?? [],
    };

    try {
      if (product) {
        await updateProduct(product.id, payload, access);
      } else {
        await createProduct(payload, access);
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body;
        if (typeof body === "object" && body) {
          const messages = Object.entries(body as Record<string, unknown>)
            .map(([key, val]) => {
              if (Array.isArray(val)) return `${key}: ${val.join(", ")}`;
              if (typeof val === "string") return val;
              return null;
            })
            .filter(Boolean);
          setError(messages.join(" ") || err.message);
        } else {
          setError(err.message);
        }
      } else {
        setError("Could not save product. Is the catalog service running?");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputBare =
    "w-full bg-transparent outline-none placeholder:text-muted/50";
  const fieldHint = "mt-1 text-xs text-sale";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {product ? "Edit product" : "New product"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Edit the fields as they appear on the store detail page, then save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-none border border-border bg-surface/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                category: e.target.value,
                subCategory: "",
              }))
            }
            className="min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent"
          >
            {parents.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="subCategory">
            Sub-category
          </label>
          <select
            id="subCategory"
            value={values.subCategory}
            onChange={(e) => setField("subCategory", e.target.value)}
            className="min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent"
            disabled={!subs.length}
          >
            <option value="">None</option>
            {subs.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            value={values.tags}
            onChange={(e) => setField("tags", e.target.value)}
            className="min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent"
            placeholder="summer, floral"
          />
        </div>
        <div className="flex flex-wrap items-end gap-4 pb-1">
          {(
            [
              ["isNew", "New"],
              ["isOnSale", "On sale"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={values[key]}
                onChange={(e) => setField(key, e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}

      <ProductInventoryModal
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        values={values}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        fieldErrors={fieldErrors}
        fieldHint={fieldHint}
        onSelectColor={setSelectedColor}
        onSelectSize={setSelectedSize}
        onToggleSize={toggleSize}
        onVariantsChange={(variants) => setField("variants", variants)}
      />

      <ProductImagesModal
        open={imagesOpen}
        onClose={() => setImagesOpen(false)}
        values={values}
        selectedColor={selectedColor}
        activeIndex={safeActive}
        name={values.name}
        newImageUrl={newImageUrl}
        newColor={newColor}
        uploading={uploading}
        fieldErrors={fieldErrors}
        fieldHint={fieldHint}
        onSelectColor={(color) => {
          setSelectedColor(color);
          setActiveImage(0);
        }}
        onActiveChange={setActiveImage}
        onNewUrlChange={setNewImageUrl}
        onNewColorChange={setNewColor}
        onAddColor={addColor}
        onRemoveColor={removeColor}
        onAddUrl={addImage}
        onRemove={removeImage}
        onMove={moveImage}
        onUploadFiles={(files) => void uploadImages(files)}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          <ProductGallery
            key={previewColor || "empty"}
            images={previewImages}
            name={values.name || "Product"}
            unoptimized
            emptyLabel={
              values.colors.length
                ? `No images added for ${previewColor || "this color"}`
                : "No images added — use Manage images to add colors"
            }
          />
        </div>

        <div className="space-y-6 lg:pt-2">
          <div className="flex flex-wrap gap-2">
            {values.isNew && <Badge variant="new">New</Badge>}
            {(values.isOnSale || !!values.discountPrice.trim()) && (
              <Badge variant="sale">Sale</Badge>
            )}
            {(values.variants.some((v) => v.stockQty > 0) === false) && (
              <Badge variant="soldout">Sold Out</Badge>
            )}
          </div>

          <div>
            <input
              required
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              className={cn(
                inputBare,
                "font-display text-3xl sm:text-4xl lg:text-5xl",
                fieldErrors.name && "text-sale",
              )}
              placeholder="Product name"
              aria-label="Product name"
            />
            {fieldErrors.name && (
              <p className={fieldHint}>{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xl tabular-nums">
                {Number.isFinite(displayPrice) && displayPrice > 0
                  ? formatPrice(displayPrice)
                  : "₹—"}
              </span>
              {values.discountPrice.trim() && Number.isFinite(regular) && (
                <>
                  <span className="text-muted line-through">
                    {formatPrice(regular)}
                  </span>
                  {pct != null && (
                    <span className="text-sm text-sale">-{pct}%</span>
                  )}
                </>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
                  Regular price
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={values.price}
                  onChange={(e) => setField("price", e.target.value)}
                  className="min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent"
                  placeholder="9399"
                />
                {fieldErrors.price && (
                  <p className={fieldHint}>{fieldErrors.price}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
                  Sale price (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={values.discountPrice}
                  onChange={(e) => {
                    const v = e.target.value;
                    setField("discountPrice", v);
                    if (v.trim()) setField("isOnSale", true);
                  }}
                  className="min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent"
                  placeholder="7499"
                />
                {fieldErrors.discountPrice && (
                  <p className={fieldHint}>{fieldErrors.discountPrice}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              className={cn(
                inputBare,
                "max-w-lg resize-y text-sm leading-relaxed text-muted sm:text-base",
                fieldErrors.description && "text-sale",
              )}
              placeholder="Short description shoppers see under the price…"
              aria-label="Description"
            />
            {fieldErrors.description && (
              <p className={fieldHint}>{fieldErrors.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-start gap-3">
            {values.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setPreviewColor(color)}
                title={color}
                className={cn(
                  variantToggleBase,
                  "w-28 truncate",
                  previewColor === color
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/45 bg-background hover:border-foreground/75",
                )}
                aria-pressed={previewColor === color}
              >
                {color}
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 self-start"
              onClick={() => setImagesOpen(true)}
            >
              <ImageIcon className="h-4 w-4" />
              Manage images
            </Button>
          </div>

          <div className="flex flex-wrap items-start gap-3">
            {sortSizes(values.sizes).map((size) => {
              const stock = sizeStockByPreviewColor.get(size) ?? 0;
              const outOfStock = stock === 0;
              const lowStock = stock > 0 && stock < 10;
              return (
                <div key={size} className="inline-flex shrink-0 flex-col items-center">
                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      variantToggleBase,
                      "w-14",
                      outOfStock &&
                        "cursor-not-allowed border-foreground/25 text-muted opacity-50",
                      !outOfStock &&
                        selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : !outOfStock &&
                            "border-foreground/45 bg-background hover:border-foreground/75",
                    )}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                  {lowStock && (
                    <span className="mt-1 block whitespace-nowrap text-center text-[10px] font-medium uppercase tracking-[0.08em] text-sale">
                      {stock} left
                    </span>
                  )}
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 self-start"
              onClick={() => setInventoryOpen(true)}
            >
              <Layers className="h-4 w-4" />
              Manage inventory
            </Button>
          </div>
          {(fieldErrors.images ||
            fieldErrors.variants ||
            fieldErrors.colors ||
            fieldErrors.sizes) && (
            <p className={fieldHint}>
              {fieldErrors.images ||
                fieldErrors.variants ||
                fieldErrors.colors ||
                fieldErrors.sizes}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted">
              Fabric
            </label>
            <select
              value={values.fabric}
              onChange={(e) => setField("fabric", e.target.value)}
              className="min-h-11 w-full max-w-xs border border-border bg-background px-3 text-sm outline-none focus:border-accent"
            >
              <option value="">Select fabric</option>
              {FABRIC_OPTIONS.map((fabric) => (
                <option key={fabric} value={fabric}>
                  {fabric}
                </option>
              ))}
            </select>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-border border-y border-border">
            {(
              [
                {
                  id: "description",
                  label: "Description",
                  editable: true as const,
                },
                {
                  id: "size-guide",
                  label: "Size Guide",
                  editable: false as const,
                  content:
                    "Refer to our standard size chart. For unstitched pieces, fabric lengths are listed on the product card. When in doubt between sizes, size up for a relaxed fit.",
                },
                {
                  id: "shipping",
                  label: "Shipping & Returns",
                  editable: false as const,
                  content:
                    "Standard shipping 3–7 business days. Free shipping on orders over ₹7,199. Returns accepted within 30 days of delivery for unused items with tags attached.",
                },
              ] as const
            ).map((tab) => {
              const isOpen = openTab === tab.id;
              return (
                <div key={tab.id}>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-between py-4 text-left"
                    onClick={() => setOpenTab(isOpen ? "" : tab.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm uppercase tracking-[0.12em]">
                      {tab.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 animate-fade-in">
                      {tab.editable ? (
                        <textarea
                          rows={4}
                          value={values.description}
                          onChange={(e) =>
                            setField("description", e.target.value)
                          }
                          className="w-full resize-y border border-border bg-background px-3 py-2 text-sm leading-relaxed text-muted outline-none focus:border-accent"
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-muted">
                          {tab.content}
                          <span className="mt-2 block text-xs italic">
                            Store-wide text — same on every product.
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
