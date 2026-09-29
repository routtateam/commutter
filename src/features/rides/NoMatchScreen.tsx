import { useNavigate } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { rideService } from "@/services/api/rideService";

export default function NoMatchScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);

  async function switchToCar() {
    if (!draft.destination) return navigate("/home");
    const trip = await rideService.requestTrip({
      pickup: draft.pickup,
      destination: draft.destination,
      category: "car",
      categoryLabel: "Car",
      fare: 2450,
      distanceKm: 18.4,
      paymentMethodLabel: "Card •••• 4821",
    });
    setActiveTrip(trip);
    navigate("/matching");
  }

  return (
    <div className="relative flex-1">
      <RouttaMap pickup={draft.pickup} destination={draft.destination} showRoute showPickup showDest />
      <div className="absolute inset-0 bg-[rgba(18,33,29,.5)]" />
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet p-5 pb-5.5 animate-rt-sheet">
        <div className="w-14 h-14 rounded-full bg-warning-tint grid place-items-center mb-4">
          <HiOutlineClock size={26} className="text-warning" />
        </div>
        <h2 className="font-sans font-bold text-[21px] mb-2">
          No {draft.categoryQuote?.name.toLowerCase() ?? "vehicle"} available right now
        </h2>
        <p className="font-sans font-medium text-sm leading-relaxed text-text-2 mb-4.5">
          Traffic on Ozumba Mbadiwe is heavy. A car can reach you in 6 minutes for ₦2,450.
        </p>
        <div className="flex flex-col gap-2.5">
          <Button onClick={switchToCar}>Switch to Car · ₦2,450</Button>
          <Button variant="secondary" onClick={() => navigate("/matching")}>
            Keep looking
          </Button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="h-12 rounded-btn font-sans font-bold text-[14.5px] text-text-2 hover:bg-bg transition-colors"
          >
            Cancel this request
          </button>
        </div>
      </div>
    </div>
  );
}
