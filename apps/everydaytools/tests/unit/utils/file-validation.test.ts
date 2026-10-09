import { describe, it, expect } from 'vitest';
import { validateFile, isMimeTypeValid, isFileSizeValid } from '@/lib/file-validation';

const makeFakeFile = (name: string, type: string, size: number): File =>
  new File([new ArrayBuffer(size)], name, { type });

describe('File Validation — MIME type', () => {
  it('accepts valid PDF by MIME type', () => {
    const file = makeFakeFile('test.pdf', 'application/pdf', 1024);
    expect(isMimeTypeValid(file, ['application/pdf'])).toBe(true);
  });

  it('rejects JPG disguised as PDF', () => {
    const file = makeFakeFile('fake.pdf', 'image/jpeg', 1024);
    expect(isMimeTypeValid(file, ['application/pdf'])).toBe(false);
  });

  it('accepts file when MIME matches one of multiple accepted types', () => {
    const file = makeFakeFile('test.png', 'image/png', 1024);
    expect(isMimeTypeValid(file, ['image/jpeg', 'image/png'])).toBe(true);
  });
});

describe('File Validation — size', () => {
  it('rejects file over size limit', () => {
    const file = makeFakeFile('big.pdf', 'application/pdf', 100 * 1024 * 1024);
    expect(isFileSizeValid(file, 50 * 1024 * 1024)).toBe(false);
  });

  it('accepts file under size limit', () => {
    const file = makeFakeFile('ok.pdf', 'application/pdf', 10 * 1024 * 1024);
    expect(isFileSizeValid(file, 50 * 1024 * 1024)).toBe(true);
  });

  it('accepts file at exactly the limit', () => {
    const file = makeFakeFile('exact.pdf', 'application/pdf', 50 * 1024 * 1024);
    expect(isFileSizeValid(file, 50 * 1024 * 1024)).toBe(true);
  });
});

describe('File Validation — full validate', () => {
  it('rejects empty file', () => {
    const file = makeFakeFile('empty.pdf', 'application/pdf', 0);
    expect(validateFile(file, { accept: ['application/pdf'], maxSize: 50 * 1024 * 1024 }).valid).toBe(false);
  });

  it('rejects file over size limit', () => {
    const file = makeFakeFile('big.pdf', 'application/pdf', 100 * 1024 * 1024);
    expect(validateFile(file, { accept: ['application/pdf'], maxSize: 50 * 1024 * 1024 }).valid).toBe(false);
  });

  it('rejects wrong MIME type', () => {
    const file = makeFakeFile('test.jpg', 'image/jpeg', 1024);
    expect(validateFile(file, { accept: ['application/pdf'], maxSize: 50 * 1024 * 1024 }).valid).toBe(false);
  });

  it('accepts valid file', () => {
    const file = makeFakeFile('test.pdf', 'application/pdf', 1024);
    expect(validateFile(file, { accept: ['application/pdf'], maxSize: 50 * 1024 * 1024 }).valid).toBe(true);
  });

  it('returns error message on failure', () => {
    const file = makeFakeFile('empty.pdf', 'application/pdf', 0);
    const result = validateFile(file, { accept: ['application/pdf'], maxSize: 50 * 1024 * 1024 });
    expect(result.error).toBeTruthy();
  });
});
