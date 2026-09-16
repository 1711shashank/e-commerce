"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CarouselCtaPopover } from "@/components/admin/CarouselCtaPopover";
import { Button } from "@/components/ui/Button";
import {
  bannerToFormValues,
  emptyBannerForm,
  formValuesToBannerPreview,
  validateBannerForm,
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

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

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
  const [ctaOpen, setCtaOpen] = useState(false);

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

  const onCancel = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    router.push("/admin/carousel");
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
        eyebrow: values.eyebrow.trim(),
        title: values.title.trim(),
        subtitle: values.subtitle.trim(),
        ctaLabel: values.ctaLabel.trim(),
        ctaHref: values.ctaHref.trim(),
        image: imageUrl,
        imageAlt: values.imageAlt.trim(),
        textColor: values.textColor,
        isActive: values.isActive,
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

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">
              {banner ? "Edit slide" : "New slide"}
            </h1>
            {dirty && (
              <p className="text-xs text-muted">Unsaved changes</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
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
      </div>

      {error && (
        <p className="mb-4 border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {values.image ? "Change image" : "Choose image"}
        </Button>
        {fieldErrors.image && (
          <span className="text-sm text-sale">{fieldErrors.image}</span>
        )}
        <span className="text-xs text-muted">JPEG, PNG, WebP, or GIF · max 8 MB</span>
      </div>

      <div className="-mx-5 sm:-mx-8 lg:-mx-10">
        <HeroCarousel
          banners={[preview]}
          mode="edit"
          fieldErrors={fieldErrors}
          onFieldChange={(field, value) => {
            if (field === "eyebrow") setField("eyebrow", value);
            else if (field === "title") setField("title", value);
            else if (field === "subtitle") setField("subtitle", value);
          }}
          onCtaClick={() => setCtaOpen(true)}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onSelectFiles(e.target.files)}
      />

      <CarouselCtaPopover
        open={ctaOpen}
        ctaLabel={values.ctaLabel}
        ctaHref={values.ctaHref}
        errors={{
          ctaLabel: fieldErrors.ctaLabel,
          ctaHref: fieldErrors.ctaHref,
        }}
        onChange={(field, value) => setField(field, value)}
        onClose={() => setCtaOpen(false)}
      />
    </form>
  );
}
