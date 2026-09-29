import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/authStore";

export default function CreateAccountScreen() {
  const navigate = useNavigate();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const signIn = useAuthStore((s) => s.signIn);
  const [firstName, setFirstName] = useState("Adaeze");
  const [lastName, setLastName] = useState("Nwosu");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const session = await authService.createAccount({
      firstName,
      lastName,
      email,
      phone: pendingPhone ?? "+234 803 411 2094",
      referralCode: referral || undefined,
    });
    signIn(session.token, session.profile);
    setLoading(false);
    navigate("/auth/location");
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex-1 overflow-y-auto pt-5.5 px-6">
        <p className="font-sans font-medium text-[14.5px] leading-relaxed text-muted mb-5.5">
          Two fields and you are done. You can add a payment method later.
        </p>
        <div className="flex flex-col gap-4">
          <Input
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            success={firstName.length > 0}
            trailing={firstName ? <HiCheck className="text-success" size={18} /> : undefined}
          />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input
            label="Email address"
            hint="For receipts"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone number"
            value={pendingPhone ?? "+234 803 411 2094"}
            readOnly
            className="bg-bg"
            trailing={
              <span className="font-sans font-bold text-[10.5px] tracking-[.08em] px-2 py-1.5 rounded-md bg-success-tint text-success-strong">
                VERIFIED
              </span>
            }
          />
          <Input
            label="Referral code"
            hint="Optional"
            placeholder="Have a code from a friend?"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
        </div>
      </div>
      <div className="p-6 pt-3.5 border-t border-border bg-white">
        <Button onClick={submit} loading={loading} className="w-full">
          Create account
        </Button>
      </div>
    </div>
  );
}
