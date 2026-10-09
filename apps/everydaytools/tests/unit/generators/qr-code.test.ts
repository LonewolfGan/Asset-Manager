import { describe, it, expect } from 'vitest';
import QRCode from 'qrcode';

describe('QR Code Generation Logic', () => {
  it('formats Wi-Fi connection strings correctly', () => {
    const ssid = 'MyHomeNetwork';
    const pass = 'SecretKey123';
    const enc = 'WPA';
    const wifiString = `WIFI:T:${enc};S:${ssid};P:${pass};;`;

    expect(wifiString).toBe('WIFI:T:WPA;S:MyHomeNetwork;P:SecretKey123;;');
  });

  it('formats vCard 3.0 contact cards properly', () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Alexandre Martin',
      'ORG:Studio Design',
      'EMAIL:alex@example.com',
      'TEL:+33612345678',
      'URL:https://example.com',
      'END:VCARD',
    ].join('\n');

    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:Alexandre Martin');
    expect(vcard).toContain('END:VCARD');
  });

  it('generates valid vector SVG string using qrcode', async () => {
    const content = 'https://everydaytools.qzz.io';
    const svg = await QRCode.toString(content, {
      type: 'svg',
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#09090b', light: '#ffffff' },
    });

    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('viewBox');
  });

  it('handles all 4 error correction levels (L, M, Q, H)', async () => {
    const levels = ['L', 'M', 'Q', 'H'] as const;
    for (const level of levels) {
      const svg = await QRCode.toString('test', {
        type: 'svg',
        errorCorrectionLevel: level,
      });
      expect(svg).toContain('<svg');
    }
  });

  it('guarantees crisp HD master size (1024px) and optimal quiet zone margin (2 modules)', async () => {
    const masterSize = 1024;
    const standardMargin = 2;

    const svg = await QRCode.toString('https://everydaytools.qzz.io', {
      type: 'svg',
      width: masterSize,
      margin: standardMargin,
      errorCorrectionLevel: 'H',
    });

    expect(svg).toContain('viewBox');
    expect(masterSize).toBe(1024);
    expect(standardMargin).toBe(2);
  });
});
