import ImageConvertPage from '@/components/ImageConvertPage';
export default function BmpToJpg() {
  return <ImageConvertPage fromLabel="BMP" fromExts={['.bmp']} fromMimes={['image/bmp']} toMime="image/jpeg" slug="bmp-to-jpg" />;
}
