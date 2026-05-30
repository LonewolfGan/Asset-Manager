import { useState, useEffect } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PasswordGenerator() {
  const { t } = useLocale();
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pronounceable, setPronounceable] = useState(false);
  const [count, setCount] = useState(1);
  
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('password_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
    generate();
  }, []);

  const generateSingle = () => {
    if (pronounceable) {
      const cons = "bcdfghjklmnpqrstvwxyz";
      const vows = "aeiou";
      let pw = "";
      for (let i = 0; i < length; i++) {
        const chars = i % 2 === 0 ? cons : vows;
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        pw += chars[array[0] % chars.length];
      }
      return pw;
    }
    
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;':\",.<>?/";
    
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    
    let pw = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pw += chars[array[i] % chars.length];
    }
    return pw;
  };

  const generate = () => {
    trackToolUsed('password-generator', 'utilities');
    const pws = [];
    for (let i = 0; i < count; i++) {
      pws.push(generateSingle());
    }
    setPasswords(pws);
    
    const newHistory = [...pws, ...history].slice(0, 10);
    setHistory(newHistory);
    sessionStorage.setItem('password_history', JSON.stringify(newHistory));
  };

  const getEntropy = () => {
    let R = 0;
    if (pronounceable) R = 21; // simplified avg
    else {
      if (uppercase) R += 26;
      if (lowercase) R += 26;
      if (numbers) R += 10;
      if (symbols) R += 32;
      if (R === 0) R = 26;
    }
    return length * Math.log2(R);
  };

  const entropy = getEntropy();
  const pg = t.passwordGenerator;
  const strengthLabel =
    entropy < 40  ? pg.strength.weak :
    entropy < 60  ? pg.strength.fair :
    entropy < 80  ? pg.strength.strong :
    entropy < 100 ? pg.strength.veryStrong :
                    pg.strength.exceptional;
  const strengthColor =
    entropy < 40  ? "var(--text-tertiary)" :
    entropy < 60  ? "var(--text-secondary)" :
    entropy < 80  ? "var(--text-primary)" :
                    "var(--accent)";

  const handleCopy = (text: string) => {
    copyWithToast(text);
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Calculators', 'Password Generator']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['password-generator']?.title ?? 'Password Generator'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['password-generator']?.description ?? 'Generate cryptographically secure passwords locally.'}</p>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all', margin: 0 }}>{passwords[0] || ""}</h2>
          <button onClick={() => handleCopy(passwords[0])} style={{ padding: '8px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{pg.copy}</button>
        </div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: strengthColor }}>{strengthLabel}</span>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>({Math.round(entropy)} bits)</span>
        </div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 24 }}>
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: strengthColor,
            width: `${Math.min(100, (entropy / 128) * 100)}%`,
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label htmlFor="pw-length" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{pg.length(length)}</label>
            </div>
            <input id="pw-length" type="range" min="8" max="128" value={length} onChange={e => setLength(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} disabled={pronounceable} style={{ accentColor: 'var(--accent)' }} /> {pg.uppercase}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} disabled={pronounceable} style={{ accentColor: 'var(--accent)' }} /> {pg.lowercase}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} disabled={pronounceable} style={{ accentColor: 'var(--accent)' }} /> {pg.numbers}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} disabled={pronounceable} style={{ accentColor: 'var(--accent)' }} /> {pg.symbols}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', gridColumn: '1 / -1', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={pronounceable} onChange={e => setPronounceable(e.target.checked)} style={{ accentColor: 'var(--accent)' }} /> {pg.pronounceable}
            </label>
          </div>
          
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="pw-count" style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{pg.count}</label>
              <select id="pw-count" value={count} onChange={e => setCount(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', outline: 'none' }}>
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <button onClick={generate} style={{ flex: 2, padding: '10px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              {pg.regenerate}
            </button>
          </div>
        </div>
      </div>
      
      {passwords.length > 1 && (
        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', maxHeight: 300, overflow: 'auto' }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{pg.bulkGeneration}</h3>
          {passwords.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>{p}</span>
              <button onClick={() => handleCopy(p)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)' }}>{pg.copy}</button>
            </div>
          ))}
        </div>
      )}
      
      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{pg.history}</h3>
            <button onClick={() => { setHistory([]); sessionStorage.removeItem('password_history'); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)' }}>{pg.clearHistory}</button>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            {history.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i === history.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="password-generator" />
  </>
  );
}
