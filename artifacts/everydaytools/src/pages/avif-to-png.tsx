import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function AvifToPng() {
  return (
    <>
      <ToolPageSEO internalSlug="avif-to-png" />
      <ImageConvertPage fromLabel="AVIF" fromExts={['.avif']} fromMimes={['image/avif']} toMime="image/png" slug="avif-to-png" />
    </>
  );
}
