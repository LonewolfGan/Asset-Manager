import ImageConvertPage from '@/components/ImageConvertPage';
export default function AvifToPng() {
  return <ImageConvertPage fromLabel="AVIF" fromExts={['.avif']} fromMimes={['image/avif']} toMime="image/png" slug="avif-to-png" />;
}
