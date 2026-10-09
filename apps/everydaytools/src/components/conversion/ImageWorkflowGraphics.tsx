import React from 'react';

/**
 * Awwwards-Level Architectural Vector Artworks for EverydayTools Master Image Pack.
 * Designed on a 240x240 precision coordinate grid with multi-tone gradient systems,
 * clean photographic framing, and tactile digital editing metaphors.
 */

/* ─── 01. COMPRESS: DCT QUANTUM MATRIX & IRIS DECIMATION ─── */
export function CompressImageGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-comp-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#EA580C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-comp-blade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A50" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="img-comp-piston" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A50" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Ambient Volumetric Glow Core */}
      <circle cx="120" cy="120" r="100" fill="url(#img-comp-core-glow)" />

      {/* Blueprint Calibration Matrix Ticks */}
      <circle cx="120" cy="120" r="108" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 5" className="opacity-30 dark:opacity-20" />
      <circle cx="120" cy="120" r="92" stroke="#FF6B35" strokeWidth="1.25" strokeDasharray="6 4" opacity="0.4" />
      <circle cx="120" cy="120" r="72" stroke="#FF6B35" strokeWidth="1.5" opacity="0.6" />
      <circle cx="120" cy="120" r="46" stroke="#FF6B35" strokeWidth="2" opacity="0.85" />

      {/* Frequency / Quality Scale Metric Labels */}
      <text x="120" y="19" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">100% RAW</text>
      <text x="218" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">4:2:0</text>
      <text x="120" y="228" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">DCT OPT</text>
      <text x="20" y="122" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="600" className="opacity-60 dark:opacity-40">8-BIT</text>

      {/* Axis Precision Crosshair Filaments */}
      <line x1="120" y1="24" x2="120" y2="40" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="120" y1="200" x2="120" y2="216" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="120" x2="40" y2="120" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="120" x2="216" y2="120" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />

      {/* Hexagonal Iris Diaphragm Blades */}
      <path d="M120 74 L158 96 L158 144 L120 166 L82 144 L82 96 Z" stroke="#FF6B35" strokeWidth="2" fill="url(#img-comp-blade)" fillOpacity="0.12" strokeDasharray="4 3" />
      <path d="M120 74 L158 144" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M158 96 L120 166" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M158 144 L82 96" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M120 166 L82 144" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M82 144 L120 74" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />
      <path d="M82 96 L158 96" stroke="#FF6B35" strokeWidth="1.25" opacity="0.5" />

      {/* Inward Hydraulic Pressure Pistons (4-Axis) */}
      <g>
        <line x1="120" y1="44" x2="120" y2="64" stroke="url(#img-comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M120 68 L113 58 H127 Z" fill="#FF6B35" />

        <line x1="120" y1="196" x2="120" y2="176" stroke="url(#img-comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M120 172 L113 182 H127 Z" fill="#FF6B35" />

        <line x1="44" y1="120" x2="64" y2="120" stroke="url(#img-comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 120 L58 113 V127 Z" fill="#FF6B35" />

        <line x1="196" y1="120" x2="176" y2="120" stroke="url(#img-comp-piston)" strokeWidth="2.5" strokeLinecap="round" />
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
        -80%
      </text>
    </svg>
  );
}

