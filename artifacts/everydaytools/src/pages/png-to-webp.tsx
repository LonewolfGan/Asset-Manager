import { Helmet } from 'react-helmet-async';
import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function PngToWebp() {
  return (
    <>
      <Helmet>
        <title>PNG to WebP Converter — Free, Online | EverydayTools Hub</title>
        <meta name="description" content="Convert PNG images to WebP format for free, instantly in your browser. No upload, no signup — fully private client-side conversion." />
      </Helmet>
      <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="image/webp" slug="png-to-webp" />
    </>
  );
}
