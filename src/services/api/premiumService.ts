// Live: vehicle marketplace, business profile, booking create/active/history.
// BACKEND-GAP: the new booking timeline / inspection / deposit-refund / availability endpoints exist only for business
// partners (/premium-business, user type "business"); none are exposed to commuters, so those UI panels stay static/mocked.
// BACKEND-GAP: no commuter cancellation endpoint; booking status may now be requested|declined|expired (accept-required
// partners) but the UI type only knows confirmed|active|completed, so those map to "confirmed" for now.
// BACKEND-GAP: booking has no pilot assignment; pilot panel remains static.
import { ApiError, USE_MOCKS, fromKobo, http, mockDelay } from "./client";
import type { PremiumBooking, PremiumBusiness, PremiumTier, PremiumVehicle } from "./types";

const BUSINESSES: Record<string, PremiumBusiness> = {
  biz_kayode: {
    id: "biz_kayode",
    name: "Kayode Motors",
    initials: "KM",
    location: "Ring Road, Ibadan",
    verifiedSince: "2021",
    rating: 4.9,
    vehicleCount: 14,
    rentalCount: 312,
    about:
      "Family-run luxury fleet operating across Ibadan and Lagos since 2021. We supply vetted pilots with every vehicle and specialise in weddings and corporate events.",
  },
  biz_lagosluxe: {
    id: "biz_lagosluxe",
    name: "Lagos Luxe Fleet",
    initials: "LL",
    location: "Victoria Island, Lagos",
    verifiedSince: "2022",
    rating: 4.8,
    vehicleCount: 9,
    rentalCount: 201,
    about:
      "Premium executive fleet for business travel, airport transfers and events across Lagos.",
  },
};

const VEHICLES: PremiumVehicle[] = [
  {
    id: "pv_gle450",
    name: "Mercedes-Benz GLE 450",
    type: "SUV",
    brand: "Mercedes-Benz",
    businessId: "biz_kayode",
    businessName: "Kayode Motors",
    location: "Ibadan",
    rating: 4.9,
    reviews: 86,
    fromPrice: 145000,
    seats: "5 seats",
    availability: "available",
    specs: [
      { key: "Seats", value: "5" },
      { key: "Transmission", value: "Automatic" },
      { key: "Fuel", value: "Petrol" },
      { key: "Year", value: "2023" },
      { key: "Colour", value: "Obsidian black" },
      { key: "Pilot", value: "Included" },
    ],
    tiers: [
      { id: "t_4h", label: "4 hours", sub: "City engagements", price: 100000 },
      { id: "t_6h", label: "6 hours", sub: "Half day, most popular", price: 145000 },
      { id: "t_12h", label: "12 hours", sub: "Full day event", price: 240000 },
    ],
  },
  {
    id: "pv_rrsport",
    name: "Range Rover Sport",
    type: "SUV",
    brand: "Land Rover",
    businessId: "biz_lagosluxe",
    businessName: "Lagos Luxe Fleet",
    location: "Victoria Island",
    rating: 4.8,
    reviews: 54,
    fromPrice: 165000,
    seats: "5 seats",
    availability: "limited",
    specs: [
      { key: "Seats", value: "5" },
      { key: "Transmission", value: "Automatic" },
      { key: "Fuel", value: "Petrol" },
      { key: "Year", value: "2022" },
      { key: "Colour", value: "Santorini black" },
      { key: "Pilot", value: "Included" },
    ],
    tiers: [
      { id: "t_4h", label: "4 hours", sub: "City engagements", price: 110000 },
      { id: "t_6h", label: "6 hours", sub: "Half day, most popular", price: 165000 },
      { id: "t_12h", label: "12 hours", sub: "Full day event", price: 275000 },
    ],
  },
  {
    id: "pv_camrye300",
    name: "Toyota Camry Executive",
    type: "Sedan",
    brand: "Toyota",
    businessId: "biz_lagosluxe",
    businessName: "Lagos Luxe Fleet",
    location: "Victoria Island",
    rating: 4.7,
    reviews: 112,
    fromPrice: 65000,
    seats: "4 seats",
    availability: "available",
    specs: [
      { key: "Seats", value: "4" },
      { key: "Transmission", value: "Automatic" },
      { key: "Fuel", value: "Petrol" },
      { key: "Year", value: "2023" },
      { key: "Colour", value: "Pearl white" },
      { key: "Pilot", value: "Included" },
    ],
    tiers: [
      { id: "t_4h", label: "4 hours", sub: "City engagements", price: 45000 },
      { id: "t_6h", label: "6 hours", sub: "Half day, most popular", price: 65000 },
      { id: "t_12h", label: "12 hours", sub: "Full day event", price: 110000 },
    ],
  },
  {
    id: "pv_sprinter",
    name: "Mercedes-Benz Sprinter VIP",
    type: "Van",
    brand: "Mercedes-Benz",
    businessId: "biz_kayode",
    businessName: "Kayode Motors",
    location: "Ibadan",
    rating: 5.0,
    reviews: 21,
    fromPrice: 190000,
    seats: "10 seats",
    availability: "booked",
    specs: [
      { key: "Seats", value: "10" },
      { key: "Transmission", value: "Automatic" },
      { key: "Fuel", value: "Diesel" },
      { key: "Year", value: "2023" },
      { key: "Colour", value: "Arctic white" },
      { key: "Pilot", value: "Included" },
    ],
    tiers: [
      { id: "t_6h", label: "6 hours", sub: "Half day, most popular", price: 190000 },
      { id: "t_12h", label: "12 hours", sub: "Full day event", price: 320000 },
    ],
  },
];

