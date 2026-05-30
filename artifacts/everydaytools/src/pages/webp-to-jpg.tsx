import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function WebpToJpg() {
  return (
    <>
      <ToolPageSEO internalSlug="webp-to-jpg" />
      <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/jpeg" slug="webp-to-jpg" />
    </>
  );
}
