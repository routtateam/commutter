import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { usePremiumStore } from "@/store/premiumStore";
import { cn } from "@/lib/utils";

const BOOKED = new Set([5, 6, 14, 21, 22]);
const BLOCKED = new Set([1, 2, 3]);

export default function PremiumCalendarScreen() {
  const navigate = useNavigate();
  const vehicle = usePremiumStore((s) => s.draft.vehicle);
  const setDateTime = usePremiumStore((s) => s.setDateTime);
  const [selected, setSelected] = useState(13);

  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

  function confirm() {
    setDateTime(`Sat ${selected} Sep`, "08:00");
    navigate("/premium/duration");
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <ScreenHeader title="Availability" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-4.5">
        <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2 mb-4.5">
          Availability for the <strong className="font-bold">{vehicle?.name ?? "vehicle"}</strong>.
          Booked days cannot be selected.
        </p>
        <div className="flex items-center gap-3 mb-3.5">
          <span className="font-display font-bold text-base">September 2026</span>
          <span className="flex-1" />
          <button type="button" className="w-8.5 h-8.5 rounded-lg border border-border grid place-items-center">
            <HiChevronLeft size={15} />
          </button>
          <button type="button" className="w-8.5 h-8.5 rounded-lg border border-border grid place-items-center">
            <HiChevronRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="font-sans font-bold text-[10.5px] text-muted-2 text-center">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const booked = BOOKED.has(d);
            const blocked = BLOCKED.has(d);
            const isSelected = d === selected;
            return (
              <button
                key={d}
                type="button"
                disabled={booked || blocked}
                onClick={() => setSelected(d)}
                className={cn(
                  "aspect-square rounded-lg border-[1.5px] flex flex-col items-center justify-center gap-1",
                  isSelected && "bg-primary border-primary",
                  !isSelected && booked && "bg-error-tint border-transparent",
                  !isSelected && blocked && "bg-bg border-transparent",
                  !isSelected && !booked && !blocked && "bg-white border-border"
                )}
              >
                <span
                  className={cn(
                    "font-display font-semibold text-[13px]",
                    isSelected ? "text-white" : booked ? "text-error-strong" : blocked ? "text-muted" : "text-text"
                  )}
                >
                  {d}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3.5 py-4.5">
          <Legend color="bg-white border border-border" label="Available" />
          <Legend color="bg-error-tint" label="Booked" />
          <Legend color="bg-bg" label="Blocked by business" />
          <Legend color="bg-primary" label="Your selection" />
        </div>
      </div>
      <div className="p-4.5 border-t border-border flex items-center gap-3.5">
        <div>
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">Selected</div>
          <div className="font-sans font-semibold text-[14.5px] mt-1.5">Sat {selected} Sep · 08:00</div>
        </div>
        <span className="flex-1" />
        <Button onClick={confirm}>Continue</Button>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2.5 h-2.5 rounded-sm", color)} />
      <span className="font-sans font-medium text-xs text-text-2">{label}</span>
    </span>
  );
}
