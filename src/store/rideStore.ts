import { create } from "zustand";
import type {
  CategoryQuote,
  Place,
  PromoCode,
  Trip,
  VehicleCategory,
} from "@/services/api/types";
import { HOME_PLACE } from "@/services/api/placesService";

interface BookingDraft {
  pickup: Place;
  destination: Place | null;
  category: VehicleCategory | null;
  categoryQuote: CategoryQuote | null;
  capacityOptionId: string | null;
  paymentMethodId: string;
  promo: PromoCode | null;
}

const EMPTY_DRAFT: BookingDraft = {
  pickup: HOME_PLACE,
  destination: null,
  category: null,
  categoryQuote: null,
  capacityOptionId: null,
  paymentMethodId: "pm_visa",
  promo: null,
};

interface RideState {
  draft: BookingDraft;
  activeTrip: Trip | null;
  lastCompletedTrip: Trip | null;
  setDestination: (place: Place) => void;
  setPickup: (place: Place) => void;
  setCategory: (category: VehicleCategory, quote: CategoryQuote) => void;
  setCapacityOption: (id: string, fare: number) => void;
  setPaymentMethod: (id: string) => void;
  setPromo: (promo: PromoCode | null) => void;
  resetDraft: () => void;
  setActiveTrip: (trip: Trip | null) => void;
  setLastCompletedTrip: (trip: Trip | null) => void;
}

export const useRideStore = create<RideState>((set) => ({
  draft: EMPTY_DRAFT,
  activeTrip: null,
  lastCompletedTrip: null,
  setDestination: (place) =>
    set((state) => ({ draft: { ...state.draft, destination: place } })),
  setPickup: (place) => set((state) => ({ draft: { ...state.draft, pickup: place } })),
  setCategory: (category, quote) =>
    set((state) => ({
      draft: { ...state.draft, category, categoryQuote: quote, capacityOptionId: null },
    })),
  setCapacityOption: (id, fare) =>
    set((state) => ({
      draft: {
        ...state.draft,
        capacityOptionId: id,
        categoryQuote: state.draft.categoryQuote
          ? { ...state.draft.categoryQuote, fare }
          : state.draft.categoryQuote,
      },
    })),
  setPaymentMethod: (id) => set((state) => ({ draft: { ...state.draft, paymentMethodId: id } })),
  setPromo: (promo) => set((state) => ({ draft: { ...state.draft, promo } })),
  resetDraft: () => set({ draft: EMPTY_DRAFT }),
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  setLastCompletedTrip: (trip) => set({ lastCompletedTrip: trip }),
}));
