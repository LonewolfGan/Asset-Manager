import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useBase64Workflow } from '@/hooks/use-base64-workflow';
import { Base64TopBar, Base64Workbench } from '@/components/base64';

export default function Base64Page() {
  const { t, isFr } = useLocale();
  const title =
    t.tools['base64']?.title ??
    (isFr ? 'Encodeur & Décodeur Base64 Studio' : 'Base64 Studio Encoder & Decoder');
  const desc =
    t.tools['base64']?.description ??
    (isFr
      ? 'Atelier d’encodage et de décodage Base64 UTF-8 haute fidélité pour textes, jetons JWT, Data URIs et fichiers binaires.'
      : 'High-fidelity UTF-8 Base64 encoding and decoding workbench for text, JWT tokens, Data URIs, and binary files.');

  const {
    mode,
    setMode,
    input,
    output,
    error,
    urlSafe,
    setUrlSafe,
    stripPadding,
    setStripPadding,
    dataUriPrefix,
    setDataUriPrefix,
    chunkSize,
    setChunkSize,
    wordWrap,
    setWordWrap,
    fileInfo,
    setFileInfo,
    isDragOver,
    setIsDragOver,
    outputTab,
    setOutputTab,
    history,
    fileInputRef,
    detectedBinary,
    inputBytes,
    outputBytes,
    handleInputChange,
    handleUndo,
    handleSwap,
    handleFileUpload,
    handleClear,
    handleDownload,
  } = useBase64Workflow({ isFr });

  return (
    <ToolPageLayout
      breadcrumb={[
        'Home',
        t.nav.breadcrumb?.textCode ?? (isFr ? 'Données & Code' : 'Data & Code'),
        title,
      ]}
      title={title}
      description={desc}
      seoSlug="base64"
    >
      <div className="w-full space-y-4">
        {/* BARRE D'ACTIONS SUPÉRIEURE (Architectural Flat Strip) */}
        <Base64TopBar
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            setFileInfo(null);
          }}
          onSwap={handleSwap}
          urlSafe={urlSafe}
          onUrlSafeChange={setUrlSafe}
          stripPadding={stripPadding}
          onStripPaddingChange={setStripPadding}
          dataUriPrefix={dataUriPrefix}
          onDataUriPrefixChange={setDataUriPrefix}
          chunkSize={chunkSize}
          onChunkSizeChange={setChunkSize}
          historyLength={history.length}
          onUndo={handleUndo}
          hasContent={Boolean(input || output)}
          onClear={handleClear}
          output={output}
          onDownload={handleDownload}
          detectedBinary={detectedBinary}
          isFr={isFr}
        />

        {/* L'ATELIER DOUBLE VOLET MONOLITHIQUE */}
        <Base64Workbench
          isDragOver={isDragOver}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file);
          }}
          sourceProps={{
            mode,
            input,
            inputBytes,
            wordWrap,
            onInputChange: handleInputChange,
            fileInfo,
            onRemoveFile: () => {
              setFileInfo(null);
              handleClear();
            },
            fileInputRef,
            onFileUpload: handleFileUpload,
            error,
            isFr,
          }}
          resultProps={{
            mode,
            output,
            outputBytes,
            wordWrap,
            onWordWrapToggle: setWordWrap,
            outputTab,
            onOutputTabChange: setOutputTab,
            detectedBinary,
            isFr,
          }}
          isFr={isFr}
        />
      </div>
    </ToolPageLayout>
  );
}
