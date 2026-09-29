import { useEffect, useState } from "react";
import { HiOutlineInformationCircle, HiPlus } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { profileService } from "@/services/api/profileService";
import { useUiStore } from "@/store/uiStore";
import type { EmergencyContact } from "@/services/api/types";

export default function EmergencyContactsScreen() {
  const pushToast = useUiStore((s) => s.pushToast);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [autoShare, setAutoShare] = useState(true);

  useEffect(() => {
    profileService.getEmergencyContacts().then(setContacts);
  }, []);

  async function remove(id: string) {
    await profileService.removeEmergencyContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  async function add() {
    const created = await profileService.addEmergencyContact({
      name: "New contact",
      relation: "Friend",
      phone: "+234 800 000 0000",
    });
    setContacts((prev) => [...prev, created]);
    pushToast("Contact added", "success");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title="Emergency contacts" />
      <div className="flex-1 overflow-y-auto px-4.5 py-4">
        <p className="font-sans font-medium text-[13.5px] leading-relaxed text-text-2 mb-4">
          These people are alerted the moment you use the safety centre, and can be sent your live
          trip in one tap.
        </p>
        <div className="bg-white border border-border rounded-card overflow-hidden mb-3">
          {contacts.map((c, i) => (
            <div key={c.id}>
              {i > 0 ? <div className="h-px bg-[#F0F2EF] mx-3.5" /> : null}
              <div className="flex items-center gap-3 px-3.5 py-3.5">
                <InitialsAvatar initials={c.name.split(" ").map((n) => n[0]).join("")} tone="light" />
                <span className="flex-1 min-w-0">
                  <span className="block font-sans font-semibold text-[15px]">{c.name}</span>
                  <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
                    {c.relation} · {c.phone}
                  </span>
                </span>
                {c.primary ? (
                  <Badge tone="primary">Primary</Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="font-sans font-bold text-[12.5px] text-error shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left hover:bg-raised transition-colors border-t border-[#F0F2EF]"
          >
            <span className="w-11 h-11 rounded-full border-[1.5px] border-dashed border-border-strong grid place-items-center shrink-0">
              <HiPlus size={19} className="text-primary-600" />
            </span>
            <span className="font-sans font-bold text-[14.5px] text-primary-600">Add a contact</span>
          </button>
        </div>
        <div className="bg-white border border-border rounded-card p-3.5 flex items-center gap-3 mb-3.5">
          <span className="flex-1">
            <span className="block font-sans font-semibold text-[14.5px]">Auto-share every trip</span>
            <span className="block font-sans font-medium text-xs text-muted mt-0.5">
              Primary contact gets your live route whenever a ride starts
            </span>
          </span>
          <Switch checked={autoShare} onCheckedChange={setAutoShare} />
        </div>
        <div className="flex gap-2 items-start bg-info-tint rounded-card p-3.5">
          <HiOutlineInformationCircle size={16} className="text-info shrink-0 mt-0.5" />
          <span className="font-sans font-medium text-xs leading-relaxed text-info-strong">
            Contacts are never told they are on this list until you alert them. They do not need
            the Routta app.
          </span>
        </div>
      </div>
    </div>
  );
}
