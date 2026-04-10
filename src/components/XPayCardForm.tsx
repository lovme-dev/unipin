import { useState, useImperativeHandle, forwardRef } from 'react';
import { useXpay } from '@/components/XPayProvider';
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface XPayCardFormRef {
  submit: () => Promise<void>;
  isReady: boolean;
  isProcessing: boolean;
  isCardComplete: boolean;
}

interface XPayCardFormProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerPhone: string;
  productName?: string;
  productType?: string;
  productAmount?: string;
  playerId?: string;
  packageId?: string;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
}

const getFriendlyErrorMessage = (errorMessage: string): string => {
  const lower = errorMessage.toLowerCase();
  if (lower.includes('declined') || lower.includes('do not honor')) return 'Your card was declined. Please try a different card or contact your bank.';
  if (lower.includes('insufficient') || lower.includes('balance')) return 'Insufficient funds. Please check your balance.';
  if (lower.includes('expired')) return 'Your card has expired. Please use a different card.';
  if (lower.includes('invalid card') || lower.includes('card number')) return 'Invalid card number. Please check and re-enter.';
  if (lower.includes('cvc') || lower.includes('cvv')) return 'Invalid security code (CVV).';
  if (lower.includes('network') || lower.includes('timeout')) return 'Network error. Please check your connection.';
  if (errorMessage.length > 0) return `Payment failed: ${errorMessage}`;
  return 'An unexpected error occurred. Please try again.';
};

const XPayCardForm = forwardRef<XPayCardFormRef, XPayCardFormProps>(({
  amount,
  currency = "PKR",
  customerEmail,
  customerPhone,
  productName = "Diamond Package",
  productType = "freefire_diamonds",
  productAmount,
  playerId,
  packageId,
  onSuccess,
  onError,
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const xpay = useXpay();

  const isCardComplete = cardNumber.replace(/\s/g, '').length >= 15 && expiry.length === 5 && cvc.length >= 3;

  useImperativeHandle(ref, () => ({
    submit: handlePayment,
    isReady: !!xpay?.isReady,
    isProcessing: loading,
    isCardComplete,
  }), [xpay?.isReady, loading, isCardComplete]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePayment = async () => {
    if (!xpay) {
      setError('Payment system not initialized. Please refresh.');
      return;
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      setError('Valid email is required');
      return;
    }
    if (!isCardComplete) {
      setError('Please fill in all card details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { data, error: intentError } = await supabase.functions.invoke('xpay-create-payment', {
        body: {
          amount,
          currency,
          orderId,
          customerEmail,
          customerName: 'Customer',
          customerPhone: customerPhone || '03001234567',
          productName,
          productType,
          productAmount,
          playerId,
          packageId,
          successUrl: `${window.location.origin}/?paymentSuccess=true&orderId=${orderId}`,
          cancelUrl: `${window.location.origin}/?paymentFailed=true&orderId=${orderId}`,
        },
      });

      if (intentError) throw new Error(intentError.message || 'Failed to create payment');
      if (!data?.clientSecret || !data?.encryptionKey) throw new Error(data?.error || 'Payment initialization failed');

      const { clientSecret, encryptionKey } = data;

      const confirmResult = await xpay.confirmPayment(
        "card",
        clientSecret,
        { name: 'Customer', email: customerEmail, phone: customerPhone || '03001234567' },
        encryptionKey
      );

      if (confirmResult.error) throw new Error(confirmResult.message || 'Payment failed');

      onSuccess({
        orderId: data.orderId || orderId,
        amount,
        currency,
        paymentMethod: "Credit Card",
        status: "succeeded"
      });

    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.message || '');
      setError(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-foreground font-medium mb-1.5 block">Card Number</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 1234 1234 1234"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-foreground font-medium mb-1.5 block">Expiry Date</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
        <div>
          <label className="text-sm text-foreground font-medium mb-1.5 block">CVV</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
});

XPayCardForm.displayName = 'XPayCardForm';
export default XPayCardForm;
export { XPayCardForm };
