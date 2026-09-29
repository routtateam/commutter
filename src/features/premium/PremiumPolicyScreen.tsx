import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { usePremiumStore } from "@/store/premiumStore";

export default function PremiumPolicyScreen() {
  const navigate = useNavigate();
  const setPolicyRead = usePremiumStore((s) => s.setPolicyRead);

  function accept() {
    setPolicyRead(true);
    navigate(-1);
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <ScreenHeader title="Rental policy" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-4.5">
        <Section title="Cancellation">
          <div className="flex flex-col gap-2">
            <PolicyRow tone="success" window="48+ hrs" desc="Full refund of rental, deposit and service charge" />
            <PolicyRow tone="warning" window="24–48 hrs" desc="50% of rental refunded · deposit returned in full" />
            <PolicyRow tone="error" window="Under 24" desc="Rental non-refundable · deposit returned in full" />
          </div>
        </Section>
        <Section title="Protection deposit">
          <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2">
            Released in full after the post-rental inspection when no eligible damage or overstay
            is recorded. Where a deduction applies, you receive the inspection report, the
            itemised deduction and the balance refunded. You may dispute any deduction within 7
            days.
          </p>
        </Section>
        <Section title="Overstay">
          <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2">
            Charged at ₦8,500 per 30 minutes beyond your booked window, deducted from the
            protection deposit. Your booking screen shows booked hours against actual hours live.
          </p>
        </Section>
        <Section title="Rental conditions">
          <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2">
            The vehicle is supplied with a pilot from the business. Smoking, off-road use and
            travel beyond the agreed state are not permitted and may result in a deduction. Fuel
            is included up to 200 km.
          </p>
        </Section>
      </div>
      <div className="p-4.5 border-t border-border flex gap-2.5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[52px] px-5 rounded-btn border-[1.5px] border-border-strong font-sans font-bold text-[14.5px]"
        >
          Close
        </button>
        <Button className="flex-1" onClick={accept}>
          I have read the policy
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

const TONE_BG: Record<string, string> = {
  success: "bg-success-tint text-success-strong",
  warning: "bg-warning-tint text-warning-strong",
  error: "bg-error-tint text-error-strong",
};

function PolicyRow({ tone, window, desc }: { tone: string; window: string; desc: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3.5 ${TONE_BG[tone]}`}>
      <span className="font-display font-bold text-[13px] w-20 shrink-0">{window}</span>
      <span className="flex-1 font-sans font-medium text-[13px] leading-snug">{desc}</span>
    </div>
  );
}
