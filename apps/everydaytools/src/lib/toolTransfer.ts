import { useEffect, useRef } from 'react';

export interface TransferPayload {
  files: File[];
  sourceTool?: string;
  timestamp: number;
}

let activeTransfer: TransferPayload | null = null;

/**
 * Stage files/blobs to be transferred to the next tool upon navigation.
 */
export function transferFilesToTool(
  input: File | File[] | Blob | Blob[],
  targetPath: string,
  navigate: (path: string) => void,
  defaultFilename = 'image.png',
  sourceTool?: string
) {
  const rawArray = Array.isArray(input) ? input : [input];
  const files: File[] = rawArray.map((item, index) => {
    if (item instanceof File) {
      return item;
    }
    const name = rawArray.length === 1 ? defaultFilename : defaultFilename.replace(/\.([^.]+)$/, `_${index + 1}.$1`);
    const mime = item.type || (name.endsWith('.png') ? 'image/png' : name.endsWith('.jpg') || name.endsWith('.jpeg') ? 'image/jpeg' : name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
    return new File([item], name, { type: mime, lastModified: Date.now() });
  });

  activeTransfer = {
    files,
    sourceTool,
    timestamp: Date.now(),
  };

  navigate(targetPath);
}

/**
 * Retrieve and clear any pending transferred files.
 */
export function consumeTransferredFiles(): File[] | null {
  if (activeTransfer && activeTransfer.files && activeTransfer.files.length > 0) {
    // Only accept transfers within the last 2 minutes to prevent stale loading
    if (Date.now() - activeTransfer.timestamp < 120000) {
      const files = activeTransfer.files;
      activeTransfer = null;
      return files;
    }
    activeTransfer = null;
  }
  return null;
}

/**
 * React hook to automatically consume transferred files upon component mount.
 */
export function useTransferredFiles(onFiles: (files: File[]) => void) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    const files = consumeTransferredFiles();
    if (files && files.length > 0) {
      calledRef.current = true;
      onFiles(files);
    }
  }, [onFiles]);
}
