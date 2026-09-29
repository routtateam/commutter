import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RouttaMap } from "@/components/RouttaMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOME_PLACE } from "@/services/api/placesService";
import { useUiStore } from "@/store/uiStore";

export default function SavedPlaceEditScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pushToast = useUiStore((s) => s.pushToast);
  const [label, setLabel] = useState(id === "new" ? "" : "Home");
  const [address] = useState(HOME_PLACE.subtitle);

  function save() {
    pushToast("Saved place updated", "success");
    navigate(-1);
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <div className="h-[170px] relative shrink-0">
        {/* No per-saved-place coordinate model yet (see `address` above,
            always HOME_PLACE's) — centers on HOME_PLACE's real coordinates
            rather than inventing a distinct fake pin. */}
        <RouttaMap pickup={HOME_PLACE} showRoute={false} showDest={false} />
        <div className="absolute left-3.5 right-3.5 bottom-3 h-[38px] rounded-[10px] bg-white/95 flex items-center px-3 gap-2">
          <span className="font-sans font-semibold text-[12.5px]">Drag the pin to adjust</span>
        </div>
      </div>
      <div className="px-4.5 pt-4.5 flex-1 flex flex-col">
        <Input label="Address" value={address} readOnly className="mb-4" />
        <Input
          label="What should we call it?"
          placeholder="e.g. Mum's house"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <span className="flex-1" />
        <div className="py-6.5">
          <Button onClick={save} className="w-full">
            Save place
          </Button>
        </div>
      </div>
    </div>
  );
}
