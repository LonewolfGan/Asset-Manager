import React from "react";
import { Faq05, type FaqItem } from "@/components/ui/faq-05";
import { useLocale } from "@/hooks/use-locale";

export function ContactFaq() {
  const { isFr } = useLocale();

  const faqs: FaqItem[] = isFr
    ? [
        {
          id: "supported-formats",
          q: "Quels types de fichiers et formats puis-je traiter sur la plateforme ?",
          a: "EverydayTools prend en charge un large éventail de formats : documents PDF, livres numériques EPUB, images matricielles et vectorielles (PNG, JPG, WEBP, AVIF, SVG, HEIC) ainsi que documents bureautiques (Word, Excel, PowerPoint). Les conversions s'appuient sur des moteurs natifs robustes pour assurer une fidélité typographique et structurelle optimale.",
        },
        {
          id: "size-limits",
          q: "Existe-t-il une limite de taille pour les fichiers importés ?",
          a: "Pour les opérations nécessitant un traitement sur nos passerelles serveur (conversions bureautiques, séparation IA), la limite maximale est de 100 Mo par fichier. Pour les outils exécutés localement dans votre navigateur via WebAssembly, aucune restriction serveur ne s'applique : seule la mémoire disponible sur votre appareil fait foi.",
        },
        {
          id: "security-purge",
          q: "Mes fichiers sont-ils conservés sur vos serveurs ?",
          a: "Absolument pas. Tout fichier traité côté serveur est isolé dans un espace éphémère strictly temporaire. Un mécanisme de purge automatisé détruit définitivement l'ensemble des fichiers source et des résultats au plus tard 15 minutes après la fin du traitement. Nous ne conservons aucune sauvegarde ni historique.",
        },
        {
          id: "pricing-watermarks",
          q: "Les outils sont-ils entièrement gratuits et sans filigrane imposé ?",
          a: "Oui, la totalité des utilitaires EverydayTools est accessible gratuitement, sans création de compte obligatoire, sans abonnement caché et sans aucun filigrane publicitaire incrusté sur vos documents générés.",
        },
        {
          id: "browser-compatibility",
          q: "La plateforme fonctionne-t-elle sur mobile et sur tous les navigateurs ?",
          a: "Oui. EverydayTools est conçu pour fonctionner de manière fluide sur tous les navigateurs modernes (Chrome, Firefox, Safari, Edge) que vous soyez sur ordinateur, tablette ou smartphone (iOS et Android). Les interfaces s'adaptent tactilement à chaque écran.",
        },
        {
          id: "batch-processing",
          q: "Puis-je traiter ou convertir plusieurs fichiers simultanément ?",
          a: "Oui, les outils conçus pour des flux multi-fichiers — comme la fusion de PDF ou la conversion groupée d'images — acceptent l'importation simultanée par glisser-déposer de plusieurs documents en une seule étape.",
        },
        {
          id: "support-delay",
          q: "Sous quel délai puis-je espérer une réponse à mon message ?",
          a: "Notre équipe traite et répond à l'ensemble des demandes reçues sous 24 heures ouvrées. Les signalements d'anomalies bloquantes ou de vulnérabilités font l'objet d'un examen prioritaire immédiat.",
        },
        {
          id: "bug-suggestions",
          q: "Comment signaler un dysfonctionnement ou proposer un nouvel outil ?",
          a: "Utilisez le formulaire ci-dessus en précisant l'outil concerné, le format du document manipulé, votre navigateur et le comportement inattendu. Vos suggestions orientent directement l'ordre de priorité de notre feuille de route.",
        },
      ]
    : [
        {
          id: "supported-formats",
          q: "What file types and formats are supported across the platform?",
          a: "EverydayTools supports a comprehensive array of formats: PDF documents, EPUB ebooks, raster and vector images (PNG, JPG, WEBP, AVIF, SVG, HEIC), and office files (Word, Excel, PowerPoint). Conversions rely on robust native engines to preserve optimal typographical and layout fidelity.",
        },
        {
          id: "size-limits",
          q: "Are there any file size limits for uploaded documents?",
          a: "For operations processed via our server pipelines (such as complex document conversions or AI segmentation), the limit is 100 MB per file. For tools operating entirely within your browser via WebAssembly, no server limits apply: processing is bounded only by your device's available memory.",
        },
        {
          id: "security-purge",
          q: "Are my uploaded files permanently stored on your servers?",
          a: "Absolutely not. Any file submitted for server processing is isolated in an ephemeral, strictly temporary workspace. An automated purge mechanism irrevocably wipes all uploaded files and converted outputs within 15 minutes. We maintain zero permanent archives or logs.",
        },
        {
          id: "pricing-watermarks",
          q: "Are the tools completely free and free of forced watermarks?",
          a: "Yes, all EverydayTools utilities are completely free to use, requiring no account creation, no paid subscription tier, and never stamping advertising watermarks onto your documents.",
        },
        {
          id: "browser-compatibility",
          q: "Does the platform work across all browsers and mobile devices?",
          a: "Yes. EverydayTools is engineered for consistent performance across all modern browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices (iOS and Android), featuring touch-responsive interaction patterns.",
        },
        {
          id: "batch-processing",
          q: "Can I process or convert multiple files simultaneously?",
          a: "Yes, tools designed for multi-file operations—such as PDF merging or batch image conversion—readily accept multiple files dropped into the upload area in a single action.",
        },
        {
          id: "support-delay",
          q: "What is the expected response time when contacting support?",
          a: "We review and answer all inquiries within 24 business hours. Critical defect reports and vulnerability disclosures are handled with immediate priority.",
        },
        {
          id: "bug-suggestions",
          q: "How can I submit a bug report or suggest a new tool?",
          a: "Use the console form above and indicate the tool name, input file format, your browser, and the observed behavior. User requests directly inform our upcoming roadmap priorities.",
        },
      ];

  const title = isFr
    ? "Questions fréquentes & Centre d'aide"
    : "Frequently Asked Questions & Help Center";

  const description = isFr
    ? "Retrouvez les réponses claires sur le fonctionnement des outils, la sécurité de vos fichiers et les limites techniques."
    : "Direct answers regarding platform tools, file privacy, and technical operating boundaries.";

  return (
    <section aria-label={title} className="w-full mt-24 sm:mt-36 md:mt-48 mb-20 sm:mb-28 md:mb-36">
      <Faq05
        faqs={faqs}
        tag="FAQ"
        title={title}
        description={description}
        className="py-0"
      />
    </section>
  );
}
