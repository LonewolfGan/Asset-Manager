import ImageConvertPage from '@/components/ImageConvertPage';
export default function WebpToAvif() {
  return <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/avif" slug="webp-to-avif" />;
}
