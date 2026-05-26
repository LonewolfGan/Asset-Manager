import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { generatePassword, calculateEntropy, getEntropyLabel } from "@/services/passwordService";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
      toast({ title: "Select at least one character type", variant: "destructive" });
      return;
    }
    const newPasswords = Array.from({ length: count }, () => generatePassword(length, options));
    setPasswords(newPasswords);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, options, count]);

  const entropy = calculateEntropy(length, options);
  const entropyLabel = getEntropyLabel(entropy);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">Password Generator</h1>
        <p className="text-muted-foreground">Generate highly secure passwords with entropy calculation. Runs entirely in your browser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Length</Label>
                <span className="font-mono text-sm">{length}</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(v) => setLength(v[0])}
                min={8}
                max={128}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                <Switch 
                  id="uppercase" 
                  checked={options.uppercase} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, uppercase: c }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                <Switch 
                  id="lowercase" 
                  checked={options.lowercase} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, lowercase: c }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Numbers (0-9)</Label>
                <Switch 
                  id="numbers" 
                  checked={options.numbers} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, numbers: c }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Symbols (!@#$)</Label>
                <Switch 
                  id="symbols" 
                  checked={options.symbols} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, symbols: c }))} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 password</SelectItem>
                  <SelectItem value="5">5 passwords</SelectItem>
                  <SelectItem value="10">10 passwords</SelectItem>
                  <SelectItem value="25">25 passwords</SelectItem>
                  <SelectItem value="50">50 passwords</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full" onClick={handleGenerate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Generated Passwords</CardTitle>
                <CardDescription>Click to copy. Never saved to storage.</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-muted-foreground mb-1">Strength: <span className="text-foreground">{entropyLabel}</span></div>
                <div className="font-mono text-sm bg-muted px-2 py-1 rounded">~{Math.round(entropy)} bits</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-2 max-h-[500px]">
            {passwords.map((pw, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-md hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => copyToClipboard(pw)}
              >
                <div className="flex-1 font-mono text-lg break-all">{pw}</div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
