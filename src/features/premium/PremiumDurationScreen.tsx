import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";
import type { PremiumTier } from "@/services/api/types";

export default function PremiumDurationScreen() {
  const navigate = useNavigate();
  const draft = usePremiumStore((s) => s.draft);
  const setTier = usePremiumStore((s) => s.setTier);

  useEffect(() => {
    if (!draft.vehicle) navigate("/premium", { replace: true });
  }, [draft.vehicle, navigate]);

  if (!draft.vehicle) return null;

  function pick(t: PremiumTier) {
    setTier(t);
    navigate("/premium/checkout");
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F7F5EF]">
      <ScreenHeader title="Choose duration" className="bg-white" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-4.5">
        <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3 flex items-center gap-2.5 mb-5">
          <span className="w-16 h-12 rounded-lg bg-[#EDEBE4] shrink-0 grid place-items-center font-display font-bold text-[10px] text-muted-2">
            {draft.vehicle.type}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-sans font-semibold text-sm truncate">{draft.vehicle.name}</span>
            <span className="block font-sans font-medium text-[11.5px] text-muted mt-0.5">
              {draft.vehicle.businessName} · {draft.date} · {draft.startTime}
            </span>
          </span>
        </div>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          How long do you need it?
        </div>
        <div className="flex flex-col gap-2 mb-4.5">
          {draft.vehicle.tiers.map((t) => {
            const isSelected = draft.tier?.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => pick(t)}
                className={`rounded-2xl p-3.5 flex items-center gap-3 text-left border-[1.5px] transition-colors ${
                  isSelected ? "bg-primary border-primary" : "bg-white border-[#E6E2D6] hover:border-gold"
                }`}
              >
                <span className="flex-1">
                  <span className={`block font-sans font-semibold text-[15.5px] ${isSelected ? "text-white" : "text-text"}`}>
                    {t.label}
                  </span>
                  <span className={`block font-sans font-medium text-xs mt-1 ${isSelected ? "text-primary-300" : "text-muted"}`}>
                    {t.sub}
                  </span>
                </span>
                <span className={`font-display font-bold text-lg tabular-nums shrink-0 ${isSelected ? "text-gold" : "text-text"}`}>
                  {formatNaira(t.price)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="bg-primary-100 rounded-xl p-3.5 flex gap-2.5 mb-4.5">
          <HiOutlineInformationCircle size={17} className="text-primary-600 shrink-0 mt-0.5" />
          <p className="font-sans font-medium text-[12.5px] leading-relaxed text-primary-600">
            Routta picks the tier automatically from the hours you choose. Going past your window
            is charged as overstay at <strong className="font-bold">₦8,500 per 30 minutes</strong>.
          </p>
        </div>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Start
        </div>
        <div className="flex gap-2 mb-6">
          <div className="flex-1 bg-white border-[1.5px] border-[#E6E2D6] rounded-xl p-3.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Date</div>
            <div className="font-sans font-semibold text-[14.5px] mt-1.5">{draft.date}</div>
          </div>
          <div className="flex-1 bg-white border-[1.5px] border-[#E6E2D6] rounded-xl p-3.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Time</div>
            <div className="font-sans font-semibold text-[14.5px] mt-1.5">{draft.startTime}</div>
          </div>
        </div>
      </div>
      <div className="p-4.5 border-t border-[#E6E2D6] bg-white flex items-center gap-3.5">
        <div>
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Rental</div>
          <div className="font-display font-bold text-xl mt-1 tabular-nums">
            {formatNaira(draft.tier?.price ?? draft.vehicle.fromPrice)}
          </div>
        </div>
        <Button className="flex-1" onClick={() => navigate("/premium/checkout")}>
          Continue to checkout
        </Button>
      </div>
    </div>
  );
}
