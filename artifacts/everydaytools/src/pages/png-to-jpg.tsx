import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToJpg() {
  return (
    <>
      <ToolPageSEO internalSlug="png-to-jpg" />
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/jpeg" slug="png-to-jpg" />
    </>
  );
}
