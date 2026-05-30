import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function PngToWebp() {
  return (
    <>
      <ToolPageSEO internalSlug="png-to-webp" />
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/webp" slug="png-to-webp" />
    </>
  );
}
