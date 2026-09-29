import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  tone?: "default" | "success" | "error";
}

interface UiState {
  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  pushToast: (message, tone = "default") =>
    set((state) => ({
      toasts: [...state.toasts, { id: `toast_${Date.now()}_${Math.random()}`, message, tone }],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
