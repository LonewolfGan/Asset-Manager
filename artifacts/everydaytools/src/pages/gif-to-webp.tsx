import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function GifToWebp() {
  return (
    <>
      <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/webp" slug="gif-to-webp" />
      <ToolPageSEO internalSlug="gif-to-webp" />
    </>
  );
}
