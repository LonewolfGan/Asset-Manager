import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FormatSelector from '@/components/FormatSelector';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { CURRENCIES, FALLBACK_RATES, FALLBACK_DATE } from '@/config/currencies.config';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CurrencyConverter() {
  const { t, locale } = useLocale();
  const isMobile = useIsMobile();
  type SourceInfo = { type: 'loading' } | { type: 'live'; age: number } | { type: 'offline'; date: string };
  const [rates, setRates] = useState<Record<string, number>>({});
  const [sourceInfo, setSourceInfo] = useState<SourceInfo>({ type: 'loading' });
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const copyResult = () => {
    if (result === '—') return;
    navigator.clipboard.writeText(`${result} ${toCurrency}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const CACHE_KEY = 'et_currency_rates_v2';
    const TTL_MS = 3_600_000; // 1 hour

    const fetchRates = async () => {
      // Try localStorage cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates: cachedRates, timestamp } = JSON.parse(cached) as { rates: Record<string, number>; timestamp: number };
          if (Date.now() - timestamp < TTL_MS) {
            setRates(cachedRates);
            const ageMinutes = Math.round((Date.now() - timestamp) / 60_000);
            setSourceInfo({ type: 'live', age: ageMinutes });
            return;
          }
        }
      } catch { /* ignore */ }

      // Fetch directly from the public exchange rate API (no key required, CORS-enabled)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) throw new Error("Upstream error");
        const data = await res.json() as { rates: Record<string, number> };
        if (!data?.rates) throw new Error("Invalid response");
        setRates(data.rates);
        setSourceInfo({ type: 'live', age: 0 });
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, timestamp: Date.now() }));
        } catch { /* quota exceeded — non-fatal */ }
      } catch {
        setRates(FALLBACK_RATES);
        setSourceInfo({ type: 'offline', date: FALLBACK_DATE });
      }
    };

    fetchRates();
    
    const h = localStorage.getItem('currency_history');
    if (h) {
      try { setHistory(JSON.parse(h)); } catch(e){}
    }
  }, []);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const calculate = (val: string, f: string, t: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || Object.keys(rates).length === 0) return "—";
    
    const rateFrom = rates[f] || FALLBACK_RATES[f];
    const rateTo = rates[t] || FALLBACK_RATES[t];
    
    if (!rateFrom || !rateTo) return "—";
    
    const inUSD = num / rateFrom;
    const result = inUSD * rateTo;
    return result.toFixed(2);
  };

  const result = calculate(amount, fromCurrency, toCurrency);

  const saveHistory = () => {
    const item = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    const newHistory = [item, ...history.filter(h => h !== item)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('currency_history', JSON.stringify(newHistory));
  };
  
  // Save history on blur or after slight delay
  useEffect(() => {
    if (result !== "—" && parseFloat(amount) > 0) {
      trackToolUsed('currency-converter', 'calculators');
      const timer = setTimeout(saveHistory, 2000);
      return () => clearTimeout(timer);
    }
    return;
  }, [amount, fromCurrency, toCurrency, result]);

  const currencyDisplayNames = (() => {
    try { return new Intl.DisplayNames([locale.toLowerCase()], { type: 'currency' }); } catch { return null; }
  })();
  const currencyOptions = CURRENCIES.map(c => ({
    value: c.code,
    label: `${c.code} - ${currencyDisplayNames?.of(c.code) || c.name}`
  }));

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={['Home', 'Calculators', 'Currency Converter']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['currency-converter']?.title ?? 'Currency Converter'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['currency-converter']?.description ?? 'Convert between 170 currencies with live exchange rates.'}</p>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="currency-from-selector" style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 8, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.from}</label>
              <FormatSelector options={currencyOptions} value={fromCurrency} onChange={setFromCurrency} aria-label={t.currencyConverter.from} />
            </div>
            <button onClick={handleSwap} aria-label={t.unitConverter.swapAriaLabel} style={{ marginTop: isMobile ? 0 : 26, alignSelf: isMobile ? 'center' : 'auto', padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', lineHeight: 1 }}>⇄</button>
            <div style={{ flex: 1 }}>
              <label htmlFor="currency-to-selector" style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 8, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.to}</label>
              <FormatSelector options={currencyOptions} value={toCurrency} onChange={setToCurrency} aria-label={t.currencyConverter.to} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, marginTop: 16 }}>
            <div>
              <label htmlFor="currency-amount" style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.from}</label>
              <input id="currency-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: 24, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', border: 'none', borderBottom: '2px solid var(--accent)', outline: 'none', background: 'var(--bg)', borderRadius: 'var(--radius) var(--radius) 0 0' }} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', marginBottom: 6, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.to}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border)', gap: 8 }}>
                <div
                  className="result-copyable"
                  tabIndex={result !== "—" ? 0 : -1}
                  role={result !== "—" ? "button" : undefined}
                  aria-label={result !== "—" ? `${result} ${toCurrency} — press Enter or Ctrl+C to copy` : undefined}
                  onClick={result !== "—" ? copyResult : undefined}
                  onKeyDown={result !== "—" ? (e) => { if (e.key === 'Enter' || e.key === ' ' || ((e.ctrlKey || e.metaKey) && e.key === 'c')) { e.preventDefault(); copyResult(); } } : undefined}
                  style={{ padding: '16px 0', fontSize: 24, fontFamily: 'var(--font-mono)', color: result === "—" ? 'var(--text-tertiary)' : 'var(--text-primary)' }}
                >
                  {result}
                </div>
                {result !== "—" && (
                  <button
                    onClick={copyResult}
                    aria-label="Copy result"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0, transition: 'border-color 150ms, color 150ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = copied ? 'var(--accent)' : 'var(--text-secondary)'; }}
                  >
                    {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 8, textAlign: 'right', fontFamily: 'var(--font-ui)' }}>
            {sourceInfo.type === 'live'
              ? (sourceInfo.age > 0 ? t.currencyConverter.liveRatesUpdated(sourceInfo.age) : t.currencyConverter.liveRatesJust)
              : sourceInfo.type === 'offline'
              ? t.currencyConverter.offlineSnapshot(sourceInfo.date)
              : ''}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.quickConversions}</h3>
          <table style={{ width: '100%', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            <tbody>
              {[1, 10, 100, 1000, 10000].map(amt => (
                <tr key={amt}>
                  <td style={{ padding: '4px 0', color: 'var(--muted)' }}>{amt} {fromCurrency}</td>
                  <td style={{ padding: '4px 0', textAlign: 'right' }}>{calculate(amt.toString(), fromCurrency, toCurrency)} {toCurrency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.recentHistory}</h3>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>{h}</div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>{t.currencyConverter.noRecent}</p>
          )}
        </div>
      </div>
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="currency-converter" />
  </>
  );
}
