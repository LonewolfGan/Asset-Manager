import React from 'react';

/**
 * Awwwards-Level Architectural Vector Artworks for EverydayTools Master PDF Pack.
 * Designed on a 240x240 precision coordinate grid with multi-tone gradient systems,
 * high-density mechanical calibration geometry, and specular luminous nodes.
 */

/* ─── 01. COMPRESS: MECHANICAL IRIS & CALIBRATED PRESSURE ─── */
export function CompressGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="comp-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#EA580C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="comp-blade-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A50" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="comp-blade-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA366" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#C2410C" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="comp-piston" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A50" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Ambient Volumetric Glow Core */}
      <circle cx="120" cy="120" r="100" fill="url(#comp-core-glow)" />

      {/* Blueprint Calibration Grid Ticks */}
      <circle cx="120" cy="120" r="108" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 5" className="opacity-30 dark:opacity-20" />
      <circle cx="120" cy="120" r="92" stroke="#FF6B35" strokeWidth="1.25" strokeDasharray="6 4" opacity="0.4" />
      <circle cx="120" cy="120" r="72" stroke="#FF6B35" strokeWidth="1.5" opacity="0.6" />
      <circle cx="120" cy="120" r="46" stroke="#FF6B35" strokeWidth="2" opacity="0.85" />

      {/* Metric Degree Angle Labels */}
      <text x="120" y="19" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">0°</text>
      <text x="222" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">90°</text>
      <text x="120" y="228" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">180°</text>
      <text x="18" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">270°</text>

      {/* Axis Precision Crosshair Filaments */}
      <line x1="120" y1="24" x2="120" y2="40" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="120" y1="200" x2="120" y2="216" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="120" x2="40" y2="120" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="120" x2="216" y2="120" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />

      {/* Hexagonal Iris Diaphragm Blades */}
      <path d="M120 74 L158 96 L158 144 L120 166 L82 144 L82 96 Z" stroke="#FF6B35" strokeWidth="2" fill="url(#comp-blade-a)" fillOpacity="0.12" strokeDasharray="4 3" />
      <path d="M120 74 L158 144" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M158 96 L120 166" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M158 144 L82 96" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M120 166 L82 144" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M82 144 L120 74" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M82 96 L158 96" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />

      {/* Inward Hydraulic Pressure Pistons (4-Axis) */}
      <g>
        {/* Top Piston */}
        <line x1="120" y1="44" x2="120" y2="64" stroke="url(#comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M120 68 L113 58 H127 Z" fill="#FF6B35" />

        {/* Bottom Piston */}
        <line x1="120" y1="196" x2="120" y2="176" stroke="url(#comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M120 172 L113 182 H127 Z" fill="#FF6B35" />

        {/* Left Piston */}
        <line x1="44" y1="120" x2="64" y2="120" stroke="url(#comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 120 L58 113 V127 Z" fill="#FF6B35" />

        {/* Right Piston */}
        <line x1="196" y1="120" x2="176" y2="120" stroke="url(#comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M172 120 L182 113 V127 Z" fill="#FF6B35" />
      </g>

      {/* Central High-Density Compressed Core */}
      <circle cx="120" cy="120" r="22" fill="#FF6B35" fillOpacity="0.2" stroke="#FF6B35" strokeWidth="2.25" />
      <circle cx="120" cy="120" r="14" fill="#FF6B35" fillOpacity="0.35" stroke="#FFA366" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="5" fill="#FFFFFF" />

      {/* Metric Compression Efficiency Stamp */}
      <text
        x="120"
        y="123"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="800"
        letterSpacing="0.05em"
      >
        -75%
      </text>
    </svg>
  );
}

