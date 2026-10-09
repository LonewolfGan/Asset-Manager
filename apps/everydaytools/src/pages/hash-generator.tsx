import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useHashGeneratorWorkflow } from '@/hooks/use-hash-generator-workflow';
import {
  HashGeneratorHeader,
  HashGeneratorSourceArea,
  HashIntegrityCommandBar,
  HashResultsMatrix,
} from '@/components/hash-generator';

export default function HashGenerator() {
  const { t, isFr } = useLocale();
  const pageTitle =
    t.tools['hash-generator']?.title ??
    (isFr
      ? 'Générateur de Hash Cryptographique'
      : 'Cryptographic Hash Generator');
  const pageDesc =
    t.tools['hash-generator']?.description ??
    (isFr
      ? 'Calculez instantanément les empreintes SHA-256, SHA-512, SHA-384, SHA-1 et MD5 pour textes ou fichiers.'
      : 'Instantly compute SHA-256, SHA-512, SHA-384, SHA-1 and MD5 hashes for text or files.');

  const {
    inputMode,
    setInputMode,
    inputText,
    handleTextChange,
    history,
    handleUndo,
    fileInfo,
    setFileInfo,
    isDragOver,
    setIsDragOver,
    isUppercase,
    setIsUppercase,
    enableHmac,
    setEnableHmac,
    hmacSecret,
    setHmacSecret,
    compareHash,
    setCompareHash,
    compareResult,
    hashes,
    isCalculating,
    fileInputRef,
    textareaRef,
    textByteLength,
    hasData,
    manifestContent,
    handleClear,
    handleProcessFile,
    handleCopyAll,
    handleDownloadManifest,
    handleExportJson,
  } = useHashGeneratorWorkflow();

  return (
    <ToolPageLayout
      breadcrumb={[
        'Home',
        t.nav.breadcrumb?.textCode ?? (isFr ? 'Données & Code' : 'Data & Code'),
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="hash-generator"
    >
      <TooltipProvider>
        <div className="w-full">
          {/* Atelier Studio Cryptographique Pleine Largeur (w-full) */}
          <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
            {/* Chambre 1 : En-tête et saisie */}
            <div>
              <HashGeneratorHeader
                inputMode={inputMode}
                inputText={inputText}
                textByteLength={textByteLength}
                fileInfo={fileInfo}
                enableHmac={enableHmac}
                hmacSecret={hmacSecret}
                onSelectMode={setInputMode}
                onToggleHmac={() => setEnableHmac(!enableHmac)}
                onHmacSecretChange={setHmacSecret}
              />

              <HashGeneratorSourceArea
                inputMode={inputMode}
                inputText={inputText}
                fileInfo={fileInfo}
                isDragOver={isDragOver}
                textareaRef={textareaRef}
                fileInputRef={fileInputRef}
                onTextChange={handleTextChange}
                onProcessFile={handleProcessFile}
                onClearFile={() => setFileInfo(null)}
                setIsDragOver={setIsDragOver}
              />
            </div>

            {/* Chambre 2 : Pont d'intégrité & Barre de commande */}
            <HashIntegrityCommandBar
              compareHash={compareHash}
              compareResult={compareResult}
              isUppercase={isUppercase}
              inputMode={inputMode}
              historyLength={history.length}
              hasData={hasData}
              manifestContent={manifestContent}
              onCompareHashChange={setCompareHash}
              onClearCompareHash={() => setCompareHash('')}
              onToggleUppercase={setIsUppercase}
              onUndo={handleUndo}
              onClear={handleClear}
              onCopyAll={handleCopyAll}
              onDownloadManifest={handleDownloadManifest}
              onExportJson={handleExportJson}
            />

            {/* Chambre 3 : Matrice des empreintes */}
            <HashResultsMatrix
              hashes={hashes}
              isCalculating={isCalculating}
              isUppercase={isUppercase}
              enableHmac={enableHmac}
              inputMode={inputMode}
              compareResult={compareResult}
            />
          </div>
        </div>
      </TooltipProvider>
    </ToolPageLayout>
  );
}
