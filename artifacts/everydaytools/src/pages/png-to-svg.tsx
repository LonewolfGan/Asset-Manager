import ImageConvertPage from '@/components/ImageConvertPage';
export default function PngToSvg() {
  return <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/svg+xml" slug="png-to-svg" />;
}
