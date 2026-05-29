import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function HeicToWebp() {
  return <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="image/webp" slug="heic-to-webp" trackUsed={trackToolUsed} trackError={trackToolError} />;
}
