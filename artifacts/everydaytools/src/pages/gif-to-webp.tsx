import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function GifToWebp() {
  return (
    <>
      <ToolPageSEO internalSlug="gif-to-webp" />
      <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/webp" slug="gif-to-webp" />
    </>
  );
}
