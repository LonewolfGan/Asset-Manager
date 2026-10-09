import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { PdfRepairWorkflow } from '@/hooks/use-pdf-repair-workflow';
import { PdfRepairDiagnostics } from './PdfRepairDiagnostics';

interface PdfRepairWorkbenchProps {
  workflow: PdfRepairWorkflow;
  isFr: boolean;
  repairBtnLabel?: string;
  repairingLabel?: string;
}

export function PdfRepairWorkbench({
  workflow,
  isFr,
  repairBtnLabel,
  repairingLabel,
}: PdfRepairWorkbenchProps) {
  const { file, isProcessing, handleReset, handleRepair } = workflow;

  if (!file) return null;

  return (
    <motion.div
      key="staging-scene"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col max-w-4xl mx-auto"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file.name),
        }}
        onReset={handleReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        primaryAction={{
          label: repairBtnLabel ?? (isFr ? 'Réparer le document PDF' : 'Repair PDF document'),
          loadingLabel: repairingLabel ?? (isFr ? 'Réparation en cours...' : 'Repairing...'),
          onClick: handleRepair,
          isDisabled: isProcessing,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <PdfRepairDiagnostics
        isProcessing={isProcessing}
        isFr={isFr}
      />
    </motion.div>
  );
}
