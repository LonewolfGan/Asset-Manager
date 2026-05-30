import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function JpgToWebp() {
  return (
    <>
      <ToolPageSEO internalSlug="jpg-to-webp" />
      <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/webp" slug="jpg-to-webp" />
    </>
  );
}
