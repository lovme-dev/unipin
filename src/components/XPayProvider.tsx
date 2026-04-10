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
  const [xpayInstance, setXpayInstance] = useState<any>(null);

  // Fetch config and initialize SDK
  useEffect(() => {
    const init = async () => {
      try {
        // Fetch config
        const { data, error: fetchErr } = await supabase.functions.invoke('xpay-config');
        
        if (fetchErr || !data?.publishableKey) {
          throw new Error('Could not load payment configuration');
        }
        
        console.log('[XPayProvider] Config loaded successfully');
        setConfig({
          publishableKey: data.publishableKey,
          accountId: data.accountId,
          hmacSecret: data.hmacSecret,
        });

        // Import and initialize XPay SDK
        const xpayModule = await import('@xstak/xpay-element-live-v4');
        const XPaySDK = xpayModule.XPay || xpayModule.default || xpayModule;
        
        if (XPaySDK && typeof XPaySDK === 'function') {
          const instance = new XPaySDK({
            publishableKey: data.publishableKey,
            accountId: data.accountId,
            hmacSecret: data.hmacSecret,
            email,
            customerName,
          });
          setXpayInstance(instance);
        } else if (typeof window !== 'undefined' && (window as any).Xpay) {
          setXpayInstance((window as any).Xpay);
        } else {
          // SDK loaded as module, store reference
          setXpayInstance(XPaySDK);
        }
      } catch (err: any) {
        console.error('[XPayProvider] Init error:', err);
        setError(err.message || 'Payment system unavailable');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [email, customerName]);

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

  const confirmPayment = async (type: string, clientSecret: string, customer: any, encryptionKey: string) => {
    if (xpayInstance?.confirmPayment) {
      return xpayInstance.confirmPayment(type, clientSecret, customer, encryptionKey);
    }
    // Fallback: check window.Xpay
    if (typeof window !== 'undefined' && (window as any).Xpay?.confirmPayment) {
      return (window as any).Xpay.confirmPayment(type, clientSecret, customer, encryptionKey);
    }
    throw new Error('XPay SDK not available');
  };

  return (
    <XPayContext.Provider value={{ confirmPayment, isReady: true }}>
      {children}
    </XPayContext.Provider>
  );
};

export default XPayProvider;
