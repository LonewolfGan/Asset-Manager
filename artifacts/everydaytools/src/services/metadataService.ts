import piexif from "piexifjs";
import { PDFDocument } from "pdf-lib";

export const getJpegMetadata = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataURL = e.target?.result as string;
        if (!dataURL.startsWith("data:image/jpeg")) {
          resolve(null);
          return;
        }
        const exifObj = piexif.load(dataURL);
        resolve(exifObj);
      } catch (err) {
        resolve(null);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const cleanJpegMetadata = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataURL = e.target?.result as string;
        const cleanedDataUrl = piexif.remove(dataURL);
        
        // Convert data URL back to Blob
        const byteString = atob(cleanedDataUrl.split(',')[1]);
        const mimeString = cleanedDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        resolve(new Blob([ab], { type: mimeString }));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const cleanPdfMetadata = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');
  
  return pdfDoc.save();
};
