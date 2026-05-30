import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function TiffToPng() {
  return (
    <>
      <ToolPageSEO internalSlug="tiff-to-png" />
      <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/png" slug="tiff-to-png" />
    </>
  );
}
