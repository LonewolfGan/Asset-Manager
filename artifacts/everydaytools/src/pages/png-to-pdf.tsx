import ImageConvertPage from '@/components/ImageConvertPage';
export default function PngToPdf() {
  return <ImageConvertPage fromLabel="PNG" fromExts={['.png']} fromMimes={['image/png']} toMime="application/pdf" slug="png-to-pdf" />;
}
