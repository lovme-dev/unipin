import { useState, useEffect } from "react";

interface ExchangeRates {
  [currency: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function useCurrency(targetCurrency: string) {
  const [rates, setRates] = useState<ExchangeRates | null>(cachedRates);
  const [loading, setLoading] = useState(!cachedRates);

  useEffect(() => {
    if (cachedRates && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setRates(cachedRates);
      setLoading(false);
      return;
    }

    fetch("https://api.exchangerate-api.com/v4/latest/IDR")
      .then((res) => res.json())
      .then((data) => {
        cachedRates = data.rates;
        cacheTimestamp = Date.now();
        setRates(data.rates);
      })
      .catch(() => {
        // Fallback: use 1:1 if API fails
        setRates(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const convert = (idrAmount: number): { amount: number; formatted: string } => {
    if (!rates || !rates[targetCurrency] || targetCurrency === "IDR") {
      return { amount: idrAmount, formatted: formatNumber(idrAmount) };
    }
    const converted = idrAmount * rates[targetCurrency];
    return { amount: converted, formatted: formatCurrency(converted, targetCurrency) };
  };

  return { convert, loading, rates };
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatCurrency(amount: number, currency: string): string {
  // For currencies with very small values per unit, show more decimals
  const smallValueCurrencies = ["BHD", "KWD", "OMR"];
  const maxDecimals = smallValueCurrencies.includes(currency) ? 3 : 2;
  
  if (amount < 0.01) return amount.toFixed(maxDecimals);
  if (amount < 1) return amount.toFixed(maxDecimals);
  if (amount >= 1000) return amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return amount.toLocaleString("en-US", { maximumFractionDigits: maxDecimals });
}
