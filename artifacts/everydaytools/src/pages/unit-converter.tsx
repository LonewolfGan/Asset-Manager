import { useState, useEffect } from 'react';
import FormatSelector from '@/components/FormatSelector';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { UNIT_CATEGORIES } from '@/config/units.config';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackToolUsed } from '@/lib/analytics';

export default function UnitConverter() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState(UNIT_CATEGORIES[0].id);
  const category = UNIT_CATEGORIES.find(c => c.id === activeCategory)!;
  
  const [fromUnit, setFromUnit] = useState(category.units[0].id);
  const [toUnit, setToUnit] = useState(category.units[1].id);
  const [amount, setAmount] = useState("1");
  const [favorites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    if (amount !== "") {
      trackToolUsed('unit-converter', 'calculators');
    }
  }, [amount, fromUnit, toUnit]);

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
    
    const fromDef = category.units.find(u => u.id === fromUnit);
    const toDef = category.units.find(u => u.id === toUnit);

    if (!fromDef || !toDef) return "—";
    
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

  const unitOptions = category.units.map(u => ({ value: u.id, label: `${t.unitConverter.unitNames[u.id] ?? u.name} (${u.symbol})` }));

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Calculators', 'Unit Converter']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['unit-converter']?.title ?? 'Unit Converter'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['unit-converter']?.description ?? 'Convert between 200+ units across 13 measurement categories.'}</p>
      
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {UNIT_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ padding: '8px 16px', background: activeCategory === c.id ? 'var(--accent)' : 'var(--bg)', color: activeCategory === c.id ? 'var(--accent-text)' : 'var(--text-primary)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
            {t.unitConverter.categoryNames[c.id] ?? c.name}
          </button>
        ))}
      </div>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="unit-from-selector" style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.unitConverter.from}</label>
              <FormatSelector options={unitOptions} value={fromUnit} onChange={setFromUnit} aria-label={t.unitConverter.from} />
            </div>
            <button onClick={handleSwap} aria-label={t.unitConverter.swapAriaLabel} style={{ marginTop: isMobile ? 0 : 26, alignSelf: isMobile ? 'center' : 'auto', padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', lineHeight: 1 }}>⇄</button>
            <div style={{ flex: 1 }}>
              <label htmlFor="unit-to-selector" style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.unitConverter.to}</label>
              <FormatSelector options={unitOptions} value={toUnit} onChange={setToUnit} aria-label={t.unitConverter.to} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, marginTop: 16 }}>
            <div>
              <label htmlFor="unit-amount" style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{t.unitConverter.from}</label>
              <input id="unit-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: 24, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', border: 'none', borderBottom: '2px solid var(--accent)', outline: 'none', background: 'var(--bg)', borderRadius: 'var(--radius) var(--radius) 0 0' }} />
            </div>
            <div style={{ padding: '16px 0', fontSize: 24, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', borderBottom: '2px solid var(--border)' }}>
              {result}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>
              1 {category.units.find(u => u.id === fromUnit)?.symbol} = {calculate("1")} {category.units.find(u => u.id === toUnit)?.symbol}
            </span>
            <button onClick={toggleFavorite} aria-label={favorites.includes(`${activeCategory}:${fromUnit}:${toUnit}`) ? t.unitConverter.pinned : t.unitConverter.pin} style={{ padding: '6px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
              {favorites.includes(`${activeCategory}:${fromUnit}:${toUnit}`) ? `★ ${t.unitConverter.pinned}` : `☆ ${t.unitConverter.pin}`}
            </button>
          </div>
        </div>
      </div>
      
      {favorites.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{t.unitConverter.pinnedConversions}</h3>
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
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="unit-converter" />
  </>
  );
}
