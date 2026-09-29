import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useUiStore } from "@/store/uiStore";
import { walletService } from "@/services/api/walletService";
import type { PromoCode } from "@/services/api/types";

export default function PromotionsScreen() {
  const pushToast = useUiStore((s) => s.pushToast);
  const [promos, setPromos] = useState<PromoCode[]>([]);

  useEffect(() => {
    walletService.getPromos().then(setPromos);
  }, []);

  const active = promos[0];
  const more = promos.slice(1);

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Promotions" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        {active ? (
          <div className="rounded-card bg-primary p-5 relative overflow-hidden mb-4">
            <span className="font-sans font-bold text-[10.5px] tracking-[.1em] text-accent uppercase">
              Active now
            </span>
            <div className="font-display font-bold text-[25px] text-white leading-[1.15] mt-3 mb-2">
              {active.title}
            </div>
            <div className="font-sans font-medium text-[13px] text-primary-200 mb-4">
              Code {active.code} · {active.description}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(active.code).catch(() => {});
                pushToast("Promo code copied", "success");
              }}
              className="h-11 px-4.5 rounded-[10px] bg-accent text-primary font-sans font-bold text-[13.5px]"
            >
              Copy code
            </button>
          </div>
        ) : null}

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          More for you
        </div>
        <div className="flex flex-col gap-2.5 mb-4">
          {more.map((p) => (
            <div key={p.code} className="bg-white border border-border rounded-card p-3.5 flex gap-3">
              <span className="w-11 h-11 rounded-[11px] bg-accent-tint grid place-items-center shrink-0 font-display font-bold text-xs text-accent-on-tint">
                {p.discount < 1 ? `${p.discount * 100}%` : "₦"}
              </span>
              <span className="flex-1">
                <span className="block font-sans font-semibold text-[14.5px]">{p.title}</span>
                <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
                  {p.description}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Expired
        </div>
        <div className="bg-white border border-border rounded-card p-3.5 flex gap-3 opacity-55">
          <span className="w-11 h-11 rounded-[11px] bg-bg grid place-items-center shrink-0 font-display font-bold text-[11px] text-muted">
            ₦1k
          </span>
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[14.5px]">₦1,000 welcome credit</span>
            <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
              Used on 4 Aug · Lekki Phase 1
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
