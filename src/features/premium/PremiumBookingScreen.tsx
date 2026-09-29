import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePhone } from "react-icons/hi2";
import { premiumService } from "@/services/api/premiumService";
import { formatNaira, initials } from "@/lib/utils";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Row } from "@/components/ui/card";
import type { PremiumBooking } from "@/services/api/types";

const TIMELINE = [
  { t: "Booking confirmed", when: "13 Sep, 07:12", s: "Payment received", done: true },
  { t: "Pilot assigned", when: "13 Sep, 07:40", s: "Chinedu Okafor", done: true },
  { t: "Vehicle handed over", when: "13 Sep, 08:00", s: "Pre-rental inspection passed", done: true },
  { t: "Rental active", when: "now", s: "Ends 14:00", done: true, current: true },
  { t: "Vehicle returned", when: "pending", s: "Post-rental inspection", done: false },
];

export default function PremiumBookingScreen() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<PremiumBooking | null>(null);

  useEffect(() => {
    premiumService.getActiveBooking().then(setBooking);
  }, []);

  if (!booking) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF] p-4.5">
      <div className="bg-primary rounded-2xl p-4 mb-4.5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgba(217,185,106,.22)]" />
          <span className="font-sans font-bold text-[10px] tracking-[.12em] text-gold uppercase">
            Rental active
          </span>
          <span className="flex-1" />
          <span className="font-display font-semibold text-xs text-primary-300">{booking.id}</span>
        </div>
        <div className="font-display font-bold text-lg text-white mb-1">{booking.vehicle.name}</div>
        <div className="font-sans font-medium text-[12.5px] text-primary-200">
          {booking.vehicle.businessName} · {booking.date} · {booking.startTime} – 14:00
        </div>
        <div className="flex gap-2 mt-3.5">
          <div className="flex-1 bg-white/8 rounded-[10px] p-2.5">
            <div className="font-sans font-semibold text-[9.5px] tracking-[.08em] text-primary-300 uppercase">Booked</div>
            <div className="font-display font-bold text-[15px] text-white mt-1.5">{booking.endHours} hrs</div>
          </div>
          <div className="flex-1 bg-white/8 rounded-[10px] p-2.5">
            <div className="font-sans font-semibold text-[9.5px] tracking-[.08em] text-primary-300 uppercase">Elapsed</div>
            <div className="font-display font-bold text-[15px] text-white mt-1.5">3h 12m</div>
          </div>
          <div className="flex-1 bg-[rgba(217,185,106,.16)] rounded-[10px] p-2.5">
            <div className="font-sans font-semibold text-[9.5px] tracking-[.08em] text-gold uppercase">Overstay</div>
            <div className="font-display font-bold text-[15px] text-gold mt-1.5">None</div>
          </div>
        </div>
      </div>

      {booking.pilotName ? (
        <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 flex items-center gap-3 mb-4.5">
          <InitialsAvatar initials={initials(booking.pilotName)} tone="light" />
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[15px]">{booking.pilotName}</span>
            <span className="block font-sans font-medium text-xs text-muted mt-0.5">
              Your pilot · ★ {booking.pilotRating} · verified
            </span>
          </span>
          <button
            type="button"
            className="w-11 h-11 rounded-[11px] border-[1.5px] border-border grid place-items-center shrink-0"
            aria-label="Call pilot"
          >
            <HiOutlinePhone size={18} />
          </button>
        </div>
      ) : null}

      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-3">
        Booking timeline
      </div>
      <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 pt-4 mb-4.5">
        {TIMELINE.map((step, i) => (
          <div key={step.t} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <span
                className={`w-3.5 h-3.5 rounded-full border-[2.5px] ${
                  step.current
                    ? "bg-gold border-gold"
                    : step.done
                    ? "bg-primary border-primary"
                    : "bg-white border-border"
                }`}
              />
              {i < TIMELINE.length - 1 ? (
                <span className={`w-0.5 flex-1 min-h-5 ${step.done ? "bg-primary" : "bg-border"}`} />
              ) : null}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-baseline gap-2">
                <span className="flex-1 font-sans font-semibold text-[13.5px]">{step.t}</span>
                <span className="font-sans font-semibold text-[11px] text-muted shrink-0">{step.when}</span>
              </div>
              <div className="font-sans font-medium text-xs text-muted mt-0.5">{step.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4.5">
        <button
          type="button"
          onClick={() => navigate(`/premium/booking/${booking.id}/inspection`)}
          className="flex-1 h-12 rounded-btn border-[1.5px] border-[#E6E2D6] bg-white font-sans font-bold text-[13.5px] hover:border-gold transition-colors"
        >
          Inspection
        </button>
        <button
          type="button"
          onClick={() => navigate(`/premium/booking/${booking.id}/refund`)}
          className="flex-1 h-12 rounded-btn border-[1.5px] border-[#E6E2D6] bg-white font-sans font-bold text-[13.5px] hover:border-gold transition-colors"
        >
          Deposit
        </button>
        <button
          type="button"
          onClick={() => navigate("/premium/policy")}
          className="flex-1 h-12 rounded-btn border-[1.5px] border-[#E6E2D6] bg-white font-sans font-bold text-[13.5px] hover:border-gold transition-colors"
        >
          Policy
        </button>
      </div>

      <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5">
        <div className="font-sans font-bold text-[11px] tracking-[.1em] text-muted uppercase mb-3">
          What you paid
        </div>
        <Row label="Premium Ride" value={formatNaira(booking.tier.price)} />
        <Row label="Protection deposit" value={`${formatNaira(booking.deposit)} held`} />
        <Row label="Service charge" value={formatNaira(booking.serviceFee)} />
        <div className="flex justify-between pt-2.5 mt-1.5 border-t border-[#F5F2E8]">
          <span className="font-sans font-bold text-sm">Total</span>
          <span className="font-display font-bold text-[17px] tabular-nums">{formatNaira(booking.total)}</span>
        </div>
      </div>
    </div>
  );
}
