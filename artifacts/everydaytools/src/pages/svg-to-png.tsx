import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function SvgToPng() {
  return (
    <>
      <ImageConvertPage fromLabel="SVG" fromExts={['.svg']} fromMimes={['image/svg+xml']} toMime="image/png" slug="svg-to-png" />
      <ToolPageSEO internalSlug="svg-to-png" />
    </>
  );
}
