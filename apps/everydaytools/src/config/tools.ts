import { LayoutDashboard, FileText, Image, Eraser, Fingerprint, KeyRound, DollarSign, Scale } from "lucide-react";

export const tools = [
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove image backgrounds using local AI models.",
    path: "/tools/background-remover",
    icon: Eraser,
    category: "Images"
  },
  {
    id: "metadata-cleaner",
    name: "Metadata & AI Cleaner",
    description: "Strip EXIF data from images and scrub AI boilerplate from text.",
    path: "/tools/metadata-cleaner",
    icon: Fingerprint,
    category: "Privacy"
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate highly secure passwords with entropy calculation.",
    path: "/tools/password-generator",
    icon: KeyRound,
    category: "Security"
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert currencies with live, cached rates.",
    path: "/tools/currency-converter",
    icon: DollarSign,
    category: "Math"
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, and more.",
    path: "/tools/unit-converter",
    icon: Scale,
    category: "Math"
  }
];

export const categories = Array.from(new Set(tools.map(t => t.category)));
