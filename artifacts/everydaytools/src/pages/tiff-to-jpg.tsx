import ImageConvertPage from '@/components/ImageConvertPage';
export default function TiffToJpg() {
  return <ImageConvertPage fromLabel="TIFF" fromExts={['.tif','.tiff']} fromMimes={['image/tiff']} toMime="image/jpeg" slug="tiff-to-jpg" />;
}