/* ─── 02. PROTECT: CRYPTOGRAPHIC VAULT & AES SHIELD ─── */
export function ProtectGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="prot-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="prot-shield-facet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="prot-shackle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="prot-plate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Ambient Blue Radial Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#prot-core-glow)" />

      {/* Hexadecimal Security Hash Perimeter Ring */}
      <circle cx="120" cy="120" r="105" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="4 6" className="opacity-30 dark:opacity-20" />
      <text x="120" y="18" textAnchor="middle" fill="#2563EB" fontSize="6.5" fontFamily="monospace" fontWeight="700" opacity="0.7">AES-256-GCM</text>
      <text x="215" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace" className="opacity-50 dark:opacity-30">0x7F</text>
      <text x="120" y="230" textAnchor="middle" fill="#2563EB" fontSize="6.5" fontFamily="monospace" fontWeight="700" opacity="0.7">SHA-512</text>
      <text x="25" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace" className="opacity-50 dark:opacity-30">0x0A</text>

      {/* Outer Titanium Shield Contour */}
      <path
        d="M120 28 L194 56 V126 C194 176 120 216 120 216 C120 216 46 176 46 126 V56 L120 28 Z"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="url(#prot-shield-facet)"
      />

      {/* Inner Concentric Shield Layer */}
      <path
        d="M120 48 L176 70 V126 C176 162 120 196 120 196 C120 196 64 162 64 126 V70 L120 48 Z"
        stroke="#60A5FA"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
      />

      {/* Perimeter Security Rivets */}
      <circle cx="120" cy="38" r="3" fill="#60A5FA" />
      <circle cx="184" cy="62" r="3" fill="#60A5FA" />
      <circle cx="56" cy="62" r="3" fill="#60A5FA" />
      <circle cx="184" cy="126" r="3" fill="#60A5FA" />
      <circle cx="56" cy="126" r="3" fill="#60A5FA" />

      {/* Hardened Vault Shackle Arch */}
      <path
        d="M98 114 V92 C98 79.8 107.8 70 120 70 C132.2 70 142 79.8 142 92 V114"
        stroke="url(#prot-shackle)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Vault Body Plate */}
      <rect
        x="84"
        y="114"
        width="72"
        height="54"
        rx="12"
        stroke="#2563EB"
        strokeWidth="2.5"
        fill="url(#prot-plate)"
      />

      {/* Combination Rotary Dial */}
      <circle cx="120" cy="141" r="16" stroke="#60A5FA" strokeWidth="2" fill="#1E3A8A" fillOpacity="0.4" />
      <circle cx="120" cy="141" r="7" fill="#2563EB" />
      <circle cx="120" cy="141" r="2.5" fill="#FFFFFF" />

      {/* Dial Tick Marks */}
      <line x1="120" y1="122" x2="120" y2="126" stroke="#93C5FD" strokeWidth="1.75" />
      <line x1="139" y1="141" x2="135" y2="141" stroke="#93C5FD" strokeWidth="1.75" />
      <line x1="120" y1="160" x2="120" y2="156" stroke="#93C5FD" strokeWidth="1.75" />
      <line x1="101" y1="141" x2="105" y2="141" stroke="#93C5FD" strokeWidth="1.75" />
    </svg>
  );
}

