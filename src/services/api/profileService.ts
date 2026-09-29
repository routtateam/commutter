// Live: profile update, emergency contacts, account deletion (DELETE /users/me).
import { USE_MOCKS, http, mockDelay } from "./client";
import type { CommuterProfile, EmergencyContact } from "./types";

let CONTACTS: EmergencyContact[] = [
  { id: "ec1", name: "Chidi Nwosu", relation: "Brother", phone: "+234 802 118 4470", primary: true },
  { id: "ec2", name: "Ngozi Okonkwo", relation: "Friend", phone: "+234 809 664 2210" },
];

const mockProfileService = {
  async updateProfile(patch: Partial<CommuterProfile>): Promise<CommuterProfile> {
    await mockDelay(500);
    return patch as CommuterProfile;
  },

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    await mockDelay(300);
    return CONTACTS;
  },

  async addEmergencyContact(contact: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
    await mockDelay(400);
    const created = { ...contact, id: `ec_${Date.now()}` };
    CONTACTS = [...CONTACTS, created];
    return created;
  },

  async removeEmergencyContact(id: string): Promise<void> {
    await mockDelay(300);
    CONTACTS = CONTACTS.filter((c) => c.id !== id);
  },

  async deleteAccount(): Promise<void> {
    await mockDelay(600);
  },
};

// ---- Real backend implementation ----

const realProfileService: typeof mockProfileService = {
  async updateProfile(patch) {
    const { firstName, lastName, email, avatarUrl } = patch;
    return http<CommuterProfile>("/users/me", { method: "PATCH", body: { firstName, lastName, email, avatarUrl } });
  },

  async getEmergencyContacts() {
    return http<EmergencyContact[]>("/users/me/emergency-contacts");
  },

  async addEmergencyContact(contact) {
    return http<EmergencyContact>("/users/me/emergency-contacts", { method: "POST", body: contact });
  },

  async removeEmergencyContact(id) {
    await http<void>(`/users/me/emergency-contacts/${id}`, { method: "DELETE" });
  },

  /** Soft-deletes + anonymises. The backend refuses (422) while a ride is active or the wallet is non-empty;
   *  callers must only clear the session after this resolves. */
  async deleteAccount() {
    await http<{ deleted: boolean }>("/users/me", { method: "DELETE" });
  },
};

export const profileService = USE_MOCKS ? mockProfileService : realProfileService;
