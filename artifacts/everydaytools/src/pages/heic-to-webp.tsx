import ImageConvertPage from '@/components/ImageConvertPage';
export default function HeicToWebp() {
  return <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="image/webp" slug="heic-to-webp" />;
}
