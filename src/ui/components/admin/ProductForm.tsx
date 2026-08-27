"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FABRIC_OPTIONS,
  SIZE_OPTIONS,
  buildProductFromForm,
  emptyProductForm,
  productToFormValues,
  type ProductFormValues,
} from "@/lib/catalog";
import { createProduct, updateProduct } from "@/lib/catalog-api";
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
  const images = values.images.filter(Boolean);
  const safeActive = images.length
    ? Math.min(activeImage, images.length - 1)
    : 0;

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
      const next = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: next };
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
    setValues((prev) => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl("");
    setActiveImage(values.images.length);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setActiveImage((prev) => (prev > index ? prev - 1 : prev === index ? 0 : prev));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= values.images.length) return;
    setValues((prev) => {
      const next = [...prev.images];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...prev, images: next };
    });
    setActiveImage(target);
  };

  const addColor = () => {
    const name = newColor.trim();
    if (!name) return;
    if (values.colors.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setNewColor("");
      return;
    }
    setValues((prev) => ({ ...prev, colors: [...prev.colors, name] }));
    setSelectedColor(name);
    setNewColor("");
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.colors;
      return next;
    });
  };

  const removeColor = (color: string) => {
    setValues((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
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
    if (!values.images.filter(Boolean).length) {
      errs.images = "Add at least one image.";
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
      sizes: result.product.sizes,
      colors: result.product.colors,
      fabric: result.product.fabric ?? "",
      description: result.product.description,
      isNew: result.product.isNew,
      isOnSale: result.product.isOnSale,
      inStock: result.product.inStock,
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
              ["inStock", "In stock"],
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

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-border/30 lg:flex-1">
              {images[safeActive] ? (
                <Image
                  src={images[safeActive]}
                  alt={values.name || "Product image"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted">
                  <p>No images yet</p>
                  <p className="text-xs">Add an image URL below</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
              {images.map((src, i) => (
                <div key={`${src}-${i}`} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-20 w-16 overflow-hidden border-2 lg:h-24 lg:w-full",
                      safeActive === i
                        ? "border-foreground"
                        : "border-transparent",
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                  <div className="absolute -right-1 -top-1 flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="flex h-5 w-5 items-center justify-center bg-foreground text-background"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mt-1 flex justify-center gap-0.5 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="flex h-6 w-6 items-center justify-center border border-border disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      className="flex h-6 w-6 items-center justify-center border border-border disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className="min-h-11 flex-1 border border-border bg-background px-3 text-sm outline-none focus:border-accent"
              placeholder="Paste image URL and add…"
            />
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {fieldErrors.images && (
            <p className={fieldHint}>{fieldErrors.images}</p>
          )}
        </div>

        {/* Info panel */}
        <div className="space-y-6 lg:pt-2">
          <div className="flex flex-wrap gap-2">
            {values.isNew && <Badge variant="new">New</Badge>}
            {(values.isOnSale || !!values.discountPrice.trim()) && (
              <Badge variant="sale">Sale</Badge>
            )}
            {!values.inStock && <Badge variant="soldout">Sold Out</Badge>}
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

          {/* Colors */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
              Color{selectedColor ? ` — ${selectedColor}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {values.colors.map((color) => (
                <div key={color} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "min-h-11 border px-4 pr-9 text-sm transition-colors",
                      selectedColor === color
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50",
                    )}
                  >
                    {color}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className={cn(
                      "absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center",
                      selectedColor === color
                        ? "text-background/80 hover:text-background"
                        : "text-muted hover:text-foreground",
                    )}
                    aria-label={`Remove ${color}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex max-w-sm gap-2">
              <input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
                className="min-h-11 flex-1 border border-border bg-background px-3 text-sm outline-none focus:border-accent"
                placeholder="Add a color…"
              />
              <Button type="button" variant="outline" onClick={addColor}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {fieldErrors.colors && (
              <p className={fieldHint}>{fieldErrors.colors}</p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
              Size{selectedSize ? ` — ${selectedSize}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => {
                const active = values.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors",
                      active
                        ? selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/60 bg-foreground/10"
                        : "border-border text-muted hover:border-foreground/40",
                    )}
                    aria-pressed={active}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">
              Click a size to include or remove it. Highlighted sizes are
              available to shoppers.
            </p>
            {fieldErrors.sizes && (
              <p className={fieldHint}>{fieldErrors.sizes}</p>
            )}
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
