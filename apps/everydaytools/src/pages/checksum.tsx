import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { ConversionDropzone } from '@/components/conversion';
import { useChecksumWorkflow } from '@/hooks/use-checksum-workflow';
import { getSourceDropzoneFormat } from '@/lib/checksum-logic';
import { ChecksumWorkbench } from '@/components/checksum';

export default function Checksum() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const workflow = useChecksumWorkflow(isFr);
  const {
    file,
    isDragging,
    handleFileSelected,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = workflow;

  const title =
    t.tools['checksum']?.title ??
    (isFr ? 'Somme de contrôle de fichier' : 'File Checksum');
  const desc =
    t.tools['checksum']?.description ??
    (isFr
      ? 'Calculez instantanément les sommes de contrôle SHA-256, SHA-512, MD5, SHA-1 et vérifiez l’intégrité de vos fichiers en local.'
      : 'Instantly compute SHA-256, SHA-512, MD5, SHA-1 checksums and verify file integrity locally.');

  const sourceDropzoneFormat = useMemo(
    () => getSourceDropzoneFormat(isFr),
    [isFr]
  );

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.privacy, title]}
      title={title}
      description={desc}
      seoSlug="checksum"
    >
      <ToolWorkspace noGrid={true}>
        <AnimatePresence mode="wait">
          {!file && (
            <div key="scene-dropzone" className="w-full max-w-5xl mx-auto">
              <ConversionDropzone
                sourceFormat={sourceDropzoneFormat}
                title={
                  isFr
                    ? 'Déposez un fichier pour calculer ses empreintes'
                    : 'Drop a file to compute checksums'
                }
                description={
                  isFr
                    ? 'Calculez instantanément SHA-256, SHA-512, MD5, SHA-1 et vérifiez son authenticité 100% en local.'
                    : 'Compute SHA-256, SHA-512, MD5, SHA-1 digests and verify file authenticity 100% locally.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                accept="*/*"
                multiple={false}
                isDragging={isDragging}
                onFileSelected={handleFileSelected}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            </div>
          )}

          {file && (
            <ChecksumWorkbench
              isFr={isFr}
              workflow={workflow}
              copiedLabel={t.common.copied}
            />
          )}
        </AnimatePresence>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
