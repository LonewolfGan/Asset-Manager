import { useEffect, useRef, useState } from 'react';
import { getConsent, getAdSenseClient, loadAdSense, type ConsentChoices } from '@/lib/consent';

const DIMS = {
  horizontal: { width: '100%',  minHeight: '90px'  },
  square:     { width: '300px', minHeight: '250px' },
  sidebar:    { width: '160px', minHeight: '600px' },
};

interface AdSlotProps {
  type: 'horizontal' | 'square' | 'sidebar';
  slotId?: string;
}

export default function AdSlot({ type, slotId = '' }: AdSlotProps) {
  const isDev = import.meta.env.DEV;
  const client = getAdSenseClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [adsConsented, setAdsConsented] = useState(() => getConsent()?.ads ?? false);
  const { width, minHeight } = DIMS[type];

  useEffect(() => {
    const handler = (e: Event) => {
      setAdsConsented((e as CustomEvent<ConsentChoices>).detail.ads);
    };
    window.addEventListener('et:consent', handler);
    return () => window.removeEventListener('et:consent', handler);
  }, []);

  useEffect(() => {
    if (isDev || !client || !slotId || !adsConsented || pushedRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const push = () => {
      if (pushedRef.current) return;
      pushedRef.current = true;
      loadAdSense();
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      try {
        (window as any).adsbygoogle.push({});
      } catch {
        pushedRef.current = false;
      }
    };

    if (!('IntersectionObserver' in window)) {
      push();
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          push();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isDev, client, slotId, adsConsented]);

  if (isDev) {
    return (
      <div
        style={{
          width,
          minHeight,
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          ad · {type} · {width} × {minHeight}
        </span>
      </div>
    );
  }

  if (!client || !slotId) return null;

  return (
    <div ref={containerRef} style={{ width, minHeight, overflow: 'hidden' }}>
      {adsConsented && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
