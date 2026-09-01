import type { Banner } from "@/lib/types";

export type BannerFormValues = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  textColor: "light" | "dark";
  isActive: boolean;
};

export const MAX_BANNERS = 10;

export function emptyBannerForm(): BannerFormValues {
  return {
    eyebrow: "Aurelia Collection",
    title: "",
    subtitle: "",
    ctaLabel: "Shop Now",
    ctaHref: "/collections",
    image: "",
    imageAlt: "",
    textColor: "light",
    isActive: true,
  };
}

export function bannerToFormValues(banner: Banner): BannerFormValues {
  return {
    eyebrow: banner.eyebrow ?? "",
    title: banner.title,
    subtitle: banner.subtitle,
    ctaLabel: banner.ctaLabel,
    ctaHref: banner.ctaHref,
    image: banner.image,
    imageAlt: banner.imageAlt ?? "",
    textColor: banner.textColor ?? "light",
    isActive: banner.isActive ?? true,
  };
}

export function formValuesToBannerPreview(
  values: BannerFormValues,
  id = "preview",
): Banner {
  return {
    id,
    eyebrow: values.eyebrow,
    title: values.title,
    subtitle: values.subtitle,
    ctaLabel: values.ctaLabel,
    ctaHref: values.ctaHref,
    image: values.image,
    imageAlt: values.imageAlt,
    textColor: values.textColor,
    isActive: values.isActive,
  };
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
  if (values.eyebrow.length > 60) errs.eyebrow = "Max 60 characters.";
  if (!values.title.trim()) errs.title = "Title is required.";
  else if (values.title.length > 80) errs.title = "Max 80 characters.";
  if (!values.subtitle.trim()) errs.subtitle = "Description is required.";
  else if (values.subtitle.length > 160) errs.subtitle = "Max 160 characters.";
  if (!values.ctaLabel.trim()) errs.ctaLabel = "Button text is required.";
  else if (values.ctaLabel.length > 40) errs.ctaLabel = "Max 40 characters.";
  const hrefErr = validateCtaHref(values.ctaHref);
  if (hrefErr) errs.ctaHref = hrefErr;
  if (!values.image.trim()) errs.image = "Background image is required.";
  else {
    try {
      new URL(values.image);
    } catch {
      errs.image = "Enter a valid image URL.";
    }
  }
  if (values.imageAlt.length > 200) errs.imageAlt = "Max 200 characters.";
  return errs;
}
