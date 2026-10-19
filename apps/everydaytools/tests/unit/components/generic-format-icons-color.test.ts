import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LocaleProvider } from '@/contexts/locale-context';
import { ConversionDropzone } from '@/components/conversion/ConversionDropzone';
import { getSourceDropzoneFormat as getMetadataCleanerFormat } from '@/lib/metadata-cleaner-logic';
import { getSourceDropzoneFormat as getChecksumFormat } from '@/lib/checksum-logic';
import { IMAGE_FORMAT } from '@/lib/background-remover-logic';

describe('Generic format icons color preservation (image.svg & file.svg)', () => {
  it('ensures format definitions for generic file and image use signature orange #FF6B35', () => {
    expect(['#FF6B35', 'var(--accent, #f97316)']).toContain(IMAGE_FORMAT.color);
    expect(IMAGE_FORMAT.icon).toBe('/icons/image.svg');

    const checksumFormat = getChecksumFormat(true);
    expect(['#FF6B35', 'var(--accent, #f97316)']).toContain(checksumFormat.color);
    expect(checksumFormat.icon).toBe('/icons/file.svg');

    const metadataCleanerFormat = getMetadataCleanerFormat(true);
    expect(['#FF6B35', 'var(--accent, #f97316)']).toContain(metadataCleanerFormat.color);
    expect(metadataCleanerFormat.icon).toBe('/icons/file.svg');
  });

  it('ensures ConversionDropzone preserves natural icon color without destructive dark:brightness-0 dark:invert filters', () => {
    const dummyHandlers = {
      isDragging: false,
      onDragOver: () => {},
      onDragLeave: () => {},
      onDrop: () => {},
    };

    const htmlImage = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(ConversionDropzone, {
          sourceFormat: IMAGE_FORMAT,
          title: 'Déposez votre image',
          description: 'PNG, JPG, WebP',
          buttonLabel: 'Sélectionner une image',
          onFileSelected: () => {},
          ...dummyHandlers,
        })
      )
    );

    expect(htmlImage).not.toContain('dark:brightness-0');
    expect(htmlImage).not.toContain('dark:invert');

    const htmlFile = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(ConversionDropzone, {
          sourceFormat: getChecksumFormat(true),
          title: 'Déposez votre fichier',
          description: 'Tout type de fichier',
          buttonLabel: 'Sélectionner un fichier',
          onFileSelected: () => {},
          ...dummyHandlers,
        })
      )
    );

    expect(htmlFile).not.toContain('dark:brightness-0');
    expect(htmlFile).not.toContain('dark:invert');
  });
});

