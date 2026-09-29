import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CommuterProfile } from "@/services/api/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  profile: CommuterProfile | null;
  hasOnboarded: boolean;
  pendingPhone: string | null;
  isAuthenticated: () => boolean;
  setPendingPhone: (phone: string) => void;
  completeOnboarding: () => void;
  signIn: (token: string, profile: CommuterProfile) => void;
  setTokens: (token: string, refreshToken: string | null) => void;
  updateProfile: (patch: Partial<CommuterProfile>) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      profile: null,
      hasOnboarded: false,
      pendingPhone: null,
      isAuthenticated: () => Boolean(get().token),
      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      signIn: (token, profile) => set({ token, profile }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      updateProfile: (patch) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...patch } : state.profile,
        })),
      signOut: () => set({ token: null, refreshToken: null, profile: null }),
    }),
    { name: "routta-auth" }
  )
);
