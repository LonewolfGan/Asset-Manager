import { useState, useReducer, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Download, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import JSZip from "jszip";
import Breadcrumb from "@/components/Breadcrumb";
import ToolPageSEO from "@/components/ToolPageSEO";
import { useLocale } from "@/hooks/use-locale";
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';

type FileState = {
  id: string;
  file: File;
  status: "idle" | "processing" | "done" | "error";
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  error?: string;
};

type Action =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; id: string }
  | { type: "CLEAR_ALL" }
  | { type: "SET_STATUS"; id: string; status: FileState["status"]; resultBlob?: Blob; resultUrl?: string; resultSize?: number; error?: string };

const reducer = (state: FileState[], action: Action): FileState[] => {
  switch (action.type) {
    case "ADD_FILES":
      return [...state, ...action.files.map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        status: "idle" as const,
      }))].slice(0, 20);
    case "REMOVE_FILE":
      return state.filter(f => f.id !== action.id);
    case "CLEAR_ALL":
      return [];
    case "SET_STATUS":
      return state.map(f => f.id === action.id ? { ...f, status: action.status, resultBlob: action.resultBlob, resultUrl: action.resultUrl, resultSize: action.resultSize, error: action.error } : f);
    default:
      return state;
  }
};

const formatToMime: Record<string, string> = {
  webp: "image/webp",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
};

const formatToExt: Record<string, string> = {
  webp: "webp",
  jpeg: "jpg",
  png: "png",
  avif: "avif",
};

export default function ImageConverter() {
  const { t } = useLocale();
  const tc = t.imageConverter;
  const [files, dispatch] = useReducer(reducer, []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(80);

  const isProcessing = files.some(f => f.status === "processing");
  const processedCount = files.filter(f => f.status === "done").length;

  const handleConvertAll = async () => {
    for (const item of files) {
      if (item.status === "done" || item.status === "processing") continue;

      dispatch({ type: "SET_STATUS", id: item.id, status: "processing" });
      try {
        const mime = formatToMime[format] ?? "image/webp";
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("format", mime);
        formData.append("quality", String(quality / 100));

        const res = await fetch(apiUrl("/api/convert/image"), {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({ error: "Conversion failed" }));
          throw new Error(json.error ?? "Conversion failed");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        dispatch({ type: "SET_STATUS", id: item.id, status: "done", resultBlob: blob, resultUrl: url, resultSize: blob.size });
      } catch (err: unknown) {
        trackToolError('image-converter', 'general-error');
        const msg = err instanceof Error ? err.message : "Conversion failed";
        dispatch({ type: "SET_STATUS", id: item.id, status: "error", error: msg });
      }
    }
  };

  const handleDownloadAll = async () => {
    trackToolUsed('image-converter', 'images');
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);
    if (doneFiles.length === 0) return;

    const ext = formatToExt[format] ?? format;

    if (doneFiles.length === 1) {
      const f = doneFiles[0];
      const url = URL.createObjectURL(f.resultBlob!);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.file.name.replace(/\.[^/.]+$/, "") + "." + ext;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const zip = new JSZip();
    for (const f of doneFiles) {
      const name = f.file.name.replace(/\.[^/.]+$/, "") + "." + ext;
      zip.file(name, f.resultBlob!);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_images.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 48, display: "flex", flexDirection: "column", gap: 24 }}>
        <Breadcrumb items={["Home", "Image Tools", "Image Converter"]} />
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-foreground">{t.tools['image-converter']?.title ?? 'Image Converter'}</h1>
          <p className="text-muted-foreground">{t.tools['image-converter']?.description ?? 'Convert images between formats. Batch support up to 20 files.'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>{tc.settings}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{tc.outputFormat}</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webp">WEBP</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="avif">AVIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(format === "jpeg" || format === "webp" || format === "avif") && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>{tc.quality}</Label>
                      <span className="font-mono text-sm">{quality}%</span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={(v) => setQuality(v[0])}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleConvertAll}
                  disabled={files.length === 0 || isProcessing || files.every(f => f.status === "done")}
                >
                  {isProcessing ? tc.converting : tc.convertAll}
                </Button>

                {processedCount > 0 && (
                  <Button variant="outline" className="w-full mt-2" onClick={handleDownloadAll}>
                    <Download className="w-4 h-4 mr-2" />
                    {processedCount > 1 ? tc.downloadAll : tc.download}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  dispatch({ type: "ADD_FILES", files: Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")) });
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => e.target.files && dispatch({ type: "ADD_FILES", files: Array.from(e.target.files) })}
                className="hidden"
                accept="image/*"
              />
              <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-base font-medium mb-1">{tc.addImages}</h3>
              <p className="text-xs text-muted-foreground">{tc.dragDrop}</p>
            </div>

            <div className="space-y-3">
              {files.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 border border-border rounded-md bg-card">
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] md:max-w-xs">{item.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(item.file.size / 1024).toFixed(1)} KB
                        {item.resultSize !== undefined && (
                          <span className={item.resultSize < item.file.size ? "text-primary font-medium ml-2" : "text-muted-foreground ml-2"}>
                            → {(item.resultSize / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </p>
                      {item.error && <p className="text-xs text-destructive mt-0.5">{item.error}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      {item.status === "processing" && <span className="text-xs font-mono text-muted-foreground animate-pulse">{tc.processing}</span>}
                      {item.status === "done" && <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />}
                      {item.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}

                      {item.status === "done" && item.resultBlob && (
                        <Button variant="ghost" size="icon" onClick={() => {
                          trackToolUsed('image-converter', 'images');
                          const ext = formatToExt[format] ?? format;
                          const url = URL.createObjectURL(item.resultBlob!);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = item.file.name.replace(/\.[^/.]+$/, "") + "." + ext;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => dispatch({ type: "REMOVE_FILE", id: item.id })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {files.length > 0 && (
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "CLEAR_ALL" })}>
                    {tc.clearAll}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToolPageSEO internalSlug="image-converter" />
    </>
  );
}
