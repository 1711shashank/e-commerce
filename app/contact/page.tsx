"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <h1 className="font-display text-4xl sm:text-5xl">Contact Us</h1>
      <p className="mt-3 text-sm text-muted sm:text-base">
        Questions about orders, sizing, or collections? Send us a note — this
        form is UI-only for now.
      </p>

      {sent ? (
        <p className="mt-10 text-sm">Thanks — we&apos;ll get back to you soon.</p>
      ) : (
        <form
          className="mt-10 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            required
            placeholder="Name"
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            className="w-full border border-border bg-surface px-4 py-3 text-sm"
          />
          <Button type="submit">Send message</Button>
        </form>
      )}

      <div className="mt-14 space-y-2 text-sm text-muted">
        <p className="font-medium text-foreground">concierge@kusum.ae</p>
        <p>WhatsApp & Tel: +971 4 800 KUSUM (+971 4 800 58786)</p>
        <p>Sunday – Friday: 10:00 AM – 8:00 PM (Gulf Standard Time)</p>
        <p className="text-xs text-muted/80">Kusum Flagship Atelier · Dubai Design District (d3), UAE</p>
      </div>
    </div>
  );
}
