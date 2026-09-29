import { useNavigate } from "react-router-dom";
import { HiOutlineSignalSlash } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { InitialsAvatar } from "@/components/ui/avatar";
import { useRideStore } from "@/store/rideStore";

export default function OfflineScreen() {
  const navigate = useNavigate();
  // Cached "last known trip" — real coordinates when one exists, otherwise
  // RouttaMap falls back to the Lagos default center.
  const trip = useRideStore((s) => s.activeTrip ?? s.lastCompletedTrip);
  return (
    <div className="flex flex-1 flex-col bg-bg pt-11">
      <div className="bg-warning-tint px-4.5 py-3.5 flex items-center gap-2.5">
        <HiOutlineSignalSlash size={17} className="text-warning shrink-0" />
        <span className="flex-1 font-sans font-bold text-[12.5px] text-warning-strong">
          You are offline — showing your last known trip
        </span>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <RouttaMap pickup={trip?.pickup} destination={trip?.destination} showRoute showPickup showDest />
        <div className="absolute inset-0 bg-[rgba(245,246,243,.55)]" />
        <div className="absolute top-4 left-4 font-sans font-bold text-[10px] tracking-[.1em] text-muted bg-white/90 px-2.5 py-1.5 rounded-md">
          CACHED 09:58
        </div>
      </div>
      <div className="bg-white rounded-t-sheet p-5 shadow-[0_-8px_32px_rgba(18,33,29,.14)]">
        <div className="flex items-center gap-3 mb-4">
          <InitialsAvatar initials="CO" tone="light" />
          <div>
            <div className="font-sans font-semibold text-[15.5px]">Chinedu Okafor</div>
            <div className="font-sans font-medium text-xs text-muted mt-0.5">
              Last seen 4 minutes from your pickup
            </div>
          </div>
        </div>
        <div className="bg-bg rounded-xl p-3.5 font-sans font-medium text-[12.5px] leading-relaxed text-text-2 mb-3.5">
          Your PIN <span className="font-display font-bold text-sm tracking-[.1em]">4417</span> and your
          Transporter&rsquo;s details work offline. Calling still works over the mobile network.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 h-[50px] rounded-btn border-[1.5px] border-border font-sans font-bold text-[13.5px]"
          >
            Call Chinedu
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 h-[50px] rounded-btn bg-primary text-white font-sans font-bold text-[13.5px]"
          >
            Retry connection
          </button>
        </div>
      </div>
    </div>
  );
}
