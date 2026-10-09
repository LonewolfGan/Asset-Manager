import { useState, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import {
  autoRepairJsonString,
  sortObjectKeysRecursively,
  parseJsonError,
} from '@/lib/json-repair-logic';
import {
  computeSemanticDeltas,
  computeAlignedLineDiff,
  computeUnifiedDiff,
  DEFAULT_LEFT,
  DEFAULT_RIGHT,
  type DiffViewMode,
  type SemanticDelta,
  type AlignedLine,
  type UnifiedLine,
} from '@/lib/json-diff-aligned-logic';

export function useJsonDiffWorkflow(isFr: boolean) {
  const [inputLeft, setInputLeft] = useState<string>(DEFAULT_LEFT);
  const [inputRight, setInputRight] = useState<string>(DEFAULT_RIGHT);

  const [editorHeight, setEditorHeight] = useState<number>(340);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(340);

  const hasInputs = Boolean(inputLeft.trim() || inputRight.trim());
  const hasBothInputs = Boolean(inputLeft.trim() && inputRight.trim());

  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  const [normalizeKeys, setNormalizeKeys] = useState(true);
  const [filterOnlyDiffs, setFilterOnlyDiffs] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  // Parsing réactif des 2 JSONs
  const parseLeft = useMemo(() => {
    if (!inputLeft.trim()) return { ok: true, data: null, empty: true, error: null };
    try {
      const data = JSON.parse(inputLeft);
      return { ok: true, data, empty: false, error: null };
    } catch (e) {
      return {
        ok: false,
        data: null,
        empty: false,
        error: parseJsonError(
          e instanceof Error ? e : new Error(isFr ? 'JSON original invalide' : 'Invalid original JSON'),
          inputLeft,
          isFr
        ),
      };
    }
  }, [inputLeft, isFr]);

  const parseRight = useMemo(() => {
    if (!inputRight.trim()) return { ok: true, data: null, empty: true, error: null };
    try {
      const data = JSON.parse(inputRight);
      return { ok: true, data, empty: false, error: null };
    } catch (e) {
      return {
        ok: false,
        data: null,
        empty: false,
        error: parseJsonError(
          e instanceof Error ? e : new Error(isFr ? 'JSON modifié invalide' : 'Invalid modified JSON'),
          inputRight,
          isFr
        ),
      };
    }
  }, [inputRight, isFr]);

  // Analyse sémantique des deltas
  const deltas = useMemo(() => {
    if (!parseLeft.ok || !parseRight.ok || parseLeft.data === null || parseRight.data === null) {
      return [];
    }
    const a = normalizeKeys ? sortObjectKeysRecursively(parseLeft.data) : parseLeft.data;
    const b = normalizeKeys ? sortObjectKeysRecursively(parseRight.data) : parseRight.data;
    return computeSemanticDeltas(a, b);
  }, [parseLeft, parseRight, normalizeKeys]);

  // Métriques
  const metrics = useMemo(() => {
    let added = 0;
    let removed = 0;
    let modified = 0;

    for (const d of deltas) {
      if (d.type === 'add') added++;
      else if (d.type === 'remove') removed++;
      else if (d.type === 'modify') modified++;
    }

    const isIdentical =
      parseLeft.ok &&
      parseRight.ok &&
      !parseLeft.empty &&
      !parseRight.empty &&
      deltas.length === 0;

    return { added, removed, modified, total: deltas.length, isIdentical };
  }, [deltas, parseLeft, parseRight]);

  // Représentations formatées pour le diff de texte
  const formattedLeftLines = useMemo(() => {
    if (!parseLeft.ok || parseLeft.data === null) return [];
    const target = normalizeKeys ? sortObjectKeysRecursively(parseLeft.data) : parseLeft.data;
    return JSON.stringify(target, null, 2).split('\n');
  }, [parseLeft, normalizeKeys]);

  const formattedRightLines = useMemo(() => {
    if (!parseRight.ok || parseRight.data === null) return [];
    const target = normalizeKeys ? sortObjectKeysRecursively(parseRight.data) : parseRight.data;
    return JSON.stringify(target, null, 2).split('\n');
  }, [parseRight, normalizeKeys]);

  // Diff de lignes calculé
  const alignedLines = useMemo(() => {
    if (formattedLeftLines.length === 0 && formattedRightLines.length === 0) return [];
    const lines = computeAlignedLineDiff(formattedLeftLines, formattedRightLines);
    if (!filterOnlyDiffs) return lines;
    return lines.filter((l) => l.typeLeft !== 'same' || l.typeRight !== 'same');
  }, [formattedLeftLines, formattedRightLines, filterOnlyDiffs]);

  const unifiedLines = useMemo(() => {
    if (formattedLeftLines.length === 0 && formattedRightLines.length === 0) return [];
    const lines = computeUnifiedDiff(formattedLeftLines, formattedRightLines);
    if (!filterOnlyDiffs) return lines;
    return lines.filter((l) => l.type !== 'same');
  }, [formattedLeftLines, formattedRightLines, filterOnlyDiffs]);

  // Actions
  const handleSwap = () => {
    const temp = inputLeft;
    setInputLeft(inputRight);
    setInputRight(temp);
    toast.success(isFr ? 'Versions inversées' : 'Versions swapped');
    trackToolUsed('json-diff', 'swap');
  };

  const handleClear = () => {
    setInputLeft('');
    setInputRight('');
    toast.info(isFr ? 'Atelier vidé' : 'Workspace cleared');
  };

  const handleAutoRepairA = () => {
    const { repaired, modified } = autoRepairJsonString(inputLeft);
    if (modified) {
      setInputLeft(repaired);
      toast.success(isFr ? 'JSON original réparé avec succès' : 'Original JSON repaired successfully');
    } else {
      toast.info(isFr ? 'Aucune anomalie courante détectée' : 'No common anomalies detected');
    }
  };

  const handleAutoRepairB = () => {
    const { repaired, modified } = autoRepairJsonString(inputRight);
    if (modified) {
      setInputRight(repaired);
      toast.success(isFr ? 'JSON modifié réparé avec succès' : 'Modified JSON repaired successfully');
    } else {
      toast.info(isFr ? 'Aucune anomalie courante détectée' : 'No common anomalies detected');
    }
  };

  const getDiffSummary = () => {
    if (deltas.length === 0) {
      return isFr ? 'Les deux JSONs sont strictement identiques.' : 'Both JSON payloads are strictly identical.';
    }
    const lines = deltas.map((d) => {
      if (d.type === 'add')
        return isFr
          ? `+ [AJOUTÉ] ${d.path} = ${JSON.stringify(d.newValue)}`
          : `+ [ADDED] ${d.path} = ${JSON.stringify(d.newValue)}`;
      if (d.type === 'remove')
        return isFr
          ? `- [SUPPRIMÉ] ${d.path} (était ${JSON.stringify(d.oldValue)})`
          : `- [REMOVED] ${d.path} (was ${JSON.stringify(d.oldValue)})`;
      return isFr
        ? `~ [MODIFIÉ] ${d.path} : ${JSON.stringify(d.oldValue)} ➔ ${JSON.stringify(d.newValue)}`
        : `~ [MODIFIED] ${d.path} : ${JSON.stringify(d.oldValue)} ➔ ${JSON.stringify(d.newValue)}`;
    });
    return (
      (isFr
        ? `Diff JSON (${metrics.added} ajouts, ${metrics.removed} suppressions, ${metrics.modified} modifications) :\n\n`
        : `JSON Diff (${metrics.added} additions, ${metrics.removed} deletions, ${metrics.modified} modifications):\n\n`) +
      lines.join('\n')
    );
  };

  const handleFileUploadA = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setInputLeft(text);
        toast.success(isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUploadB = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setInputRight(text);
        toast.success(isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`);
      }
    };
    reader.readAsText(file);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(180, Math.min(800, startHeightRef.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return {
    inputLeft,
    setInputLeft,
    inputRight,
    setInputRight,
    editorHeight,
    hasInputs,
    hasBothInputs,
    viewMode,
    setViewMode,
    normalizeKeys,
    setNormalizeKeys,
    filterOnlyDiffs,
    setFilterOnlyDiffs,
    wordWrap,
    setWordWrap,
    parseLeft,
    parseRight,
    deltas,
    metrics,
    alignedLines,
    unifiedLines,
    handleSwap,
    handleClear,
    handleAutoRepairA,
    handleAutoRepairB,
    getDiffSummary,
    handleFileUploadA,
    handleFileUploadB,
    handleMouseDownResize,
  };
}
