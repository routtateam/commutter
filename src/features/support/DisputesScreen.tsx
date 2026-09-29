import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/badge";
import { supportService } from "@/services/api/supportService";
import type { Dispute } from "@/services/api/types";

export default function DisputesScreen() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    supportService.getDisputes().then(setDisputes).catch(() => setDisputes([]));
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-bg">
    <ScreenHeader title="Disputes" />
    <div className="flex-1 overflow-y-auto px-4.5 py-4">
      {disputes.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => navigate(`/help/disputes/${d.id}`)}
          className="w-full bg-white border border-border rounded-card p-4 text-left mb-2.5 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Badge tone={d.status === "under_review" ? "warning" : "success"}>
              {d.status === "under_review" ? "Under review" : "Resolved"}
            </Badge>
            <span className="flex-1" />
            <span className="font-display font-semibold text-[11.5px] text-muted">{d.tripId}</span>
          </div>
          <div className="font-sans font-semibold text-[15px] mb-1">{d.title}</div>
          <div className="font-sans font-medium text-[12.5px] text-muted">
            Opened {d.openedAt} · last update {d.lastUpdate}
          </div>
        </button>
      ))}
      <div className="bg-info-tint rounded-card p-3.5 flex gap-2.5 mt-2">
        <HiOutlineInformationCircle size={17} className="text-info shrink-0 mt-0.5" />
        <span className="font-sans font-medium text-[12.5px] leading-relaxed text-info-strong">
          Most fare disputes are settled within 48 hours. Refunds go back to your original payment
          method.
        </span>
      </div>
    </div>
    </div>
  );
}
