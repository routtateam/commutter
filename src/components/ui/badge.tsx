import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "info" | "gold";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-bg text-muted",
  primary: "bg-primary-100 text-primary-600",
  success: "bg-success-tint text-success-strong",
  warning: "bg-warning-tint text-warning-strong",
  error: "bg-error-tint text-error-strong",
  info: "bg-info-tint text-info-strong",
  gold: "bg-gold-tint text-gold-on",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1.5 font-sans font-bold text-[10.5px] tracking-[.06em] uppercase",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

export function Chip({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "font-sans font-semibold text-[13px] px-3.5 py-2.5 rounded-pill border-[1.5px] transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-text border-border hover:border-primary",
        className
      )}
      {...props}
    />
  );
}
