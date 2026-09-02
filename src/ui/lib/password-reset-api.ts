import { apiRequest } from "@/lib/api";

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest("/auth/password-reset/", {
    method: "POST",
    body: { email: email.trim() },
  });
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<void> {
  await apiRequest("/auth/password-reset/confirm/", {
    method: "POST",
    body: {
      token: token.trim(),
      new_password: newPassword,
    },
  });
}
