import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { FaStar } from "react-icons/fa6";
import { HiCheckBadge } from "react-icons/hi2";
import { premiumService } from "@/services/api/premiumService";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton";
import type { PremiumVehicle } from "@/services/api/types";

const AVAIL_STYLES: Record<PremiumVehicle["availability"], string> = {
  available: "bg-success-tint text-success-strong",
  limited: "bg-warning-tint text-warning-strong",
  booked: "bg-error-tint text-error-strong",
};
const AVAIL_LABEL: Record<PremiumVehicle["availability"], string> = {
  available: "Available",
  limited: "Limited",
  booked: "Booked out",
};

export default function PremiumMarketScreen() {
  const navigate = useNavigate();
  const setVehicle = usePremiumStore((s) => s.setVehicle);
  const [vehicles, setVehicles] = useState<PremiumVehicle[] | null>(null);

  useEffect(() => {
    premiumService.getVehicles().then(setVehicles);
  }, []);

  function openVehicle(v: PremiumVehicle) {
    setVehicle(v);
    navigate(`/premium/vehicle/${v.id}`);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF]">
      <div className="bg-primary p-3.5 pb-4.5">
        <div className="bg-white/7 border border-[rgba(217,185,106,.28)] rounded-card p-3">
          <button
            type="button"
            onClick={() => navigate("/premium/filters")}
            className="w-full h-11 rounded-[10px] bg-white flex items-center gap-2 px-3 text-left mb-2"
          >
            <HiOutlineSearch size={16} className="text-primary" />
            <span className="font-sans font-semibold text-sm text-text-2">
              Search vehicle or business
            </span>
          </button>
          <div className="flex gap-2">
            {["Date", "Start", "Duration"].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate("/premium/calendar")}
                className={`flex-1 h-11 rounded-[10px] flex flex-col justify-center px-2.5 text-left ${
                  i === 2 ? "bg-[rgba(217,185,106,.18)]" : "bg-white/10"
                }`}
              >
                <span className={`font-sans font-bold text-[8.5px] tracking-[.1em] ${i === 2 ? "text-gold" : "text-primary-300"} uppercase`}>
                  {label}
                </span>
                <span className="font-sans font-semibold text-xs text-white mt-1">
                  {i === 0 ? "Sat 13 Sep" : i === 1 ? "08:00" : "6 hours"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4.5 pt-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/premium/filters")}
          className="h-9.5 px-3.5 rounded-pill bg-primary text-white font-sans font-semibold text-xs flex items-center gap-1.5 shrink-0"
        >
          <HiAdjustmentsHorizontal size={14} className="text-gold" />
          Filters
        </button>
        <span className="flex-1 font-sans font-medium text-xs text-muted">
          {vehicles ? `${vehicles.length} vehicles · 2 verified businesses` : "Loading vehicles…"}
        </span>
      </div>

      <div className="px-4.5 py-3.5 flex flex-col gap-3.5">
        {vehicles === null
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => openVehicle(v)}
                className="bg-white border border-[#E6E2D6] rounded-[18px] overflow-hidden text-left hover:border-gold hover:-translate-y-0.5 transition-all"
              >
                <div className="h-[150px] relative bg-[#EDEBE4] grid place-items-center">
                  <span className="absolute top-2.5 left-2.5 font-sans font-bold text-[9.5px] tracking-[.08em] px-2.5 py-1.5 rounded-md bg-[rgba(0,48,40,.92)] text-gold uppercase">
                    {v.type}
                  </span>
                  <span
                    className={`absolute top-2.5 right-2.5 font-sans font-bold text-[10px] px-2.5 py-1.5 rounded-md ${AVAIL_STYLES[v.availability]}`}
                  >
                    {AVAIL_LABEL[v.availability]}
                  </span>
                  <span className="font-display font-bold text-muted-2 text-sm">{v.name}</span>
                </div>
                <div className="p-3.5">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-base tracking-[-.01em]">
                        {v.name}
                      </span>
                      <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                        {v.brand}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <FaStar size={13} className="text-warning" />
                      <span className="font-display font-bold text-[12.5px] tabular-nums">{v.rating}</span>
                      <span className="font-sans font-medium text-[11.5px] text-muted">({v.reviews})</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2.5 border-t border-[#F0EDE3] mb-3">
                    <span className="w-6.5 h-6.5 rounded-full bg-primary-100 grid place-items-center font-display font-bold text-[9.5px] text-primary shrink-0">
                      {v.businessName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    <span className="font-sans font-semibold text-[12.5px] text-text-2">
                      {v.businessName}
                    </span>
                    <HiCheckBadge size={14} className="text-success shrink-0" />
                    <span className="flex-1" />
                    <span className="font-sans font-medium text-xs text-muted">{v.location}</span>
                  </div>
                  <div className="flex items-end gap-2.5">
                    <span className="flex-1">
                      <span className="block font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">
                        From
                      </span>
                      <span className="block font-display font-bold text-xl mt-1 tabular-nums">
                        {formatNaira(v.fromPrice)}
                      </span>
                      <span className="block font-sans font-medium text-[11px] text-muted mt-1">
                        per 6 hours · {v.seats}
                      </span>
                    </span>
                    <span className="h-[42px] px-4 rounded-[11px] bg-primary text-white font-sans font-bold text-[13px] flex items-center shrink-0">
                      View vehicle
                    </span>
                  </div>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}
