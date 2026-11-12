import type { BlogPost } from "../blog-types";
import { postAvifToJpg } from "../blog-posts/avif-to-jpg";
import { postAvifToPng } from "../blog-posts/avif-to-png";
import { postBackgroundRemover } from "../blog-posts/background-remover";
import { postBmpToJpg } from "../blog-posts/bmp-to-jpg";
import { postBmpToWebp } from "../blog-posts/bmp-to-webp";
import { postColorPalette } from "../blog-posts/color-palette";
import { postFaviconGenerator } from "../blog-posts/favicon-generator";
import { postFlipRotateImage } from "../blog-posts/flip-rotate-image";
import { postGifToPng } from "../blog-posts/gif-to-png";
import { postGifToWebp } from "../blog-posts/gif-to-webp";
import { postHeicToJpg } from "../blog-posts/heic-to-jpg";
import { postHeicToPdf } from "../blog-posts/heic-to-pdf";
import { postHeicToPng } from "../blog-posts/heic-to-png";
import { postHeicToWebp } from "../blog-posts/heic-to-webp";
import { postImageCompress } from "../blog-posts/image-compress";
import { postImageCrop } from "../blog-posts/image-crop";
import { postImageFilters } from "../blog-posts/image-filters";
import { postImageResize } from "../blog-posts/image-resize";
import { postImageToPdf } from "../blog-posts/image-to-pdf";
import { postImageUpscale } from "../blog-posts/image-upscale";
import { postImagesConvert } from "../blog-posts/images-convert";
import { postJpgToAvif } from "../blog-posts/jpg-to-avif";
import { postJpgToPdf } from "../blog-posts/jpg-to-pdf";
import { postJpgToPng } from "../blog-posts/jpg-to-png";
import { postJpgToWebp } from "../blog-posts/jpg-to-webp";
import { postPngToAvif } from "../blog-posts/png-to-avif";
import { postPngToGif } from "../blog-posts/png-to-gif";
import { postPngToJpg } from "../blog-posts/png-to-jpg";
import { postPngToPdf } from "../blog-posts/png-to-pdf";
import { postPngToSvg } from "../blog-posts/png-to-svg";
import { postPngToWebp } from "../blog-posts/png-to-webp";
import { postSvgToPng } from "../blog-posts/svg-to-png";
import { postTiffToJpg } from "../blog-posts/tiff-to-jpg";
import { postTiffToPng } from "../blog-posts/tiff-to-png";
import { postTiffToWebp } from "../blog-posts/tiff-to-webp";
import { postWatermarkImage } from "../blog-posts/watermark-image";
import { postWebpToAvif } from "../blog-posts/webp-to-avif";
import { postWebpToGif } from "../blog-posts/webp-to-gif";
import { postWebpToJpg } from "../blog-posts/webp-to-jpg";
import { postWebpToPdf } from "../blog-posts/webp-to-pdf";
import { postWebpToPng } from "../blog-posts/webp-to-png";
import { postWebpVsJpegVsPng } from "../blog-posts/webp-vs-jpeg-vs-png";

export const imagePosts: BlogPost[] = [
  postAvifToJpg,
  postAvifToPng,
  postBackgroundRemover,
  postBmpToJpg,
  postBmpToWebp,
  postColorPalette,
  postFaviconGenerator,
  postFlipRotateImage,
  postGifToPng,
  postGifToWebp,
  postHeicToJpg,
  postHeicToPdf,
  postHeicToPng,
  postHeicToWebp,
  postImageCompress,
  postImageCrop,
  postImageFilters,
  postImageResize,
  postImageToPdf,
  postImageUpscale,
  postImagesConvert,
  postJpgToAvif,
  postJpgToPdf,
  postJpgToPng,
  postJpgToWebp,
  postPngToAvif,
  postPngToGif,
  postPngToJpg,
  postPngToPdf,
  postPngToSvg,
  postPngToWebp,
  postSvgToPng,
  postTiffToJpg,
  postTiffToPng,
  postTiffToWebp,
  postWatermarkImage,
  postWebpToAvif,
  postWebpToGif,
  postWebpToJpg,
  postWebpToPdf,
  postWebpToPng,
  postWebpVsJpegVsPng,
];
