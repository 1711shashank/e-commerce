import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-store";

export type VerifyEmailResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export type RegisterResponse = {
  detail: string;
  email: string;
};

export async function registerCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register/", {
    method: "POST",
    body: {
      email: input.email.trim(),
      password: input.password,
      first_name: input.firstName ?? "",
      last_name: input.lastName ?? "",
    },
  });
}

export async function verifyEmailOtp(
  email: string,
  otp: string,
): Promise<VerifyEmailResponse> {
  return apiRequest<VerifyEmailResponse>("/auth/verify-email/", {
    method: "POST",
    body: {
      email: email.trim(),
      otp: otp.trim(),
    },
  });
}

export async function resendVerificationOtp(email: string): Promise<void> {
  await apiRequest("/auth/resend-verification-otp/", {
    method: "POST",
    body: { email: email.trim() },
  });
}