/* ─── 02. RESIZE: FIGMA/APPLE TACTILE SCALE & BOUNDING BOX ─── */
export function ResizeImageGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-res-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#0369A1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-res-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Volumetric Radial Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#img-res-core-glow)" />

      {/* Outer Ghost Reference Frame (Target Dimensions) */}
      <rect
        x="32"
        y="32"
        width="176"
        height="140"
        rx="10"
        stroke="#94A3B8"
        strokeWidth="1.25"
        strokeDasharray="5 5"
        className="opacity-35 dark:opacity-20"
      />

      {/* Diagonal Scale Projection Ray */}
      <line
        x1="32"
        y1="32"
        x2="178"
        y2="148"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity="0.6"
      />

      {/* Active Scaling Inner Card (Apple / Figma Style) */}
      <rect
        x="32"
        y="32"
        width="118"
        height="92"
        rx="8"
        fill="url(#img-res-card-grad)"
        stroke="#0284C7"
        strokeWidth="2"
      />

      {/* Stylized Miniature Image Layout on Active Card */}
      <circle cx="62" cy="62" r="10" fill="#38BDF8" fillOpacity="0.4" />
      <path d="M44 104 L68 76 L86 94 L106 70 L136 104 Z" fill="#0284C7" fillOpacity="0.3" />

      {/* Bidirectional Diagonal Scaling Arrows */}
      <g transform="translate(136, 110)">
        <line x1="0" y1="0" x2="36" y2="30" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Arrow head forward */}
        <path d="M38 22 L38 32 L28 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Arrow head backward */}
        <path d="M-2 8 L-2 -2 L8 -2" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* 4 Tactile Anchor Handles on Scaling Frame */}
      {/* Top Left */}
      <rect x="27" y="27" width="10" height="10" rx="2.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      {/* Top Right */}
      <rect x="145" y="27" width="10" height="10" rx="2.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      {/* Bottom Left */}
      <rect x="27" y="119" width="10" height="10" rx="2.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      {/* Bottom Right (Master Handle in Motion) */}
      <rect x="145" y="119" width="12" height="12" rx="3" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />

      {/* Aspect Ratio Lock Pill (Clean & Architectural) */}
      <g transform="translate(76, 188)">
        <rect x="0" y="0" width="88" height="28" rx="14" fill="#0F172A" stroke="#0284C7" strokeWidth="1.5" />
        {/* Lock glyph */}
        <path d="M22 15 V12 A4 4 0 0 1 30 12 V15" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="19" y="15" width="14" height="9" rx="2" fill="#38BDF8" />
        <text x="40" y="20" fill="#F8FAFC" fontSize="9" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">
          16 : 9
        </text>
      </g>
    </svg>
  );
}

/* ─── 03. CROP: PHOTOGRAPHIC FRAMING & BOLD L-BRACKETS ─── */
export function CropImageGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-crop-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-crop-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* Volumetric Green Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#img-crop-core-glow)" />

      {/* Outer Dimmed Background Image (Simulates Context Outside Crop) */}
      <rect
        x="24"
        y="30"
        width="192"
        height="180"
        rx="10"
        fill="#0F172A"
        fillOpacity="0.65"
        stroke="#94A3B8"
        strokeWidth="1"
        className="opacity-40 dark:opacity-20"
      />

      {/* Stylized Mountain Landscape dimmed in background */}
      <path
        d="M32 186 L74 126 L108 162 L150 106 L208 186 Z"
        fill="#10B981"
        fillOpacity="0.1"
      />

      {/* Central Crop Viewport Window (Illuminated Subject Area) */}
      <rect
        x="48"
        y="50"
        width="144"
        height="140"
        rx="6"
        fill="url(#img-crop-light)"
        stroke="#10B981"
        strokeWidth="1.5"
      />

      {/* Rule-of-Thirds Grid (Clean, Delicate Lines) */}
      {/* Vertical grid lines */}
      <line x1="96" y1="50" x2="96" y2="190" stroke="#34D399" strokeWidth="0.85" strokeDasharray="3 3" opacity="0.6" />
      <line x1="144" y1="50" x2="144" y2="190" stroke="#34D399" strokeWidth="0.85" strokeDasharray="3 3" opacity="0.6" />
      {/* Horizontal grid lines */}
      <line x1="48" y1="96" x2="192" y2="96" stroke="#34D399" strokeWidth="0.85" strokeDasharray="3 3" opacity="0.6" />
      <line x1="48" y1="144" x2="192" y2="144" stroke="#34D399" strokeWidth="0.85" strokeDasharray="3 3" opacity="0.6" />

      {/* Camera Viewfinder Horizon Leveling Line */}
      <line x1="72" y1="120" x2="168" y2="120" stroke="#10B981" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="120" cy="120" r="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />

      {/* Heavy, Iconic Photographic L-Brackets on 4 Corners */}
      {/* Top Left */}
      <path d="M40 76 V42 H74" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top Right */}
      <path d="M166 42 H200 V76" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Left */}
      <path d="M40 164 V198 H74" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Right */}
      <path d="M166 198 H200 V164" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Focal Level Stamp */}
      <text
        x="120"
        y="218"
        textAnchor="middle"
        fill="#10B981"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="800"
        letterSpacing="0.1em"
      >
        LEVEL 0.0° // FRAME
      </text>
    </svg>
  );
}

