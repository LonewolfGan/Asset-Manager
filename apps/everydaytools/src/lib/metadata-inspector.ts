import exifr from 'exifr';
import { PDFDocument } from 'pdf-lib';

export type MetadataCategory = 'location' | 'camera' | 'author' | 'date' | 'technical';

export interface MetadataTag {
  key: string;
  label: string;
  value: string;
  category: MetadataCategory;
  isSensitive: boolean;
}

export interface InspectionResult {
  fileType: 'pdf' | 'image' | 'unknown';
  totalTags: number;
  sensitiveTagsCount: number;
  hasLocation: boolean;
  hasDevice: boolean;
  hasAuthor: boolean;
  pageCount?: number;
  tags: MetadataTag[];
  rawSummary: string[];
}

function formatCoordinate(val: number, isLat: boolean): string {
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : val >= 0 ? 'E' : 'W';
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${deg}°${min}'${sec}" ${dir} (${val.toFixed(5)}°)`;
}

function formatDate(val: unknown, isFr: boolean = true): string {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(val as string | number);
  if (isNaN(d.getTime())) return String(val);
  try {
    return new Intl.DateTimeFormat(isFr ? 'fr-FR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

async function inspectPdfMetadata(file: File, isFr: boolean): Promise<InspectionResult> {
  try {
    const buffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    const tags: MetadataTag[] = [];
    const add = (key: string, labelFr: string, labelEn: string, val: string | undefined, cat: MetadataCategory, sens: boolean) => {
      if (val) tags.push({ key, label: isFr ? labelFr : labelEn, value: val, category: cat, isSensitive: sens });
    };

    const title = doc.getTitle();
    const author = doc.getAuthor();
    const creator = doc.getCreator();
    const producer = doc.getProducer();
    const creationDate = doc.getCreationDate();
    const modDate = doc.getModificationDate();
    const pageCount = doc.getPageCount();

    add('Title', 'Titre du document', 'Document Title', title, 'author', true);
    add('Author', 'Auteur / Identité', 'Author / Identity', author, 'author', true);
    add('Subject', 'Sujet / Description', 'Subject / Description', doc.getSubject(), 'author', false);
    add('Keywords', 'Mots-clés', 'Keywords', doc.getKeywords(), 'author', false);
    add('Creator', 'Application de création', 'Creation Software', creator, 'camera', true);
    add('Producer', 'Moteur PDF / Producteur', 'PDF Engine / Producer', producer, 'camera', true);
    add('CreationDate', 'Date de création', 'Creation Date', creationDate ? formatDate(creationDate, isFr) : undefined, 'date', false);
    add('ModDate', 'Dernière modification', 'Modification Date', modDate ? formatDate(modDate, isFr) : undefined, 'date', false);
    if (pageCount) {
      add('PageCount', 'Nombre de pages', 'Page Count', `${pageCount} page${pageCount > 1 ? 's' : ''}`, 'technical', false);
    }

    return {
      fileType: 'pdf',
      totalTags: tags.length,
      sensitiveTagsCount: tags.filter((t) => t.isSensitive).length,
      hasLocation: false,
      hasDevice: Boolean(creator || producer),
      hasAuthor: Boolean(author || title),
      pageCount,
      tags,
      rawSummary: tags.map((t) => t.key),
    };
  } catch {
    return {
      fileType: 'pdf',
      totalTags: 0,
      sensitiveTagsCount: 0,
      hasLocation: false,
      hasDevice: false,
      hasAuthor: false,
      tags: [],
      rawSummary: [],
    };
  }
}

async function inspectImageMetadata(file: File, isFr: boolean): Promise<InspectionResult> {
  try {
    const rawData = await exifr.parse(file, {
      tiff: true, xmp: true, icc: true, jfif: true, iptc: true, gps: true,
    }).catch(() => null);

    const tags: MetadataTag[] = [];
    const add = (key: string, labelFr: string, labelEn: string, val: string | undefined, cat: MetadataCategory, sens: boolean) => {
      if (val !== undefined && val !== '') {
        tags.push({ key, label: isFr ? labelFr : labelEn, value: String(val).trim(), category: cat, isSensitive: sens });
      }
    };

    if (rawData) {
      // 1. Geolocation
      if (typeof rawData.latitude === 'number' && typeof rawData.longitude === 'number') {
        add('GPSPosition', 'Coordonnées GPS précises', 'Precise GPS Coordinates',
          `${formatCoordinate(rawData.latitude, true)}, ${formatCoordinate(rawData.longitude, false)}`, 'location', true);
      }
      if (rawData.GPSAltitude !== undefined) {
        add('GPSAltitude', 'Altitude GPS', 'GPS Altitude', `${Math.round(rawData.GPSAltitude)} m`, 'location', true);
      }

      // 2. Camera & Equipment
      add('Make', "Fabricant de l'appareil", 'Camera Make', rawData.Make, 'camera', true);
      add('Model', "Modèle de l'appareil", 'Camera Model', rawData.Model, 'camera', true);
      add('LensModel', 'Objectif optique', 'Lens Model', rawData.LensModel || rawData.Lens, 'camera', false);
      add('Software', 'Logiciel / Système de prise de vue', 'Software / Firmware', rawData.Software, 'camera', true);

      // 3. Author & Copyright
      add('Artist', 'Auteur / Artiste', 'Author / Artist', rawData.Artist || rawData.Author || rawData.creator, 'author', true);
      add('Copyright', 'Mentions de Copyright', 'Copyright Notice', rawData.Copyright, 'author', false);

      // 4. Dates
      if (rawData.DateTimeOriginal || rawData.CreateDate) {
        add('DateTimeOriginal', 'Date de prise de vue originale', 'Original Date Taken',
          formatDate(rawData.DateTimeOriginal || rawData.CreateDate, isFr), 'date', true);
      }
      if (rawData.ModifyDate) {
        add('ModifyDate', 'Date de modification', 'Modification Date', formatDate(rawData.ModifyDate, isFr), 'date', false);
      }

      // 5. Technical exposure
      if (rawData.ImageWidth && rawData.ImageHeight) {
        add('Dimensions', "Dimensions de l'image", 'Image Dimensions', `${rawData.ImageWidth} × ${rawData.ImageHeight} px`, 'technical', false);
      }
      if (rawData.ISO) add('ISO', 'Sensibilité ISO', 'ISO Speed Rating', `ISO ${rawData.ISO}`, 'technical', false);
      if (rawData.FNumber) add('FNumber', 'Ouverture focale', 'F-Number (Aperture)', `f/${rawData.FNumber}`, 'technical', false);
      if (rawData.ExposureTime) {
        const exp = typeof rawData.ExposureTime === 'number'
          ? (rawData.ExposureTime < 1 ? `1/${Math.round(1 / rawData.ExposureTime)} s` : `${rawData.ExposureTime} s`)
          : String(rawData.ExposureTime);
        add('ExposureTime', "Temps d'exposition", 'Exposure Time', exp, 'technical', false);
      }
      if (rawData.FocalLength) add('FocalLength', 'Longueur focale', 'Focal Length', `${rawData.FocalLength} mm`, 'technical', false);
      if (rawData.ColorSpace) {
        const cs = rawData.ColorSpace === 1 ? 'sRGB' : String(rawData.ColorSpace);
        add('ColorSpace', 'Espace colorimétrique', 'Color Space', cs, 'technical', false);
      }
    }

    return {
      fileType: 'image',
      totalTags: tags.length,
      sensitiveTagsCount: tags.filter((t) => t.isSensitive).length,
      hasLocation: tags.some((t) => t.category === 'location'),
      hasDevice: tags.some((t) => t.category === 'camera'),
      hasAuthor: tags.some((t) => t.category === 'author'),
      tags,
      rawSummary: tags.map((t) => t.label),
    };
  } catch {
    return {
      fileType: 'image',
      totalTags: 0,
      sensitiveTagsCount: 0,
      hasLocation: false,
      hasDevice: false,
      hasAuthor: false,
      tags: [],
      rawSummary: [],
    };
  }
}

export async function inspectFileMetadata(file: File, isFr: boolean = true): Promise<InspectionResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = ext === 'pdf' || file.type === 'application/pdf';

  if (isPdf) {
    return inspectPdfMetadata(file, isFr);
  }
  return inspectImageMetadata(file, isFr);
}
