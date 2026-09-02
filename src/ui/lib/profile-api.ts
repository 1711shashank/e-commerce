import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-store";

export type ProfileUpdatePayload = {
  first_name?: string;
  last_name?: string;
  mobile?: string;
};

export async function fetchProfile(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me/", { token });
}

export async function updateProfile(
  token: string,
  payload: ProfileUpdatePayload,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me/", {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await apiRequest("/auth/me/password/", {
    method: "POST",
    token,
    body: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  });
}
