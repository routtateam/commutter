import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "accent";
type Size = "default" | "sm" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-800",
  secondary: "bg-white text-text border-[1.5px] border-border-strong hover:border-primary hover:bg-bg",
  ghost: "text-primary-600 hover:bg-primary-100",
  outline: "bg-transparent border-[1.5px] border-border-strong text-text hover:border-primary",
  danger: "bg-error text-white hover:bg-error-strong",
  accent: "bg-accent text-accent-foreground hover:bg-accent-pressed",
};

const sizeClasses: Record<Size, string> = {
  default: "h-[54px] px-6 text-[15.5px]",
  sm: "h-11 px-4 text-sm",
  icon: "h-11 w-11 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-btn font-bold font-sans transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-[rt-spin_0.8s_linear_infinite]" />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
