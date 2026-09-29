import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBell, HiOutlineMapPin } from "react-icons/hi2";
import { PiCrosshairSimple } from "react-icons/pi";
import { HiOutlineSearch } from "react-icons/hi";
import { RiVipCrownFill } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { InitialsAvatar } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useRideStore } from "@/store/rideStore";
import { useGeoStore } from "@/store/geoStore";
import { HOME_PLACE, WORK_PLACE, placesService } from "@/services/api/placesService";
import type { Place } from "@/services/api/types";

export default function HomeScreen() {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const setDestination = useRideStore((s) => s.setDestination);
  const setPickup = useRideStore((s) => s.setPickup);
  const pickupLabel = useRideStore((s) => s.draft.pickup.subtitle);
  const [recents, setRecents] = useState<Place[]>([]);
  const coords = useGeoStore((s) => s.coords);
  const permission = useGeoStore((s) => s.permission);
  const geoLoading = useGeoStore((s) => s.loading);
  const requestLocation = useGeoStore((s) => s.requestLocation);
  const checkPermission = useGeoStore((s) => s.checkPermission);

  useEffect(() => {
    placesService.getSavedPlaces().then((res) => setRecents(res.recents.slice(0, 2)));
  }, []);

  // If the LocationPermissionScreen already granted access, pick up the live
  // fix here (without re-prompting) and try to resolve it to a real pickup
  // Place via the backend's reverse-geocode. If no fix or no nearby known
  // place, the pulsing pin below just shows the Lagos default and the
  // booking draft keeps its HOME_PLACE fallback.
  useEffect(() => {
    (async () => {
      const perm = permission === "unknown" ? await checkPermission() : permission;
      if (perm !== "granted" || coords) return;
      const fix = await requestLocation();
      if (!fix) return;
      const place = await placesService.reverse(fix.lat, fix.lng);
      if (place) setPickup(place);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  async function recenter() {
    const fix = await requestLocation();
    if (!fix) return;
    const place = await placesService.reverse(fix.lat, fix.lng);
    if (place) setPickup(place);
  }

  function goToPlace(place: Place) {
    setDestination(place);
    navigate("/category");
  }

  const name = profile?.firstName ?? "there";

  return (
    <div className="relative flex-1">
      <RouttaMap pickup={coords} showRoute={false} showDest={false} pulse className="rounded-none" />

      <div className="absolute top-13 left-4 right-4 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="shadow-[0_2px_10px_rgba(18,33,29,.22)] rounded-full"
        >
          <InitialsAvatar initials={initials(profile ? `${profile.firstName} ${profile.lastName}` : "AN")} />
        </button>
        <div className="flex-1 h-[46px] rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.14)] flex items-center px-3.5 gap-2">
          <HiOutlineMapPin className="text-success shrink-0" size={16} />
          <span className="flex-1 font-sans font-semibold text-[13px] truncate">
            {pickupLabel}
          </span>
          <span className="font-sans font-bold text-[10px] tracking-[.06em] text-muted">PICKUP</span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="w-[46px] h-[46px] rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.14)] grid place-items-center relative shrink-0"
        >
          <HiOutlineBell size={20} />
          <span className="absolute top-2.5 right-2.5 w-[9px] h-[9px] rounded-full bg-error border-2 border-white" />
        </button>
      </div>

      <button
        type="button"
        onClick={recenter}
        disabled={geoLoading}
        className="absolute right-4 bottom-[330px] w-[46px] h-[46px] rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.18)] grid place-items-center disabled:opacity-60"
        aria-label="Recentre"
      >
        <PiCrosshairSimple size={20} className={"text-primary" + (geoLoading ? " animate-pulse" : "")} />
      </button>

      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5 max-h-[62%] overflow-y-auto no-scrollbar">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3.5" />
        <h2 className="font-display font-bold text-[21px] tracking-[-.01em] mb-3">
          Where to, {name}?
        </h2>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="w-full h-[54px] rounded-btn bg-bg border-[1.5px] border-[#E8EBE7] flex items-center gap-2.5 px-3.5 text-left hover:border-primary transition-colors mb-3"
        >
          <HiOutlineSearch size={18} className="text-muted" />
          <span className="flex-1 font-sans font-semibold text-[15px] text-muted">
            Enter your destination
          </span>
          <span className="font-sans font-bold text-[11px] tracking-[.06em] text-primary-600 bg-primary-100 px-2 py-1.5 rounded-md">
            MAP
          </span>
        </button>

        <div className="flex gap-2 mb-3.5 overflow-hidden">
          <button
            type="button"
            onClick={() => goToPlace(HOME_PLACE)}
            className="font-sans font-semibold text-[13px] px-3.5 py-2.5 rounded-pill bg-primary text-white flex items-center gap-1.5 shrink-0"
          >
            <HiOutlineMapPin size={14} className="text-accent" />
            Home
          </button>
          <button
            type="button"
            onClick={() => goToPlace(WORK_PLACE)}
            className="font-sans font-semibold text-[13px] px-3.5 py-2.5 rounded-pill bg-white border-[1.5px] border-border shrink-0 hover:border-primary transition-colors"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => navigate("/saved-places")}
            className="font-sans font-semibold text-[13px] px-3.5 py-2.5 rounded-pill bg-white border-[1.5px] border-border shrink-0 text-text-2 hover:border-primary transition-colors"
          >
            Saved · 5
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/premium")}
          className="w-full bg-primary rounded-card p-3.5 flex items-center gap-3 text-left mb-1 hover:-translate-y-0.5 transition-transform"
        >
          <span className="w-[42px] h-[42px] rounded-[11px] bg-[rgba(217,185,106,.16)] grid place-items-center shrink-0">
            <RiVipCrownFill size={20} className="text-gold" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="font-sans font-bold text-[9.5px] tracking-[.14em] text-gold">
                PREMIUM RIDE
              </span>
              <span className="font-sans font-bold text-[8.5px] tracking-[.06em] px-1.5 py-0.5 rounded bg-[rgba(217,185,106,.18)] text-gold-strong">
                NEW
              </span>
            </span>
            <span className="block font-sans font-semibold text-sm text-white mt-1">
              Book a premium vehicle by the hour
            </span>
          </span>
          <HiArrowRight className="text-gold shrink-0" size={18} />
        </button>

        <div className="flex flex-col">
          {recents.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goToPlace(r)}
              className="flex items-center gap-3 py-2.5 px-1 text-left border-t border-[#F0F2EF] hover:bg-raised transition-colors"
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
          ))}
        </div>
      </div>
    </div>
  );
}
