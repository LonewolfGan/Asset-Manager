import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function HeicToPdf() {
  return (
    <>
      <ToolPageSEO internalSlug="heic-to-pdf" />
      <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="application/pdf" slug="heic-to-pdf" />
    </>
  );
}
