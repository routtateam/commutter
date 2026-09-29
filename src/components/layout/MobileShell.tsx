import type { ReactNode } from "react";

/**
 * Constrains the app to a mobile viewport width when previewed on a wide
 * desktop browser (this ships as a native app via Capacitor, so on an actual
 * phone the shell simply fills the screen edge-to-edge).
 */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-bg-alt flex justify-center">
      <div className="relative flex w-full max-w-[480px] flex-col bg-bg min-h-dvh shadow-[0_0_40px_rgba(18,33,29,.08)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
