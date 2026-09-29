import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiChevronRight, HiOutlineCalendarDays } from "react-icons/hi2";
import { RiCoupon3Line } from "react-icons/ri";
import { RouttaMap } from "@/components/RouttaMap";
import { CategoryBadge } from "@/components/CategoryIcon";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { formatNaira } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { rideService } from "@/services/api/rideService";
import { walletService } from "@/services/api/walletService";
import type { PaymentMethod } from "@/services/api/types";

export default function SummaryScreen() {
  const navigate = useNavigate();
  const draft = useRideStore((s) => s.draft);
  const setPaymentMethod = useRideStore((s) => s.setPaymentMethod);
  const setActiveTrip = useRideStore((s) => s.setActiveTrip);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pushToast = useUiStore((s) => s.pushToast);

  useEffect(() => {
    if (!draft.destination || !draft.categoryQuote) {
      navigate("/category", { replace: true });
      return;
    }
    walletService.getPaymentMethods().then(setMethods);
  }, [draft.destination, draft.categoryQuote, navigate]);

  if (!draft.destination || !draft.categoryQuote) return null;

  const grossFare = draft.categoryQuote.fare;
  // Promo discounts are either a fraction (0.15 = 15%) or a fixed naira amount.
  const promoDiscount = draft.promo
    ? draft.promo.discount > 0 && draft.promo.discount <= 1
      ? Math.round(grossFare * draft.promo.discount)
      : draft.promo.discount
    : 0;
  const fare = Math.max(grossFare - promoDiscount, 0);
  const selectedMethod = methods.find((m) => m.id === draft.paymentMethodId);
  const paymentLabel = selectedMethod
    ? selectedMethod.kind === "wallet"
      ? "Routta wallet"
      : `•••• ${selectedMethod.last4}`
    : "Card •••• 4821";

  async function requestRide() {
    setRequesting(true);
    let trip;
    try {
      trip = await rideService.requestTrip({
        pickup: draft.pickup,
        destination: draft.destination!,
        category: draft.category!,
        categoryLabel: draft.categoryQuote!.name,
        fare,
        grossFare,
        distanceKm: 18.4,
        paymentMethodLabel: paymentLabel,
        promoDiscount: promoDiscount || undefined,
        promoCode: draft.promo?.code,
      });
    } catch (e) {
      setRequesting(false);
      pushToast(e instanceof Error ? e.message : "Could not request your ride", "error");
      return;
    }
    setActiveTrip(trip);
    setRequesting(false);
    navigate("/matching");
  }

  return (
    <div className="relative flex-1">
      <RouttaMap pickup={draft.pickup} destination={draft.destination} showRoute showPickup showDest />
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-13 left-4 w-11 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(18,33,29,.18)] grid place-items-center"
      >
        <HiArrowLeft size={20} />
      </button>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-sheet shadow-sheet px-4.5 pt-2.5 pb-5 max-h-[88%] overflow-y-auto">
        <div className="w-9.5 h-1 rounded-pill bg-border mx-auto mb-3" />
        <div className="flex items-center gap-1.5 mb-3.5">
          <span className="h-1 flex-1 rounded-pill bg-primary" />
          <span className="font-sans font-bold text-[10.5px] tracking-[.06em] text-primary-600 pl-1 uppercase">
            Final step · confirm
          </span>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
          <div className="flex flex-col items-center py-1 gap-1 shrink-0">
            <span className="w-[9px] h-[9px] rounded-full border-[2.5px] border-primary" />
            <span className="w-px h-6.5 bg-border" />
            <span className="w-[9px] h-[9px] rounded-sm bg-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans font-semibold text-sm truncate">{draft.pickup.subtitle}</div>
            <div className="h-5" />
            <div className="font-sans font-semibold text-sm truncate">{draft.destination.label}</div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="font-sans font-bold text-[12.5px] text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-100 shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="border-[1.5px] border-primary rounded-card p-3.5 flex items-center gap-3 bg-[#F7FBF9] mb-3">
          <CategoryBadge category={draft.category!} />
          <span className="flex-1 min-w-0">
            <span className="block font-sans font-semibold text-[15.5px]">
              {draft.categoryQuote.name}
            </span>
            <span className="block font-sans font-medium text-[12.5px] text-muted mt-0.5">
              18.4 km · 48 min · arrives 11:12
            </span>
          </span>
          <button
            type="button"
            onClick={() => navigate("/category")}
            className="font-sans font-bold text-[12.5px] text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-100 shrink-0"
          >
            Change
          </button>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="w-full border border-border rounded-card p-3.5 flex items-center gap-3 mb-2.5 text-left hover:border-primary transition-colors"
            >
              <span className="w-10 h-7 rounded-[5px] bg-[#12211D] grid place-items-center shrink-0 font-display font-extrabold text-[8.5px] text-[#F5C24B]">
                {selectedMethod?.kind === "wallet" ? "NGN" : "VISA"}
              </span>
              <span className="flex-1 font-sans font-semibold text-sm tabular-nums">{paymentLabel}</span>
              <HiChevronRight size={18} className="text-border-strong" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="font-sans font-bold text-[19px] mb-3.5">Pay with</SheetTitle>
            <div className="flex flex-col gap-2 mb-4">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(m.id);
                    setSheetOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-card border-[1.5px] text-left ${
                    m.id === draft.paymentMethodId ? "border-primary bg-[#F7FBF9]" : "border-border"
                  }`}
                >
                  <span className="w-10 h-7 rounded-[5px] bg-[#12211D] grid place-items-center shrink-0 font-display font-extrabold text-[8.5px] text-[#F5C24B]">
                    {m.kind === "wallet" ? "NGN" : m.brand?.toUpperCase()}
                  </span>
                  <span className="flex-1">
                    <span className="block font-sans font-semibold text-[14.5px] tabular-nums">
                      {m.kind === "wallet" ? "Routta wallet" : `•••• ${m.last4}`}
                    </span>
                    <span className="block font-sans font-medium text-xs text-muted mt-0.5">
                      {m.kind === "wallet" ? "Balance ₦3,120" : `${m.bank} · ${m.isDefault ? "default" : ""}`}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/payments/add-card")}>
              + Add a new card
            </Button>
          </SheetContent>
        </Sheet>

        <button
          type="button"
          onClick={() => navigate("/promo")}
          className="w-full border border-dashed border-border-strong rounded-card p-3.5 flex items-center gap-3 mb-3.5 text-left hover:border-primary transition-colors"
        >
          <span className="w-10 h-7 rounded-[5px] bg-accent-tint grid place-items-center shrink-0">
            <RiCoupon3Line size={16} className="text-accent-on-tint" />
          </span>
          <span className="flex-1 font-sans font-semibold text-sm">
            {draft.promo ? draft.promo.title : "Add a promo code"}
          </span>
          <HiChevronRight size={18} className="text-border-strong" />
        </button>

        <div className="flex items-end justify-between pt-3.5 border-t border-[#F0F2EF] mb-4">
          <div>
            <div className="font-sans font-bold text-[10.5px] tracking-[.09em] text-muted uppercase">
              Total fare
            </div>
            <div className="font-sans font-medium text-[11.5px] text-muted-2 mt-1">
              All charges included
            </div>
          </div>
          <div className="font-display font-bold text-[30px] tracking-[-.01em] tabular-nums">
            {formatNaira(fare)}
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/schedule")}
            className="w-[54px] h-[54px] rounded-btn border-[1.5px] border-border-strong grid place-items-center hover:border-primary transition-colors shrink-0"
            aria-label="Schedule for later"
          >
            <HiOutlineCalendarDays size={21} />
          </button>
          <Button className="flex-1" onClick={requestRide} loading={requesting}>
            Request {draft.categoryQuote.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
