import { useState, useEffect } from 'react';
import FormatSelector from '@/components/FormatSelector';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { CURRENCIES, FALLBACK_RATES, FALLBACK_DATE } from '@/config/currencies.config';
import ToolPageSEO from '@/components/ToolPageSEO';

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [source, setSource] = useState<string>("Loading...");
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem('currency_rates_cache');
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < 3600000) { // 1h
            setRates(data.rates);
            setSource(`Live rates, updated ${Math.round((Date.now() - timestamp)/60000)} min ago`);
            return;
          }
        }
        
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
          setSource('Live rates, updated 0 min ago');
          localStorage.setItem('currency_rates_cache', JSON.stringify({ timestamp: Date.now(), data }));
        } else {
          throw new Error("Invalid API response");
        }
      } catch (e) {
        setRates(FALLBACK_RATES);
        setSource(`Offline snapshot — rates as of ${FALLBACK_DATE}`);
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
      const timer = setTimeout(saveHistory, 2000);
      return () => clearTimeout(timer);
    }
  }, [amount, fromCurrency, toCurrency, result]);

  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` }));

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Calculators', 'Currency Converter']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Currency Converter</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert between 170 currencies with live exchange rates.</p>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>From</label>
              <FormatSelector options={currencyOptions} value={fromCurrency} onChange={setFromCurrency} />
            </div>
            <button onClick={handleSwap} style={{ marginTop: 26, padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer' }}>⇄</button>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>To</label>
              <FormatSelector options={currencyOptions} value={toCurrency} onChange={setToCurrency} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 16 }}>
            <div>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: 24, fontFamily: 'IBM Plex Mono, monospace', border: 'none', borderBottom: '2px solid var(--accent)', outline: 'none', background: 'var(--bg)', borderRadius: 'var(--radius) var(--radius) 0 0' }} />
            </div>
            <div style={{ padding: '16px 0', fontSize: 24, fontFamily: 'IBM Plex Mono, monospace', borderBottom: '2px solid var(--border)', color: result === "—" ? 'var(--muted)' : 'var(--text)' }}>
              {result}
            </div>
          </div>
          
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, textAlign: 'right' }}>
            {source}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Quick Conversions</h3>
          <table style={{ width: '100%', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>
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
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Recent History</h3>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>{h}</div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>No recent conversions.</p>
          )}
        </div>
      </div>
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="currency-converter" />
  </>
  );
}
