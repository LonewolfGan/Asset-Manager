import ImageConvertPage from '@/components/ImageConvertPage';
export default function AvifToJpg() {
  return <ImageConvertPage fromLabel="AVIF" fromExts={['.avif']} fromMimes={['image/avif']} toMime="image/jpeg" slug="avif-to-jpg" />;
}
