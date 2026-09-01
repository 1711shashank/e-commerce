"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateCtaHref } from "@/lib/banners";
import { cn } from "@/lib/utils";

type CarouselCtaPopoverProps = {
  open: boolean;
  ctaLabel: string;
  ctaHref: string;
  errors?: { ctaLabel?: string; ctaHref?: string };
  onChange: (field: "ctaLabel" | "ctaHref", value: string) => void;
  onClose: () => void;
};

export function CarouselCtaPopover({
  open,
  ctaLabel,
  ctaHref,
  errors = {},
  onChange,
  onClose,
}: CarouselCtaPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hrefError = validateCtaHref(ctaHref);
  const canTest = !hrefError && ctaHref.trim().length > 0;

  const onTestLink = () => {
    const href = ctaHref.trim();
    if (validateCtaHref(href)) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div
        ref={ref}
        className="w-full max-w-md border border-border bg-surface p-6 shadow-lg"
        role="dialog"
        aria-label="Edit button"
      >
        <h2 className="font-display text-xl">Button settings</h2>
        <p className="mt-1 text-sm text-muted">
          Set the label and where the button links to.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-muted">
              Button text
            </span>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => onChange("ctaLabel", e.target.value)}
              maxLength={40}
              className={cn(
                "mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm",
                errors.ctaLabel && "border-sale",
              )}
            />
            {errors.ctaLabel && (
              <span className="mt-1 block text-xs text-sale">{errors.ctaLabel}</span>
            )}
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-muted">
              Redirect URL
            </span>
            <input
              type="text"
              value={ctaHref}
              onChange={(e) => onChange("ctaHref", e.target.value)}
              placeholder="/collections/women"
              className={cn(
                "mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm",
                errors.ctaHref && "border-sale",
              )}
            />
            {errors.ctaHref && (
              <span className="mt-1 block text-xs text-sale">{errors.ctaHref}</span>
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

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
