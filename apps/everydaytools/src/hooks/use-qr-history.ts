import { useState, useRef, useCallback, useEffect } from 'react';
import {
  InputMode,
  WifiEnc,
  DotStyle,
  EyeStyle,
} from '@/lib/qr-code-logic';

export interface QrHistorySnapshot {
  mode: InputMode;
  url: string;
  rawText: string;
  wifiSsid: string;
  wifiPass: string;
  wifiEnc: WifiEnc;
  vcardName: string;
  vcardOrg: string;
  vcardEmail: string;
  vcardPhone: string;
  vcardUrl: string;
  fgColor: string;
  bgColor: string;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  logoUrl: string | null;
  logoScale: number;
  activePresetId: string | null;
  iconColor: string;
}

const MAX_HISTORY = 30;

export function useQrHistory(
  initialSnapshot: QrHistorySnapshot,
  onApplySnapshot: (s: QrHistorySnapshot) => void
) {
  const [history, setHistory] = useState<QrHistorySnapshot[]>([initialSnapshot]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const lastPushTimeRef = useRef(0);

  const pushSnapshot = useCallback((snap: QrHistorySnapshot, forceNew = false) => {
    const now = Date.now();
    setHistory((prev) => {
      const current = prev[historyIndex];
      if (current && JSON.stringify(current) === JSON.stringify(snap)) {
        return prev;
      }
      if (!forceNew && lastPushTimeRef.current > 0 && now - lastPushTimeRef.current < 600) {
        const next = [...prev];
        next[historyIndex] = snap;
        return next;
      }
      lastPushTimeRef.current = now;
      const upToCurrent = prev.slice(0, historyIndex + 1);
      const next = [...upToCurrent, snap].slice(-MAX_HISTORY);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      onApplySnapshot(history[newIdx]);
    }
  }, [historyIndex, history, onApplySnapshot]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      onApplySnapshot(history[newIdx]);
    }
  }, [historyIndex, history, onApplySnapshot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (isInput && !e.ctrlKey && !e.metaKey) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    history,
    historyIndex,
    pushSnapshot,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
