"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { RequireAuth } from "@/components/admin/RequireAuth";
import {
  deleteBanner,
  listAllBanners,
  reorderBanners,
} from "@/lib/banner-api";
import { MAX_BANNERS } from "@/lib/banners";
import { revalidateStorefrontHome } from "@/lib/revalidate-storefront";
import { useAuthStore } from "@/lib/auth-store";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

function CarouselContent() {
  const access = useAuthStore((s) => s.access);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!access) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listAllBanners(access);
      setBanners(
        [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      );
    } catch {
      setError("Could not load carousel slides.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [access]);

  useEffect(() => {
    void load();
  }, [load]);

  const persistOrder = async (next: Banner[]) => {
    if (!access) return;
    setBanners(next);
    try {
      await reorderBanners(
        next.map((b) => b.id),
        access,
      );
      await revalidateStorefrontHome();
    } catch {
      setError("Could not save slide order.");
      void load();
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    void persistOrder(next);
  };

  const onDragStart = (index: number) => setDragIndex(index);

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...banners];
    const [item] = next.splice(dragIndex, 1);
    next.splice(index, 0, item);
    setDragIndex(index);
    setBanners(next);
  };

  const onDragEnd = () => {
    if (dragIndex !== null) {
      void persistOrder(banners);
    }
    setDragIndex(null);
  };

  const onRemove = async (id: string) => {
    if (!access) return;
    if (!window.confirm("Delete this slide? This cannot be undone.")) return;
    try {
      await deleteBanner(id, access);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      await revalidateStorefrontHome();
    } catch {
      setError("Could not delete slide.");
    }
  };

  const atMax = banners.length >= MAX_BANNERS;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Homepage carousel</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        Manage hero slides on the storefront. Edit inline on a live preview —
        image, text, and button link.
      </p>

      {error && (
        <p className="mt-6 border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Loading slides…</p>
      ) : !banners.length ? (
        <div className="mt-12 border border-dashed border-border bg-surface px-6 py-14 text-center">
          <p className="font-display text-2xl">No slides yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Add your first hero slide. The editor looks like the live homepage
            banner.
          </p>
          <Link
            href="/admin/carousel/new"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium tracking-wide text-white hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Add slide
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {banners.length} slide{banners.length === 1 ? "" : "s"}
              {atMax && ` · max ${MAX_BANNERS}`}
            </p>
            {atMax ? (
              <span className="text-sm text-muted">
                Remove a slide to add another
              </span>
            ) : (
              <Link
                href="/admin/carousel/new"
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium tracking-wide text-white hover:bg-accent-hover"
              >
                <Plus className="h-4 w-4" />
                Add slide
              </Link>
            )}
          </div>

          <ul className="divide-y divide-border border border-border bg-surface">
            {banners.map((banner, index) => (
              <li
                key={banner.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 sm:px-4",
                  dragIndex === index && "bg-background/80",
                )}
              >
                <span
                  className="cursor-grab text-muted active:cursor-grabbing"
                  aria-hidden
                >
                  <GripVertical className="h-5 w-5" />
                </span>

                <div className="relative h-14 w-24 shrink-0 overflow-hidden bg-border/40">
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{banner.title}</p>
                  <p className="truncate text-sm text-muted">{banner.subtitle}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{banner.ctaLabel}</span>
                    <span aria-hidden>·</span>
                    <span className="truncate">{banner.ctaHref}</span>
                    {!banner.isActive && (
                      <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === banners.length - 1}
                    className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/admin/carousel/${banner.id}/edit`}
                    className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-foreground"
                    aria-label="Edit slide"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onRemove(banner.id)}
                    className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-sale"
                    aria-label="Delete slide"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CarouselList() {
  return (
    <RequireAuth>
      <CarouselContent />
    </RequireAuth>
  );
}
