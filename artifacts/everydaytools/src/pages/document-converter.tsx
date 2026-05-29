import { useState, useRef } from "react";
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { convertPdfToText, convertDocxToText, convertTextToPdf, unsupportedConversionError } from "@/services/documentConversionService";
import { FileUp, FileText, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Breadcrumb from "@/components/Breadcrumb";
import ToolPageSEO from "@/components/ToolPageSEO";
import { useLocale } from "@/hooks/use-locale";

export default function DocumentConverter() {
  const { t } = useLocale();
  const tc = t.documentConverter;
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [resultText, setResultText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setStatus("idle");
    setResultText("");
    setErrorMsg("");
    setProgress(0);
  };

  const processFile = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);

    try {
      if (file.type === "application/pdf") {
        const text = await convertPdfToText(file, setProgress);
        setResultText(text);
        setStatus("done");
      } else if (file.name.endsWith(".docx")) {
        const text = await convertDocxToText(file, setProgress);
        setResultText(text);
        setStatus("done");
      } else if (file.type === "text/plain") {
        const text = await file.text();
        const pdfBytes = await convertTextToPdf(text, setProgress);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name.replace(".txt", ".pdf");
        a.click();
        setStatus("done");
        trackToolUsed('document-converter', 'documents');
        setResultText(tc.pdfSuccess);
      } else {
        throw new Error(unsupportedConversionError(file.type || "unknown"));
      }
    } catch (error: any) {
      trackToolError('document-converter', 'general-error');
      setStatus("error");
      setErrorMsg(error.message || "An error occurred during conversion.");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <Breadcrumb items={["Home", "Tools", "Document Converter"]} />
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-foreground">{t.tools['document-converter']?.title ?? 'Document Converter'}</h1>
          <p className="text-muted-foreground">{t.tools['document-converter']?.description ?? 'Convert PDFs, DOCX, and TXT files directly in your browser. All processing is local.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{tc.inputFile}</CardTitle>
              <CardDescription>{tc.selectDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                />
                <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">{tc.dragDrop}</h3>
                <p className="text-sm text-muted-foreground">{tc.clickBrowse}</p>
              </div>

              {file && (
                <div className="flex items-center gap-4 p-4 border border-border rounded-md bg-muted/20">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!file || status === "processing"}
                onClick={processFile}
              >
                {status === "processing" ? tc.processingBtn : tc.convertBtn}
              </Button>

              {status === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{tc.converting}</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {status === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{tc.conversionFailed}</AlertTitle>
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="border-border flex flex-col">
            <CardHeader>
              <CardTitle>{tc.output}</CardTitle>
              <CardDescription>{tc.outputDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-[300px]">
              {status === "done" && resultText && file?.type !== "text/plain" ? (
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex-1 border border-border rounded-md p-4 bg-muted/10 overflow-y-auto whitespace-pre-wrap font-sans text-sm h-[300px]">
                    {resultText}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                    const blob = new Blob([resultText], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    trackToolUsed('document-converter', 'documents');
                    a.href = url;
                    a.download = file.name.replace(/\.(pdf|docx)$/i, ".txt");
                    a.click();
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    {tc.downloadTxt}
                  </Button>
                </div>
              ) : status === "done" && file?.type === "text/plain" ? (
                <div className="flex items-center justify-center h-full text-center p-8 text-muted-foreground border border-border rounded-md border-dashed">
                  <div className="space-y-2">
                    <Download className="w-8 h-8 mx-auto text-primary" />
                    <p>{tc.pdfSuccess}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8 text-muted-foreground border border-border rounded-md border-dashed">
                  {tc.ready}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolPageSEO internalSlug="document-converter" />
    </>
  );
}
