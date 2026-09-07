import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Palette, RefreshCw, Copy, Check } from 'lucide-react';

function generateRandomPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    `hsl(${baseHue}, 70%, 50%)`,
    `hsl(${(baseHue + 30) % 360}, 65%, 60%)`,
    `hsl(${(baseHue + 60) % 360}, 80%, 45%)`,
    `hsl(${(baseHue + 180) % 360}, 75%, 55%)`,
    `hsl(${(baseHue + 210) % 360}, 60%, 40%)`,
  ];
}

export default function ColorPalette() {
  const { t } = useLocale();
  const [colors, setColors] = useState<string[]>(() => generateRandomPalette());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regenerate = () => {
    trackToolUsed('color-palette', 'textCode');
    setColors(generateRandomPalette());
  };

  const copy = (c: string, idx: number) => {
    navigator.clipboard.writeText(c);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Color Palette Generator']} />
        <PageTitle>Color Palette Generator</PageTitle>
        <PageSubtitle>Generate balanced color harmonies and export hex/hsl values for web design and branding.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, height: 180, marginBottom: 20 }}>
            {colors.map((c, idx) => (
              <div
                key={idx}
                onClick={() => copy(c, idx)}
                style={{
                  background: c,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 12,
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  transition: 'transform 0.15s',
                }}
              >
                {copiedIdx === idx ? 'Copied!' : c}
              </div>
            ))}
          </div>

          <button onClick={regenerate} style={{ padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={16} />
            Generate New Palette
          </button>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="color-palette" />
    </>
  );
}
