import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function PngToSvg() {
  return <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/svg+xml" slug="png-to-svg" />;
}
