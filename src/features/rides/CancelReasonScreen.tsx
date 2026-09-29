import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { rideService } from "@/services/api/rideService";
import { useRideStore } from "@/store/rideStore";
import { useUiStore } from "@/store/uiStore";
import { formatNaira } from "@/lib/utils";

const REASONS = [
  "Waiting too long",
  "I booked the wrong vehicle",
  "My plans changed",
  "Something felt unsafe",
];

export default function CancelReasonScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);
  const pushToast = useUiStore((s) => s.pushToast);
  const [selected, setSelected] = useState<string | null>(null);

  async function confirmCancel() {
    let fee = 0;
    try {
      if (trip) fee = (await rideService.cancelTrip(trip, selected ?? undefined)).cancelFee ?? 0;
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not cancel your ride", "error");
      return;
    }
    setActiveTrip(null);
    pushToast(fee > 0 ? `Ride cancelled · ${formatNaira(fee)} fee applied` : "Ride cancelled · no fee charged");
    navigate("/home");
  }

  return (
    <div className="flex flex-1 flex-col bg-white pt-5 px-4.5">
      <div className="bg-warning-tint rounded-xl px-3.5 py-3.5 flex gap-2.5 mb-5">
        <HiOutlineExclamationTriangle className="text-warning shrink-0 mt-0.5" size={18} />
        <div>
          <div className="font-sans font-bold text-[13px] text-warning-strong">A ₦300 fee applies</div>
          <div className="font-sans font-medium text-[12.5px] text-warning-strong/80 mt-0.5">
            Your Transporter is already close to your pickup. Cancelling now charges a fee.
          </div>
        </div>
      </div>
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        Why are you cancelling?
      </div>
      <div className="flex flex-col gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setSelected(r)}
            className={`flex items-center gap-2.5 p-3.5 rounded-btn border-[1.5px] text-left transition-colors ${
              selected === r ? "border-primary" : "border-border hover:border-primary"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                selected === r ? "border-primary bg-primary" : "border-border-strong"
              }`}
            />
            <span className="font-sans font-semibold text-[14.5px]">{r}</span>
          </button>
        ))}
      </div>
      <span className="flex-1" />
      <div className="flex flex-col gap-2 pb-6">
        <button
          type="button"
          onClick={confirmCancel}
          className="h-[52px] rounded-btn bg-error text-white font-sans font-bold text-[15px] hover:bg-error-strong transition-colors"
        >
          Cancel ride · pay ₦300
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[52px] rounded-btn border-[1.5px] border-border-strong font-sans font-bold text-[15px] hover:border-primary transition-colors"
        >
          Keep my ride
        </button>
      </div>
    </div>
  );
}
