import ImageConvertPage from '@/components/ImageConvertPage';
export default function BmpToWebp() {
  return <ImageConvertPage fromLabel="BMP" fromExts={['.bmp']} fromMimes={['image/bmp']} toMime="image/webp" slug="bmp-to-webp" />;
}
