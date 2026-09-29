import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { walletService, TOP_UP_AMOUNTS } from "@/services/api/walletService";
import { useUiStore } from "@/store/uiStore";
import { formatNaira, cn } from "@/lib/utils";

export default function WalletTopUpScreen() {
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(TOP_UP_AMOUNTS[1].value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    walletService.getWalletBalance().then(setBalance);
  }, []);

  async function confirm() {
    setLoading(true);
    try {
      const res = await walletService.topUp(amount);
      setBalance(res.newBalance);
      pushToast(`Wallet topped up ${formatNaira(amount)}`, "success");
      navigate(-1);
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Top-up failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <ScreenHeader title="Top up wallet" />
      <div className="px-4.5 pt-4.5 flex-1 flex flex-col">
        <div className="bg-primary rounded-card p-4.5 mb-4.5">
          <div className="font-sans font-bold text-[10.5px] tracking-[.1em] text-primary-300 uppercase">
            Current balance
          </div>
          <div className="font-display font-bold text-[32px] text-white mt-3 tracking-[-.02em] tabular-nums">
            {formatNaira(balance)}
          </div>
          <div className="font-sans font-medium text-[12.5px] text-primary-200 mt-2">
            Enough for one more Car trip across the island
          </div>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          How much?
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {TOP_UP_AMOUNTS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setAmount(a.value)}
              className={cn(
                "h-14 rounded-btn border-[1.5px] font-display font-bold text-[15px] tabular-nums transition-colors",
                amount === a.value ? "border-primary bg-[#F7FBF9]" : "border-border hover:border-primary"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5 mt-2">
          From
        </div>
        <div className="border-[1.5px] border-primary rounded-btn p-3.5 flex items-center gap-3 bg-[#F7FBF9] mb-3">
          <span className="w-10.5 h-[30px] rounded-[5px] bg-[#12211D] grid place-items-center shrink-0 font-display font-extrabold text-[8.5px] text-[#F5C24B]">
            VISA
          </span>
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[14.5px] tabular-nums">•••• 4821</span>
            <span className="block font-sans font-medium text-xs text-muted mt-0.5">GTBank · default</span>
          </span>
          <span className="w-5.5 h-5.5 rounded-full bg-primary grid place-items-center shrink-0">
            <HiCheck size={13} className="text-accent" strokeWidth={3.5} />
          </span>
        </div>

        <div className="bg-bg rounded-card p-3.5 mb-4">
          <div className="flex justify-between pb-2.5">
            <span className="font-sans font-medium text-[13px] text-text-2">Top up</span>
            <span className="font-display font-semibold text-[13px] tabular-nums">{formatNaira(amount)}</span>
          </div>
          <div className="flex justify-between pb-2.5">
            <span className="font-sans font-medium text-[13px] text-text-2">Fee</span>
            <span className="font-display font-semibold text-[13px] text-success">Free</span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-border">
            <span className="font-sans font-bold text-[13.5px]">New balance</span>
            <span className="font-display font-bold text-base tabular-nums">
              {formatNaira(balance + amount)}
            </span>
          </div>
        </div>
        <span className="flex-1" />
        <Button onClick={confirm} loading={loading} className="mb-6.5">
          Top up {formatNaira(amount)}
        </Button>
      </div>
    </div>
  );
}
