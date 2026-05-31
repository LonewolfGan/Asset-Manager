import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function TiffToJpg() {
  return (
    <>
      <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/jpeg" slug="tiff-to-jpg" />
      <ToolPageSEO internalSlug="tiff-to-jpg" />
    </>
  );
}