/* ─── 04. REMOVE BG: ARCHITECTURAL VASE & ALPHA ISOLATION ─── */
export function RemoveBgGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-rem-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#6D28D9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-rem-beam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <pattern id="img-clean-checker" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#94A3B8" fillOpacity="0.3" />
          <rect x="7" width="7" height="7" fill="#E2E8F0" fillOpacity="0.08" />
          <rect y="7" width="7" height="7" fill="#E2E8F0" fillOpacity="0.08" />
          <rect x="7" y="7" width="7" height="7" fill="#94A3B8" fillOpacity="0.3" />
        </pattern>
      </defs>

      {/* Volumetric Purple Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#img-rem-core-glow)" />

      {/* Frame Canvas */}
      <rect
        x="36"
        y="36"
        width="168"
        height="168"
        rx="12"
        stroke="#8B5CF6"
        strokeWidth="1.25"
        strokeOpacity="0.5"
      />

      {/* Right-Hand Transparency Checkerboard Area (Revealed Transparent Void) */}
      <g clipPath="url(#rem-frame-clip)">
        <clipPath id="rem-frame-clip">
          <rect x="36" y="36" width="168" height="168" rx="12" />
        </clipPath>
        {/* Alpha checkerboard on right half */}
        <rect x="120" y="36" width="84" height="168" fill="url(#img-clean-checker)" />
        {/* Subtle grid line separator */}
        <line x1="120" y1="36" x2="120" y2="204" stroke="#8B5CF6" strokeWidth="1.25" strokeDasharray="3 3" opacity="0.5" />
      </g>

      {/* Iconic Classical Vase / Modern Sculpture Silhouette in Center */}
      <path
        d="M102 62 H138 L134 76 C134 76 156 94 156 122 C156 148 144 164 140 178 H100 C96 164 84 148 84 122 C84 94 106 76 106 76 L102 62 Z"
        fill="#8B5CF6"
        fillOpacity="0.25"
        stroke="#8B5CF6"
        strokeWidth="2.25"
      />

      {/* Pedestal Base */}
      <rect x="94" y="178" width="52" height="6" rx="2" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="1" />

      {/* Vertical Neural Sweep / Laser Cut Separation Line */}
      <line x1="120" y1="42" x2="120" y2="198" stroke="url(#img-rem-beam)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="120" cy="120" r="5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2" />

      {/* Floating Magic Isolation Sparks */}
      <circle cx="152" cy="74" r="2" fill="#C4B5FD" />
      <circle cx="168" cy="112" r="2.5" fill="#C4B5FD" />
      <circle cx="158" cy="154" r="2" fill="#C4B5FD" />

      {/* Telemetry Indicator */}
      <text
        x="120"
        y="222"
        textAnchor="middle"
        fill="#8B5CF6"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="800"
        letterSpacing="0.08em"
      >
        ISOLATION // ALPHA 100%
      </text>
    </svg>
  );
}

/* ─── 05. WATERMARK: GUILLOCHE SECURITY SEAL & EMBOSSED RIBBON ─── */
/* Direct reuse of the proven, high-end Watermark artwork from WorkflowGraphics */
export { WatermarkGraphic as WatermarkImageGraphic } from './WorkflowGraphics';

