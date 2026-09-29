import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { premiumService } from "@/services/api/premiumService";
import { formatNaira } from "@/lib/utils";
import type { PremiumBooking } from "@/services/api/types";

const STATUS_TONE: Record<PremiumBooking["status"], "primary" | "success" | "warning"> = {
  confirmed: "warning",
  active: "primary",
  completed: "success",
};

export default function PremiumHistoryScreen() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<PremiumBooking[]>([]);

  useEffect(() => {
    premiumService.getBookingHistory().then(setBookings);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF] p-4.5 flex flex-col gap-2.5">
      {bookings.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => navigate(`/premium/booking/${b.id}`)}
          className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 text-left hover:border-gold transition-colors"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
            <span className="flex-1" />
            <span className="font-display font-semibold text-[11.5px] text-muted">{b.id}</span>
          </div>
          <div className="font-sans font-semibold text-[15px]">{b.vehicle.name}</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="flex-1 font-sans font-medium text-xs text-muted">
              {b.vehicle.businessName} · {b.date}
            </span>
            <span className="font-display font-bold text-[15px] tabular-nums">{formatNaira(b.total)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
