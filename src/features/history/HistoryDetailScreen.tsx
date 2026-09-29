import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RouttaMap } from "@/components/RouttaMap";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { historyService } from "@/services/api/historyService";
import { formatNaira, initials } from "@/lib/utils";
import { useRideStore } from "@/store/rideStore";
import type { HistoryTrip } from "@/services/api/types";

export default function HistoryDetailScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const setDestination = useRideStore((s) => s.setDestination);
  const [trip, setTrip] = useState<HistoryTrip | null>(null);

  useEffect(() => {
    historyService.getTrip(id).then((t) => setTrip(t ?? null));
  }, [id]);

  if (!trip) return null;

  function rebook() {
    if (!trip) return;
    setDestination(trip.destination);
    navigate("/category");
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bg">
      <ScreenHeader title={trip.id} transparent className="absolute top-0 left-0 right-0 z-10 [&_*]:text-white" />
      <div className="h-47.5 relative">
        <RouttaMap pickup={trip.pickup} destination={trip.destination} showRoute showPickup showDest />
      </div>
      <div className="p-4.5">
        <div className="bg-white border border-border rounded-card p-4 mb-3">
          <div className="flex items-center gap-2 mb-3.5">
            <Badge tone={trip.status === "completed" ? "success" : "error"}>{trip.status}</Badge>
            <span className="flex-1" />
            <span className="font-display font-semibold text-[11.5px] text-muted">{trip.id}</span>
          </div>
          <div className="flex gap-2.5 mb-4">
            <div className="flex flex-col items-center py-1 gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full border-2 border-primary" />
              <span className="w-px h-7.5 bg-border" />
              <span className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans font-semibold text-sm">{trip.pickup.label}</div>
              <div className="font-sans font-medium text-[11.5px] text-muted mt-0.5">
                Picked up {new Date(trip.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="h-2.5" />
              <div className="font-sans font-semibold text-sm">{trip.destination.label}</div>
              {trip.completedAt ? (
                <div className="font-sans font-medium text-[11.5px] text-muted mt-0.5">
                  Arrived {new Date(trip.completedAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                </div>
              ) : null}
            </div>
          </div>
          {trip.transporter ? (
            <div className="flex items-center gap-3 pt-3.5 border-t border-[#F0F2EF]">
              <InitialsAvatar initials={initials(trip.transporter.name)} tone="light" />
              <span className="flex-1">
                <span className="block font-sans font-semibold text-[14.5px]">{trip.transporter.name}</span>
                <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                  {trip.transporter.vehiclePlate}
                  {trip.rating ? ` · you rated ${trip.rating} stars` : ""}
                </span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="bg-white border border-border rounded-card p-4 mb-3">
          <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-3.5">
            Receipt
          </div>
          <div className="flex justify-between pb-2.5">
            <span className="font-sans font-medium text-[13.5px] text-text-2">
              {trip.categoryLabel} fare · {trip.distanceKm} km
            </span>
            <span className="font-display font-semibold text-[13.5px] tabular-nums">
              {formatNaira(trip.fare + (trip.promoDiscount ?? 0))}
            </span>
          </div>
          {trip.promoDiscount ? (
            <div className="flex justify-between pb-2.5">
              <span className="font-sans font-medium text-[13.5px] text-text-2">Promo applied</span>
              <span className="font-display font-semibold text-[13.5px] text-success tabular-nums">
                -{formatNaira(trip.promoDiscount)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between pt-3 border-t border-[#F0F2EF]">
            <span className="font-sans font-bold text-sm">Paid · {trip.paymentMethodLabel}</span>
            <span className="font-display font-bold text-[17px] tabular-nums">{formatNaira(trip.fare)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 h-13 rounded-btn bg-white border-[1.5px] border-border font-sans font-bold text-[13.5px] hover:border-primary transition-colors"
          >
            Download receipt
          </button>
          <button
            type="button"
            onClick={rebook}
            className="flex-1 h-13 rounded-btn bg-primary text-white font-sans font-bold text-[13.5px] hover:bg-primary-600 transition-colors"
          >
            Ride this again
          </button>
        </div>
      </div>
    </div>
  );
}
