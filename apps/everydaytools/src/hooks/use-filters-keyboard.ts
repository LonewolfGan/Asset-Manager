import { useEffect } from 'react';

interface FiltersKeyboardOptions {
  viewMode: string;
  isExportMenuOpen: boolean;
  setIsHoldingOriginal: (holding: boolean) => void;
  setIsExportMenuOpen: (open: boolean) => void;
  onResetAll: () => void;
  onFullReset: () => void;
}

export function useFiltersKeyboard({
  isExportMenuOpen,
  setIsHoldingOriginal,
  setIsExportMenuOpen,
}: FiltersKeyboardOptions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHoldingOriginal(true);
      }
      if (e.key === 'Escape' && isExportMenuOpen) {
        setIsExportMenuOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsHoldingOriginal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isExportMenuOpen, setIsHoldingOriginal, setIsExportMenuOpen]);
}
