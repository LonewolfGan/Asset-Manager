import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function WebpToJpg() {
  return (
    <>
      <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/jpeg" slug="webp-to-jpg" />
      <ToolPageSEO internalSlug="webp-to-jpg" />
    </>
  );
}
