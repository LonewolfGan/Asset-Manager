import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import { TXT_DOCX_SAMPLE_FR, TXT_DOCX_SAMPLE_EN } from '@/lib/txt-to-docx-logic';

interface TxtToDocxPastePaneProps {
  textInput: string;
  onTextInputChange: (val: string) => void;
  onSubmit: () => void;
  isFr: boolean;
}

export function TxtToDocxPastePane({
  textInput,
  onTextInputChange,
  onSubmit,
  isFr,
}: TxtToDocxPastePaneProps) {
  const placeholder = isFr
    ? 'Veuillez saisir votre texte ici...'
    : 'Type or paste your text here...';

  const sampleText = isFr ? TXT_DOCX_SAMPLE_FR : TXT_DOCX_SAMPLE_EN;

  return (
    <div className="space-y-4">
      <CodeWorkspace
        value={textInput}
        onChange={onTextInputChange}
        mode="input"
        format="txt"
        formatLabel={isFr ? 'Document Texte Brut' : 'Plain Text Document'}
        placeholder={placeholder}
        sampleText={sampleText}
        onSubmit={onSubmit}
        minHeight="380px"
        maxHeight="520px"
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!textInput.trim()}
          onClick={onSubmit}
          className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{isFr ? 'Valider et configurer' : 'Confirm and configure'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
