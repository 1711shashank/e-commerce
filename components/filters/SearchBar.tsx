"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative flex min-h-11 flex-1 items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full border border-border bg-surface pl-10 pr-3 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label="Search products"
      />
    </label>
  );
}
