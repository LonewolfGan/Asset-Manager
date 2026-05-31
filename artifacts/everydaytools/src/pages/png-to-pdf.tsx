import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToPdf() {
  return (
    <>
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="application/pdf" slug="png-to-pdf" />
      <ToolPageSEO internalSlug="png-to-pdf" />
    </>
  );
}
