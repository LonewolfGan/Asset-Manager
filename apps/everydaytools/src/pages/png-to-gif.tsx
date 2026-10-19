import ImageConvertPage from '@/components/ImageConvertPage';
import { useLocale } from '@/hooks/use-locale';

export default function PngToGif() {
  useLocale();
  return (
    <ImageConvertPage
      fromLabel="PNG"
      fromExts={['.png']}
      fromMimes={['image/png']}
      toMime="image/gif"
      slug="png-to-gif"
    />
  );
}
