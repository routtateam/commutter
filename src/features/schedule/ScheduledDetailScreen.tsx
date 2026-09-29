import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { historyService } from "@/services/api/historyService";
import type { ScheduledRide } from "@/services/api/types";
import { useUiStore } from "@/store/uiStore";

export default function ScheduledDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [ride, setRide] = useState<ScheduledRide | null>(null);

  useEffect(() => {
    historyService
      .getScheduled()
      .then((all) => setRide(all.find((r) => r.id === id) ?? null))
      .catch(() => setRide(null));
  }, [id]);

  if (!ride) return null;

  async function cancel() {
    if (!ride) return;
    try {
      await historyService.cancelScheduled(ride.id);
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not cancel this ride", "error");
      return;
    }
    pushToast("Scheduled ride cancelled");
    navigate("/scheduled");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Scheduled ride" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <div className="bg-white border border-border rounded-card p-4 mb-3">
          <Badge tone="info" className="mb-3.5">
            {ride.date.toUpperCase()} · {ride.time}
          </Badge>
          <div className="flex gap-2.5 mb-4">
            <div className="flex flex-col items-center py-1 gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full border-2 border-primary" />
              <span className="w-px h-6 bg-border" />
              <span className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <div>
              <div className="font-sans font-semibold text-sm">{ride.pickup.label}</div>
              <div className="h-5" />
              <div className="font-sans font-semibold text-sm">{ride.destination.label}</div>
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#F0F2EF]">
            <span className="font-sans font-medium text-[13px] text-text-2">Fare locked</span>
            <span className="font-display font-bold text-base tabular-nums">
              ₦{ride.fare.toLocaleString()}
            </span>
          </div>
        </div>
        <Button variant="secondary" className="w-full text-error border-error-tint" onClick={cancel}>
          Cancel this scheduled ride
        </Button>
      </div>
    </div>
  );
}
