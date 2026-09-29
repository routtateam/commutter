import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";

export default function PremiumConfirmedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = usePremiumStore((s) => s.draft);
  const bookingId = (location.state as { bookingId?: string } | null)?.bookingId ?? "PR-2049";

  useEffect(() => {
    if (!draft.vehicle || !draft.tier) navigate("/premium", { replace: true });
  }, [draft.vehicle, draft.tier, navigate]);

  if (!draft.vehicle || !draft.tier) return null;

  const rental = draft.tier.price;
  const deposit = Math.round((rental * 0.4) / 100) * 100;
  const service = Math.round((rental * 0.04) / 100) * 100;
  const total = rental + deposit + service;

  return (
    <div className="relative flex flex-1 flex-col bg-primary pt-11 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center relative">
        <div className="w-19 h-19 rounded-full bg-gold grid place-items-center mb-5.5">
          <HiCheck size={38} className="text-gold-deep" strokeWidth={3} />
        </div>
        <div className="font-sans font-bold text-[10px] tracking-[.18em] text-gold">
          PAYMENT CONFIRMED
        </div>
        <h1 className="font-display font-bold text-[27px] leading-[1.2] tracking-[-.02em] text-white mt-3.5 mb-2.5">
          Your Premium Ride
          <br />
          is booked
        </h1>
        <p className="font-sans font-medium text-[14.5px] leading-relaxed text-primary-200 max-w-[32ch]">
          {draft.vehicle.name} · {draft.date} at {draft.startTime}. {draft.vehicle.businessName} will
          confirm and assign your pilot shortly.
        </p>
        <div className="bg-white/8 rounded-2xl p-4 mt-6 w-full">
          <div className="flex justify-between py-1">
            <span className="font-sans font-medium text-[13px] text-primary-300">Booking</span>
            <span className="font-display font-semibold text-[13px] text-white">{bookingId}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-sans font-medium text-[13px] text-primary-300">Paid</span>
            <span className="font-display font-semibold text-[13px] text-white">{formatNaira(total)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-sans font-medium text-[13px] text-primary-300">Refundable</span>
            <span className="font-display font-semibold text-[13px] text-gold">{formatNaira(deposit)}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8.5 flex flex-col gap-2.5">
        <Button variant="accent" className="bg-gold text-gold-deep hover:bg-gold-strong" onClick={() => navigate(`/premium/booking/${bookingId}`)}>
          Track this booking
        </Button>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="h-[54px] rounded-btn bg-white/10 border-[1.5px] border-white/20 text-white font-sans font-bold text-[15.5px] hover:bg-white/16 transition-colors"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
