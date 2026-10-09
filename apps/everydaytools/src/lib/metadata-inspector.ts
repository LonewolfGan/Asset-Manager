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

function formatDate(val: any, isFr: boolean = true): string {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(val);
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

export async function inspectFileMetadata(file: File, isFr: boolean = true): Promise<InspectionResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = ext === 'pdf' || file.type === 'application/pdf';

  if (isPdf) {
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const tags: MetadataTag[] = [];
      const title = doc.getTitle();
      const author = doc.getAuthor();
      const subject = doc.getSubject();
      const keywords = doc.getKeywords();
      const creator = doc.getCreator();
      const producer = doc.getProducer();
      const creationDate = doc.getCreationDate();
      const modDate = doc.getModificationDate();
      const pageCount = doc.getPageCount();

      if (title) {
        tags.push({ key: 'Title', label: isFr ? 'Titre du document' : 'Document Title', value: title, category: 'author', isSensitive: true });
      }
      if (author) {
        tags.push({ key: 'Author', label: isFr ? 'Auteur / Identité' : 'Author / Identity', value: author, category: 'author', isSensitive: true });
      }
      if (subject) {
        tags.push({ key: 'Subject', label: isFr ? 'Sujet / Description' : 'Subject / Description', value: subject, category: 'author', isSensitive: false });
      }
      if (keywords) {
        tags.push({ key: 'Keywords', label: isFr ? 'Mots-clés' : 'Keywords', value: keywords, category: 'author', isSensitive: false });
      }
      if (creator) {
        tags.push({ key: 'Creator', label: isFr ? 'Application de création' : 'Creation Software', value: creator, category: 'camera', isSensitive: true });
      }
      if (producer) {
        tags.push({ key: 'Producer', label: isFr ? 'Moteur PDF / Producteur' : 'PDF Engine / Producer', value: producer, category: 'camera', isSensitive: true });
      }
      if (creationDate) {
        tags.push({ key: 'CreationDate', label: isFr ? 'Date de création' : 'Creation Date', value: formatDate(creationDate, isFr), category: 'date', isSensitive: false });
      }
      if (modDate) {
        tags.push({ key: 'ModDate', label: isFr ? 'Dernière modification' : 'Modification Date', value: formatDate(modDate, isFr), category: 'date', isSensitive: false });
      }
      if (pageCount) {
        tags.push({ key: 'PageCount', label: isFr ? 'Nombre de pages' : 'Page Count', value: `${pageCount} page${pageCount > 1 ? 's' : ''}`, category: 'technical', isSensitive: false });
      }

      const hasAuthor = Boolean(author || title);
      const hasDevice = Boolean(creator || producer);
      const sensitiveTagsCount = tags.filter((t) => t.isSensitive).length;

      return {
        fileType: 'pdf',
        totalTags: tags.length,
        sensitiveTagsCount,
        hasLocation: false,
        hasDevice,
        hasAuthor,
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

  // Otherwise, inspect as image using exifr
  try {
    const rawData = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: true,
      jfif: true,
      iptc: true,
      gps: true,
    }).catch(() => null);

    const tags: MetadataTag[] = [];

    if (rawData) {
      // 1. Geolocation (Most sensitive)
      if (typeof rawData.latitude === 'number' && typeof rawData.longitude === 'number') {
        tags.push({
          key: 'GPSPosition',
          label: isFr ? 'Coordonnées GPS précises' : 'Precise GPS Coordinates',
          value: `${formatCoordinate(rawData.latitude, true)}, ${formatCoordinate(rawData.longitude, false)}`,
          category: 'location',
          isSensitive: true,
        });
      }
      if (rawData.GPSAltitude !== undefined) {
        tags.push({
          key: 'GPSAltitude',
          label: isFr ? 'Altitude GPS' : 'GPS Altitude',
          value: `${Math.round(rawData.GPSAltitude)} m`,
          category: 'location',
          isSensitive: true,
        });
      }

      // 2. Camera & Equipment
      if (rawData.Make) {
        tags.push({
          key: 'Make',
          label: isFr ? "Fabricant de l'appareil" : 'Camera Make',
          value: String(rawData.Make).trim(),
          category: 'camera',
          isSensitive: true,
        });
      }
      if (rawData.Model) {
        tags.push({
          key: 'Model',
          label: isFr ? "Modèle de l'appareil" : 'Camera Model',
          value: String(rawData.Model).trim(),
          category: 'camera',
          isSensitive: true,
        });
      }
      if (rawData.LensModel || rawData.Lens) {
        tags.push({
          key: 'LensModel',
          label: isFr ? 'Objectif optique' : 'Lens Model',
          value: String(rawData.LensModel || rawData.Lens).trim(),
          category: 'camera',
          isSensitive: false,
        });
      }
      if (rawData.Software) {
        tags.push({
          key: 'Software',
          label: isFr ? 'Logiciel / Système de prise de vue' : 'Software / Firmware',
          value: String(rawData.Software).trim(),
          category: 'camera',
          isSensitive: true,
        });
      }

      // 3. Author & Copyright
      if (rawData.Artist || rawData.Author || rawData.creator) {
        tags.push({
          key: 'Artist',
          label: isFr ? 'Auteur / Artiste' : 'Author / Artist',
          value: String(rawData.Artist || rawData.Author || rawData.creator).trim(),
          category: 'author',
          isSensitive: true,
        });
      }
      if (rawData.Copyright) {
        tags.push({
          key: 'Copyright',
          label: isFr ? 'Mentions de Copyright' : 'Copyright Notice',
          value: String(rawData.Copyright).trim(),
          category: 'author',
          isSensitive: false,
        });
      }

      // 4. Dates
      if (rawData.DateTimeOriginal || rawData.CreateDate) {
        tags.push({
          key: 'DateTimeOriginal',
          label: isFr ? 'Date de prise de vue originale' : 'Original Date Taken',
          value: formatDate(rawData.DateTimeOriginal || rawData.CreateDate, isFr),
          category: 'date',
          isSensitive: true,
        });
      }
      if (rawData.ModifyDate) {
        tags.push({
          key: 'ModifyDate',
          label: isFr ? 'Date de modification' : 'Modification Date',
          value: formatDate(rawData.ModifyDate, isFr),
          category: 'date',
          isSensitive: false,
        });
      }

      // 5. Technical exposure
      if (rawData.ImageWidth && rawData.ImageHeight) {
        tags.push({
          key: 'Dimensions',
          label: isFr ? "Dimensions de l'image" : 'Image Dimensions',
          value: `${rawData.ImageWidth} × ${rawData.ImageHeight} px`,
          category: 'technical',
          isSensitive: false,
        });
      }
      if (rawData.ISO) {
        tags.push({
          key: 'ISO',
          label: isFr ? 'Sensibilité ISO' : 'ISO Speed Rating',
          value: `ISO ${rawData.ISO}`,
          category: 'technical',
          isSensitive: false,
        });
      }
      if (rawData.FNumber) {
        tags.push({
          key: 'FNumber',
          label: isFr ? 'Ouverture focale' : 'F-Number (Aperture)',
          value: `f/${rawData.FNumber}`,
          category: 'technical',
          isSensitive: false,
        });
      }
      if (rawData.ExposureTime) {
        const exp = typeof rawData.ExposureTime === 'number'
          ? (rawData.ExposureTime < 1 ? `1/${Math.round(1 / rawData.ExposureTime)} s` : `${rawData.ExposureTime} s`)
          : String(rawData.ExposureTime);
        tags.push({
          key: 'ExposureTime',
          label: isFr ? "Temps d'exposition" : 'Exposure Time',
          value: exp,
          category: 'technical',
          isSensitive: false,
        });
      }
      if (rawData.FocalLength) {
        tags.push({
          key: 'FocalLength',
          label: isFr ? 'Longueur focale' : 'Focal Length',
          value: `${rawData.FocalLength} mm`,
          category: 'technical',
          isSensitive: false,
        });
      }
      if (rawData.ColorSpace) {
        const cs = rawData.ColorSpace === 1 ? 'sRGB' : String(rawData.ColorSpace);
        tags.push({
          key: 'ColorSpace',
          label: isFr ? 'Espace colorimétrique' : 'Color Space',
          value: cs,
          category: 'technical',
          isSensitive: false,
        });
      }
    }

    const hasLocation = tags.some((t) => t.category === 'location');
    const hasDevice = tags.some((t) => t.category === 'camera');
    const hasAuthor = tags.some((t) => t.category === 'author');
    const sensitiveTagsCount = tags.filter((t) => t.isSensitive).length;

    return {
      fileType: 'image',
      totalTags: tags.length,
      sensitiveTagsCount,
      hasLocation,
      hasDevice,
      hasAuthor,
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
