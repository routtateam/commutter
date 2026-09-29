import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePlus, HiOutlineCreditCard } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { walletService } from "@/services/api/walletService";
import { useUiStore } from "@/store/uiStore";
import { formatNaira } from "@/lib/utils";
import type { PaymentMethod } from "@/services/api/types";

export default function PaymentsScreen() {
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    walletService.getPaymentMethods().then(setMethods);
    walletService.getWalletBalance().then(setBalance);
  }, []);

  async function removeCard(id: string) {
    await walletService.removeCard(id);
    setMethods((prev) => prev.filter((m) => m.id !== id));
    pushToast("Card removed");
  }

  const cards = methods.filter((m) => m.kind === "card");

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Payments & wallet" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <div className="bg-primary rounded-2xl p-4.5 mb-4">
          <div className="font-sans font-bold text-[10.5px] tracking-[.1em] text-primary-300 uppercase">
            Routta wallet
          </div>
          <div className="font-display font-bold text-[30px] text-white mt-3 tabular-nums">
            {formatNaira(balance)}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/wallet/top-up")}
              className="flex-1 h-11 rounded-[10px] bg-accent text-primary font-sans font-bold text-[13.5px]"
            >
              Top up
            </button>
            <button
              type="button"
              className="flex-1 h-11 rounded-[10px] bg-white/12 text-white font-sans font-bold text-[13.5px]"
            >
              History
            </button>
          </div>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Cards
        </div>
        <div className="bg-white border border-border rounded-card overflow-hidden mb-4">
          {cards.map((m, i) => (
            <div key={m.id}>
              {i > 0 ? <div className="h-px bg-[#F0F2EF] mx-3.5" /> : null}
              <div className="flex items-center gap-3 px-3.5 py-3.5">
                <span
                  className={`w-11 h-[30px] rounded-[5px] grid place-items-center shrink-0 font-display font-extrabold text-[9px] ${
                    m.brand === "visa" ? "bg-[#12211D] text-[#F5C24B]" : "bg-bg text-text-2"
                  }`}
                >
                  {m.brand?.toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block font-sans font-semibold text-[14.5px] tabular-nums">
                    •••• {m.last4}
                  </span>
                  <span
                    className={`block font-sans font-medium text-xs mt-0.5 ${m.expired ? "text-error" : "text-muted"}`}
                  >
                    {m.expired ? `Expired ${m.expiry} — update to use` : `${m.bank} · expires ${m.expiry}`}
                  </span>
                </span>
                {m.isDefault ? (
                  <span className="font-sans font-bold text-[10.5px] tracking-[.08em] px-2.5 py-1.5 rounded-md bg-primary-100 text-primary-600 shrink-0 uppercase">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeCard(m.id)}
                    className="font-sans font-bold text-[12.5px] text-error shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/payments/add-card")}
          className="w-full h-13 rounded-btn border-[1.5px] border-dashed border-border-strong font-sans font-bold text-[14.5px] text-primary-600 flex items-center justify-center gap-2 mb-4 hover:border-primary transition-colors"
        >
          <HiOutlinePlus size={17} />
          Add a card
        </button>

        <div className="flex gap-2.5 items-start bg-white border border-border rounded-card p-3.5">
          <HiOutlineCreditCard size={16} className="text-text-2 shrink-0 mt-0.5" />
          <span className="font-sans font-medium text-[12.5px] leading-relaxed text-text-2">
            Routta is cashless. Every fare is charged to a card or your wallet, so there is nothing
            to haggle over and no change to find.
          </span>
        </div>
      </div>
    </div>
  );
}
