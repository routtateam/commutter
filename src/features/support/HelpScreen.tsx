import { useNavigate } from "react-router-dom";
import { HiOutlineChatBubbleLeftRight, HiOutlineMagnifyingGlass, HiChevronRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/badge";

const TOPICS = [
  "I was charged the wrong fare",
  "I left something in the vehicle",
  "My Transporter never arrived",
];

export default function HelpScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Help & support" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <div className="h-13 rounded-btn bg-white border border-border flex items-center px-3.5 gap-2.5 mb-4">
          <HiOutlineMagnifyingGlass size={17} className="text-muted" />
          <span className="font-sans font-medium text-[14.5px] text-muted-2">Search help topics</span>
        </div>

        <div className="bg-primary rounded-card p-4 flex items-center gap-3 mb-4">
          <span className="w-11 h-11 rounded-[11px] bg-primary-600 grid place-items-center shrink-0">
            <HiOutlineChatBubbleLeftRight size={20} className="text-accent" />
          </span>
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[15px] text-white">Chat with us</span>
            <span className="block font-sans font-medium text-[12.5px] text-primary-200 mt-0.5">
              Typically replies in under 5 minutes
            </span>
          </span>
          <button
            type="button"
            className="h-10 px-3.5 rounded-[10px] bg-accent text-primary font-sans font-bold text-[13px] shrink-0"
          >
            Start
          </button>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Your last ride
        </div>
        <button
          type="button"
          onClick={() => navigate("/help/report", { state: { tripId: "RT-4471" } })}
          className="w-full bg-white border border-border rounded-card p-3.5 flex items-center gap-3 text-left mb-4 hover:border-primary transition-colors"
        >
          <span className="w-11 h-11 rounded-[11px] bg-bg grid place-items-center shrink-0 font-display font-bold text-[10px] text-primary">
            CAR
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-sans font-semibold text-[14.5px]">Ikeja City Mall · 8 Sep</span>
            <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
              ₦2,450 · Chinedu Okafor
            </span>
          </span>
          <span className="font-sans font-bold text-[12.5px] text-primary-600 shrink-0">Get help</span>
        </button>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Common topics
        </div>
        <div className="bg-white border border-border rounded-card overflow-hidden">
          {TOPICS.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`w-full flex items-center gap-3 px-3.5 py-3.5 text-left ${
                i < TOPICS.length ? "border-b border-[#F0F2EF]" : ""
              } hover:bg-raised transition-colors`}
            >
              <span className="flex-1 font-sans font-semibold text-[14px]">{t}</span>
              <HiChevronRight size={17} className="text-border-strong" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate("/help/disputes")}
            className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left hover:bg-raised transition-colors"
          >
            <span className="flex-1 font-sans font-semibold text-[14px]">Track a dispute I opened</span>
            <Badge tone="warning">1 open</Badge>
          </button>
        </div>
      </div>
    </div>
  );
}