/* ─── 03. MERGE: MAGNETIC BINDING & CONVERGENCE ─── */
export function MergeGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="merge-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#6D28D9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="merge-sheet-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="merge-sheet-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="merge-nexus-hub" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Ambient Purple Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#merge-core-glow)" />

      {/* Magnetic Flux Trajectory Arc Guides */}
      <ellipse cx="120" cy="120" rx="98" ry="52" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="4 6" className="opacity-30 dark:opacity-20" transform="rotate(-15 120 120)" />
      <ellipse cx="120" cy="120" rx="76" ry="40" stroke="#8B5CF6" strokeWidth="1.25" strokeDasharray="5 4" opacity="0.45" transform="rotate(-15 120 120)" />

      {/* Left Incoming Document Sheet */}
      <g transform="translate(18, 0)">
        <rect x="18" y="48" width="86" height="126" rx="10" stroke="#8B5CF6" strokeWidth="2.25" fill="url(#merge-sheet-a)" />
        {/* Document lines */}
        <line x1="34" y1="74" x2="86" y2="74" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="34" y1="90" x2="74" y2="90" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="34" y1="106" x2="82" y2="106" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="34" y1="122" x2="68" y2="122" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <text x="34" y="152" fill="#A78BFA" fontSize="7" fontFamily="monospace" fontWeight="700">DOC_A</text>
      </g>

      {/* Right Incoming Document Sheet */}
      <g transform="translate(-18, 0)">
        <rect x="118" y="66" width="86" height="126" rx="10" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5 3" fill="url(#merge-sheet-b)" />
        {/* Document lines */}
        <line x1="134" y1="92" x2="186" y2="92" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <line x1="134" y1="108" x2="174" y2="108" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="134" y1="124" x2="182" y2="124" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="134" y1="140" x2="164" y2="140" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <text x="156" y="170" fill="#C4B5FD" fontSize="7" fontFamily="monospace" fontWeight="700">DOC_B</text>
      </g>

      {/* Magnetic Flux Chevron Vectors */}
      <path d="M78 155 L94 155 M94 155 L88 149 M94 155 L88 161" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M162 155 L146 155 M146 155 L152 149 M146 155 L152 161" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Central High-Intensity Fusion Nexus Core */}
      <circle cx="120" cy="120" r="32" stroke="#8B5CF6" strokeWidth="2.5" fill="#6D28D9" fillOpacity="0.25" />
      <circle cx="120" cy="120" r="22" stroke="#A78BFA" strokeWidth="1.5" fill="#7C3AED" fillOpacity="0.35" />

      {/* Union Plus Lock Clamp */}
      <line x1="120" y1="106" x2="120" y2="134" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="106" y1="120" x2="134" y2="120" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* Nexus Convergence Particles */}
      <circle cx="120" cy="120" r="3.5" fill="#DDD6FE" />
      <circle cx="98" cy="100" r="2" fill="#A78BFA" />
      <circle cx="142" cy="140" r="2" fill="#A78BFA" />
    </svg>
  );
}

/* ─── 04. PAGINATE: SEQUENTIAL FANNED DECK & PRECISION RULER ─── */
export function PaginateGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="pag-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pag-sheet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="pag-stamp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Ambient Emerald Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#pag-core-glow)" />

      {/* Drafting Margin Ruler Outer Ring */}
      <circle cx="120" cy="120" r="105" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 5" className="opacity-30 dark:opacity-20" />

      {/* Sheet 3 (Background Fanned Sheet, +10deg) */}
      <rect
        x="84"
        y="28"
        width="106"
        height="146"
        rx="10"
        stroke="#10B981"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        opacity="0.35"
        transform="rotate(9 137 101)"
      />

      {/* Sheet 2 (Middle Fanned Sheet, +4deg) */}
      <rect
        x="64"
        y="42"
        width="106"
        height="146"
        rx="10"
        stroke="#10B981"
        strokeWidth="1.75"
        opacity="0.6"
        transform="rotate(4 117 115)"
      />

      {/* Sheet 1 (Main Foreground Document Sheet) */}
      <rect
        x="42"
        y="58"
        width="106"
        height="146"
        rx="10"
        stroke="#10B981"
        strokeWidth="2.25"
        fill="url(#pag-sheet-grad)"
      />

      {/* Drafting Alignment Calibration Marks */}
      <line x1="56" y1="84" x2="132" y2="84" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="56" y1="102" x2="132" y2="102" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="56" y1="118" x2="114" y2="118" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="56" y1="134" x2="124" y2="134" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

      {/* Edge Margin Ticks */}
      <line x1="48" y1="72" x2="52" y2="72" stroke="#34D399" strokeWidth="1.5" />
      <line x1="48" y1="102" x2="52" y2="102" stroke="#34D399" strokeWidth="1.5" />
      <line x1="48" y1="134" x2="52" y2="134" stroke="#34D399" strokeWidth="1.5" />
      <line x1="48" y1="164" x2="52" y2="164" stroke="#34D399" strokeWidth="1.5" />

      {/* Sequential Pagination Stamp Reticle Target */}
      <circle cx="132" cy="176" r="26" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <circle cx="132" cy="176" r="19" stroke="url(#pag-stamp-grad)" strokeWidth="2.5" fill="#047857" fillOpacity="0.4" />
      
      {/* Target Crosshair Ticks */}
      <line x1="132" y1="147" x2="132" y2="153" stroke="#34D399" strokeWidth="2" />
      <line x1="132" y1="199" x2="132" y2="205" stroke="#34D399" strokeWidth="2" />
      <line x1="103" y1="176" x2="109" y2="176" stroke="#34D399" strokeWidth="2" />
      <line x1="155" y1="176" x2="161" y2="176" stroke="#34D399" strokeWidth="2" />

      {/* Page Number Focal Text */}
      <text
        x="132"
        y="182"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="15"
        fontWeight="900"
        fontFamily="monospace"
        letterSpacing="0.05em"
      >
        01
      </text>
    </svg>
  );
}

