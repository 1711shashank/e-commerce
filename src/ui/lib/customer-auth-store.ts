"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/lib/api";
import {
  redirectToCustomerLogin,
  registerCustomerSessionExpiredHandler,
} from "@/lib/auth-session";
import type { AuthUser } from "@/lib/auth-store";

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
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  isCustomer: () => boolean;
};

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
      },

      register: async (email, password, firstName, lastName) => {
        await apiRequest("/auth/register/", {
          method: "POST",
          body: {
            email,
            password,
            first_name: firstName ?? "",
            last_name: lastName ?? "",
          },
        });
        await get().customerLogin(email, password);
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
