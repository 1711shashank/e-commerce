"use client";

import { useState } from "react";
import { Ruler, Scissors, Sparkles, CheckCircle2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  const standardSizes = [
    { size: "XS", bust: [34, 86], waist: [28, 71], hip: [38, 96], shoulder: [14, 35.5], length: [38, 96.5] },
    { size: "S", bust: [36, 91], waist: [30, 76], hip: [40, 101], shoulder: [14.5, 37], length: [39, 99] },
    { size: "M", bust: [39, 99], waist: [33, 84], hip: [43, 109], shoulder: [15, 38], length: [40, 101.5] },
    { size: "L", bust: [42, 107], waist: [36, 91], hip: [46, 117], shoulder: [15.5, 39.5], length: [41, 104] },
    { size: "XL", bust: [45, 114], waist: [39, 99], hip: [49, 124], shoulder: [16, 40.5], length: [42, 106.5] },
    { size: "XXL", bust: [48, 122], waist: [42, 107], hip: [52, 132], shoulder: [16.5, 42], length: [42, 106.5] },
  ];

  const abayaSizes = [
    { size: "52", heightFt: "5'0″ – 5'2″", heightCm: "152 – 157 cm", bustIn: "42″ – 44″", sleeveIn: "27″" },
    { size: "54", heightFt: "5'3″ – 5'4″", heightCm: "160 – 163 cm", bustIn: "44″ – 46″", sleeveIn: "28″" },
    { size: "56", heightFt: "5'5″ – 5'6″", heightCm: "165 – 168 cm", bustIn: "46″ – 48″", sleeveIn: "29″" },
    { size: "58", heightFt: "5'7″ – 5'8″", heightCm: "170 – 173 cm", bustIn: "48″ – 50″", sleeveIn: "30″" },
    { size: "60", heightFt: "5'9″ – 5'11″", heightCm: "175 – 180 cm", bustIn: "50″ – 52″", sleeveIn: "31″" },
  ];

  const yardageDetails = [
    { item: "Shirt / Kameez Fabric", yardage: "3.00 – 3.25 Meters", notes: "Allows full length A-line, straight kurta, or flared cuts up to 2XL" },
    { item: "Dupatta / Sheila", yardage: "2.50 – 2.75 Meters", notes: "Full modest coverage width with finished 4-side borders" },
    { item: "Trouser / Bottom", yardage: "2.50 Meters", notes: "Suitable for cigarette pants, culottes, shalwar, or flared trousers" },
    { item: "Inner Slip Fabric", yardage: "2.00 – 2.50 Meters", notes: "Dyed soft breathable cotton silk or malmal lining" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Size Guide & Stitching" }]}
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">
          Size & Stitching Guide
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
          Ensure the perfect graceful fit for your Kusum ethnic garments, modest abayas, and unstitched luxury fabrics.
        </p>
      </div>

      {/* Unit Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex border border-border p-1 bg-surface">
          <button
            type="button"
            onClick={() => setUnit("inches")}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
              unit === "inches"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Inches (in)
          </button>
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
              unit === "cm"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Centimeters (cm)
          </button>
        </div>
      </div>

      {/* 1. Stitched Ready-to-Wear Chart */}
      <div className="border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl sm:text-2xl text-foreground">
            Women&apos;s Ethnic Pret (Ready to Wear)
          </h2>
        </div>
        <p className="text-xs text-muted mb-6">
          Measurements reflect finished garment sizing. Fits true to modest designer silhouette with comfortable ease.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-3 font-semibold uppercase tracking-wider">Size</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Bust ({unit})</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Waist ({unit})</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Hip ({unit})</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Shoulder ({unit})</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Kurta Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {standardSizes.map((row) => (
                <tr key={row.size} className="hover:bg-background/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">{row.size}</td>
                  <td className="p-3 text-muted">{unit === "inches" ? `${row.bust[0]}"` : `${row.bust[1]} cm`}</td>
                  <td className="p-3 text-muted">{unit === "inches" ? `${row.waist[0]}"` : `${row.waist[1]} cm`}</td>
                  <td className="p-3 text-muted">{unit === "inches" ? `${row.hip[0]}"` : `${row.hip[1]} cm`}</td>
                  <td className="p-3 text-muted">{unit === "inches" ? `${row.shoulder[0]}"` : `${row.shoulder[1]} cm`}</td>
                  <td className="p-3 text-muted">{unit === "inches" ? `${row.length[0]}"` : `${row.length[1]} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Modest Abaya & Kaftan Length Chart */}
      <div className="border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl sm:text-2xl text-foreground">
            Abaya & Kaftan Sizing (By Height)
          </h2>
        </div>
        <p className="text-xs text-muted mb-6">
          Abayas are sized by standard garment length from the top of the shoulder down to the floor.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-3 font-semibold uppercase tracking-wider">Abaya Size (Length)</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Recommended Height</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Height in CM</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Chest Flare</th>
                <th className="p-3 font-semibold uppercase tracking-wider">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {abayaSizes.map((row) => (
                <tr key={row.size} className="hover:bg-background/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Size {row.size} ({row.size}″)</td>
                  <td className="p-3 text-muted">{row.heightFt}</td>
                  <td className="p-3 text-muted">{row.heightCm}</td>
                  <td className="p-3 text-muted">{row.bustIn}</td>
                  <td className="p-3 text-muted">{row.sleeveIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Unstitched Fabric Yardage */}
      <div className="border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Scissors className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl sm:text-2xl text-foreground">
            Unstitched 3-Piece Fabric Breakdown
          </h2>
        </div>
        <p className="text-xs text-muted mb-6">
          Every Kusum unstitched luxury lawn, chiffon, and formals pack includes generous fabric allowances:
        </p>

        <div className="space-y-3">
          {yardageDetails.map((detail, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-border/60 bg-background/40 text-xs sm:text-sm"
            >
              <div>
                <span className="font-semibold text-foreground">{detail.item}</span>
                <p className="text-muted text-xs mt-0.5">{detail.notes}</p>
              </div>
              <span className="font-mono font-medium text-accent mt-2 sm:mt-0">
                {detail.yardage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Measuring Guide */}
      <div className="border border-border bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg text-foreground mb-4">
          How to Measure Yourself Accurately
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm text-muted">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p><strong>Bust:</strong> Measure around the fullest part of your chest, keeping tape level under arms.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p><strong>Waist:</strong> Measure around your natural waistline, keeping one finger between tape and body.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p><strong>Hips:</strong> Stand with feet together and measure around the fullest part of your hips.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p><strong>Abaya Length:</strong> Measure from the top of your shoulder down to your ankle or heel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
