import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";

const TIP_AMOUNT = 500;

export default function TipScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.lastCompletedTrip);
  const resetDraft = useRideStore((s) => s.resetDraft);
  const setLastCompletedTrip = useRideStore((s) => s.setLastCompletedTrip);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);

  useEffect(() => {
    if (!trip) navigate("/home", { replace: true });
  }, [trip, navigate]);

  if (!trip) return null;
  const name = trip.transporter?.name.split(" ")[0] ?? "your Transporter";

  function done() {
    resetDraft();
    setLastCompletedTrip(null);
    setActiveTrip(null);
    navigate("/home");
  }

  return (
    <div className="flex flex-1 flex-col bg-white pt-5.5 px-4.5">
      <div className="text-center my-5">
        <div className="w-19 h-19 rounded-full bg-accent-tint grid place-items-center mx-auto mb-4">
          <HiCheck size={34} className="text-accent-on-tint" strokeWidth={2.4} />
        </div>
        <div className="font-sans font-bold text-[21px]">Thanks — sent</div>
        <p className="font-sans font-medium text-sm leading-relaxed text-text-2 mt-2 max-w-[28ch] mx-auto">
          Your rating and {formatNaira(TIP_AMOUNT)} tip are on their way to {name}.
        </p>
      </div>
      <div className="bg-bg rounded-card p-4 mb-5">
        <div className="flex justify-between pb-2.5">
          <span className="font-sans font-medium text-[13.5px] text-text-2">Trip total</span>
          <span className="font-display font-semibold text-[13.5px] tabular-nums">{formatNaira(trip.fare)}</span>
        </div>
        <div className="flex justify-between pb-2.5">
          <span className="font-sans font-medium text-[13.5px] text-text-2">Tip</span>
          <span className="font-display font-semibold text-[13.5px] tabular-nums">{formatNaira(TIP_AMOUNT)}</span>
        </div>
        <div className="flex justify-between pt-2.5 border-t border-border">
          <span className="font-sans font-bold text-sm">Charged to card</span>
          <span className="font-display font-bold text-base tabular-nums">
            {formatNaira(trip.fare + TIP_AMOUNT)}
          </span>
        </div>
      </div>
      <div className="border border-border rounded-card p-4 flex gap-3 items-center mb-5">
        <span className="w-11 h-11 rounded-[11px] bg-accent-tint grid place-items-center shrink-0">
          <HiOutlineUserPlus size={20} className="text-accent-on-tint" />
        </span>
        <span className="flex-1">
          <span className="block font-sans font-semibold text-[14.5px]">Give ₦1,000, get ₦1,000</span>
          <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
            Invite a friend to Routta
          </span>
        </span>
        <button
          type="button"
          onClick={() => navigate("/referrals")}
          className="font-sans font-bold text-[13px] text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-100 shrink-0"
        >
          Invite
        </button>
      </div>
      <span className="flex-1" />
      <Button onClick={done} className="mb-6.5">
        Done
      </Button>
    </div>
  );
}
