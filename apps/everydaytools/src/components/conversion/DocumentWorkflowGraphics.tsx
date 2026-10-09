import React from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOCUMENT & DATA WORKFLOW GRAPHICS
 * Master Vector Artworks for Document, Office, Tabular & Code continuums.
 * 240x240 canvas, volumetric ambient glows, hairline precision, 60fps SVG.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// 1. WORD DOCUMENT (.docx)
export const WordDocGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="wordGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#185ABD" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#185ABD" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wordGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#185ABD" />
        <stop offset="1" stopColor="#0078D4" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#wordGlow)" />
    {/* Page base with folded corner */}
    <path
      d="M70 45H145L175 75V195C175 200.523 170.523 205 165 205H70C64.4772 205 60 200.523 60 195V55C60 49.4772 64.4772 45 70 45Z"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    <path d="M145 45V75H175" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* Typographic flow lines */}
    <line x1="80" y1="95" x2="155" y2="95" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
    <line x1="80" y1="115" x2="145" y2="115" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
    <line x1="80" y1="135" x2="155" y2="135" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
    <line x1="80" y1="155" x2="130" y2="155" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
    {/* Word Badge 'W' */}
    <rect x="45" y="90" width="60" height="60" rx="14" fill="url(#wordGrad)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
    <path
      d="M60 106L67 134L75 116L83 134L90 106"
      stroke="#ffffff"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. EXCEL SPREADSHEET (.xlsx)
export const ExcelSheetGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="excelGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#107C41" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#107C41" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="excelGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#107C41" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#excelGlow)" />
    {/* Grid Frame */}
    <rect
      x="55"
      y="55"
      width="130"
      height="130"
      rx="16"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    {/* Grid cell lines */}
    <line x1="55" y1="95" x2="185" y2="95" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
    <line x1="55" y1="135" x2="185" y2="135" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
    <line x1="100" y1="55" x2="100" y2="185" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
    <line x1="145" y1="55" x2="145" y2="185" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
    {/* Active Cell Highlight */}
    <rect x="102" y="97" width="41" height="36" rx="4" fill="#107C41" fillOpacity="0.15" stroke="#107C41" strokeWidth="1.5" />
    {/* Excel Badge 'X' */}
    <rect x="40" y="85" width="55" height="55" rx="14" fill="url(#excelGrad)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
    <path
      d="M56 101L78 123M78 101L56 123"
      stroke="#ffffff"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. CSV / TABULAR DATA (.csv)
export const CsvTableGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="csvGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#csvGlow)" />
    {/* Tabular Matrix */}
    <rect
      x="50"
      y="50"
      width="140"
      height="140"
      rx="16"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#0D9488"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    {/* Header banner */}
    <path d="M50 66C50 57.1634 57.1634 50 66 50H174C182.837 50 190 57.1634 190 66V82H50V66Z" fill="#0D9488" fillOpacity="0.12" />
    <line x1="50" y1="82" x2="190" y2="82" stroke="#0D9488" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* Columns */}
    <line x1="95" y1="50" x2="95" y2="190" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
    <line x1="145" y1="50" x2="145" y2="190" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
    {/* Comma delimiters in data rows */}
    <text x="65" y="112" fill="currentColor" fillOpacity="0.6" fontSize="16" fontFamily="monospace" fontWeight="bold">col1,</text>
    <text x="110" y="112" fill="currentColor" fillOpacity="0.6" fontSize="16" fontFamily="monospace" fontWeight="bold">col2,</text>
    <text x="155" y="112" fill="currentColor" fillOpacity="0.6" fontSize="16" fontFamily="monospace" fontWeight="bold">col3</text>
    <text x="65" y="145" fill="#0D9488" fontSize="15" fontFamily="monospace" fontWeight="bold">row1,</text>
    <text x="110" y="145" fill="#0D9488" fontSize="15" fontFamily="monospace" fontWeight="bold">row2,</text>
    <text x="155" y="145" fill="#0D9488" fontSize="15" fontFamily="monospace" fontWeight="bold">row3</text>
  </svg>
);

// 4. JSON TREE & CODE (.json)
export const JsonTreeGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="jsonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#jsonGlow)" />
    {/* Terminal / Code Window */}
    <rect
      x="50"
      y="55"
      width="140"
      height="130"
      rx="16"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#F59E0B"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    {/* Terminal window dots */}
    <circle cx="70" cy="73" r="3.5" fill="#F59E0B" fillOpacity="0.6" />
    <circle cx="82" cy="73" r="3.5" fill="#F59E0B" fillOpacity="0.3" />
    <circle cx="94" cy="73" r="3.5" fill="#F59E0B" fillOpacity="0.3" />
    {/* Big Brackets */}
    <path
      d="M78 95C72 95 68 99 68 105V115C68 119 64 120 62 120C64 120 68 121 68 125V135C68 141 72 145 78 145"
      stroke="#F59E0B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M162 95C168 95 172 99 172 105V115C172 119 176 120 178 120C176 120 172 121 172 125V135C172 141 168 145 162 145"
      stroke="#F59E0B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Inner JSON Key-Value Nodes */}
    <rect x="85" y="102" width="28" height="6" rx="3" fill="#F59E0B" fillOpacity="0.8" />
    <rect x="119" y="102" width="35" height="6" rx="3" fill="currentColor" fillOpacity="0.3" />
    <rect x="85" y="118" width="38" height="6" rx="3" fill="#F59E0B" fillOpacity="0.8" />
    <rect x="129" y="118" width="22" height="6" rx="3" fill="currentColor" fillOpacity="0.3" />
    <rect x="85" y="134" width="20" height="6" rx="3" fill="#F59E0B" fillOpacity="0.8" />
    <rect x="111" y="134" width="40" height="6" rx="3" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

