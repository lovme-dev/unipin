import { useState, useRef } from "react";
import { ChevronLeft, ShieldCheck, Check } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import unipinLogo from "@/assets/unipin-logo.svg";
import visaMastercardLogo from "@/assets/visa-mastercard-logo.png";
import rewardMerchandise from "@/assets/reward-merchandise.svg";
import rewardFasterReload from "@/assets/reward-faster-reload.svg";
import rewardEventVip from "@/assets/reward-event-vip.svg";
import diamondIcon from "@/assets/diamond-icon.png";
import { toast } from "sonner";
import { XPayProvider } from "@/components/XPayProvider";
import XPayCardForm, { type XPayCardFormRef } from "@/components/XPayCardForm";

interface CheckoutState {
  diamonds: number;
  bonus: number;
  price: string;
  currency: string;
  currencySymbol: string;
  paymentMethod: string;
  rawPkrPrice?: number;
  email?: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;
  const [rememberMe, setRememberMe] = useState(false);
  const cardFormRef = useRef<XPayCardFormRef>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state) {
    navigate("/");
    return null;
  }

  const handlePurchase = async () => {
    if (cardFormRef.current) {
      setIsProcessing(true);
      try {
        await cardFormRef.current.submit();
      } catch {
        // error handled by XPayCardForm
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast.success(`Top-up of ${state.diamonds.toLocaleString()} + ${state.bonus.toLocaleString()} Diamonds initiated!`);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--header-glow) / 0.67) 0%, hsl(var(--header-glow) / 0.32) 45%, transparent 100%)",
          }}
        />
        <div className="relative z-20 py-1.5 px-3">
          <span className="font-bold tracking-wide text-[10px]">
            INSTANT TOP UP! INSTANT PLAY!
          </span>
        </div>
        <div className="relative z-10 px-3 py-2 flex items-center justify-between">
          <img src={unipinLogo} alt="UniPin" className="h-5" />
        </div>
      </div>

      {/* Content Card */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div
          className="rounded-2xl border border-border/40 p-6"
          style={{ background: "hsl(220, 30%, 13%)" }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>

          {/* Card logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white rounded-lg px-4 py-2.5 mb-3">
              <img
                src={visaMastercardLogo}
                alt="Visa / Mastercard"
                className="h-7 object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm">Debit / Credit Card</p>
          </div>

          {/* Total Amount */}
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-xs mb-1">Total Amount</p>
            <p className="text-foreground text-3xl font-bold tracking-tight">
              {state.currencySymbol} {state.price}
            </p>
          </div>

          {/* Item & Price rows */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Item</span>
              <span className="text-foreground text-sm font-semibold flex items-center gap-1.5">
                {state.diamonds.toLocaleString()} + {state.bonus.toLocaleString()}
                <img src={diamondIcon} alt="Diamond" className="w-5 h-5 object-contain inline-block" />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Price</span>
              <span className="text-foreground text-sm font-semibold">
                {state.currencySymbol} {state.price}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/30 mb-5" />

          {/* XPay Card Form */}
          <div className="mb-5">
            <XPayProvider email={state.email} customerName="Customer">
              <XPayCardForm
                ref={cardFormRef}
                amount={state.rawPkrPrice || 0}
                currency="PKR"
                customerEmail={state.email || ""}
                customerPhone=""
                productName={`${state.diamonds} + ${state.bonus} Free Fire Diamonds`}
                productType="freefire_diamonds"
                productAmount={`${state.diamonds}+${state.bonus}`}
                onSuccess={(details) => {
                  toast.success("Payment successful!");
                  navigate("/", { state: { paymentSuccess: true } });
                }}
                onError={(error) => {
                  toast.error(error);
                }}
              />
            </XPayProvider>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2.5 mb-8 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border/60 accent-primary"
            />
            <span className="text-sm text-muted-foreground">Remember Me</span>
          </label>

          {/* Exclusive Rewards */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Exclusive Rewards
            </h3>
            <p className="text-primary text-xs mb-5">
              Checkout using UniPin Credits and get exclusive Rewards
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <img src={rewardMerchandise} alt="Merchandise" className="w-10 h-10" />
                <span className="text-xs text-muted-foreground text-center">Merchandise</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src={rewardFasterReload} alt="Faster Reload" className="w-10 h-10" />
                <span className="text-xs text-muted-foreground text-center">Faster Reload</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src={rewardEventVip} alt="Event VIP" className="w-10 h-10" />
                <span className="text-xs text-muted-foreground text-center">Event VIP</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors mb-4 disabled:opacity-50"
          >
            {isProcessing ? "PROCESSING..." : "PURCHASE"}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mb-6">
            By clicking "Purchase", you agree to{" "}
            <Link to="/user-terms" className="text-primary hover:underline">
              User's Terms and Conditions
            </Link>
            ,{" "}
            <Link to="/terms-and-conditions" className="text-primary hover:underline">
              Website Terms and Conditions
            </Link>{" "}
            &{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Payment Secured */}
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <ShieldCheck className="w-6 h-6 text-green-500" fill="hsl(142, 71%, 45%)" strokeWidth={2} />
              <Check className="absolute inset-0 m-auto w-3 h-3 text-black" strokeWidth={3} />
            </div>
            <div className="text-xs font-bold text-foreground leading-tight">
              <p>PAYMENT</p>
              <p>SECURED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
