import ImageConvertPage from '@/components/ImageConvertPage';
export default function TiffToWebp() {
  return <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/webp" slug="tiff-to-webp" />;
}
