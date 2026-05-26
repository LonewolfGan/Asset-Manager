import { LayoutDashboard, FileText, Image, Eraser, Fingerprint, KeyRound, DollarSign, Scale, Calculator } from "lucide-react";

export const tools = [
  {
    id: "document-converter",
    name: "Document Converter",
    description: "Convert PDFs, DOCX, and TXT files instantly in your browser.",
    path: "/tools/document-converter",
    icon: FileText,
    category: "Files"
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Resize, compress, and convert images between formats offline.",
    path: "/tools/image-converter",
    icon: Image,
    category: "Files"
  },
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
  },
  {
    id: "tip-calculator",
    name: "Tip & Percentages",
    description: "Calculate tips and complex percentages effortlessly.",
    path: "/tools/tip-calculator",
    icon: Calculator,
    category: "Math"
  }
];

export const categories = Array.from(new Set(tools.map(t => t.category)));
