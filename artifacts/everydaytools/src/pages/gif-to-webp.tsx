import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function GifToWebp() {
  return <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/webp" slug="gif-to-webp" trackUsed={trackToolUsed} trackError={trackToolError} />;
}
