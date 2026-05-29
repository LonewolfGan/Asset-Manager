import ImageConvertPage from '@/components/ImageConvertPage';
export default function PngToAvif() {
  return <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/avif" slug="png-to-avif" />;
}
