import type { ComponentType } from "react";
import { PiMotorcycleFill, PiCarProfileFill, PiVanFill } from "react-icons/pi";
import { FaBus } from "react-icons/fa6";
import type { VehicleCategory } from "@/services/api/types";
import { cn } from "@/lib/utils";

const ICONS: Record<VehicleCategory, ComponentType<{ size?: number; className?: string }>> = {
  bike: PiMotorcycleFill,
  car: PiCarProfileFill,
  bus: FaBus,
  van: PiVanFill,
};

export function CategoryIcon({
  category,
  size = 22,
  className,
}: {
  category: VehicleCategory;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon size={size} className={cn("text-primary", className)} />;
}

export function CategoryBadge({
  category,
  size,
}: {
  category: VehicleCategory;
  size?: number;
}) {
  return (
    <span className="w-11 h-11 rounded-xl bg-bg grid place-items-center shrink-0">
      <CategoryIcon category={category} size={size} />
    </span>
  );
}
