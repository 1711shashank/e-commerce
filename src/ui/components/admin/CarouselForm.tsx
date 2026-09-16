"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Upload } from "lucide-react";
import { CarouselSlidePreview } from "@/components/admin/CarouselSlidePreview";
import { Button } from "@/components/ui/Button";
import {
  bannerToFormValues,
  emptyBannerForm,
  formValuesToBannerPreview,
  validateBannerForm,
  validateCtaHref,
  type BannerFormValues,
} from "@/lib/banners";
import {
  createBanner,
  updateBanner,
  uploadBannerImage,
} from "@/lib/banner-api";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage, getFieldError } from "@/lib/api-errors";
import { revalidateStorefrontHome } from "@/lib/revalidate-storefront";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const fieldHint = "mt-1 text-xs text-sale";
const inputClass =
  "mt-1.5 min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-accent";
const labelClass = "block text-xs uppercase tracking-[0.14em] text-muted";

interface CarouselFormProps {
  banner?: Banner;
}

export function CarouselForm({ banner }: CarouselFormProps) {
  const router = useRouter();
  const access = useAuthStore((s) => s.access);
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [values, setValues] = useState<BannerFormValues>(() =>
    banner ? bannerToFormValues(banner) : emptyBannerForm(),
  );
  const [initial] = useState(() =>
    banner ? bannerToFormValues(banner) : emptyBannerForm(),
  );
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const dirty = useMemo(
    () =>
      pendingImageFile !== null ||
      JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial, pendingImageFile],
  );

  const preview = useMemo(
    () => formValuesToBannerPreview(values, banner?.id ?? "preview"),
    [values, banner?.id],
  );

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const setField = <K extends keyof BannerFormValues>(
    key: K,
    value: BannerFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const revokePendingObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const goBack = () => {
    router.push("/admin/carousel");
  };

  const onCancel = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    goBack();
  };

  const onSelectFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Unsupported image type. Use JPEG, PNG, WebP, or GIF.",
      }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Image must be 8 MB or smaller.",
      }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    revokePendingObjectUrl();
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPendingImageFile(file);
    setField("image", objectUrl);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!access) {
      setError("You must be logged in to save slides.");
      return;
    }

    const errs = validateBannerForm(values);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setError("Fix the highlighted fields.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let imageUrl = values.image.trim();
      if (pendingImageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadBannerImage(pendingImageFile, access);
        } catch (err) {
          setFieldErrors((prev) => ({
            ...prev,
            image:
              err instanceof ApiError
                ? getApiErrorMessage(err)
                : "Could not upload image to S3. Is the catalog service running?",
          }));
          setError("Fix the highlighted fields.");
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        ctaHref: values.ctaHref.trim(),
        image: imageUrl,
      };

      if (banner) {
        await updateBanner(banner.id, payload, access);
      } else {
        await createBanner(payload, access);
      }
      await revalidateStorefrontHome();
      router.push("/admin/carousel");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        const imageError = getFieldError(err, "image");
        if (imageError) {
          setFieldErrors((prev) => ({ ...prev, image: imageError }));
        }
        setError(getApiErrorMessage(err, "image"));
      } else {
        setError("Could not save slide. Try again.");
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const busy = saving || uploading;
  const hrefError = validateCtaHref(values.ctaHref);
  const canTest = !hrefError && values.ctaHref.trim().length > 0;

  const onTestLink = () => {
    const href = values.ctaHref.trim();
    if (validateCtaHref(href)) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:text-foreground"
            aria-label="Back to carousel"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl">
              {banner ? "Edit slide" : "New slide"}
            </h1>
            {dirty && (
              <p className="text-xs text-muted">Unsaved changes</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <CarouselSlidePreview banner={preview} />
        </div>

        <form
          onSubmit={onSubmit}
          className="flex h-full w-[min(28rem,40%)] shrink-0 flex-col overflow-hidden border-l border-border bg-surface"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {error && (
              <p className="mb-4 border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
                {error}
              </p>
            )}

            <div className="space-y-5">
              <div>
                <span className={labelClass}>Background image</span>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!busy) setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (!busy) onSelectFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "mt-1.5 flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center transition-colors",
                    dragOver
                      ? "border-accent bg-accent/5"
                      : fieldErrors.image
                        ? "border-sale bg-sale/5"
                        : "border-border bg-background",
                    busy && "pointer-events-none opacity-60",
                  )}
                >
                  {values.image ? (
                    <div className="relative h-16 w-28 overflow-hidden bg-border/40">
                      <Image
                        src={values.image}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <Upload className="h-5 w-5 text-muted" />
                  )}
                  <p className="text-sm text-muted">
                    Drag an image here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-foreground underline underline-offset-2 hover:text-accent"
                    >
                      {values.image ? "change image" : "choose from your device"}
                    </button>
                  </p>
                  {pendingImageFile ? (
                    <p className="max-w-full truncate text-xs text-foreground">
                      {pendingImageFile.name}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted">
                    JPEG, PNG, WebP, or GIF · max 8 MB
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => onSelectFiles(e.target.files)}
                  />
                </div>
                {fieldErrors.image && (
                  <p className={fieldHint}>{fieldErrors.image}</p>
                )}
              </div>

              <label className="block">
                <span className={labelClass}>Redirect URL</span>
                <input
                  type="text"
                  value={values.ctaHref}
                  onChange={(e) => setField("ctaHref", e.target.value)}
                  placeholder="/collections/women"
                  className={cn(
                    inputClass,
                    fieldErrors.ctaHref && "border-sale",
                  )}
                />
                {fieldErrors.ctaHref && (
                  <p className={fieldHint}>{fieldErrors.ctaHref}</p>
                )}
                <button
                  type="button"
                  onClick={onTestLink}
                  disabled={!canTest}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Test link
                </button>
              </label>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {uploading
                ? "Uploading…"
                : saving
                  ? "Saving…"
                  : banner
                    ? "Save changes"
                    : "Create slide"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
