// Live: quotes, capacity options, request/poll/cancel/complete, rate, tip.
// BACKEND-GAP: no live tracking / push; matching is polling GET /trips/:id.
import { USE_MOCKS, fromKobo, http, mockDelay, toKobo } from "./client";
import type {
  CapacityOption,
  CategoryQuote,
  Place,
  Transporter,
  Trip,
  VehicleCategory,
} from "./types";
import { mapTrip, rememberTripContext, type BackendTrip } from "./tripMapper";

const CATEGORY_QUOTES: CategoryQuote[] = [
  { category: "bike", abbr: "BIKE", name: "Bike", description: "1 seat · fastest through traffic", etaMinutes: 2, fare: 1150, rate: "₦180/km" },
  { category: "car", abbr: "CAR", name: "Car", description: "4 seats · everyday rides", etaMinutes: 4, fare: 2450, rate: "₦210/km" },
  { category: "bus", abbr: "BUS", name: "Bus", description: "16–30 seats · group travel", etaMinutes: 9, fare: 8900, rate: "from ₦8,900" },
  { category: "van", abbr: "VAN", name: "Van", description: "1–5 tons · cargo & moving", etaMinutes: 12, fare: 14200, rate: "from ₦14,200" },
];

const BUS_SEATING: CapacityOption[] = [
  { id: "bus_16", label: "16-seater minibus", description: "Best for small groups", fare: 8900 },
  { id: "bus_22", label: "22-seater coaster", description: "Mid-size group travel", fare: 11400 },
  { id: "bus_30", label: "30-seater coach", description: "Large group / events", fare: 15800 },
];

const VAN_TONNAGE: CapacityOption[] = [
  { id: "van_1", label: "1 ton", description: "Small loads, few items", fare: 14200 },
  { id: "van_3", label: "3 tons", description: "Household moving", fare: 19800 },
  { id: "van_5", label: "5 tons", description: "Large / commercial loads", fare: 26500 },
];

const TRANSPORTER: Transporter = {
  id: "tr_chinedu",
  name: "Chinedu Okafor",
  rating: 4.9,
  trips: 1204,
  vehiclePlate: "LSD 419 KJA",
  vehicleModel: "Silver Toyota Corolla",
  phone: "+234 802 555 0148",
};

const mockRideService = {
  async getCategoryQuotes(_pickup: Place, _destination: Place): Promise<CategoryQuote[]> {
    await mockDelay(500);
    return CATEGORY_QUOTES;
  },

  async getCapacityOptions(category: VehicleCategory): Promise<CapacityOption[]> {
    await mockDelay(350);
    if (category === "bus") return BUS_SEATING;
    if (category === "van") return VAN_TONNAGE;
    return [];
  },

  async requestTrip(input: {
    pickup: Place;
    destination: Place;
    category: VehicleCategory;
    categoryLabel: string;
    fare: number;
    distanceKm: number;
    paymentMethodLabel: string;
    /** Pre-discount quoted fare; the live backend applies `promoCode` itself. Defaults to `fare`. */
    grossFare?: number;
    promoDiscount?: number;
    promoCode?: string;
  }): Promise<Trip> {
    await mockDelay(300);
    return {
      id: `trip_${Date.now()}`,
      status: "matching",
      pin: String(Math.floor(1000 + Math.random() * 9000)),
      createdAt: new Date().toISOString(),
      etaMinutes: 3,
      ...input,
    };
    // (grossFare / promoCode are request-only fields; harmless extras on the mock trip.)
  },

  /** Simulates the match resolving after a short delay (always succeeds in the mock). */
  async pollMatch(trip: Trip): Promise<Trip> {
    await mockDelay(1400);
    return { ...trip, status: "accepted", transporter: TRANSPORTER };
  },

  async cancelTrip(trip: Trip, reason?: string): Promise<Trip> {
    await mockDelay(300);
    // Mirrors the backend: a fee applies once a Transporter has accepted.
    return { ...trip, status: "cancelled", cancelReason: reason, cancelFee: trip.status === "accepted" ? 300 : undefined };
  },

  async arrive(trip: Trip): Promise<Trip> {
    await mockDelay(300);
    return { ...trip, status: "completed", completedAt: new Date().toISOString() };
  },

  async rateTrip(trip: Trip, rating: number, _tags: string[], _note: string): Promise<Trip> {
    await mockDelay(400);
    return { ...trip, rating };
  },

  async sendTip(_trip: Trip, _amount: number): Promise<{ sent: boolean }> {
    await mockDelay(400);
    return { sent: true };
  },
};

