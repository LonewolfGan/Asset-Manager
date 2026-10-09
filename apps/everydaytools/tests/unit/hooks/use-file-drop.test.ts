import { describe, it, expect } from 'vitest';
import { isFileAccepted } from '@/hooks/use-file-drop';

describe('isFileAccepted file drop filter', () => {
  it('accepts any file when no filter is provided or wildcard is set', () => {
    const png = new File(['content'], 'test.png', { type: 'image/png' });
    expect(isFileAccepted(png)).toBe(true);
    expect(isFileAccepted(png, '*')).toBe(true);
    expect(isFileAccepted(png, '*/*')).toBe(true);
  });

  it('filters correctly by file extension', () => {
    const png = new File(['content'], 'image.png', { type: 'image/png' });
    const pdf = new File(['content'], 'doc.pdf', { type: 'application/pdf' });

    expect(isFileAccepted(png, '.png')).toBe(true);
    expect(isFileAccepted(pdf, '.png')).toBe(false);
    expect(isFileAccepted(pdf, '.pdf')).toBe(true);
    expect(isFileAccepted(png, ['.png', '.jpg'])).toBe(true);
    expect(isFileAccepted(pdf, ['.png', '.jpg'])).toBe(false);
  });

  it('filters correctly by MIME category', () => {
    const png = new File(['content'], 'image.png', { type: 'image/png' });
    const pdf = new File(['content'], 'doc.pdf', { type: 'application/pdf' });

    expect(isFileAccepted(png, 'image/*')).toBe(true);
    expect(isFileAccepted(pdf, 'image/*')).toBe(false);
    expect(isFileAccepted(pdf, 'application/*')).toBe(true);
  });

  it('supports comma-separated string accept rules', () => {
    const jpg = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    const txt = new File(['content'], 'note.txt', { type: 'text/plain' });

    expect(isFileAccepted(jpg, '.png, .jpg, .jpeg')).toBe(true);
    expect(isFileAccepted(txt, '.png, .jpg, .jpeg')).toBe(false);
  });
});
