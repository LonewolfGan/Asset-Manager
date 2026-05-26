import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnitCategory, unitsConfig, convertUnit } from "@/config/unitsConfig";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnitConverter() {
  const categories = Object.keys(unitsConfig) as UnitCategory[];
  const [category, setCategory] = useState<UnitCategory>("Length");
  
  const currentUnits = unitsConfig[category].units;
  const [fromUnit, setFromUnit] = useState(currentUnits[0].id);
  const [toUnit, setToUnit] = useState(currentUnits[1]?.id || currentUnits[0].id);
  const [amount, setAmount] = useState("1");

  // Handle category change
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const newUnits = unitsConfig[cat].units;
    setFromUnit(newUnits[0].id);
    setToUnit(newUnits[1]?.id || newUnits[0].id);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  let result = "0";
  if (amount && !isNaN(parseFloat(amount))) {
    const val = parseFloat(amount);
    const res = convertUnit(val, fromUnit, toUnit, category);
    
    // Format nicely
    if (res < 0.000001 || res > 1000000) {
      result = res.toExponential(6);
    } else {
      // Show up to 6 decimal places, trim trailing zeros
      result = parseFloat(res.toFixed(6)).toString();
    }
  }

  const fromUnitObj = currentUnits.find(u => u.id === fromUnit);
  const toUnitObj = currentUnits.find(u => u.id === toUnit);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">Unit Converter</h1>
        <p className="text-muted-foreground">Convert length, weight, temperature, and more instantly.</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-2 max-w-xs mx-auto text-center">
            <Label>Measurement Type</Label>
            <Select value={category} onValueChange={(v) => handleCategoryChange(v as UnitCategory)}>
              <SelectTrigger className="justify-center text-lg h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end mt-8">
            <div className="space-y-2 flex-1 w-full">
              <Label>From</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono text-lg mb-3"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.symbol})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={handleSwap} className="mb-0.5 hidden md:flex shrink-0">
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            
            <div className="flex md:hidden justify-center w-full my-2">
              <Button variant="outline" size="icon" onClick={handleSwap}>
                <ArrowLeftRight className="h-4 w-4 rotate-90" />
              </Button>
            </div>

            <div className="space-y-2 flex-1 w-full">
              <Label>To</Label>
              <div className="h-10 px-3 py-2 bg-muted/30 border border-border rounded-md font-mono text-lg flex items-center justify-between mb-3 text-foreground overflow-x-auto whitespace-nowrap">
                {result}
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.symbol})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground pt-4">
            {amount || "0"} {fromUnitObj?.symbol} = <span className="font-mono text-foreground font-medium">{result}</span> {toUnitObj?.symbol}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
