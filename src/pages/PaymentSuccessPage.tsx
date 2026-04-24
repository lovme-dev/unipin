import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const basketId = params.get("BASKET_ID") || params.get("basket_id");
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-2xl border border-border/40 p-8" style={{ background: "hsl(220, 30%, 13%)" }}>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Your top up has been received. {basketId ? `Order: ${basketId}` : ""}
        </p>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
