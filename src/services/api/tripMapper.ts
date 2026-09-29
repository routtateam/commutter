// Maps backend trip DTOs (fares in kobo, statuses incl. in_progress) onto the
// frontend's Trip / HistoryTrip types (fares in naira).
import { fromKobo } from "./client";
import type { HistoryTrip, Place, Transporter, Trip, TripStatus, VehicleCategory } from "./types";

export interface BackendTrip {
  id: string;
  status: string;
  category: VehicleCategory;
  categoryLabel: string;
  pickup: { label: string; lat: number; lng: number };
  destination: { label: string; lat: number; lng: number };
  distanceKm: number | null;
  etaMinutes: number | null;
  fare: number;
  promoDiscount?: number;
  pin: string;
  createdAt: string;
  completedAt?: string | null;
  cancelledAt?: string | null;
  ratingByCommuter?: number | null;
  cancelFee?: number | null; // kobo
  cancelReason?: string | null;
  transporter?: Transporter;
}

export function mapStatus(s: string): TripStatus {
  switch (s) {
    case "matching":
    case "no_match":
    case "accepted":
    case "completed":
    case "cancelled":
      return s;
    case "enroute":
    case "arrived":
      return "accepted";
    case "in_progress":
    case "active":
      return "active";
    default:
      return "matching";
  }
}

function toPlace(p: BackendTrip["pickup"], kind: Place["kind"], id: string, subtitle: string): Place {
  return { id, label: p.label, subtitle, lat: p.lat, lng: p.lng, kind };
}

/** Client-side context the backend does not persist (payment label, richer place info). */
const tripContext = new Map<string, { pickup: Place; destination: Place; paymentMethodLabel: string }>();

export function rememberTripContext(id: string, ctx: { pickup: Place; destination: Place; paymentMethodLabel: string }) {
  tripContext.set(id, ctx);
}

export function mapTrip(t: BackendTrip): Trip {
  const ctx = tripContext.get(t.id);
  return {
    id: t.id,
    status: mapStatus(t.status),
    category: t.category,
    categoryLabel: t.categoryLabel,
    pickup: ctx?.pickup ?? toPlace(t.pickup, "search", `${t.id}_pickup`, "Pickup"),
    destination: ctx?.destination ?? toPlace(t.destination, "search", `${t.id}_dest`, ""),
    distanceKm: t.distanceKm ?? 0,
    etaMinutes: t.etaMinutes ?? 0,
    fare: fromKobo(t.fare),
    promoDiscount: t.promoDiscount ? fromKobo(t.promoDiscount) : undefined,
    paymentMethodLabel: ctx?.paymentMethodLabel ?? "Card",
    transporter: t.transporter,
    pin: t.pin,
    createdAt: t.createdAt,
    completedAt: t.completedAt ?? undefined,
    rating: t.ratingByCommuter ?? undefined,
    cancelFee: t.cancelFee ? fromKobo(t.cancelFee) : undefined,
    cancelReason: t.cancelReason ?? undefined,
  };
}

export function mapHistoryTrip(t: BackendTrip): HistoryTrip {
  const trip = mapTrip(t);
  return { ...trip, cancelled: trip.status === "cancelled" };
}
