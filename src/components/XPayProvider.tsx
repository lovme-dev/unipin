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
  const [sdkReady, setSdkReady] = useState(false);

  // Wait for CDN script to load
  useEffect(() => {
    const checkSdk = () => {
      if (typeof window !== 'undefined' && (window as any).Xpay) {
        setSdkReady(true);
        return true;
      }
      return false;
    };

    if (checkSdk()) return;

    const interval = setInterval(() => {
      if (checkSdk()) clearInterval(interval);
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!(window as any).Xpay) {
        setError('Payment SDK failed to load. Please refresh the page.');
        setLoading(false);
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Fetch config once SDK is ready
  useEffect(() => {
    if (!sdkReady) return;

    const fetchConfig = async () => {
      try {
        const { data, error: fetchErr } = await supabase.functions.invoke('xpay-config');
        
        if (fetchErr || !data?.publishableKey) {
          throw new Error('Could not load payment configuration');
        }
        
        console.log('[XPayProvider] Config loaded, initializing SDK...');
        setConfig({
          publishableKey: data.publishableKey,
          accountId: data.accountId,
          hmacSecret: data.hmacSecret,
        });
      } catch (err: any) {
        console.error('[XPayProvider] Config error:', err);
        setError(err.message || 'Payment system unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [sdkReady]);

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

  const xpayInstance = (window as any).Xpay;

  const confirmPayment = async (type: string, clientSecret: string, customer: any, encryptionKey: string) => {
    if (!xpayInstance) throw new Error('XPay SDK not available');
    return xpayInstance.confirmPayment(type, clientSecret, customer, encryptionKey);
  };

  return (
    <XPayContext.Provider value={{ confirmPayment, isReady: true }}>
      {children}
    </XPayContext.Provider>
  );
};

export default XPayProvider;
