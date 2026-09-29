import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-7 w-[46px] shrink-0 rounded-pill bg-border-strong px-[3px] transition-colors data-[state=checked]:bg-primary outline-none",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-[22px] w-[22px] rounded-pill bg-white shadow transition-transform translate-x-0 data-[state=checked]:translate-x-[18px]" />
    </SwitchPrimitive.Root>
  );
}
