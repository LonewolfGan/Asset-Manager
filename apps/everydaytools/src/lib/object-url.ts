import { useEffect } from 'react';

/**
 * Safely revokes an object URL if valid, suppressing errors if already revoked.
 */
export function safeRevokeObjectUrl(url: string | null | undefined): void {
  if (url && typeof url === 'string' && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore errors if URL was already revoked or environment lacks revokeObjectURL
    }
  }
}

/**
 * React hook that guarantees cleanup of an object URL when it changes or on unmount.
 */
export function useObjectUrlCleanup(url: string | null | undefined): void {
  useEffect(() => {
    return () => {
      safeRevokeObjectUrl(url);
    };
  }, [url]);
}
