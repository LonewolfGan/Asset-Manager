import React from 'react';
import { FileUp, Sparkles } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { WORD_COUNTER_SAMPLES } from '@/lib/word-counter-samples';

interface WordCounterCanvasProps {
  text: string;
  isDraggingOver: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isFr: boolean;
  copiedLabel: string;
  onTextChange: (newVal: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onQuickCopy: () => void;
  onLoadSample?: (sampleId: string) => void;
}

export const WordCounterCanvas: React.FC<WordCounterCanvasProps> = ({
  text,
  isDraggingOver,
  textareaRef,
  isFr,
  copiedLabel,
  onTextChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onQuickCopy,
  onLoadSample,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="relative bg-white dark:bg-zinc-950 transition-colors"
    >
      {/* Overlay Drag & Drop réactif */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-20 m-2 rounded-xl border-2 border-dashed border-[var(--accent)] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 pointer-events-none transition-opacity duration-150">
          <FileUp className="w-8 h-8 text-[var(--accent)] animate-bounce" />
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? 'Déposez votre document ici' : 'Drop your document here'}
          </p>
          <p className="text-xs text-zinc-500">
            {isFr
              ? 'Prend en charge les formats .txt, .md, .markdown'
              : 'Supports .txt, .md, .markdown formats'}
          </p>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={
          isFr
            ? 'Tapez, collez votre texte ou glissez-déposez un document (.txt, .md)...'
            : 'Type, paste your text or drop a document (.txt, .md)...'
        }
        spellCheck={true}
        className="w-full min-h-[380px] lg:min-h-[460px] p-6 sm:p-8 bg-transparent outline-none font-sans text-sm sm:text-base leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-y"
      />

      {/* Échantillons en état vide */}
      {!text && onLoadSample && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{isFr ? 'Exemples rapides :' : 'Quick samples:'}</span>
          </div>
          {WORD_COUNTER_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              data-sample={sample.id}
              onClick={() => onLoadSample(sample.id)}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-150 cursor-pointer"
            >
              {isFr ? sample.labelFr : sample.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Bouton rapide de copie flottant en bas à droite si texte présent */}
      {text && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
          <CopyButton
            text={text}
            label={isFr ? 'Copier' : 'Copy'}
            copiedLabel={copiedLabel}
            variant="default"
            size="sm"
            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs shadow-xs text-zinc-700 dark:text-zinc-300"
            onCopy={onQuickCopy}
          />
        </div>
      )}
    </div>
  );
};
