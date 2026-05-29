import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function SvgToPng() {
  return <ImageConvertPage fromLabel="SVG" fromExts={['.svg']} fromMimes={['image/svg+xml']} toMime="image/png" slug="svg-to-png" />;
}
