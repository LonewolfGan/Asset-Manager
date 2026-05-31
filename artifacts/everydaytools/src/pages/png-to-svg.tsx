import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToSvg() {
  return (
    <>
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/svg+xml" slug="png-to-svg" />
      <ToolPageSEO internalSlug="png-to-svg" />
    </>
  );
}
