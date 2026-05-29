import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function JpgToPng() {
  return <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/png" slug="jpg-to-png" />;
}
