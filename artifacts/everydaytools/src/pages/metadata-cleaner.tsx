import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getJpegMetadata, cleanJpegMetadata, cleanPdfMetadata } from "@/services/metadataService";
import { cleanTextScrubInvisibles, applyStylisticScrub } from "@/services/aiTextScrubberService";
import { ShieldAlert, Download, Eraser, FileUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "recharts";

export default function MetadataCleaner() {
  // Metadata state
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scrubber state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [stats, setStats] = useState({ invisibles: 0 });

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setCleanedBlob(null);
    setMetadata(null);

    if (selectedFile.type === "image/jpeg") {
      const meta = await getJpegMetadata(selectedFile);
      if (meta) setMetadata(meta);
    }
  };

  const handleCleanFile = async () => {
    if (!file) return;
    try {
      if (file.type === "image/jpeg") {
        const blob = await cleanJpegMetadata(file);
        setCleanedBlob(blob);
      } else if (file.type === "application/pdf") {
        const bytes = await cleanPdfMetadata(file);
        setCleanedBlob(new Blob([bytes], { type: "application/pdf" }));
      } else {
        toast({ title: "Unsupported file type", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error cleaning metadata", description: e.message, variant: "destructive" });
    }
  };

  const handleScrubText = () => {
    const { cleaned, removedCount } = cleanTextScrubInvisibles(inputText);
    const fullyCleaned = applyStylisticScrub(cleaned);
    setOutputText(fullyCleaned);
    setStats({ invisibles: removedCount });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">Metadata & Text Cleaner</h1>
        <p className="text-muted-foreground">Strip identifying metadata from files and remove AI boilerplate from text.</p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="files">File Metadata Cleaner</TabsTrigger>
          <TabsTrigger value="text">AI Text Scrubber</TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>Supports JPEG and PDF files.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-colors cursor-pointer hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} 
                    className="hidden" 
                    accept="image/jpeg,application/pdf" 
                  />
                  <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Select JPEG or PDF</h3>
                  <p className="text-sm text-muted-foreground">Strips EXIF data and document properties</p>
                </div>

                {file && (
                  <div className="p-4 border border-border rounded-md bg-muted/20">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    
                    <Button className="w-full mt-4" onClick={handleCleanFile}>
                      <ShieldAlert className="w-4 h-4 mr-2" />
                      Clean Metadata
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border flex flex-col">
              <CardHeader>
                <CardTitle>Status & Output</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {metadata && !cleanedBlob && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-destructive flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Metadata found in file
                    </h4>
                    <div className="bg-muted p-3 rounded font-mono text-xs overflow-auto max-h-40 border border-border">
                      Contains GPS, Camera, or Software info.
                    </div>
                  </div>
                )}

                {cleanedBlob ? (
                  <div className="flex flex-col h-full justify-center text-center space-y-4">
                    <div className="text-green-600 dark:text-green-500 mb-2">
                      <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="font-medium text-lg">File is Clean</p>
                      <p className="text-sm text-muted-foreground mt-1">All standard metadata has been stripped.</p>
                    </div>
                    <Button variant="default" onClick={() => {
                      const url = URL.createObjectURL(cleanedBlob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "cleaned_" + file?.name;
                      a.click();
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Clean File
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground border border-border rounded-md border-dashed">
                    Upload a file to begin
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Text Scrubber</CardTitle>
              <CardDescription>
                Removes invisible zero-width characters and replaces generic AI boilerplate phrases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Input Text (AI Generated)</Label>
                  <Textarea 
                    className="min-h-[250px] font-sans resize-y" 
                    placeholder="Paste text here..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cleaned Output</Label>
                  <Textarea 
                    className="min-h-[250px] font-sans resize-y bg-muted/20" 
                    readOnly
                    value={outputText}
                    placeholder="Cleaned text will appear here..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  {outputText && (
                    <span className="font-mono bg-muted px-2 py-1 rounded">
                      Removed {stats.invisibles} hidden artifacts
                    </span>
                  )}
                </div>
                <Button onClick={handleScrubText} disabled={!inputText}>
                  <Eraser className="w-4 h-4 mr-2" />
                  Scrub Text
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground pt-4 border-t border-border mt-4">
                Disclaimer: This tool removes common formatting artifacts and stylistic ticks. It does not guarantee bypass of all AI detection methods, including cryptographic watermarking techniques.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
