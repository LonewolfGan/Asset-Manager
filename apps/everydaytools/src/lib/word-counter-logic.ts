/**
 * Comprehensive Word & Text Analysis Logic
 */

export interface KeywordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface DetailedTextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSec: number;
  speakingTimeSec: number;
  avgWordLength: number;
  topKeywords: KeywordFrequency[];
}

const COMMON_STOP_WORDS = new Set([
  // French
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'en', 'dans', 'que', 'qui', 'pour',
  'pas', 'sur', 'ce', 'cette', 'ces', 'par', 'avec', 'est', 'sont', 'aux', 'au', 'ne', 'se', 'il',
  'elle', 'ils', 'elles', 'on', 'mais', 'ou', 'donc', 'or', 'ni', 'car', 'mon', 'ton', 'son',
  // English
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
]);

export function analyzeText(text: string): DetailedTextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeSec: 0,
      speakingTimeSec: 0,
      avgWordLength: 0,
      topKeywords: [],
    };
  }

  const rawWords = trimmed.split(/\s+/).filter(Boolean);
  const words = rawWords.length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Reading ~220 WPM, Speaking ~130 WPM
  const readingTimeSec = Math.ceil((words / 220) * 60);
  const speakingTimeSec = Math.ceil((words / 130) * 60);
  const avgWordLength = words > 0 ? parseFloat((charactersNoSpaces / words).toFixed(1)) : 0;

  // Keyword density
  const wordFreqMap = new Map<string, number>();
  for (const raw of rawWords) {
    const clean = raw.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    if (clean.length >= 3 && !COMMON_STOP_WORDS.has(clean)) {
      wordFreqMap.set(clean, (wordFreqMap.get(clean) || 0) + 1);
    }
  }

  const sortedKeywords = Array.from(wordFreqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({
      word,
      count,
      percentage: parseFloat(((count / words) * 100).toFixed(1)),
    }));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeSec,
    speakingTimeSec,
    avgWordLength,
    topKeywords: sortedKeywords,
  };
}

export function transformTextCase(
  text: string,
  mode: 'upper' | 'lower' | 'title' | 'sentence' | 'slug' | 'camel' | 'snake' | 'kebab'
): string {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'slug':
    case 'kebab':
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    case 'snake':
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    case 'camel': {
      const words = text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-]+/g, ' ')
        .trim()
        .split(/\s+/);
      return words
        .map((w, idx) =>
          idx === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    }
    default:
      return text;
  }
}
