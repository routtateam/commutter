import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Chip } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const GROUPS: { group: string; options: string[] }[] = [
  { group: "Vehicle type", options: ["SUV", "Sedan", "Van", "Luxury bus"] },
  { group: "Transmission", options: ["Automatic", "Manual"] },
  { group: "Extras", options: ["Pilot included", "Self-drive", "Decorated for events"] },
];

export default function PremiumFiltersScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set(["SUV", "Pilot included"]));
  const [availableOnly, setAvailableOnly] = useState(true);

  function toggle(opt: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <ScreenHeader title="Filters" />
      <div className="flex-1 overflow-y-auto px-4.5 pt-4.5">
        <div className="font-sans font-semibold text-[12.5px] mb-2">Price per 6 hours</div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="font-display font-bold text-[15px] tabular-nums">₦60,000</span>
          <span
            className="flex-1 h-1 rounded-pill"
            style={{
              background:
                "linear-gradient(90deg,#E3E7E2 0%,#003028 18%,#003028 76%,#E3E7E2 76%)",
            }}
          />
          <span className="font-display font-bold text-[15px] tabular-nums">₦250,000</span>
        </div>
        <p className="font-sans font-medium text-[11.5px] text-muted mb-5.5">
          Businesses set their own tiers — the range reflects what is listed today.
        </p>
        {GROUPS.map((g) => (
          <div key={g.group} className="mb-5.5">
            <div className="font-sans font-semibold text-[12.5px] mb-2.5">{g.group}</div>
            <div className="flex flex-wrap gap-2">
              {g.options.map((opt) => (
                <Chip key={opt} active={selected.has(opt)} onClick={() => toggle(opt)} type="button">
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between py-3.5 border-t border-[#F0F2EF] mb-5">
          <div>
            <div className="font-sans font-semibold text-[13.5px]">Available on my dates only</div>
            <div className="font-sans font-medium text-xs text-muted mt-0.5">
              Hides vehicles already booked
            </div>
          </div>
          <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
        </div>
      </div>
      <div className="p-4.5 border-t border-border flex gap-2.5">
        <button
          type="button"
          onClick={() => setSelected(new Set())}
          className="h-[52px] px-5 rounded-btn border-[1.5px] border-border-strong font-sans font-bold text-[14.5px]"
        >
          Clear
        </button>
        <Button className="flex-1" onClick={() => navigate(-1)}>
          Show vehicles
        </Button>
      </div>
    </div>
  );
}
