import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function JpgToPdf() {
  return (
    <>
      <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="application/pdf" slug="jpg-to-pdf" />
      <ToolPageSEO internalSlug="jpg-to-pdf" />
    </>
  );
}
