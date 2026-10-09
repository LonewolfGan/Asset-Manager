import { useState, useEffect, useMemo, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { toast } from 'sonner';
import {
  generateUuidBatch,
  formatUuid,
  NIL_UUID,
  parseUuidInfo,
  type UuidVersion,
  type UuidParsedInfo,
} from '@/lib/uuid-logic';
import {
  type EnclosureType,
  buildUuidTextFileContent,
  buildUuidCsvFileContent,
  buildFormatOptions,
  getUuidExportFilename,
  triggerFileDownload,
} from '@/lib/uuid-export-logic';

export type TabMode = 'generator' | 'inspector';

export function useUuidGeneratorWorkflow(isFr: boolean) {
  const [activeTab, setActiveTab] = useState<TabMode>('generator');
  const [version, setVersion] = useState<UuidVersion | 'nil'>('v4');
  const [count, setCount] = useState<number>(1);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [enclosure, setEnclosure] = useState<EnclosureType>('none');
  const [uuids, setUuids] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [inspectInput, setInspectInput] = useState<string>('');

  const formatOptions = useMemo(
    () => buildFormatOptions(version, hyphens, uppercase, enclosure),
    [version, hyphens, uppercase, enclosure]
  );

  const generate = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 200);

    if (version === 'nil') {
      const formatted = formatUuid(NIL_UUID, formatOptions);
      setUuids(Array(count).fill(formatted));
    } else {
      const batch = generateUuidBatch(count, formatOptions);
      setUuids(batch);
    }
    trackToolUsed('uuid-generator', `generate-${version}-${count}`);
  }, [version, count, formatOptions]);

  useEffect(() => {
    generate();
  }, [generate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeTab === 'generator') {
        const target = e.target as HTMLElement;
        const isInteractive =
          ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName) ||
          target.isContentEditable;
        if (!isInteractive) {
          e.preventDefault();
          generate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generate, activeTab]);

  const handleDownloadTxt = () => {
    const content = buildUuidTextFileContent(uuids);
    const filename = getUuidExportFilename(version, count, 'txt');
    triggerFileDownload(content, filename, 'text/plain;charset=utf-8');
    toast.success(isFr ? 'Fichier texte téléchargé' : 'Text file downloaded');
    trackToolUsed('uuid-generator', 'download-txt');
  };

  const handleExportJson = async () => {
    const jsonStr = JSON.stringify(uuids, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      toast.success(
        isFr ? 'Format JSON copié dans le presse-papier' : 'JSON copied to clipboard'
      );
      trackToolUsed('uuid-generator', 'export-json');
    } catch {
      toast.error(isFr ? 'Impossible de copier le JSON' : 'Failed to copy JSON');
    }
  };

  const handleExportCsv = () => {
    const content = buildUuidCsvFileContent(uuids);
    const filename = getUuidExportFilename(version, count, 'csv');
    triggerFileDownload(content, filename, 'text/csv;charset=utf-8');
    toast.success(isFr ? 'Fichier CSV téléchargé' : 'CSV file downloaded');
    trackToolUsed('uuid-generator', 'export-csv');
  };

  const inspectedData: UuidParsedInfo = useMemo(() => {
    if (!inspectInput.trim()) {
      return { valid: false, cleanHex: '', formatted: '' };
    }
    return parseUuidInfo(inspectInput, isFr);
  }, [inspectInput, isFr]);

  const singleUuid = uuids[0] || '';

  return {
    activeTab,
    version,
    count,
    hyphens,
    uppercase,
    enclosure,
    uuids,
    singleUuid,
    isRefreshing,
    inspectInput,
    inspectedData,
    setActiveTab,
    setVersion,
    setCount,
    setHyphens,
    setUppercase,
    setEnclosure,
    setInspectInput,
    generate,
    handleDownloadTxt,
    handleExportJson,
    handleExportCsv,
  };
}
