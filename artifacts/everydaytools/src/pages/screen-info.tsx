import { useState, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Monitor } from 'lucide-react';

export default function ScreenInfo() {
  const { t } = useLocale();
  const [info, setInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    trackToolUsed('screen-info', 'calculators');
    const update = () => {
      setInfo({
        'Screen Resolution': `${window.screen.width} × ${window.screen.height} px`,
        'Available Screen Space': `${window.screen.availWidth} × ${window.screen.availHeight} px`,
        'Browser Viewport Size': `${window.innerWidth} × ${window.innerHeight} px`,
        'Device Pixel Ratio (DPR)': `${window.devicePixelRatio}x (Retina/HiDPI)`,
        'Color Depth': `${window.screen.colorDepth} bits per pixel`,
        'Screen Orientation': window.screen.orientation ? window.screen.orientation.type : 'Landscape / Portrait',
        'Touch Screen Capable': 'ontouchstart' in window ? 'Yes' : 'No',
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Screen Resolution & Display Info']} />
        <PageTitle>Screen Resolution & Display Diagnostics</PageTitle>
        <PageSubtitle>Inspect physical screen dimensions, browser viewport bounds, pixel ratio density, and display capabilities.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {Object.entries(info).map(([key, val]) => (
            <div key={key} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{key}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {val}
              </p>
            </div>
          ))}
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="screen-info" />
    </>
  );
}
