import { describe, it, expect, beforeAll } from 'vitest';
import JSZip from 'jszip';
import {
  type IconShape,
  buildClientFaviconZip,
} from '@/lib/favicon-logic';

describe('Favicon Client Bundle [buildClientFaviconZip]', () => {
  beforeAll(() => {
    // Stub HTMLCanvasElement.prototype.toBlob in JSDOM environment
    HTMLCanvasElement.prototype.toBlob = function (callback, type) {
      // Minimal valid 8-byte PNG signature header
      const mockPngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const blob = new Blob([mockPngHeader], { type: type || 'image/png' });
      callback(blob);
    };
  });

  function createMockImage(width = 512, height = 512): HTMLImageElement {
    const img = document.createElement('img');
    Object.defineProperty(img, 'naturalWidth', { value: width, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: height, configurable: true });
    Object.defineProperty(img, 'width', { value: width, configurable: true });
    Object.defineProperty(img, 'height', { value: height, configurable: true });
    return img;
  }

  it('génère un Blob ZIP valide contenant les 7 fichiers obligatoires', async () => {
    const sourceImg = createMockImage(512, 512);
    const zipBlob = await buildClientFaviconZip(sourceImg, 10, '#ffffff', 'squircle', false);

    expect(zipBlob).toBeInstanceOf(Blob);
    expect(zipBlob.size).toBeGreaterThan(0);

    const zipBuffer = await zipBlob.arrayBuffer();
    const zip = await JSZip.loadAsync(zipBuffer);

    // 1. favicon.ico multi-résolution (16, 32, 48)
    expect(zip.file('favicon.ico')).not.toBeNull();

    // 2. Favicons PNG standard
    expect(zip.file('favicon-16x16.png')).not.toBeNull();
    expect(zip.file('favicon-32x32.png')).not.toBeNull();

    // 3. Apple Touch Icon (180x180)
    expect(zip.file('apple-touch-icon.png')).not.toBeNull();

    // 4. Android PWA Icons (192x192 & 512x512)
    expect(zip.file('android-chrome-192x192.png')).not.toBeNull();
    expect(zip.file('android-chrome-512x512.png')).not.toBeNull();

    // 5. Manifeste PWA
    expect(zip.file('site.webmanifest')).not.toBeNull();
  });

  it('génère un favicon.ico avec une signature d en-tête binaire valide (ICONDIR 3 frames)', async () => {
    const sourceImg = createMockImage(256, 256);
    const zipBlob = await buildClientFaviconZip(sourceImg, 5, 'transparent', 'circle', false);

    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer());
    const icoFile = zip.file('favicon.ico');
    expect(icoFile).not.toBeNull();

    const icoBytes = await icoFile!.async('uint8array');
    expect(icoBytes.length).toBeGreaterThan(6);

    // Reserved (0x00, 0x00)
    expect(icoBytes[0]).toBe(0);
    expect(icoBytes[1]).toBe(0);

    // Type: 1 pour ICO (0x01, 0x00)
    expect(icoBytes[2]).toBe(1);
    expect(icoBytes[3]).toBe(0);

    // Nombre d images: 3 (16, 32, 48)
    expect(icoBytes[4]).toBe(3);
    expect(icoBytes[5]).toBe(0);
  });

  it('génère un site.webmanifest conforme avec les métadonnées et icônes PWA', async () => {
    const sourceImg = createMockImage(512, 512);
    const zipBlob = await buildClientFaviconZip(sourceImg, 12, '#FF6B35', 'rounded', true);

    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer());
    const manifestFile = zip.file('site.webmanifest');
    expect(manifestFile).not.toBeNull();

    const manifestContent = await manifestFile!.async('string');
    const parsed = JSON.parse(manifestContent);

    expect(parsed.name).toBe('Mon Application');
    expect(parsed.short_name).toBe('App');
    expect(parsed.theme_color).toBe('#FF6B35');
    expect(parsed.background_color).toBe('#FF6B35');
    expect(parsed.display).toBe('standalone');

    expect(Array.isArray(parsed.icons)).toBe(true);
    expect(parsed.icons).toHaveLength(2);
    expect(parsed.icons).toEqual(
      expect.arrayContaining([
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ])
    );
  });

  it('génère un nom en anglais dans le manifeste lorsque isFr est faux', async () => {
    const sourceImg = createMockImage(512, 512);
    const zipBlob = await buildClientFaviconZip(sourceImg, 0, 'transparent', 'square', false);

    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer());
    const manifestContent = await zip.file('site.webmanifest')!.async('string');
    const parsed = JSON.parse(manifestContent);

    expect(parsed.name).toBe('My Application');
    expect(parsed.short_name).toBe('App');
    expect(parsed.theme_color).toBe('#ffffff');
  });

  it('supporte toutes les variantes de IconShape sans erreur', async () => {
    const sourceImg = createMockImage(256, 256);
    const shapes: IconShape[] = ['square', 'rounded', 'squircle', 'circle'];

    for (const shape of shapes) {
      const zipBlob = await buildClientFaviconZip(sourceImg, 10, '#18181B', shape, false);
      expect(zipBlob).toBeInstanceOf(Blob);
      expect(zipBlob.size).toBeGreaterThan(0);
    }
  });
});