/* ─── 05. WATERMARK: GUILLOCHE SECURITY SEAL & EMBOSSED RIBBON ─── */
export function WatermarkGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="wm-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#D97706" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wm-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="wm-sheet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Ambient Amber Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#wm-core-glow)" />

      {/* Security Document Sheet Backdrop */}
      <rect x="44" y="36" width="132" height="162" rx="10" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" />
      <rect x="54" y="46" width="112" height="142" rx="8" stroke="#F59E0B" strokeWidth="1.75" fill="url(#wm-sheet-grad)" />

      {/* Micro-ruled Document Lines */}
      <line x1="70" y1="70" x2="148" y2="70" stroke="#FBBF24" strokeWidth="1.75" strokeLinecap="round" opacity="0.65" />
      <line x1="70" y1="88" x2="136" y2="88" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="70" y1="104" x2="146" y2="104" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

      {/* Banknote Guilloche Rosette Outer Rings */}
      <circle cx="120" cy="120" r="66" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 4" className="opacity-30 dark:opacity-20" />
      <circle cx="120" cy="120" r="54" stroke="#F59E0B" strokeWidth="1.5" opacity="0.75" />
      <circle cx="120" cy="120" r="42" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6 3" />
      <circle cx="120" cy="120" r="28" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />

      {/* Corner Security Calibration Stars */}
      <polygon points="120,62 122,68 128,68 123,71 125,77 120,73 115,77 117,71 112,68 118,68" fill="#FBBF24" />
      <polygon points="120,166 122,172 128,172 123,175 125,181 120,177 115,181 117,175 112,172 118,172" fill="#FBBF24" />

      {/* Diagonal Embossed Security Stamp Ribbon */}
      <g transform="rotate(-28 120 120)">
        <rect
          x="30"
          y="102"
          width="180"
          height="36"
          rx="6"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="4 2"
          fill="url(#wm-ribbon-grad)"
          className="shadow-lg"
        />
        <text
          x="120"
          y="126"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="900"
          letterSpacing="0.28em"
          fontFamily="monospace"
        >
          CONFIDENTIAL
        </text>
      </g>
    </svg>
  );
}

/* ─── 06. SPLIT: LASER CLEAVE & PERFORATED DISSECTION ─── */
export function SplitGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="split-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#E11D48" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="split-sheet-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#BE123C" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="split-sheet-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="split-laser" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>

      {/* Ambient Crimson Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#split-core-glow)" />

      {/* Blueprint Calibration Perimeter */}
      <circle cx="120" cy="120" r="105" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 5" className="opacity-30 dark:opacity-20" />

      {/* Left Diverging Sheet */}
      <g transform="translate(-18, 0)">
        <rect x="36" y="44" width="76" height="136" rx="9" stroke="#F43F5E" strokeWidth="2.25" fill="url(#split-sheet-l)" />
        <line x1="50" y1="72" x2="94" y2="72" stroke="#FB7185" strokeWidth="1.75" strokeLinecap="round" opacity="0.8" />
        <line x1="50" y1="90" x2="84" y2="90" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="50" y1="106" x2="90" y2="106" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="50" y1="122" x2="74" y2="122" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        
        {/* Left Directional Departure Vector */}
        <path d="M82 154 L68 154 M68 154 L74 148 M68 154 L74 160" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Right Diverging Sheet */}
      <g transform="translate(18, 0)">
        <rect x="128" y="44" width="76" height="136" rx="9" stroke="#F43F5E" strokeWidth="2.25" fill="url(#split-sheet-r)" />
        <line x1="142" y1="72" x2="186" y2="72" stroke="#FDA4AF" strokeWidth="1.75" strokeLinecap="round" opacity="0.8" />
        <line x1="142" y1="90" x2="176" y2="90" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="142" y1="106" x2="182" y2="106" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="142" y1="122" x2="166" y2="122" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Right Directional Departure Vector */}
        <path d="M158 154 L172 154 M172 154 L166 148 M172 154 L166 160" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Central High-Intensity Laser Cleavage Beam */}
      <line x1="120" y1="16" x2="120" y2="224" stroke="url(#split-laser)" strokeWidth="3" strokeDasharray="8 5" />
      <line x1="120" y1="36" x2="120" y2="204" stroke="#FFFFFF" strokeWidth="1.25" opacity="0.8" />

      {/* Laser Cleave Directional Notches */}
      <polygon points="106,120 98,114 98,126" fill="#F43F5E" />
      <polygon points="134,120 142,114 142,126" fill="#F43F5E" />

      {/* Laser Emitters at Top & Bottom */}
      <circle cx="120" cy="36" r="10" stroke="#F43F5E" strokeWidth="2" fill="#BE123C" fillOpacity="0.4" />
      <circle cx="120" cy="36" r="4" fill="#FFFFFF" />

      <circle cx="120" cy="204" r="10" stroke="#F43F5E" strokeWidth="2" fill="#BE123C" fillOpacity="0.4" />
      <circle cx="120" cy="204" r="4" fill="#FFFFFF" />
    </svg>
  );
}

