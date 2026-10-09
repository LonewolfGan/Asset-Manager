import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  luminance,
  getContrastRatio,
  getContrastAssessment,
  buildQrPayload,
  isPayloadEmpty,
  isCornerEye,
  generateQrSvgString,
} from '@/lib/qr-code-logic';

describe('QR Code Logic Unit Tests', () => {
  describe('Color & Contrast Calculations', () => {
    it('converts 6-character and 3-character hex to RGB correctly', () => {
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#FF6B35')).toEqual([255, 107, 53]);
      expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
      expect(hexToRgb('000')).toEqual([0, 0, 0]);
    });

    it('calculates relative luminance correctly', () => {
      expect(luminance(0, 0, 0)).toBe(0);
      expect(luminance(255, 255, 255)).toBeCloseTo(1, 4);
    });

    it('calculates WCAG contrast ratio reliably', () => {
      const blackWhite = getContrastRatio('#000000', '#ffffff');
      expect(blackWhite).toBeCloseTo(21, 0);

      const sameColor = getContrastRatio('#FF6B35', '#FF6B35');
      expect(sameColor).toBeCloseTo(1, 0);

      const fallback = getContrastRatio('invalid', '#ffffff');
      expect(fallback).toBe(21);
    });

    it('returns appropriate contrast assessment labels in French and English', () => {
      const optimalFr = getContrastAssessment(12, true);
      expect(optimalFr.label).toBe('Contraste optimal');
      expect(optimalFr.color).toContain('emerald');

      const optimalEn = getContrastAssessment(12, false);
      expect(optimalEn.label).toBe('Optimal contrast');

      const acceptableFr = getContrastAssessment(5.2, true);
      expect(acceptableFr.label).toBe('Contraste acceptable');
      expect(acceptableFr.color).toContain('amber');

      const lowFr = getContrastAssessment(2.1, true);
      expect(lowFr.label).toBe('Contraste insuffisant');
      expect(lowFr.color).toContain('red');
    });
  });

  describe('Payload Builders & Validation', () => {
    const defaultParams = {
      url: 'https://everydaytools.qzz.io',
      rawText: 'Hello World',
      wifiSsid: 'HomeWifi',
      wifiPass: 'Secret123',
      wifiEnc: 'WPA' as const,
      vcardName: 'Alexandre Martin',
      vcardOrg: 'Everyday Studio',
      vcardEmail: 'alex@example.com',
      vcardPhone: '+33612345678',
      vcardUrl: 'https://example.com',
    };

    it('formats URL payload', () => {
      expect(buildQrPayload('url', defaultParams)).toBe('https://everydaytools.qzz.io');
    });

    it('formats Text payload', () => {
      expect(buildQrPayload('text', defaultParams)).toBe('Hello World');
    });

    it('formats Wi-Fi payload with WPA, WEP and nopass encryption', () => {
      expect(buildQrPayload('wifi', defaultParams)).toBe('WIFI:T:WPA;S:HomeWifi;P:Secret123;;');

      const wep = buildQrPayload('wifi', { ...defaultParams, wifiEnc: 'WEP' });
      expect(wep).toBe('WIFI:T:WEP;S:HomeWifi;P:Secret123;;');

      const nopass = buildQrPayload('wifi', { ...defaultParams, wifiEnc: 'nopass' });
      expect(nopass).toBe('WIFI:T:nopass;S:HomeWifi;P:Secret123;;');

      const emptySsid = buildQrPayload('wifi', { ...defaultParams, wifiSsid: '   ' });
      expect(emptySsid).toBe('');
    });

    it('formats vCard 3.0 contact cards properly', () => {
      const vcard = buildQrPayload('vcard', defaultParams);
      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('VERSION:3.0');
      expect(vcard).toContain('FN:Alexandre Martin');
      expect(vcard).toContain('ORG:Everyday Studio');
      expect(vcard).toContain('EMAIL:alex@example.com');
      expect(vcard).toContain('TEL:+33612345678');
      expect(vcard).toContain('URL:https://example.com');
      expect(vcard).toContain('END:VCARD');
    });

    it('detects empty payloads accurately', () => {
      expect(isPayloadEmpty('', 'url')).toBe(true);
      expect(isPayloadEmpty('   ', 'text')).toBe(true);
      expect(isPayloadEmpty('https://', 'url')).toBe(true);
      expect(isPayloadEmpty('http://', 'url')).toBe(true);
      expect(isPayloadEmpty('https://example.com', 'url')).toBe(false);
      expect(isPayloadEmpty('Lorem ipsum', 'text')).toBe(false);
    });
  });

  describe('Corner Eyes Detection', () => {
    it('accurately identifies corner eye positions for a given QR module size', () => {
      const moduleCount = 29; // standard size
      // Top-Left (0..6, 0..6)
      expect(isCornerEye(0, 0, moduleCount)).toBe(true);
      expect(isCornerEye(6, 6, moduleCount)).toBe(true);
      expect(isCornerEye(7, 7, moduleCount)).toBe(false);

      // Top-Right (0..6, 22..28)
      expect(isCornerEye(0, 22, moduleCount)).toBe(true);
      expect(isCornerEye(6, 28, moduleCount)).toBe(true);

      // Bottom-Left (22..28, 0..6)
      expect(isCornerEye(22, 0, moduleCount)).toBe(true);
      expect(isCornerEye(28, 6, moduleCount)).toBe(true);

      // Center
      expect(isCornerEye(14, 14, moduleCount)).toBe(false);
    });
  });

  describe('Pure Vector SVG Generation', () => {
    const baseOptions = {
      content: 'https://everydaytools.qzz.io',
      errLevel: 'H' as const,
      size: 512,
      margin: 2,
      fgColor: '#09090b',
      bgColor: '#ffffff',
      dotStyle: 'rounded' as const,
      eyeStyle: 'rounded' as const,
      logoUrl: null,
      logoScale: 22,
    };

    it('generates valid SVG string with rounded dots and eyes', () => {
      const svg = generateQrSvgString(baseOptions);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('viewBox="0 0 512 512"');
      expect(svg).toContain('fill="#ffffff"');
      expect(svg).toContain('fill="#09090b"');
    });

    it('generates SVG with circular eyes and dots style', () => {
      const svg = generateQrSvgString({
        ...baseOptions,
        dotStyle: 'dots',
        eyeStyle: 'circle',
      });
      expect(svg).toContain('<circle');
      expect(svg).toContain('stroke="#09090b"');
    });

    it('includes embedded center logo in SVG when logoUrl is provided', () => {
      const logoDataUrl = 'data:image/svg+xml;utf8,<svg></svg>';
      const svg = generateQrSvgString({
        ...baseOptions,
        logoUrl: logoDataUrl,
        logoScale: 20,
      });
      expect(svg).toContain('<image');
      expect(svg).toContain('href="data:image/svg+xml;utf8,<svg></svg>"');
    });
  });
});
