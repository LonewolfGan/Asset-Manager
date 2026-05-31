import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function JpgToAvif() {
  return (
    <>
      <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/avif" slug="jpg-to-avif" />
      <ToolPageSEO internalSlug="jpg-to-avif" />
    </>
  );
}
