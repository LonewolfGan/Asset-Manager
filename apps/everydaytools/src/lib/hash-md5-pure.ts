/**
 * Pure JavaScript MD5 implementations for text strings and binary byte arrays.
 * Uses shared low-level mathematical transforms from hash-md5-core (< 300 LOC).
 */

import { runMd5Transform } from './hash-md5-core';

function convertBytesToWordArray(byteArray: Uint8Array): Int32Array {
  let lWordCount: number;
  const lMessageLength = byteArray.length;
  const lNumberOfWordsTemp1 = lMessageLength + 8;
  const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
  const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
  const lWordArray = new Int32Array(lNumberOfWords);
  let lBytePosition = 0;
  let lByteCount = 0;

  while (lByteCount < lMessageLength) {
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = (lWordArray[lWordCount] | (byteArray[lByteCount] << lBytePosition));
    lByteCount++;
  }

  lWordCount = (lByteCount - (lByteCount % 4)) / 4;
  lBytePosition = (lByteCount % 4) * 8;
  lWordArray[lWordCount] = (lWordArray[lWordCount] | (0x80 << lBytePosition));
  lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
  lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

  return lWordArray;
}

/**
 * MD5 implementation for binary byte arrays (Uint8Array)
 */
export function md5Bytes(bytes: Uint8Array): string {
  const x = convertBytesToWordArray(bytes);
  return runMd5Transform(x);
}

/**
 * Standard pure JS MD5 implementation for text strings with full UTF-8 support
 */
export function md5(string: string): string {
  return md5Bytes(new TextEncoder().encode(string));
}
