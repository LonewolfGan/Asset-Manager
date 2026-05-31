import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function JpgToWebp() {
  return (
    <>
      <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/webp" slug="jpg-to-webp" />
      <ToolPageSEO internalSlug="jpg-to-webp" />
    </>
  );
}
