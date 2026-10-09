export interface DialTick {
  val: number;
  label: string;
}

export const DIAL_TICKS: DialTick[] = [
  { val: 0, label: '0' },
  { val: 10, label: '10' },
  { val: 50, label: '50' },
  { val: 100, label: '100' },
  { val: 250, label: '250' },
  { val: 500, label: '500' },
  { val: 1000, label: '1G' },
];

export const DIAL_CX = 140;
export const DIAL_CY = 120;
export const DIAL_R = 92;
export const DIAL_ARC_LENGTH = 2 * Math.PI * DIAL_R * (240 / 360); // ~385.37

/**
 * Convert Mbps to a normalized 0..1 scale using non-linear curve for expressive dial movement
 */
export function speedToNormalized(mbps: number): number {
  if (mbps <= 0) return 0;
  if (mbps >= 1000) return 1;
  return Math.min(1, Math.pow(mbps / 1000, 0.45));
}

/**
 * Human-readable latency status derived purely from ping
 */
export function getLatencyVerdict(pingVal: number, isFr: boolean = true): string {
  if (pingVal <= 20) return isFr ? 'Excellente (< 20 ms)' : 'Ultra-low (< 20 ms)';
  if (pingVal <= 45) return isFr ? 'Très Réactive (< 45 ms)' : 'Low Latency (< 45 ms)';
  if (pingVal <= 80) return isFr ? 'Normale (< 80 ms)' : 'Moderate (< 80 ms)';
  return isFr ? 'Élevée (> 80 ms)' : 'High Latency (> 80 ms)';
}

export interface SpeedReportOptions {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  streamingMaxResolution: string;
  gamingRating: string;
  isFr: boolean;
}

export function formatSpeedReportSummary({
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  streamingMaxResolution,
  gamingRating,
  isFr,
}: SpeedReportOptions): string {
  return [
    `everydaytools.qzz.io - ${isFr ? 'Test de Débit Internet' : 'Internet Speed Test'}`,
    `• ${isFr ? 'Téléchargement' : 'Download'} : ${downloadSpeed.toFixed(1)} Mbps`,
    `• ${isFr ? 'Envoi' : 'Upload'} : ${uploadSpeed.toFixed(1)} Mbps`,
    `• ${isFr ? 'Latence (Ping)' : 'Latency (Ping)'} : ${ping} ms (${getLatencyVerdict(ping, isFr)})`,
    `• ${isFr ? 'Gigue (Jitter)' : 'Jitter'} : ${jitter} ms`,
    `• Streaming : ${streamingMaxResolution}`,
    `• ${isFr ? 'Jeux & Esports' : 'Gaming & Esports'} : ${gamingRating}`,
  ].join('\n');
}
