import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffText, consumeHandoffFile } from '@/lib/file-handoff';
import {
  analyzeText,
  SAMPLE_AI_TEXT_FR,
  SAMPLE_AI_TEXT_EN,
  type TextAnalysis,
} from '@/lib/ai-scrubber-logic';
import {
  executeTextScrubbing,
  downloadCleanedTextFile,
  ScrubOptions,
} from '@/lib/ai-scrubber-export-logic';

export function useAiScrubberWorkflow(isFr: boolean) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [undoStack, setUndoStack] = useState<Array<{ input: string; output: string }>>([]);

  // Option toggles
  const [optInvisibles, setOptInvisibles] = useState(true);
  const [optEmDashes, setOptEmDashes] = useState(true);
  const [optStylistic, setOptStylistic] = useState(true);
  const [optSymbols, setOptSymbols] = useState(true);
  const [optWhitespace, setOptWhitespace] = useState(true);

  const [isDragging, setIsDragging] = useState(false);

  // Auto-consume handoff file or text from previous workflow step (React 19 StrictMode guarded)
  const hasConsumedHandoffRef = useRef(false);
  useEffect(() => {
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;
    const stagedFile = consumeHandoffFile();
    if (stagedFile) {
      stagedFile.text().then((content) => {
        setInputText(content);
        setOutputText('');
      }).catch(() => {});
      return;
    }
    const stagedText = consumeHandoffText();
    if (stagedText) {
      setInputText(stagedText);
      setOutputText('');
    }
  }, []);

  // Real-time analysis of the input text
  const analysis: TextAnalysis = useMemo(() => {
    return analyzeText(inputText);
  }, [inputText]);

  const scrubOptions: ScrubOptions = useMemo(
    () => ({
      invisibles: optInvisibles,
      emDashes: optEmDashes,
      stylistic: optStylistic,
      symbols: optSymbols,
      whitespace: optWhitespace,
    }),
    [optInvisibles, optEmDashes, optStylistic, optSymbols, optWhitespace]
  );

  const hasActiveOptions =
    optInvisibles || optEmDashes || optStylistic || optSymbols || optWhitespace;

  // Clear all text
  const handleClear = useCallback(() => {
    if (!inputText && !outputText) return;
    setUndoStack((prev) => [...prev, { input: inputText, output: outputText }].slice(-20));
    setInputText('');
    setOutputText('');
    toast.info(isFr ? 'Texte effacé.' : 'Text cleared.');
  }, [inputText, outputText, isFr]);

  // Undo last modification
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setInputText(last.input);
    setOutputText(last.output);
    toast.info(isFr ? 'Action annulée.' : 'Action undone.');
  }, [undoStack, isFr]);

  // Main cleaning function
  const handleScrub = useCallback(() => {
    if (!inputText.trim()) {
      toast.info(
        isFr
          ? 'Veuillez saisir ou coller un texte à nettoyer.'
          : 'Please enter or paste text to clean.'
      );
      return;
    }

    if (!hasActiveOptions) {
      toast.info(
        isFr
          ? 'Veuillez activer au moins une option de nettoyage.'
          : 'Please enable at least one cleaning option.'
      );
      return;
    }

    setUndoStack((prev) => [...prev, { input: inputText, output: outputText }].slice(-20));

    const result = executeTextScrubbing(inputText, scrubOptions);
    setOutputText(result.outputText);
    trackToolUsed('ai-text-scrubber', 'utilities');

    toast.success(
      isFr
        ? `Texte épuré avec succès (${result.totalModified} anomalie(s) IA traitée(s)).`
        : `Text scrubbed successfully (${result.totalModified} AI pattern(s) sanitized).`
    );
  }, [inputText, outputText, hasActiveOptions, scrubOptions, isFr]);

  // Keyboard shortcut Ctrl/Cmd + Enter to scrub, Escape to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleScrub();
      } else if (e.key === 'Escape' && (inputText || outputText)) {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleScrub, handleClear, inputText, outputText]);

  // Load sample text
  const handleLoadSample = useCallback(() => {
    setUndoStack((prev) => [...prev, { input: inputText, output: outputText }].slice(-20));
    const sample = isFr ? SAMPLE_AI_TEXT_FR : SAMPLE_AI_TEXT_EN;
    setInputText(sample);
    setOutputText('');
    toast.info(
      isFr
        ? 'Exemple de texte avec filigranes, tirets et clichés IA chargé.'
        : 'Sample AI text loaded.'
    );
  }, [inputText, outputText, isFr]);

  // Download cleaned text
  const handleDownload = useCallback(() => {
    if (!outputText) return;
    downloadCleanedTextFile(outputText, 'scrubbed_text.txt');
    toast.success(
      isFr ? 'Fichier téléchargé : scrubbed_text.txt' : 'Downloaded scrubbed_text.txt'
    );
  }, [outputText, isFr]);

  // Transfer output back to input
  const handleApplyToInput = useCallback(() => {
    if (!outputText) return;
    setUndoStack((prev) => [...prev, { input: inputText, output: outputText }].slice(-20));
    setInputText(outputText);
    setOutputText('');
    toast.success(
      isFr ? 'Texte épuré transféré dans la source.' : 'Cleaned text moved to source.'
    );
  }, [inputText, outputText, isFr]);


  // Drag & drop file reader
  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(
            isFr
              ? 'Fichier trop volumineux (max 5 Mo).'
              : 'File too large (max 5MB).'
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (typeof content === 'string') {
            setUndoStack((prev) => [...prev, { input: inputText, output: outputText }].slice(-20));
            setInputText(content);
            setOutputText('');
            toast.success(
              isFr
                ? `Fichier « ${file.name} » chargé.`
                : `Loaded file "${file.name}".`
            );
          }
        };
        reader.readAsText(file);
      }
    },
    [inputText, outputText, isFr]
  );

  const hasContent = Boolean(inputText.trim());
  const hasResult = Boolean(outputText.trim());
  const totalAnomalies =
    analysis.invisiblesCount +
    analysis.emDashesCount +
    analysis.stylisticCount +
    analysis.symbolsCount;
  const hasAnomalies = totalAnomalies > 0;

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    undoStack,
    optInvisibles,
    setOptInvisibles,
    optEmDashes,
    setOptEmDashes,
    optStylistic,
    setOptStylistic,
    optSymbols,
    setOptSymbols,
    optWhitespace,
    setOptWhitespace,
    isDragging,
    setIsDragging,
    analysis,
    hasContent,
    hasResult,
    hasAnomalies,
    hasActiveOptions,
    totalAnomalies,
    handleScrub,
    handleLoadSample,
    handleDownload,
    handleApplyToInput,
    handleClear,
    handleUndo,
    handleFileDrop,
  };
}

export type AiScrubberWorkflow = ReturnType<typeof useAiScrubberWorkflow>;
