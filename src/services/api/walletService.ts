// Live: payment methods, wallet balance, top-up (init + confirm), promotions.
// Top-up: sandbox mode confirms immediately via the sandbox-only confirm endpoint; live mode opens the Monnify
// checkoutUrl and waits for the webhook to credit the wallet (see topUp below).
// BACKEND-GAP: card tokenisation (Monnify hosted checkout) is not implemented; see SECURITY-TODO in addCard.
import { ApiError, USE_MOCKS, fromKobo, http, mockDelay, toKobo } from "./client";
import type { PaymentMethod, PromoCode, TopUpAmountOption } from "./types";

let PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm_visa", kind: "card", brand: "visa", last4: "4821", bank: "GTBank", expiry: "09/28", isDefault: true },
  { id: "pm_verve", kind: "card", brand: "verve", last4: "0093", bank: "Access Bank", expiry: "03/25", isDefault: false, expired: true },
  { id: "pm_wallet", kind: "wallet", isDefault: false },
];

let WALLET_BALANCE = 3120;

export const TOP_UP_AMOUNTS: TopUpAmountOption[] = [
  { value: 1000, label: "₦1,000" },
  { value: 2000, label: "₦2,000" },
  { value: 5000, label: "₦5,000" },
  { value: 10000, label: "₦10,000" },
  { value: 20000, label: "₦20,000" },
  { value: 50000, label: "₦50,000" },
];

export const PROMO_CODES: PromoCode[] = [
  { code: "ROUTTA500", title: "₦500 off your next ride", description: "Minimum fare ₦2,000 · expires 30 Sep", discount: 500 },
  { code: "BUS15", title: "15% off bus bookings", description: "Groups of 11 or more · weekends only", discount: 0.15, validForCategory: "bus" },
];

const mockWalletService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await mockDelay(350);
    return PAYMENT_METHODS;
  },

  async addCard(input: { number: string; expiry: string; cvv: string; makeDefault: boolean }): Promise<PaymentMethod> {
    await mockDelay(700);
    const card: PaymentMethod = {
      id: `pm_${Date.now()}`,
      kind: "card",
      brand: "visa",
      last4: input.number.slice(-4) || "0000",
      bank: "New bank",
      expiry: input.expiry,
      isDefault: input.makeDefault,
    };
    PAYMENT_METHODS = input.makeDefault
      ? [...PAYMENT_METHODS.map((m) => ({ ...m, isDefault: false })), card]
      : [...PAYMENT_METHODS, card];
    return card;
  },

  async removeCard(id: string): Promise<void> {
    await mockDelay(300);
    PAYMENT_METHODS = PAYMENT_METHODS.filter((m) => m.id !== id);
  },

  async getWalletBalance(): Promise<number> {
    await mockDelay(250);
    return WALLET_BALANCE;
  },

  async topUp(amount: number): Promise<{ newBalance: number }> {
    await mockDelay(600);
    WALLET_BALANCE += amount;
    return { newBalance: WALLET_BALANCE };
  },

  async getPromos(): Promise<PromoCode[]> {
    await mockDelay(300);
    return PROMO_CODES;
  },

  async applyPromo(code: string): Promise<PromoCode | null> {
    await mockDelay(400);
    return PROMO_CODES.find((p) => p.code.toLowerCase() === code.toLowerCase()) ?? null;
  },
};

// ---- Real backend implementation ----

/** Backend percent promos are fractions (0.15); fixed promos are kobo. Frontend uses naira. */
const promoDiscount = (d: number): number => (d > 0 && d <= 1 ? d : fromKobo(d));
const mapPromo = (p: PromoCode): PromoCode => ({ ...p, discount: promoDiscount(Number(p.discount)) });

const realWalletService: typeof mockWalletService = {
  async getPaymentMethods() {
    const methods = await http<PaymentMethod[]>("/payments/methods");
    // The UI always offers the Routta wallet as a payment option.
    return methods.some((m) => m.kind === "wallet")
      ? methods
      : [...methods, { id: "pm_wallet", kind: "wallet", isDefault: false }];
  },

  async addCard(input) {
    // SECURITY-TODO (blocker before launch): this posts the raw card number and CVV to our API. The backend keeps
    // only last4 + expiry (never PAN/CVV) and its validation still REQUIRES `number` (12-19 digits) and `cvv`, so we
    // cannot send less yet. Before launch, card capture must move to Monnify's hosted checkout / SDK so card data goes
    // straight to Monnify; the app then only receives a token + brand + last4 + expiry. Then delete number/cvv here,
    // in AddCardScreen, and in the backend addCardSchema. Brand/bank are currently hard-coded server-side.
    return http<PaymentMethod>("/payments/methods", { method: "POST", body: input });
  },

  async removeCard(id) {
    if (id === "pm_wallet") return;
    await http<void>(`/payments/methods/${id}`, { method: "DELETE" });
  },

  async getWalletBalance() {
    const res = await http<{ balance: number }>("/payments/wallet");
    return fromKobo(res.balance);
  },

  async topUp(amount) {
    const init = await http<{ reference: string; checkoutUrl: string }>("/payments/wallet/topup", {
      method: "POST",
      body: { amount: toKobo(amount) },
    });
    // The backend response has no explicit "live" flag. In sandbox (no Monnify credentials) it returns a fake
    // `.../mock-checkout/<ref>` URL that must not be opened; the sandbox confirm endpoint credits the wallet.
    const sandbox = !init.checkoutUrl || init.checkoutUrl.includes("/mock-checkout/");
    if (sandbox) {
      const done = await http<{ newBalance: number }>(
        `/payments/wallet/topup/${encodeURIComponent(init.reference)}/confirm`,
        { method: "POST" }
      );
      return { newBalance: fromKobo(done.newBalance) };
    }
    // LIVE mode: send the user to Monnify's hosted checkout (card data never touches our servers). The confirm
    // endpoint is sandbox-only, so the Monnify webhook credits the wallet; we poll the balance until it moves.
    // TODO: on device use the Capacitor Browser plugin (in-app browser) instead of window.open.
    const before = (await http<{ balance: number }>("/payments/wallet")).balance;
    window.open(init.checkoutUrl, "_blank", "noopener");
    const deadline = Date.now() + 3 * 60_000;
    while (Date.now() < deadline) {
      await mockDelay(3000);
      const { balance } = await http<{ balance: number }>("/payments/wallet");
      if (balance > before) return { newBalance: fromKobo(balance) };
    }
    throw new ApiError("We haven't received your payment yet. Your wallet will update once it is confirmed.", 408, "TOPUP_PENDING");
  },

  async getPromos() {
    return (await http<PromoCode[]>("/payments/promotions")).map(mapPromo);
  },

  async applyPromo(code) {
    const p = await http<PromoCode | null>("/payments/promotions/apply", { method: "POST", body: { code } });
    return p ? mapPromo(p) : null;
  },
};

export const walletService = USE_MOCKS ? mockWalletService : realWalletService;
