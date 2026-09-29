import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { supportService } from "@/services/api/supportService";
import { useUiStore } from "@/store/uiStore";

const REASONS = [
  "I was overcharged",
  "The route was unnecessarily long",
  "Vehicle did not match the app",
  "Something about my safety",
];

export default function ReportScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const tripId = (location.state as { tripId?: string } | null)?.tripId ?? "RT-4471";
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await supportService.submitReport({ tripId, reason, details });
      pushToast(`Report submitted · ${res.id}`, "success");
      navigate("/help/disputes");
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not submit your report", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <ScreenHeader title="Report an issue" />
      <div className="px-4.5 pt-4.5 flex-1 flex flex-col">
        <div className="bg-bg rounded-2xl p-3.5 flex items-center gap-3 mb-5">
          <span className="w-10 h-10 rounded-[10px] bg-white grid place-items-center shrink-0 font-display font-bold text-[9.5px] text-primary">
            CAR
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-sans font-semibold text-[14px]">Ikeja City Mall · 8 Sep, 10:24</span>
            <span className="block font-sans font-medium text-xs text-muted mt-0.5">
              ₦2,450 · Chinedu Okafor · {tripId}
            </span>
          </span>
        </div>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          What went wrong?
        </div>
        <div className="flex flex-col gap-2 mb-4.5">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={`flex items-center gap-2.5 p-3.5 rounded-btn border-[1.5px] text-left ${
                reason === r ? "border-primary bg-[#F7FBF9]" : "border-border hover:border-primary"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full grid place-items-center shrink-0 ${
                  reason === r ? "bg-primary" : "border-2 border-border-strong"
                }`}
              >
                {reason === r ? <span className="w-2 h-2 rounded-full bg-accent" /> : null}
              </span>
              <span className="font-sans font-semibold text-[14.5px]">{r}</span>
            </button>
          ))}
        </div>
        <div className="font-sans font-semibold text-[12.5px] mb-1.5">Tell us what happened</div>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add as much detail as you can…"
          className="border-[1.5px] border-border rounded-btn p-3.5 min-h-[96px] font-sans font-medium text-sm outline-none focus:border-primary mb-3"
        />
        <button type="button" className="flex items-center gap-2.5 py-3.5 text-left">
          <HiOutlinePaperClip size={18} className="text-primary-600" />
          <span className="font-sans font-bold text-[13.5px] text-primary-600">Attach a screenshot</span>
        </button>
        <span className="flex-1" />
        <Button onClick={submit} loading={loading} className="my-2 mb-6.5">
          Submit report
        </Button>
      </div>
    </div>
  );
}
