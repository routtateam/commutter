import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiBackspace } from "react-icons/hi2";
import { HiOutlineClock } from "react-icons/hi2";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function OtpEntryScreen() {
  const navigate = useNavigate();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(47);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function submit(nextCode: string) {
    if (nextCode.length !== 6) return;
    try {
      const res = await authService.verifyOtp(pendingPhone ?? "", nextCode);
      if (res.verified) navigate(res.isNewUser ? "/auth/create-account" : "/auth/location");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  function press(d: string) {
    if (code.length >= 6) return;
    const next = code + d;
    setCode(next);
    setError(null);
    if (next.length === 6) void submit(next);
  }

  function del() {
    setCode((c) => c.slice(0, -1));
    setError(null);
  }

  return (
    <div className="flex flex-1 flex-col bg-white pt-6 px-6">
      <h1 className="font-display font-bold text-[25px] leading-[1.15] tracking-[-.015em] mb-2">
        Enter your code
      </h1>
      <p className="font-sans font-medium text-[14.5px] text-muted mb-1">
        Sent to {pendingPhone ?? "+234 803 411 2094"}.
      </p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="font-sans font-bold text-[13.5px] text-primary-600 self-start py-1.5 mb-6"
      >
        Change number
      </button>
      <div className="flex gap-2.5 mb-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-[60px] rounded-btn grid place-items-center font-display font-bold text-2xl bg-raised border-[1.5px]",
              error ? "border-error" : "border-border"
            )}
          >
            {code[i] ?? ""}
          </div>
        ))}
      </div>
      {error ? <p className="font-sans font-semibold text-xs text-error mt-1">{error}</p> : null}
      <div className="flex items-center gap-1.5 mt-3">
        <HiOutlineClock className="text-muted" size={15} />
        <span className="font-sans font-medium text-[13px] text-muted">
          Resend code in{" "}
          <span className="font-display font-semibold tabular-nums text-text-2">
            0:{String(seconds).padStart(2, "0")}
          </span>
        </span>
      </div>
      <span className="flex-1" />
      <div className="grid grid-cols-3 gap-2 pb-6.5">
        {DIGITS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => press(d)}
            className="h-14 rounded-btn bg-bg font-display font-semibold text-[22px] hover:bg-primary-100 transition-colors"
          >
            {d}
          </button>
        ))}
        <span />
        <button
          type="button"
          onClick={() => press("0")}
          className="h-14 rounded-btn bg-bg font-display font-semibold text-[22px] hover:bg-primary-100 transition-colors"
        >
          0
        </button>
        <button
          type="button"
          onClick={del}
          className="h-14 rounded-btn grid place-items-center hover:bg-bg transition-colors"
        >
          <HiBackspace size={22} className="text-text-2" />
        </button>
      </div>
    </div>
  );
}
