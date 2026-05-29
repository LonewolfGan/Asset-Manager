import ImageConvertPage from '@/components/ImageConvertPage';
export default function WebpToPng() {
  return <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="image/png" slug="webp-to-png" />;
}
