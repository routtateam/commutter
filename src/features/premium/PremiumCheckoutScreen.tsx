import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineShieldCheck } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Row } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";
import { premiumService } from "@/services/api/premiumService";

export default function PremiumCheckoutScreen() {
  const navigate = useNavigate();
  const draft = usePremiumStore((s) => s.draft);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!draft.vehicle || !draft.tier) navigate("/premium", { replace: true });
  }, [draft.vehicle, draft.tier, navigate]);

  if (!draft.vehicle || !draft.tier) return null;

  const rental = draft.tier.price;
  const deposit = Math.round((rental * 0.4) / 100) * 100;
  const service = Math.round((rental * 0.04) / 100) * 100;
  const total = rental + deposit + service;

  async function pay() {
    if (!draft.policyRead) {
      navigate("/premium/policy");
      return;
    }
    setPaying(true);
    const booking = await premiumService.createBooking({
      vehicle: draft.vehicle!,
      tier: draft.tier!,
      date: draft.date,
      startTime: draft.startTime,
    });
    setPaying(false);
    navigate("/premium/confirmed", { state: { bookingId: booking.id } });
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F7F5EF]">
      <ScreenHeader title="Checkout" className="bg-white" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-4.5">
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Booking summary
        </div>
        <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 mb-5">
          <div className="flex gap-3 pb-3.5 mb-3.5 border-b border-[#F5F2E8]">
            <span className="w-18.5 h-14 rounded-lg bg-[#EDEBE4] shrink-0 grid place-items-center font-display font-bold text-[10px] text-muted-2">
              {draft.vehicle.type}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-sans font-semibold text-[14.5px]">{draft.vehicle.name}</span>
              <span className="block font-sans font-medium text-[11.5px] text-muted mt-0.5">
                {draft.vehicle.businessName} · verified
              </span>
            </span>
          </div>
          <Row label="Duration" value={draft.tier.label} />
          <Row label="Date & start" value={`${draft.date} · ${draft.startTime}`} />
          <Row label="Pilot" value="Included" />
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Payment breakdown
        </div>
        <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 mb-3.5">
          <Row label="Premium Ride" value={formatNaira(rental)} />
          <Row label="Refundable protection deposit" value={formatNaira(deposit)} />
          <div className="pb-2.5 border-b border-[#F5F2E8]" />
          <Row label="Service charge" value={formatNaira(service)} />
          <div className="flex items-center justify-between pt-3.5">
            <span className="font-sans font-bold text-[15px]">Total to pay</span>
            <span className="font-display font-bold text-[22px] tracking-[-.01em] tabular-nums">
              {formatNaira(total)}
            </span>
          </div>
        </div>

        <div className="bg-primary-100 rounded-xl p-3 flex gap-2.5 mb-4.5">
          <HiOutlineShieldCheck size={16} className="text-primary-600 shrink-0 mt-0.5" />
          <span className="font-sans font-medium text-[12.5px] leading-relaxed text-primary-600">
            {formatNaira(deposit)} of this is refundable and returns to your card after the
            post-rental inspection.
          </span>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Pay with
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="w-full bg-white border-[1.5px] border-primary rounded-2xl p-3.5 flex items-center gap-2.5 mb-4.5 text-left"
            >
              <span className="w-10 h-7 rounded-[5px] bg-[#12211D] grid place-items-center shrink-0 font-display font-extrabold text-[8.5px] text-[#F5C24B]">
                VISA
              </span>
              <span className="flex-1">
                <span className="block font-sans font-semibold text-[13.5px] tabular-nums">•••• 4821</span>
                <span className="block font-sans font-medium text-[11.5px] text-muted mt-0.5">
                  GTBank · default
                </span>
              </span>
              <span className="font-sans font-bold text-[12.5px] text-primary-600">Change</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="font-sans font-bold text-[19px] mb-3.5">Pay with</SheetTitle>
            <p className="font-sans font-medium text-sm text-muted">
              Manage saved cards from Payments in your profile.
            </p>
          </SheetContent>
        </Sheet>

        <button
          type="button"
          onClick={() => navigate("/premium/policy")}
          className="w-full bg-primary rounded-2xl p-3.5 flex items-center gap-2.5 mb-6 text-left"
        >
          <HiOutlineShieldCheck size={19} className="text-gold shrink-0" />
          <span className="flex-1">
            <span className="block font-sans font-bold text-sm text-white">
              Review refund &amp; cancellation policy
            </span>
            <span className="block font-sans font-medium text-xs text-primary-200 mt-0.5">
              Required before you can pay
            </span>
          </span>
          {draft.policyRead ? <HiCheck size={19} className="text-accent shrink-0" /> : null}
        </button>
      </div>
      <div className="p-4.5 border-t border-[#E6E2D6] bg-white">
        <button
          type="button"
          onClick={pay}
          disabled={paying}
          className={`w-full h-[54px] rounded-btn font-sans font-bold text-[15px] transition-colors ${
            draft.policyRead ? "bg-primary text-white hover:bg-primary-600" : "bg-bg text-muted-2"
          }`}
        >
          {paying ? "Processing…" : draft.policyRead ? `Pay ${formatNaira(total)}` : "Read the policy to continue"}
        </button>
      </div>
    </div>
  );
}