const ACTIVE_BOOKING: PremiumBooking = {
  id: "PR-2049",
  vehicle: VEHICLES[0],
  tier: VEHICLES[0].tiers[1],
  date: "Sat 13 Sep",
  startTime: "08:00",
  endHours: 6,
  status: "active",
  deposit: 60000,
  serviceFee: 5800,
  total: 210800,
  pilotName: "Chinedu Okafor",
  pilotRating: 4.9,
};

const mockPremiumService = {
  async getVehicles(): Promise<PremiumVehicle[]> {
    await mockDelay(500);
    return VEHICLES;
  },

  async getVehicle(id: string): Promise<PremiumVehicle | undefined> {
    await mockDelay(400);
    return VEHICLES.find((v) => v.id === id);
  },

  async getFeatured(): Promise<PremiumVehicle[]> {
    await mockDelay(350);
    return VEHICLES.slice(0, 2);
  },

  async getBusiness(id: string): Promise<PremiumBusiness | undefined> {
    await mockDelay(350);
    return BUSINESSES[id];
  },

  async createBooking(input: {
    vehicle: PremiumVehicle;
    tier: PremiumVehicle["tiers"][number];
    date: string;
    startTime: string;
  }): Promise<PremiumBooking> {
    await mockDelay(700);
    const deposit = Math.round(input.tier.price * 0.4 / 100) * 100;
    const serviceFee = Math.round(input.tier.price * 0.04 / 100) * 100;
    return {
      id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicle: input.vehicle,
      tier: input.tier,
      date: input.date,
      startTime: input.startTime,
      endHours: Number(input.tier.label.split(" ")[0]) || 6,
      status: "confirmed",
      deposit,
      serviceFee,
      total: input.tier.price + deposit + serviceFee,
    };
  },

  async getActiveBooking(): Promise<PremiumBooking | null> {
    await mockDelay(400);
    return ACTIVE_BOOKING;
  },

  async getBookingHistory(): Promise<PremiumBooking[]> {
    await mockDelay(400);
    return [ACTIVE_BOOKING];
  },
};

// ---- Real backend implementation ----

interface BackendTier {
  id: string;
  label: string;
  sub: string;
  price: number;
}

interface BackendVehicle extends Omit<PremiumVehicle, "tiers" | "fromPrice" | "seats" | "businessName" | "specs"> {
  businessName?: string;
  fromPrice: number;
  seats?: string;
  specs?: { key: string; value: string }[] | null;
  tiers: BackendTier[];
}

interface BackendBooking {
  id: string;
  vehicle?: BackendVehicle;
  tier?: BackendTier;
  date: string;
  startTime: string;
  endHours: number;
  status: string;
  deposit: number;
  serviceFee: number;
  total: number;
  pilotName?: string;
  pilotRating?: number;
}

const mapTier = (t: BackendTier): PremiumTier => ({ ...t, sub: t.sub ?? "", price: fromKobo(t.price) });

