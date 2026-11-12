import type { BlogPost } from "../blog-types";
import { postAiTextScrubber } from "../blog-posts/ai-text-scrubber";
import { postBarcodeGenerator } from "../blog-posts/barcode-generator";
import { postBase64 } from "../blog-posts/base64";
import { postChecksum } from "../blog-posts/checksum";
import { postColorConverter } from "../blog-posts/color-converter";
import { postCssFormatter } from "../blog-posts/css-formatter";
import { postCurrencyConverter } from "../blog-posts/currency-converter";
import { postDiffChecker } from "../blog-posts/diff-checker";
import { postHashGenerator } from "../blog-posts/hash-generator";
import { postHtmlFormatter } from "../blog-posts/html-formatter";
import { postJsFormatter } from "../blog-posts/js-formatter";
import { postJsonDiff } from "../blog-posts/json-diff";
import { postJsonFormatter } from "../blog-posts/json-formatter";
import { postJwtDecoder } from "../blog-posts/jwt-decoder";
import { postLoremIpsum } from "../blog-posts/lorem-ipsum";
import { postMarkdownPreview } from "../blog-posts/markdown-preview";
import { postMetadataCleaner } from "../blog-posts/metadata-cleaner";
import { postPasswordGenerator } from "../blog-posts/password-generator";
import { postQrCodeGenerator } from "../blog-posts/qr-code-generator";
import { postRegexTester } from "../blog-posts/regex-tester";
import { postSpeedTest } from "../blog-posts/speed-test";
import { postUnitConverter } from "../blog-posts/unit-converter";
import { postUrlEncoder } from "../blog-posts/url-encoder";
import { postUuidGenerator } from "../blog-posts/uuid-generator";
import { postWordCounter } from "../blog-posts/word-counter";

export const securityPosts: BlogPost[] = [
  postAiTextScrubber,
  postBarcodeGenerator,
  postBase64,
  postChecksum,
  postColorConverter,
  postCssFormatter,
  postCurrencyConverter,
  postDiffChecker,
  postHashGenerator,
  postHtmlFormatter,
  postJsFormatter,
  postJsonDiff,
  postJsonFormatter,
  postJwtDecoder,
  postLoremIpsum,
  postMarkdownPreview,
  postMetadataCleaner,
  postPasswordGenerator,
  postQrCodeGenerator,
  postRegexTester,
  postSpeedTest,
  postUnitConverter,
  postUrlEncoder,
  postUuidGenerator,
  postWordCounter,
];
