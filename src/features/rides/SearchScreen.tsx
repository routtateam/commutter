import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMagnifyingGlass, HiOutlineMapPin, HiXMark } from "react-icons/hi2";
import { placesService, HOME_PLACE } from "@/services/api/placesService";
import { useRideStore } from "@/store/rideStore";
import type { Place } from "@/services/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SearchScreen() {
  const navigate = useNavigate();
  const setDestination = useRideStore((s) => s.setDestination);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const t = setTimeout(() => {
      placesService
        .search(query)
        .then((res) => {
          if (active) setResults(res);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 350);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  function choose(place: Place) {
    setDestination(place);
    navigate("/category");
  }

  const showEmpty = !loading && query.trim().length > 0 && results.length === 0;

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="px-4.5 pt-3.5 pb-3 border-b border-[#F0F2EF]">
        <div className="flex gap-2.5">
          <div className="flex flex-col items-center pt-4 gap-1 shrink-0">
            <span className="w-[9px] h-[9px] rounded-full border-[2.5px] border-primary" />
            <span className="w-px flex-1 bg-border rounded-sm" />
            <span className="w-[9px] h-[9px] rounded-sm bg-primary" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-12 rounded-[11px] bg-bg flex items-center px-3.5 font-sans font-medium text-[14.5px] text-text-2">
              {HOME_PLACE.subtitle}
            </div>
            <div className="h-12 rounded-[11px] border-[1.5px] border-primary flex items-center px-3.5 gap-2 shadow-[0_0_0_3px_rgba(0,48,40,.09)]">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to?"
                className="flex-1 min-w-0 font-sans font-semibold text-[14.5px] outline-none"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear">
                  <HiXMark size={16} className="text-muted" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 pt-1.5">
        {loading ? (
          <div className="flex flex-col">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3.5">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 rounded-full bg-bg grid place-items-center mb-4">
              <HiOutlineMagnifyingGlass size={28} className="text-muted" />
            </div>
            <div className="font-sans font-bold text-[17px] mb-1.5">No places match that</div>
            <p className="font-sans font-medium text-[13.5px] leading-relaxed text-muted mb-5 max-w-[26ch]">
              Check the spelling, or drop the pin on the map and we will work out the address.
            </p>
            <Button size="sm" onClick={() => choose({ ...HOME_PLACE, id: "pin", label: "Dropped pin", subtitle: "Map location" })}>
              Set pin on map
            </Button>
          </div>
        ) : (
          <>
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => choose(r)}
                className="w-full flex items-center gap-3 py-3.5 text-left border-b border-bg hover:bg-raised transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-primary-100 grid place-items-center shrink-0">
                  <HiOutlineMapPin size={18} className="text-primary-600" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-sans font-semibold text-[14.5px] truncate">{r.label}</span>
                  <span className="block font-sans font-medium text-[12.5px] text-muted truncate">
                    {r.subtitle}
                  </span>
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => choose({ ...HOME_PLACE, id: "pin", label: "Dropped pin", subtitle: "Map location" })}
              className="w-full flex items-center gap-2.5 py-4 text-left"
            >
              <HiOutlineMapPin size={18} className="text-primary-600" />
              <span className="font-sans font-bold text-sm text-primary-600">
                Set the pin on the map instead
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
