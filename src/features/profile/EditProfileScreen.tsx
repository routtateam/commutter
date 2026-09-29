import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineCamera, HiOutlineInformationCircle } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { profileService } from "@/services/api/profileService";
import { useUiStore } from "@/store/uiStore";
import { initials } from "@/lib/utils";

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const pushToast = useUiStore((s) => s.pushToast);
  const [firstName, setFirstName] = useState(profile?.firstName ?? "Adaeze");
  const [lastName, setLastName] = useState(profile?.lastName ?? "Nwosu");
  const [email, setEmail] = useState(profile?.email ?? "ada.nwosu@gmail.com");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const patch = await profileService.updateProfile({ firstName, lastName, email });
    updateProfile(patch);
    setLoading(false);
    pushToast("Profile updated", "success");
    navigate(-1);
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-y-auto">
      <ScreenHeader title="Edit profile" />
      <div className="px-4.5 pt-5 flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-5.5">
          <div className="relative mb-3">
            <InitialsAvatar initials={initials(`${firstName} ${lastName}`)} size="xl" />
            <button
              type="button"
              className="absolute -right-0.5 -bottom-0.5 w-8 h-8 rounded-full bg-white border-[1.5px] border-border grid place-items-center shadow"
              aria-label="Change photo"
            >
              <HiOutlineCamera size={15} />
            </button>
          </div>
          <button type="button" className="font-sans font-bold text-[13px] text-primary-600 px-2.5 py-1.5 rounded-lg hover:bg-primary-100">
            Change photo
          </button>
        </div>
        <div className="flex flex-col gap-4 mb-4.5">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            success
            trailing={<HiCheck className="text-success" size={18} />}
          />
          <Input
            label="Phone number"
            value={profile?.phone ?? "+234 803 411 2094"}
            readOnly
            className="bg-bg"
            trailing={
              <button type="button" className="font-sans font-bold text-xs text-primary-600 shrink-0">
                Change
              </button>
            }
          />
        </div>
        <div className="bg-bg rounded-xl p-3.5 flex gap-2.5 items-start mb-4">
          <HiOutlineInformationCircle size={15} className="text-text-2 shrink-0 mt-0.5" />
          <span className="font-sans font-medium text-xs leading-relaxed text-text-2">
            Your Transporter only ever sees your first name and your rating — never your surname,
            email or number.
          </span>
        </div>
        <span className="flex-1" />
        <Button onClick={save} loading={loading} className="mb-6.5">
          Save changes
        </Button>
      </div>
    </div>
  );
}
