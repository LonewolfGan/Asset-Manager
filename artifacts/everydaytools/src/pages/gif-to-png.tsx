import ImageConvertPage from '@/components/ImageConvertPage';
import ToolPageSEO from '@/components/ToolPageSEO';
export default function GifToPng() {
  return (
    <>
      <ImageConvertPage fromLabel="GIF" fromExts={['.gif']} fromMimes={['image/gif']} toMime="image/png" slug="gif-to-png" />
      <ToolPageSEO internalSlug="gif-to-png" />
    </>
  );
}
