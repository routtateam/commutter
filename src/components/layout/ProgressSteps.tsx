import { cn } from "@/lib/utils";

export function ProgressSteps({ total, current, label }: { total: number; current: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-3.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 rounded-pill",
            i <= current ? "bg-primary" : "bg-border"
          )}
        />
      ))}
      <span className="font-sans font-bold text-[10.5px] tracking-[.06em] text-muted pl-1 whitespace-nowrap uppercase">
        {label}
      </span>
    </div>
  );
}
