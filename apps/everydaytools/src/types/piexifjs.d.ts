declare module 'piexifjs' {
  const piexif: {
    load(data: string): Record<string, unknown>;
    dump(exifObj: Record<string, unknown>): string;
    insert(exifStr: string, jpegData: string): string;
    remove(jpegData: string): string;
    ExifIFD: Record<string, number>;
    GPSIFD: Record<string, number>;
    ImageIFD: Record<string, number>;
    InteropIFD: Record<string, number>;
    Thumbnail: Record<string, number>;
  };
  export default piexif;
}
