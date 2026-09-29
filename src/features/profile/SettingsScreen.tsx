import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Switch } from "@/components/ui/switch";
import { profileService } from "@/services/api/profileService";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const pushToast = useUiStore((s) => s.pushToast);
  const [autoShare, setAutoShare] = useState(true);
  const [pinRequired, setPinRequired] = useState(true);
  const [rideUpdates, setRideUpdates] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(false);
  const [scheduleReminders, setScheduleReminders] = useState(true);

  async function deleteAccount() {
    try {
      await profileService.deleteAccount();
    } catch (e) {
      // e.g. refused while a ride is active or the wallet still holds money
      pushToast(e instanceof Error ? e.message : "Could not delete your account", "error");
      return;
    }
    signOut();
    pushToast("Account deleted");
    navigate("/welcome");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Settings" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <Section title="Safety">
          <ToggleRow
            label="Auto-share every trip"
            desc="Sends your live route to your primary contact whenever a ride starts"
            checked={autoShare}
            onChange={setAutoShare}
          />
          <ToggleRow
            label="PIN before every trip"
            desc="Your Transporter must enter your 4-digit PIN to start"
            checked={pinRequired}
            onChange={setPinRequired}
            border
          />
          <button
            type="button"
            onClick={() => navigate("/safety/emergency-contacts")}
            className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
          >
            <span className="flex-1">
              <span className="block font-sans font-semibold text-[14.5px]">Emergency contacts</span>
              <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                Manage your list
              </span>
            </span>
            <HiChevronRight size={17} className="text-border-strong" />
          </button>
        </Section>

        <Section title="Notifications">
          <ToggleRow label="Ride updates" checked={rideUpdates} onChange={setRideUpdates} border />
          <ToggleRow label="Promotions" checked={promoNotifs} onChange={setPromoNotifs} border />
          <ToggleRow label="Scheduled ride reminders" checked={scheduleReminders} onChange={setScheduleReminders} />
        </Section>

        <Section title="Preferences">
          <button type="button" className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left border-b border-[#F0F2EF]">
            <span className="flex-1 font-sans font-semibold text-[14.5px]">Language</span>
            <span className="font-sans font-medium text-[13px] text-muted">English (Nigeria)</span>
            <HiChevronRight size={17} className="text-border-strong ml-1.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
          >
            <span className="flex-1 font-sans font-semibold text-[14.5px]">Default payment</span>
            <span className="font-sans font-medium text-[13px] text-muted tabular-nums">•••• 4821</span>
            <HiChevronRight size={17} className="text-border-strong ml-1.5" />
          </button>
        </Section>

        <button
          type="button"
          onClick={deleteAccount}
          className="w-full h-13 rounded-btn font-sans font-bold text-[14.5px] text-error hover:bg-error-tint transition-colors"
        >
          Delete my account
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        {title}
      </div>
      <div className="bg-white border border-border rounded-card overflow-hidden">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  border,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  border?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-3.5 py-3.5 ${border ? "border-b border-[#F0F2EF]" : ""}`}>
      <span className="flex-1">
        <span className="block font-sans font-semibold text-[14.5px]">{label}</span>
        {desc ? <span className="block font-sans font-medium text-xs text-muted mt-0.5">{desc}</span> : null}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
