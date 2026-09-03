import { apiRequest } from "@/lib/api";

export type AddressType = "home" | "office" | "other";

export type Address = {
  id: string;
  full_name: string;
  mobile: string;
  address_type: AddressType;
  custom_label: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  display_label: string;
  created_at: string;
  updated_at: string;
};

export type AddressPayload = {
  full_name: string;
  mobile: string;
  address_type: AddressType;
  custom_label?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
};

export async function fetchAddresses(token: string): Promise<Address[]> {
  return apiRequest<Address[]>("/auth/addresses/", { token });
}

export async function createAddress(
  token: string,
  payload: AddressPayload,
): Promise<Address> {
  return apiRequest<Address>("/auth/addresses/", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateAddress(
  token: string,
  id: string,
  payload: Partial<AddressPayload>,
): Promise<Address> {
  return apiRequest<Address>(`/auth/addresses/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteAddress(token: string, id: string): Promise<void> {
  await apiRequest(`/auth/addresses/${id}/`, {
    method: "DELETE",
    token,
  });
}

export async function setDefaultAddress(
  token: string,
  id: string,
): Promise<Address> {
  return apiRequest<Address>(`/auth/addresses/${id}/set-default/`, {
    method: "POST",
    token,
  });
}

export function formatAddressLines(address: Address): string[] {
  const lines = [address.address_line_1];
  if (address.address_line_2.trim()) {
    lines.push(address.address_line_2);
  }
  lines.push(
    `${address.city}, ${address.state} ${address.postal_code}`,
  );
  if (address.country && address.country !== "IN") {
    lines.push(address.country);
  }
  return lines;
}
