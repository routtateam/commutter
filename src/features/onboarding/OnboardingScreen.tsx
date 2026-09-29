import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import routtaLogoGreen from "@/assets/brand/routta-logo-green.svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const SLIDES = [
  {
    title: "Move freely.",
    body: "Get where you need to go without the stress of haggling or waiting.",
  },
  {
    title: "Ride when you need it.",
    body: "Request a ride now, or schedule one for later — down to the minute.",
  },
  {
    title: "Move together.",
    body: "Bike, car, bus or van — share the ride and share the cost.",
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];

  function finish() {
    completeOnboarding();
    navigate("/welcome");
  }

  function next() {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else finish();
  }

  return (
    <div className="flex flex-1 flex-col bg-bg pt-11">
      <div className="flex items-center px-4.5 pt-2">
        <img src={routtaLogoGreen} alt="Routta" className="w-[86px] h-auto" />
        <span className="flex-1" />
        <button
          type="button"
          onClick={finish}
          className="font-sans font-bold text-[13.5px] text-text-2 px-3 py-2.5 rounded-xl hover:bg-primary-100 hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center px-7">
        <div className="h-[300px] rounded-sheet bg-primary relative overflow-hidden mb-8 grid place-items-center">
          <span className="font-display font-bold text-accent text-2xl">{step + 1} / 3</span>
        </div>
        <h1 className="font-display font-bold text-[32px] leading-[1.1] tracking-[-.02em] mb-3">
          {slide.title}
        </h1>
        <p className="font-sans font-medium text-base leading-relaxed text-text-2 max-w-[30ch]">
          {slide.body}
        </p>
      </div>
      <div className="px-7 pb-10 flex items-center gap-4">
        <div className="flex gap-1.5 flex-1">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-[7px] rounded-pill bg-border-strong transition-all",
                i === step ? "w-[26px] bg-primary" : "w-[7px]"
              )}
            />
          ))}
        </div>
        <Button onClick={next}>
          {step < SLIDES.length - 1 ? "Next" : "Get started"}
          <HiArrowRight className="text-accent" size={17} />
        </Button>
      </div>
    </div>
  );
}
