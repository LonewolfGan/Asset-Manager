import ImageConvertPage from '@/components/ImageConvertPage';
export default function SvgToPng() {
  return <ImageConvertPage fromLabel="SVG" fromExts={['.svg']} fromMimes={['image/svg+xml']} toMime="image/png" slug="svg-to-png" />;
}
