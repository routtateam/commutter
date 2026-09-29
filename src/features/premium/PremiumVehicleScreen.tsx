import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { FaStar } from "react-icons/fa6";
import { HiChevronRight, HiOutlineShieldCheck, HiOutlineIdentification, HiOutlineDocumentText, HiOutlineCalendarDays } from "react-icons/hi2";
import { HiCheckBadge } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { premiumService } from "@/services/api/premiumService";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";
import type { PremiumVehicle } from "@/services/api/types";

export default function PremiumVehicleScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const setVehicle = usePremiumStore((s) => s.setVehicle);
  const [vehicle, setVehicleState] = useState<PremiumVehicle | null>(null);

  useEffect(() => {
    premiumService.getVehicle(id).then((v) => {
      if (v) {
        setVehicleState(v);
        setVehicle(v);
      }
    });
  }, [id, setVehicle]);

  if (!vehicle) return null;

  function bookNow() {
    navigate("/premium/duration");
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F7F5EF]">
      <ScreenHeader title={vehicle.name} className="bg-[#F7F5EF] border-none" />
      <div className="flex-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => navigate(`/premium/vehicle/${vehicle.id}/gallery`)}
          className="block w-full h-59 relative bg-[#EDEBE4] grid place-items-center"
        >
          <span className="font-display font-bold text-muted-2">{vehicle.name} — hero photo</span>
          <span className="absolute right-3 bottom-3 font-sans font-bold text-[11px] px-2.5 py-2 rounded-lg bg-[rgba(0,48,40,.92)] text-white">
            View all photos
          </span>
        </button>
        <div className="p-4.5">
          <div className="flex items-start gap-3 mb-1">
            <h1 className="flex-1 font-display font-bold text-2xl tracking-[-.02em]">{vehicle.name}</h1>
            <div className="flex items-center gap-1 shrink-0 pt-1">
              <FaStar size={15} className="text-warning" />
              <span className="font-display font-bold text-sm">{vehicle.rating}</span>
              <span className="font-sans font-medium text-xs text-muted">({vehicle.reviews})</span>
            </div>
          </div>
          <div className="font-sans font-medium text-[13.5px] text-muted mb-4">
            {vehicle.brand} · {vehicle.location}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/premium/business/${vehicle.businessId}`)}
            className="w-full bg-white border border-[#E6E2D6] rounded-2xl p-3.5 flex items-center gap-2.5 mb-4 hover:border-gold transition-colors"
          >
            <span className="w-11 h-11 rounded-full bg-primary grid place-items-center font-display font-bold text-[13px] text-gold shrink-0">
              {vehicle.businessName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="flex items-center gap-1.5">
                <span className="font-sans font-semibold text-[14.5px]">{vehicle.businessName}</span>
                <HiCheckBadge size={15} className="text-success" />
              </span>
              <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                Verified business · {vehicle.seats}
              </span>
            </span>
            <HiChevronRight size={18} className="text-border-strong shrink-0" />
          </button>

          <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
            Specifications
          </div>
          <div className="bg-white border border-[#E6E2D6] rounded-2xl px-3.5 mb-5">
            {vehicle.specs.map((sp, i) => (
              <div
                key={sp.key}
                className={`flex items-center justify-between py-2.5 ${i < vehicle.specs.length - 1 ? "border-b border-[#F5F2E8]" : ""}`}
              >
                <span className="font-sans font-medium text-[13px] text-muted">{sp.key}</span>
                <span className="font-sans font-semibold text-[13px]">{sp.value}</span>
              </div>
            ))}
          </div>

          <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
            Pricing tiers · set by the business
          </div>
          <div className="flex flex-col gap-2 mb-5">
            {vehicle.tiers.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#E6E2D6] rounded-xl p-3.5 flex items-center gap-3"
              >
                <span className="flex-1">
                  <span className="block font-sans font-semibold text-sm">{t.label}</span>
                  <span className="block font-sans font-medium text-[11.5px] text-muted mt-0.5">{t.sub}</span>
                </span>
                <span className="font-display font-bold text-base tabular-nums">{formatNaira(t.price)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E6E2D6] rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2.5">
              <HiOutlineShieldCheck size={18} />
              <span className="font-sans font-semibold text-sm">Protection &amp; insurance</span>
            </div>
            <p className="font-sans font-medium text-[12.5px] leading-relaxed text-text-2">
              Every Premium Ride is covered by the business&rsquo;s comprehensive policy for the
              rental window. A refundable protection deposit is held at checkout and released
              after inspection.
            </p>
          </div>
          <div className="bg-white border border-[#E6E2D6] rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2.5">
              <HiOutlineIdentification size={18} />
              <span className="font-sans font-semibold text-sm">Pilot included</span>
            </div>
            <p className="font-sans font-medium text-[12.5px] leading-relaxed text-text-2">
              {vehicle.businessName} supplies a vetted pilot with this vehicle. Self-drive is not
              offered on this listing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/premium/policy")}
            className="w-full bg-white border border-[#E6E2D6] rounded-2xl p-4 flex items-center gap-2.5 mb-3 text-left hover:border-gold transition-colors"
          >
            <HiOutlineDocumentText size={18} className="shrink-0" />
            <span className="flex-1">
              <span className="block font-sans font-semibold text-sm">
                Rental conditions &amp; refund policy
              </span>
              <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                Cancellation, overstay charges, mileage
              </span>
            </span>
            <HiChevronRight size={18} className="text-border-strong shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/premium/calendar")}
            className="w-full bg-white border border-[#E6E2D6] rounded-2xl p-4 flex items-center gap-2.5 text-left hover:border-gold transition-colors"
          >
            <HiOutlineCalendarDays size={18} className="shrink-0" />
            <span className="flex-1">
              <span className="block font-sans font-semibold text-sm">Check availability</span>
              <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                Next free: Sat 13 Sep
              </span>
            </span>
            <HiChevronRight size={18} className="text-border-strong shrink-0" />
          </button>
        </div>
      </div>
      <div className="p-4.5 border-t border-[#E6E2D6] bg-white flex items-center gap-3.5">
        <div className="shrink-0">
          <div className="font-sans font-bold text-[10px] tracking-[.08em] text-muted uppercase">From</div>
          <div className="font-display font-bold text-xl mt-1 tabular-nums">
            {formatNaira(vehicle.fromPrice)}
          </div>
        </div>
        <Button className="flex-1" onClick={bookNow}>
          Book Premium Ride
        </Button>
      </div>
    </div>
  );
}
