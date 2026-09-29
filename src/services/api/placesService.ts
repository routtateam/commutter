// Live: saved places (GET /users/me/places), search (GET /places/search), reverse geocode (GET /places/reverse).
import { USE_MOCKS, http, mockDelay } from "./client";
import type { Place } from "./types";

export const HOME_PLACE: Place = {
  id: "place_home",
  label: "Home",
  subtitle: "12 Adeola Odeku St, Victoria Island",
  lat: 6.4281,
  lng: 3.4219,
  kind: "home",
};

export const WORK_PLACE: Place = {
  id: "place_work",
  label: "Work",
  subtitle: "Alliance Place, Saka Tinubu, VI",
  lat: 6.4298,
  lng: 3.4231,
  kind: "work",
};

const RECENTS: Place[] = [
  { id: "r1", label: "Ikeja City Mall", subtitle: "Obafemi Awolowo Way, Ikeja", lat: 6.6018, lng: 3.3515, kind: "recent" },
  { id: "r2", label: "Murtala Muhammed Airport (MMIA)", subtitle: "Ikeja, Lagos", lat: 6.5774, lng: 3.3212, kind: "recent" },
  { id: "r3", label: "Lekki Phase 1 Gate", subtitle: "Admiralty Way, Lekki", lat: 6.4415, lng: 3.4731, kind: "recent" },
];

const SEARCH_INDEX: Place[] = [
  ...RECENTS,
  { id: "s1", label: "Ikeja", subtitle: "Ikeja, Lagos", lat: 6.6018, lng: 3.3421, kind: "search" },
  { id: "s2", label: "Ikoyi Club 1938", subtitle: "Kingsway Rd, Ikoyi", lat: 6.4531, lng: 3.4363, kind: "search" },
  { id: "s3", label: "Balogun Market", subtitle: "Lagos Island", lat: 6.4531, lng: 3.3958, kind: "search" },
];

const mockPlacesService = {
  async getSavedPlaces(): Promise<{ home: Place; work: Place; recents: Place[] }> {
    await mockDelay(300);
    return { home: HOME_PLACE, work: WORK_PLACE, recents: RECENTS };
  },

  async search(query: string): Promise<Place[]> {
    await mockDelay(450);
    if (!query.trim()) return RECENTS;
    return SEARCH_INDEX.filter((p) =>
      p.label.toLowerCase().includes(query.toLowerCase())
    );
  },

  /** Nearest known place to a coordinate, or null when nothing is close. */
  async reverse(lat: number, lng: number): Promise<Place | null> {
    await mockDelay(300);
    const d = (p: Place) => (p.lat - lat) ** 2 + (p.lng - lng) ** 2;
    const best = [...SEARCH_INDEX].sort((a, b) => d(a) - d(b))[0];
    return best && d(best) < 0.0002 ? best : null;
  },
};

// ---- Real backend implementation ----

const realPlacesService: typeof mockPlacesService = {
  async getSavedPlaces() {
    const places = await http<Place[]>("/users/me/places");
    return {
      home: places.find((p) => p.kind === "home") ?? HOME_PLACE,
      work: places.find((p) => p.kind === "work") ?? WORK_PLACE,
      recents: places.filter((p) => p.kind === "recent" || p.kind === "saved"),
    };
  },

  async search(query) {
    const q = query.trim();
    // Empty / one-letter queries show the user's recents (the backend needs >= 2 chars).
    if (q.length < 2) return (await realPlacesService.getSavedPlaces()).recents;
    return http<Place[]>("/places/search", { query: { q, limit: 8 } });
  },

  async reverse(lat, lng) {
    return http<Place | null>("/places/reverse", { query: { lat, lng } });
  },
};

export const placesService = USE_MOCKS ? mockPlacesService : realPlacesService;
