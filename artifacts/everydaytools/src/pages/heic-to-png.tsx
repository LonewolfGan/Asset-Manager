import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function HeicToPng() {
  return (
    <>
      <ToolPageSEO internalSlug="heic-to-png" />
      <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="image/png" slug="heic-to-png" />
    </>
  );
}
