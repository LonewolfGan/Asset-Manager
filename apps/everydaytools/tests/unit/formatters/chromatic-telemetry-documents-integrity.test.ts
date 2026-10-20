import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as downloadModule from '@/lib/download';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  parseAnyColor,
  getContrastRatio,
  generateHarmonies,
} from '@/lib/color-converter-logic';
import {
  generateHarmonyPalette,
  getWcagContrastRatio,
  exportCssVariables,
  exportTailwindColors,
  exportJson,
  type PaletteColor,
} from '@/lib/color-palette-logic';
import {
  assessNetworkQuality,
} from '@/lib/speed-test-logic';
import {
  speedToNormalized,
  getLatencyVerdict,
} from '@/lib/speed-test-dial-logic';
import {
  validateHtmlFile,
  buildWordFilename,
  triggerDownload as htmlTriggerDownload,
} from '@/lib/html-to-word-logic';
import {
  validateEpubFile,
  triggerDownload as epubTriggerDownload,
} from '@/lib/epub-converter-logic';
import { useColorPaletteWorkflow } from '@/hooks/use-color-palette-workflow';
import { useSpeedTestWorkflow } from '@/hooks/use-speed-test-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/download', () => ({
  downloadText: vi.fn(),
  downloadBlob: vi.fn(),
  downloadDataUrl: vi.fn(),
  triggerDownload: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

vi.mock('@/lib/speed-test-network-runner', () => ({
  measurePingAndJitter: vi.fn().mockResolvedValue({ ping: 12, jitter: 2 }),
  measureDownloadSpeed: vi.fn().mockResolvedValue(150),
  measureUploadSpeed: vi.fn().mockResolvedValue(60),
}));

function renderHookNative<T>(hookFn: () => T) {
  let result!: T;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    function TestComp() {
      result = hookFn();
      return null;
    }
    root.render(React.createElement(TestComp));
  });
  return {
    get result() {
      return result;
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('Chromatic Algorithms (color-converter & color-palette)', () => {
  it('converts correctly between HEX, RGB, HSL, HSV, CMYK and parses strings', () => {
    const hex = '#1A6BFF';
    const rgb = parseHex(hex)!;
    expect(rgb).toEqual({ r: 26, g: 107, b: 255 });
    expect(rgbToHex(rgb)).toBe(hex);

    const hsl = rgbToHsl(rgb);
    const convertedBack = hslToRgb(hsl);
    expect(Math.abs(convertedBack.r - rgb.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(convertedBack.g - rgb.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(convertedBack.b - rgb.b)).toBeLessThanOrEqual(1);

    const hsv = rgbToHsv(rgb);
    const convertedBackHsv = hsvToRgb(hsv);
    expect(Math.abs(convertedBackHsv.r - rgb.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(convertedBackHsv.g - rgb.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(convertedBackHsv.b - rgb.b)).toBeLessThanOrEqual(1);

    const cmyk = rgbToCmyk(rgb);
    const roundTrippedRgb = cmykToRgb(cmyk);
    expect(Math.abs(roundTrippedRgb.r - rgb.r)).toBeLessThanOrEqual(3);

    expect(parseAnyColor('rgb(26, 107, 255)')).toEqual(rgb);
    expect(parseAnyColor('red')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHex('invalid')).toBeNull();
  });

  it('generates harmonies and computes WCAG contrast ratios accurately', () => {
    const harmonies = generateHarmonies({ h: 210, s: 100, l: 50 });
    expect(harmonies.complementary).toMatch(/^#[0-9A-F]{6}$/);
    expect(harmonies.analogous).toHaveLength(2);
    expect(harmonies.triadic).toHaveLength(2);

    const palette = generateHarmonyPalette('complementary', [], 5);
    expect(palette).toHaveLength(5);

    const contrastBlackWhite = getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(Math.round(contrastBlackWhite)).toBe(21);
    expect(getWcagContrastRatio('#000000', '#FFFFFF')).toBe(21);
    expect(getWcagContrastRatio('#1A6BFF', '#1A6BFF')).toBe(1);
  });
});

describe('Export Payloads (color-palette)', () => {
  const mockPalette: PaletteColor[] = [
    { id: '1', hex: '#1A6BFF', hsl: { h: 219, s: 100, l: 55 }, rgb: { r: 26, g: 107, b: 255 }, isLocked: false },
    { id: '2', hex: '#DC2626', hsl: { h: 0, s: 72, l: 51 }, rgb: { r: 220, g: 38, b: 38 }, isLocked: false },
  ];

  it('generates valid CSS variables, Tailwind config, and JSON payload', () => {
    const css = exportCssVariables(mockPalette);
    expect(css).toContain(':root {');
    expect(css).toContain('--color-1: #1A6BFF;');

    const tw = exportTailwindColors(mockPalette);
    expect(tw).toContain("primary': '#1A6BFF'");

    const json = exportJson(mockPalette);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].hex).toBe('#1A6BFF');
  });
});

describe('Speed Test Telemetry & Logic', () => {
  it('computes accurate network quality grades and metrics', () => {
    const fast = assessNetworkQuality({ downloadMbps: 120, uploadMbps: 60, pingMs: 15, jitterMs: 3 });
    expect(fast.grade).toBe('A+');
    expect(fast.latencyRating).toBe('Ultra-low');
    expect(fast.suitability.gaming.supported).toBe(true);

    const slow = assessNetworkQuality({ downloadMbps: 4, uploadMbps: 0.8, pingMs: 110, jitterMs: 25 });
    expect(slow.grade).toBe('D');
    expect(slow.streamingMaxResolution).toBe('SD 480p');

    expect(speedToNormalized(0)).toBe(0);
    expect(speedToNormalized(1000)).toBe(1);
    expect(getLatencyVerdict(15, true)).toContain('Excellente');
  });

  it('speed-test workflow executes without artificial 200ms pause between download and upload', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const { result, unmount } = renderHookNative(() => useSpeedTestWorkflow(true));

    await act(async () => {
      await result.runTest();
    });

    const pause200Calls = setTimeoutSpy.mock.calls.filter(([, ms]) => ms === 200);
    expect(pause200Calls).toHaveLength(0);
    setTimeoutSpy.mockRestore();
    unmount();
  });
});

describe('HTML & EPUB Validation Logic', () => {
  it('validates html files and builds docx filename', () => {
    const validFile = new File(['<h1>Hello</h1>'], 'test.html', { type: 'text/html' });
    expect(validateHtmlFile(validFile, true).isValid).toBe(true);

    const invalidFile = new File(['text'], 'test.pdf', { type: 'application/pdf' });
    expect(validateHtmlFile(invalidFile, true).isValid).toBe(false);

    expect(buildWordFilename('guide.html')).toBe('guide.docx');
    expect(buildWordFilename('notes.htm')).toBe('notes.docx');
  });

  it('validates epub files properly', () => {
    const validFile = new File(['epub data'], 'book.epub', { type: 'application/epub+zip' });
    expect(validateEpubFile(validFile, true).isValid).toBe(true);

    const invalidFile = new File(['doc'], 'book.docx', { type: 'application/docx' });
    expect(validateEpubFile(invalidFile, true).isValid).toBe(false);
  });
});

describe('SSOT Download Unification & Delay Eradication', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    createElementSpy = vi.spyOn(document, 'createElement');
    setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    setTimeoutSpy.mockRestore();
  });

  it('useColorPaletteWorkflow.handleDownload delegates to downloadText without anchor creation or delay >= 600ms', () => {
    const { result, unmount } = renderHookNative(() => useColorPaletteWorkflow(true));
    act(() => {
      result.handleDownload(':root {}', 'palette.css', 'text/css');
    });

    expect(downloadModule.downloadText).toHaveBeenCalledWith(':root {}', 'palette.css', 'text/css');
    expect(createElementSpy).not.toHaveBeenCalledWith('a');
    const longDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 600);
    expect(longDelays).toHaveLength(0);
    unmount();
  });

  it('html-to-word triggerDownload delegates to downloadBlob without anchor creation or delay >= 600ms', () => {
    const blob = new Blob(['<html></html>'], { type: 'text/html' });
    htmlTriggerDownload(blob, 'export.docx');

    expect(downloadModule.downloadBlob).toHaveBeenCalledWith(blob, 'export.docx');
    expect(createElementSpy).not.toHaveBeenCalledWith('a');
    const longDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 600);
    expect(longDelays).toHaveLength(0);
  });

  it('epub-converter-logic triggerDownload delegates to downloadBlob without anchor creation or delay >= 600ms', () => {
    const blob = new Blob(['mock epub'], { type: 'application/epub+zip' });
    epubTriggerDownload(blob, 'export.docx');

    expect(downloadModule.downloadBlob).toHaveBeenCalledWith(blob, 'export.docx');
    expect(createElementSpy).not.toHaveBeenCalledWith('a');
    const longDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 600);
    expect(longDelays).toHaveLength(0);
  });
});
