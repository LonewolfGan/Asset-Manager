import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function HeicToPdf() {
  return <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="application/pdf" slug="heic-to-pdf" trackUsed={trackToolUsed} trackError={trackToolError} />;
}
