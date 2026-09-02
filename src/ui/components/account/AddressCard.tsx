"use client";

import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Address } from "@/lib/address-api";
import { formatAddressLines } from "@/lib/address-api";

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  busy?: boolean;
};

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy,
}: AddressCardProps) {
  return (
    <article className="border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{address.display_label}</Badge>
          {address.is_default && (
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              Default
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!address.is_default && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => onSetDefault(address)}
            >
              Set default
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onEdit(address)}
            aria-label="Edit address"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onDelete(address)}
            aria-label="Delete address"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-3 text-sm">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <div>
          <p className="font-medium">{address.full_name}</p>
          <p className="text-muted">{address.mobile}</p>
          <div className="mt-2 space-y-0.5 text-muted">
            {formatAddressLines(address).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
