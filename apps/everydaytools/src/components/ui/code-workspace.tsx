import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  Trash2,
  FileText,
  Search,
  AlertCircle,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import CopyButton from '@/components/ui/copy-button';
import { WrapButton } from '@/components/ui/wrap-button';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface CodeWorkspaceProps {
  /** Mode: 'input' for typing/pasting, 'preview' for read-only outputs */
  mode?: 'input' | 'preview';
  /** Value string (controlled) */
  value: string;
  /** Callback fired when text changes (input mode) */
  onChange?: (val: string) => void;
  /** Format identifier or file extension: 'json' | 'csv' | 'html' | 'markdown' | 'txt' | 'xml' | 'yaml' */
  format?: 'json' | 'csv' | 'html' | 'markdown' | 'txt' | 'xml' | 'yaml' | string;
  /** Custom format title or badge label */
  formatLabel?: string;
  /** Custom format icon path (e.g. "/icons/json.svg") */
  formatIcon?: string;
  /** Placeholder text for input mode */
  placeholder?: string;
  /** Callback fired when Cmd/Ctrl + Enter is pressed */
  onSubmit?: () => void;
  /** Optional sample text to inject */
  sampleText?: string;
  /** Optional filename for download button in preview mode */
  downloadFilename?: string;
  /** Custom download handler */
  onDownload?: () => void;
  /** Custom clear handler */
  onClear?: () => void;
  /** Optional format/beautify function */
  onFormat?: () => void;
  /** Minimum height of the editor area (default: 280px) */
  minHeight?: string;
  /** Maximum height of the editor area (default: 560px) */
  maxHeight?: string;
  /** Additional CSS class names */
  className?: string;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  mode = 'input',
  value,
  onChange,
  format = 'txt',
  formatLabel,
  formatIcon,
  placeholder = 'Veuillez saisir votre texte ou code ici...',
  onSubmit,
  sampleText,
  downloadFilename,
  onDownload,
  onClear,
  onFormat,
  minHeight = '280px',
  maxHeight = '560px',
  className = '',
}) => {
  const isInput = mode === 'input';
  const isReadOnly = mode === 'preview';

  const [wrapLines, setWrapLines] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const portalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const portalLineNumbersRef = useRef<HTMLDivElement>(null);

  // Compute live telemetry
  const telemetry = useMemo(() => {
    const text = value || '';
    const lines = text.length > 0 ? text.split('\n').length : 0;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const bytes = new Blob([text]).size;
    let formattedSize = `${bytes} B`;
    if (bytes >= 1024 * 1024) {
      formattedSize = `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    } else if (bytes >= 1024) {
      formattedSize = `${(bytes / 1024).toFixed(1)} Ko`;
    }

    return { lines, chars, words, size: formattedSize };
  }, [value]);

  // Syntax validation for JSON
  useEffect(() => {
    if (format === 'json' && value && value.trim()) {
      try {
        JSON.parse(value);
        setSyntaxError(null);
      } catch (err: any) {
        setSyntaxError(err?.message || 'Syntaxe JSON invalide');
      }
    } else {
      setSyntaxError(null);
    }
  }, [value, format]);

  // Lock body scroll and register Escape key when fullscreen is active
  useEffect(() => {
    if (!isFullscreen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isFullscreen]);

  // Sync scroll between textarea and line numbers
  const handleScroll = (
    e: React.UIEvent<HTMLTextAreaElement>,
    linesRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (linesRef.current) {
      linesRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Handle Tab key in input mode (indent with 2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isInput && e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      if (onChange) onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Drag & drop file reader
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isInput) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      try {
        const text = await file.text();
        if (onChange) onChange(text);
      } catch (err) {
        console.error('Failed to read dropped file:', err);
      }
    }
  };

  // Auto-beautify if available or default JSON beautify
  const handleBeautify = () => {
    if (onFormat) {
      onFormat();
      return;
    }
    if (format === 'json' && value && onChange) {
      try {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed, null, 2));
      } catch {
        // syntax error already shown
      }
    }
  };

  // Native text file download in preview mode
  const handleNativeDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename || `export_${Date.now()}.${format || 'txt'}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Determine label and icon
  const computedLabel =
    formatLabel ||
    (format === 'json'
      ? 'JSON'
      : format === 'csv'
      ? 'CSV'
      : format === 'html'
      ? 'HTML5'
      : format === 'markdown'
      ? 'Markdown'
      : 'Texte Brut');

  const computedIcon =
    formatIcon ||
    (format === 'json'
      ? '/icons/json.svg'
      : format === 'csv'
      ? '/icons/csv.svg'
      : format === 'html'
      ? '/icons/html.svg'
      : format === 'markdown'
      ? '/icons/markdown.svg'
      : '/icons/txt.svg');

  // Shared Toolbar Controls Component
  const renderToolbar = (inPortal = false) => (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/60 border-b border-zinc-200/80 dark:border-white/10 rounded-t-2xl shrink-0 min-h-[58px]">
      {/* Left: Format Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={computedIcon}
          alt={computedLabel}
          className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 drop-shadow-xs"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <span className="text-xs sm:text-sm font-mono font-semibold tracking-wide text-zinc-900 dark:text-zinc-100 uppercase truncate">
          {computedLabel}
        </span>
      </div>

      {/* Right: Contextual Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Input Mode Actions */}
        {isInput && (
          <>
            {sampleText && (
              <ActionTooltip label="Charger des données d'exemple" side="bottom">
                <button
                  type="button"
                  onClick={() => onChange && onChange(sampleText)}
                  className="h-7 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none"
                >
                  <FileText size={12} className="opacity-70" />
                  <span className="hidden sm:inline">Exemple</span>
                </button>
              </ActionTooltip>
            )}

            {(onFormat || format === 'json') && value.trim() && (
              <ActionTooltip label="Formater et indenter le code" side="bottom">
                <button
                  type="button"
                  onClick={handleBeautify}
                  className="h-7 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none"
                >
                  <span>Formater</span>
                </button>
              </ActionTooltip>
            )}

            {value.trim() && (
              <ActionTooltip label="Effacer le contenu" side="bottom">
                <button
                  type="button"
                  onClick={() => {
                    if (onClear) onClear();
                    else if (onChange) onChange('');
                  }}
                  className="h-7 px-2 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </ActionTooltip>
            )}
          </>
        )}

        {/* Preview / Read-Only Actions */}
        {isReadOnly && (
          <>
            <WrapButton
              wrapped={wrapLines}
              onToggle={setWrapLines}
              size="sm"
              variant="ghost"
              className="h-7 px-2.5 rounded-lg text-[11px] font-mono"
            >
              <span className="hidden sm:inline">Wrap</span>
            </WrapButton>

            <ActionTooltip label="Télécharger le fichier" side="bottom">
              <button
                type="button"
                onClick={handleNativeDownload}
                className="h-7 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Download size={12} />
                <span className="hidden sm:inline">Télécharger</span>
              </button>
            </ActionTooltip>
          </>
        )}

        {/* Universal Copy Button */}
        <CopyButton text={value} size="sm" variant="default" label="Copier" />

        {/* Fullscreen / Close Fullscreen Toggle */}
        <ActionTooltip
          label={isFullscreen ? 'Quitter le plein écran (Échap)' : 'Agrandir en plein écran'}
          side="bottom"
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`h-7 px-2 rounded-lg flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
              inPortal
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={12} />
                <span className="hidden sm:inline text-[11px]">Fermer</span>
                <kbd className="hidden md:inline px-1 py-0.2 rounded bg-zinc-300/80 dark:bg-zinc-700 text-[9px]">
                  ÉCHAP
                </kbd>
              </>
            ) : (
              <Maximize2 size={12} />
            )}
          </button>
        </ActionTooltip>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── INLINE WORKSPACE (Stays strictly anchored in document layout) ─── */}
      <div
        onDragOver={(e) => {
          if (isInput) {
            e.preventDefault();
            setIsDragOver(true);
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`group relative flex flex-col w-full rounded-2xl bg-white dark:bg-zinc-950 border transition-all duration-200 shadow-sm ${
          isDragOver
            ? 'border-zinc-500 ring-2 ring-zinc-400/30'
            : 'border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/15'
        } ${className}`}
      >
        {/* Header Toolbar */}
        {renderToolbar(false)}

        {/* Syntax Error Notification */}
        {syntaxError && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-mono shrink-0">
            <AlertCircle size={14} className="shrink-0" />
            <span className="truncate">{syntaxError}</span>
          </div>
        )}

        {/* Editor Surface with Line Numbers */}
        <div
          className="relative flex flex-1 w-full overflow-hidden rounded-b-2xl"
          style={{
            minHeight,
            maxHeight,
          }}
        >
          {/* Sticky Line Numbers Column */}
          <div
            ref={lineNumbersRef}
            aria-hidden="true"
            className="w-12 py-3 pr-2 text-right bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-200/50 dark:border-white/5 font-mono text-xs text-zinc-300 dark:text-zinc-600 select-none overflow-hidden tabular-nums leading-relaxed"
          >
            {telemetry.lines > 0 &&
              Array.from({ length: telemetry.lines }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
          </div>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            onScroll={(e) => handleScroll(e, lineNumbersRef)}
            onKeyDown={handleKeyDown}
            readOnly={isReadOnly}
            placeholder={placeholder}
            spellCheck={false}
            className={`flex-1 p-3 font-mono text-xs sm:text-[13px] leading-relaxed bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none resize-none transition-colors ${
              wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
            }`}
            style={{
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* ─── FULLSCREEN MODAL PORTAL (Renders directly into document.body) ─── */}
      {isFullscreen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFullscreen(false);
            }}
          >
            <div className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Header Toolbar */}
              {renderToolbar(true)}

              {/* Syntax Error Notification */}
              {syntaxError && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-mono shrink-0">
                  <AlertCircle size={14} className="shrink-0" />
                  <span className="truncate">{syntaxError}</span>
                </div>
              )}

              {/* Editor Surface filling 100% available modal height */}
              <div className="relative flex flex-1 w-full min-h-0 overflow-hidden rounded-b-2xl">
                {/* Sticky Line Numbers Column */}
                <div
                  ref={portalLineNumbersRef}
                  aria-hidden="true"
                  className="w-12 py-3 pr-2 text-right bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-200/50 dark:border-white/5 font-mono text-xs text-zinc-300 dark:text-zinc-600 select-none overflow-hidden tabular-nums leading-relaxed shrink-0"
                >
                  {telemetry.lines > 0 &&
                    Array.from({ length: telemetry.lines }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                  ref={portalTextareaRef}
                  value={value}
                  onChange={(e) => onChange && onChange(e.target.value)}
                  onScroll={(e) => handleScroll(e, portalLineNumbersRef)}
                  onKeyDown={handleKeyDown}
                  readOnly={isReadOnly}
                  placeholder={placeholder}
                  spellCheck={false}
                  autoFocus
                  className={`flex-1 h-full p-4 font-mono text-xs sm:text-[13px] leading-relaxed bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none resize-none transition-colors ${
                    wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
                  }`}
                  style={{
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CodeWorkspace;
