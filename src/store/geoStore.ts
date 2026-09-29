// Device geolocation via @capacitor/geolocation, with a Lagos fallback when
// permission is denied/unavailable (web preview without HTTPS, simulator
// without a fix, user said no, etc). Not persisted — re-requested each launch.
import { create } from "zustand";
import { Geolocation } from "@capacitor/geolocation";

export interface LatLngPoint {
  lat: number;
  lng: number;
}

/** Victoria Island, Lagos — used whenever we have no real device fix. */
export const LAGOS_DEFAULT_CENTER: LatLngPoint = { lat: 6.5244, lng: 3.3792 };

export type GeoPermission = "unknown" | "granted" | "denied" | "prompt";

interface GeoState {
  coords: LatLngPoint | null;
  permission: GeoPermission;
  loading: boolean;
  error: string | null;
  /** Checks current permission state without prompting. */
  checkPermission: () => Promise<GeoPermission>;
  /** Prompts (if needed) and fetches a fix. Resolves with coords, or null if denied/unavailable. */
  requestLocation: () => Promise<LatLngPoint | null>;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  coords: null,
  permission: "unknown",
  loading: false,
  error: null,

  async checkPermission() {
    try {
      const status = await Geolocation.checkPermissions();
      const permission = status.location as GeoPermission;
      set({ permission });
      return permission;
    } catch {
      // Not available (e.g. plain web without the plugin's browser shim) —
      // treat as "prompt" so requestLocation still tries the browser API.
      set({ permission: "prompt" });
      return "prompt";
    }
  },

  async requestLocation() {
    set({ loading: true, error: null });
    try {
      let permission = get().permission;
      if (permission === "unknown") permission = await get().checkPermission();

      if (permission !== "granted") {
        const req = await Geolocation.requestPermissions();
        permission = req.location as GeoPermission;
        set({ permission });
      }

      if (permission !== "granted") {
        set({ loading: false });
        return null;
      }

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10_000,
      });
      const coords: LatLngPoint = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      set({ coords, loading: false });
      return coords;
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Could not get your location" });
      return null;
    }
  },
}));
