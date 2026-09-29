import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { rideService } from "@/services/api/rideService";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";
import type { CapacityOption } from "@/services/api/types";

export default function CapacityScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const setCapacityOption = useRideStore((s) => s.setCapacityOption);
  const [options, setOptions] = useState<CapacityOption[]>([]);

  useEffect(() => {
    if (!draft.category) {
      navigate("/category", { replace: true });
      return;
    }
    rideService.getCapacityOptions(draft.category).then(setOptions);
  }, [draft.category, navigate]);

  function pick(option: CapacityOption) {
    setCapacityOption(option.id, option.fare);
    navigate("/summary");
  }

  const isBus = draft.category === "bus";
  const title = isBus ? "Select a bus size" : "How much are you moving?";
  const hint = isBus
    ? "Bigger vehicles cost more but fit your whole group."
    : "Choose the tonnage closest to your load.";
  const label = isBus ? "STEP 2 · SEATING" : "STEP 2 · TONNAGE";

  return (
    <div className="relative flex-1">
      <RouttaMap pickup={draft.pickup} destination={draft.destination} showRoute showPickup showDest />
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-13 left-4 w-11 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.18)] grid place-items-center"
      >
        <HiArrowLeft size={20} />
      </button>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5.5">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3" />
        <ProgressSteps total={3} current={1} label={label} />
        <h2 className="font-sans font-bold text-[19px] mb-1">{title}</h2>
        <p className="font-sans font-medium text-[13px] text-muted mb-3.5">{hint}</p>
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
          {options.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pick(c)}
              className="flex items-center gap-3 p-3.5 rounded-card border-[1.5px] border-border bg-white text-left hover:border-primary hover:bg-[#FAFCFB] transition-colors"
            >
              <span className="w-[22px] h-[22px] rounded-full border-2 border-border-strong shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block font-sans font-semibold text-[15.5px]">{c.label}</span>
                <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
                  {c.description}
                </span>
              </span>
              <span className="font-display font-bold text-base tabular-nums shrink-0">
                {formatNaira(c.fare)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
