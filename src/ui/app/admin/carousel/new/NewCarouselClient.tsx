"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { CarouselForm } from "@/components/admin/CarouselForm";
import { listAllBanners } from "@/lib/banner-api";
import { MAX_BANNERS } from "@/lib/banners";
import { useAuthStore } from "@/lib/auth-store";

function NewBody() {
  const access = useAuthStore((s) => s.access);
  const [loading, setLoading] = useState(true);
  const [atMax, setAtMax] = useState(false);

  useEffect(() => {
    if (!access) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await listAllBanners(access);
        if (!cancelled) setAtMax(list.length >= MAX_BANNERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [access]);

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (atMax) {
    return (
      <div className="border border-border bg-surface px-6 py-10 text-center">
        <p className="font-display text-2xl">Slide limit reached</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          You can have up to {MAX_BANNERS} carousel slides. Remove one before
          adding another.
        </p>
        <Link
          href="/admin/carousel"
          className="mt-6 inline-flex min-h-11 items-center px-5 text-sm text-muted hover:text-foreground"
        >
          Back to carousel
        </Link>
      </div>
    );
  }

  return <CarouselForm />;
}

export default function NewCarouselClient() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <NewBody />
      </div>
    </RequireAuth>
  );
}
