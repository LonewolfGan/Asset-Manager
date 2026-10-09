import {
  computeAllHashes,
  computeBufferHashes,
  computeHmac,
  type SupportedHashAlgo,
} from '@/lib/hash-logic';

export const EMPTY_HASHES: Record<SupportedHashAlgo, string> = {
  'SHA-256': '',
  'SHA-512': '',
  'SHA-384': '',
  'SHA-1': '',
  MD5: '',
};

export interface CalculateHashesOptions {
  inputMode: 'text' | 'file';
  inputText: string;
  fileBuffer: ArrayBuffer | null;
  enableHmac: boolean;
  hmacSecret: string;
  isFr: boolean;
}

export async function calculateCurrentHashes({
  inputMode,
  inputText,
  fileBuffer,
  enableHmac,
  hmacSecret,
  isFr,
}: CalculateHashesOptions): Promise<{
  hashes: Record<SupportedHashAlgo, string>;
  actionType: 'hmac-calculated' | 'text-calculated' | 'file-calculated' | null;
}> {
  if (inputMode === 'text') {
    if (!inputText) {
      return { hashes: EMPTY_HASHES, actionType: null };
    }

    if (enableHmac && hmacSecret) {
      const [h256, h512, h384, h1] = await Promise.all([
        computeHmac(inputText, hmacSecret, 'SHA-256'),
        computeHmac(inputText, hmacSecret, 'SHA-512'),
        computeHmac(inputText, hmacSecret, 'SHA-384'),
        computeHmac(inputText, hmacSecret, 'SHA-1'),
      ]);
      return {
        hashes: {
          'SHA-256': h256,
          'SHA-512': h512,
          'SHA-384': h384,
          'SHA-1': h1,
          MD5: isFr
            ? 'HMAC non pris en charge pour MD5'
            : 'HMAC not supported for MD5',
        },
        actionType: 'hmac-calculated',
      };
    }

    const computed = await computeAllHashes(inputText);
    return { hashes: computed, actionType: 'text-calculated' };
  }

  // Mode Fichier
  if (!fileBuffer) {
    return { hashes: EMPTY_HASHES, actionType: null };
  }

  const computed = await computeBufferHashes(fileBuffer);
  return { hashes: computed, actionType: 'file-calculated' };
}
