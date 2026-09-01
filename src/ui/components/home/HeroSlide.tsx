"use client";

import type { KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroSlideProps = {
  banner: Banner;
  mode?: "live" | "edit";
  fieldErrors?: Record<string, string>;
  onFieldChange?: (field: keyof Banner, value: string) => void;
  onCtaClick?: () => void;
};

export function HeroSlide({
  banner,
  mode = "live",
  fieldErrors = {},
  onFieldChange,
  onCtaClick,
}: HeroSlideProps) {
  const isEdit = mode === "edit";
  const isLight = (banner.textColor ?? "light") === "light";
  const textPrimary = isLight ? "text-white" : "text-foreground";
  const textMuted = isLight ? "text-white/70" : "text-foreground/70";
  const textBody = isLight ? "text-white/85" : "text-foreground/85";
  const gradientClass = isLight
    ? "from-foreground/70 via-foreground/40"
    : "from-background/70 via-background/40";

  const editableClass = (field: string) =>
    cn(
      isEdit &&
        "cursor-text rounded-sm outline-none ring-1 ring-transparent transition-shadow hover:ring-white/30 focus:ring-white/50",
      fieldErrors[field] && "ring-sale/60",
    );

  const stopCarouselKeys = (e: KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative min-w-0 flex-[0_0_100%]">
      <div className="relative h-[360px] sm:h-[440px] lg:h-[560px]">
        {banner.image ? (
          <Image
            src={banner.image}
            alt={banner.imageAlt || banner.title || "Hero banner"}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
            unoptimized={isEdit}
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/80" />
        )}

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r to-transparent",
            gradientClass,
          )}
        />
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-20 sm:px-8 sm:pb-0 lg:px-10">
            {(banner.eyebrow || isEdit) && (
              isEdit ? (
                <input
                  type="text"
                  value={banner.eyebrow}
                  onChange={(e) => onFieldChange?.("eyebrow", e.target.value)}
                  onKeyDown={stopCarouselKeys}
                  placeholder="Eyebrow text (optional)"
                  maxLength={60}
                  className={cn(
                    "mb-3 w-full max-w-md bg-transparent text-xs uppercase tracking-[0.25em] animate-fade-up",
                    textMuted,
                    editableClass("eyebrow"),
                  )}
                />
              ) : (
                <p
                  className={cn(
                    "mb-3 text-xs uppercase tracking-[0.25em] animate-fade-up",
                    textMuted,
                  )}
                >
                  {banner.eyebrow}
                </p>
              )
            )}

            {isEdit ? (
              <input
                type="text"
                value={banner.title}
                onChange={(e) => onFieldChange?.("title", e.target.value)}
                onKeyDown={stopCarouselKeys}
                placeholder="Slide title"
                maxLength={80}
                className={cn(
                  "max-w-xl w-full bg-transparent font-display text-4xl leading-tight sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:80ms]",
                  textPrimary,
                  editableClass("title"),
                )}
              />
            ) : (
              <h1
                className={cn(
                  "max-w-xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:80ms]",
                  textPrimary,
                )}
              >
                {banner.title}
              </h1>
            )}

            {isEdit ? (
              <textarea
                value={banner.subtitle}
                onChange={(e) => onFieldChange?.("subtitle", e.target.value)}
                onKeyDown={stopCarouselKeys}
                placeholder="Slide description"
                maxLength={160}
                rows={2}
                className={cn(
                  "mt-4 max-w-md w-full resize-none bg-transparent text-sm sm:text-base animate-fade-up [animation-delay:140ms]",
                  textBody,
                  editableClass("subtitle"),
                )}
              />
            ) : (
              <p
                className={cn(
                  "mt-4 max-w-md text-sm sm:text-base animate-fade-up [animation-delay:140ms]",
                  textBody,
                )}
              >
                {banner.subtitle}
              </p>
            )}

            <div className="mt-7 animate-fade-up [animation-delay:200ms]">
              {isEdit ? (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center bg-white px-6 text-sm font-medium tracking-wide text-foreground hover:bg-white/90",
                    fieldErrors.ctaLabel || fieldErrors.ctaHref
                      ? "ring-2 ring-sale"
                      : "",
                  )}
                >
                  {banner.ctaLabel || "Button text"}
                </button>
              ) : (
                <Button
                  variant="secondary"
                  className="bg-white text-foreground hover:bg-white/90"
                >
                  <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
