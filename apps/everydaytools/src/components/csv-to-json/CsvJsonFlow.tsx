import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
} from '@/components/conversion';
import {
  DelimiterRadioGroup,
  DataPreviewTableLite,
  EncodingSelector,
} from '@workspace/ui/controls';
import type { CsvJsonWorkflow } from '@/hooks/use-csv-json-workflow';
import { CsvJsonPasteWorkspace } from './CsvJsonPasteWorkspace';
import { CsvJsonResultActions } from './CsvJsonResultActions';

interface CsvJsonFlowProps {
  workflow: CsvJsonWorkflow;
  isFr: boolean;
}

export function CsvJsonFlow({ workflow, isFr }: CsvJsonFlowProps) {
  const {
    inputMode,
    direction,
    rawText,
    setRawText,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    setPreviewOpen,
    file,
    sourceFormat,
    targetFormat,
    isStaged,
    stagedFile,
    delimiter,
    setDelimiter,
    encoding,
    setEncoding,
    previewData,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = workflow;

  return (
    <AnimatePresence mode="wait">
      {/* ─── SCENE 1A : DROPZONE UPLOAD ─── */}
      {inputMode === 'upload' && !file && !result && !isProcessing && (
        <ConversionDropzone
          sourceFormat={sourceFormat}
          title={
            isFr
              ? `Glissez-déposez votre fichier ${sourceFormat.name}`
              : `Drag & drop your ${sourceFormat.name} file`
          }
          description={
            isFr
              ? `ou cliquez pour parcourir vos dossiers et convertir en format ${targetFormat.name} (${targetFormat.extension}).`
              : `or click to browse your folders and convert to ${targetFormat.name} (${targetFormat.extension}).`
          }
          buttonLabel={
            isFr
              ? `Sélectionner un fichier ${sourceFormat.name}`
              : `Select a ${sourceFormat.name} file`
          }
          isDragging={isDragging}
          onFileSelected={validateAndSetFile}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {/* ─── SCENE 1B : CODE WORKSPACE POUR SAISIE DIRECTE ─── */}
      {inputMode === 'paste' && !isStaged && !result && !isProcessing && (
        <CsvJsonPasteWorkspace
          rawText={rawText}
          onTextChange={setRawText}
          onSubmit={() => {
            if (rawText.trim()) setIsPastedStaged(true);
          }}
          direction={direction}
          sourceFormat={sourceFormat}
          isFr={isFr}
        />
      )}

      {/* ─── SCENE 2 : STAGING DE CONVERSION ─── */}
      {isStaged && stagedFile && !result && !isProcessing && (
        <ConversionStaging
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          sourceFile={stagedFile}
          convertBtnLabel={
            isFr
              ? `Convertir en ${targetFormat.name}`
              : `Convert to ${targetFormat.name}`
          }
          changeFileBtnLabel={
            isFr ? 'Changer de données / fichier' : 'Change data / file'
          }
          optionsSlot={
            <div className="space-y-6 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DelimiterRadioGroup
                  value={delimiter}
                  onChange={setDelimiter}
                  label={isFr ? 'Délimiteur CSV' : 'CSV Delimiter'}
                  isFr={isFr}
                  allowCustom
                />
                <EncodingSelector
                  value={encoding}
                  onChange={setEncoding}
                  label={isFr ? 'Encodage du fichier' : 'File Encoding'}
                  isFr={isFr}
                />
              </div>

              {previewData && previewData.headers.length > 0 && (
                <DataPreviewTableLite
                  headers={previewData.headers}
                  rows={previewData.rows}
                  label={isFr ? 'Aperçu des données' : 'Data preview'}
                  isFr={isFr}
                  maxRows={4}
                />
              )}
            </div>
          }
          onConvert={handleConvert}
          onReset={handleReset}
        />
      )}

      {/* ─── SCENE 3 : CONDUIT DE CONVERSION ─── */}
      {isProcessing && (
        <ConversionConduit
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          fileName={
            inputMode === 'upload'
              ? file?.name
              : isFr
              ? 'donnees-sources'
              : 'source-data'
          }
          statusLabel={
            isFr
              ? `Transformation structurée ${sourceFormat.name} → ${targetFormat.name}...`
              : `Structured transformation ${sourceFormat.name} → ${targetFormat.name}...`
          }
        />
      )}

      {/* ─── SCENE 4 : RÉSULTAT DE CONVERSION ─── */}
      {result && !isProcessing && (
        <ConversionResult
          targetFormat={targetFormat}
          resultFileName={result.filename}
          resultFileSize={result.sizeAfter}
          downloadBtnLabel={
            isFr
              ? `Télécharger le fichier ${targetFormat.name} (.${targetFormat.extension})`
              : `Download ${targetFormat.name} file (.${targetFormat.extension})`
          }
          resetBtnLabel={isFr ? "Convertir d'autres données" : 'Convert more data'}
          onDownload={handleDownload}
          onReset={handleReset}
          extraActions={
            <CsvJsonResultActions
              onOpenPreview={() => setPreviewOpen(true)}
              textOutput={result.textOutput}
              targetFormatName={targetFormat.name}
              isFr={isFr}
            />
          }
        />
      )}
    </AnimatePresence>
  );
}
