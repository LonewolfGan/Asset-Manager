import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function SvgToPng() {
  return (
    <>
      <ToolPageSEO internalSlug="svg-to-png" />
      <ImageConvertPage fromLabel="SVG" fromExts={['.svg']} fromMimes={['image/svg+xml']} toMime="image/png" slug="svg-to-png" />
    </>
  );
}
