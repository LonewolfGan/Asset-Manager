import { describe, it, expect } from 'vitest';
import {
  analyzeText,
  transformTextCase,
} from '../../../src/lib/word-counter-logic';

describe('word-counter-logic', () => {
  it('correctly calculates words, characters, sentences and paragraphs', () => {
    const sample = `EverydayTools is completely private. All processing is done client-side!\n\nNo server upload is needed.`;
    const res = analyzeText(sample);

    expect(res.words).toBe(14);
    expect(res.sentences).toBe(3);
    expect(res.paragraphs).toBe(2);
    expect(res.characters).toBe(101);
    expect(res.readingTimeSec).toBeGreaterThan(0);
    expect(res.speakingTimeSec).toBeGreaterThan(0);
  });

  it('handles empty input cleanly', () => {
    const res = analyzeText('   ');
    expect(res.words).toBe(0);
    expect(res.characters).toBe(0);
    expect(res.sentences).toBe(0);
    expect(res.topKeywords).toHaveLength(0);
  });

  it('extracts top keywords excluding stop words', () => {
    const text = `javascript react javascript typescript react javascript frontend web`;
    const res = analyzeText(text);

    expect(res.topKeywords[0].word).toBe('javascript');
    expect(res.topKeywords[0].count).toBe(3);
    expect(res.topKeywords[1].word).toBe('react');
    expect(res.topKeywords[1].count).toBe(2);
  });

  it('transforms case accurately', () => {
    const str = 'hello world. how are you?';
    expect(transformTextCase(str, 'upper')).toBe('HELLO WORLD. HOW ARE YOU?');
    expect(transformTextCase(str, 'title')).toBe('Hello World. How Are You?');
    expect(transformTextCase(str, 'sentence')).toBe('Hello world. How are you?');
    expect(transformTextCase('Événement Développeur Web', 'slug')).toBe('evenement-developpeur-web');
  });
});
