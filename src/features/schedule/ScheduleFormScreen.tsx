import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryIcon";
import { useRideStore } from "@/store/rideStore";
import { historyService } from "@/services/api/historyService";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WINDOWS = ["07:30 AM", "08:00 AM", "08:30 AM"];

/** The next four days starting tomorrow (the backend needs >= 10 minutes' notice). */
function upcomingDays() {
  return [1, 2, 3, 4].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    d.setHours(0, 0, 0, 0);
    return { date: d, label: WEEKDAYS[d.getDay()], num: String(d.getDate()), month: MONTHS[d.getMonth()] };
  });
}

/** "07:30 AM" on a given day -> ISO instant in the user's local timezone. */
function toInstant(day: Date, window: string): string {
  const [time, meridiem] = window.split(" ");
  const [h, m] = time.split(":").map(Number);
  const d = new Date(day);
  d.setHours((h % 12) + (meridiem === "PM" ? 12 : 0), m, 0, 0);
  return d.toISOString();
}

export default function ScheduleFormScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const pushToast = useUiStore((s) => s.pushToast);
  const DAYS = useMemo(upcomingDays, []);
  const [dayIdx, setDayIdx] = useState(0);
  const [windowIdx, setWindowIdx] = useState(0);
  const [repeats, setRepeats] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!draft.destination || !draft.category) navigate("/category", { replace: true });
  }, [draft.destination, draft.category, navigate]);

  if (!draft.destination || !draft.category) return null;

  async function confirm() {
    setLoading(true);
    try {
      await historyService.scheduleRide({
        pickup: draft.pickup,
        destination: draft.destination!,
        category: draft.category!,
        date: `${DAYS[dayIdx].label} ${DAYS[dayIdx].num} ${DAYS[dayIdx].month}`,
        time: WINDOWS[windowIdx],
        scheduledFor: toInstant(DAYS[dayIdx].date, WINDOWS[windowIdx]),
        fare: draft.categoryQuote?.fare ?? 2450,
        repeats,
        promoCode: draft.promo?.code,
      });
      pushToast("Ride scheduled", "success");
      navigate("/scheduled");
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not schedule your ride", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto pt-4.5 px-4.5">
      <div className="flex bg-bg rounded-btn p-1 mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 font-sans font-semibold text-[13.5px] text-muted h-10"
        >
          Ride now
        </button>
        <div className="flex-1 h-10 rounded-[9px] bg-white shadow-[0_1px_2px_rgba(18,33,29,.09)] font-sans font-bold text-[13.5px] flex items-center justify-center">
          Ride later
        </div>
      </div>

      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        Pick a day
      </div>
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {DAYS.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setDayIdx(i)}
            className={cn(
              "shrink-0 w-[62px] py-3 rounded-xl text-center border-[1.5px]",
              i === dayIdx ? "bg-primary border-primary" : "border-border"
            )}
          >
            <div
              className={cn(
                "font-sans font-semibold text-[10.5px]",
                i === dayIdx ? "text-primary-300" : "text-muted"
              )}
            >
              {d.label}
            </div>
            <div
              className={cn(
                "font-display font-bold text-[19px] mt-1.5",
                i === dayIdx ? "text-white" : "text-text"
              )}
            >
              {d.num}
            </div>
          </button>
        ))}
      </div>

      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        Pickup window
      </div>
      <div className="flex gap-2 mb-2">
        {WINDOWS.map((w, i) => (
          <button
            key={w}
            type="button"
            onClick={() => setWindowIdx(i)}
            className={cn(
              "flex-1 h-[54px] rounded-btn border-[1.5px] flex items-center justify-center gap-2",
              i === windowIdx ? "border-primary bg-[#F7FBF9]" : "border-border text-text-2"
            )}
          >
            {i === windowIdx ? (
              <span className="font-display font-bold text-lg tabular-nums">{w.split(" ")[0]}</span>
            ) : (
              <span className="font-sans font-semibold text-sm">{w}</span>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mb-5">
        <HiOutlineInformationCircle size={14} className="text-info" />
        <span className="font-sans font-medium text-xs text-text-2">
          We match a Transporter 15 minutes before your window opens.
        </span>
      </div>

      <div className="border border-border rounded-card p-3.5 flex items-center gap-3 mb-3">
        <CategoryBadge category={draft.category} />
        <span className="flex-1">
          <span className="block font-sans font-semibold text-[15px]">
            {draft.categoryQuote?.name} · to {draft.destination.label}
          </span>
          <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
            fare locked at ₦{draft.categoryQuote?.fare.toLocaleString()}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3 p-3.5 border border-border rounded-card mb-5">
        <span className="flex-1">
          <span className="block font-sans font-semibold text-[14.5px]">Repeat every weekday</span>
          <span className="block font-sans font-medium text-xs text-muted mt-0.5">
            Mon–Fri at the same window
          </span>
        </span>
        <Switch checked={repeats} onCheckedChange={setRepeats} />
      </div>

      <Button onClick={confirm} loading={loading} className="mb-6.5">
        Schedule for {DAYS[dayIdx].label} {DAYS[dayIdx].num} {DAYS[dayIdx].month}, {WINDOWS[windowIdx].split(" ")[0]}
      </Button>
    </div>
  );
}
