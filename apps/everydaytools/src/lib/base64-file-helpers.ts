import { applyLineBreaks, base64ToBlob, type ChunkSize, type DetectedBase64Binary } from './base64-logic';

export interface FileEncodeOptions {
  dataUriPrefix: boolean;
  urlSafe: boolean;
  stripPadding: boolean;
  chunkSize: ChunkSize;
}

export interface ResolveDownloadParams {
  mode: 'encode' | 'decode';
  input: string;
  output: string;
  detectedBinary: DetectedBase64Binary | null;
}

export interface DownloadInfo {
  blob: Blob;
  filename: string;
  isBinary: boolean;
}

/**
 * Transforms raw dataUrl from file reading into formatted Base64 string according to user options
 */
export function prepareEncodedFileResult(
  dataUrl: string,
  options: FileEncodeOptions
): string {
  let b64 = dataUrl;

  if (!options.dataUriPrefix) {
    const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
    if (match) {
      b64 = match[1];
    }
  }

  if (options.urlSafe) {
    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_');
  }
  if (options.stripPadding) {
    b64 = b64.replace(/=+$/, '');
  }
  if (options.chunkSize > 0) {
    b64 = applyLineBreaks(b64, options.chunkSize);
  }

  return b64;
}

/**
 * Resolves the download Blob, filename and binary flag for output file saving
 */
export function resolveDownloadInfo({
  mode,
  input,
  output,
  detectedBinary,
}: ResolveDownloadParams): DownloadInfo {
  const isBinary = Boolean(mode === 'decode' && detectedBinary?.dataUrl);
  const blob = isBinary
    ? base64ToBlob(input, detectedBinary!.mimeType)
    : new Blob([output], { type: 'text/plain;charset=utf-8' });
  const filename = isBinary
    ? `decoded-file.${detectedBinary!.extension}`
    : (mode === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt');

  return { blob, filename, isBinary };
}
