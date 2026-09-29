import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMapPin } from "react-icons/hi2";
import { RouttaMap } from "@/components/RouttaMap";
import { Button } from "@/components/ui/button";
import { useGeoStore } from "@/store/geoStore";

export default function LocationPermissionScreen() {
  const navigate = useNavigate();
  const requestLocation = useGeoStore((s) => s.requestLocation);
  const coords = useGeoStore((s) => s.coords);
  const [requesting, setRequesting] = useState(false);

  async function allow() {
    setRequesting(true);
    await requestLocation(); // denied/unavailable falls back to the Lagos default downstream
    setRequesting(false);
    navigate("/home");
  }

  const skip = () => navigate("/home");

  return (
    <div className="flex flex-1 flex-col bg-bg pt-11">
      <div className="flex-1 relative overflow-hidden">
        <RouttaMap pickup={coords} showRoute={false} showDest={false} />
        <div className="absolute inset-0 bg-[rgba(18,33,29,.45)] backdrop-blur-[2px]" />
      </div>
      <div className="bg-white rounded-t-sheet px-6 pt-6.5 pb-7.5 -mt-[90px] relative shadow-sheet">
        <div className="w-14 h-14 rounded-full bg-primary-100 grid place-items-center mb-4">
          <HiOutlineMapPin size={27} className="text-primary" />
        </div>
        <h2 className="font-sans font-bold text-[21px] mb-2">Turn on location</h2>
        <p className="font-sans font-medium text-[14.5px] leading-relaxed text-text-2 mb-5">
          So we can set your pickup point and show Transporters near you. You can still type an
          address by hand.
        </p>
        <div className="flex flex-col gap-2.5">
          <Button onClick={allow} loading={requesting}>
            Allow while using Routta
          </Button>
          <Button variant="secondary" onClick={skip}>
            Enter my address instead
          </Button>
        </div>
      </div>
    </div>
  );
}
