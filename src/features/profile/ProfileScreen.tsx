import { useNavigate } from "react-router-dom";
import {
  HiPencil,
  HiChevronRight,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineGift,
  HiOutlineUserGroup,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog6Tooth,
  HiOutlineTruck,
} from "react-icons/hi2";
import { InitialsAvatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { initials, formatNaira } from "@/lib/utils";

const ROWS = [
  { icon: HiOutlineClock, label: "Ride history", meta: "148 rides", to: "/history" },
  { icon: HiOutlineTruck, label: "Premium Ride bookings", meta: "1 active", to: "/premium/history" },
  { icon: HiOutlineCreditCard, label: "Payments & wallet", meta: "₦3,120", to: "/payments" },
  { icon: HiOutlineGift, label: "Promotions", meta: "1 active", to: "/promotions" },
  { icon: HiOutlineUserGroup, label: "Refer a friend", meta: "", to: "/referrals" },
  { icon: HiOutlineShieldCheck, label: "Safety centre", meta: "", to: "/safety" },
  { icon: HiOutlineQuestionMarkCircle, label: "Help & support", meta: "", to: "/help" },
  { icon: HiOutlineCog6Tooth, label: "Settings", meta: "", to: "/settings" },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "Adaeze Nwosu";

  function logout() {
    signOut();
    navigate("/welcome");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg overflow-y-auto px-4.5 py-4">
      <div className="bg-white border border-border rounded-card p-4.5 flex items-center gap-3.5 mb-3.5">
        <InitialsAvatar initials={initials(fullName)} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-lg">{fullName}</div>
          <div className="font-sans font-medium text-[13px] text-muted mt-1">{profile?.phone}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="font-display font-bold text-xs text-warning">★ {profile?.rating ?? 4.8}</span>
            <span className="font-sans font-medium text-xs text-muted">
              · Commuter since {profile?.memberSince ?? "2024"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/profile/edit")}
          className="w-10 h-10 rounded-xl bg-bg grid place-items-center shrink-0"
          aria-label="Edit profile"
        >
          <HiPencil size={17} className="text-text-2" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-white border border-border rounded-xl p-3.5">
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Rides</div>
          <div className="font-display font-bold text-xl mt-2 tabular-nums">{profile?.ridesCount ?? 148}</div>
        </div>
        <div className="flex-1 bg-white border border-border rounded-xl p-3.5">
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Wallet</div>
          <div className="font-display font-bold text-xl mt-2 tabular-nums">{formatNaira(3120)}</div>
        </div>
        <div className="flex-1 bg-white border border-border rounded-xl p-3.5">
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Saved</div>
          <div className="font-display font-bold text-xl mt-2 tabular-nums">₦4k</div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden mb-3.5">
        {ROWS.map((r, i) => (
          <div key={r.label}>
            {i > 0 ? <div className="h-px bg-[#F0F2EF] mx-3.5" /> : null}
            <button
              type="button"
              onClick={() => navigate(r.to)}
              className="w-full flex items-center gap-3.5 px-3.5 py-3.5 text-left hover:bg-raised transition-colors"
            >
              <span className="w-9.5 h-9.5 rounded-xl bg-bg grid place-items-center shrink-0">
                <r.icon size={17} className="text-primary" />
              </span>
              <span className="flex-1 font-sans font-semibold text-[14.5px]">{r.label}</span>
              {r.meta ? (
                <span className="font-sans font-medium text-xs text-muted shrink-0">{r.meta}</span>
              ) : null}
              <HiChevronRight size={17} className="text-border-strong shrink-0" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-full h-13 rounded-btn bg-white border border-border font-sans font-bold text-[14.5px] text-error hover:border-error transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