const mapVehicle = (v: BackendVehicle): PremiumVehicle => ({
  id: v.id,
  name: v.name,
  type: v.type ?? "",
  brand: v.brand ?? "",
  businessId: v.businessId,
  businessName: v.businessName ?? "",
  location: v.location ?? "",
  rating: v.rating,
  reviews: v.reviews,
  fromPrice: fromKobo(v.fromPrice),
  seats: v.seats ?? "",
  availability: v.availability,
  specs: v.specs ?? [],
  tiers: (v.tiers ?? []).map(mapTier),
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** UI keeps dates as "Sat 13 Sep"; the backend wants YYYY-MM-DD. */
function toIsoDate(ui: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(ui)) return ui.slice(0, 10);
  const m = ui.match(/(\d{1,2})\s+([A-Za-z]{3})/);
  const month = m ? MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) : -1;
  if (!m || month < 0) throw new ApiError("Pick a valid booking date.", 422, "VALIDATION_ERROR");
  const now = new Date();
  let year = now.getFullYear();
  // A month/day more than ~6 months in the past means next year.
  if (new Date(year, month, Number(m[1])).getTime() < now.getTime() - 180 * 86_400_000) year += 1;
  return `${year}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/** Backend returns a DATE column as an ISO timestamp; render it back as "Sat 13 Sep". */
function toUiDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // Midnight local time on a UTC+ server serialises to the previous evening in UTC; nudge by 12h.
  d.setUTCHours(d.getUTCHours() + 12);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

const vehicleCache = new Map<string, Promise<PremiumVehicle>>();
function fetchVehicle(id: string): Promise<PremiumVehicle> {
  let p = vehicleCache.get(id);
  if (!p) {
    p = http<BackendVehicle>(`/premium/vehicles/${id}`).then(mapVehicle);
    p.catch(() => vehicleCache.delete(id));
    vehicleCache.set(id, p);
  }
  return p;
}

async function mapBooking(b: BackendBooking): Promise<PremiumBooking> {
  // Booking DTOs carry a bare vehicle (no business name / tiers); enrich from the marketplace.
  const vehicle = b.vehicle ? await fetchVehicle(b.vehicle.id).catch(() => mapVehicle({ ...b.vehicle!, tiers: [] })) : undefined;
  const status = b.status === "active" || b.status === "completed" ? b.status : "confirmed";
  return {
    id: b.id,
    vehicle: vehicle as PremiumVehicle,
    tier: b.tier ? mapTier(b.tier) : (vehicle?.tiers[0] as PremiumTier),
    date: toUiDate(b.date),
    startTime: b.startTime?.slice(0, 5) ?? "",
    endHours: b.endHours,
    status,
    deposit: fromKobo(b.deposit),
    serviceFee: fromKobo(b.serviceFee),
    total: fromKobo(b.total),
    pilotName: b.pilotName,
    pilotRating: b.pilotRating,
  };
}

const realPremiumService: typeof mockPremiumService = {
  async getVehicles() {
    return (await http<BackendVehicle[]>("/premium/vehicles")).map(mapVehicle);
  },

  async getVehicle(id) {
    try {
      return mapVehicle(await http<BackendVehicle>(`/premium/vehicles/${encodeURIComponent(id)}`));
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 422)) return undefined;
      throw e;
    }
  },

  async getFeatured() {
    return (await http<BackendVehicle[]>("/premium/vehicles/featured")).map(mapVehicle);
  },

  async getBusiness(id) {
    try {
      return await http<PremiumBusiness>(`/premium/businesses/${encodeURIComponent(id)}`);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 422)) return undefined;
      throw e;
    }
  },

  async createBooking(input) {
    const b = await http<BackendBooking>("/premium/bookings", {
      method: "POST",
      body: {
        vehicleId: input.vehicle.id,
        tierId: input.tier.id,
        date: toIsoDate(input.date),
        startTime: input.startTime,
      },
    });
    const mapped = await mapBooking(b);
    return { ...mapped, vehicle: input.vehicle, tier: input.tier };
  },

  async getActiveBooking() {
    try {
      return await mapBooking(await http<BackendBooking>("/premium/bookings/active"));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },

  async getBookingHistory() {
    return Promise.all((await http<BackendBooking[]>("/premium/bookings/history")).map(mapBooking));
  },
};

export const premiumService = USE_MOCKS ? mockPremiumService : realPremiumService;
