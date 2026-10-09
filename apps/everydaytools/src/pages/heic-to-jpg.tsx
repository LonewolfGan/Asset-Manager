import ImageConvertPage from "@/components/ImageConvertPage";

export default function HeicToJpg() {
  return (
    <ImageConvertPage
        fromLabel="HEIC/HEIF"
        fromExts={[".heic", ".heif"]}
        fromMimes={["image/heic", "image/heif"]}
        toMime="image/jpeg"
        slug="heic-to-jpg"
      />
  );
}
