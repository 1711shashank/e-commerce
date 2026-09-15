"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, PackageCheck, Search, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

interface TimelineStep {
  status: string;
  date: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [trackingData, setTrackingData] = useState<{
    orderId: string;
    customer: string;
    courier: string;
    trackingCode: string;
    estimatedDelivery: string;
    status: string;
    items: Array<{ name: string; type: string; qty: number }>;
    timeline: TimelineStep[];
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setSearched(true);
    setTrackingData({
      orderId: orderNumber.toUpperCase().startsWith("KB-")
        ? orderNumber.toUpperCase()
        : `KB-${orderNumber.toUpperCase()}`,
      customer: emailOrPhone || "Valued Client",
      courier: "DHL Express UAE / Careem Express",
      trackingCode: "DHL-DXB-98421049",
      estimatedDelivery: "In 2 business days (Delivery to Dubai / UAE)",
      status: "In Transit with Courier",
      items: [
        {
          name: "Chintz Rose Luxury Lawn 3-Piece Ensemble",
          type: "Stitched (Size M) · Master Tailored",
          qty: 1,
        },
        {
          name: "Sultana Classic Nida Open-Front Abaya",
          type: "Length 56 · Jet Black with Sheila",
          qty: 1,
        },
      ],
      timeline: [
        {
          status: "Order Confirmed & Payment Verified",
          date: "Yesterday, 10:30 AM",
          location: "Kusum Atelier, Dubai Hub",
          completed: true,
        },
        {
          status: "Fabric QC & Master Tailoring Complete",
          date: "Yesterday, 04:15 PM",
          location: "Tailoring Atelier",
          completed: true,
        },
        {
          status: "Dispatched & Handed to Courier",
          date: "Today, 08:45 AM",
          location: "Dubai Sorting Facility",
          completed: true,
          current: true,
        },
        {
          status: "Out for Delivery",
          date: "Expected Tomorrow, 11:00 AM",
          location: "Local Courier Hub",
          completed: false,
        },
        {
          status: "Delivered to Customer",
          date: "Expected Tomorrow, 03:00 PM",
          location: "Destination Address",
          completed: false,
        },
      ],
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Track Your Order" }]}
      />

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">
          Track Your Order
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
          Check live delivery status and custom tailoring milestones for your Kusum designer apparel.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="orderNumber"
              className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2"
            >
              Order Number *
            </label>
            <input
              id="orderNumber"
              type="text"
              required
              placeholder="e.g. KB-89214 or 89214"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="emailOrPhone"
              className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground mb-2"
            >
              Email or Phone Number *
            </label>
            <input
              id="emailOrPhone"
              type="text"
              required
              placeholder="e.g. client@domain.com or +971..."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-foreground transition-colors"
            />
          </div>
          <div className="sm:col-span-2 pt-2">
            <Button type="submit" className="w-full min-h-11 text-xs uppercase tracking-wider">
              <Search className="h-4 w-4 mr-2" />
              Track Status
            </Button>
          </div>
        </form>
      </div>

      {/* Tracking Results */}
      {searched && trackingData && (
        <div className="mt-8 border border-border bg-surface p-6 sm:p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Tracking Details
              </span>
              <h2 className="font-display text-2xl text-foreground mt-0.5">
                {trackingData.orderId}
              </h2>
              <p className="text-xs text-muted mt-1">
                Courier Partner: <strong className="text-foreground">{trackingData.courier}</strong> ({trackingData.trackingCode})
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                {trackingData.status}
              </span>
              <p className="text-xs text-muted mt-2">
                Estimated Delivery: <strong className="text-foreground">{trackingData.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-foreground mb-6">
              Milestone Progress
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-border">
              {trackingData.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border bg-surface transition-colors ${
                      step.completed
                        ? "border-accent text-accent"
                        : "border-border text-muted"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4 fill-accent text-white" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-medium ${step.completed ? "text-foreground" : "text-muted"}`}>
                      {step.status}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {step.date} · {step.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in parcel */}
          <div className="border-t border-border pt-6">
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-foreground mb-3">
              Shipment Contents
            </h3>
            <ul className="space-y-2">
              {trackingData.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 border-b border-border/40"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted mt-0.5">{item.type}</p>
                  </div>
                  <span className="text-muted">Qty: {item.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Support Strip */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
        <div className="border border-border p-4">
          <Truck className="h-5 w-5 mx-auto text-accent mb-2" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">Fast UAE Dispatch</h4>
          <p className="text-xs text-muted mt-1">1–3 Business days across UAE</p>
        </div>
        <div className="border border-border p-4">
          <ShieldCheck className="h-5 w-5 mx-auto text-accent mb-2" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">Original Packaging</h4>
          <p className="text-xs text-muted mt-1">Sealed luxury gift box packing</p>
        </div>
        <div className="border border-border p-4">
          <PackageCheck className="h-5 w-5 mx-auto text-accent mb-2" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">Questions?</h4>
          <Link href="/contact" className="text-xs text-accent underline-offset-4 hover:underline mt-1 block">
            Contact Concierge Support
          </Link>
        </div>
      </div>
    </div>
  );
}
