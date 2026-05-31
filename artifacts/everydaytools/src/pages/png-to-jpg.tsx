import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function PngToJpg() {
  return (
    <>
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/jpeg" slug="png-to-jpg" />
      <ToolPageSEO internalSlug="png-to-jpg" />
    </>
  );
}
