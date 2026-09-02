"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/account/form-styles";
import { FormLabel, FormLegend } from "@/components/account/FormLabel";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Address, AddressPayload, AddressType } from "@/lib/address-api";
import { validateMobile } from "@/lib/validation";

const ADDRESS_TYPES: { value: AddressType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

type AddressFormProps = {
  initial?: Address | null;
  onSubmit: (payload: AddressPayload) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isFirstAddress?: boolean;
  lockDefault?: boolean;
};

const emptyForm = (isFirstAddress: boolean): AddressPayload => ({
  full_name: "",
  mobile: "",
  address_type: "home",
  custom_label: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "IN",
  is_default: isFirstAddress,
});

export function AddressForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save address",
  isFirstAddress = false,
  lockDefault = false,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressPayload>(() =>
    initial
      ? {
          full_name: initial.full_name,
          mobile: initial.mobile,
          address_type: initial.address_type,
          custom_label: initial.custom_label,
          address_line_1: initial.address_line_1,
          address_line_2: initial.address_line_2,
          city: initial.city,
          state: initial.state,
          postal_code: initial.postal_code,
          country: initial.country,
          is_default: initial.is_default,
        }
      : emptyForm(isFirstAddress),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof AddressPayload>(
    key: K,
    value: AddressPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const mobileError = validateMobile(form.mobile);
    if (mobileError) {
      setError(mobileError);
      return;
    }

    if (form.address_type === "other" && (form.custom_label?.trim().length ?? 0) < 2) {
      setError("Enter a label for this address type.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        full_name: form.full_name.trim(),
        mobile: form.mobile.trim(),
        custom_label: form.custom_label?.trim() ?? "",
        address_line_1: form.address_line_1.trim(),
        address_line_2: form.address_line_2?.trim() ?? "",
        city: form.city.trim(),
        state: form.state.trim(),
        postal_code: form.postal_code.trim(),
        is_default: lockDefault || isFirstAddress ? true : (form.is_default ?? false),
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? getApiErrorMessage(err, "mobile") ||
              getApiErrorMessage(err, "custom_label") ||
              getApiErrorMessage(err)
          : "Could not save address.",
      );
    } finally {
      setLoading(false);
    }
  };

  const defaultLocked = lockDefault || isFirstAddress;

  return (
    <form className="space-y-4 border border-border bg-surface p-5 sm:p-6" onSubmit={handleSubmit}>
      <h3 className="font-display text-xl">
        {initial ? "Edit address" : "Add new address"}
      </h3>

      <div>
        <FormLabel htmlFor="addr-full-name" required>
          Full name
        </FormLabel>
        <input
          id="addr-full-name"
          type="text"
          required
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <FormLabel htmlFor="addr-mobile" required>
          Mobile number
        </FormLabel>
        <input
          id="addr-mobile"
          type="tel"
          required
          value={form.mobile}
          onChange={(e) => update("mobile", e.target.value)}
          className={inputClassName}
        />
      </div>

      <fieldset>
        <FormLegend required>Address type</FormLegend>
        <div className="flex flex-wrap gap-4">
          {ADDRESS_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`address_type-${initial?.id ?? "new"}`}
                value={type.value}
                checked={form.address_type === type.value}
                onChange={() => {
                  update("address_type", type.value);
                  if (type.value !== "other") {
                    update("custom_label", "");
                  }
                }}
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      {form.address_type === "other" && (
        <div>
          <FormLabel htmlFor="addr-custom-label" required>
            Custom label
          </FormLabel>
          <input
            id="addr-custom-label"
            type="text"
            required
            placeholder="e.g. Parents' home"
            value={form.custom_label}
            onChange={(e) => update("custom_label", e.target.value)}
            className={inputClassName}
          />
        </div>
      )}

      <div>
        <FormLabel htmlFor="addr-line-1" required>
          Address line 1
        </FormLabel>
        <input
          id="addr-line-1"
          type="text"
          required
          value={form.address_line_1}
          onChange={(e) => update("address_line_1", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <FormLabel htmlFor="addr-line-2">Address line 2</FormLabel>
        <input
          id="addr-line-2"
          type="text"
          value={form.address_line_2}
          onChange={(e) => update("address_line_2", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FormLabel htmlFor="addr-city" required>
            City
          </FormLabel>
          <input
            id="addr-city"
            type="text"
            required
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <FormLabel htmlFor="addr-state" required>
            State
          </FormLabel>
          <input
            id="addr-state"
            type="text"
            required
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <FormLabel htmlFor="addr-postal" required>
            PIN / ZIP
          </FormLabel>
          <input
            id="addr-postal"
            type="text"
            required
            value={form.postal_code}
            onChange={(e) => update("postal_code", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={defaultLocked ? true : (form.is_default ?? false)}
            disabled={defaultLocked}
            onChange={(e) => update("is_default", e.target.checked)}
          />
          Set as default address
        </label>
        {defaultLocked && (
          <p className="mt-1 text-xs text-muted">
            Your first address is automatically set as default.
          </p>
        )}
      </div>

      {error && (
        <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
