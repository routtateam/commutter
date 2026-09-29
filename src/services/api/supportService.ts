// Live: disputes and support tickets with message threads (GET/POST /support/disputes, /support/tickets).
// Mock data below is used only when VITE_USE_MOCKS=true.
import { ApiError, USE_MOCKS, fromKobo, http, mockDelay } from "./client";
import type { Dispute, DisputeMessage, SupportTicket } from "./types";

const DISPUTES: Dispute[] = [
  {
    id: "RT-4471",
    tripId: "RT-4471",
    title: "Overcharged by ₦500",
    status: "under_review",
    openedAt: "8 Sep",
    amount: 500,
    lastUpdate: "2 hours ago",
    messages: [
      { id: "m1", author: "you", body: "The app quoted ₦2,450 but my card was charged ₦2,950.", time: "8 Sep, 11:40" },
      { id: "m2", author: "support", body: "Thanks Adaeze — we can see both amounts on trip RT-4471. We have asked our payments team to confirm which one settled.", time: "8 Sep, 12:05" },
      { id: "m3", author: "support", body: "Confirmed — the ₦500 was a duplicate hold. It is being released to •••• 4821 and should clear within 48 hours.", time: "today, 09:12" },
    ],
  },
  {
    id: "RT-3902",
    tripId: "RT-3902",
    title: "Phone left in vehicle",
    status: "resolved",
    openedAt: "21 Aug",
    amount: 1500,
    lastUpdate: "Returned 21 Aug",
    messages: [
      { id: "m1", author: "you", body: "I left my phone in the vehicle after my trip ended.", time: "21 Aug, 15:02" },
      { id: "m2", author: "support", body: "Your Transporter has confirmed the item. A ₦1,500 return fee has been refunded to your wallet.", time: "21 Aug, 17:40" },
    ],
  },
];

const mockSupportService = {
  async getDisputes(): Promise<Dispute[]> {
    await mockDelay(350);
    return DISPUTES;
  },

  async getDispute(id: string): Promise<Dispute | undefined> {
    await mockDelay(300);
    return DISPUTES.find((d) => d.id === id);
  },

  async submitReport(_input: { tripId: string; reason: string; details: string }): Promise<{ id: string }> {
    await mockDelay(600);
    return { id: `RT-${Math.floor(1000 + Math.random() * 9000)}` };
  },

  async sendDisputeReply(_id: string, _body: string): Promise<void> {
    await mockDelay(400);
  },

  async getTickets(): Promise<SupportTicket[]> {
    await mockDelay(300);
    return [];
  },

  async createTicket(_input: { subject: string; body: string; relatedTripId?: string }): Promise<SupportTicket> {
    await mockDelay(500);
    return { id: `tk_${Date.now()}`, ref: "TK-MOCK", subject: _input.subject, status: "open", openedAt: "just now", lastUpdate: "just now", messages: [] };
  },

  async sendTicketReply(_id: string, _body: string): Promise<void> {
    await mockDelay(400);
  },
};

// ---- Real backend implementation ----

interface BackendMessage {
  id: string;
  author: "you" | "support";
  body: string;
  time: string;
}

interface BackendDispute {
  id: string;
  tripId: string | null;
  title: string;
  status: "under_review" | "resolved";
  amount: number; // kobo
  openedAt: string;
  lastUpdate: string;
  messages: BackendMessage[];
}

interface BackendTicket {
  id: string;
  subject: string;
  status: SupportTicket["status"];
  openedAt: string;
  lastUpdate: string;
  messages: BackendMessage[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

const shortRef = (prefix: string, id: string): string => `${prefix}-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${fmtDate(iso)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const mins = Math.max(0, Math.round((Date.now() - t) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  return fmtDate(iso);
}

const mapMessage = (m: BackendMessage): DisputeMessage => ({
  id: m.id,
  author: m.author === "support" ? "support" : "you",
  body: m.body,
  time: fmtDateTime(m.time),
});

const mapDispute = (d: BackendDispute): Dispute => ({
  id: d.id,
  ref: shortRef("RT", d.tripId ?? d.id),
  tripId: d.tripId ? shortRef("RT", d.tripId) : shortRef("DP", d.id),
  title: d.title,
  status: d.status,
  openedAt: fmtDate(d.openedAt),
  amount: fromKobo(d.amount),
  lastUpdate: fmtRelative(d.lastUpdate),
  messages: (d.messages ?? []).map(mapMessage),
});

const mapTicket = (t: BackendTicket): SupportTicket => ({
  id: t.id,
  ref: shortRef("TK", t.id),
  subject: t.subject,
  status: t.status,
  openedAt: fmtDate(t.openedAt),
  lastUpdate: fmtRelative(t.lastUpdate),
  messages: (t.messages ?? []).map(mapMessage),
});

/** ReportScreen reasons -> backend dispute kinds. */
function reasonToKind(reason: string): "fare" | "route" | "safety" | "lost" | "other" {
  const r = reason.toLowerCase();
  if (r.includes("overcharg") || r.includes("fare")) return "fare";
  if (r.includes("route")) return "route";
  if (r.includes("safety")) return "safety";
  if (r.includes("left") || r.includes("lost")) return "lost";
  return "other";
}

const realSupportService: typeof mockSupportService = {
  async getDisputes() {
    return (await http<BackendDispute[]>("/support/disputes")).map(mapDispute);
  },

  async getDispute(id) {
    if (!UUID_RE.test(id)) return undefined;
    try {
      return mapDispute(await http<BackendDispute>(`/support/disputes/${id}`));
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 422)) return undefined;
      throw e;
    }
  },

  async submitReport({ tripId, reason, details }) {
    const d = await http<BackendDispute>("/support/disputes", {
      method: "POST",
      body: {
        // Only real trip uuids are accepted; the screen's static fallback id (RT-4471) is omitted.
        tripId: UUID_RE.test(tripId) ? tripId : undefined,
        title: reason,
        kind: reasonToKind(reason),
        description: details.trim() || reason,
      },
    });
    return { id: shortRef("RT", d.id) };
  },

  async sendDisputeReply(id, body) {
    await http<BackendDispute>(`/support/disputes/${id}/messages`, { method: "POST", body: { body } });
  },

  async getTickets() {
    return (await http<BackendTicket[]>("/support/tickets")).map(mapTicket);
  },

  async createTicket({ subject, body, relatedTripId }) {
    const t = await http<BackendTicket>("/support/tickets", {
      method: "POST",
      body: { subject, body, relatedTripId: relatedTripId && UUID_RE.test(relatedTripId) ? relatedTripId : undefined },
    });
    return mapTicket(t);
  },

  async sendTicketReply(id, body) {
    await http<BackendTicket>(`/support/tickets/${id}/messages`, { method: "POST", body: { body } });
  },
};

export const supportService = USE_MOCKS ? mockSupportService : realSupportService;
