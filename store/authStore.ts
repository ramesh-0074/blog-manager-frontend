// store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import React from "react";
import { AuthState } from "@/types/Auth.types";

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      setAuth: (user, token) => {
        // Set token in cookies (client-side only)
        if (typeof window !== "undefined") {
          Cookies.set("auth-token", token, COOKIE_OPTIONS);
        }

        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        // Remove token from cookies (client-side only)
        if (typeof window !== "undefined") {
          Cookies.remove("auth-token", { path: "/" });
        }

        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        // Return a mock storage for SSR, real localStorage for client
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),

      // Handle hydration properly
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Set hydrated flag
          state.hydrated = true;

          // Sync with cookies on client-side hydration
          if (typeof window !== "undefined") {
            const cookieToken = Cookies.get("auth-token");

            // If we have a token in cookies, use it
            if (cookieToken) {
              state.token = cookieToken;
              // Only set isAuthenticated if we also have user data
              if (state.user) {
                state.isAuthenticated = true;
              }
            } else if (state.token) {
              // If we have token in localStorage but not in cookies, clear the state
              state.user = null;
              state.token = null;
              state.isAuthenticated = false;
            }
          }
        }
      },
    }
  )
);

// Server-side helper to get token from cookies
export const getServerToken = (cookieHeader?: string): string | null => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies["auth-token"] || null;
};

// Client-side helper to get token from cookies
export const getTokenFromCookies = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get("auth-token") || null;
};

// Hook to handle hydration mismatch
export const useAuthHydration = () => {
  const hydrated = useAuthStore((state) => state.hydrated);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  React.useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  return hydrated;
};
