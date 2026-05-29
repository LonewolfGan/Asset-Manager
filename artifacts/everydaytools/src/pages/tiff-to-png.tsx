import ImageConvertPage from '@/components/ImageConvertPage';
export default function TiffToPng() {
  return <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/png" slug="tiff-to-png" />;
}
