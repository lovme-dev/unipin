import { useState } from "react";
import { ChevronLeft, Wallet, Tag, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import unipinLogo from "@/assets/unipin-logo.svg";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "wallet" | "bank" | "card";
}

const paymentMethodsByRegion: Record<string, PaymentMethod[]> = {
  PK: [
    { id: "jazzcash", name: "JazzCash", icon: "💳", type: "wallet" },
    { id: "easypaisa", name: "EasyPaisa", icon: "💳", type: "wallet" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", type: "card" },
  ],
  ID: [
    { id: "dana", name: "DANA", icon: "💳", type: "wallet" },
    { id: "gopay", name: "GoPay", icon: "💳", type: "wallet" },
    { id: "ovo", name: "OVO", icon: "💳", type: "wallet" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", type: "card" },
  ],
  default: [
    { id: "card", name: "Credit/Debit Card", icon: "💳", type: "card" },
    { id: "wallet", name: "Digital Wallet", icon: "💳", type: "wallet" },
  ],
};

interface UCPackage {
  uc: number;
  price: number;
  currency: string;
}

const ucPackagesByRegion: Record<string, UCPackage[]> = {
  PK: [
    { uc: 1400, price: 1400, currency: "PKR" },
    { uc: 3000, price: 3000, currency: "PKR" },
    { uc: 6000, price: 6000, currency: "PKR" },
    { uc: 14000, price: 14000, currency: "PKR" },
    { uc: 28000, price: 28000, currency: "PKR" },
  ],
  ID: [
    { uc: 1400, price: 20000, currency: "IDR" },
    { uc: 3000, price: 42000, currency: "IDR" },
    { uc: 6000, price: 84000, currency: "IDR" },
    { uc: 14000, price: 196000, currency: "IDR" },
    { uc: 28000, price: 392000, currency: "IDR" },
  ],
  default: [
    { uc: 1400, price: 5, currency: "USD" },
    { uc: 3000, price: 10, currency: "USD" },
    { uc: 6000, price: 20, currency: "USD" },
    { uc: 14000, price: 50, currency: "USD" },
    { uc: 28000, price: 100, currency: "USD" },
  ],
};

type Step = "choose-payment" | "select-amount";

const ReloadPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("choose-payment");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Detect region from URL or default
  const regionCode = "PK"; // TODO: get from geo hook
  const methods = paymentMethodsByRegion[regionCode] || paymentMethodsByRegion.default;
  const packages = ucPackagesByRegion[regionCode] || ucPackagesByRegion.default;
  const currency = packages[0]?.currency || "USD";

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code.");
      return;
    }
    // Dummy validation
    if (discountCode.toUpperCase() === "UNIPIN10") {
      setDiscountApplied(true);
      toast.success("Discount code applied! 10% off.");
    } else {
      toast.error("Invalid discount code.");
    }
  };

  const handleConfirm = () => {
    if (!selectedPackage) {
      toast.error("Please select an amount.");
      return;
    }
    if (selectedMethod?.type !== "card" && !phoneNumber.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    // Dummy confirm
    toast.success(`Top-up of UC ${selectedPackage.uc.toLocaleString()} initiated via ${selectedMethod?.name}!`);
    navigate("/");
  };

  const finalPrice = selectedPackage
    ? discountApplied
      ? Math.round(selectedPackage.price * 0.9)
      : selectedPackage.price
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)',
        }} />
        <div className="relative z-20 py-1.5 px-3">
          <span className="font-bold tracking-wide text-[10px]">INSTANT TOP UP! INSTANT PLAY!</span>
        </div>
        <div className="relative z-10 px-3 py-2 flex items-center justify-between">
          <img src={unipinLogo} alt="UniPin" className="h-5" />
        </div>
      </div>

      {/* Back + Title */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => step === "select-amount" ? setStep("choose-payment") : navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Reload</h1>
      </div>

      {step === "choose-payment" && (
        <div className="px-4">
          <p className="text-center text-muted-foreground mb-6">Choose Your Payment Option</p>

          {/* Wallet icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary-foreground" />
            </div>
            <p className="absolute mt-24 text-sm text-primary font-medium">Wallet</p>
          </div>

          <div className="mt-14">
            <p className="text-center text-muted-foreground text-sm mb-4">Choose your payment option</p>
            <div className="grid grid-cols-3 gap-3">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method);
                    setStep("select-amount");
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:bg-secondary/50"
                  style={{ background: 'hsl(220, 35%, 14%)' }}
                >
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                  <span className="text-xs text-foreground font-medium text-center">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "select-amount" && selectedMethod && (
        <div className="px-4">
          {/* Selected payment method header */}
          <div className="rounded-xl p-4 mb-6" style={{ background: 'hsl(220, 35%, 14%)' }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setStep("choose-payment")}>
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center mb-2">
                  <span className="text-3xl">{selectedMethod.icon}</span>
                </div>
                <span className="text-foreground font-semibold">{selectedMethod.name}</span>
              </div>
              <div className="w-5" />
            </div>
          </div>

          {/* Amount selection */}
          <p className="text-muted-foreground text-sm mb-3">Select Your Amount</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {packages.map((pkg) => (
              <button
                key={pkg.uc}
                onClick={() => setSelectedPackage(pkg)}
                className={`rounded-xl p-3 text-center border transition-all ${
                  selectedPackage?.uc === pkg.uc
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/30"
                }`}
                style={{ background: selectedPackage?.uc === pkg.uc ? undefined : 'hsl(220, 35%, 14%)' }}
              >
                <p className="text-primary font-bold text-sm">UC {pkg.uc.toLocaleString()}</p>
                <p className="text-foreground text-xs mt-1">{currency} {pkg.price.toLocaleString()}.00</p>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 mb-6" />

          {/* Billing Info */}
          <h2 className="text-xl font-bold text-foreground mb-4">Billing Info</h2>

          {selectedMethod.type === "card" ? (
            <>
              <div className="mb-3">
                <label className="text-sm text-muted-foreground mb-1 block">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-transparent border-b border-border/50 pb-2 text-foreground text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-transparent border-b border-border/50 pb-2 text-foreground text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-transparent border-b border-border/50 pb-2 text-foreground text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-3">
              <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
              <input
                type="tel"
                placeholder="03XX XXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-transparent border-b border-border/50 pb-2 text-foreground text-sm outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Your phone number will be used for proof of purchase purposes</p>
            </div>
          )}

          {/* Remember me */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground">Remember Me</span>
          </label>

          {/* Discount code */}
          <button
            onClick={() => setShowDiscount(!showDiscount)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-primary/50 text-primary text-sm font-medium mb-4 hover:bg-primary/5 transition-colors"
          >
            <Tag className="w-4 h-4" />
            I have a Discount Code
            <ChevronDown className={`w-4 h-4 transition-transform ${showDiscount ? "rotate-180" : ""}`} />
          </button>

          {showDiscount && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 bg-transparent border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm outline-none focus:border-primary"
              />
              <button
                onClick={handleApplyDiscount}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
              >
                Apply
              </button>
            </div>
          )}

          {discountApplied && selectedPackage && (
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="text-sm text-green-400">10% discount applied</span>
              <span className="text-sm text-green-400 font-bold">{currency} {finalPrice.toLocaleString()}.00</span>
            </div>
          )}

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            disabled={!selectedPackage}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors disabled:opacity-50 mb-3"
          >
            CONFIRM
          </button>

          <p className="text-center text-xs text-muted-foreground pb-6">
            By clicking "Confirm", you agree to{" "}
            <Link to="/user-terms" className="text-primary hover:underline">User's Terms and Conditions</Link>,{" "}
            <Link to="/terms-and-conditions" className="text-primary hover:underline">Website Terms and Conditions</Link>{" "}
            & <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReloadPage;
