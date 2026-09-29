import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[rgba(18,33,29,.5)] data-[state=open]:animate-[rt-in_0.2s_ease]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-0 right-0 bottom-0 z-50 mx-auto w-full max-w-[460px] rounded-t-sheet bg-white p-5 pb-7 shadow-sheet outline-none data-[state=open]:animate-rt-sheet max-h-[85dvh] overflow-y-auto",
          className
        )}
        {...props}
      >
        <div className="mx-auto mb-3.5 h-1 w-9 rounded-pill bg-border" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;
export const SheetClose = DialogPrimitive.Close;
