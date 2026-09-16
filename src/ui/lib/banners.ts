import type { Banner } from "@/lib/types";

export type BannerFormValues = {
  ctaHref: string;
  image: string;
};

export const MAX_BANNERS = 10;

export function emptyBannerForm(): BannerFormValues {
  return {
    ctaHref: "/collections",
    image: "",
  };
}

export function bannerToFormValues(banner: Banner): BannerFormValues {
  return {
    ctaHref: banner.ctaHref,
    image: banner.image,
  };
}

export function formValuesToBannerPreview(
  values: BannerFormValues,
  id = "preview",
): Banner {
  return {
    id,
    ctaHref: values.ctaHref,
    image: values.image,
  };
}

export function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/media/")) return true;
  if (value.startsWith("blob:")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateCtaHref(href: string): string | null {
  const value = href.trim();
  if (!value) return "Redirect URL is required.";
  const lower = value.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return "Invalid URL scheme.";
  }
  if (value.startsWith("/")) return null;
  if (value.startsWith("https://")) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:") {
        return "External links must use https://.";
      }
      return null;
    } catch {
      return "Enter a valid https:// URL.";
    }
  }
  if (value.startsWith("http://")) {
    return "Use https:// for external links.";
  }
  return "Use an internal path (/collections/sale) or https:// URL.";
}

export function validateBannerForm(
  values: BannerFormValues,
): Record<string, string> {
  const errs: Record<string, string> = {};
  const hrefErr = validateCtaHref(values.ctaHref);
  if (hrefErr) errs.ctaHref = hrefErr;
  if (!values.image.trim()) errs.image = "Background image is required.";
  else if (!isAllowedImageUrl(values.image.trim())) {
    errs.image = "Upload an image from the admin panel (S3 or /media URL).";
  }
  return errs;
}
