import React from 'react';
import { FileUp } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';

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
        <div className="absolute inset-0 z-20 m-2 rounded-xl border-2 border-dashed border-[#FF6B35] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 pointer-events-none transition-all">
          <FileUp className="w-8 h-8 text-[#FF6B35] animate-bounce" />
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
