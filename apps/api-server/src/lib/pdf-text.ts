/**
 * PDF Text & WinAnsi Encoding Sanitizer
 * pdf-lib StandardFonts (Helvetica, Times, Courier) only support the WinAnsi (Windows-1252) character set.
 * Characters outside this encoding (e.g., emojis, Cyrillic, Asian ideograms, non-WinAnsi symbols)
 * crash pdf-lib with an unhandled "WinAnsi cannot encode" exception.
 */

// Extra Windows-1252 Unicode code points (0x80 - 0x9F mappings)
const WIN_ANSI_EXTRAS = new Set([
  0x20AC, // €
  0x201A, // ‚
  0x0192, // ƒ
  0x201E, // „
  0x2026, // …
  0x2020, // †
  0x2021, // ‡
  0x02C6, // ˆ
  0x2030, // ‰
  0x0160, // Š
  0x2039, // ‹
  0x0152, // Œ
  0x017D, // Ž
  0x2018, // ‘
  0x2019, // ’
  0x201C, // “
  0x201D, // ”
  0x2022, // •
  0x2013, // –
  0x2014, // —
  0x02DC, // ˜
  0x2122, // ™
  0x0161, // š
  0x203A, // ›
  0x0153, // œ
  0x017E, // ž
  0x0178, // Ÿ
]);

/**
 * Checks if a Unicode code point is encodable in standard WinAnsi.
 */
export function isWinAnsiCodePoint(code: number): boolean {
  // Standard ASCII printable + whitespace: \t (9), \n (10), \r (13), 32-126
  if (code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126)) {
    return true;
  }
  // Latin-1 Supplement: 0xA0 (160) - 0xFF (255)
  if (code >= 160 && code <= 255) {
    return true;
  }
  // Windows-1252 defined symbols & special characters
  return WIN_ANSI_EXTRAS.has(code);
}

/**
 * Normalizes and filters a string so it can be safely drawn in pdf-lib with StandardFonts.
 * Non-WinAnsi characters (e.g. emojis, non-Latin scripts) are safely stripped or substituted.
 */
export function sanitizeWinAnsi(text?: string | null): string {
  if (!text) return "";

  // Normalize Unicode to canonical decomposition + composition (NFC)
  const normalized = text.normalize("NFC");
  let result = "";

  for (const char of normalized) {
    const code = char.codePointAt(0);
    if (code !== undefined && isWinAnsiCodePoint(code)) {
      result += char;
    }
  }

  return result;
}
