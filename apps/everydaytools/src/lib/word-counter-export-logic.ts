import type { DetailedTextStats } from '@/lib/word-counter-logic';

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} s`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} s`;
}

export function formatFileSize(bytes: number, isFr: boolean): string {
  if (bytes < 1024) return `${bytes} ${isFr ? 'o' : 'B'}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${isFr ? 'Ko' : 'KB'}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${isFr ? 'Mo' : 'MB'}`;
}

export function buildStatisticalReport(
  stats: DetailedTextStats,
  isFr: boolean
): string {
  return [
    isFr
      ? `# Rapport d'analyse textuelle — EverydayTools`
      : `# Text analysis report — EverydayTools`,
    `${isFr ? 'Date' : 'Date'} : ${new Date().toISOString()}`,
    '',
    `${isFr ? 'Mots' : 'Words'} : ${stats.words}`,
    `${isFr ? 'Caractères (avec espaces)' : 'Characters (with spaces)'} : ${stats.characters}`,
    `${isFr ? 'Caractères (sans espaces)' : 'Characters (no spaces)'} : ${stats.charactersNoSpaces}`,
    `${isFr ? 'Phrases' : 'Sentences'} : ${stats.sentences}`,
    `${isFr ? 'Paragraphes' : 'Paragraphs'} : ${stats.paragraphs}`,
    `${isFr ? 'Lignes' : 'Lines'} : ${stats.lines}`,
    `${isFr ? 'Longueur moyenne des mots' : 'Average word length'} : ${stats.avgWordLength} ${isFr ? 'car.' : 'chars'}`,
    `${isFr ? 'Temps de lecture estimé (~220 mpm)' : 'Estimated reading time (~220 wpm)'} : ${formatDuration(stats.readingTimeSec)}`,
    `${isFr ? 'Temps de parole estimé (~130 mpm)' : 'Estimated speaking time (~130 wpm)'} : ${formatDuration(stats.speakingTimeSec)}`,
    '',
    isFr ? `Mots-clés fréquents :` : `Top keywords:`,
    ...stats.topKeywords.map(
      (k) =>
        `- ${k.word} : ${k.count} ${isFr ? 'occurrences' : 'occurrences'} (${k.percentage}%)`
    ),
  ].join('\n');
}

export function buildJsonStatisticsPayload(stats: DetailedTextStats): string {
  return JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      stats,
    },
    null,
    2
  );
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
