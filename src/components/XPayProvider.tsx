import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface XPayConfig {
  publishableKey: string;
  accountId: string;
  hmacSecret: string;
}

interface XPayProviderProps {
  children: ReactNode;
  email?: string;
  customerName?: string;
}

interface XPayContextType {
  confirmPayment: (type: string, clientSecret: string, customer: any, encryptionKey: string) => Promise<any>;
  isReady: boolean;
}

const XPayContext = createContext<XPayContextType | null>(null);

export const useXpay = () => useContext(XPayContext);

export const XPayProvider = ({ children, email, customerName }: XPayProviderProps) => {
  const [config, setConfig] = useState<XPayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [xpayModule, setXpayModule] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch config from edge function
        const { data, error: fetchErr } = await supabase.functions.invoke('xpay-config');
        
        if (fetchErr || !data?.publishableKey) {
          throw new Error('Could not load payment configuration');
        }
        
        console.log('[XPayProvider] Config loaded successfully');
        const cfg = {
          publishableKey: data.publishableKey,
          accountId: data.accountId,
          hmacSecret: data.hmacSecret,
        };
        setConfig(cfg);

        // Try to load the npm SDK module
        try {
          const mod = await import('@xstak/xpay-element-live-v4');
          console.log('[XPayProvider] SDK module loaded, exports:', Object.keys(mod));
          setXpayModule(mod);
        } catch (sdkErr) {
          console.warn('[XPayProvider] SDK module load failed, falling back to CDN:', sdkErr);
        }
      } catch (err: any) {
        console.error('[XPayProvider] Init error:', err);
        setError(err.message || 'Payment system unavailable');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Loading payment form...
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
        {error || 'Payment configuration unavailable'}
      </div>
    );
  }

  // Get confirmPayment from SDK module or CDN
  const getConfirmPayment = () => {
    // Check npm module first
    if (xpayModule) {
      // The useXpay hook from the module might provide confirmPayment
      if (xpayModule.default?.confirmPayment) return xpayModule.default.confirmPayment;
      if (xpayModule.Xpay?.confirmPayment) return xpayModule.Xpay.confirmPayment;
    }
    // Fallback to CDN global
    if (typeof window !== 'undefined' && (window as any).Xpay?.confirmPayment) {
      return (window as any).Xpay.confirmPayment.bind((window as any).Xpay);
    }
    return null;
  };

  const confirmPaymentFn = getConfirmPayment();

  const confirmPayment = async (type: string, clientSecret: string, customer: any, encryptionKey: string) => {
    if (confirmPaymentFn) {
      return confirmPaymentFn(type, clientSecret, customer, encryptionKey);
    }
    throw new Error('XPay SDK not available - confirmPayment not found');
  };

  return (
    <XPayContext.Provider value={{ confirmPayment, isReady: true }}>
      {children}
    </XPayContext.Provider>
  );
};

export default XPayProvider;
