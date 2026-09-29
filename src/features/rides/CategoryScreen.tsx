import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { CategoryBadge } from "@/components/CategoryIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { rideService } from "@/services/api/rideService";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";
import type { CategoryQuote } from "@/services/api/types";

export default function CategoryScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const setCategory = useRideStore((s) => s.setCategory);
  const [quotes, setQuotes] = useState<CategoryQuote[] | null>(null);

  useEffect(() => {
    if (!draft.destination) {
      navigate("/search", { replace: true });
      return;
    }
    rideService.getCategoryQuotes(draft.pickup, draft.destination).then(setQuotes);
  }, [draft.destination, draft.pickup, navigate]);

  function pick(quote: CategoryQuote) {
    setCategory(quote.category, quote);
    if (quote.category === "bus" || quote.category === "van") {
      navigate("/category/capacity");
    } else {
      navigate("/summary");
    }
  }

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
      <div className="absolute top-13 left-18 right-4 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.14)] flex items-center px-3.5 gap-2">
        <span className="w-2 h-2 rounded-sm bg-primary shrink-0" />
        <span className="flex-1 min-w-0 font-sans font-semibold text-[13px] truncate">
          {draft.destination?.label}
        </span>
        <span className="font-display font-bold text-[11px] text-muted">18.4 km</span>
      </div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5.5">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3" />
        <ProgressSteps total={3} current={0} label="STEP 1 · VEHICLE" />
        <h2 className="font-sans font-bold text-[19px] mb-3">How are you moving?</h2>
        <div className="flex flex-col gap-2 max-h-[330px] overflow-y-auto">
          {quotes
            ? quotes.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => pick(c)}
                  className="flex items-center gap-3 p-3.5 rounded-card border-[1.5px] border-border bg-white text-left hover:border-primary hover:bg-[#FAFCFB] transition-colors"
                >
                  <CategoryBadge category={c.category} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-sans font-semibold text-[15.5px]">{c.name}</span>
                    <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
                      {c.description} · {c.etaMinutes} min away
                    </span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block font-display font-bold text-[16.5px] tabular-nums">
                      {formatNaira(c.fare)}
                    </span>
                    <span className="block font-sans font-medium text-[11px] text-muted mt-0.5">
                      {c.rate}
                    </span>
                  </span>
                </button>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-card border-[1.5px] border-border">
                  <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
