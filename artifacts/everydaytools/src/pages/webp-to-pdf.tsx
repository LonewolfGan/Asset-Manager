import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function WebpToPdf() {
  return (
    <>
      <ToolPageSEO internalSlug="webp-to-pdf" />
      <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="application/pdf" slug="webp-to-pdf" />
    </>
  );
}
