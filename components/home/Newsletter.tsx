"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-accent text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
            Stay in the loop
          </h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            New drops, early sale access, and styling notes — straight to your
            inbox.
          </p>
        </div>
        {done ? (
          <p className="text-sm tracking-wide">Thanks for subscribing.</p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-h-12 flex-1 border border-white/30 bg-transparent px-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
