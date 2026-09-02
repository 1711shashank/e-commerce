"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { inputClassName } from "@/components/account/form-styles";
import type { Address } from "@/lib/address-api";
import { fetchAddresses, formatAddressLines } from "@/lib/address-api";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { cn } from "@/lib/utils";
import type { ShippingFields } from "@/lib/validation";

export type { ShippingFields } from "@/lib/validation";
export { validateShippingFields } from "@/lib/validation";

type CheckoutShippingProps = {
  value: ShippingFields;
  onChange: (value: ShippingFields) => void;
};

const emptyShipping = (
  user?: { first_name?: string; last_name?: string; mobile?: string } | null,
): ShippingFields => ({
  fullName: [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim(),
  mobile: user?.mobile ?? "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
});

function addressToShipping(address: Address): ShippingFields {
  return {
    fullName: address.full_name,
    mobile: address.mobile,
    addressLine1: address.address_line_1,
    addressLine2: address.address_line_2,
    city: address.city,
    state: address.state,
    postalCode: address.postal_code,
  };
}

export function CheckoutShipping({ value, onChange }: CheckoutShippingProps) {
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedId, setSelectedId] = useState<number | "manual" | null>(null);
  const initializedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!access) {
      return;
    }

    if (initializedFor.current === access) {
      return;
    }

    let cancelled = false;

    fetchAddresses(access)
      .then((data) => {
        if (cancelled) return;
        setAddresses(data);
        const defaultAddress = data.find((a) => a.is_default) ?? data[0];
        if (defaultAddress) {
          setSelectedId(defaultAddress.id);
          onChangeRef.current(addressToShipping(defaultAddress));
        } else {
          setSelectedId("manual");
          onChangeRef.current(emptyShipping(user));
        }
        initializedFor.current = access;
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setSelectedId("manual");
        onChangeRef.current(emptyShipping(user));
        initializedFor.current = access;
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [access, user]);

  const selectAddress = (address: Address) => {
    setSelectedId(address.id);
    onChange(addressToShipping(address));
  };

  const selectManual = () => {
    setSelectedId("manual");
    onChange(emptyShipping(user));
  };

  const update = (key: keyof ShippingFields, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  if (!loaded) {
    return <p className="text-sm text-muted">Loading saved addresses…</p>;
  }

  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-2xl">Shipping</legend>

      {loadError && (
        <p className="text-sm text-muted">
          Could not load saved addresses. Enter shipping details below.
        </p>
      )}

      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={cn(
                "flex cursor-pointer gap-3 border p-4 text-sm transition-colors",
                selectedId === address.id
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50",
              )}
            >
              <input
                type="radio"
                name="shipping-address"
                className="mt-1"
                checked={selectedId === address.id}
                onChange={() => selectAddress(address)}
              />
              <span>
                <span className="font-medium">
                  {address.display_label}
                  {address.is_default && (
                    <span className="ml-2 text-xs uppercase tracking-[0.1em] text-accent">
                      Default
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-muted">
                  {address.full_name} · {address.mobile}
                </span>
                <span className="mt-1 block text-muted">
                  {formatAddressLines(address).join(", ")}
                </span>
              </span>
            </label>
          ))}

          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 border p-4 text-sm transition-colors",
              selectedId === "manual"
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50",
            )}
          >
            <input
              type="radio"
              name="shipping-address"
              checked={selectedId === "manual"}
              onChange={selectManual}
            />
            Enter a different address
          </label>

          <p className="text-xs text-muted">
            <Link href="/account/addresses" className="underline-offset-4 hover:underline">
              Saved addresses
            </Link>
          </p>
        </div>
      )}

      {(selectedId === "manual" || addresses.length === 0) && (
        <div className="space-y-4">
          <input
            required
            placeholder="Full name"
            value={value.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputClassName}
          />
          <input
            required
            type="tel"
            placeholder="Mobile number"
            value={value.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            className={inputClassName}
          />
          <input
            required
            placeholder="Address line 1"
            value={value.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
            className={inputClassName}
          />
          <input
            placeholder="Address line 2"
            value={value.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
            className={inputClassName}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              required
              placeholder="City"
              value={value.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClassName}
            />
            <input
              required
              placeholder="State"
              value={value.state}
              onChange={(e) => update("state", e.target.value)}
              className={inputClassName}
            />
            <input
              required
              placeholder="PIN / ZIP"
              value={value.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
