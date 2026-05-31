import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToAvif() {
  return (
    <>
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/avif" slug="png-to-avif" />
      <ToolPageSEO internalSlug="png-to-avif" />
    </>
  );
}
