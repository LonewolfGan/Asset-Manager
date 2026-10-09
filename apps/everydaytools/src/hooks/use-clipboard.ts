import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Pure clipboard copy utility with fallback for non-secure contexts
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text && text !== '') return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for non-secure context or restricted iframes
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = typeof document.execCommand === 'function' ? document.execCommand('copy') : false;
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

export interface UseClipboardOptions {
  timeout?: number;
  onCopy?: () => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000, onCopy } = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        if (onCopy) onCopy();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, timeout);
      }
      return success;
    },
    [timeout, onCopy]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}
