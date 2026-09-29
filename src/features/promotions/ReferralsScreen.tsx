import { HiOutlineUserGroup } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const INVITES = [
  { initials: "TO", name: "Tunde Oyelaran", status: "Took first ride · 2 Sep", earned: "+₦1,000" },
  { initials: "KA", name: "Kemi Adebayo", status: "Joined · yet to ride", pending: true },
  { initials: "EN", name: "Emeka Nnadi", status: "Invite sent · 28 Aug", faded: true },
];

export default function ReferralsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const pushToast = useUiStore((s) => s.pushToast);
  const code = profile?.referralCode ?? "ADAEZE24";

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
    pushToast("Referral code copied", "success");
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <ScreenHeader title="Refer a friend" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-5 pb-6">
        <div className="text-center mb-5.5">
          <div className="w-16 h-16 rounded-full bg-primary-100 grid place-items-center mx-auto mb-4">
            <HiOutlineUserGroup size={28} className="text-primary" />
          </div>
          <div className="font-display font-bold text-[23px] leading-[1.2] tracking-[-.015em]">
            Give ₦1,000,
            <br />
            get ₦1,000
          </div>
          <p className="font-sans font-medium text-sm leading-relaxed text-text-2 mt-2.5 max-w-[30ch] mx-auto">
            Your friend gets ₦1,000 off their first ride. You get ₦1,000 when they take it.
          </p>
        </div>

        <div className="border-[1.5px] border-dashed border-primary rounded-card p-4 flex items-center gap-3 bg-[#F7FBF9] mb-3">
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[10.5px] tracking-[.1em] text-muted uppercase">
              Your code
            </span>
            <span className="block font-display font-bold text-[22px] tracking-[.12em] mt-2">{code}</span>
          </span>
          <button
            type="button"
            onClick={copy}
            className="h-11 px-4 rounded-[10px] bg-primary text-white font-sans font-bold text-[13.5px] shrink-0"
          >
            Copy
          </button>
        </div>
        <button
          type="button"
          onClick={copy}
          className="w-full h-[54px] rounded-btn bg-primary text-white font-sans font-bold text-[15.5px] mb-5.5"
        >
          Share your invite
        </button>

        <div className="flex gap-2 mb-4.5">
          <div className="flex-1 bg-bg rounded-xl p-3.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Invited</div>
            <div className="font-display font-bold text-[22px] mt-2 tabular-nums">7</div>
          </div>
          <div className="flex-1 bg-bg rounded-xl p-3.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Joined</div>
            <div className="font-display font-bold text-[22px] mt-2 tabular-nums">4</div>
          </div>
          <div className="flex-1 bg-primary rounded-xl p-3.5">
            <div className="font-sans font-bold text-[10px] tracking-[.08em] text-primary-300 uppercase">Earned</div>
            <div className="font-display font-bold text-[22px] text-accent mt-2 tabular-nums">₦4k</div>
          </div>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Your invites
        </div>
        <div className="flex flex-col">
          {INVITES.map((inv) => (
            <div key={inv.name} className="flex items-center gap-3 py-3.5 border-t border-[#F0F2EF]">
              <InitialsAvatar
                initials={inv.initials}
                tone={inv.faded ? "light" : "dark"}
                className={inv.faded ? "bg-bg text-muted" : undefined}
              />
              <span className="flex-1">
                <span className={`block font-sans font-semibold text-sm ${inv.faded ? "text-muted" : ""}`}>
                  {inv.name}
                </span>
                <span className="block font-sans font-medium text-xs text-muted mt-0.5">{inv.status}</span>
              </span>
              {inv.earned ? (
                <span className="font-display font-bold text-[13.5px] text-success shrink-0">{inv.earned}</span>
              ) : inv.pending ? (
                <Badge tone="warning">Pending</Badge>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
