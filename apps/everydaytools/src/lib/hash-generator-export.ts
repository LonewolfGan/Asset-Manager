import type { SupportedHashAlgo } from '@/lib/hash-logic';

export interface AlgoSpec {
  id: SupportedHashAlgo;
  label: string;
  bits: number;
  hexLength: number;
}

export const ALGORITHMS: AlgoSpec[] = [
  { id: 'SHA-256', label: 'SHA-256', bits: 256, hexLength: 64 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512, hexLength: 128 },
  { id: 'SHA-384', label: 'SHA-384', bits: 384, hexLength: 96 },
  { id: 'SHA-1', label: 'SHA-1', bits: 160, hexLength: 40 },
  { id: 'MD5', label: 'MD5', bits: 128, hexLength: 32 },
];

export function formatBytes(bytes: number, isFr: boolean = true): string {
  if (bytes === 0) return isFr ? '0 o' : '0 B';
  const k = 1024;
  const sizes = isFr ? ['o', 'Ko', 'Mo', 'Go'] : ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export interface GenerateManifestOptions {
  sourceLabel: string;
  isFr: boolean;
  enableHmac: boolean;
  hmacSecret: string;
  isUppercase: boolean;
  hashes: Record<SupportedHashAlgo, string>;
}

export function generateManifestContent({
  sourceLabel,
  isFr,
  enableHmac,
  hmacSecret,
  isUppercase,
  hashes,
}: GenerateManifestOptions): string {
  const timestamp = new Date().toISOString();
  const lines = [
    isFr
      ? `# Manifeste Cryptographique — EverydayTools`
      : `# Cryptographic Manifest — EverydayTools`,
    isFr ? `# Source : ${sourceLabel}` : `# Source: ${sourceLabel}`,
    isFr ? `# Date : ${timestamp}` : `# Date: ${timestamp}`,
    isFr
      ? `# HMAC : ${enableHmac && hmacSecret ? 'Oui' : 'Non'}`
      : `# HMAC: ${enableHmac && hmacSecret ? 'Yes' : 'No'}`,
    '',
  ];

  ALGORITHMS.forEach(({ id, label }) => {
    const val = hashes[id];
    if (val && !val.startsWith('HMAC non') && !val.startsWith('HMAC not')) {
      const formatted = isUppercase ? val.toUpperCase() : val.toLowerCase();
      lines.push(`${label.padEnd(10)} ${formatted}`);
    }
  });

  return lines.join('\n');
}

export interface BuildJsonExportOptions {
  source: string;
  isHmac: boolean;
  isUppercase: boolean;
  hashes: Record<SupportedHashAlgo, string>;
}

export function buildJsonExportPayload({
  source,
  isHmac,
  isUppercase,
  hashes,
}: BuildJsonExportOptions): Record<string, any> {
  return {
    source,
    timestamp: new Date().toISOString(),
    isHmac,
    hashes: Object.fromEntries(
      Object.entries(hashes).map(([k, v]) => [
        k,
        isUppercase ? v.toUpperCase() : v.toLowerCase(),
      ])
    ),
  };
}
