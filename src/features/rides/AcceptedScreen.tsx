import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePhone, HiOutlineChatBubbleLeftRight, HiOutlineShare } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { InitialsAvatar } from "@/components/ui/avatar";
import { useRideStore } from "@/store/rideStore";
import { initials } from "@/lib/utils";

export default function AcceptedScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);

  useEffect(() => {
    if (!trip?.transporter) navigate("/home", { replace: true });
  }, [trip, navigate]);

  if (!trip?.transporter) return null;
  const t = trip.transporter;

  return (
    <div className="relative flex-1">
      {/* BACKEND-GAP: Transporter has no lat/lng on the trip DTO yet (see
          rideService.ts), so there is no live vehicle fix to plot — the
          vehicle pin is simply omitted rather than fabricated. */}
      <RouttaMap
        pickup={trip.pickup}
        destination={trip.destination}
        showRoute
        showPickup
        showDest
        showVehicle
      />
      <div className="absolute top-13 left-4 right-4 h-12 rounded-2xl bg-primary flex items-center px-3.5 gap-2.5 shadow-[0_4px_14px_rgba(18,33,29,.24)]">
        <span className="w-[9px] h-[9px] rounded-full bg-accent shadow-[0_0_0_4px_rgba(196,240,74,.22)] shrink-0" />
        <span className="flex-1 font-sans font-bold text-[12.5px] text-white">
          {t.name.split(" ")[0]} is on the way
        </span>
        <span className="font-display font-bold text-[15px] text-accent tabular-nums">
          {trip.etaMinutes} min
        </span>
      </div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5 animate-rt-sheet">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3.5" />
        <div className="flex items-center gap-3 mb-4">
          <InitialsAvatar initials={initials(t.name)} tone="light" size="lg" />
          <div className="flex-1 min-w-0">
            <div className="font-sans font-semibold text-[16.5px]">{t.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-display font-bold text-[12.5px] tabular-nums text-warning">★ {t.rating}</span>
              <span className="font-sans font-medium text-[12.5px] text-muted">· {t.trips.toLocaleString()} trips</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-bold text-sm tracking-[.04em]">{t.vehiclePlate}</div>
            <div className="font-sans font-medium text-[11.5px] text-muted mt-1">{t.vehicleModel}</div>
          </div>
        </div>
        <div className="bg-accent-tint rounded-xl px-3.5 py-3 flex items-center gap-2.5 mb-3.5">
          <span className="font-sans font-semibold text-[13px] text-accent-on-tint">
            Your PIN is <span className="font-display font-bold text-[15px] tracking-[.12em]">{trip.pin}</span> — share
            it only after you are in the vehicle.
          </span>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            className="flex-1 h-[50px] rounded-btn border-[1.5px] border-border flex items-center justify-center gap-2 font-sans font-bold text-[13.5px] hover:border-primary transition-colors"
          >
            <HiOutlinePhone size={17} />
            Call
          </button>
          <button
            type="button"
            className="flex-1 h-[50px] rounded-btn border-[1.5px] border-border flex items-center justify-center gap-2 font-sans font-bold text-[13.5px] hover:border-primary transition-colors"
          >
            <HiOutlineChatBubbleLeftRight size={17} />
            Message
          </button>
          <button
            type="button"
            onClick={() => navigate("/safety/share-trip")}
            className="w-[50px] h-[50px] rounded-btn border-[1.5px] border-border grid place-items-center hover:border-primary transition-colors shrink-0"
            aria-label="Share trip"
          >
            <HiOutlineShare size={17} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cancel-reason")}
          className="w-full h-12 rounded-btn font-sans font-bold text-[14.5px] text-text-2 hover:bg-error-tint hover:text-error transition-colors"
        >
          Cancel ride
        </button>
      </div>
    </div>
  );
}
