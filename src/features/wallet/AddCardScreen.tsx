import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineCreditCard } from "react-icons/hi2";
import routtaMarkLime from "@/assets/brand/routta-mark-lime.svg";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { walletService } from "@/services/api/walletService";
import { useUiStore } from "@/store/uiStore";

export default function AddCardScreen() {
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      await walletService.addCard({ number, expiry, cvv, makeDefault });
      pushToast("Card saved", "success");
      navigate(-1);
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not save your card", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <ScreenHeader title="Add a card" />
      <div className="px-4.5 pt-4.5 flex-1 flex flex-col">
        <div className="h-[150px] rounded-card bg-primary p-4.5 relative overflow-hidden mb-5.5 flex flex-col">
          <img src={routtaMarkLime} alt="" className="h-6.5 w-auto" />
          <span className="flex-1" />
          <div className="font-display font-bold text-lg text-white tracking-[.1em] tabular-nums">
            {number ? number.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
          </div>
          <div className="flex gap-5 mt-3.5">
            <div>
              <div className="font-sans font-semibold text-[8.5px] tracking-[.1em] text-primary-300 uppercase">
                Holder
              </div>
              <div className="font-sans font-semibold text-xs text-white mt-1.5">A NWOSU</div>
            </div>
            <div>
              <div className="font-sans font-semibold text-[8.5px] tracking-[.1em] text-primary-300 uppercase">
                Expires
              </div>
              <div className="font-display font-semibold text-xs text-white mt-1.5">{expiry || "MM/YY"}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Card number"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="5399 8412 4821 0093"
          />
          <div className="flex gap-2.5">
            <Input
              label="Expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM / YY"
              className="flex-1"
            />
            <Input
              label="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="•••"
              inputMode="numeric"
              className="flex-1"
            />
          </div>
          <button
            type="button"
            onClick={() => setMakeDefault((v) => !v)}
            className="flex items-center gap-2.5 py-1"
          >
            <span
              className={`w-5.5 h-5.5 rounded-md grid place-items-center shrink-0 ${
                makeDefault ? "bg-primary" : "bg-white border-[1.5px] border-border-strong"
              }`}
            >
              {makeDefault ? <HiCheck size={13} className="text-accent" strokeWidth={3.5} /> : null}
            </span>
            <span className="font-sans font-medium text-[13.5px] text-text-2">
              Make this my default payment method
            </span>
          </button>
          <div className="flex gap-2 items-start bg-bg rounded-xl p-3.5">
            <HiOutlineCreditCard size={16} className="text-text-2 shrink-0 mt-0.5" />
            <span className="font-sans font-medium text-xs leading-relaxed text-text-2">
              Card details are tokenised by our payment partner. Routta never stores your full
              number.
            </span>
          </div>
        </div>
        <span className="flex-1" />
        <Button onClick={save} loading={loading} className="my-6.5">
          Save card
        </Button>
      </div>
    </div>
  );
}
