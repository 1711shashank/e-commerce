export const MAX_ADDRESSES = 10;

export function validateMobile(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Mobile number is required.";
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Enter a valid mobile number (10–15 digits).";
  }
  return null;
}

export function validateOptionalMobile(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return validateMobile(trimmed);
}

export type ShippingFields = {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

export function validateShippingFields(
  fields: ShippingFields,
): string | null {
  if (!fields.fullName.trim()) {
    return "Enter the recipient name for shipping.";
  }
  const mobileError = validateMobile(fields.mobile);
  if (mobileError) return mobileError;
  if (!fields.addressLine1.trim()) {
    return "Enter address line 1.";
  }
  if (!fields.city.trim()) {
    return "Enter city.";
  }
  if (!fields.state.trim()) {
    return "Enter state.";
  }
  if (!fields.postalCode.trim()) {
    return "Enter PIN / ZIP code.";
  }
  return null;
}
