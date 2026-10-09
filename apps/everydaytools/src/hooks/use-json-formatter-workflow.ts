import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import * as yaml from 'js-yaml';
import hljs from 'highlight.js/lib/core';
import jsonLang from 'highlight.js/lib/languages/json';
import yamlLang from 'highlight.js/lib/languages/yaml';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  autoRepairJsonString,
  sortObjectKeysRecursively,
  parseJsonError,
  type IndentSize,
  type ViewTab,
  type JsonErrorInfo,
} from '@/lib/json-repair-logic';

hljs.registerLanguage('json', jsonLang);
hljs.registerLanguage('yaml', yamlLang);

export interface DownloadResult {
  blob: Blob;
  filename: string;
  formatType: 'json' | 'txt';
}

export function useJsonFormatterWorkflow(isFr: boolean) {
  const [rawInput, setRawInput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [isMinified, setIsMinified] = useState(false);
  const [viewTab, setViewTab] = useState<ViewTab>('code');
  const [wordWrap, setWordWrap] = useState(true);
  const [yamlMode, setYamlMode] = useState(false);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [treeSearch, setTreeSearch] = useState('');
  const [treeExpandAll, setTreeExpandAll] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);

  const parseResult = useMemo(() => {
    if (!rawInput.trim()) return { ok: true, data: null, empty: true, error: null };
    try {
      const parsed = JSON.parse(rawInput);
      return { ok: true, data: parsed, empty: false, error: null };
    } catch (e) {
      const errInfo = parseJsonError(
        e instanceof Error ? e : new Error(isFr ? 'Erreur de parsing JSON' : 'JSON parse error'),
        rawInput,
        isFr
      );
      return { ok: false, data: null, empty: false, error: errInfo };
    }
  }, [rawInput, isFr]);

  const outputCode = useMemo(() => {
    if (!parseResult.ok || parseResult.empty || parseResult.data === null) return '';
    if (yamlMode) {
      try {
        return yaml.dump(parseResult.data, { indent: 2, lineWidth: -1 });
      } catch {
        return isFr ? '# Impossible de générer le YAML' : '# Unable to generate YAML';
      }
    }
    if (isMinified) return JSON.stringify(parseResult.data);
    const space = indentSize === 'tab' ? '\t' : indentSize;
    return JSON.stringify(parseResult.data, null, space);
  }, [parseResult, indentSize, isMinified, yamlMode, isFr]);

  const highlightedOutput = useMemo(() => {
    if (!outputCode) return '';
    try {
      const lang = yamlMode ? 'yaml' : 'json';
      return hljs.highlight(outputCode, { language: lang, ignoreIllegals: true }).value;
    } catch {
      return outputCode;
    }
  }, [outputCode, yamlMode]);

  const stats = useMemo(() => {
    const rawBytes = new Blob([rawInput]).size;
    const outBytes = new Blob([outputCode]).size;
    const compressionRatio =
      rawBytes > 0 && outBytes > 0 ? Math.round(((rawBytes - outBytes) / rawBytes) * 100) : 0;
    const isArrayRoot = parseResult.ok && Array.isArray(parseResult.data);
    const arrayLength = isArrayRoot ? parseResult.data.length : 0;
    return { rawBytes, outBytes, compressionRatio, isArrayRoot, arrayLength };
  }, [rawInput, outputCode, parseResult]);

  const pushToInput = (newVal: string) => {
    setHistoryStack((prev) => [...prev.slice(-20), rawInput]);
    setRawInput(newVal);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setHistoryStack((s) => s.slice(0, -1));
    setRawInput(prev);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  };

  const handleAutoRepair = () => {
    if (!rawInput.trim()) return;
    const { repaired, modified } = autoRepairJsonString(rawInput);
    if (!modified) {
      toast.info(isFr ? 'Aucune anomalie courante détectée' : 'No common anomalies detected');
      return;
    }
    pushToInput(repaired);
    try {
      JSON.parse(repaired);
      toast.success(isFr ? 'JSON réparé avec succès' : 'JSON repaired successfully');
      trackToolUsed('json-formatter', 'auto-repair');
    } catch {
      toast.warning(isFr ? 'JSON partiellement réparé' : 'JSON partially repaired');
    }
  };

  const handleSortKeys = () => {
    if (!parseResult.ok || parseResult.data === null) {
      toast.error(isFr ? 'Veuillez corriger le JSON avant de trier' : 'Please fix JSON syntax');
      return;
    }
    const sorted = sortObjectKeysRecursively(parseResult.data);
    const space = indentSize === 'tab' ? '\t' : indentSize;
    pushToInput(JSON.stringify(sorted, null, isMinified ? undefined : space));
    toast.success(isFr ? 'Clés triées par ordre alphabétique' : 'Keys sorted alphabetically');
    trackToolUsed('json-formatter', 'sort-keys');
  };

  const handleFormat = (newIndent?: IndentSize) => {
    const targetIndent = newIndent ?? indentSize;
    setIsMinified(false);
    setYamlMode(false);
    if (newIndent) setIndentSize(newIndent);
    if (parseResult.ok && parseResult.data !== null) {
      const space = targetIndent === 'tab' ? '\t' : targetIndent;
      pushToInput(JSON.stringify(parseResult.data, null, space));
      toast.success(
        isFr
          ? `Formaté (${targetIndent === 'tab' ? 'Tab' : targetIndent + ' espaces'})`
          : `Formatted (${targetIndent === 'tab' ? 'Tab' : targetIndent + ' spaces'})`
      );
      trackToolUsed('json-formatter', 'format');
    }
  };

  const handleMinify = () => {
    setIsMinified(true);
    setYamlMode(false);
    if (parseResult.ok && parseResult.data !== null) {
      pushToInput(JSON.stringify(parseResult.data));
      toast.success(isFr ? 'JSON minifié sur 1 ligne' : 'JSON minified onto 1 line');
      trackToolUsed('json-formatter', 'minify');
    }
  };

  const handleEscapeToggle = () => {
    if (!rawInput.trim()) return;
    try {
      if (rawInput.startsWith('"') && rawInput.endsWith('"')) {
        const unescaped = JSON.parse(rawInput);
        if (typeof unescaped === 'string') {
          pushToInput(unescaped);
          toast.success(isFr ? 'Chaîne déséchappée' : 'String unescaped');
          return;
        }
      }
      pushToInput(JSON.stringify(rawInput));
      toast.success(isFr ? 'JSON échappé en chaîne' : 'JSON escaped as string');
    } catch {
      toast.error(isFr ? "Échec de l'opération d'échappement" : 'Escape operation failed');
    }
  };

  const handleClear = () => {
    if (!rawInput) return;
    pushToInput('');
    toast.info(isFr ? 'Atelier vidé' : 'Workspace cleared');
  };

  const handleDownload = () => {
    if (!outputCode) return;
    const ext = yamlMode ? 'yaml' : 'json';
    const mime = yamlMode ? 'text/yaml' : 'application/json';
    const blob = new Blob([outputCode], { type: mime });
    const filename = `data-${Date.now()}.${ext}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(isFr ? `Fichier .${ext} téléchargé` : `File .${ext} downloaded`);

    setDownloadResult({ blob, filename, formatType: ext === 'yaml' ? 'txt' : 'json' });
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        pushToInput(text);
        toast.success(isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFileUpload(staged);
    }
  }, []);

  return {
    rawInput,
    setRawInput,
    indentSize,
    setIndentSize,
    isMinified,
    setIsMinified,
    viewTab,
    setViewTab,
    wordWrap,
    setWordWrap,
    yamlMode,
    setYamlMode,
    historyStack,
    treeSearch,
    setTreeSearch,
    treeExpandAll,
    setTreeExpandAll,
    isDragging,
    setIsDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadResult,
    parseResult,
    outputCode,
    highlightedOutput,
    stats,
    handleUndo,
    handleAutoRepair,
    handleSortKeys,
    handleFormat,
    handleMinify,
    handleEscapeToggle,
    handleClear,
    handleDownload,
    handleFileUpload,
  };
}
