import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePhone, HiOutlineShare } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { rideService } from "@/services/api/rideService";
import { formatNaira, initials } from "@/lib/utils";

export default function ActiveTripScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);
  const setLastCompletedTrip = useRideStore((s) => s.setLastCompletedTrip);

  useEffect(() => {
    if (!trip?.transporter) navigate("/home", { replace: true });
  }, [trip, navigate]);

  if (!trip?.transporter) return null;
  const t = trip.transporter;

  async function arrive() {
    if (!trip) return;
    const updated = await rideService.arrive(trip);
    setActiveTrip(updated);
    setLastCompletedTrip(updated);
    navigate("/completed");
  }

  return (
    <div className="relative flex-1">
      {/* BACKEND-GAP: no live driver GPS feed on the trip DTO — vehicle pin
          omitted rather than fabricated (see AcceptedScreen for details). */}
      <RouttaMap pickup={trip.pickup} destination={trip.destination} showRoute showDest showVehicle />
      <div className="absolute top-13 left-4 right-4 rounded-2xl bg-primary p-3.5 shadow-[0_4px_14px_rgba(18,33,29,.26)]">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-[9px] h-[9px] rounded-full bg-accent shadow-[0_0_0_4px_rgba(196,240,74,.22)] shrink-0" />
          <span className="flex-1 font-sans font-bold text-[10.5px] tracking-[.1em] text-primary-300 uppercase">
            On the way to
          </span>
          <span className="font-display font-bold text-xl text-accent tabular-nums">{trip.etaMinutes}</span>
          <span className="font-sans font-bold text-[10px] text-primary-300 tracking-[.08em] uppercase">min</span>
        </div>
        <div className="font-sans font-semibold text-[15.5px] text-white mb-3 truncate">
          {trip.destination.label}
        </div>
        <div className="h-1 rounded-pill bg-primary-600 overflow-hidden">
          <div className="w-[62%] h-full bg-accent rounded-pill" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-sans font-semibold text-[10.5px] text-primary-300">11.4 km covered</span>
          <span className="font-sans font-semibold text-[10.5px] text-primary-300">arrives 11:12</span>
        </div>
      </div>
      <button
        type="button"
        className="absolute right-4 bottom-[298px] w-[52px] h-[52px] rounded-full bg-error grid place-items-center shadow-[0_4px_14px_rgba(195,58,46,.4)] font-display font-extrabold text-[13px] text-white tracking-[.02em]"
      >
        SOS
      </button>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3.5" />
        <div className="flex items-center gap-3 mb-3.5">
          <InitialsAvatar initials={initials(t.name)} tone="light" size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-sans font-semibold text-[15.5px]">{t.name}</div>
            <div className="font-sans font-medium text-xs text-muted mt-0.5">
              {t.vehiclePlate} · {t.vehicleModel}
            </div>
          </div>
          <button
            type="button"
            className="w-[46px] h-[46px] rounded-xl bg-primary-100 grid place-items-center shrink-0"
            aria-label="Call"
          >
            <HiOutlinePhone size={18} className="text-primary" />
          </button>
        </div>
        <div className="flex items-center gap-2.5 py-3 border-y border-[#F0F2EF] mb-3.5">
          <span className="w-10 h-7 rounded-[5px] bg-[#12211D] grid place-items-center shrink-0 font-display font-extrabold text-[8.5px] text-[#F5C24B]">
            VISA
          </span>
          <span className="flex-1 font-sans font-semibold text-[13.5px]">
            {formatNaira(trip.fare)} · {trip.paymentMethodLabel}
          </span>
          <span className="font-sans font-bold text-[10.5px] tracking-[.08em] px-2 py-1.5 rounded-md bg-primary-100 text-primary-600">
            ON ARRIVAL
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/safety/share-trip")}
            className="flex-1 h-[50px] rounded-btn border-[1.5px] border-border flex items-center justify-center gap-2 font-sans font-bold text-[13.5px] hover:border-primary transition-colors"
          >
            <HiOutlineShare size={16} />
            Share trip
          </button>
          <Button className="flex-1 h-[50px] text-[13.5px]" onClick={arrive}>
            I have arrived
          </Button>
        </div>
      </div>
    </div>
  );
}
