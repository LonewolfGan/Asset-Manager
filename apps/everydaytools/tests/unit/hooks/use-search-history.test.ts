import { describe, it, expect, beforeEach } from 'vitest';
import {
  readHistory,
  saveToHistory,
  removeFromHistory,
  clearHistory,
  HISTORY_KEY,
} from '@/lib/search-history';

describe('Search History Logic (TDD Phase RED)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty history when localStorage is clean', () => {
    expect(readHistory()).toEqual([]);
  });

  it('adds items to history and removes duplicates, keeping most recent on top', () => {
    saveToHistory('pdf-split');
    expect(readHistory()).toEqual(['pdf-split']);

    saveToHistory('image-crop');
    expect(readHistory()).toEqual(['image-crop', 'pdf-split']);

    saveToHistory('pdf-split');
    expect(readHistory()).toEqual(['pdf-split', 'image-crop']);
  });

  it('limits history to max 5 items', () => {
    for (let i = 1; i <= 7; i++) {
      saveToHistory(`tool-${i}`);
    }
    const history = readHistory();
    expect(history.length).toBe(5);
    expect(history[0]).toBe('tool-7');
  });

  it('removes item from history and clears all history', () => {
    saveToHistory('item-1');
    saveToHistory('item-2');

    removeFromHistory('item-1');
    expect(readHistory()).toEqual(['item-2']);

    clearHistory();
    expect(readHistory()).toEqual([]);
  });
});
