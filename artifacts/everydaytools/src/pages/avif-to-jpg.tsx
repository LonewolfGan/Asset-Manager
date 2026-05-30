import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function AvifToJpg() {
  return (
    <>
      <ToolPageSEO internalSlug="avif-to-jpg" />
      <ImageConvertPage fromLabel="AVIF" fromExts={['.avif']} fromMimes={['image/avif']} toMime="image/jpeg" slug="avif-to-jpg" />
    </>
  );
}
