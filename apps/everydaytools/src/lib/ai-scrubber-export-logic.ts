import {
  detectAndScrubInvisibles,
  scrubEmDashes,
  scrubStylisticPatterns,
  scrubAiSymbolsAndQuotes,
  scrubWhitespace,
  TextAnalysis,
} from './ai-scrubber-logic';

export interface ScrubOptions {
  invisibles: boolean;
  emDashes: boolean;
  stylistic: boolean;
  symbols: boolean;
  whitespace: boolean;
}

export interface ScrubExecutionResult {
  outputText: string;
  totalModified: number;
  invCount: number;
  emCount: number;
  stylCount: number;
  symCount: number;
}

/**
 * Execute AI text scrubbing pipeline according to active options
 */
export function executeTextScrubbing(
  input: string,
  options: ScrubOptions
): ScrubExecutionResult {
  let current = input;
  let invCount = 0;
  let emCount = 0;
  let stylCount = 0;
  let symCount = 0;

  // 1. Purge invisible zero-width watermarks & control characters
  if (options.invisibles) {
    const invRes = detectAndScrubInvisibles(current);
    current = invRes.cleanedText;
    invCount = invRes.count;
  }

  // 2. Normalize AI em-dashes and long incisions
  if (options.emDashes) {
    const emRes = scrubEmDashes(current);
    current = emRes.cleanedText;
    emCount = emRes.count;
  }

  // 3. Humanize stylistic AI clichés
  if (options.stylistic) {
    const stylRes = scrubStylisticPatterns(current);
    current = stylRes.cleanedText;
    stylCount = stylRes.replacedCount;
  }

  // 4. Normalize AI decorative symbols & curly quotes
  if (options.symbols) {
    const symRes = scrubAiSymbolsAndQuotes(current);
    current = symRes.cleanedText;
    symCount = symRes.count;
  }

  // 5. Normalize excess whitespaces & redundant newlines
  if (options.whitespace) {
    const wsRes = scrubWhitespace(current);
    current = wsRes.cleanedText;
  }

  const totalModified = invCount + emCount + stylCount + symCount;

  return {
    outputText: current,
    totalModified,
    invCount,
    emCount,
    stylCount,
    symCount,
  };
}

/**
 * Format compact anomalies summary string
 */
export function formatAnomaliesSummary(
  analysis: TextAnalysis,
  isFr: boolean
): string {
  const parts: string[] = [];

  if (analysis.invisiblesCount > 0) {
    parts.push(`${analysis.invisiblesCount} inv.`);
  }
  if (analysis.emDashesCount > 0) {
    parts.push(
      `${analysis.emDashesCount} ${isFr ? 'tirets' : 'dashes'}`
    );
  }
  if (analysis.stylisticCount > 0) {
    parts.push(`${analysis.stylisticCount} clichés`);
  }
  if (analysis.symbolsCount > 0) {
    parts.push(`${analysis.symbolsCount} sym.`);
  }

  return parts.join(' ');
}

/**
 * Trigger text file download in browser
 */
export function downloadCleanedTextFile(
  content: string,
  filename: string = 'scrubbed_text.txt'
): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
