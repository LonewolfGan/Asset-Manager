import ImageConvertPage from '@/components/ImageConvertPage';
export default function GifToWebp() {
  return <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/webp" slug="gif-to-webp" />;
}
