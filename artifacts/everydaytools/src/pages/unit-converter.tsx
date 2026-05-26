import { useState, useEffect } from 'react';
import FormatSelector from '@/components/FormatSelector';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { UNIT_CATEGORIES } from '@/config/units.config';

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState(UNIT_CATEGORIES[0].id);
  const category = UNIT_CATEGORIES.find(c => c.id === activeCategory)!;
  
  const [fromUnit, setFromUnit] = useState(category.units[0].id);
  const [toUnit, setToUnit] = useState(category.units[1].id);
  const [amount, setAmount] = useState("1");
  const [favorites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('unit_converter_favourites');
    if (saved) {
      try { setFavourites(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Update units when category changes
  useEffect(() => {
    setFromUnit(category.units[0].id);
    setToUnit(category.units[1] ? category.units[1].id : category.units[0].id);
  }, [activeCategory]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const calculate = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "—";
    
    const fromDef = category.units.find(u => u.id === fromUnit)!;
    const toDef = category.units.find(u => u.id === toUnit)!;
    
    const baseValue = fromDef.toBase(num);
    const targetValue = toDef.fromBase(baseValue);
    
    // Formatting
    if (targetValue === 0) return "0";
    if (Math.abs(targetValue) < 0.000001 || Math.abs(targetValue) > 1000000) {
      return targetValue.toExponential(6);
    }
    return parseFloat(targetValue.toFixed(6)).toString();
  };

  const result = calculate(amount);

  const toggleFavorite = () => {
    const id = `${activeCategory}:${fromUnit}:${toUnit}`;
    let newFavs = [...favorites];
    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
    } else {
      if (favorites.length >= 5) newFavs.shift();
      newFavs.push(id);
    }
    setFavourites(newFavs);
    localStorage.setItem('unit_converter_favourites', JSON.stringify(newFavs));
  };

  const loadFavorite = (id: string) => {
    const [cat, from, to] = id.split(':');
    setActiveCategory(cat);
    setTimeout(() => {
      setFromUnit(from);
      setToUnit(to);
    }, 0);
  };

  const unitOptions = category.units.map(u => ({ value: u.id, label: `${u.name} (${u.symbol})` }));

  const faqs = [
    { q: "How precise are the conversions?", a: "Conversions use standard high-precision factors and display up to 6 decimal places." },
    { q: "What's the difference between Metric and Imperial?", a: "Metric (meters, kg) is standard globally, while Imperial (feet, pounds) is used primarily in the US and UK." },
    { q: "How are temperatures converted?", a: "Temperatures use exact offset formulas rather than simple multiplication factors." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Calculators', 'Unit Converter']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Unit Converter</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert between 200+ units across 13 measurement categories.</p>
      
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {UNIT_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ padding: '8px 16px', background: activeCategory === c.id ? 'var(--accent)' : 'var(--bg)', color: activeCategory === c.id ? '#fff' : 'var(--text)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
            {c.name}
          </button>
        ))}
      </div>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>From</label>
              <FormatSelector options={unitOptions} value={fromUnit} onChange={setFromUnit} />
            </div>
            <button onClick={handleSwap} style={{ marginTop: 26, padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer' }}>⇄</button>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>To</label>
              <FormatSelector options={unitOptions} value={toUnit} onChange={setToUnit} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 16 }}>
            <div>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: 24, fontFamily: 'IBM Plex Mono, monospace', border: 'none', borderBottom: '2px solid var(--accent)', outline: 'none', background: 'var(--bg)', borderRadius: 'var(--radius) var(--radius) 0 0' }} />
            </div>
            <div style={{ padding: '16px 0', fontSize: 24, fontFamily: 'IBM Plex Mono, monospace', borderBottom: '2px solid var(--border)' }}>
              {result}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>
              1 {category.units.find(u => u.id === fromUnit)?.symbol} = {calculate("1")} {category.units.find(u => u.id === toUnit)?.symbol}
            </span>
            <button onClick={toggleFavorite} style={{ padding: '6px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer' }}>
              {favorites.includes(`${activeCategory}:${fromUnit}:${toUnit}`) ? "★ Pinned" : "☆ Pin"}
            </button>
          </div>
        </div>
      </div>
      
      {favorites.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Pinned Conversions</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {favorites.map(fav => {
              const [cat, from, to] = fav.split(':');
              const c = UNIT_CATEGORIES.find(c => c.id === cat);
              const fName = c?.units.find(u => u.id === from)?.symbol;
              const tName = c?.units.find(u => u.id === to)?.symbol;
              return (
                <button key={fav} onClick={() => loadFavorite(fav)} style={{ padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>
                  {fName} → {tName}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
