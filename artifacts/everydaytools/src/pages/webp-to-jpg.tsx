import ImageConvertPage from '@/components/ImageConvertPage';
export default function WebpToJpg() {
  return <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/jpeg" slug="webp-to-jpg" />;
}