// ---- Real backend implementation ----

const CATEGORY_META: Record<VehicleCategory, { abbr: string; name: string; description: string; rate: string }> = {
  bike: { abbr: "BIKE", name: "Bike", description: "1 seat · fastest through traffic", rate: "₦180/km" },
  car: { abbr: "CAR", name: "Car", description: "4 seats · everyday rides", rate: "₦210/km" },
  bus: { abbr: "BUS", name: "Bus", description: "16–30 seats · group travel", rate: "from ₦8,900" },
  van: { abbr: "VAN", name: "Van", description: "1–5 tons · cargo & moving", rate: "from ₦14,200" },
};

const toBackendPlace = (p: Place) => ({ label: p.label, lat: p.lat, lng: p.lng });

/** Route distance from the latest quote; the summary screen does not carry it. */
let lastQuotedDistanceKm: number | null = null;
const cancelledTrips = new Set<string>();

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 60_000;

const realRideService: typeof mockRideService = {
  async getCategoryQuotes(pickup, destination) {
    const rows = await http<
      { category: VehicleCategory; distanceKm: number; etaMinutes: number; fare: number }[]
    >("/trips/quotes", {
      method: "POST",
      body: { pickup: toBackendPlace(pickup), destination: toBackendPlace(destination) },
    });
    if (rows[0]) lastQuotedDistanceKm = Math.round(rows[0].distanceKm * 10) / 10;
    return rows.map((r) => ({
      category: r.category,
      ...CATEGORY_META[r.category],
      etaMinutes: r.etaMinutes,
      fare: fromKobo(r.fare),
    }));
  },

  async getCapacityOptions(category) {
    if (category !== "bus" && category !== "van") return [];
    const rows = await http<CapacityOption[]>("/trips/capacity-options", { query: { category } });
    return rows.map((r) => ({ ...r, fare: fromKobo(r.fare) }));
  },

  async requestTrip(input) {
    const distanceKm = lastQuotedDistanceKm ?? input.distanceKm;
    // With a promoCode the backend expects the PRE-discount fare, validates the code itself and stores the
    // discounted fare; the returned trip carries `promoDiscount`.
    const row = await http<BackendTrip>("/trips", {
      method: "POST",
      body: {
        pickup: toBackendPlace(input.pickup),
        destination: toBackendPlace(input.destination),
        category: input.category,
        fare: toKobo(input.promoCode ? (input.grossFare ?? input.fare) : input.fare),
        distanceKm,
        promoCode: input.promoCode || undefined,
      },
    });
    rememberTripContext(row.id, {
      pickup: input.pickup,
      destination: input.destination,
      paymentMethodLabel: input.paymentMethodLabel,
    });
    return mapTrip(row);
  },

  /** Polls GET /trips/:id until a driver is assigned; resolves `no_match` on timeout. */
  async pollMatch(trip) {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (cancelledTrips.has(trip.id)) return { ...trip, status: "cancelled" };
      const row = await http<BackendTrip>(`/trips/${trip.id}`);
      const mapped = mapTrip(row);
      if (mapped.status !== "matching") return mapped;
      await mockDelay(POLL_INTERVAL_MS);
    }
    return { ...trip, status: "no_match" };
  },

  async cancelTrip(trip, reason) {
    cancelledTrips.add(trip.id);
    // Response carries `cancelFee` (kobo) which mapTrip exposes as `cancelFee` (naira).
    const row = await http<BackendTrip>(`/trips/${trip.id}/cancel`, {
      method: "POST",
      body: reason ? { reason } : {},
    });
    return mapTrip(row);
  },

  // The commuter app has no "arrived" endpoint; the trip is completed via POST /trips/:id/complete.
  async arrive(trip) {
    const row = await http<BackendTrip>(`/trips/${trip.id}/complete`, { method: "POST" });
    return mapTrip(row);
  },

  async rateTrip(trip, rating, tags, note) {
    const row = await http<BackendTrip>(`/trips/${trip.id}/rate`, {
      method: "POST",
      body: { rating, tags, note: note || undefined },
    });
    return { ...mapTrip(row), rating };
  },

  async sendTip(trip, amount) {
    return http<{ sent: boolean }>(`/trips/${trip.id}/tip`, { method: "POST", body: { amount: toKobo(amount) } });
  },
};

export const rideService = USE_MOCKS ? mockRideService : realRideService;
