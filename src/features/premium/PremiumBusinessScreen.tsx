import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { premiumService } from "@/services/api/premiumService";
import { usePremiumStore } from "@/store/premiumStore";
import { formatNaira } from "@/lib/utils";
import type { PremiumBusiness, PremiumVehicle } from "@/services/api/types";

export default function PremiumBusinessScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const setVehicle = usePremiumStore((s) => s.setVehicle);
  const [business, setBusiness] = useState<PremiumBusiness | null>(null);
  const [vehicles, setVehicles] = useState<PremiumVehicle[]>([]);

  useEffect(() => {
    premiumService.getBusiness(id).then((b) => setBusiness(b ?? null));
    premiumService.getVehicles().then((all) => setVehicles(all.filter((v) => v.businessId === id)));
  }, [id]);

  if (!business) return null;

  function openVehicle(v: PremiumVehicle) {
    setVehicle(v);
    navigate(`/premium/vehicle/${v.id}`);
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F7F5EF] overflow-y-auto">
      <ScreenHeader title={business.name} className="bg-primary border-none [&_*]:text-white" />
      <div className="bg-primary px-4.5 pb-5.5">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-14 h-14 rounded-full bg-[rgba(217,185,106,.18)] grid place-items-center font-display font-bold text-[17px] text-gold shrink-0">
            {business.initials}
          </span>
          <span className="flex-1">
            <span className="flex items-center gap-1.5">
              <span className="font-display font-bold text-[19px] text-white">{business.name}</span>
              <HiCheckBadge className="text-accent" size={17} />
            </span>
            <span className="block font-sans font-medium text-[12.5px] text-primary-200 mt-1">
              {business.location} · verified since {business.verifiedSince}
            </span>
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/8 rounded-[11px] p-2.5">
            <div className="font-display font-bold text-[18px] text-gold">{business.rating}</div>
            <div className="font-sans font-semibold text-[10px] tracking-[.06em] text-primary-300 mt-1.5 uppercase">
              Rating
            </div>
          </div>
          <div className="flex-1 bg-white/8 rounded-[11px] p-2.5">
            <div className="font-display font-bold text-[18px] text-white">{business.vehicleCount}</div>
            <div className="font-sans font-semibold text-[10px] tracking-[.06em] text-primary-300 mt-1.5 uppercase">
              Vehicles
            </div>
          </div>
          <div className="flex-1 bg-white/8 rounded-[11px] p-2.5">
            <div className="font-display font-bold text-[18px] text-white">{business.rentalCount}</div>
            <div className="font-sans font-semibold text-[10px] tracking-[.06em] text-primary-300 mt-1.5 uppercase">
              Rentals
            </div>
          </div>
        </div>
      </div>
      <div className="p-4.5">
        <div className="bg-success-tint rounded-xl p-3.5 flex gap-2.5 mb-5">
          <HiCheckBadge className="text-success-strong shrink-0 mt-0.5" size={17} />
          <div>
            <div className="font-sans font-bold text-[13px] text-success-strong">Verified by Routta</div>
            <div className="font-sans font-medium text-[12.5px] text-success-strong/80 mt-0.5">
              Business registration, owner NIN, bank account and every listed vehicle have been
              checked.
            </div>
          </div>
        </div>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          About
        </div>
        <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2 mb-5.5">
          {business.about}
        </p>
        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Vehicles from this business
        </div>
        <div className="flex flex-col gap-2.5">
          {vehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => openVehicle(v)}
              className="bg-white border border-[#E6E2D6] rounded-2xl p-2.5 flex items-center gap-3 text-left hover:border-gold transition-colors"
            >
              <span className="w-18.5 h-14 rounded-lg bg-[#EDEBE4] shrink-0 grid place-items-center font-display font-bold text-[10px] text-muted-2">
                {v.type}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-sans font-semibold text-sm truncate">{v.name}</span>
                <span className="block font-sans font-medium text-[11.5px] text-muted mt-0.5">
                  {v.type} · {v.seats}
                </span>
                <span className="block font-display font-bold text-[13px] mt-1.5">
                  From {formatNaira(v.fromPrice)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
