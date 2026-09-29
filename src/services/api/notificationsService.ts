// Live: in-app notification feed + mark-all-read.
import { USE_MOCKS, http, mockDelay } from "./client";
import type { AppNotification } from "./types";

let NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Your ₦500 refund is on the way", body: "Dispute RT-4471 resolved in your favour · 09:12", time: "09:12", read: false, group: "today", kind: "refund" },
  { id: "n2", title: "Tomorrow’s 07:30 ride is confirmed", body: "Car to Alliance Place · fare locked at ₦2,450 · 08:04", time: "08:04", read: false, group: "today", kind: "schedule" },
  { id: "n3", title: "₦500 off your next ride", body: "Use code ROUTTA500 before 30 Sep · 07:15", time: "07:15", read: true, group: "today", kind: "promo" },
  { id: "n4", title: "How was your ride with Chinedu?", body: "Rate your 8 Sep trip to Ikeja City Mall · yesterday", time: "yesterday", read: true, group: "earlier", kind: "rating" },
  { id: "n5", title: "Tunde took his first ride", body: "₦1,000 added to your wallet · 2 Sep", time: "2 Sep", read: true, group: "earlier", kind: "referral" },
];

const mockNotificationsService = {
  async getNotifications(): Promise<AppNotification[]> {
    await mockDelay(350);
    return NOTIFICATIONS;
  },

  async markAllRead(): Promise<void> {
    await mockDelay(250);
    NOTIFICATIONS = NOTIFICATIONS.map((n) => ({ ...n, read: true }));
  },
};

// ---- Real backend implementation ----

interface BackendNotification {
  id: string;
  title: string;
  body: string;
  time: string; // ISO timestamp
  read: boolean;
  group: "today" | "earlier";
  kind: string;
}

const UI_KINDS: string[] = ["refund", "schedule", "promo", "rating", "referral"];

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const realNotificationsService: typeof mockNotificationsService = {
  async getNotifications() {
    const rows = await http<BackendNotification[]>("/notifications");
    return rows.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      time: formatTime(n.time),
      read: n.read,
      group: n.group,
      // The backend also emits driver/admin kinds (money, doc, ...); the commuter UI knows five.
      kind: (UI_KINDS.includes(n.kind) ? n.kind : "promo") as AppNotification["kind"],
    }));
  },

  async markAllRead() {
    await http<unknown>("/notifications/read-all", { method: "PATCH" });
  },
};

export const notificationsService = USE_MOCKS ? mockNotificationsService : realNotificationsService;
