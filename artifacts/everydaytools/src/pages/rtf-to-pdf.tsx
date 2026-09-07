import DocumentConverter from './document-converter';
import ToolPageSEO from '@/components/ToolPageSEO';

export default function RtfToPdf() {
  return (
    <>
      <DocumentConverter />
      <ToolPageSEO internalSlug="rtf-to-pdf" />
    </>
  );
}
