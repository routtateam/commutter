import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { walletService } from "@/services/api/walletService";
import { useRideStore } from "@/store/rideStore";
import type { PromoCode } from "@/services/api/types";

export default function PromoApplyScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const setPromo = useRideStore((s) => s.setPromo);
  const [code, setCode] = useState("");
  const [promos, setPromos] = useState<PromoCode[]>([]);

  useEffect(() => {
    walletService.getPromos().then(setPromos);
  }, []);

  function apply(promo: PromoCode) {
    if (promo.validForCategory && promo.validForCategory !== draft.category) return;
    setPromo(promo);
    navigate(-1);
  }

  async function applyTyped() {
    const found = await walletService.applyPromo(code);
    if (found) apply(found);
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <ScreenHeader title="Promo code" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-5.5">
        <div className="h-[54px] border-[1.5px] border-primary rounded-btn flex items-center pl-3.5 pr-1.5 gap-2 shadow-[0_0_0_3px_rgba(0,48,40,.09)] mb-6">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ROUTTA500"
            className="flex-1 font-display font-bold text-[15px] tracking-[.1em] outline-none uppercase"
          />
          <Button size="sm" onClick={applyTyped}>
            Apply
          </Button>
        </div>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Available to you
        </div>
        <div className="flex flex-col gap-2.5">
          {promos.map((p) => {
            const invalid = p.validForCategory && p.validForCategory !== draft.category;
            return (
              <button
                key={p.code}
                type="button"
                disabled={Boolean(invalid)}
                onClick={() => apply(p)}
                className={`border-[1.5px] rounded-card p-3.5 text-left flex gap-3 ${
                  invalid
                    ? "border-border opacity-60"
                    : "border-primary bg-[#F7FBF9] hover:bg-[#F0F7F4]"
                }`}
              >
                <span
                  className={`w-11 h-11 rounded-[11px] grid place-items-center shrink-0 font-display font-bold text-[13px] ${
                    invalid ? "bg-bg text-muted" : "bg-accent text-primary"
                  }`}
                >
                  {p.discount < 1 ? `${p.discount * 100}%` : "₦"}
                </span>
                <span className="flex-1">
                  <span className="block font-sans font-semibold text-[15px]">{p.title}</span>
                  <span className="block font-sans font-medium text-[12.5px] text-text-2 mt-0.5">
                    {invalid
                      ? `Not valid on this trip — you selected ${draft.categoryQuote?.name ?? "this vehicle"}`
                      : `Code ${p.code} · ${p.description}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
