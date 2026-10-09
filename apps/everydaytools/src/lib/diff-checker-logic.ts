/**
 * Robust LCS-based Diff Engine with word-level token highlighting.
 */

export type DiffChangeType = 'equal' | 'insert' | 'delete' | 'modify';

export type DiffViewMode = 'edit' | 'split' | 'unified';

export interface InlineToken {
  type: 'equal' | 'insert' | 'delete';
  text: string;
}

export interface DiffLine {
  type: DiffChangeType;
  lineA?: number;
  lineB?: number;
  textA?: string;
  textB?: string;
  tokensA?: InlineToken[];
  tokensB?: InlineToken[];
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
  totalLinesA: number;
  totalLinesB: number;
  similarityPct: number;
}

export interface DiffResult {
  lines: DiffLine[];
  stats: DiffStats;
}

export { DIFF_SAMPLES } from './diff-checker-samples';

/**
 * Standard Longest Common Subsequence (LCS) matrix computation
 */
function computeLCS<T>(
  seqA: T[],
  seqB: T[],
  isEqual: (a: T, b: T) => boolean
): number[][] {
  const m = seqA.length;
  const n = seqB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isEqual(seqA[i - 1], seqB[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * Compute word/token-level diff inside two modified strings
 */
export function computeInlineDiff(
  strA: string,
  strB: string,
  options?: DiffOptions
): { tokensA: InlineToken[]; tokensB: InlineToken[] } {
  const regex = /(\s+|[^\s\w]+|\w+)/g;
  const tokensA = strA.match(regex) || [strA];
  const tokensB = strB.match(regex) || [strB];

  const normalize = (t: string) => {
    let s = t;
    if (options?.ignoreWhitespace) s = s.trim();
    if (options?.ignoreCase) s = s.toLowerCase();
    return s;
  };

  const dp = computeLCS(tokensA, tokensB, (a, b) => normalize(a) === normalize(b));

  let i = tokensA.length;
  let j = tokensB.length;

  const resA: InlineToken[] = [];
  const resB: InlineToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(tokensA[i - 1]) === normalize(tokensB[j - 1])) {
      resA.unshift({ type: 'equal', text: tokensA[i - 1] });
      resB.unshift({ type: 'equal', text: tokensB[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      resB.unshift({ type: 'insert', text: tokensB[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      resA.unshift({ type: 'delete', text: tokensA[i - 1] });
      i--;
    }
  }

  return { tokensA: resA, tokensB: resB };
}

/**
 * Computes full line-by-line diff with LCS and intra-line highlights
 */
export function computeTextDiff(
  textA: string,
  textB: string,
  options: DiffOptions = {}
): DiffResult {
  const rawLinesA = textA.split('\n');
  const rawLinesB = textB.split('\n');

  const normalizeLine = (line: string) => {
    let s = line;
    if (options.ignoreWhitespace) s = s.trim().replace(/\s+/g, ' ');
    if (options.ignoreCase) s = s.toLowerCase();
    return s;
  };

  const dp = computeLCS(rawLinesA, rawLinesB, (a, b) => normalizeLine(a) === normalizeLine(b));

  let i = rawLinesA.length;
  let j = rawLinesB.length;

  interface RawItem {
    type: 'equal' | 'insert' | 'delete';
    lineAIndex?: number;
    lineBIndex?: number;
    textA?: string;
    textB?: string;
  }

  const rawBacktrack: RawItem[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalizeLine(rawLinesA[i - 1]) === normalizeLine(rawLinesB[j - 1])) {
      rawBacktrack.unshift({
        type: 'equal',
        lineAIndex: i,
        lineBIndex: j,
        textA: rawLinesA[i - 1],
        textB: rawLinesB[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawBacktrack.unshift({
        type: 'insert',
        lineBIndex: j,
        textB: rawLinesB[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawBacktrack.unshift({
        type: 'delete',
        lineAIndex: i,
        textA: rawLinesA[i - 1],
      });
      i--;
    }
  }

  const diffLines: DiffLine[] = [];
  let additions = 0;
  let deletions = 0;
  let modifications = 0;
  let unchanged = 0;

  for (let idx = 0; idx < rawBacktrack.length; idx++) {
    const item = rawBacktrack[idx];
    const next = rawBacktrack[idx + 1];

    if (item.type === 'delete' && next && next.type === 'insert') {
      const { tokensA, tokensB } = computeInlineDiff(item.textA || '', next.textB || '', options);
      diffLines.push({
        type: 'modify',
        lineA: item.lineAIndex,
        lineB: next.lineBIndex,
        textA: item.textA,
        textB: next.textB,
        tokensA,
        tokensB,
      });
      modifications++;
      idx++;
    } else if (item.type === 'equal') {
      diffLines.push({
        type: 'equal',
        lineA: item.lineAIndex,
        lineB: item.lineBIndex,
        textA: item.textA,
        textB: item.textB,
      });
      unchanged++;
    } else if (item.type === 'insert') {
      diffLines.push({
        type: 'insert',
        lineB: item.lineBIndex,
        textB: item.textB,
      });
      additions++;
    } else if (item.type === 'delete') {
      diffLines.push({
        type: 'delete',
        lineA: item.lineAIndex,
        textA: item.textA,
      });
      deletions++;
    }
  }

  const maxTotal = Math.max(rawLinesA.length, rawLinesB.length);
  const similarityPct = maxTotal > 0 ? Math.round((unchanged / maxTotal) * 100) : 100;

  return {
    lines: diffLines,
    stats: {
      additions,
      deletions,
      modifications,
      unchanged,
      totalLinesA: rawLinesA.length,
      totalLinesB: rawLinesB.length,
      similarityPct,
    },
  };
}

/**
 * Formats diff lines into standard unified patch text (.diff)
 */
export function generateUnifiedPatch(
  textA: string,
  textB: string,
  diffLines: DiffLine[]
): string {
  if (!textA && !textB) return '';
  const linesCountA = textA ? textA.split('\n').length : 0;
  const linesCountB = textB ? textB.split('\n').length : 0;
  const header = `--- original.txt\n+++ modified.txt\n@@ -1,${linesCountA} +1,${linesCountB} @@\n`;
  const body = diffLines
    .map((line) => {
      if (line.type === 'equal') return ` ${line.textA ?? ''}`;
      if (line.type === 'delete') return `-${line.textA ?? ''}`;
      if (line.type === 'insert') return `+${line.textB ?? ''}`;
      if (line.type === 'modify') return `-${line.textA ?? ''}\n+${line.textB ?? ''}`;
      return '';
    })
    .join('\n');
  return header + body;
}
