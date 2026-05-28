import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PercentageCalc() {
  const { t } = useLocale();
  const [tab, setTab] = useState<'of'|'isWhat'|'change'|'discount'|'tip'|'markup'>('of');
  
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [n, setN] = useState("1"); // for tip split

  const getResult = () => {
    const vx = parseFloat(x);
    const vy = parseFloat(y);
    const vn = parseFloat(n);
    
    if (isNaN(vx) || isNaN(vy)) return "—";
    
    switch (tab) {
      case 'of': 
        return `${(vx / 100) * vy}`;
      case 'isWhat': 
        return `${(vx / vy) * 100}%`;
      case 'change': 
        const change = ((vy - vx) / vx) * 100;
        return `${Math.abs(change).toFixed(2)}% ${change >= 0 ? 'Increase' : 'Decrease'}`;
      case 'discount':
        const final = vy * (1 - vx / 100);
        const saved = vy * (vx / 100);
        return `Final: ${final.toFixed(2)} (Saved: ${saved.toFixed(2)})`;
      case 'tip':
        if (isNaN(vn) || vn < 1) return "—";
        const tip = vy * (vx / 100);
        const total = vy + tip;
        const perPerson = total / vn;
        return `Total: ${total.toFixed(2)} (Tip: ${tip.toFixed(2)}) — Per Person: ${perPerson.toFixed(2)}`;
      case 'markup':
        const selling = vy / (1 - vx / 100);
        const markup = selling - vy;
        return `Selling Price: ${selling.toFixed(2)} (Markup: ${markup.toFixed(2)})`;
      default:
        return "—";
    }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Calculators', 'Percentage Calculator']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['percentage-calc']?.title ?? 'Percentage Calculator'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['percentage-calc']?.description ?? 'Instantly calculate percentages, discounts, tips, and margins.'}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'of', label: 'X % of Y' },
          { id: 'isWhat', label: 'X is what % of Y' },
          { id: 'change', label: 'Percentage Change' },
          { id: 'discount', label: 'Discount' },
          { id: 'tip', label: 'Tip & Split' },
          { id: 'markup', label: 'Markup / Margin' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id as any); setX(""); setY(""); }}
            style={{ padding: '8px 16px', background: tab === t.id ? 'var(--accent)' : 'var(--bg)', color: tab === t.id ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 14 }}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {tab === 'of' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>What is (X)%</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>of (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
          {tab === 'isWhat' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>(X) is what percent</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>of (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
          {tab === 'change' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Change from (X)</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>to (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
          {tab === 'discount' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Discount % (X)</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Original Price (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
          {tab === 'tip' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Tip % (X)</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Bill Amount (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div style={{gridColumn: '1 / -1'}}><label style={{display:'block',marginBottom:8,fontSize:14}}>Split between (People)</label><input type="number" value={n} onChange={e=>setN(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
          {tab === 'markup' && (
            <>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Margin % (X)</label><input type="number" value={x} onChange={e=>setX(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
              <div><label style={{display:'block',marginBottom:8,fontSize:14}}>Cost (Y)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:'var(--radius)'}}/></div>
            </>
          )}
        </div>
        
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>Result</div>
          <div style={{ fontSize: 32, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{getResult()}</div>
        </div>
        
      </div>
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="percentage-calc" />
  </>
  );
}
