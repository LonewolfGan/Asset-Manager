import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function TiffToWebp() {
  return (
    <>
      <ToolPageSEO internalSlug="tiff-to-webp" />
      <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/webp" slug="tiff-to-webp" />
    </>
  );
}
