import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineDocumentText, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";

export default function CompletedScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.lastCompletedTrip);

  useEffect(() => {
    if (!trip) navigate("/home", { replace: true });
  }, [trip, navigate]);

  if (!trip) return null;

  const baseFare = trip.fare + (trip.promoDiscount ?? 0);

  return (
    <div className="flex flex-1 flex-col bg-bg overflow-y-auto">
      <div className="bg-primary px-4.5 pt-6 pb-6.5 text-center">
        <div className="w-15 h-15 rounded-full bg-accent grid place-items-center mx-auto mb-3.5">
          <HiCheck size={30} className="text-primary" strokeWidth={3} />
        </div>
        <div className="font-sans font-bold text-xl text-white">You have arrived</div>
        <div className="font-sans font-medium text-[13.5px] text-primary-200 mt-1.5">
          {trip.distanceKm} km · 47 minutes · {trip.paymentMethodLabel}
        </div>
        <div className="font-display font-bold text-[40px] text-accent mt-4.5 tracking-[-.02em] tabular-nums">
          {formatNaira(trip.fare)}
        </div>
      </div>
      <div className="p-4.5">
        <div className="bg-white border border-border rounded-card p-4 mb-3">
          <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-3.5">
            Receipt
          </div>
          <div className="flex justify-between pb-2.5">
            <span className="font-sans font-medium text-[13.5px] text-text-2">
              {trip.categoryLabel} fare · {trip.distanceKm} km
            </span>
            <span className="font-display font-semibold text-[13.5px] tabular-nums">
              {formatNaira(baseFare)}
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
            <span className="font-sans font-bold text-sm">Total paid</span>
            <span className="font-display font-bold text-[17px] tabular-nums">{formatNaira(trip.fare)}</span>
          </div>
        </div>
        <div className="flex gap-2 mb-3.5">
          <button
            type="button"
            className="flex-1 h-12 rounded-btn bg-white border-[1.5px] border-border font-sans font-bold text-[13.5px] flex items-center justify-center gap-2 hover:border-primary transition-colors"
          >
            <HiOutlineDocumentText size={16} />
            Receipt
          </button>
          <button
            type="button"
            onClick={() => navigate("/help/report", { state: { tripId: trip.id } })}
            className="flex-1 h-12 rounded-btn bg-white border-[1.5px] border-border font-sans font-bold text-[13.5px] flex items-center justify-center gap-2 hover:border-primary transition-colors"
          >
            <HiOutlineExclamationTriangle size={16} />
            Report an issue
          </button>
        </div>
        <Button className="w-full" onClick={() => navigate("/rating")}>
          Rate {trip.transporter?.name.split(" ")[0] ?? "your Transporter"}
        </Button>
      </div>
    </div>
  );
}
