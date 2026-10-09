import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { ConversionFormat } from '@/components/conversion';
import type { InspectionResult, MetadataTag } from '@/lib/metadata-inspector';
import { MetadataCleanerViewport } from './MetadataCleanerViewport';
import { MetadataTagsInspector } from './MetadataTagsInspector';

interface MetadataCleanerWorkbenchProps {
  file: File;
  telemetryDetails: string;
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  isPreviewLoading: boolean;
  targetFormat: ConversionFormat;
  inspection: InspectionResult | null;
  visibleTags: MetadataTag[];
  activeFilter: 'all' | 'sensitive';
  isInspecting: boolean;
  isFr: boolean;
  onReset: () => void;
  onClean: () => void;
  onFilterChange: (filter: 'all' | 'sensitive') => void;
}

export const MetadataCleanerWorkbench: React.FC<MetadataCleanerWorkbenchProps> = ({
  file,
  telemetryDetails,
  isProcessing,
  error,
  previewUrl,
  isPreviewLoading,
  targetFormat,
  inspection,
  visibleTags,
  activeFilter,
  isInspecting,
  isFr,
  onReset,
  onClean,
  onFilterChange,
}) => {
  return (
    <motion.div
      key="scene-workbench"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className={`w-full flex flex-col gap-6 ${isProcessing ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file.name),
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Changer de fichier' : 'Change file'}
        primaryAction={{
          label: isFr ? 'Nettoyer et Télécharger' : 'Clean & Download',
          loadingLabel: isFr ? 'Nettoyage en cours...' : 'Cleaning...',
          onClick: onClean,
          isDisabled: isProcessing,
          isLoading: isProcessing,
          icon: ShieldCheck,
        }}
      />

      {error && (
        <div className="text-xs font-mono text-red-600 dark:text-red-400 py-2 border-b border-red-200 dark:border-red-900/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        <div className="lg:col-span-5 flex flex-col gap-3">
          <MetadataCleanerViewport
            previewUrl={previewUrl}
            isPreviewLoading={isPreviewLoading}
            targetFormat={targetFormat}
            telemetryDetails={telemetryDetails}
            fileName={file.name}
            isFr={isFr}
          />
        </div>

        <MetadataTagsInspector
          inspection={inspection}
          visibleTags={visibleTags}
          activeFilter={activeFilter}
          isInspecting={isInspecting}
          isFr={isFr}
          onFilterChange={onFilterChange}
        />
      </div>
    </motion.div>
  );
};
