import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Sidebar, Topbar } from "@/components/layout";

import Home from "@/pages/index";
import PasswordGenerator from "@/pages/password-generator";
import CurrencyConverter from "@/pages/currency-converter";
import UnitConverter from "@/pages/unit-converter";
import TipCalculator from "@/pages/tip-calculator";
import DocumentConverter from "@/pages/document-converter";
import ImageConverter from "@/pages/image-converter";
import BackgroundRemover from "@/pages/background-remover";
import MetadataCleaner from "@/pages/metadata-cleaner";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground selection:bg-primary/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tools/password-generator" component={PasswordGenerator} />
            <Route path="/tools/currency-converter" component={CurrencyConverter} />
            <Route path="/tools/unit-converter" component={UnitConverter} />
            <Route path="/tools/tip-calculator" component={TipCalculator} />
            <Route path="/tools/document-converter" component={DocumentConverter} />
            <Route path="/tools/image-converter" component={ImageConverter} />
            <Route path="/tools/background-remover" component={BackgroundRemover} />
            <Route path="/tools/metadata-cleaner" component={MetadataCleaner} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
