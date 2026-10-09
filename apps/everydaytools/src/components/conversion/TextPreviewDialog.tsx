import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CodeWorkspace from '@/components/ui/code-workspace';

export interface TextPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filename: string;
  text: string;
  onDownload?: () => void;
  copyLabel?: string;
  copiedLabel?: string;
  downloadLabel?: string;
  formatTag?: string;
}

export const TextPreviewDialog: React.FC<TextPreviewDialogProps> = ({
  open,
  onOpenChange,
  filename,
  text,
  onDownload,
  downloadLabel,
  formatTag,
}) => {
  // Infer format from filename or formatTag
  const format = React.useMemo(() => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.json')) return 'json';
    if (lower.endsWith('.csv')) return 'csv';
    if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'html';
    if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'markdown';
    if (lower.endsWith('.xml')) return 'xml';
    if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'yaml';
    if (formatTag?.toLowerCase().includes('json')) return 'json';
    if (formatTag?.toLowerCase().includes('csv')) return 'csv';
    if (formatTag?.toLowerCase().includes('html')) return 'html';
    if (formatTag?.toLowerCase().includes('markdown')) return 'markdown';
    return 'txt';
  }, [filename, formatTag]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[92vh] flex flex-col p-5 sm:p-6 gap-4 border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {filename}
          </DialogTitle>
          <DialogDescription className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            Aperçu haute fidélité du fichier généré
          </DialogDescription>
        </DialogHeader>

        {/* Embedded Full-Featured CodeWorkspace in Read-Only Preview Mode */}
        <div className="flex-1 min-h-0">
          <CodeWorkspace
            mode="preview"
            value={text}
            format={format}
            formatLabel={formatTag}
            downloadFilename={filename}
            onDownload={onDownload}
            minHeight="340px"
            maxHeight="60vh"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextPreviewDialog;
