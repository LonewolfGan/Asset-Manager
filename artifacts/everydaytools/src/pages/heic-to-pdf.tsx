import ImageConvertPage from '@/components/ImageConvertPage';
export default function HeicToPdf() {
  return <ImageConvertPage fromLabel="HEIC/HEIF" fromExts={['.heic','.heif']} fromMimes={['image/heic','image/heif']} toMime="application/pdf" slug="heic-to-pdf" />;
}
