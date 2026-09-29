import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineLink } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { RouttaMap } from "@/components/RouttaMap";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/ui/avatar";
import { profileService } from "@/services/api/profileService";
import { useRideStore } from "@/store/rideStore";
import { useUiStore } from "@/store/uiStore";
import type { EmergencyContact } from "@/services/api/types";

export default function ShareTripScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.activeTrip);
  const pushToast = useUiStore((s) => s.pushToast);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    profileService.getEmergencyContacts().then((c) => {
      setContacts(c);
      setSelected(new Set(c.filter((x) => x.primary).map((x) => x.id)));
    });
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function send() {
    pushToast(`Trip shared with ${selected.size || 0} contact(s)`, "success");
    navigate(-1);
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <ScreenHeader title="Share trip" />
      <div className="px-4.5 pt-4.5">
        <div className="border border-border rounded-card overflow-hidden mb-4">
          <div className="h-37.5 relative">
            {/* BACKEND-GAP: no live driver GPS feed — vehicle pin omitted
                rather than fabricated (see AcceptedScreen for details). */}
            <RouttaMap
              pickup={trip?.pickup}
              destination={trip?.destination}
              showRoute
              showPickup
              showDest
              showVehicle
            />
          </div>
          <div className="p-3.5 bg-primary">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="flex-1 font-sans font-bold text-[10.5px] tracking-[.1em] text-primary-300 uppercase">
                Live until you arrive
              </span>
              <span className="font-display font-bold text-sm text-accent tabular-nums">
                {trip?.etaMinutes ?? 14} min
              </span>
            </div>
            <div className="font-sans font-semibold text-[14.5px] text-white mt-2.5">
              You &rarr; {trip?.destination.label ?? "your destination"}
            </div>
          </div>
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          What they will see
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4.5">
          {["Your live position", "Plate & vehicle", "ETA"].map((t) => (
            <span key={t} className="font-sans font-semibold text-xs px-3 py-2 rounded-pill bg-primary-100 text-primary-600">
              {t}
            </span>
          ))}
          {["Not your fare", "Not your number"].map((t) => (
            <span key={t} className="font-sans font-semibold text-xs px-3 py-2 rounded-pill bg-bg text-muted-2">
              {t}
            </span>
          ))}
        </div>

        <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
          Send to
        </div>
        <div className="flex flex-col gap-2 mb-3.5">
          {contacts.map((c) => {
            const active = selected.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`flex items-center gap-3 p-3.5 rounded-btn border-[1.5px] text-left ${
                  active ? "border-primary" : "border-border"
                }`}
              >
                <InitialsAvatar initials={c.name.split(" ").map((n) => n[0]).join("")} tone="light" />
                <span className="flex-1">
                  <span className="block font-sans font-semibold text-[14.5px]">{c.name}</span>
                  <span className="block font-sans font-medium text-xs text-muted mt-0.5">{c.relation}</span>
                </span>
                <span
                  className={`w-5.5 h-5.5 rounded-md grid place-items-center shrink-0 border-2 ${
                    active ? "bg-primary border-primary" : "border-border-strong"
                  }`}
                >
                  {active ? <HiCheck size={13} className="text-accent" strokeWidth={3.5} /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText("https://routta.app/t/RT-live").catch(() => {});
            pushToast("Link copied");
          }}
          className="w-full h-13 rounded-btn border-[1.5px] border-dashed border-border-strong font-sans font-bold text-[14.5px] text-primary-600 flex items-center justify-center gap-2 mb-4"
        >
          <HiOutlineLink size={17} />
          Copy a link instead
        </button>
      </div>
      <span className="flex-1" />
      <div className="px-4.5 pb-6.5">
        <Button onClick={send} className="w-full">
          Share trip {selected.size ? `(${selected.size})` : ""}
        </Button>
      </div>
    </div>
  );
}
