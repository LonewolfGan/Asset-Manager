import { describe, it, expect } from 'vitest';
import {
  FAVICON_SIZES,
  FAVICON_ASSETS,
  SHAPE_OPTIONS,
  BG_PRESETS,
  generateHtmlSnippet,
  generateWebManifestSnippet,
  generateNextJsSnippet,
  buildClientIco,
} from '../../../src/lib/favicon-logic';

describe('favicon-logic', () => {
  it('defines complete set of favicon sizes including 16, 32, 180, 192 and 512', () => {
    expect(FAVICON_SIZES.length).toBeGreaterThanOrEqual(7);
    expect(FAVICON_SIZES.some((s) => s.size === 16)).toBe(true);
    expect(FAVICON_SIZES.some((s) => s.size === 32)).toBe(true);
    expect(FAVICON_SIZES.some((s) => s.size === 180)).toBe(true);
    expect(FAVICON_SIZES.some((s) => s.size === 512)).toBe(true);
  });

  it('defines the 9 standard export assets in FAVICON_ASSETS', () => {
    expect(FAVICON_ASSETS).toHaveLength(9);
    expect(FAVICON_ASSETS.some((a) => a.filename === 'favicon.ico' && a.isIco)).toBe(true);
    expect(FAVICON_ASSETS.some((a) => a.filename === 'apple-touch-icon.png' && a.size === 180)).toBe(true);
    expect(FAVICON_ASSETS.some((a) => a.filename === 'android-chrome-512x512.png')).toBe(true);
  });

  it('defines 4 icon shapes and 4 background presets', () => {
    expect(SHAPE_OPTIONS.map((s) => s.id)).toEqual(['square', 'rounded', 'squircle', 'circle']);
    expect(BG_PRESETS.map((p) => p.id)).toEqual(['transparent', 'white', 'dark', 'orange']);
  });

  it('generates compliant HTML tags for favicon integration with custom theme color', () => {
    const htmlFr = generateHtmlSnippet('#FF6B35', true);
    expect(htmlFr).toContain('rel="icon"');
    expect(htmlFr).toContain('favicon.ico');
    expect(htmlFr).toContain('apple-touch-icon');
    expect(htmlFr).toContain('content="#FF6B35"');
    expect(htmlFr).toContain('Favicon classique');

    const htmlEn = generateHtmlSnippet('transparent', false);
    expect(htmlEn).toContain('content="#ffffff"');
    expect(htmlEn).toContain('Classic & multi-resolution');
  });

  it('generates valid JSON web manifest with customized theme and localization', () => {
    const jsonStr = generateWebManifestSnippet('#18181B', false);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.name).toBe('My Application');
    expect(parsed.theme_color).toBe('#18181B');
    expect(parsed.icons.length).toBe(2);
    expect(parsed.icons[0].sizes).toBe('192x192');
  });

  it('generates valid Next.js App Router metadata snippet', () => {
    const snippet = generateNextJsSnippet();
    expect(snippet).toContain('export const metadata');
    expect(snippet).toContain('apple-touch-icon.png');
    expect(snippet).toContain('manifest: \'/site.webmanifest\'');
  });

  it('buildClientIco creates a binary ICO blob with valid header and directory entries', async () => {
    const dummy16 = new Uint8Array([1, 2, 3, 4]);
    const dummy32 = new Uint8Array([5, 6, 7, 8, 9]);
    const blob = buildClientIco([
      { size: 16, bytes: dummy16 },
      { size: 32, bytes: dummy32 },
    ]);

    expect(blob.type).toBe('image/x-icon');
    const buffer = await blob.arrayBuffer();
    const view = new DataView(buffer);

    // Header checks
    expect(view.getUint16(0, true)).toBe(0); // Reserved
    expect(view.getUint16(2, true)).toBe(1); // ICO type
    expect(view.getUint16(4, true)).toBe(2); // 2 images

    // Directory entry 1: size 16x16, 4 bytes
    expect(view.getUint8(6)).toBe(16);
    expect(view.getUint8(7)).toBe(16);
    expect(view.getUint32(14, true)).toBe(4); // length

    // Directory entry 2: size 32x32, 5 bytes
    expect(view.getUint8(22)).toBe(32);
    expect(view.getUint8(23)).toBe(32);
    expect(view.getUint32(30, true)).toBe(5); // length
  });
});

