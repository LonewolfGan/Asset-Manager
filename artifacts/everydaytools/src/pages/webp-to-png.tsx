import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function WebpToPng() {
  return (
    <>
      <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/png" slug="webp-to-png" />
      <ToolPageSEO internalSlug="webp-to-png" />
    </>
  );
}
