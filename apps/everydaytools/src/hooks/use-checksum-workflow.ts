import { useState, useCallback, useEffect, useMemo } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  ChecksumAlgo,
  computeAllChecksums,
  findMatchingAlgo,
  buildSingleChecksumFile,
  buildChecksumReportText,
  downloadTextFile,
} from '@/lib/checksum-logic';

export function useChecksumWorkflow(isFr: boolean) {
  const [files, setFiles] = useState<File[]>([]);
  const [hashes, setHashes] = useState<Record<ChecksumAlgo, string> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Verification state
  const [expectedHash, setExpectedHash] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const file = files[0] ?? null;

  // Process file and compute all cryptographic checksums in parallel
  const computeHashes = useCallback(
    async (f: File) => {
      setIsProcessing(true);
      setError(null);
      setHashes(null);
      trackToolUsed('checksum', 'privacy');

      try {
        const buffer = await f.arrayBuffer();
        const computed = await computeAllChecksums(buffer, isFr);
        setHashes(computed);
      } catch (err) {
        trackToolError('checksum', 'general-error');
        setError(
          err instanceof Error
            ? err.message
            : isFr
            ? 'Erreur lors du calcul des hachages'
            : 'Failed to compute checksums'
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [isFr]
  );

  const handleFileSelected = useCallback(
    (f: File) => {
      setFiles([f]);
      setExpectedHash('');
      void computeHashes(f);
    },
    [computeHashes]
  );

  const handleReset = useCallback(() => {
    setFiles([]);
    setHashes(null);
    setExpectedHash('');
    setError(null);
    setIsProcessing(false);
    setCopiedAll(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && files.length > 0 && !isProcessing) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isProcessing, handleReset]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelected(droppedFile);
    }
  };

  // Download standard UNIX .sha256 file
  const handleDownloadSha256 = () => {
    if (!file || !hashes?.['SHA-256']) return;
    const content = buildSingleChecksumFile(hashes['SHA-256'], file.name);
    downloadTextFile(content, `${file.name}.sha256`);
  };

  // Download standard MD5 file
  const handleDownloadMd5 = () => {
    if (!file || !hashes?.['MD5']) return;
    const content = buildSingleChecksumFile(hashes['MD5'], file.name);
    downloadTextFile(content, `${file.name}.md5`);
  };

  // Download comprehensive verification report
  const handleDownloadReport = () => {
    if (!file || !hashes) return;
    const content = buildChecksumReportText(file.name, file.size, hashes, isFr);
    downloadTextFile(content, `${file.name}.checksums.txt`);
  };

  // Copy all hashes formatted to clipboard
  const handleCopyAll = () => {
    if (!hashes) return;
    const text = `SHA-256: ${hashes['SHA-256']}\nSHA-512: ${hashes['SHA-512']}\nMD5: ${hashes['MD5']}\nSHA-1: ${hashes['SHA-1']}\nSHA-384: ${hashes['SHA-384']}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Verification matching logic
  const normalizedExpected = expectedHash.trim().toLowerCase();
  const matchedAlgo = useMemo(() => {
    return findMatchingAlgo(expectedHash, hashes);
  }, [expectedHash, hashes]);

  const isInvalidMatch = Boolean(normalizedExpected.length >= 8 && !matchedAlgo);

  return {
    file,
    hashes,
    isProcessing,
    error,
    setError,
    isDragging,
    expectedHash,
    setExpectedHash,
    copiedAll,
    normalizedExpected,
    matchedAlgo,
    isInvalidMatch,
    handleFileSelected,
    handleReset,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDownloadSha256,
    handleDownloadMd5,
    handleDownloadReport,
    handleCopyAll,
  };
}

export type ChecksumWorkflow = ReturnType<typeof useChecksumWorkflow>;
