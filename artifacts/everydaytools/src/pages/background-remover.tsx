import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { removeImageBackground } from "@/services/backgroundRemovalService";
import { Image as ImageIcon, Download, Eraser } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
    setProgress(0);
  };

  const processFile = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);

    try {
      const resultBlob = await removeImageBackground(file, setProgress);
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setStatus("done");
      setProgress(100);
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message || "An error occurred during processing.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">AI Background Remover</h1>
        <p className="text-muted-foreground">Remove image backgrounds entirely in your browser using local AI models. No data leaves your device.</p>
        <p className="text-xs text-muted-foreground mt-1 px-3 py-1.5 bg-muted rounded-md inline-block">Note: The AI model (~40MB) will be downloaded on first use. This may take a few seconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>Select an image to process.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!previewUrl ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer h-[300px] flex flex-col items-center justify-center ${isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
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
                  accept="image/*" 
                />
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">Drag & drop image</h3>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            ) : (
              <div className="relative border border-border rounded-lg overflow-hidden h-[300px] flex items-center justify-center bg-muted/20">
                <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-2 right-2 shadow-sm"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setResultUrl(null);
                    setStatus("idle");
                  }}
                >
                  Change
                </Button>
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!file || status === "processing"} 
              onClick={processFile}
            >
              {status === "processing" ? "Removing Background..." : "Remove Background"}
            </Button>

            {status === "processing" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {status === "error" && (
              <Alert variant="destructive">
                <AlertTitle>Processing Failed</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="border-border flex flex-col">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Transparent PNG output.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[300px]">
            {resultUrl ? (
              <div className="flex flex-col h-full space-y-4">
                <div className="flex-1 border border-border rounded-md overflow-hidden relative" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%23e5e5e5\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}>
                  <img src={resultUrl} alt="Result" className="w-full h-full object-contain" />
                </div>
                <Button variant="default" className="w-full" onClick={() => {
                  const a = document.createElement("a");
                  a.href = resultUrl;
                  a.download = file?.name.replace(/\.[^/.]+$/, "_nobg.png") || "removed_bg.png";
                  a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-center p-8 text-muted-foreground border border-border rounded-md border-dashed">
                <div className="space-y-2">
                  <Eraser className="w-8 h-8 mx-auto opacity-20" />
                  <p>Result will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
