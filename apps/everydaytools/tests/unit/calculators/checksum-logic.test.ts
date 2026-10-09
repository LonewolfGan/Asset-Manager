import { describe, it, expect } from 'vitest';
import {
  computeSubtleHex,
  computeAllChecksums,
  findMatchingAlgo,
  buildChecksumReportText,
  buildSingleChecksumFile,
  getSourceDropzoneFormat,
} from '@/lib/checksum-logic';

describe('Checksum Logic', () => {
  const sampleText = 'hello world';
  const sampleBuffer = new TextEncoder().encode(sampleText).buffer as ArrayBuffer;

  it('computes subtle hex hash correctly for SHA-256', async () => {
    const hash = await computeSubtleHex(sampleBuffer, 'SHA-256');
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('computes all checksums including MD5, SHA-1, SHA-256, SHA-384, SHA-512', async () => {
    const hashes = await computeAllChecksums(sampleBuffer, true);
    expect(hashes['SHA-256']).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    expect(hashes['MD5']).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    expect(hashes['SHA-1']).toBe('2aae6c35c94fcfb415dbe95f408b9ce91ee846ed');
    expect(hashes['SHA-384']).toBeDefined();
    expect(hashes['SHA-512']).toBeDefined();
  });

  it('finds matching algorithm from user input hash', () => {
    const hashes = {
      'SHA-256': 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
      'SHA-512': '309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f',
      MD5: '5eb63bbbe01eeed093cb22bb8f5acdc3',
      'SHA-1': '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
      'SHA-384': 'fdbd8e75a67f29f701a4e0429a3056bc25fde78f501b97f5909c0acc649209417628630c16617934a99ac36120272196',
    };

    expect(findMatchingAlgo('5EB63BBBE01EEED093CB22BB8F5ACDC3', hashes)).toBe('MD5');
    expect(findMatchingAlgo('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', hashes)).toBe('SHA-256');
    expect(findMatchingAlgo('unknownhash123', hashes)).toBeNull();
    expect(findMatchingAlgo('', hashes)).toBeNull();
  });

  it('builds single checksum file output in standard Unix format', () => {
    const res = buildSingleChecksumFile('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', 'archive.iso');
    expect(res).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9  archive.iso\n');
  });

  it('builds comprehensive checksum report text', () => {
    const hashes = {
      'SHA-256': 'sha256hash',
      'SHA-512': 'sha512hash',
      MD5: 'md5hash',
      'SHA-1': 'sha1hash',
      'SHA-384': 'sha384hash',
    };
    const reportFr = buildChecksumReportText('ubuntu.iso', 1048576, hashes, true);
    expect(reportFr).toContain('ubuntu.iso');
    expect(reportFr).toContain('SHA-256 : sha256hash');
    expect(reportFr).toContain('MD5     : md5hash');

    const reportEn = buildChecksumReportText('ubuntu.iso', 1048576, hashes, false);
    expect(reportEn).toContain('ubuntu.iso');
    expect(reportEn).toContain('Generated locally');
  });

  it('provides appropriate dropzone format description for FR and EN', () => {
    const fmtFr = getSourceDropzoneFormat(true);
    expect(fmtFr.name).toBe('Fichier');
    expect(fmtFr.extension).toBe('*');

    const fmtEn = getSourceDropzoneFormat(false);
    expect(fmtEn.name).toBe('File');
  });
});
