import { useState, useImperativeHandle, forwardRef } from 'react';
import { AlertCircle } from "lucide-react";
import { PaymentElement, type OptionsProps } from '@xstak/xpay-element-live-v4';
import { useXpay } from '@/components/XPayProvider';
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
  if (lower.includes('sdk') || lower.includes('loading')) return 'Payment form abhi load ho raha hai, 2 second baad dobara try karein.';
  if (lower.includes('declined') || lower.includes('do not honor')) return 'Your card was declined. Please try a different card or contact your bank.';
  if (lower.includes('insufficient') || lower.includes('balance')) return 'Insufficient funds. Please check your balance.';
  if (lower.includes('expired')) return 'Your card has expired. Please use a different card.';
  if (lower.includes('invalid card') || lower.includes('card number')) return 'Invalid card number. Please check and re-enter.';
  if (lower.includes('cvc') || lower.includes('cvv')) return 'Invalid security code (CVV).';
  if (lower.includes('network') || lower.includes('timeout')) return 'Network error. Please check your connection.';
  if (lower.includes('non-json')) return 'Payment gateway error. Please try again.';
  if (lower.includes('not configured')) return 'Payment system not fully configured. Please contact support.';
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
  const [isReady, setIsReady] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const xpay = useXpay();

  const paymentOptions: OptionsProps = {
    paymentMethods: ['card'],
    override: true,
    fields: {
      creditCard: {
        placeholder: '1234 1234 1234 1234',
        label: 'Card Number',
      },
      exp: {
        placeholder: 'MM/YY',
        label: 'Expiry Date',
      },
      cvc: {
        placeholder: 'CVC',
        label: 'CVV',
      },
    },
    style: {
      '.input': {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '16px',
        padding: '14px 16px',
        border: '1px solid #444',
        borderRadius: '16px',
        background: '#FFFFFF',
        color: '#111111',
        transition: 'all 0.2s ease',
      },
      '.input:focus': {
        borderColor: '#ED6B26',
        boxShadow: '0 0 0 1px rgba(237, 107, 38, 0.35)',
        outline: 'none',
      },
      '.input:hover': {
        borderColor: 'rgba(237, 107, 38, 0.7)',
      },
      '.invalid': {
        borderColor: '#ef4444',
      },
      '.label': {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: '8px',
      },
      '::placeholder': {
        color: '#999999',
      },
    },
  };

  const handlePayment = async () => {
    if (!xpay || typeof xpay.confirmPayment !== 'function') {
      const message = 'Payment form abhi ready nahi hai. Thora wait karke dobara try karein.';
      setError(message);
      onError(message);
      return;
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      const message = 'Valid email is required';
      setError(message);
      onError(message);
      return;
    }

    if (!isReady) {
      const message = 'Payment form abhi load ho raha hai, please ek moment baad dobara try karein.';
      setError(message);
      onError(message);
      return;
    }

    if (!isCardComplete) {
      const message = 'Please fill in all card details';
      setError(message);
      onError(message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const phoneNumber = customerPhone?.trim() || '03001234567';

      const { data, error: intentError } = await supabase.functions.invoke('xpay-create-payment', {
        body: {
          amount,
          currency,
          orderId,
          customerEmail,
          customerName: 'Customer',
          customerPhone: phoneNumber,
          productName,
          productType,
          productAmount,
          playerId,
          packageId,
        },
      });

      if (intentError) throw new Error(intentError.message || 'Failed to create payment');
      if (!data?.success) throw new Error(data?.error || 'Payment initialization failed');

      const { clientSecret, encryptionKey } = data;

      if (!clientSecret || !encryptionKey) throw new Error('Payment initialization failed');

      console.log('[XPayCardForm] Confirming payment...');
      const confirmResult = await xpay.confirmPayment(
        "card",
        clientSecret,
        { name: 'Customer', email: customerEmail, phone: phoneNumber },
        encryptionKey
      );

      console.log('[XPayCardForm] Payment result:', confirmResult);

      if (confirmResult?.error) {
        throw new Error(confirmResult.message || confirmResult.error || 'Payment failed');
      }

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

  useImperativeHandle(ref, () => ({
    submit: handlePayment,
    isReady,
    isProcessing: loading,
    isCardComplete,
  }), [handlePayment, isReady, loading, isCardComplete]);

  return (
    <div className="space-y-3">
      <div className="xpay-element-container">
        <PaymentElement
          options={paymentOptions}
          onIframeLoaded={() => setIsReady(true)}
          onReady={(event: any) => {
            console.log('[XPayCardForm] PaymentElement event:', event);

            if (event?.field === 'all' || event?.complete === true) {
              const complete = event?.ready === true || event?.complete === true;
              setIsReady(true);
              setIsCardComplete(complete);
              return;
            }

            if (event?.ready === false) {
              setIsCardComplete(false);
            }
          }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <style>{`
        .xpay-element-container iframe {
          width: 100% !important;
          border: 0 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
});

XPayCardForm.displayName = 'XPayCardForm';
export default XPayCardForm;
export { XPayCardForm };
