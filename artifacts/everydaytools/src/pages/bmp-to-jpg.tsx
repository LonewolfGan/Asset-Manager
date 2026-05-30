import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function BmpToJpg() {
  return (
    <>
      <ToolPageSEO internalSlug="bmp-to-jpg" />
      <ImageConvertPage fromLabel="BMP" fromExts={['.bmp']} fromMimes={['image/bmp']} toMime="image/jpeg" slug="bmp-to-jpg" />
    </>
  );
}
