import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routtaMarkLime from "@/assets/brand/routta-mark-lime.svg";
import routtaLogoLight from "@/assets/brand/routta-logo-light.svg";
import { useAuthStore } from "@/store/authStore";

export default function SplashScreen() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) navigate("/home", { replace: true });
      else if (hasOnboarded) navigate("/welcome", { replace: true });
      else navigate("/onboarding", { replace: true });
    }, 1100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, hasOnboarded, navigate]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-5 bg-primary overflow-hidden">
      <svg viewBox="0 0 390 800" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="#0B4A3E" strokeWidth="26" strokeLinecap="round">
          <path d="M-20 600H120V300H260V120" />
          <path d="M410 700H300V460H160V240" />
        </g>
        <g fill="none" stroke="#C4F04A" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 26" opacity=".5">
          <path d="M-20 600H120V300H260V120" />
        </g>
      </svg>
      <img src={routtaMarkLime} alt="" className="h-[86px] w-auto relative animate-rt-in" />
      <img
        src={routtaLogoLight}
        alt="Routta"
        className="w-[196px] h-auto relative animate-rt-in [animation-delay:.18s]"
      />
      <div className="font-sans font-bold text-[11px] tracking-[.26em] text-primary-300 relative animate-rt-in [animation-delay:.34s]">
        MOBILITY MADE EASY
      </div>
      <div className="absolute bottom-14 left-0 right-0 flex justify-center">
        <span className="h-[22px] w-[22px] rounded-full border-[2.5px] border-[rgba(196,240,74,.24)] border-t-accent animate-rt-spin" />
      </div>
    </div>
  );
}
