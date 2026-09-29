import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, success, leading, trailing, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-[7px]">
        {label ? (
          <label htmlFor={inputId} className="font-sans font-semibold text-[12.5px] text-text">
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            "flex h-[54px] items-center gap-2 rounded-btn border-[1.5px] bg-white px-3.5 transition-shadow",
            error
              ? "border-error"
              : success
              ? "border-success"
              : "border-border focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,48,40,.09)]",
            className
          )}
        >
          {leading}
          <input
            id={inputId}
            ref={ref}
            className="flex-1 min-w-0 bg-transparent font-sans font-medium text-[15px] text-text placeholder:text-muted-2 outline-none"
            {...props}
          />
          {trailing}
        </div>
        {error ? (
          <span className="font-sans font-semibold text-xs text-error">{error}</span>
        ) : hint ? (
          <span className="font-sans font-medium text-xs text-muted">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
