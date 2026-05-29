import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function GifToPng() {
  return <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/png" slug="gif-to-png" trackUsed={trackToolUsed} trackError={trackToolError} />;
}
