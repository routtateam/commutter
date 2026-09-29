import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-border bg-white", className)}
      {...props}
    />
  );
}

export function CardEyebrow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5",
        className
      )}
      {...props}
    />
  );
}

export function Row({
  className,
  label,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between py-2", className)} {...props}>
      <span className="font-sans font-medium text-[13px] text-text-2">{label}</span>
      <span className="font-display font-semibold text-[13px] tabular-nums">{value}</span>
    </div>
  );
}
