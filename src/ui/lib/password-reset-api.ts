import { apiRequest } from "@/lib/api";

type PasswordResetResponse = {
  detail: string;
};

export async function requestPasswordReset(email: string): Promise<string> {
  const data = await apiRequest<PasswordResetResponse>("/auth/password-reset/", {
    method: "POST",
    body: { email: email.trim() },
  });
  return data.detail;
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<string> {
  const data = await apiRequest<PasswordResetResponse>(
    "/auth/password-reset/confirm/",
    {
      method: "POST",
      body: {
        token: token.trim(),
        new_password: newPassword,
      },
    },
  );
  return data.detail;
}
