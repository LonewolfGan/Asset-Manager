import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function BmpToWebp() {
  return (
    <>
      <ImageConvertPage fromLabel="BMP" fromExts={['.bmp']} fromMimes={['image/bmp']} toMime="image/webp" slug="bmp-to-webp" />
      <ToolPageSEO internalSlug="bmp-to-webp" />
    </>
  );
}
