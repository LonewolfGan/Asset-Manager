import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function AvifToJpg() {
  return (
    <>
      <ImageConvertPage fromLabel="AVIF" fromExts={['.avif']} fromMimes={['image/avif']} toMime="image/jpeg" slug="avif-to-jpg" />
      <ToolPageSEO internalSlug="avif-to-jpg" />
    </>
  );
}
