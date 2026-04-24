import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailurePage = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center rounded-2xl border border-border/40 p-8" style={{ background: "hsl(220, 30%, 13%)" }}>
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Your payment was not completed. Please try again.
      </p>
      <Link to="/" className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm">
        Try Again
      </Link>
    </div>
  </div>
);

export default PaymentFailurePage;
