import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function TiffToJpg() {
  return <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/jpeg" slug="tiff-to-jpg" />;
}
