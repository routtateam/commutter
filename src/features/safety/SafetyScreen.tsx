import { useNavigate } from "react-router-dom";
import { HiOutlinePhone, HiOutlineUserGroup, HiOutlineChatBubbleLeftRight, HiOutlineDocumentText, HiChevronRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useRideStore } from "@/store/rideStore";

const ROWS = [
  { icon: HiOutlineUserGroup, label: "Emergency contacts", desc: "Manage who gets alerted", to: "/safety/emergency-contacts" },
  { icon: HiOutlineChatBubbleLeftRight, label: "Chat with Routta safety", desc: "A human responds in minutes", to: "/help" },
  { icon: HiOutlineDocumentText, label: "Report a safety issue", desc: "About a past trip", to: "/help/report" },
];

export default function SafetyScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Safety centre" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <div className="bg-error rounded-card p-4.5 mb-3.5">
          <div className="font-sans font-bold text-[10.5px] tracking-[.12em] text-error-tint uppercase mb-2.5">
            If you are in danger
          </div>
          <div className="font-sans font-bold text-xl text-white mb-1.5">Call emergency services</div>
          <p className="font-sans font-medium text-[13px] text-error-tint mb-4">
            We send your live location, trip details and your Transporter&rsquo;s plate to the
            responder.
          </p>
          <button
            type="button"
            className="w-full h-[54px] rounded-btn bg-white text-error font-sans font-bold text-base flex items-center justify-center gap-2.5"
          >
            <HiOutlinePhone size={19} />
            Call 112
          </button>
        </div>

        {trip?.transporter ? (
          <div className="bg-white border border-border rounded-card p-3.5 flex items-center gap-3 mb-3.5">
            <span className="w-10.5 h-10.5 rounded-xl bg-bg grid place-items-center shrink-0 font-display font-bold text-[10px] text-primary">
              {trip.categoryLabel.slice(0, 3).toUpperCase()}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-sans font-semibold text-sm truncate">
                {trip.transporter.name} · {trip.transporter.vehiclePlate}
              </span>
              <span className="block font-sans font-medium text-xs text-muted mt-0.5 truncate">
                {trip.transporter.vehicleModel} · en route to {trip.destination.label}
              </span>
            </span>
          </div>
        ) : null}

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Other ways to get help
        </div>
        <div className="bg-white border border-border rounded-card overflow-hidden mb-3.5">
          {ROWS.map((r, i) => (
            <div key={r.label}>
              {i > 0 ? <div className="h-px bg-[#F0F2EF] mx-3.5" /> : null}
              <button
                type="button"
                onClick={() => navigate(r.to)}
                className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left hover:bg-raised transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-bg grid place-items-center shrink-0">
                  <r.icon size={19} className="text-text-2" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-sans font-semibold text-[14.5px]">{r.label}</span>
                  <span className="block font-sans font-medium text-xs text-muted mt-0.5">{r.desc}</span>
                </span>
                <HiChevronRight size={17} className="text-border-strong shrink-0" />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-border rounded-card p-3.5">
          <p className="font-sans font-medium text-xs leading-relaxed text-text-2">
            Using this screen never tells your Transporter. Only Routta safety and anyone you
            choose to alert can see it.
          </p>
        </div>
      </div>
    </div>
  );
}
