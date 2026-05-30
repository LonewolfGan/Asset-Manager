import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToAvif() {
  return (
    <>
      <ToolPageSEO internalSlug="png-to-avif" />
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/avif" slug="png-to-avif" />
    </>
  );
}
