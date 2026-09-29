import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { usePremiumStore } from "@/store/premiumStore";

const SHOTS = ["Front three-quarter", "Rear", "Side profile", "Interior · front", "Interior · rear", "Boot space", "Dashboard"];

export default function PremiumGalleryScreen() {
  const vehicle = usePremiumStore((s) => s.draft.vehicle);

  return (
    <div className="flex flex-1 flex-col bg-[#12211D]">
      <ScreenHeader title={vehicle?.name ?? "Gallery"} className="bg-transparent border-none [&_*]:text-white" />
      <div className="flex-1 overflow-y-auto p-3.5">
        <div className="h-57 rounded-2xl overflow-hidden mb-2.5 bg-[#1c2e28] grid place-items-center">
          <span className="font-sans font-medium text-xs text-primary-300">{SHOTS[0]}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {SHOTS.slice(1).map((shot) => (
            <div key={shot} className="h-33 rounded-2xl overflow-hidden bg-[#1c2e28] grid place-items-center">
              <span className="font-sans font-medium text-xs text-primary-300">{shot}</span>
            </div>
          ))}
        </div>
        <p className="font-sans font-medium text-xs text-primary-300 text-center py-4 mt-2">
          Photos supplied by {vehicle?.businessName ?? "the business"} and checked by Routta at
          verification.
        </p>
      </div>
    </div>
  );
}
