import ImageConvertPage from '@/components/ImageConvertPage';
export default function JpgToPdf() {
  return <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="application/pdf" slug="jpg-to-pdf" />;
}
