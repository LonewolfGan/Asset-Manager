import ImageConvertPage from '@/components/ImageConvertPage';
export default function WebpToPdf() {
  return <ImageConvertPage fromLabel="WebP" fromExts={['.webp']} fromMimes={['image/webp']} toMime="application/pdf" slug="webp-to-pdf" />;
}
