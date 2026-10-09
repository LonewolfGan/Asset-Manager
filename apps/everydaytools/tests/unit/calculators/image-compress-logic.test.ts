import { describe, it, expect } from 'vitest';
import {
  getCompressionPresets,
  calculateEstimatedSize,
  calculateCompressionGain,
  generateCompressedFilename,
} from '@/lib/image-compress-logic';

describe('image-compress-logic (TDD Phase RED)', () => {
  describe('getCompressionPresets', () => {
    it('returns 3 presets in french when isFr is true', () => {
      const presets = getCompressionPresets(true);
      expect(presets).toHaveLength(3);
      expect(presets[0].id).toBe('light');
      expect(presets[0].name).toBe('Légère');
      expect(presets[1].id).toBe('balanced');
      expect(presets[1].name).toBe('Équilibrée');
      expect(presets[2].id).toBe('strong');
      expect(presets[2].name).toBe('Maximale');
    });

    it('returns 3 presets in english when isFr is false', () => {
      const presets = getCompressionPresets(false);
      expect(presets).toHaveLength(3);
      expect(presets[0].name).toBe('Light');
      expect(presets[1].name).toBe('Balanced');
      expect(presets[2].name).toBe('Maximum');
    });
  });

  describe('calculateEstimatedSize', () => {
    it('calculates estimated size with minimum 1024 bytes', () => {
      expect(calculateEstimatedSize(1000000, 0.4)).toBe(400000);
      expect(calculateEstimatedSize(500, 0.2)).toBe(1024);
    });
  });

  describe('calculateCompressionGain', () => {
    it('calculates positive gain percentage', () => {
      expect(calculateCompressionGain(1000000, 400000)).toBe(60);
      expect(calculateCompressionGain(1000000, 700000)).toBe(30);
    });

    it('returns 0 if compressed size is larger than original', () => {
      expect(calculateCompressionGain(500000, 600000)).toBe(0);
    });
  });

  describe('generateCompressedFilename', () => {
    it('inserts _compressed before extension', () => {
      expect(generateCompressedFilename('photo.jpg')).toBe('photo_compressed.jpg');
      expect(generateCompressedFilename('mon-image.png')).toBe('mon-image_compressed.png');
    });

    it('handles files with no extension', () => {
      expect(generateCompressedFilename('rawfile')).toBe('rawfile_compressed');
    });
  });
});
