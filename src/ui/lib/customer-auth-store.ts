"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/lib/api";
import {
  redirectToCustomerLogin,
  registerCustomerSessionExpiredHandler,
} from "@/lib/auth-session";
import type { AuthUser } from "@/lib/auth-store";
import {
  registerCustomer,
  resendVerificationOtp,
  verifyEmailOtp,
  type VerifyEmailResponse,
} from "@/lib/email-verification-api";
import { registerTokenSession } from "@/lib/token-refresh";

type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

type CustomerAuthState = {
  access: string | null;
  refresh: string | null;
  user: AuthUser | null;
  customerLogin: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<string>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerificationOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  isCustomer: () => boolean;
  setUser: (user: AuthUser) => void;
};

function applyAuthSession(
  set: (partial: Partial<CustomerAuthState>) => void,
  data: VerifyEmailResponse | LoginResponse,
) {
  if (data.user.role !== "customer") {
    throw new Error(
      "This account is for staff access. Use the admin portal to sign in.",
    );
  }
  set({
    access: data.access,
    refresh: data.refresh,
    user: data.user,
  });
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,

      customerLogin: async (email, password) => {
        const data = await apiRequest<LoginResponse>("/auth/login/", {
          method: "POST",
          body: { email, password },
        });
        applyAuthSession(set, data);
      },

      register: async (email, password, firstName, lastName) => {
        const data = await registerCustomer({
          email,
          password,
          firstName,
          lastName,
        });
        return data.email;
      },

      verifyEmail: async (email, otp) => {
        const data = await verifyEmailOtp(email, otp);
        applyAuthSession(set, data);
      },

      resendVerificationOtp: async (email) => {
        await resendVerificationOtp(email);
      },

      logout: async () => {
        const { access, refresh } = get();
        try {
          if (access && refresh) {
            await apiRequest("/auth/logout/", {
              method: "POST",
              token: access,
              body: { refresh },
              skipSessionExpiry: true,
            });
          }
        } catch {
          // clear local session even if logout API fails
        }
        set({ access: null, refresh: null, user: null });
      },

      clearSession: () => {
        set({ access: null, refresh: null, user: null });
      },

      isCustomer: () => {
        const user = get().user;
        return user?.role === "customer" && Boolean(get().access);
      },

      setUser: (user: AuthUser) => {
        set({ user });
      },
    }),
    {
      name: "aurelia-customer-auth",
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
      }),
    },
  ),
);

registerCustomerSessionExpiredHandler(() => {
  useCustomerAuthStore.getState().clearSession();
  redirectToCustomerLogin();
});

registerTokenSession("customer", {
  getRefresh: () => useCustomerAuthStore.getState().refresh,
  setTokens: (access, refresh) => {
    useCustomerAuthStore.setState({ access, refresh });
  },
});
