import ImageConvertPage from '@/components/ImageConvertPage';
export default function GifToPng() {
  return <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/png" slug="gif-to-png" />;
}
