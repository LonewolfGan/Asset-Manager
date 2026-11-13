import type { OgCardData } from "./og-types";

// Unicode property escape regex matching all emojis, flags, keycaps, and pictographs
const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

function sanitize(str: string): string {
  return str
    .replace(EMOJI_REGEX, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .trim();
}

function wrapText(text: string, maxCharsPerLine = 38): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (lines.length > 3) {
    const clamped = lines.slice(0, 3);
    clamped[2] = clamped[2].replace(/[.,:;]?$/, "…");
    return clamped;
  }
  return lines;
}

export function generateOgSvg(data: OgCardData): string {
  const category = sanitize(data.category.toUpperCase());
  // Strip emojis, wrap and clamp on raw text, then sanitize each line to prevent entity truncation
  const rawTitleNoEmoji = data.title.replace(EMOJI_REGEX, "").trim();
  const titleLines = wrapText(rawTitleNoEmoji, 36).map(sanitize);
  const badges = data.badges.map(sanitize).slice(0, 3);
  const inFmt = data.inputFormat ? sanitize(data.inputFormat.toUpperCase()) : null;
  const outFmt = data.outputFormat ? sanitize(data.outputFormat.toUpperCase()) : null;

  const titleTspans = titleLines
    .map((line, idx) => `<tspan x="88" dy="${idx === 0 ? 0 : 54}">${line}</tspan>`)
    .join("");

  const connectorSvg = inFmt && outFmt
    ? `
      <g transform="translate(88, 380)">
        <rect x="0" y="0" width="110" height="44" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1.5"/>
        <text x="55" y="28" fill="#FAFAFA" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">${inFmt}</text>
        <line x1="120" y1="22" x2="250" y2="22" stroke="#FF6B35" stroke-width="2" stroke-dasharray="6 4"/>
        <polygon points="252,22 242,16 242,28" fill="#FF6B35"/>
        <circle cx="185" cy="22" r="4" fill="#FF6B35"/>
        <rect x="260" y="0" width="110" height="44" rx="8" fill="#1c1917" stroke="#FF6B35" stroke-width="1.5"/>
        <text x="315" y="28" fill="#FF6B35" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">${outFmt}</text>
      </g>`
    : data.readTimeMinutes
    ? `
      <g transform="translate(88, 380)">
        <rect x="0" y="0" width="160" height="38" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1.5"/>
        <text x="80" y="24" fill="#A1A1AA" font-family="monospace" font-size="13" font-weight="600" text-anchor="middle">${data.readTimeMinutes} MIN READ</text>
      </g>`
    : "";

  const telemetryBadges = badges
    .map((badge, idx) => {
      const x = 88 + idx * 340;
      return `
        <g transform="translate(${x}, 528)">
          <circle cx="4" cy="4" r="3" fill="#FF6B35"/>
          <text x="16" y="8" fill="#A1A1AA" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.05em">${badge}</text>
        </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#27272a" fill-opacity="0.6"/>
    </pattern>
    <radialGradient id="ambient" cx="85%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#FF6B35" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Surface 0: Deep OLED Canvas -->
  <rect width="1200" height="630" fill="#09090b"/>
  <rect width="1200" height="630" fill="url(#dot-grid)"/>
  <rect width="1200" height="630" fill="url(#ambient)"/>

  <!-- Surface 1: Double-Bezel Inner Machined Plate -->
  <rect x="44" y="44" width="1112" height="542" rx="24" fill="#121215" stroke="#27272a" stroke-width="1.5"/>
  <rect x="45.5" y="45.5" width="1109" height="539" rx="22.5" fill="none" stroke="white" stroke-opacity="0.05" stroke-width="1"/>

  <!-- Top Brand Row -->
  <g transform="translate(88, 96)">
    <!-- Machined Logo Mark -->
    <rect x="0" y="0" width="28" height="28" rx="6" fill="#1c1917" stroke="#FF6B35" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="4" fill="#FF6B35"/>
    <text x="40" y="20" fill="#FAFAFA" font-family="sans-serif" font-size="17" font-weight="700" letter-spacing="0.1em">EVERYDAYTOOLS</text>
  </g>

  <!-- Category Badge Pill -->
  <g transform="translate(820, 90)">
    <rect x="0" y="0" width="250" height="36" rx="10" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <text x="125" y="23" fill="#FF6B35" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.08em" text-anchor="middle">${category}</text>
  </g>

  <!-- Main Title -->
  <text x="88" y="220" fill="#FFFFFF" font-family="sans-serif" font-size="46" font-weight="700" letter-spacing="-0.02em">
    ${titleTspans}
  </text>

  <!-- Connector or Feature Subline -->
  ${connectorSvg}

  <!-- Telemetry Separator -->
  <line x1="88" y1="495" x2="1112" y2="495" stroke="#27272a" stroke-width="1"/>

  <!-- Technical Telemetry Footer Badges -->
  ${telemetryBadges}
</svg>`;
}

let resvgModule: typeof import("@resvg/resvg-js") | null = null;
async function getResvg() {
  return (resvgModule ??= await import("@resvg/resvg-js"));
}

export async function renderOgPng(svgString: string): Promise<Buffer> {
  const { Resvg } = await getResvg();
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: 1200 },
    shapeRendering: 2,
    textRendering: 1,
    imageRendering: 0,
  });
  const rendered = resvg.render();
  return rendered.asPng();
}
