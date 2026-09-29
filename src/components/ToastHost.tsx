import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => dismissToast(toasts[0].id), 2600);
    return () => clearTimeout(timer);
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto max-w-[92%] rounded-full px-4 py-3 font-sans font-semibold text-[13.5px] shadow-lg animate-[rt-toast_0.2s_ease]",
            t.tone === "success" && "bg-primary text-white",
            t.tone === "error" && "bg-error text-white",
            (!t.tone || t.tone === "default") && "bg-text text-white"
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
