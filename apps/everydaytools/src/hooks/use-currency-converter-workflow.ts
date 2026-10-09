import { useState, useEffect, useMemo, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { CURRENCIES, FALLBACK_RATES, FALLBACK_DATE } from '@/config/currencies.config';
import { useLocale } from '@/hooks/use-locale';
import { getCurrencyMeta } from '@/lib/currency-meta';
import {
  getDirectRate,
  parseCurrencyAmount,
  formatConvertedValue,
} from '@/lib/currency-converter-logic';

export type CurrencySourceInfo =
  | { type: 'loading' }
  | { type: 'live'; age: number; timeStr: string }
  | { type: 'offline'; date: string };

const CACHE_KEY = 'et_currency_rates_v4';
const TTL_MS = 1_800_000; // 30 minutes cache

export function useCurrencyConverterWorkflow() {
  const { t, locale, isFr } = useLocale();

  const [rates, setRates] = useState<Record<string, number>>({});
  const [sourceInfo, setSourceInfo] = useState<CurrencySourceInfo>({ type: 'loading' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');

  const [isSwapping, setIsSwapping] = useState(false);
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    target: 'from' | 'to';
  }>({
    isOpen: false,
    target: 'from',
  });

  const currencyMap = useMemo(() => {
    const map = new Map<string, { code: string; name: string; symbol: string }>();
    for (const c of CURRENCIES) {
      map.set(c.code, c);
    }
    return map;
  }, []);

  const fetchRates = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    }

    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates: cachedRates, timestamp } = JSON.parse(cached) as {
            rates: Record<string, number>;
            timestamp: number;
          };
          if (Date.now() - timestamp < TTL_MS) {
            setRates(cachedRates);
            const ageMinutes = Math.round((Date.now() - timestamp) / 60_000);
            const timeStr = new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            setSourceInfo({ type: 'live', age: ageMinutes, timeStr });
            return;
          }
        }
      } catch {
        /* storage read error fallback */
      }
    }

    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Erreur de réseau upstream');
      const data = (await res.json()) as { rates: Record<string, number> };
      if (!data?.rates) throw new Error('Payload invalide');

      setRates(data.rates);
      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSourceInfo({ type: 'live', age: 0, timeStr });

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ rates: data.rates, timestamp: now })
        );
      } catch {
        /* quota */
      }
    } catch {
      setRates(FALLBACK_RATES);
      setSourceInfo({ type: 'offline', date: FALLBACK_DATE });
    } finally {
      if (forceRefresh) {
        setTimeout(() => setIsRefreshing(false), 350);
      }
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const parsedAmount = useMemo(() => parseCurrencyAmount(amount), [amount]);

  const convertedValue = useMemo(() => {
    return formatConvertedValue(
      parsedAmount,
      fromCurrency,
      toCurrency,
      rates,
      locale || 'fr-FR',
      amount
    );
  }, [parsedAmount, amount, fromCurrency, toCurrency, rates, locale]);

  const directRate = useMemo(
    () => getDirectRate(fromCurrency, toCurrency, rates),
    [fromCurrency, toCurrency, rates]
  );

  const inverseRate = useMemo(
    () => getDirectRate(toCurrency, fromCurrency, rates),
    [toCurrency, fromCurrency, rates]
  );

  useEffect(() => {
    if (parsedAmount > 0 && convertedValue !== '—') {
      trackToolUsed('currency-converter', 'calculators');
    }
  }, [parsedAmount, convertedValue]);

  const handleSwap = useCallback(() => {
    setIsSwapping(true);
    setFromCurrency((prev) => {
      setToCurrency(prev);
      return toCurrency;
    });
    setTimeout(() => setIsSwapping(false), 200);
  }, [toCurrency]);

  const handleSelectCurrency = useCallback((code: string) => {
    setPickerModal((prevModal) => {
      if (prevModal.target === 'from') {
        if (code === toCurrency) {
          setToCurrency(fromCurrency);
        }
        setFromCurrency(code);
      } else {
        if (code === fromCurrency) {
          setFromCurrency(toCurrency);
        }
        setToCurrency(code);
      }
      return { ...prevModal, isOpen: false };
    });
  }, [fromCurrency, toCurrency]);

  const handleSelectPair = useCallback((from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  }, []);

  const fromMeta = getCurrencyMeta(fromCurrency);
  const toMeta = getCurrencyMeta(toCurrency);
  const fromInfo = currencyMap.get(fromCurrency) || {
    code: fromCurrency,
    name: fromCurrency,
    symbol: '',
  };
  const toInfo = currencyMap.get(toCurrency) || {
    code: toCurrency,
    name: toCurrency,
    symbol: '',
  };

  return {
    t,
    locale,
    isFr,
    rates,
    sourceInfo,
    isRefreshing,
    fetchRates,
    fromCurrency,
    toCurrency,
    amount,
    setAmount,
    isSwapping,
    pickerModal,
    setPickerModal,
    convertedValue,
    directRate,
    inverseRate,
    fromMeta,
    toMeta,
    fromInfo,
    toInfo,
    handleSwap,
    handleSelectCurrency,
    handleSelectPair,
  };
}
