import ImageConvertPage from '@/components/ImageConvertPage';
export default function JpgToPng() {
  return <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/png" slug="jpg-to-png" />;
}
