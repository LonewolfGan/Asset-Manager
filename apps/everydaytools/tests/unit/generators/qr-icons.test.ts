import { describe, it, expect } from 'vitest';
import {
  ICON_LIBRARY,
  QUICK_FAVORITE_ICONS,
  getPresetIconSvg,
} from '@/lib/qr-icons';

describe('QR Icons Library & Dynamic SVG Generation', () => {
  it('contains the complete catalog of predefined icons with required fields', () => {
    expect(ICON_LIBRARY.length).toBeGreaterThanOrEqual(60);
    for (const icon of ICON_LIBRARY) {
      expect(icon.id).toBeDefined();
      expect(icon.label).toBeDefined();
      expect(['web', 'social', 'business', 'symbols']).toContain(icon.category);
      expect(typeof icon.path).toBe('string');
      expect(icon.path.length).toBeGreaterThan(0);
    }
  });

  it('contains all QUICK_FAVORITE_ICONS in the library', () => {
    const ids = new Set(ICON_LIBRARY.map((i) => i.id));
    for (const fav of QUICK_FAVORITE_ICONS) {
      expect(ids.has(fav)).toBe(true);
    }
  });

  it('generates a valid SVG Data URL for any preset icon', () => {
    const dataUrl = getPresetIconSvg('globe', '#FF6B35');
    expect(dataUrl).toContain('data:image/svg+xml');
    expect(dataUrl).toContain('<svg');
    expect(dataUrl).toContain('viewBox="0 0 24 24"');
    expect(dataUrl).toContain(encodeURIComponent('#FF6B35'));
  });

  it('returns empty string when an icon is not found', () => {
    const dataUrl = getPresetIconSvg('non-existent-icon-xyz', '#000000');
    expect(dataUrl).toBe('');
  });

  it('correctly extracts SVG paths from Lucide icon components via adapter', async () => {
    const { extractLucideSvgPath, createLucideLibraryIcon } = await import('@/lib/qr-icons/adapter');
    const { Star, Globe } = await import('lucide-react');

    const starPath = extractLucideSvgPath(Star);
    expect(starPath).toContain('<path');
    expect(starPath).toContain('d="');

    const globePath = extractLucideSvgPath(Globe);
    expect(globePath).toContain('<circle');
    expect(globePath).toContain('<path');

    const libraryIcon = createLucideLibraryIcon('star-custom', 'Custom Star', 'symbols', Star);
    expect(libraryIcon.id).toBe('star-custom');
    expect(libraryIcon.label).toBe('Custom Star');
    expect(libraryIcon.category).toBe('symbols');
    expect(libraryIcon.path).toBe(starPath);
  });

  it('correctly adapts simple-icons with renderMode fill and generates fill-based SVG', async () => {
    const { createSimpleIconLibraryIcon } = await import('@/lib/qr-icons/adapter');
    const { siWhatsapp } = await import('simple-icons');

    const whatsappIcon = createSimpleIconLibraryIcon('whatsapp', 'WhatsApp', 'social', siWhatsapp);
    expect(whatsappIcon.id).toBe('whatsapp');
    expect(whatsappIcon.label).toBe('WhatsApp');
    expect(whatsappIcon.category).toBe('social');
    expect(whatsappIcon.renderMode).toBe('fill');
    expect(whatsappIcon.path).toContain('<path');
    expect(whatsappIcon.path).toContain(siWhatsapp.path);

    const whatsappDataUrl = getPresetIconSvg('whatsapp', '#25D366');
    expect(whatsappDataUrl).toContain('data:image/svg+xml');
    expect(whatsappDataUrl).toContain(`fill="${encodeURIComponent('#25D366')}"`);
    expect(whatsappDataUrl).not.toContain('stroke=');
  });

  it('ensures social icons use renderMode fill for vector brands', () => {
    const whatsapp = ICON_LIBRARY.find((i) => i.id === 'whatsapp');
    expect(whatsapp).toBeDefined();
    expect(whatsapp?.renderMode).toBe('fill');

    const xTwitter = ICON_LIBRARY.find((i) => i.id === 'x-twitter');
    expect(xTwitter).toBeDefined();
    expect(xTwitter?.renderMode).toBe('fill');
  });
});

