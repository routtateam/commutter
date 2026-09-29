import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineBell, HiOutlineCalendarDays, HiOutlineClock, HiOutlineGift, HiOutlineUserGroup } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { notificationsService } from "@/services/api/notificationsService";
import type { AppNotification } from "@/services/api/types";
import { cn } from "@/lib/utils";

const ICONS: Record<AppNotification["kind"], ComponentType<{ size?: number; className?: string }>> = {
  refund: HiCheck,
  schedule: HiOutlineCalendarDays,
  promo: HiOutlineGift,
  rating: HiOutlineClock,
  referral: HiOutlineUserGroup,
};

const ROUTES: Record<AppNotification["kind"], string> = {
  refund: "/help/disputes",
  schedule: "/scheduled",
  promo: "/promotions",
  rating: "/history",
  referral: "/referrals",
};

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    notificationsService.getNotifications().then(setItems);
  }, []);

  async function markAllRead() {
    await notificationsService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const today = items.filter((n) => n.group === "today");
  const earlier = items.filter((n) => n.group === "earlier");

  function Group({ label, list }: { label: string; list: AppNotification[] }) {
    if (list.length === 0) return null;
    return (
      <>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-3">
          {label}
        </div>
        <div className="bg-white border border-border rounded-card overflow-hidden mb-4">
          {list.map((n, i) => {
            const Icon = ICONS[n.kind];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => navigate(ROUTES[n.kind])}
                className={cn(
                  "w-full flex gap-3 px-3.5 py-3.5 text-left hover:bg-raised transition-colors",
                  i > 0 && "border-t border-[#F0F2EF]",
                  !n.read && "bg-[#F7FBF9]"
                )}
              >
                <span className="w-9.5 h-9.5 rounded-xl bg-primary-100 grid place-items-center shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-sans font-semibold text-sm leading-snug">{n.title}</span>
                  <span className="block font-sans font-medium text-[12.5px] text-muted mt-1">
                    {n.body}
                  </span>
                </span>
                {!n.read ? <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" /> : null}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Notifications" />
      <div className="flex-1 overflow-y-auto px-4.5 py-3.5">
        <div className="flex items-center justify-end mb-1">
          <button
            type="button"
            onClick={markAllRead}
            className="font-sans font-bold text-xs text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-100"
          >
            Mark all read
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HiOutlineBell size={28} className="text-muted mb-3" />
            <p className="font-sans font-medium text-sm text-muted">You&rsquo;re all caught up.</p>
          </div>
        ) : (
          <>
            <Group label="Today" list={today} />
            <Group label="Earlier" list={earlier} />
          </>
        )}
      </div>
    </div>
  );
}