/* ─── 07. ROTATE: PRECISION GYROSCOPE & 90° AXIAL ROTATION ─── */
export function RotatePdfGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="rot-pdf-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#0891B2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rot-pdf-sheet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="rot-pdf-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Ambient Cyan Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#rot-pdf-core-glow)" />

      {/* Blueprint Calibration Perimeter & Cardinal Ticks */}
      <circle cx="120" cy="120" r="106" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 5" className="opacity-30 dark:opacity-20" />
      <circle cx="120" cy="120" r="92" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

      {/* Degree Compass Labels */}
      <text x="120" y="21" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">0°</text>
      <text x="220" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">90°</text>
      <text x="120" y="226" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">180°</text>
      <text x="20" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">270°</text>

      {/* Rotated Active PDF Document Sheet (-16° tilt) */}
      <g transform="rotate(-16 120 120)">
        <rect
          x="78"
          y="62"
          width="84"
          height="116"
          rx="8"
          stroke="#06B6D4"
          strokeWidth="2"
          fill="url(#rot-pdf-sheet)"
        />
        {/* Document Folded Corner */}
        <path d="M142 62 L162 82 H142 V62 Z" fill="#06B6D4" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="1.5" />
        
        {/* Architectural Text Placeholders */}
        <line x1="92" y1="92" x2="148" y2="92" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="92" y1="106" x2="138" y2="106" stroke="#06B6D4" strokeWidth="1.75" strokeLinecap="round" opacity="0.6" />
        <line x1="92" y1="120" x2="144" y2="120" stroke="#06B6D4" strokeWidth="1.75" strokeLinecap="round" opacity="0.6" />
        <line x1="92" y1="134" x2="124" y2="134" stroke="#06B6D4" strokeWidth="1.75" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Dynamic 90° Orbital Rotation Vector */}
      <path
        d="M 120 44 A 76 76 0 0 1 196 120"
        stroke="url(#rot-pdf-orbit)"
        strokeWidth="2.75"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead on orbit */}
      <path
        d="M 196 120 L 187 111 M 196 120 L 189 129"
        stroke="#67E8F9"
        strokeWidth="2.75"
        strokeLinecap="round"
      />

      {/* Axis crosshair line */}
      <line x1="120" y1="36" x2="120" y2="204" stroke="#06B6D4" strokeWidth="1.25" strokeDasharray="4 3" opacity="0.5" />

      {/* Rotation Degree Stamp */}
      <g transform="translate(94, 186)">
        <rect x="0" y="0" width="52" height="24" rx="12" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.5" />
        <text
          x="26"
          y="15"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8.5"
          fontFamily="monospace"
          fontWeight="800"
          letterSpacing="0.05em"
        >
          90° ↻
        </text>
      </g>
    </svg>
  );
}
