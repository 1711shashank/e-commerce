"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Crown, Sparkles, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

const couturePieces = [
  {
    title: "Shahi Mehfil Crimson Zardozi Lehenga",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=80",
    work: "Pure Zardozi, Marori, Dabka & Real Silver Zari",
    silhouette: "16-Kali Kalidar Lehenga with 4-Meter Ghera",
  },
  {
    title: "Dastaan Antique Gold Tissue Bridal Peshwas",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80",
    work: "Handcrafted Mukesh, Kamdani & Swarovski Crystal Sprays",
    silhouette: "Royal Nikah Floor-Length Peshwas with Brocade Skirt",
  },
  {
    title: "Gulmohar Rose Gold Scalloped Bridal Gown",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80",
    work: "Panni Work, Cut-Dana & Pearl Embellished Net Veil",
    silhouette: "Contemporary Flared Bridal Gown with Matha Patti Veil",
  },
];

export default function BridalPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    weddingDate: "",
    city: "Dubai, UAE",
    budget: "AED 5,000 – AED 10,000",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[65vh] min-h-[460px] w-full bg-[#0a0a0a] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&q=80"
          alt="Kusum Bridal Couture"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/80 font-medium block mb-3">
            Haute Couture Atelier
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide">
            Kusum Bridal Couture
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/85 max-w-xl mx-auto leading-relaxed">
            Heirloom craftsmanship, centuries-old zardozi needlework, and bespoke royal silhouettes made to cherish for generations.
          </p>
          <a
            href="#consultation"
            className="mt-8 inline-block border border-white bg-white/10 px-8 py-3 text-xs uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
          >
            Book Bespoke Consultation
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <Breadcrumb
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Bridal Couture" }]}
        />

        {/* Master Craftsmanship Pillars */}
        <div className="grid gap-8 sm:grid-cols-3 mb-20 text-center">
          <div className="border border-border p-6 sm:p-8 bg-surface">
            <Crown className="h-6 w-6 mx-auto text-accent mb-3" />
            <h3 className="font-display text-xl text-foreground">Royal Heritage Cuts</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Expansive 16-kali kalidar lehengas, majestic regal peshwas gowns, and Mughal-inspired ghararas tailored to your exact measurements.
            </p>
          </div>
          <div className="border border-border p-6 sm:p-8 bg-surface">
            <Sparkles className="h-6 w-6 mx-auto text-accent mb-3" />
            <h3 className="font-display text-xl text-foreground">Artisanal Handwork</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Every heirloom piece is embroidered over 300+ artisan hours utilizing pure silver zari, metallic tilla, marori, dabka, and micro-pearls.
            </p>
          </div>
          <div className="border border-border p-6 sm:p-8 bg-surface">
            <Calendar className="h-6 w-6 mx-auto text-accent mb-3" />
            <h3 className="font-display text-xl text-foreground">Bespoke Concierge</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Personal one-on-one virtual or in-person consultation with our senior bridal stylists in Dubai, complete with fabric swatches and fittings.
            </p>
          </div>
        </div>

        {/* Couture Lookbook Showcase */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
              The Heirloom Portfolio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mt-1">
              Signature Bridal Creations
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {couturePieces.map((piece, idx) => (
              <div key={idx} className="group border border-border bg-surface overflow-hidden">
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-foreground group-hover:text-accent transition-colors">
                    {piece.title}
                  </h3>
                  <div className="mt-3 space-y-1 text-xs text-muted">
                    <p><strong>Craft:</strong> {piece.work}</p>
                    <p><strong>Silhouette:</strong> {piece.silhouette}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Booking Form */}
        <div id="consultation" className="max-w-3xl mx-auto border border-border bg-surface p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8">
            <Crown className="h-6 w-6 mx-auto text-accent mb-2" />
            <h2 className="font-display text-2xl sm:text-3xl text-foreground">
              Request a Bridal Consultation
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Connect with our master couture team in Dubai to commission your dream bridal ensemble.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 text-center border border-accent/30 bg-accent/5">
              <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="font-display text-xl text-foreground">Consultation Request Received</h3>
              <p className="mt-2 text-xs text-muted max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Our senior bridal concierge will contact you via WhatsApp and email within 24 hours to schedule your consultation.
              </p>
              <Link href="/collections/unstitched" className="mt-5 inline-block text-xs uppercase tracking-wider font-semibold text-accent hover:underline">
                Explore Lawn & Pret in the meantime →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fatima Al Zahra"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. fatima@domain.com"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  Tentative Wedding Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  City / Location
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Dubai, Abu Dhabi, London, Riyadh..."
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  Estimated Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                >
                  <option>AED 3,500 – AED 6,000</option>
                  <option>AED 6,000 – AED 10,000</option>
                  <option>AED 10,000 – AED 18,000</option>
                  <option>Bespoke Heirloom (AED 18,000+)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2">
                  Customization Notes & Preferred Colors
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Mention your preferred silhouette (Lehenga, Peshwas, Gharara), color palette, or specific bridal inspirations..."
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" className="w-full min-h-12 text-xs uppercase tracking-wider">
                  Submit Consultation Request
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
