import ImageConvertPage from '@/components/ImageConvertPage';
export default function JpgToAvif() {
  return <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/avif" slug="jpg-to-avif" />;
}
