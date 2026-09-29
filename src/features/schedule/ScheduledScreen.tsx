import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/CategoryIcon";
import { historyService } from "@/services/api/historyService";
import type { ScheduledRide } from "@/services/api/types";

export default function ScheduledScreen() {
  const navigate = useNavigate();
  const [rides, setRides] = useState<ScheduledRide[]>([]);

  useEffect(() => {
    historyService.getScheduled().then(setRides).catch(() => setRides([]));
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Scheduled rides" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4 flex flex-col gap-2.5">
        {rides.length === 0 ? (
          <p className="font-sans font-medium text-sm text-muted text-center py-10">
            No rides scheduled yet.
          </p>
        ) : (
          rides.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => navigate(`/scheduled/${r.id}`)}
              className="w-full bg-white border border-border rounded-card p-4 text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge tone="info">
                  {r.date.toUpperCase()} · {r.time}
                </Badge>
                <span className="flex-1" />
                {r.repeats ? <Badge tone="primary">Repeats</Badge> : null}
              </div>
              <div className="flex gap-2.5">
                <CategoryBadge category={r.category} size={18} />
                <span>
                  <span className="block font-sans font-semibold text-[14.5px]">
                    {r.destination.label}
                  </span>
                  <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                    from {r.pickup.label} · ₦{r.fare.toLocaleString()}
                  </span>
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
