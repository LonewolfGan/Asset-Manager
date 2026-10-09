import { useState } from 'react';
import { getCurrencyMeta } from '@/lib/currency-meta';
import { ActionTooltip } from '@/components/ui/tooltip';

interface CurrencyFlagProps {
  code: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  xs: 'w-4 h-4 text-[9px]',
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-9 h-9 text-sm',
  xl: 'w-11 h-11 text-base',
};

export default function CurrencyFlag({ code, className = '', size = 'md' }: CurrencyFlagProps) {
  const [hasError, setHasError] = useState(false);
  const meta = getCurrencyMeta(code);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  // 1. Bespoke Vector Emblems for Regional & Multi-Country Currencies
  if (code === 'XOF') {
    // West African CFA Franc (BCEAO / UEMOA)
    return (
      <ActionTooltip label="Franc CFA - BCEAO (Afrique de l'Ouest)">
        <div
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-emerald-700/20 shadow-xs flex items-center justify-center bg-[#006A38] text-white cursor-default ${className}`}
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            {/* UEMOA green field */}
            <rect width="40" height="40" fill="#006A38" />
            {/* Golden solar ring */}
            <circle cx="20" cy="20" r="14" stroke="#F5A800" strokeWidth="2.5" />
            {/* Stylized BCEAO Sawfish Gold Weight Emblem */}
            <path
              d="M10 20C13 16 27 16 30 20C27 24 13 24 10 20Z"
              fill="#F5A800"
            />
            <circle cx="16" cy="18.5" r="1.2" fill="#006A38" />
            <path
              d="M19 16.5L20 23.5M23 17L23.5 23"
              stroke="#006A38"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <text
              x="20"
              y="36"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="0.5"
            >
              BCEAO
            </text>
          </svg>
        </div>
      </ActionTooltip>
    );
  }

  if (code === 'XAF') {
    // Central African CFA Franc (BEAC / CEMAC)
    return (
      <ActionTooltip label="Franc CFA - BEAC (Afrique Centrale)">
        <div
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-sky-700/20 shadow-xs flex items-center justify-center bg-[#004B87] text-white cursor-default ${className}`}
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            {/* CEMAC sky blue */}
            <rect width="40" height="40" fill="#004B87" />
            {/* Equatorial sunrise rays */}
            <circle cx="20" cy="25" r="13" fill="#007A3D" />
            <circle cx="20" cy="25" r="7.5" fill="#FFCC00" />
            {/* Central sunburst spikes */}
            <path
              d="M20 11L21.5 16H18.5L20 11ZM13 14L16 18L14 19.5L13 14ZM27 14L24 18L26 19.5L27 14Z"
              fill="#FFCC00"
            />
            <text
              x="20"
              y="36.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="0.5"
            >
              BEAC
            </text>
          </svg>
        </div>
      </ActionTooltip>
    );
  }

  if (code === 'EUR') {
    // European Union Euro Flag (100% offline vector)
    return (
      <ActionTooltip label="Euro - Union Européenne">
        <div
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-blue-900/20 shadow-xs flex items-center justify-center bg-[#003399] cursor-default ${className}`}
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" fill="#003399" />
            {/* 12 Gold Stars in circle */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 20 + 11 * Math.sin(rad);
              const cy = 20 - 11 * Math.cos(rad);
              return (
                <circle
                  key={deg}
                  cx={cx.toFixed(2)}
                  cy={cy.toFixed(2)}
                  r="1.4"
                  fill="#FFCC00"
                />
              );
            })}
          </svg>
        </div>
      </ActionTooltip>
    );
  }

  if (code === 'XCD') {
    // East Caribbean Dollar (OECS)
    return (
      <ActionTooltip label="Dollar des Caraïbes orientales">
        <div
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-teal-800/20 shadow-xs flex items-center justify-center bg-[#008080] text-white cursor-default ${className}`}
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" fill="#008080" />
            <polygon points="20,10 30,28 10,28" fill="#F4C430" />
            <polygon points="20,16 26,27 14,27" fill="#000000" />
            <text
              x="20"
              y="36"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              OECS
            </text>
          </svg>
        </div>
      </ActionTooltip>
    );
  }

  // 2. Standard ISO 3166-1 alpha-2 Flag via reliable FlagCDN
  const countryCode = meta?.countryCode;

  if (countryCode && !hasError) {
    return (
      <img
        src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
        alt={`${code} flag`}
        onError={() => setHasError(true)}
        loading="lazy"
        className={`${sizeClass} rounded-full object-cover shrink-0 border border-black/10 dark:border-white/10 shadow-xs ${className}`}
      />
    );
  }

  // 3. Typographic Mono Badge Fallback (if country flag unavailable or offline error)
  return (
    <div
      className={`${sizeClass} rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold flex items-center justify-center shrink-0 border border-border/80 shadow-xs select-none ${className}`}
    >
      {code.slice(0, 3)}
    </div>
  );
}
