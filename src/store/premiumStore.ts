import { create } from "zustand";
import type { PremiumTier, PremiumVehicle } from "@/services/api/types";

interface PremiumBookingDraft {
  vehicle: PremiumVehicle | null;
  tier: PremiumTier | null;
  date: string;
  startTime: string;
  policyRead: boolean;
}

interface PremiumState {
  draft: PremiumBookingDraft;
  setVehicle: (vehicle: PremiumVehicle) => void;
  setTier: (tier: PremiumTier) => void;
  setDateTime: (date: string, startTime: string) => void;
  setPolicyRead: (read: boolean) => void;
  reset: () => void;
}

const EMPTY: PremiumBookingDraft = {
  vehicle: null,
  tier: null,
  date: "Sat 13 Sep",
  startTime: "08:00",
  policyRead: false,
};

export const usePremiumStore = create<PremiumState>((set) => ({
  draft: EMPTY,
  setVehicle: (vehicle) =>
    set((state) => ({ draft: { ...state.draft, vehicle, tier: vehicle.tiers[1] ?? vehicle.tiers[0] } })),
  setTier: (tier) => set((state) => ({ draft: { ...state.draft, tier } })),
  setDateTime: (date, startTime) => set((state) => ({ draft: { ...state.draft, date, startTime } })),
  setPolicyRead: (read) => set((state) => ({ draft: { ...state.draft, policyRead: read } })),
  reset: () => set({ draft: EMPTY }),
}));
