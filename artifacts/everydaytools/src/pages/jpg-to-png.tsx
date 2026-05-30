import { Helmet } from 'react-helmet-async';
import ImageConvertPage from '@/components/ImageConvertPage';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
export default function JpgToPng() {
  return (
    <>
      <Helmet>
        <title>JPG to PNG Converter — Free, Online | EverydayTools Hub</title>
        <meta name="description" content="Convert JPG/JPEG images to PNG format for free, instantly in your browser. No upload, no signup — fully private client-side conversion." />
      </Helmet>
      <ImageConvertPage fromLabel="JPG/JPEG" fromExts={['.jpg','.jpeg']} fromMimes={['image/jpeg']} toMime="image/png" slug="jpg-to-png" />
    </>
  );
}
