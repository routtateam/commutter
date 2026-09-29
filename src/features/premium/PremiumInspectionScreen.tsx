import { HiCheck } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";

const CHECKLIST = [
  { k: "Exterior condition", v: "No damage" },
  { k: "Interior condition", v: "Clean" },
  { k: "Fuel level", v: "Full tank" },
  { k: "Odometer", v: "41,208 km" },
  { k: "Tyres & spare", v: "Good" },
  { k: "Documents on board", v: "Verified" },
];

const PHOTOS = ["Front", "Rear", "Left", "Right", "Interior", "Odometer"];

export default function PremiumInspectionScreen() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF] p-4.5">
      <ScreenHeader title="Inspection" className="-mx-4.5 -mt-4.5 mb-4.5 bg-[#F7F5EF] border-none" />
      <div className="bg-success-tint rounded-xl p-3.5 flex gap-2.5 mb-5">
        <HiCheck className="text-success-strong shrink-0 mt-0.5" size={17} />
        <div>
          <div className="font-sans font-bold text-[13px] text-success-strong">
            Pre-rental inspection passed
          </div>
          <div className="font-sans font-medium text-[12.5px] text-success-strong/80 mt-0.5">
            Recorded by the business on Sat 13 Sep at 07:40, before handover.
          </div>
        </div>
      </div>
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        Condition checklist
      </div>
      <div className="bg-white border border-[#E6E2D6] rounded-2xl px-3.5 mb-5">
        {CHECKLIST.map((c, i) => (
          <div
            key={c.k}
            className={`flex items-center gap-2.5 py-3 ${i < CHECKLIST.length - 1 ? "border-b border-[#F5F2E8]" : ""}`}
          >
            <HiCheck size={16} className="text-success shrink-0" />
            <span className="flex-1 font-sans font-medium text-[13.5px]">{c.k}</span>
            <span className="font-sans font-semibold text-[12.5px] text-success">{c.v}</span>
          </div>
        ))}
      </div>
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        Photos at handover · {PHOTOS.length}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PHOTOS.map((p) => (
          <div key={p} className="aspect-square rounded-xl bg-[#EDEBE4] grid place-items-center">
            <span className="font-sans font-medium text-[10px] text-muted-2">{p}</span>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 mb-4.5">
        <div className="font-sans font-bold text-[11px] tracking-[.1em] text-muted uppercase mb-2.5">
          Business notes
        </div>
        <p className="font-sans font-medium text-[13px] leading-relaxed text-text-2">
          Vehicle handed over clean, full tank, odometer 41,208 km. Minor existing scuff on the
          rear bumper photographed and excluded from the deposit.
        </p>
      </div>
      <div className="bg-bg rounded-xl p-3.5">
        <p className="font-sans font-medium text-[12.5px] leading-relaxed text-text-2">
          The post-rental inspection runs when you return the vehicle. Your deposit decision
          follows within 24 hours of that check.
        </p>
      </div>
    </div>
  );
}
