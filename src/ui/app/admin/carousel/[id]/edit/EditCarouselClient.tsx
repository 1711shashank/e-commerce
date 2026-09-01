"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { CarouselForm } from "@/components/admin/CarouselForm";
import { getBanner } from "@/lib/banner-api";
import { useAuthStore } from "@/lib/auth-store";
import type { Banner } from "@/lib/types";

function EditBody({ id }: { id: string }) {
  const access = useAuthStore((s) => s.access);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!access) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getBanner(id, access);
        if (!cancelled) setBanner(data);
      } catch {
        if (!cancelled) setMissing(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [access, id]);

  if (loading) {
    return <p className="text-sm text-muted">Loading slide…</p>;
  }
  if (missing || !banner) notFound();

  return <CarouselForm key={banner.id} banner={banner} />;
}

export default function EditCarouselClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <EditBody id={id} />
      </div>
    </RequireAuth>
  );
}
