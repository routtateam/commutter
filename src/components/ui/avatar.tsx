import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-9 w-9 text-[12px]",
  md: "h-11 w-11 text-[14px]",
  lg: "h-14 w-14 text-[17px]",
  xl: "h-[88px] w-[88px] text-[28px]",
};

export function InitialsAvatar({
  initials,
  size = "md",
  tone = "dark",
  className,
}: {
  initials: string;
  size?: keyof typeof sizeMap;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-full font-display font-bold shrink-0",
        sizeMap[size],
        tone === "dark" ? "bg-primary text-accent" : "bg-primary-200 text-primary-700",
        className
      )}
    >
      {initials}
    </div>
  );
}
