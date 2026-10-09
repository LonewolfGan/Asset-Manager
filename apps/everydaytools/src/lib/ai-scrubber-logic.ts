/**
 * AI Text Scrubber & Watermark Cleaner
 * Removes invisible zero-width unicode characters and humanizes recognizable AI clichés.
 */

// Comprehensive zero-width and bidirectional control characters often used for watermarking
export const INVISIBLE_CHARS_REGEX =
  /[\u200B-\u200D\u200E\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD\u180E\u2000-\u200A]/g;

export interface DetectedInvisible {
  index: number;
  codePoint: string;
  charName: string;
}

export interface ScrubInvisibleResult {
  cleanedText: string;
  count: number;
  detections: DetectedInvisible[];
}

export function detectAndScrubInvisibles(text: string): ScrubInvisibleResult {
  const detections: DetectedInvisible[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(INVISIBLE_CHARS_REGEX.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    const code = match[0].charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    detections.push({
      index: match.index,
      codePoint: `U+${code}`,
      charName: getUnicodeName(code),
    });
  }

  const cleanedText = text.replace(INVISIBLE_CHARS_REGEX, '');
  return {
    cleanedText,
    count: detections.length,
    detections,
  };
}

function getUnicodeName(hex: string): string {
  switch (hex) {
    case '200B': return 'Zero Width Space';
    case '200C': return 'Zero Width Non-Joiner';
    case '200D': return 'Zero Width Joiner';
    case '2060': return 'Word Joiner';
    case 'FEFF': return 'Zero Width No-Break Space (BOM)';
    case '00AD': return 'Soft Hyphen';
    case '200E': return 'Left-to-Right Mark';
    case '200F': return 'Right-to-Left Mark';
    default: return `Invisible Char U+${hex}`;
  }
}

export interface ClichéReplacement {
  pattern: RegExp;
  phrase: string;
  alternatives: string[];
}

export const AI_PATTERNS: ClichéReplacement[] = [
  // French Clichés
  { pattern: /\ben conclusion\b/gi, phrase: 'en conclusion', alternatives: ['pour résumer', 'en somme', 'au final'] },
  { pattern: /\bil est important de noter que\b/gi, phrase: 'il est important de noter que', alternatives: ['notons que', 'il convient de relever que', ''] },
  { pattern: /\bforce est de constater que\b/gi, phrase: 'force est de constater que', alternatives: ['on constate que', 'il apparaît que'] },
  { pattern: /\bde surcroît\b/gi, phrase: 'de surcroît', alternatives: ['aussi', 'de plus', 'également'] },
  { pattern: /\bil convient de souligner que\b/gi, phrase: 'il convient de souligner que', alternatives: ['soulignons que', 'remarquons que'] },
  { pattern: /\btémoigne de\b/gi, phrase: 'témoigne de', alternatives: ['montre', 'illustre'] },
  { pattern: /\bdans un monde en constante évolution\b/gi, phrase: 'dans un monde en constante évolution', alternatives: ['aujourd’hui', 'de nos jours'] },

  // English Clichés
  { pattern: /\bin conclusion\b/gi, phrase: 'in conclusion', alternatives: ['to sum up', 'overall', 'ultimately'] },
  { pattern: /\bit is important to note that\b/gi, phrase: 'it is important to note that', alternatives: ['note that', 'worth mentioning,'] },
  { pattern: /\bfurthermore\b/gi, phrase: 'furthermore', alternatives: ['also', 'additionally', 'beyond this'] },
  { pattern: /\bin summary\b/gi, phrase: 'in summary', alternatives: ['in short', 'to recap'] },
  { pattern: /\bit is worth noting that\b/gi, phrase: 'it is worth noting that', alternatives: ['note that', 'importantly,'] },
  { pattern: /\bas previously mentioned\b/gi, phrase: 'as previously mentioned', alternatives: ['as noted', 'as seen earlier'] },
  { pattern: /\bin today's fast-paced world\b/gi, phrase: "in today's fast-paced world", alternatives: ['today', 'currently'] },
  { pattern: /\bdelve into\b/gi, phrase: 'delve into', alternatives: ['explore', 'examine', 'look into'] },
  { pattern: /\btapestry of\b/gi, phrase: 'tapestry of', alternatives: ['blend of', 'mix of', 'range of'] },
  { pattern: /\btestament to\b/gi, phrase: 'testament to', alternatives: ['proof of', 'sign of', 'demonstrates'] },
];

export interface ScrubStylisticResult {
  cleanedText: string;
  replacedCount: number;
  replacedPhrases: string[];
}

export function scrubStylisticPatterns(text: string): ScrubStylisticResult {
  let cleaned = text;
  let replacedCount = 0;
  const replacedPhrases: string[] = [];

  for (const item of AI_PATTERNS) {
    if (item.pattern.test(cleaned)) {
      item.pattern.lastIndex = 0; // reset regex
      cleaned = cleaned.replace(item.pattern, (match) => {
        replacedCount++;
        replacedPhrases.push(match);
        const isCapitalized = match.charAt(0) !== match.charAt(0).toLowerCase();
        const alt = item.alternatives[Math.floor(Math.random() * item.alternatives.length)];
        if (!alt) return '';
        return isCapitalized ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt.toLowerCase();
      });
    }
  }

  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return {
    cleanedText: cleaned,
    replacedCount,
    replacedPhrases: Array.from(new Set(replacedPhrases)),
  };
}

export function scrubWhitespace(text: string): { cleanedText: string; count: number } {
  const originalLen = text.length;
  const cleaned = text
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return { cleanedText: cleaned, count: Math.max(0, originalLen - cleaned.length) };
}

export function scrubEmDashes(text: string): { cleanedText: string; count: number } {
  const emDashRegex = /[—–―]/g;
  const matches = text.match(emDashRegex);
  const count = matches ? matches.length : 0;
  if (count === 0) return { cleanedText: text, count: 0 };

  let cleaned = text;

  // 1. Replace list bullet dashes at start of line:
  // e.g. "— Item" -> "- Item"
  cleaned = cleaned.replace(/^([ \t]*)[—–―]\s*/gm, '$1- ');

  // 2. Replace paired em-dashes used for parenthetical incisions:
  // e.g. "L'innovation — souvent perçue comme un défi — reste essentielle"
  // -> "L'innovation, souvent perçue comme un défi, reste essentielle"
  cleaned = cleaned.replace(/(\S)[ \t]*[—–―][ \t]*([^—–―\n]+?)[ \t]*[—–―][ \t]*(\S)/g, '$1, $2, $3');

  // 3. Replace remaining em-dashes between words before lowercase continuation
  cleaned = cleaned.replace(/([A-Za-z0-9à-ÿÀ-Ý])[ \t]*[—–―][ \t]*([a-zà-ÿ])/g, '$1, $2');

  // 4. Any other standalone em-dash: convert to clean standard spaced hyphen " - "
  cleaned = cleaned.replace(/[ \t]*[—–―][ \t]*/g, ' - ');

  return { cleanedText: cleaned, count };
}

export function scrubAiSymbolsAndQuotes(text: string): { cleanedText: string; count: number } {
  let count = 0;
  let cleaned = text;

  // 1. Replace AI decorative bullets at line starts
  cleaned = cleaned.replace(/^([ \t]*)[✦✧❖➢➤►●■◆★✪][ \t]*/gm, (match, indent) => {
    count++;
    return `${indent}- `;
  });

  // Any remaining decorative symbols in text
  cleaned = cleaned.replace(/[✦✧❖➢➤►●■◆★✪]/g, () => {
    count++;
    return '';
  });

  // 2. Normalize curly quotes to standard quotes
  cleaned = cleaned.replace(/[“”]/g, () => {
    count++;
    return '"';
  });
  cleaned = cleaned.replace(/[‘’]/g, () => {
    count++;
    return "'";
  });

  return { cleanedText: cleaned, count };
}

export interface TextAnalysis {
  wordCount: number;
  charCount: number;
  invisiblesCount: number;
  invisiblesDetections: DetectedInvisible[];
  emDashesCount: number;
  stylisticCount: number;
  stylisticMatches: string[];
  symbolsCount: number;
}

export function analyzeText(text: string): TextAnalysis {
  if (!text) {
    return {
      wordCount: 0,
      charCount: 0,
      invisiblesCount: 0,
      invisiblesDetections: [],
      emDashesCount: 0,
      stylisticCount: 0,
      stylisticMatches: [],
      symbolsCount: 0,
    };
  }

  const invRes = detectAndScrubInvisibles(text);

  const emMatches = text.match(/[—–―]/g);
  const emDashesCount = emMatches ? emMatches.length : 0;

  const symMatches = text.match(/[✦✧❖➢➤►●■◆★✪“”‘’]/g);
  const symbolsCount = symMatches ? symMatches.length : 0;

  let stylisticCount = 0;
  const stylisticMatches: string[] = [];
  for (const item of AI_PATTERNS) {
    const regex = new RegExp(item.pattern.source, 'gi');
    const matches = text.match(regex);
    if (matches) {
      stylisticCount += matches.length;
      stylisticMatches.push(item.phrase);
    }
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  return {
    wordCount: words,
    charCount: chars,
    invisiblesCount: invRes.count,
    invisiblesDetections: invRes.detections,
    emDashesCount,
    stylisticCount,
    stylisticMatches: Array.from(new Set(stylisticMatches)),
    symbolsCount,
  };
}

export const SAMPLE_AI_TEXT_FR = `Dans un monde en constante évolution, l'intelligence artificielle — souvent présentée comme une révolution sans précédent — transforme la création de contenu.\u200B De surcroît, force est de constater que ces technologies redéfinissent nos méthodes de travail — ouvrant la voie à une nouvelle ère.\uFEFF

✦ Première étape : automatisation des tâches redondantes
✦ Seconde étape : intégration des flux “cognitifs”

En conclusion, il convient de souligner que l'adoption de ces outils témoigne de notre capacité d'adaptation.`;

export const SAMPLE_AI_TEXT_EN = `In today's fast-paced world, artificial intelligence — often hailed as a transformative milestone — is redefining communication.\u200B Furthermore, as previously mentioned, this transition delves into unprecedented efficiency — reshaping creative workflows.\uFEFF

✦ Key priority: streamlined document pipelines
✦ Core advantage: elimination of “invisible” tracking markers

In conclusion, this progress stands as a testament to human innovation.`;

