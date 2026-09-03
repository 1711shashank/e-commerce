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
    <section className="relative overflow-hidden bg-[#141414] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #e00075 1.5px, transparent 1.5px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto flex max-w-[1536px] flex-col items-start gap-6 px-4 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between xl:px-12 lg:py-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e00075]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#e00075] font-bold">
              The Kusum Atelier Circle
            </span>
          </div>
          <h2 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Subscribe for Private Previews
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-white/80 font-normal leading-relaxed">
            Be the first to receive unstitched seasonal lawn catalog drops, festive bridal trunk shows, and private VIP previews directly to your inbox.
          </p>
        </div>
        {done ? (
          <p className="text-base font-semibold tracking-wide text-[#ffd6eb]">
            ✦ Thank you for joining the Kusum Circle.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
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
              placeholder="Enter your email address…"
              className="min-h-12 flex-1 border border-white/20 bg-white/5 px-4 text-sm tracking-wide text-white placeholder:text-white/60 focus:border-[#e00075] focus:outline-none"
            />
            <Button
              type="submit"
              className="min-h-12 bg-[#e00075] text-white hover:bg-[#c20065] text-xs uppercase tracking-[0.18em] font-bold border-0 px-7 shrink-0 shadow-sm"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
