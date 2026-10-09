import { useState, useCallback, useEffect } from 'react';
import {
  readHistory,
  saveToHistory as persistSearch,
  removeFromHistory as removeSearch,
  clearHistory as wipeHistory,
} from '@/lib/search-history';

export function useSearchHistory(isOpen: boolean) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(readHistory());
    }
  }, [isOpen]);

  const saveQuery = useCallback((q: string) => {
    persistSearch(q);
    setHistory(readHistory());
  }, []);

  const removeQuery = useCallback((q: string) => {
    removeSearch(q);
    setHistory(readHistory());
  }, []);

  const clearAll = useCallback(() => {
    wipeHistory();
    setHistory([]);
  }, []);

  return {
    history,
    saveQuery,
    removeQuery,
    clearAll,
  };
}
