import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { getCurrencyRates } from "@/services/currencyService";

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [source, setSource] = useState("");
  const [age, setAge] = useState(0);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  useEffect(() => {
    getCurrencyRates().then((data) => {
      setRates(data.rates);
      setSource(data.source);
      setAge(data.ageMinutes);
      setLoading(false);
    });
  }, []);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencies = Object.keys(rates).sort();

  const convert = (val: string, from: string, to: string) => {
    if (!rates[from] || !rates[to] || isNaN(parseFloat(val))) return "0.00";
    const num = parseFloat(val);
    // Convert from -> USD -> to
    const inUSD = num / rates[from];
    const result = inUSD * rates[to];
    return result.toFixed(2);
  };

  const result = convert(amount, fromCurrency, toCurrency);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-foreground">Currency Converter</h1>
        <p className="text-muted-foreground">Convert currencies with live, cached rates.</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading rates...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1 w-full">
                  <Label>Amount</Label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="font-mono text-lg"
                  />
                </div>
                
                <div className="space-y-2 flex-1 w-full">
                  <Label>From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-8 text-center border border-border">
                <div className="text-muted-foreground mb-2 font-medium">
                  {amount || "0"} {fromCurrency} =
                </div>
                <div className="text-5xl font-mono font-semibold text-foreground tracking-tight">
                  {result} <span className="text-2xl text-muted-foreground ml-1">{toCurrency}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>Source: {source}</div>
                <div>Updated: {age} minutes ago</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {!loading && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Conversions ({fromCurrency})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'].filter(c => c !== fromCurrency && rates[c]).map(c => (
                <div key={c} className="p-3 border border-border rounded-md bg-muted/20 text-center">
                  <div className="font-mono text-sm text-muted-foreground mb-1">1 {fromCurrency}</div>
                  <div className="font-mono font-medium">{convert("1", fromCurrency, c)} {c}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
