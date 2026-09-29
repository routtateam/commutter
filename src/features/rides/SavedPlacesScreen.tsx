import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineBriefcase, HiPlus, HiChevronRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { placesService, HOME_PLACE, WORK_PLACE } from "@/services/api/placesService";
import { useRideStore } from "@/store/rideStore";
import type { Place } from "@/services/api/types";

export default function SavedPlacesScreen() {
  const navigate = useNavigate();
  const setDestination = useRideStore((s) => s.setDestination);
  const [recents, setRecents] = useState<Place[]>([]);

  useEffect(() => {
    placesService.getSavedPlaces().then((res) => setRecents(res.recents));
  }, []);

  function choose(place: Place) {
    setDestination(place);
    navigate("/category");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Saved places" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <div className="bg-white border border-border rounded-card overflow-hidden mb-3.5">
          <button
            type="button"
            onClick={() => choose(HOME_PLACE)}
            className="w-full flex items-center gap-3 px-3.5 py-4 text-left hover:bg-raised transition-colors"
          >
            <span className="w-[42px] h-[42px] rounded-[11px] bg-primary-100 grid place-items-center shrink-0">
              <HiOutlineHome size={19} className="text-primary" />
            </span>
            <span className="flex-1">
              <span className="block font-sans font-semibold text-[15px]">Home</span>
              <span className="block font-sans font-medium text-[12.5px] text-muted">
                {HOME_PLACE.subtitle}
              </span>
            </span>
            <HiChevronRight size={18} className="text-border-strong" />
          </button>
          <div className="h-px bg-[#F0F2EF] mx-3.5" />
          <button
            type="button"
            onClick={() => choose(WORK_PLACE)}
            className="w-full flex items-center gap-3 px-3.5 py-4 text-left hover:bg-raised transition-colors"
          >
            <span className="w-[42px] h-[42px] rounded-[11px] bg-primary-100 grid place-items-center shrink-0">
              <HiOutlineBriefcase size={19} className="text-primary" />
            </span>
            <span className="flex-1">
              <span className="block font-sans font-semibold text-[15px]">Work</span>
              <span className="block font-sans font-medium text-[12.5px] text-muted">
                {WORK_PLACE.subtitle}
              </span>
            </span>
            <HiChevronRight size={18} className="text-border-strong" />
          </button>
          <div className="h-px bg-[#F0F2EF] mx-3.5" />
          <button
            type="button"
            onClick={() => navigate("/saved-places/new/edit")}
            className="w-full flex items-center gap-3 px-3.5 py-4 text-left hover:bg-raised transition-colors"
          >
            <span className="w-[42px] h-[42px] rounded-[11px] border-[1.5px] border-dashed border-border-strong grid place-items-center shrink-0">
              <HiPlus size={19} className="text-primary-600" />
            </span>
            <span className="font-sans font-bold text-[14.5px] text-primary-600">Add a saved place</span>
          </button>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Recent
        </div>
        <div className="bg-white border border-border rounded-card overflow-hidden">
          {recents.map((r, i) => (
            <div key={r.id}>
              {i > 0 ? <div className="h-px bg-[#F5F6F3] mx-3.5" /> : null}
              <button
                type="button"
                onClick={() => choose(r)}
                className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left hover:bg-raised transition-colors"
              >
                <span className="w-[38px] h-[38px] rounded-full bg-bg grid place-items-center shrink-0">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#43524D" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5V12l3.5 2" />
                  </svg>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-sans font-semibold text-[14.5px] truncate">{r.label}</span>
                  <span className="block font-sans font-medium text-[12.5px] text-muted truncate">
                    {r.subtitle}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