// 5. MARKDOWN (.md)
export const MarkdownGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="mdGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#mdGlow)" />
    {/* Split Editor Pane */}
    <rect
      x="50"
      y="55"
      width="140"
      height="130"
      rx="16"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#0EA5E9"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    <line x1="120" y1="55" x2="120" y2="185" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Left Side: Markdown Syntax */}
    <text x="62" y="85" fill="#0EA5E9" fontSize="13" fontFamily="monospace" fontWeight="bold"># H1</text>
    <text x="62" y="105" fill="currentColor" fillOpacity="0.5" fontSize="11" fontFamily="monospace">**bold**</text>
    <text x="62" y="125" fill="#0EA5E9" fontSize="11" fontFamily="monospace">&gt; quote</text>
    <text x="62" y="145" fill="currentColor" fillOpacity="0.5" fontSize="11" fontFamily="monospace">[link]()</text>
    <text x="62" y="165" fill="#0EA5E9" fontSize="11" fontFamily="monospace">- list</text>
    {/* Right Side: Live Render Preview */}
    <rect x="132" y="74" width="45" height="12" rx="3" fill="#0EA5E9" fillOpacity="0.25" />
    <line x1="132" y1="98" x2="175" y2="98" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="132" y1="112" x2="165" y2="112" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <path d="M132 125H170" stroke="#0EA5E9" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    <circle cx="136" cy="148" r="2.5" fill="#0EA5E9" />
    <line x1="144" y1="148" x2="172" y2="148" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 6. POWERPOINT PRESENTATION (.pptx)
export const PptxSlideGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="pptxGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="pptxGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EA580C" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#pptxGlow)" />
    {/* Slide Frame 16:9 */}
    <rect
      x="50"
      y="65"
      width="140"
      height="95"
      rx="14"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#EA580C"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    {/* Inner Chart & Analytics */}
    <circle cx="90" cy="112" r="22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
    <path d="M90 90C102.15 90 112 99.85 112 112H90V90Z" fill="#EA580C" fillOpacity="0.8" />
    {/* Text Lines */}
    <rect x="125" y="98" width="50" height="5" rx="2.5" fill="#EA580C" fillOpacity="0.6" />
    <rect x="125" y="112" width="40" height="5" rx="2.5" fill="currentColor" fillOpacity="0.25" />
    <rect x="125" y="126" width="30" height="5" rx="2.5" fill="currentColor" fillOpacity="0.25" />
    {/* Presentation Stand */}
    <path d="M120 160V185M95 185H145" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 7. TEXT & SCRUBBER (.txt)
export const TextDocGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="txtGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#64748B" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#txtGlow)" />
    {/* Monospace Document Folio */}
    <rect
      x="60"
      y="50"
      width="120"
      height="140"
      rx="14"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#64748B"
      strokeOpacity="0.35"
      strokeWidth="1.5"
    />
    {/* Terminal prompt symbol */}
    <text x="75" y="82" fill="#64748B" fontSize="18" fontFamily="monospace" fontWeight="bold">&gt;_</text>
    {/* Flow lines */}
    <line x1="75" y1="102" x2="160" y2="102" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="75" y1="120" x2="145" y2="120" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="75" y1="138" x2="165" y2="138" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="75" y1="156" x2="130" y2="156" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="75" y1="174" x2="150" y2="174" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 8. HTML PAGE (.html)
export const HtmlCodeGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="htmlGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#htmlGlow)" />
    {/* Browser Viewport Window */}
    <rect
      x="50"
      y="55"
      width="140"
      height="130"
      rx="16"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#EA580C"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    <path d="M50 78H190" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
    <circle cx="68" cy="67" r="3" fill="#EA580C" fillOpacity="0.7" />
    <circle cx="78" cy="67" r="3" fill="currentColor" fillOpacity="0.2" />
    <circle cx="88" cy="67" r="3" fill="currentColor" fillOpacity="0.2" />
    {/* HTML Tags Symbol */}
    <path
      d="M92 105L75 120L92 135M148 105L165 120L148 135M130 98L110 142"
      stroke="#EA580C"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 9. EPUB EBOOK (.epub)
export const EpubBookGraphic: React.FC = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="epubGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#epubGlow)" />
    {/* Open Book Folio */}
    <path
      d="M120 75C108 65 85 65 60 70V175C85 170 108 170 120 180C132 170 155 170 180 175V70C155 65 132 65 120 75Z"
      fill="currentColor"
      fillOpacity="0.04"
      stroke="#8B5CF6"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    <line x1="120" y1="75" x2="120" y2="180" stroke="#8B5CF6" strokeOpacity="0.6" strokeWidth="2" />
    {/* Left Page Lines */}
    <line x1="72" y1="95" x2="108" y2="95" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="110" x2="104" y2="110" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="125" x2="108" y2="125" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="140" x2="98" y2="140" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    {/* Right Page Lines */}
    <line x1="132" y1="95" x2="168" y2="95" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="132" y1="110" x2="164" y2="110" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="132" y1="125" x2="168" y2="125" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="132" y1="140" x2="158" y2="140" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
