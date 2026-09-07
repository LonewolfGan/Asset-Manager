import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Pipette, Copy, Check } from 'lucide-react';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 0,
    g: parseInt(clean.substring(2, 4), 16) || 0,
    b: parseInt(clean.substring(4, 6), 16) || 0,
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);
  const k = Math.min(c, Math.min(m, y));
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((c - k) / (1 - k)) * 100),
    m: Math.round(((m - k) / (1 - k)) * 100),
    y: Math.round(((y - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export default function ColorConverter() {
  const { t } = useLocale();
  const [hex, setHex] = useState('#1A6BFF');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const values: Record<string, string> = {
    'HEX': hex.toUpperCase(),
    'RGB': `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    'HSL': `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    'CMYK': `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
  };

  const copy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Color Converter']} />
        <PageTitle>Color Format Converter (HEX, RGB, HSL, CMYK)</PageTitle>
        <PageSubtitle>Convert color representations seamlessly across web and print color spaces with live preview.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              style={{ width: 64, height: 64, borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', padding: 0 }}
            />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Color Value (HEX)</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {Object.entries(values).map(([fmt, val]) => (
            <div key={fmt} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>{fmt}</span>
                <button onClick={() => copy(fmt, val)} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copiedKey === fmt ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === fmt ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                {val}
              </p>
            </div>
          ))}
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="color-converter" />
    </>
  );
}
