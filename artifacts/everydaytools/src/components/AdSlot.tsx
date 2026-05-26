const DIMS = {
  horizontal: { width: '100%', height: '90px' },
  square: { width: '300px', height: '250px' },
  sidebar: { width: '160px', height: '600px' },
};

interface AdSlotProps {
  type: 'horizontal' | 'square' | 'sidebar';
  slotId?: string;
}

export default function AdSlot({ type, slotId = '' }: AdSlotProps) {
  const isDev = import.meta.env.DEV;
  const { width, height } = DIMS[type];

  return (
    <div
      data-ad-slot={slotId}
      data-ad-type={type}
      data-ad-network="adsense"
      style={{
        width,
        minHeight: height,
        border: isDev ? '1px dashed var(--border)' : 'none',
        background: isDev ? 'var(--bg)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius)',
      }}
    >
      {isDev && (
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Ad slot — {type} ({width} × {height})
        </span>
      )}
    </div>
  );
}
