// Live: trip history + trip detail (GET /trips/history, /trips/:id).
// Live: scheduled rides (GET/POST /trips/scheduled, POST /trips/scheduled/:id/cancel); cancelFee comes from the trip DTO.
// BACKEND-GAP: the backend stores scheduled rides but has no dispatcher yet, so due rides are not auto-requested.
import { ApiError, USE_MOCKS, fromKobo, http, mockDelay, toKobo } from "./client";
import { mapHistoryTrip, type BackendTrip } from "./tripMapper";
import type { HistoryTrip, Place, ScheduledRide, VehicleCategory } from "./types";

export type ScheduleRideInput = Omit<ScheduledRide, "id"> & {
  /** ISO-8601 instant for the pickup (required by the live backend; the mock ignores it). */
  scheduledFor?: string;
  promoCode?: string;
};

const HISTORY: HistoryTrip[] = [
  {
    id: "RT-4471",
    status: "completed",
    category: "car",
    categoryLabel: "Car",
    pickup: { id: "p1", label: "12 Adeola Odeku St, VI", subtitle: "Pickup", lat: 6.4281, lng: 3.4219, kind: "home" },
    destination: { id: "d1", label: "Ikeja City Mall", subtitle: "Obafemi Awolowo Way, Ikeja", lat: 6.6018, lng: 3.3515, kind: "recent" },
    distanceKm: 18.4,
    etaMinutes: 47,
    fare: 2450,
    promoDiscount: 500,
    paymentMethodLabel: "Card •••• 4821",
    transporter: { id: "tr_chinedu", name: "Chinedu Okafor", rating: 4.9, trips: 1204, vehiclePlate: "LSD 419 KJA", vehicleModel: "Silver Corolla", phone: "" },
    pin: "4417",
    createdAt: "2026-09-08T10:24:00Z",
    completedAt: "2026-09-08T11:11:00Z",
    rating: 5,
  },
  {
    id: "RT-4408",
    status: "completed",
    category: "bus",
    categoryLabel: "Bus",
    pickup: { id: "p2", label: "12 Adeola Odeku St, VI", subtitle: "Pickup", lat: 6.4281, lng: 3.4219, kind: "home" },
    destination: { id: "d2", label: "Ikoyi Club 1938", subtitle: "Kingsway Rd, Ikoyi", lat: 6.4531, lng: 3.4363, kind: "recent" },
    distanceKm: 6.1,
    etaMinutes: 22,
    fare: 11400,
    paymentMethodLabel: "Card •••• 4821",
    transporter: { id: "tr_bola", name: "Bola Salami", rating: 4.7, trips: 640, vehiclePlate: "KJA 220 XZ", vehicleModel: "16-seater minibus", phone: "" },
    pin: "2201",
    createdAt: "2026-09-05T18:52:00Z",
    completedAt: "2026-09-05T19:14:00Z",
  },
  {
    id: "RT-4390",
    status: "cancelled",
    category: "bike",
    categoryLabel: "Bike",
    pickup: { id: "p3", label: "12 Adeola Odeku St, VI", subtitle: "Pickup", lat: 6.4281, lng: 3.4219, kind: "home" },
    destination: { id: "d3", label: "Balogun Market", subtitle: "Lagos Island", lat: 6.4531, lng: 3.3958, kind: "recent" },
    distanceKm: 0,
    etaMinutes: 0,
    fare: 300,
    paymentMethodLabel: "Card •••• 4821",
    pin: "0000",
    createdAt: "2026-09-02T07:41:00Z",
    cancelled: true,
    cancelFee: 300,
  },
  {
    id: "RT-4210",
    status: "completed",
    category: "van",
    categoryLabel: "Van",
    pickup: { id: "p4", label: "12 Adeola Odeku St, VI", subtitle: "Pickup", lat: 6.4281, lng: 3.4219, kind: "home" },
    destination: { id: "d4", label: "Lekki Phase 1 Gate", subtitle: "Admiralty Way, Lekki", lat: 6.4415, lng: 3.4731, kind: "recent" },
    distanceKm: 24.2,
    etaMinutes: 51,
    fare: 19800,
    paymentMethodLabel: "Card •••• 4821",
    transporter: { id: "tr_musa", name: "Musa Danjuma", rating: 4.8, trips: 388, vehiclePlate: "APP 118 LG", vehicleModel: "3–5 ton truck", phone: "" },
    pin: "8834",
    createdAt: "2026-08-21T14:08:00Z",
    completedAt: "2026-08-21T14:59:00Z",
  },
];

