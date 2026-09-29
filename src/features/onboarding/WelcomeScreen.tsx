import { useNavigate } from "react-router-dom";
import { PiPhoneFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import routtaLogoLight from "@/assets/brand/routta-logo-light.svg";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const pushToast = useUiStore((s) => s.pushToast);

  async function continueWithGoogle() {
    try {
      const session = await authService.continueWithGoogle();
      signIn(session.token, session.profile);
      pushToast("Signed in with Google", "success");
      navigate("/auth/location");
    } catch {
      // BACKEND-GAP: no Google/OAuth endpoint exists yet.
      pushToast("Google sign-in isn't available yet", "error");
    }
  }

  return (
    <div className="relative flex flex-1 flex-col bg-primary pt-11 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-7 relative">
        <svg viewBox="0 0 390 500" className="absolute inset-0 h-full w-full opacity-50">
          <g fill="none" stroke="#0B4A3E" strokeWidth="24" strokeLinecap="round">
            <path d="M-20 420H110V190H250V-20" />
            <path d="M410 480H320V300H190V80" />
          </g>
        </svg>
        <img src={routtaLogoLight} alt="Routta" className="w-[180px] h-auto relative mb-6.5" />
        <h1 className="font-display font-bold text-[34px] leading-[1.1] tracking-[-.02em] text-white mb-3 relative">
          Where are we
          <br />
          going today?
        </h1>
        <p className="font-sans font-medium text-[15.5px] leading-relaxed text-primary-200 max-w-[30ch] relative">
          Create an account in under a minute. No card needed to browse fares.
        </p>
      </div>
      <div className="px-6 pb-8.5 flex flex-col gap-2.5">
        <Button variant="accent" onClick={() => navigate("/auth/phone")}>
          <PiPhoneFill size={18} />
          Continue with phone
        </Button>
        <button
          type="button"
          onClick={continueWithGoogle}
          className="h-[54px] rounded-btn bg-white/10 border-[1.5px] border-white/20 text-white font-sans font-bold text-[15.5px] flex items-center justify-center gap-2.5 hover:bg-white/16 transition-colors"
        >
          <FcGoogle size={18} />
          Continue with Google
        </button>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="font-sans font-medium text-[13.5px] text-primary-300">Already with us?</span>
          <button
            type="button"
            onClick={() => navigate("/auth/phone")}
            className="font-sans font-bold text-[13.5px] text-accent"
          >
            Log in
          </button>
        </div>
        <p className="font-sans font-medium text-[11.5px] leading-relaxed text-center text-primary-400 mt-1.5">
          By continuing you agree to Routta&rsquo;s Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
