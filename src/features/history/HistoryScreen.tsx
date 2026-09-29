import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Chip } from "@/components/ui/badge";
import { historyService } from "@/services/api/historyService";
import { formatNaira } from "@/lib/utils";
import type { HistoryTrip } from "@/services/api/types";

const FILTERS = ["All", "Completed", "Cancelled", "Bus"] as const;

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<HistoryTrip[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    historyService.getHistory().then(setTrips);
  }, []);

  const filtered = useMemo(() => {
    if (!trips) return [];
    if (filter === "All") return trips;
    if (filter === "Completed") return trips.filter((t) => t.status === "completed");
    if (filter === "Cancelled") return trips.filter((t) => t.status === "cancelled");
    return trips.filter((t) => t.category === "bus");
  }, [trips, filter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, HistoryTrip[]>();
    for (const t of filtered) {
      const month = new Date(t.createdAt).toLocaleDateString("en-NG", { month: "long" }).toUpperCase();
      groups.set(month, [...(groups.get(month) ?? []), t]);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  if (trips && trips.length === 0) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <ScreenHeader title="Ride history" />
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          <div className="font-sans font-bold text-lg mb-2">No rides yet</div>
          <p className="font-sans font-medium text-sm leading-relaxed text-muted mb-5.5">
            Once you take your first trip, your receipts and routes will live here.
          </p>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="h-13 px-6 rounded-btn bg-primary text-white font-sans font-bold text-[15px]"
          >
            Book your first ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Ride history" />
      <div className="flex-1 overflow-y-auto px-4.5 py-3.5">
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)} type="button">
              {f}
            </Chip>
          ))}
        </div>
        {grouped.map(([month, list]) => {
          const spent = list.filter((t) => !t.cancelled).reduce((sum, t) => sum + t.fare, 0);
          return (
            <div key={month} className="mb-4">
              <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
                {month} · {formatNaira(spent)} spent
              </div>
              <div className="flex flex-col gap-2.5">
                {list.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigate(`/history/${t.id}`)}
                    className="w-full bg-white border border-border rounded-card p-3.5 text-left hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className={`font-sans font-bold text-[10.5px] tracking-[.08em] px-2 py-1.5 rounded-md uppercase ${
                          t.status === "completed"
                            ? "bg-success-tint text-success-strong"
                            : "bg-error-tint text-error-strong"
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="flex-1" />
                      <span className="font-sans font-medium text-[11.5px] text-muted">
                        {new Date(t.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="w-10 h-10 rounded-xl bg-bg grid place-items-center shrink-0 font-display font-bold text-[9.5px] text-primary">
                        {t.category.slice(0, 3).toUpperCase()}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-sans font-semibold text-[14.5px] truncate">
                          {t.destination.label}
                        </span>
                        <span className="block font-sans font-medium text-xs text-muted mt-0.5 truncate">
                          {t.cancelled
                            ? "Cancelled · fee charged"
                            : `${t.distanceKm} km · ${t.transporter?.name ?? "Routta"}`}
                        </span>
                      </span>
                      <span className="font-display font-bold text-base tabular-nums shrink-0">
                        {formatNaira(t.fare)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
