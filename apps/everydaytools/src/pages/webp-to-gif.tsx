import ImageConvertPage from '@/components/ImageConvertPage';
import { useLocale } from '@/hooks/use-locale';

export default function WebpToGif() {
  useLocale();
  return (
    <ImageConvertPage
      fromLabel="WebP"
      fromExts={['.webp']}
      fromMimes={['image/webp']}
      toMime="image/gif"
      slug="webp-to-gif"
    />
  );
}
