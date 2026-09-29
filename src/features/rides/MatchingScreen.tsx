import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routtaMarkGreen from "@/assets/brand/routta-mark-green.svg";
import { RouttaMap } from "@/components/RouttaMap";
import { rideService } from "@/services/api/rideService";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";

export default function MatchingScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);

  useEffect(() => {
    if (!trip) {
      navigate("/home", { replace: true });
      return;
    }
    let cancelled = false;
    rideService
      .pollMatch(trip)
      .then((updated) => {
        if (cancelled || updated.status === "cancelled") return;
        setActiveTrip(updated);
        navigate(updated.status === "no_match" ? "/no-match" : "/accepted");
      })
      .catch(() => {
        if (!cancelled) navigate("/system/network-error");
      });
    return () => {
      cancelled = true;
    };
  }, [trip, navigate, setActiveTrip]);

  async function cancel() {
    if (!trip) return;
    await rideService.cancelTrip(trip);
    setActiveTrip(null);
    navigate("/no-match");
  }

  if (!trip) return null;

  return (
    <div className="relative flex-1">
      <RouttaMap pickup={trip.pickup} destination={trip.destination} showRoute showPickup showDest pulse />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg,rgba(0,48,40,.28),rgba(0,48,40,.5))" }}
      />
      <div className="absolute top-11 left-0 right-0 flex justify-center py-3.5">
        <span className="font-sans font-bold text-[11px] tracking-[.14em] text-accent">
          FINDING YOUR TRANSPORTER
        </span>
      </div>
      <div className="absolute left-0 right-0 top-[190px] flex justify-center">
        <div className="relative w-[150px] h-[150px] grid place-items-center">
          <span className="absolute w-[150px] h-[150px] rounded-full bg-[rgba(196,240,74,.16)] animate-rt-ping" />
          <span className="absolute w-[150px] h-[150px] rounded-full bg-[rgba(196,240,74,.16)] animate-rt-ping [animation-delay:1.1s]" />
          <span className="w-19 h-19 rounded-full bg-accent grid place-items-center relative">
            <img src={routtaMarkGreen} alt="" className="h-8.5 w-auto" />
          </span>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-[0_-8px_32px_rgba(18,33,29,.2)] p-4.5">
        <h2 className="font-display font-bold text-[21px] tracking-[-.01em] mb-1.5">
          Looking for a {trip.categoryLabel} near you
        </h2>
        <p className="font-sans font-medium text-[13.5px] text-muted mb-4">
          Usually takes under a minute around Adeola Odeku at this hour.
        </p>
        <div className="flex gap-2 mb-4.5">
          <div className="flex-1 bg-bg rounded-[11px] p-2.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Fare</div>
            <div className="font-display font-bold text-base mt-1.5 tabular-nums">{formatNaira(trip.fare)}</div>
          </div>
          <div className="flex-1 bg-bg rounded-[11px] p-2.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Distance</div>
            <div className="font-display font-bold text-base mt-1.5 tabular-nums">{trip.distanceKm} km</div>
          </div>
          <div className="flex-1 bg-bg rounded-[11px] p-2.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Pay</div>
            <div className="font-display font-bold text-base mt-1.5">Card</div>
          </div>
        </div>
        <div className="h-[3px] rounded-pill bg-primary-100 overflow-hidden mb-4">
          <div className="w-[38%] h-full bg-primary animate-rt-bar" />
        </div>
        <button
          type="button"
          onClick={cancel}
          className="w-full h-[52px] rounded-btn border-[1.5px] border-border-strong font-sans font-bold text-[15px] hover:border-error hover:text-error transition-colors"
        >
          Cancel request
        </button>
      </div>
    </div>
  );
}
