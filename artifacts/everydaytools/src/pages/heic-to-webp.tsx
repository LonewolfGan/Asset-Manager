import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function HeicToWebp() {
  return (
    <>
      <ToolPageSEO internalSlug="heic-to-webp" />
      <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="image/webp" slug="heic-to-webp" />
    </>
  );
}
