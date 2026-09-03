"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/lib/api";
import {
  redirectToAdminLogin,
  registerSessionExpiredHandler,
} from "@/lib/auth-session";
import { registerTokenSession, refreshAccessToken } from "@/lib/token-refresh";

export type AuthUser = {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
  first_name?: string;
  last_name?: string;
  mobile?: string;
};

type AuthState = {
  access: string | null;
  refresh: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  isStaff: () => boolean;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,

      login: async (email, password) => {
        const data = await apiRequest<LoginResponse>("/auth/login/", {
          method: "POST",
          body: { email, password, audience: "staff" },
        });
        if (data.user.role !== "staff" && data.user.role !== "admin") {
          throw new Error("Only staff or admin accounts can use the catalog portal.");
        }
        set({
          access: data.access,
          refresh: data.refresh,
          user: data.user,
        });
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

      isStaff: () => {
        const role = get().user?.role;
        return role === "staff" || role === "admin";
      },
    }),
    {
      name: "aurelia-auth",
      partialize: (state) => ({
        refresh: state.refresh,
        user: state.user,
      }),
    },
  ),
);

registerSessionExpiredHandler(() => {
  useAuthStore.getState().clearSession();
  redirectToAdminLogin();
});

registerTokenSession("staff", {
  getRefresh: () => useAuthStore.getState().refresh,
  setTokens: (access, refresh) => {
    useAuthStore.setState({ access, refresh });
  },
});

if (typeof window !== "undefined") {
  useAuthStore.persist.onFinishHydration(() => {
    const { access, refresh } = useAuthStore.getState();
    if (!access && refresh) {
      void refreshAccessToken("staff");
    }
  });
}