import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function WebpToAvif() {
  return (
    <>
      <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/avif" slug="webp-to-avif" />
      <ToolPageSEO internalSlug="webp-to-avif" />
    </>
  );
}
