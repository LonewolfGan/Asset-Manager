import React from 'react';
import { FileText, Loader2, CheckCircle2, AlertCircle, RotateCw, Download, X } from 'lucide-react';
import type { BatchItemRowProps } from './types';
import { formatBytes } from '../utils';

export const BatchItemRow: React.FC<BatchItemRowProps> = ({
  item,
  onRemove,
  onRetry,
  onDownload,
  isFr = false,
  className = '',
}) => {
  const { id, name, size, status, progress, errorMessage } = item;

  const renderStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-[#FF6B35] animate-spin shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'idle':
      default:
        return <FileText className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div
      data-testid="batch-item-row"
      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {renderStatusIcon()}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {name}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            {size !== undefined && <span>{formatBytes(size, 1, isFr)}</span>}
            {status === 'processing' && progress !== undefined && (
              <span className="text-[#FF6B35]">{progress}%</span>
            )}
            {status === 'error' && errorMessage && (
              <span className="text-red-500 font-sans">{errorMessage}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {status === 'error' && onRetry && (
          <button
            type="button"
            data-testid="retry-batch-item"
            onClick={() => onRetry(id)}
            title={isFr ? 'Réessayer' : 'Retry'}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors focus:outline-none"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        )}

        {status === 'success' && onDownload && (
          <button
            type="button"
            data-testid="download-batch-item"
            onClick={() => onDownload(id)}
            title={isFr ? 'Télécharger' : 'Download'}
            className="p-1.5 text-[#FF6B35] hover:text-[#FF6B35]/80 rounded transition-colors focus:outline-none"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            data-testid="remove-batch-item"
            onClick={() => onRemove(id)}
            title={isFr ? 'Supprimer' : 'Remove'}
            className="p-1.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
