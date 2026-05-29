import ImageConvertPage from '@/components/ImageConvertPage';
export default function PngToWebp() {
  return <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/webp" slug="png-to-webp" />;
}