const SCHEDULED: ScheduledRide[] = [
  {
    id: "sch_1",
    pickup: { id: "p1", label: "12 Adeola Odeku St, VI", subtitle: "Pickup", lat: 6.4281, lng: 3.4219, kind: "home" },
    destination: { id: "d5", label: "Alliance Place, Saka Tinubu, VI", subtitle: "Work", lat: 6.4298, lng: 3.4231, kind: "work" },
    category: "car",
    date: "Tomorrow",
    time: "07:30",
    fare: 2450,
    repeats: true,
  },
];

const mockHistoryService = {
  async getHistory(): Promise<HistoryTrip[]> {
    await mockDelay(450);
    return HISTORY;
  },

  async getTrip(id: string): Promise<HistoryTrip | undefined> {
    await mockDelay(300);
    return HISTORY.find((t) => t.id === id);
  },

  async getScheduled(): Promise<ScheduledRide[]> {
    await mockDelay(350);
    return SCHEDULED;
  },

  async scheduleRide(input: ScheduleRideInput): Promise<ScheduledRide> {
    await mockDelay(500);
    const { scheduledFor: _s, promoCode: _p, ...rest } = input;
    const ride = { ...rest, id: `sch_${Date.now()}` };
    SCHEDULED.push(ride);
    return ride;
  },

  async cancelScheduled(id: string): Promise<void> {
    await mockDelay(300);
    const i = SCHEDULED.findIndex((r) => r.id === id);
    if (i >= 0) SCHEDULED.splice(i, 1);
  },
};

// ---- Scheduled ride mapping (backend -> UI) ----

interface BackendScheduled {
  id: string;
  pickup: { label: string; lat: number; lng: number };
  destination: { label: string; lat: number; lng: number };
  category: VehicleCategory;
  scheduledFor: string;
  fare: number | null; // kobo
  note: string | null;
}

const REPEAT_NOTE = "Repeat every weekday";
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toPlace = (p: BackendScheduled["pickup"], id: string): Place => ({
  id,
  label: p.label,
  subtitle: "",
  lat: p.lat,
  lng: p.lng,
  kind: "search",
});

function mapScheduled(r: BackendScheduled): ScheduledRide {
  const d = new Date(r.scheduledFor);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(d) - startOfDay(new Date())) / 86_400_000);
  const date =
    dayDiff === 0 ? "Today" : dayDiff === 1 ? "Tomorrow" : `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    id: r.id,
    pickup: toPlace(r.pickup, `${r.id}_pickup`),
    destination: toPlace(r.destination, `${r.id}_dest`),
    category: r.category,
    date,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    fare: fromKobo(r.fare),
    // The backend has no recurrence field; the UI's "repeat" flag round-trips through `note`.
    repeats: r.note === REPEAT_NOTE,
  };
}

// ---- Real backend implementation ----

const realHistoryService: typeof mockHistoryService = {
  async getHistory() {
    const res = await http<{ items: BackendTrip[] }>("/trips/history", { query: { page: 1, pageSize: 50 } });
    return res.items.map(mapHistoryTrip);
  },

  async getTrip(id) {
    try {
      return mapHistoryTrip(await http<BackendTrip>(`/trips/${encodeURIComponent(id)}`));
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 403)) return undefined;
      throw e;
    }
  },

  async getScheduled() {
    return (await http<BackendScheduled[]>("/trips/scheduled")).map(mapScheduled);
  },

  async scheduleRide(input) {
    if (!input.scheduledFor) throw new ApiError("Pick a date and time for your ride.", 422, "VALIDATION_ERROR");
    const row = await http<BackendScheduled>("/trips/scheduled", {
      method: "POST",
      body: {
        pickup: { label: input.pickup.label, lat: input.pickup.lat, lng: input.pickup.lng },
        destination: { label: input.destination.label, lat: input.destination.lat, lng: input.destination.lng },
        category: input.category,
        scheduledFor: input.scheduledFor,
        fare: input.fare > 0 ? toKobo(input.fare) : undefined,
        promoCode: input.promoCode,
        note: input.repeats ? REPEAT_NOTE : undefined,
      },
    });
    return mapScheduled(row);
  },

  async cancelScheduled(id) {
    await http<unknown>(`/trips/scheduled/${encodeURIComponent(id)}/cancel`, { method: "POST", body: {} });
  },
};

export const historyService = USE_MOCKS ? mockHistoryService : realHistoryService;
