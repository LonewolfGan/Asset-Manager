import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Ratio } from 'lucide-react';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatio() {
  const { t } = useLocale();
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [newWidth, setNewWidth] = useState('1280');

  const w = parseInt(width) || 0;
  const h = parseInt(height) || 0;
  const divisor = gcd(w, h);
  const ratioX = divisor > 0 ? w / divisor : 0;
  const ratioY = divisor > 0 ? h / divisor : 0;

  const nw = parseInt(newWidth) || 0;
  const computedHeight = w > 0 ? Math.round((nw * h) / w) : 0;

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Aspect Ratio Calculator']} />
        <PageTitle>Aspect Ratio & Dimension Calculator</PageTitle>
        <PageSubtitle>Find standard image/video aspect ratios (16:9, 4:3, 21:9) and scale proportional dimensions easily.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Width (px)</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Height (px)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Computed Aspect Ratio:</span>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--accent)' }}>
              {ratioX}:{ratioY}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Scale Proportional Dimensions</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>New Target Width</label>
              <input type="number" value={newWidth} onChange={(e) => setNewWidth(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Proportional Height</label>
              <div style={{ padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                {computedHeight} px
              </div>
            </div>
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="aspect-ratio" />
    </>
  );
}
