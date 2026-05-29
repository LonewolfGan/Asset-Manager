import ImageConvertPage from '@/components/ImageConvertPage';
export default function HeicToPng() {
  return <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="image/png" slug="heic-to-png" />;
}
