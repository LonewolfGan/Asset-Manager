import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(1);

  // Percentage Calc state
  const [p1_x, setP1X] = useState("20");
  const [p1_y, setP1Y] = useState("100");
  const [p2_x, setP2X] = useState("20");
  const [p2_y, setP2Y] = useState("100");
  const [p3_x, setP3X] = useState("100");
  const [p3_y, setP3Y] = useState("120");

  const numBill = parseFloat(bill) || 0;
  const tipAmount = numBill * (tipPercent / 100);
  const total = numBill + tipAmount;
  const perPerson = people > 0 ? total / people : 0;
  const tipPerPerson = people > 0 ? tipAmount / people : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">Tip & Percentage</h1>
        <p className="text-muted-foreground">Calculate tips and complex percentages effortlessly.</p>
      </div>

      <Tabs defaultValue="tip" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="tip">Tip Calculator</TabsTrigger>
          <TabsTrigger value="percent">Percentages</TabsTrigger>
        </TabsList>

        <TabsContent value="tip">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Bill Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        value={bill} 
                        onChange={(e) => setBill(e.target.value)}
                        className="pl-8 font-mono text-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Tip Percentage</Label>
                      <span className="font-mono">{tipPercent}%</span>
                    </div>
                    <Slider
                      value={[tipPercent]}
                      onValueChange={(v) => setTipPercent(v[0])}
                      min={0}
                      max={50}
                      step={1}
                    />
                    <div className="flex gap-2 justify-between">
                      {[15, 18, 20, 25].map(p => (
                        <div 
                          key={p} 
                          onClick={() => setTipPercent(p)}
                          className={`flex-1 text-center py-1 text-sm rounded cursor-pointer border ${tipPercent === p ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}
                        >
                          {p}%
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Number of People</Label>
                      <span className="font-mono">{people}</span>
                    </div>
                    <Slider
                      value={[people]}
                      onValueChange={(v) => setPeople(v[0])}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6 border border-border flex flex-col justify-center space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-muted-foreground">Tip Amount</span>
                    <span className="font-mono text-xl">${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-muted-foreground text-lg">Total Bill</span>
                    <span className="font-mono text-3xl font-medium text-foreground">${total.toFixed(2)}</span>
                  </div>
                  
                  {people > 1 && (
                    <>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground text-sm">Tip / Person</span>
                        <span className="font-mono">${tipPerPerson.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-medium">Total / Person</span>
                        <span className="font-mono text-2xl text-primary font-medium">${perPerson.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="percent" className="space-y-4">
          <Card className="border-border">
            <CardContent className="pt-6 space-y-4 flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-muted-foreground whitespace-nowrap">What is</span>
                <Input type="number" className="w-20 font-mono" value={p1_x} onChange={e => setP1X(e.target.value)} />
                <span className="text-muted-foreground whitespace-nowrap">% of</span>
                <Input type="number" className="w-24 font-mono" value={p1_y} onChange={e => setP1Y(e.target.value)} />
                <span className="text-muted-foreground">?</span>
              </div>
              <div className="bg-muted px-4 py-2 rounded-md font-mono text-xl font-medium w-full md:w-auto text-center md:ml-auto">
                {((parseFloat(p1_x) || 0) * (parseFloat(p1_y) || 0) / 100).toPrecision(4).replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6 space-y-4 flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Input type="number" className="w-24 font-mono" value={p2_x} onChange={e => setP2X(e.target.value)} />
                <span className="text-muted-foreground whitespace-nowrap">is what % of</span>
                <Input type="number" className="w-24 font-mono" value={p2_y} onChange={e => setP2Y(e.target.value)} />
                <span className="text-muted-foreground">?</span>
              </div>
              <div className="bg-muted px-4 py-2 rounded-md font-mono text-xl font-medium w-full md:w-auto text-center md:ml-auto">
                {(((parseFloat(p2_x) || 0) / ((parseFloat(p2_y) || 1))) * 100).toPrecision(4).replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1')}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6 space-y-4 flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-muted-foreground whitespace-nowrap">% change from</span>
                <Input type="number" className="w-24 font-mono" value={p3_x} onChange={e => setP3X(e.target.value)} />
                <span className="text-muted-foreground whitespace-nowrap">to</span>
                <Input type="number" className="w-24 font-mono" value={p3_y} onChange={e => setP3Y(e.target.value)} />
              </div>
              <div className="bg-muted px-4 py-2 rounded-md font-mono text-xl font-medium w-full md:w-auto text-center md:ml-auto flex items-center justify-center gap-2">
                {(() => {
                  const v1 = parseFloat(p3_x);
                  const v2 = parseFloat(p3_y);
                  if (!v1) return "0%";
                  const diff = v2 - v1;
                  const pct = (diff / v1) * 100;
                  const formatted = pct.toPrecision(4).replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
                  return (
                    <span className={pct > 0 ? "text-green-600 dark:text-green-400" : pct < 0 ? "text-destructive" : ""}>
                      {pct > 0 ? "+" : ""}{formatted}%
                    </span>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
