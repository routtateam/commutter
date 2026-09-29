import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/authStore";

export default function PhoneEntryScreen() {
  const navigate = useNavigate();
  const setPendingPhone = useAuthStore((s) => s.setPendingPhone);
  const [phone, setPhone] = useState("803 411 2094");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setLoading(true);
    const full = `+234 ${phone}`;
    await authService.sendOtp(full);
    setPendingPhone(full);
    setLoading(false);
    navigate("/auth/otp");
  }

  return (
    <div className="flex flex-1 flex-col bg-white pt-6 px-6">
      <h1 className="font-display font-bold text-[25px] leading-[1.15] tracking-[-.015em] mb-2">
        What&rsquo;s your number?
      </h1>
      <p className="font-sans font-medium text-[14.5px] leading-relaxed text-muted mb-6.5">
        We will text you a 6-digit code. Standard SMS rates apply.
      </p>
      <div className="font-sans font-semibold text-[12.5px] mb-1.5">Phone number</div>
      <div className="h-14 border-[1.5px] border-primary rounded-btn flex items-center px-3.5 gap-3 shadow-[0_0_0_3px_rgba(0,48,40,.1)]">
        <div className="flex items-center gap-1.5">
          <span
            className="w-[22px] h-[15px] rounded-sm block"
            style={{ background: "linear-gradient(90deg,#008751 33.3%,#fff 33.3% 66.6%,#008751 66.6%)" }}
          />
          <span className="font-sans font-semibold text-[15px]">+234</span>
        </div>
        <span className="w-px h-6 bg-border" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="numeric"
          className="flex-1 min-w-0 font-display font-semibold text-base tabular-nums tracking-[.02em] outline-none"
        />
      </div>
      <div className="flex gap-2 items-start mt-3.5">
        <HiOutlineInformationCircle className="text-info shrink-0 mt-0.5" size={16} />
        <span className="font-sans font-medium text-[12.5px] leading-relaxed text-text-2">
          Your number is only shared with your Transporter once a trip starts.
        </span>
      </div>
      <span className="flex-1" />
      <Button onClick={sendCode} loading={loading} className="mb-7">
        Send code
      </Button>
    </div>
  );
}
