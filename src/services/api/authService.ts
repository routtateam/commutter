// Live: phone OTP send/verify, signup, login, session restore, logout (real backend).
// BACKEND-GAP: Google sign-in (no OAuth endpoint on the backend).
import { ApiError, USE_MOCKS, http, mockDelay } from "./client";
import { useAuthStore } from "@/store/authStore";
import type { AuthSession, CommuterProfile } from "./types";

const MOCK_PROFILE: CommuterProfile = {
  id: "cm_adaeze",
  firstName: "Adaeze",
  lastName: "Nwosu",
  email: "ada.nwosu@gmail.com",
  emailVerified: true,
  phone: "+234 803 411 2094",
  phoneVerified: true,
  rating: 4.8,
  memberSince: "2024",
  ridesCount: 148,
  referralCode: "ADAEZE24",
};

const mockAuthService = {
  async sendOtp(phone: string): Promise<{ sent: boolean; phone: string }> {
    await mockDelay(600);
    return { sent: true, phone };
  },

  async verifyOtp(_phone: string, code: string): Promise<{ verified: boolean; isNewUser: boolean }> {
    await mockDelay(700);
    if (code.length !== 6) throw new Error("Enter the 6-digit code sent to your phone.");
    return { verified: true, isNewUser: true };
  },

  async createAccount(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    referralCode?: string;
  }): Promise<AuthSession> {
    await mockDelay(700);
    return {
      token: "mock-session-token",
      profile: { ...MOCK_PROFILE, ...input, emailVerified: false },
    };
  },

  async loginWithPhone(phone: string): Promise<AuthSession> {
    await mockDelay(500);
    return { token: "mock-session-token", profile: { ...MOCK_PROFILE, phone } };
  },

  async continueWithGoogle(): Promise<AuthSession> {
    await mockDelay(600);
    return { token: "mock-session-token", profile: MOCK_PROFILE };
  },

  async getSession(): Promise<AuthSession | null> {
    await mockDelay(200);
    return null;
  },

  async logout(): Promise<void> {
    await mockDelay(200);
  },
};

// ---- Real backend implementation ----

interface BackendSession {
  token: string;
  refreshToken: string;
  profile: CommuterProfile;
}

/** Backend expects the compact E.164 form (e.g. +2348034112094). */
const normalizePhone = (phone: string): string => phone.replace(/[\s\-()]/g, "");

/** OTP-verified token from /auth/commuter/otp/verify, needed for signup/login. */
let otpToken: string | null = null;

function persistSession(s: BackendSession): AuthSession {
  const store = useAuthStore.getState();
  store.setTokens(s.token, s.refreshToken);
  return { token: s.token, profile: s.profile };
}

const realAuthService: typeof mockAuthService = {
  async sendOtp(phone) {
    const res = await http<{ sent: boolean; phone: string; devOtpHint?: string }>("/auth/commuter/otp/send", {
      method: "POST",
      body: { phone: normalizePhone(phone) },
      auth: false,
    });
    if (import.meta.env.DEV && res.devOtpHint) console.info(`[dev] Routta OTP for ${res.phone}: ${res.devOtpHint}`);
    return { sent: res.sent, phone };
  },

  async verifyOtp(phone, code) {
    const res = await http<{ verified: boolean; isNewUser: boolean; otpToken: string }>("/auth/commuter/otp/verify", {
      method: "POST",
      body: { phone: normalizePhone(phone), code },
      auth: false,
    });
    otpToken = res.otpToken;
    if (res.verified && !res.isNewUser) {
      // Existing account: the screen goes straight to the app, so sign in now.
      const session = persistSession(
        await http<BackendSession>("/auth/commuter/login", { method: "POST", body: { otpToken }, auth: false })
      );
      useAuthStore.getState().signIn(session.token, session.profile);
      otpToken = null;
    }
    return { verified: res.verified, isNewUser: res.isNewUser };
  },

  async createAccount(input) {
    if (!otpToken) throw new ApiError("Your verification expired. Please verify your phone again.", 401, "UNAUTHORIZED");
    const session = persistSession(
      await http<BackendSession>("/auth/commuter/signup", {
        method: "POST",
        auth: false,
        body: {
          otpToken,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          referralCode: input.referralCode,
        },
      })
    );
    otpToken = null;
    return session;
  },

  async loginWithPhone() {
    // Login is completed inside verifyOtp (needs the OTP-verified token).
    const { token, profile } = useAuthStore.getState();
    if (!token || !profile) throw new ApiError("Verify your phone number to sign in.", 401, "UNAUTHORIZED");
    return { token, profile };
  },

  // BACKEND-GAP: no Google/OAuth sign-in endpoint; a mock token would just 401, so fail clearly.
  async continueWithGoogle() {
    throw new ApiError("Google sign-in isn't available yet. Use your phone number.", 501, "NOT_IMPLEMENTED");
  },

  async getSession() {
    const { token, profile } = useAuthStore.getState();
    if (!token) return null;
    try {
      const fresh = await http<CommuterProfile>("/users/me");
      useAuthStore.getState().updateProfile(fresh);
      return { token: useAuthStore.getState().token ?? token, profile: fresh };
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null;
      return profile ? { token, profile } : null;
    }
  },

  async logout() {
    try {
      await http<void>("/auth/logout", { method: "POST" });
    } catch {
      // token discard below is what matters
    }
    useAuthStore.getState().signOut();
  },
};

export const authService = USE_MOCKS ? mockAuthService : realAuthService;
