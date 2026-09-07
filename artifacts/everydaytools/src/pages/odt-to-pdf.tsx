import DocumentConverter from './document-converter';
import ToolPageSEO from '@/components/ToolPageSEO';

export default function OdtToPdf() {
  return (
    <>
      <DocumentConverter />
      <ToolPageSEO internalSlug="odt-to-pdf" />
    </>
  );
}
