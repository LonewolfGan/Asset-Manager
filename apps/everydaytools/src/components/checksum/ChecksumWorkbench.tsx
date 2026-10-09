import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Copy, Download, ChevronDown, FileText, FileCode } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChecksumWorkflow } from '@/hooks/use-checksum-workflow';
import { trackToolUsed } from '@/lib/analytics';
import { HashAlgorithmPills } from '@workspace/ui/controls';
import { ChecksumIntegrityVerifier } from './ChecksumIntegrityVerifier';
import { ChecksumList } from './ChecksumList';

interface ChecksumWorkbenchProps {
  isFr: boolean;
  workflow: ChecksumWorkflow;
  copiedLabel: string;
}

export const ChecksumWorkbench: React.FC<ChecksumWorkbenchProps> = ({
  isFr,
  workflow,
  copiedLabel,
}) => {
  const {
    file,
    hashes,
    isProcessing,
    error,
    expectedHash,
    setExpectedHash,
    copiedAll,
    matchedAlgo,
    isInvalidMatch,
    handleReset,
    handleDownloadSha256,
    handleDownloadMd5,
    handleDownloadReport,
    handleCopyAll,
  } = workflow;

  const [selectedAlgoFilter, setSelectedAlgoFilter] = React.useState<string>('all');

  if (!file) return null;

  return (
    <motion.div
      key="scene-workbench"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className="w-full flex flex-col gap-6"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file.name),
        }}
        resetLabel={isFr ? 'Changer de fichier' : 'Change file'}
        onReset={handleReset}
        secondaryActions={
          <button
            type="button"
            data-testid="checksum-copy-all-btn"
            onClick={handleCopyAll}
            disabled={!hashes || isProcessing}
            className="h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {copiedAll ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Copy size={13} />
            )}
            <span className="hidden sm:inline">
              {copiedAll
                ? isFr
                  ? 'Copié !'
                  : 'Copied!'
                : isFr
                ? 'Copier tout'
                : 'Copy all'}
            </span>
          </button>
        }
        actionSlot={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-testid="checksum-export-btn"
                disabled={!hashes || isProcessing}
                className="h-9 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-semibold active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Download size={13} />
                <span>{isFr ? 'Exporter le rapport' : 'Export report'}</span>
                <ChevronDown size={13} className="opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-1">
              <DropdownMenuItem
                onClick={handleDownloadReport}
                className="flex items-center justify-between text-xs py-2 px-2.5 cursor-pointer font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isFr ? 'Rapport complet (.txt)' : 'Full report (.txt)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">TXT</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDownloadSha256}
                className="flex items-center justify-between text-xs py-2 px-2.5 cursor-pointer font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isFr ? 'Fichier .sha256 standard' : 'Standard .sha256 file'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">UNIX</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDownloadMd5}
                className="flex items-center justify-between text-xs py-2 px-2.5 cursor-pointer font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isFr ? 'Fichier .md5' : '.md5 file'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">MD5</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {error && (
        <div className="text-xs font-mono text-red-600 dark:text-red-400 py-2 border-b border-red-200 dark:border-red-900/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ChecksumIntegrityVerifier
        isFr={isFr}
        expectedHash={expectedHash}
        setExpectedHash={setExpectedHash}
        matchedAlgo={matchedAlgo}
        isInvalidMatch={isInvalidMatch}
      />

      <HashAlgorithmPills
        selectedAlgorithm={selectedAlgoFilter}
        onSelectAlgorithm={(algoId) =>
          setSelectedAlgoFilter(algoId === selectedAlgoFilter ? 'all' : algoId)
        }
        algorithms={[
          { id: 'all', name: isFr ? 'Tous les algorithmes' : 'All algorithms' },
          { id: 'sha-256', name: 'SHA-256', bits: 256, recommended: true },
          { id: 'sha-512', name: 'SHA-512', bits: 512, recommended: true },
          { id: 'sha-1', name: 'SHA-1', bits: 160, legacy: true },
          { id: 'md5', name: 'MD5', bits: 128, legacy: true },
          { id: 'crc32', name: 'CRC-32', bits: 32 },
        ]}
        label={isFr ? 'Filtrer par algorithme' : 'Filter by algorithm'}
        isFr={isFr}
      />

      <ChecksumList
        isFr={isFr}
        hashes={hashes}
        matchedAlgo={matchedAlgo}
        isProcessing={isProcessing}
        copiedLabel={copiedLabel}
        filterAlgo={selectedAlgoFilter}
        onTrackCopy={(algoId) => trackToolUsed('checksum', `copy-${algoId}`)}
      />
    </motion.div>
  );
};
