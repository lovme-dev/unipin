import { ReactNode, useEffect, useState } from 'react';
import { XPay, useXpay } from '@xstak/xpay-element-live-v4';
import { supabase } from "@/integrations/supabase/client";

const XPAY_SCRIPT_SRC = 'https://js.xstak.com/v4/xpay.js';

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

const ensureXPayScript = async (): Promise<void> => {
  if (typeof window === 'undefined' || (window as any).Xpay) {
    return;
  }

  const existingScript = document.querySelector(`script[src="${XPAY_SCRIPT_SRC}"]`) as HTMLScriptElement | null;
  const script = existingScript ?? document.createElement('script');

  if (!existingScript) {
    script.src = XPAY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      window.clearInterval(pollId);
      window.clearTimeout(timeoutId);
    };

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };

    const handleLoad = () => {
      if ((window as any).Xpay) {
        finish(resolve);
        return;
      }

      finish(() => reject(new Error('Payment SDK failed to load. Please refresh the page.')));
    };

    const handleError = () => {
      finish(() => reject(new Error('Payment SDK failed to load. Please refresh the page.')));
    };

    const pollId = window.setInterval(() => {
      if ((window as any).Xpay) {
        finish(resolve);
      }
    }, 100);

    const timeoutId = window.setTimeout(handleError, 10000);

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    if ((window as any).Xpay) {
      finish(resolve);
    }
  });
};

export { useXpay };

export const XPayProvider = ({ children, email, customerName }: XPayProviderProps) => {
  const [config, setConfig] = useState<XPayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const init = async () => {
      try {
        const [, response] = await Promise.all([
          ensureXPayScript(),
          supabase.functions.invoke('xpay-config'),
        ]);

        const { data, error: fetchError } = response;

        if (fetchError || !data?.publishableKey || !data?.accountId || !data?.hmacSecret) {
          throw new Error('Could not load payment configuration');
        }

        console.log('[XPayProvider] Config loaded successfully');

        if (!isActive) return;

        setConfig({
          publishableKey: data.publishableKey,
          accountId: data.accountId,
          hmacSecret: data.hmacSecret,
        });
      } catch (err: any) {
        console.error('[XPayProvider] Init error:', err);

        if (!isActive) return;

        setError(err.message || 'Payment system unavailable');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void init();

    return () => {
      isActive = false;
    };
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

  return (
    <XPay
      xpay={{
        publishableKey: config.publishableKey,
        accountId: config.accountId,
        hmacSecret: config.hmacSecret,
        email,
        customerName,
      }}
    >
      {children}
    </XPay>
  );
};

export default XPayProvider;
