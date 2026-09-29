// Shared request/response types for the mocked Routta commuter API layer.
// TODO: wire to real backend — these interfaces are the contract the future
// REST/GraphQL client should satisfy; only the implementation in each
// `*Service.ts` file is mocked today.

export type VehicleCategory = "bike" | "car" | "bus" | "van";

export interface CommuterProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  avatarUrl?: string;
  rating: number;
  memberSince: string;
  ridesCount: number;
  referralCode: string;
}

export interface AuthSession {
  token: string;
  profile: CommuterProfile;
}

export interface Place {
  id: string;
  label: string;
  subtitle: string;
  lat: number;
  lng: number;
  kind: "home" | "work" | "recent" | "search" | "saved";
}

export interface CategoryQuote {
  category: VehicleCategory;
  abbr: string;
  name: string;
  description: string;
  etaMinutes: number;
  fare: number;
  rate: string;
}

export interface CapacityOption {
  id: string;
  label: string;
  description: string;
  fare: number;
}

export interface PaymentMethod {
  id: string;
  kind: "card" | "wallet";
  brand?: "visa" | "verve" | "mastercard";
  last4?: string;
  bank?: string;
  expiry?: string;
  isDefault: boolean;
  expired?: boolean;
}

export interface PromoCode {
  code: string;
  title: string;
  description: string;
  discount: number;
  validForCategory?: VehicleCategory;
  expired?: boolean;
}

export interface TripQuote {
  id: string;
  pickup: Place;
  destination: Place;
  category: VehicleCategory;
  categoryLabel: string;
  distanceKm: number;
  etaMinutes: number;
  fare: number;
  promo?: PromoCode;
  paymentMethodId: string;
}

export type TripStatus =
  | "matching"
  | "no_match"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled";

export interface Transporter {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehiclePlate: string;
  vehicleModel: string;
  phone: string;
}

export interface Trip {
  id: string;
  status: TripStatus;
  category: VehicleCategory;
  categoryLabel: string;
  pickup: Place;
  destination: Place;
  distanceKm: number;
  etaMinutes: number;
  fare: number;
  promoDiscount?: number;
  paymentMethodLabel: string;
  transporter?: Transporter;
  pin: string;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  /** Late-cancellation fee charged (naira); set on cancelled trips when the backend applied one. */
  cancelFee?: number;
  cancelReason?: string;
}

export interface ScheduledRide {
  id: string;
  pickup: Place;
  destination: Place;
  category: VehicleCategory;
  date: string;
  time: string;
  fare: number;
  repeats: boolean;
}

export interface WalletSummary {
  balance: number;
}

export interface TopUpAmountOption {
  value: number;
  label: string;
}

export interface HistoryTrip extends Trip {
  cancelled?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  group: "today" | "earlier";
  kind: "refund" | "schedule" | "promo" | "rating" | "referral";
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  primary?: boolean;
}

export interface Dispute {
  id: string;
  /** Short display reference (e.g. RT-1A2B3C); `id` stays the full identifier used for API calls. */
  ref?: string;
  tripId: string;
  title: string;
  status: "under_review" | "resolved";
  openedAt: string;
  amount: number;
  lastUpdate: string;
  messages: DisputeMessage[];
}

export interface SupportTicket {
  id: string;
  ref: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  openedAt: string;
  lastUpdate: string;
  messages: DisputeMessage[];
}

export interface DisputeMessage {
  id: string;
  author: "you" | "support";
  body: string;
  time: string;
}

// ---- Premium Ride (business rental marketplace) ----

export interface PremiumVehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  businessId: string;
  businessName: string;
  location: string;
  rating: number;
  reviews: number;
  fromPrice: number;
  seats: string;
  availability: "available" | "limited" | "booked";
  specs: { key: string; value: string }[];
  tiers: PremiumTier[];
}

export interface PremiumTier {
  id: string;
  label: string;
  sub: string;
  price: number;
}

export interface PremiumBusiness {
  id: string;
  name: string;
  initials: string;
  location: string;
  verifiedSince: string;
  rating: number;
  vehicleCount: number;
  rentalCount: number;
  about: string;
}

export interface PremiumBooking {
  id: string;
  vehicle: PremiumVehicle;
  tier: PremiumTier;
  date: string;
  startTime: string;
  endHours: number;
  status: "confirmed" | "active" | "completed";
  deposit: number;
  serviceFee: number;
  total: number;
  pilotName?: string;
  pilotRating?: number;
}
