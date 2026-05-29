import ImageConvertPage from '@/components/ImageConvertPage';
export default function JpgToWebp() {
  return <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/webp" slug="jpg-to-webp" />;
}