/* ─── 06. FLIP & ROTATE: ORBITAL COMPASS & BILATERAL MIRROR ─── */
export function FlipRotateImageGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-rot-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-rot-card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Volumetric Indigo Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#img-rot-core-glow)" />

      {/* Circular Orbital Compass Calibration Rings */}
      <circle cx="120" cy="120" r="92" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 4" className="opacity-30 dark:opacity-20" />
      <circle cx="120" cy="120" r="74" stroke="#6366F1" strokeWidth="1.25" strokeDasharray="6 4" opacity="0.5" />

      {/* Quadrant Cardinal Ticks */}
      <line x1="120" y1="22" x2="120" y2="34" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="206" x2="120" y2="218" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="120" x2="34" y2="120" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      <line x1="206" y1="120" x2="218" y2="120" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />

      {/* Rotated Active Photograph Card in Motion (-18° tilt) */}
      <g transform="rotate(-18 120 120)">
        <rect
          x="72"
          y="76"
          width="96"
          height="88"
          rx="8"
          fill="url(#img-rot-card)"
          stroke="#6366F1"
          strokeWidth="2"
        />
        {/* Card content preview */}
        <circle cx="94" cy="98" r="8" fill="#818CF8" fillOpacity="0.4" />
        <path d="M80 144 L102 120 L118 136 L134 116 L158 144 Z" fill="#6366F1" fillOpacity="0.3" />
      </g>

      {/* Dynamic 90° Curved Orbital Arrow */}
      <path
        d="M 120 46 A 74 74 0 0 1 194 120"
        stroke="#818CF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head */}
      <path d="M 194 120 L 186 112 M 194 120 L 188 128" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Bilateral Symmetry Mirror Axis Line with double-ended horizontal arrow */}
      <line x1="120" y1="36" x2="120" y2="204" stroke="#6366F1" strokeWidth="1.25" strokeDasharray="4 3" opacity="0.7" />

      {/* Degree Badge in Center */}
      <g transform="translate(94, 186)">
        <rect x="0" y="0" width="52" height="24" rx="12" fill="#0F172A" stroke="#6366F1" strokeWidth="1.5" />
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

/* ─── 07. EXPORT PDF: IMAGE-TO-DOCUMENT ARCHITECTURAL FOLIO ─── */
export function ExportPdfGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="img-pdf-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EC1C24" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#B91C1C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EC1C24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="img-pdf-sheet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Volumetric Red Radial Glow */}
      <circle cx="120" cy="120" r="100" fill="url(#img-pdf-core-glow)" />

      {/* Left Source: Raster Image Tile */}
      <g>
        <rect
          x="30"
          y="74"
          width="64"
          height="80"
          rx="6"
          stroke="#94A3B8"
          strokeWidth="1.25"
          className="opacity-40 dark:opacity-20"
        />
        <text x="62" y="90" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace" fontWeight="700" className="opacity-60 dark:opacity-40">
          IMG RAW
        </text>
        <circle cx="50" cy="108" r="6" stroke="#94A3B8" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M38 136 L48 122 L58 132 L68 118 L86 136 Z" stroke="#94A3B8" strokeWidth="1" fill="none" opacity="0.5" />
      </g>

      {/* Transmutation Vector Conduit Flow Arrows */}
      <g>
        <path d="M100 102 C114 102 118 102 128 102" stroke="#EC1C24" strokeWidth="1.75" strokeDasharray="3 3" />
        <path d="M100 114 H134" stroke="#EC1C24" strokeWidth="2.25" strokeLinecap="round" />
        <path d="M132 109 L139 114 L132 119 Z" fill="#EC1C24" />
        <path d="M100 126 C114 126 118 126 128 126" stroke="#EC1C24" strokeWidth="1.75" strokeDasharray="3 3" />
      </g>

      {/* Right Target: Architectural PDF Folio with Folded Corner */}
      <g>
        <rect x="148" y="58" width="60" height="96" rx="4" stroke="#EC1C24" strokeWidth="0.75" opacity="0.3" strokeDasharray="2 3" />
        <path
          d="M142 52 H182 L202 72 V148 H142 Z"
          fill="url(#img-pdf-sheet)"
          stroke="#EC1C24"
          strokeWidth="2"
        />
        <path d="M182 52 V72 H202" fill="#EC1C24" fillOpacity="0.4" stroke="#EC1C24" strokeWidth="1.5" />
        <rect x="148" y="80" width="28" height="13" rx="2" fill="#EC1C24" />
        <text
          x="162"
          y="89"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontSize="7"
          fontFamily="monospace"
          fontWeight="900"
        >
          PDF
        </text>
        <line x1="148" y1="104" x2="194" y2="104" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="148" y1="113" x2="188" y2="113" stroke="#FCA5A5" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
        <line x1="148" y1="122" x2="192" y2="122" stroke="#FCA5A5" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
        <line x1="148" y1="131" x2="174" y2="131" stroke="#FCA5A5" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Metric Resolution Stamp */}
      <text x="120" y="224" textAnchor="middle" fill="#EC1C24" fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="0.08em">
        300 DPI // EMBEDDED VECTOR WRAPPER
      </text>
    </svg>
  );
}
