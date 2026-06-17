export interface HowItWorksStep {
  name: string;
  text: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface ToolSeoEntry {
  internalSlug: string;
  slugs: { en: string; fr: string };
  title: { en: string; fr: string };
  h1: { en: string; fr: string };
  description: { en: string; fr: string };
  keywords: { en: string[]; fr: string[] };
  relatedTools: string[];
  howItWorks: { en: HowItWorksStep[]; fr: HowItWorksStep[] };
  about: { en: string; fr: string };
  faqs: { en: FaqEntry[]; fr: FaqEntry[] };
}

export const SEO_TOOLS: ToolSeoEntry[] = [
  {
    internalSlug: "pdf-to-word",
    slugs: { en: "convert-pdf-to-word", fr: "convertir-pdf-en-word" },
    title: {
      en: "PDF to Word Converter — Free, Online, No Signup | EverydayTools Hub",
      fr: "Convertir PDF en Word — Gratuit, En Ligne, Sans Inscription | EverydayTools Hub",
    },
    h1: { en: "PDF to Word Converter", fr: "Convertisseur PDF en Word" },
    description: {
      en: "Convert PDF files to editable Word (DOCX) documents instantly in your browser. No upload to servers, no account required, free forever.",
      fr: "Convertissez des fichiers PDF en documents Word (DOCX) modifiables directement dans votre navigateur. Sans téléchargement, sans compte, gratuit.",
    },
    keywords: {
      en: ["pdf to word converter", "convert pdf to docx online", "free pdf to word", "pdf to word without software", "pdf to docx free", "how to convert pdf to word"],
      fr: ["convertir pdf en word", "pdf en docx gratuit", "convertisseur pdf word en ligne", "transformer pdf en word", "pdf vers word sans logiciel", "convertir pdf en docx"],
    },
    relatedTools: ["pdf-compress", "pdf-to-text", "txt-to-docx", "pdf-merge", "word-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file into the drop zone. Files up to 50 MB are supported." },
        { name: "Convert automatically", text: "EverydayTools Hub extracts all text and structure from your PDF using your browser — nothing is sent to any server." },
        { name: "Download your DOCX", text: "Click Convert. Your Word document downloads automatically as a .docx file, ready to edit in Microsoft Word or Google Docs." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PDF. Les fichiers jusqu'à 50 Mo sont acceptés." },
        { name: "Conversion automatique", text: "EverydayTools Hub extrait tout le texte et la structure de votre PDF dans votre navigateur — rien n'est envoyé à un serveur." },
        { name: "Téléchargez le DOCX", text: "Cliquez sur Convertir. Votre document Word se télécharge automatiquement au format .docx, prêt à être modifié." },
      ],
    },
    about: {
      en: "Convert any PDF into an editable Word document in seconds, directly in your browser. Whether it's a contract, report, or scanned form, EverydayTools extracts the text and structure from your file and delivers a ready-to-edit .docx without sending anything to a server.\n\nThis tool works best on PDFs created digitally — from a word processor, printer driver, or design app. Complex layouts with multi-column text, embedded graphics, or unusual fonts may need a quick tidy-up in Word after conversion, but the text content will be faithfully extracted. No account, no upload, no waiting.",
      fr: "Convertissez n'importe quel PDF en document Word modifiable en quelques secondes, directement dans votre navigateur. Contrat, rapport ou formulaire — EverydayTools extrait le texte et la structure de votre fichier et génère un .docx prêt à éditer, sans rien envoyer à un serveur.\n\nCet outil fonctionne mieux sur les PDF créés numériquement. Les mises en page complexes (texte multi-colonnes, images intégrées, polices inhabituelles) peuvent nécessiter une légère retouche dans Word après la conversion, mais le contenu textuel sera fidèlement extrait. Sans compte, sans envoi, sans attente."
    },
    faqs: {
      en: [
        { q: "Will the Word document look exactly like the PDF?", a: "Text and basic paragraph structure are preserved accurately. However, complex layouts such as multi-column pages, precise positioning, decorative fonts, or embedded graphics may not transfer perfectly. This is a limitation of the PDF format itself — PDFs store visual positions, not document structure. A manual touch-up in Word is often needed." },
        { q: "Can I convert a password-protected PDF to Word?", a: "If the PDF has an owner password restricting editing but no user password, the conversion will work normally. If the PDF requires a password to open, you will need to unlock it first. Use the Unlock PDF tool on EverydayTools Hub, then convert." },
        { q: "What file size limit applies?", a: "The PDF to Word Converter accepts files up to 50 MB. Most PDFs are well under this limit. Very large PDFs with hundreds of high-resolution images may exceed the limit — in that case, use the Compress PDF tool to reduce the file size first." },
        { q: "Is PDF to Word Converter free?", a: "Yes. EverydayTools Hub PDF to Word Converter is completely free to use with no usage limits, no account required, and no watermarks on the output. It will remain free forever." },
      ],
      fr: [
        { q: "Comment convertir un PDF en Word gratuitement en ligne ?", a: "Téléversez votre fichier PDF dans le convertisseur PDF en Word d'EverydayTools Hub et cliquez sur Convertir. L'outil s'exécute entièrement dans votre navigateur, extrait le texte de chaque page et génère un fichier DOCX téléchargeable instantanément. Sans compte, sans paiement." },
        { q: "La conversion se fait-elle dans le navigateur ou sur un serveur ?", a: "Toute la conversion a lieu dans votre navigateur en JavaScript. Votre fichier PDF n'est jamais envoyé à un serveur. Vos données restent privées et l'outil fonctionne même hors connexion après le premier chargement de la page." },
        { q: "Le document Word sera-t-il identique au PDF ?", a: "Le texte et la structure de base des paragraphes sont préservés fidèlement. Les mises en page complexes — colonnes multiples, positionnement précis, polices décoratives, images intégrées — peuvent ne pas être reproduites parfaitement. Une retouche manuelle dans Word est souvent nécessaire." },
        { q: "Puis-je convertir un PDF protégé par mot de passe en Word ?", a: "Si le PDF a un mot de passe propriétaire restreignant la modification mais pas de mot de passe d'ouverture, la conversion fonctionne normalement. Si le PDF nécessite un mot de passe pour s'ouvrir, utilisez d'abord l'outil Déverrouiller PDF d'EverydayTools Hub." },
        { q: "Quelle est la taille maximale des fichiers ?", a: "Le convertisseur accepte les fichiers jusqu'à 50 Mo. La plupart des PDF sont bien en dessous de cette limite. Pour les PDF très volumineux, utilisez d'abord l'outil Compresser PDF." },
        { q: "Le convertisseur PDF en Word est-il gratuit ?", a: "Oui. Le convertisseur PDF en Word d'EverydayTools Hub est entièrement gratuit, sans limite d'utilisation, sans compte requis et sans filigrane sur le résultat. Il restera gratuit indéfiniment." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-text",
    slugs: { en: "convert-pdf-to-text", fr: "convertir-pdf-en-texte" },
    title: {
      en: "PDF to Text Converter — Free, Online, No Signup | EverydayTools Hub",
      fr: "Convertir PDF en Texte — Gratuit, En Ligne, Sans Inscription | EverydayTools Hub",
    },
    h1: { en: "PDF to Text Converter", fr: "Convertisseur PDF en Texte" },
    description: {
      en: "Extract all text from a PDF file instantly in your browser. No server upload, no account needed. Download as plain TXT — free forever.",
      fr: "Extrayez tout le texte d'un PDF directement dans votre navigateur. Sans téléchargement serveur, sans compte. Téléchargez en TXT — gratuit.",
    },
    keywords: {
      en: ["pdf to text converter", "extract text from pdf", "pdf to txt online free", "convert pdf to text without software", "pdf text extraction", "pdf to plaintext"],
      fr: ["convertir pdf en texte", "extraire texte pdf", "pdf en txt gratuit", "extraction texte pdf", "pdf vers texte en ligne", "convertir pdf en txt"],
    },
    relatedTools: ["pdf-to-word", "pdf-to-html", "txt-to-pdf", "pdf-compress", "word-to-text"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF. Files up to 50 MB are supported." },
        { name: "Extract text automatically", text: "The tool reads every page in your browser and extracts all text content in reading order — nothing is sent to a server." },
        { name: "Download as TXT", text: "Click Convert. A plain .txt file containing all extracted text downloads to your device." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PDF. Jusqu'à 50 Mo." },
        { name: "Extraction automatique", text: "L'outil lit chaque page dans votre navigateur et extrait tout le contenu textuel dans l'ordre de lecture — rien n'est envoyé à un serveur." },
        { name: "Téléchargez en TXT", text: "Cliquez sur Convertir. Un fichier .txt contenant tout le texte extrait se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "Need the text out of a PDF? EverydayTools pulls every word from your file and delivers a clean, plain text file ready to paste, search, edit, or import anywhere. The entire extraction runs in your browser — your file never touches a server.\n\nThis tool works best on PDFs created digitally — from a word processor, design app, or exported report. Pages scanned from paper are stored as images and do not contain a text layer, so nothing can be extracted from them. For scanned pages, use the OCR tool instead.",
      fr: "Besoin d'extraire le texte d'un PDF ? EverydayTools extrait chaque mot de votre fichier et livre un texte brut propre — prêt à coller, rechercher, modifier ou importer. Tout le traitement s'effectue dans votre navigateur, votre fichier ne quitte jamais votre appareil.\n\nCet outil fonctionne mieux sur les PDF créés numériquement — depuis un traitement de texte, une application de conception ou un rapport exporté. Les pages numérisées sont stockées sous forme d'images et ne contiennent pas de couche de texte extractible. Pour ces cas, utilisez l'outil OCR."
    },
    faqs: {
      en: [
    { q: "Does this tool work with scanned PDFs?", a: "No. Scanned PDFs contain images of pages rather than actual text data. PDF to Text extraction only works on PDFs that were created digitally (for example, exported from Word or generated by a printer driver). For scanned PDFs, you need an OCR tool." },
    { q: "Is the extracted text in the correct reading order?", a: "For most standard PDFs, yes. Text is extracted from each page in reading order. Complex layouts — such as multi-column documents, footnotes, or side-by-side tables — may have text from different columns interleaved. Manual cleanup may be needed for such documents." },
    { q: "Can I extract text from a specific page range?", a: "The current version extracts text from all pages. To extract from specific pages only, split your PDF first using the Split PDF tool, then run the text extraction on the resulting file." },
    { q: "What happens to my PDF after conversion?", a: "Nothing is stored or transmitted. The entire conversion runs in your browser's memory. Once you close the tab or navigate away, the file data is gone. EverydayTools Hub never sees your documents." },
    { q: "Is PDF to Text Converter free?", a: "Yes. EverydayTools Hub PDF to Text Converter is completely free with no usage limits, no account needed, and no watermarks on the output. It will remain free." },
      ],
      fr: [
        { q: "Comment extraire du texte d'un PDF gratuitement ?", a: "Téléversez votre PDF dans le convertisseur PDF en Texte d'EverydayTools Hub et cliquez sur Convertir. L'outil s'exécute dans votre navigateur, extrait le texte de chaque page et vous permet de télécharger un fichier TXT. Sans logiciel, sans compte." },
    { q: "Cet outil fonctionne-t-il avec les PDF numérisés ?", a: "Non. Les PDF numérisés contiennent des images de pages plutôt que des données textuelles. L'extraction ne fonctionne que sur les PDF créés numériquement (exportés depuis Word, LaTeX, etc.). Pour les PDF numérisés, un outil OCR est nécessaire." },
    { q: "Le texte extrait respecte-t-il l'ordre de lecture ?", a: "Pour la plupart des PDF standards, oui. Le texte est extrait page par page dans l'ordre de lecture. Les mises en page complexes (documents multi-colonnes, notes de bas de page, tableaux côte à côte) peuvent donner un texte entremêlé nécessitant une correction manuelle." },
    { q: "Puis-je extraire le texte d'une plage de pages spécifique ?", a: "La version actuelle extrait le texte de toutes les pages. Pour n'extraire que certaines pages, divisez d'abord votre PDF avec l'outil Diviser PDF, puis lancez l'extraction sur le fichier résultant." },
    { q: "Que devient mon PDF après la conversion ?", a: "Rien n'est stocké ni transmis. Toute la conversion s'effectue dans la mémoire du navigateur. Une fois l'onglet fermé, les données du fichier disparaissent. EverydayTools Hub ne voit jamais vos documents." },
    { q: "Le convertisseur PDF en Texte est-il gratuit ?", a: "Oui. Le convertisseur PDF en Texte d'EverydayTools Hub est entièrement gratuit, sans limite d'utilisation, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-html",
    slugs: { en: "convert-pdf-to-html", fr: "convertir-pdf-en-html" },
    title: {
      en: "PDF to HTML Converter — Free, Online, No Signup | EverydayTools Hub",
      fr: "Convertir PDF en HTML — Gratuit, En Ligne, Sans Inscription | EverydayTools Hub",
    },
    h1: { en: "PDF to HTML Converter", fr: "Convertisseur PDF en HTML" },
    description: {
      en: "Convert PDF content to HTML markup in your browser. No upload, no account, free. Ideal for publishing PDF content on the web.",
      fr: "Convertissez le contenu d'un PDF en HTML dans votre navigateur. Sans envoi, sans compte, gratuit. Idéal pour publier un PDF sur le web.",
    },
    keywords: {
      en: ["pdf to html converter", "convert pdf to html online", "pdf to html free", "pdf to web page", "export pdf as html", "pdf html conversion"],
      fr: ["convertir pdf en html", "pdf en html gratuit", "convertisseur pdf html en ligne", "pdf vers html", "exporter pdf en html", "pdf to html"],
    },
    relatedTools: ["pdf-to-text", "pdf-to-word", "html-to-pdf", "html-to-markdown", "word-to-html"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file. Files up to 50 MB are supported." },
        { name: "Convert to HTML", text: "The tool extracts text and structure from your PDF in the browser and wraps it in clean HTML markup." },
        { name: "Download the HTML file", text: "Click Convert. An .html file downloads, ready to open in a browser or paste into a CMS." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Conversion en HTML", text: "L'outil extrait le texte et la structure de votre PDF dans le navigateur et les encapsule en balises HTML propres." },
        { name: "Téléchargez le fichier HTML", text: "Cliquez sur Convertir. Un fichier .html se télécharge, prêt à être ouvert dans un navigateur ou collé dans un CMS." },
      ],
    },
    about: {
      en: "Turn your PDF into HTML you can publish directly on a website or CMS. EverydayTools extracts the text from each page and structures it as clean HTML — no ads, no tracking, and no file uploads to any server.\n\nThe output is a web-ready HTML file with basic structure preserved, optimised for readability rather than pixel-perfect layout replication. Heavily formatted documents, tables, or embedded images may not translate perfectly — a quick review of the HTML before publishing is always a good idea.",
      fr: "Transformez votre PDF en HTML publiable sur n'importe quel site web ou CMS. EverydayTools extrait le texte de chaque page et le structure en HTML propre — sans publicité, sans suivi, sans envoi de fichier à un serveur.\n\nLe fichier HTML produit préserve la structure de base pour une bonne lisibilité, sans chercher à reproduire le rendu visuel exact du PDF. Les mises en page complexes, les tableaux et les images intégrées peuvent ne pas être reproduits parfaitement — une relecture rapide avant publication est conseillée."
    },
    faqs: {
      en: [
    { q: "Does the HTML output include the PDF's visual layout?", a: "The converter preserves text structure and basic paragraphs. It does not reproduce complex visual layouts, multi-column designs, or precise positioning. The output is clean, functional HTML suitable for web publishing, which you can then style with your own CSS." },
    { q: "Can I edit the HTML after converting?", a: "Yes. The downloaded .html file is a standard plain-text file that you can open in any text editor or code editor and modify freely. You can add CSS classes, adjust the markup, or paste the content into a CMS editor." },
    { q: "Are images from the PDF included in the HTML output?", a: "No. The current converter extracts text content only. Images embedded in PDFs are not included in the HTML output. If you need to include images, you would need to extract them separately and reference them manually in the HTML." },
    { q: "What is PDF to HTML conversion used for?", a: "Common uses include publishing research papers or reports on websites, converting product documentation from PDF to web format, migrating PDF-based content into a CMS, and making PDF content searchable and accessible on the web." },
    { q: "Is PDF to HTML Converter free?", a: "Yes. EverydayTools Hub PDF to HTML Converter is completely free, with no account required and no file watermarks. All processing happens in your browser." },
      ],
      fr: [
        { q: "Comment convertir un PDF en HTML gratuitement en ligne ?", a: "Téléversez votre PDF dans le convertisseur PDF en HTML d'EverydayTools Hub et cliquez sur Convertir. L'outil analyse le PDF dans votre navigateur, extrait le texte en paragraphes HTML et vous permet de télécharger le fichier HTML — sans compte, sans envoi à un serveur." },
    { q: "Le HTML de sortie reproduit-il la mise en page du PDF ?", a: "Le convertisseur préserve la structure du texte et les paragraphes de base. Il ne reproduit pas les mises en page visuelles complexes, les colonnes ou le positionnement précis. Le résultat est un HTML propre et stylable avec CSS." },
    { q: "Puis-je modifier le HTML après la conversion ?", a: "Oui. Le fichier .html téléchargé est un fichier texte standard que vous pouvez ouvrir dans n'importe quel éditeur de texte et modifier librement. Vous pouvez ajouter des classes CSS, ajuster le balisage ou coller le contenu dans un éditeur CMS." },
    { q: "Les images du PDF sont-elles incluses dans le HTML ?", a: "Non. Le convertisseur extrait uniquement le contenu textuel. Les images intégrées dans les PDF ne sont pas incluses dans la sortie HTML." },
    { q: "À quoi sert la conversion PDF en HTML ?", a: "Parmi les usages courants : publier des rapports ou articles sur des sites web, convertir de la documentation produit en format web, migrer du contenu PDF dans un CMS, et rendre le contenu PDF indexable et accessible sur le web." },
    { q: "Le convertisseur PDF en HTML est-il gratuit ?", a: "Oui. Le convertisseur PDF en HTML d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane. Tout le traitement se fait dans votre navigateur." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-epub",
    slugs: { en: "convert-pdf-to-epub", fr: "convertir-pdf-en-epub" },
    title: {
      en: "PDF to EPUB Converter — Free, Online, No Signup | EverydayTools Hub",
      fr: "Convertir PDF en EPUB — Gratuit, En Ligne, Sans Inscription | EverydayTools Hub",
    },
    h1: { en: "PDF to EPUB Converter", fr: "Convertisseur PDF en EPUB" },
    description: {
      en: "Convert PDF files to EPUB e-book format in your browser. No upload, no account, free. Read your PDFs on any e-reader or Kindle.",
      fr: "Convertissez des PDF en e-books EPUB dans votre navigateur. Sans envoi, sans compte, gratuit. Lisez vos PDF sur n'importe quelle liseuse.",
    },
    keywords: {
      en: ["pdf to epub converter", "convert pdf to epub online free", "pdf to epub free", "pdf to ebook converter", "pdf to kindle", "pdf epub conversion"],
      fr: ["convertir pdf en epub", "pdf en epub gratuit", "convertisseur pdf epub en ligne", "pdf vers liseuse", "pdf en ebook", "pdf to epub"],
    },
    relatedTools: ["pdf-to-word", "word-to-epub", "pdf-to-text", "markdown-to-pdf", "word-to-markdown"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file. Files up to 50 MB are supported." },
        { name: "Extract and package", text: "The tool extracts text from each page in your browser and packages it as a standard EPUB e-book file." },
        { name: "Download the EPUB", text: "Click Convert. Your .epub file downloads and can be opened on any e-reader, Kindle (via calibre), or reading app." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Extraction et emballage", text: "L'outil extrait le texte de chaque page dans votre navigateur et prépare un fichier e-book EPUB." },
        { name: "Téléchargez l'EPUB", text: "Cliquez sur Convertir. Votre fichier .epub se télécharge et peut être ouvert sur n'importe quelle liseuse ou application de lecture." },
      ],
    },
    about: {
      en: "Transform any PDF into an EPUB e-book that looks great on any screen — from a phone to a dedicated e-reader. Unlike PDFs, which lock text into fixed pages, EPUB flows naturally to any font size and device width, making it far more comfortable to read. Everything happens in your browser, with no file ever sent to a server.\n\nEPUB 3 is supported by Kobo, Apple Books, Nook, and most reading apps. Kindle users on firmware 5.16.2.1 or later can open EPUB files natively. For older Kindles, a free tool like Calibre converts EPUB to MOBI in seconds.",
      fr: "Transformez n'importe quel PDF en e-book EPUB qui s'affiche parfaitement sur n'importe quel écran — du téléphone à la liseuse dédiée. Contrairement au PDF, qui fige le texte en pages fixes, l'EPUB s'adapte à n'importe quelle taille de police et largeur d'écran pour une lecture vraiment confortable. Tout se passe dans votre navigateur, aucun fichier n'est envoyé à un serveur.\n\nL'EPUB 3 est pris en charge par Kobo, Apple Books, Nook et la plupart des applications de lecture. Les utilisateurs Kindle avec le firmware 5.16.2.1 ou ultérieur peuvent l'ouvrir nativement. Pour les anciens Kindle, un outil gratuit comme Calibre convertit l'EPUB en MOBI en quelques secondes."
    },
    faqs: {
      en: [
    { q: "Can I read the converted EPUB on my Kindle?", a: "Yes. Kindle devices running firmware 5.16.2.1 or later support EPUB natively. For older Kindles, transfer the EPUB to your computer and use the free Calibre app to convert it to MOBI format, then side-load to your Kindle." },
    { q: "Will the PDF's formatting be preserved in the EPUB?", a: "Text content and paragraph structure are preserved. EPUB is a reflowable format, so fixed page layouts, precise typographic positioning, and multi-column designs from the original PDF are not replicated. The output prioritises readable text that adapts to any screen size." },
    { q: "What e-readers and apps support EPUB?", a: "EPUB is supported by Kobo, Nook, Apple Books, Google Play Books, Moon+ Reader, Lithium, Kindle (firmware 5.16.2.1+), and virtually all reading apps. It is the most widely supported e-book format outside of Amazon's ecosystem." },
    { q: "Can I convert an EPUB back to PDF?", a: "EverydayTools Hub does not currently have a dedicated EPUB to PDF converter. However, you can use the free Calibre desktop app to convert EPUB to PDF, or open the EPUB in Apple Books or another reader and print to PDF." },
    { q: "Is PDF to EPUB Converter free?", a: "Yes. EverydayTools Hub PDF to EPUB Converter is completely free, with no account required and no restrictions on use. All processing happens in your browser." },
      ],
      fr: [
        { q: "Comment convertir un PDF en EPUB gratuitement en ligne ?", a: "Téléversez votre PDF dans le convertisseur PDF en EPUB d'EverydayTools Hub et cliquez sur Convertir. L'outil s'exécute dans votre navigateur, extrait le texte, l'empaquète en EPUB et vous permet de télécharger le fichier instantanément." },
    { q: "Puis-je lire l'EPUB converti sur ma liseuse Kindle ?", a: "Oui. Les appareils Kindle avec le firmware 5.16.2.1 ou supérieur supportent l'EPUB nativement. Pour les anciens Kindle, utilisez l'application gratuite Calibre pour convertir l'EPUB en MOBI, puis chargez-le sur votre Kindle." },
    { q: "La mise en forme du PDF sera-t-elle conservée dans l'EPUB ?", a: "Le contenu textuel et la structure des paragraphes sont préservés. L'EPUB étant un format à flux dynamique, les mises en page fixes, le positionnement typographique précis et les designs multi-colonnes du PDF ne sont pas reproduits." },
    { q: "Quelles liseuses et applications supportent l'EPUB ?", a: "L'EPUB est supporté par Kobo, Nook, Apple Books, Google Play Books, Moon+ Reader, Lithium, Kindle (firmware 5.16.2.1+) et pratiquement toutes les applications de lecture." },
    { q: "Puis-je reconvertir un EPUB en PDF ?", a: "EverydayTools Hub n'a pas de convertisseur EPUB en PDF dédié pour le moment. Vous pouvez utiliser l'application de bureau gratuite Calibre pour convertir EPUB en PDF." },
    { q: "Le convertisseur PDF en EPUB est-il gratuit ?", a: "Oui. Le convertisseur PDF en EPUB d'EverydayTools Hub est entièrement gratuit, sans compte requis. Tout le traitement se fait dans votre navigateur." },
      ],
    },
  },
  {
    internalSlug: "pdf-compress",
    slugs: { en: "compress-pdf", fr: "compresser-pdf" },
    title: {
      en: "Compress PDF Online Free — No Signup | EverydayTools Hub",
      fr: "Compresser PDF en Ligne Gratuit — Sans Inscription | EverydayTools Hub",
    },
    h1: { en: "Compress PDF", fr: "Compresser un PDF" },
    description: {
      en: "Reduce PDF file size online for free, entirely in your browser. No upload to servers, no account required. Smaller PDFs in seconds.",
      fr: "Réduisez la taille d'un PDF en ligne et gratuitement, dans votre navigateur. Sans envoi à un serveur, sans compte. PDFs plus légers en secondes.",
    },
    keywords: {
      en: ["compress pdf online free", "reduce pdf file size", "pdf compressor", "shrink pdf online", "make pdf smaller", "pdf size reducer"],
      fr: ["compresser pdf en ligne gratuit", "réduire taille pdf", "compresseur pdf", "réduire poids pdf", "alléger pdf en ligne", "diminuer taille pdf"],
    },
    relatedTools: ["pdf-to-word", "pdf-merge", "pdf-split", "pdf-rotate", "image-compress"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF. Files up to 50 MB are supported." },
        { name: "Compress in the browser", text: "The tool processes your PDF in the browser, removing redundant data and optimising the file size." },
        { name: "Download the compressed PDF", text: "Click Compress. Your smaller PDF downloads instantly — the same content, less space." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Compression dans le navigateur", text: "L'outil retraite votre PDF dans le navigateur, supprimant les données redondantes et optimisant la taille du fichier." },
        { name: "Téléchargez le PDF compressé", text: "Cliquez sur Compresser. Votre PDF allégé se télécharge instantanément — même contenu, moins d'espace." },
      ],
    },
    about: {
      en: "Shrink a PDF that is too large for email, upload, or storage — without losing visual quality. EverydayTools reduces file size by cleaning up the internal structure of your PDF, entirely in your browser. No cloud service, no account, no size limit beyond 50 MB.\n\nResults depend on what is inside the PDF. Text-heavy documents typically see modest reductions; PDFs with many embedded images can shrink considerably. Compression targets internal redundancy — it does not degrade visible text or image quality.",
      fr: "Réduisez la taille d'un PDF trop volumineux pour un envoi par e-mail, un téléversement ou un stockage — sans perte de qualité visible. EverydayTools nettoie la structure interne de votre PDF directement dans votre navigateur. Aucun service cloud, aucun compte, aucune limite de taille au-delà de 50 Mo.\n\nLe résultat dépend du contenu du PDF. Les documents essentiellement textuels voient généralement une réduction modeste ; les PDF avec de nombreuses images intégrées peuvent être considérablement allégés. La compression cible les redondances internes — elle ne dégrade pas la qualité du texte ou des images."
    },
    faqs: {
      en: [
    { q: "How much will my PDF be compressed?", a: "Compression results vary by PDF content. PDFs with many images can be reduced significantly — sometimes by 50% or more. Text-heavy PDFs with clean structure may see smaller reductions (10–30%). PDFs already compressed at creation offer less room for further reduction." },
    { q: "Will compression reduce the visual quality of my PDF?", a: "EverydayTools Hub uses structure-level compression, which removes redundant data without degrading text or image quality. The compressed PDF should look identical to the original when printed or displayed." },
    { q: "Can I compress a PDF without losing quality?", a: "Yes. The Compress PDF tool focuses on removing internal redundancies and reprocessing the file structure, not on re-encoding images at lower quality. Visual content is preserved. For even smaller files, desktop tools that reduce image resolution may be more aggressive." },
    { q: "What is the maximum file size I can compress?", a: "The tool accepts PDFs up to 50 MB. Very large PDFs may take a few extra seconds in the browser. If your PDF exceeds the limit, try splitting it into smaller sections first using the Split PDF tool, then compressing each part." },
    { q: "Is Compress PDF free?", a: "Yes. EverydayTools Hub Compress PDF is completely free, no account required, no usage limits, and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment compresser un PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Compresser PDF d'EverydayTools Hub et cliquez sur Compresser. L'outil optimise la structure interne du PDF dans votre navigateur — sans envoi à un serveur, sans compte. Le fichier compressé se télécharge en quelques secondes." },
    { q: "De combien mon PDF sera-t-il compressé ?", a: "Les résultats varient selon le contenu. Les PDF avec de nombreuses images peuvent être réduits de 50 % ou plus. Les PDF principalement textuels voient des réductions plus modestes (10–30 %). Les PDF déjà compressés à la création offrent moins de marge de compression." },
    { q: "La compression réduit-elle la qualité visuelle de mon PDF ?", a: "EverydayTools Hub utilise une compression structurelle qui supprime les données redondantes sans dégrader la qualité du texte ou des images. Le PDF compressé devrait être visuellement identique à l'original." },
    { q: "Puis-je compresser un PDF sans perte de qualité ?", a: "Oui. L'outil se concentre sur la suppression des redondances internes et le retraitement de la structure du fichier, sans ré-encoder les images à une qualité inférieure. Le contenu visuel est préservé." },
    { q: "Quelle est la taille maximale des fichiers acceptés ?", a: "L'outil accepte les PDF jusqu'à 50 Mo. Les PDF très volumineux peuvent prendre quelques secondes supplémentaires. Si votre PDF dépasse la limite, divisez-le d'abord avec l'outil Diviser PDF." },
    { q: "Compresser PDF est-il gratuit ?", a: "Oui. L'outil Compresser PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis, sans limites d'utilisation et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-merge",
    slugs: { en: "merge-pdf", fr: "fusionner-pdf" },
    title: { en: "Merge PDF Files Online Free — No Signup | EverydayTools Hub", fr: "Fusionner des PDF en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Merge PDFs", fr: "Fusionner des PDFs" },
    description: { en: "Combine multiple PDF files into one document instantly in your browser. No upload, no account. Free PDF merger online.", fr: "Combinez plusieurs fichiers PDF en un seul document dans votre navigateur. Sans envoi, sans compte. Fusionneur PDF gratuit en ligne." },
    keywords: { en: ["merge pdf online free", "combine pdf files", "pdf merger", "join pdf files", "merge multiple pdfs", "pdf combiner free"], fr: ["fusionner pdf en ligne gratuit", "combiner fichiers pdf", "fusionneur pdf", "assembler pdf", "réunir plusieurs pdf", "pdf merger gratuit"] },
    relatedTools: ["pdf-split", "pdf-compress", "pdf-rotate", "reorder-pdf", "pdf-page-numbers"],
    howItWorks: {
      en: [
        { name: "Upload your PDFs", text: "Click the upload area or drag multiple PDF files. You can add up to 20 files at once." },
        { name: "Arrange the order", text: "Drag files in the list to set the order they will appear in the merged document." },
        { name: "Download the merged PDF", text: "Click Merge. A single combined PDF downloads to your device." },
      ],
      fr: [
        { name: "Téléversez vos PDFs", text: "Cliquez sur la zone de dépôt ou faites glisser plusieurs fichiers PDF. Jusqu'à 20 fichiers à la fois." },
        { name: "Arrangez l'ordre", text: "Faites glisser les fichiers dans la liste pour définir l'ordre dans le document fusionné." },
        { name: "Téléchargez le PDF fusionné", text: "Cliquez sur Fusionner. Un seul PDF combiné se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "Combine multiple PDF files into one clean, continuous document — right in your browser, with no file uploads and no account required. Drop your files in the order you want them, then download the merged result.\n\nMerging PDFs is useful for combining invoices, assembling reports from separate chapters, or creating a single PDF portfolio from multiple sources. The tool preserves the content and page structure of each input file exactly. Up to 20 files can be merged in one operation.",
      fr: "Combinez plusieurs fichiers PDF en un seul document continu — directement dans votre navigateur, sans envoi de fichier et sans compte requis. Déposez vos fichiers dans l'ordre souhaité, puis téléchargez le résultat fusionné.\n\nLa fusion de PDF est utile pour regrouper des factures, assembler des rapports à partir de chapitres séparés, ou créer un portfolio PDF unique à partir de plusieurs sources. L'outil préserve fidèlement le contenu et la structure de pages de chaque fichier. Jusqu'à 20 fichiers peuvent être fusionnés en une seule opération."
    },
    faqs: {
      en: [
    { q: "How many PDF files can I merge at once?", a: "You can merge up to 20 PDF files in a single operation. If you need to combine more, merge them in batches — merge the first group, download the result, then upload it again with the remaining files." },
    { q: "Can I change the order of pages when merging?", a: "Yes. Before clicking Merge, you can drag the files in the upload list to change their order. The merged PDF will contain the pages in the sequence you specify." },
    { q: "Will the merged PDF be larger than the individual files combined?", a: "The merged PDF will typically be approximately equal in size to the sum of the input files. A small overhead from the merged PDF's internal structure may add a few KB. Use the Compress PDF tool to reduce the size of the merged result." },
    { q: "Can I merge password-protected PDFs?", a: "PDFs protected with a user password (required to open) cannot be merged directly. Use the Unlock PDF tool first to remove the password, then merge. Owner-restricted PDFs may merge without issues." },
    { q: "Is Merge PDF free?", a: "Yes. EverydayTools Hub Merge PDF is completely free, no account required, and no watermarks are added to the output." },
      ],
      fr: [
        { q: "Comment fusionner des fichiers PDF en ligne gratuitement ?", a: "Téléversez vos fichiers PDF dans l'outil Fusionner PDFs d'EverydayTools Hub, arrangez-les dans l'ordre souhaité et cliquez sur Fusionner. Le PDF combiné se télécharge en quelques secondes — sans envoi serveur, sans compte." },
    { q: "Combien de fichiers PDF puis-je fusionner à la fois ?", a: "Vous pouvez fusionner jusqu'à 20 fichiers PDF en une seule opération. Pour en combiner davantage, fusionnez par lots — fusionnez le premier groupe, téléchargez le résultat, puis téléversez-le avec les fichiers restants." },
    { q: "Puis-je changer l'ordre des pages lors de la fusion ?", a: "Oui. Avant de cliquer sur Fusionner, vous pouvez faire glisser les fichiers dans la liste pour changer leur ordre. Le PDF fusionné contiendra les pages dans la séquence que vous avez spécifiée." },
    { q: "Le PDF fusionné sera-t-il plus grand que les fichiers individuels ?", a: "Le PDF fusionné sera généralement approximativement égal en taille à la somme des fichiers d'entrée. Utilisez l'outil Compresser PDF pour réduire la taille du résultat fusionné." },
    { q: "Puis-je fusionner des PDF protégés par mot de passe ?", a: "Les PDF protégés par un mot de passe d'ouverture ne peuvent pas être fusionnés directement. Utilisez d'abord l'outil Déverrouiller PDF pour supprimer le mot de passe, puis fusionnez." },
    { q: "Fusionner PDF est-il gratuit ?", a: "Oui. L'outil Fusionner PDFs d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane ajouté." },
      ],
    },
  },
  {
    internalSlug: "pdf-split",
    slugs: { en: "split-pdf", fr: "diviser-pdf" },
    title: { en: "Split PDF Online Free — No Signup | EverydayTools Hub", fr: "Diviser un PDF en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Split PDF", fr: "Diviser un PDF" },
    description: { en: "Split a PDF into individual pages or custom page ranges in your browser. Free, no upload to servers, no account needed.", fr: "Divisez un PDF en pages individuelles ou en plages personnalisées dans votre navigateur. Gratuit, sans envoi serveur, sans compte." },
    keywords: { en: ["split pdf online free", "split pdf into pages", "pdf splitter", "extract pages from pdf", "separate pdf pages", "cut pdf online free"], fr: ["diviser pdf en ligne gratuit", "séparer pages pdf", "diviseur pdf", "extraire pages pdf", "couper pdf en ligne", "fractionner pdf"] },
    relatedTools: ["pdf-merge", "pdf-compress", "pdf-rotate", "reorder-pdf", "pdf-page-numbers"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF. Files up to 50 MB are supported." },
        { name: "Select pages or ranges", text: "Choose to extract all pages individually, or specify a custom range like '1-3, 5, 8-10'." },
        { name: "Download the split files", text: "Click Split. Individual PDF files download as a ZIP archive." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Sélectionnez les pages", text: "Choisissez d'extraire toutes les pages individuellement ou spécifiez une plage personnalisée comme '1-3, 5, 8-10'." },
        { name: "Téléchargez les fichiers divisés", text: "Cliquez sur Diviser. Les fichiers PDF individuels se téléchargent dans une archive ZIP." },
      ],
    },
    about: {
      en: "Extract specific pages from a PDF or break a large document into individual pages — in seconds, right in your browser. No signup, no server, no wait. Drop your PDF, choose your split point, and download the pieces you need.\n\nThe tool supports splitting by individual pages or custom page ranges. Use it to pull a single chapter from a report, extract a form from a multi-page PDF, or separate a scanned booklet into individual sheets. Output files are packaged in a ZIP for convenient download.",
      fr: "Extrayez des pages précises d'un PDF ou découpez un document volumineux en pages individuelles — en quelques secondes, directement dans votre navigateur. Sans inscription, sans serveur, sans attente. Déposez votre PDF, choisissez votre découpe, et téléchargez les parties dont vous avez besoin.\n\nL'outil prend en charge la division par pages individuelles ou plages de pages personnalisées. Utilisez-le pour extraire un chapitre d'un rapport, récupérer un formulaire dans un PDF multi-pages, ou séparer un livret numérisé en feuilles individuelles. Les fichiers de sortie sont regroupés dans un ZIP."
    },
    faqs: {
      en: [
    { q: "Can I extract only specific pages from a PDF?", a: "Yes. Enter a custom page range in the range field — for example '1-3, 5, 8-10' — before clicking Split. The tool will extract only those pages into separate PDF files." },
    { q: "What format are the split files delivered in?", a: "Split files are downloaded as a ZIP archive containing individual .pdf files. You can unzip this with any standard archive utility on Windows, macOS, or Linux." },
    { q: "Is there a page limit for splitting?", a: "The tool accepts PDFs up to 50 MB and can split PDFs with hundreds of pages. Processing time increases with larger files, but all processing happens in your browser." },
    { q: "Can I split a password-protected PDF?", a: "PDFs protected with a user (open) password cannot be processed. Remove the password first using the Unlock PDF tool, then split the unlocked version." },
    { q: "Is Split PDF free?", a: "Yes. EverydayTools Hub Split PDF is completely free, with no account required and no watermarks on the output files." },
      ],
      fr: [
        { q: "Comment diviser un PDF en pages séparées gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Diviser PDF d'EverydayTools Hub, choisissez 'Toutes les pages' et cliquez sur Diviser. Une archive ZIP avec toutes les pages individuelles se télécharge — sans compte, sans envoi serveur." },
    { q: "Puis-je extraire uniquement des pages spécifiques d'un PDF ?", a: "Oui. Entrez une plage de pages personnalisée dans le champ — par exemple '1-3, 5, 8-10' — avant de cliquer sur Diviser. L'outil extraira uniquement ces pages en fichiers PDF séparés." },
    { q: "Dans quel format les fichiers divisés sont-ils livrés ?", a: "Les fichiers divisés sont téléchargés dans une archive ZIP contenant des fichiers .pdf individuels. Vous pouvez décompresser cette archive avec n'importe quel utilitaire standard." },
    { q: "Y a-t-il une limite de pages pour la division ?", a: "L'outil accepte les PDF jusqu'à 50 Mo et peut diviser des PDF de plusieurs centaines de pages. Le temps de traitement augmente avec les fichiers plus volumineux." },
    { q: "Puis-je diviser un PDF protégé par mot de passe ?", a: "Les PDF protégés par un mot de passe d'ouverture ne peuvent pas être traités. Supprimez d'abord le mot de passe avec l'outil Déverrouiller PDF, puis divisez la version déverrouillée." },
    { q: "Diviser PDF est-il gratuit ?", a: "Oui. L'outil Diviser PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane sur les fichiers de sortie." },
      ],
    },
  },
  {
    internalSlug: "pdf-rotate",
    slugs: { en: "rotate-pdf", fr: "pivoter-pdf" },
    title: { en: "Rotate PDF Pages Online Free — No Signup | EverydayTools Hub", fr: "Pivoter Pages PDF en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Rotate PDF Pages", fr: "Pivoter les pages d'un PDF" },
    description: { en: "Rotate PDF pages 90, 180, or 270 degrees in your browser. Free, no upload, no account. Fix upside-down or sideways PDF pages instantly.", fr: "Faites pivoter les pages PDF de 90, 180 ou 270 degrés dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["rotate pdf online free", "rotate pdf pages", "pdf rotator", "fix upside down pdf", "turn pdf pages", "rotate pdf 90 degrees"], fr: ["pivoter pdf en ligne gratuit", "faire pivoter pages pdf", "rotation pdf", "redresser pdf", "corriger orientation pdf", "tourner pages pdf"] },
    relatedTools: ["pdf-merge", "pdf-split", "pdf-compress", "reorder-pdf", "pdf-page-numbers"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file into the drop zone." },
        { name: "Choose rotation", text: "Select 90°, 180°, or 270° clockwise rotation, and whether to apply it to all pages or specific ones." },
        { name: "Download the rotated PDF", text: "Click Rotate. Your PDF with corrected page orientations downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PDF." },
        { name: "Choisissez la rotation", text: "Sélectionnez 90°, 180° ou 270° dans le sens des aiguilles d'une montre, et si vous souhaitez appliquer la rotation à toutes les pages ou à des pages spécifiques." },
        { name: "Téléchargez le PDF pivoté", text: "Cliquez sur Pivoter. Votre PDF avec les orientations de pages corrigées se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Fix sideways or upside-down pages in any PDF — instantly, in your browser. Rotate all pages at once, or select specific pages by number. The corrected PDF downloads immediately, with no quality loss and no server involved.\n\nRotation values of 90°, 180°, and 270° are all supported. The adjustment is applied directly to the page orientation metadata, so text remains fully searchable and the file size stays unchanged.",
      fr: "Corrigez les pages de travers ou à l'envers dans n'importe quel PDF — instantanément, dans votre navigateur. Faites pivoter toutes les pages à la fois, ou sélectionnez des pages spécifiques par numéro. Le PDF corrigé se télécharge immédiatement, sans perte de qualité et sans serveur.\n\nLes valeurs de rotation de 90°, 180° et 270° sont toutes prises en charge. L'ajustement est appliqué directement aux métadonnées d'orientation de la page — le texte reste entièrement sélectionnable et la taille du fichier est inchangée."
    },
    faqs: {
      en: [
    { q: "Can I rotate only specific pages in my PDF?", a: "Yes. You can specify individual page numbers or ranges to rotate only certain pages, leaving the rest unchanged. This is useful when only some pages have incorrect orientation in an otherwise correct document." },
    { q: "Will rotating a PDF reduce its quality?", a: "No. PDF rotation applies orientation metadata to pages — it does not re-render or re-encode the content. Text remains fully searchable and selectable, and image quality is unchanged." },
    { q: "Can I undo the rotation?", a: "The rotation is applied when you download the file. To undo, simply re-upload the rotated PDF and rotate it by the inverse amount (for example, if you rotated 90° clockwise, rotate 270° clockwise to reverse it)." },
    { q: "Why are my scanned PDF pages sideways?", a: "When scanning on a flatbed scanner, the document sometimes goes through at the wrong angle, resulting in portrait pages being saved as landscape. The Rotate PDF tool is designed to fix exactly this — upload the scanned PDF and rotate the affected pages." },
    { q: "Is Rotate PDF free?", a: "Yes. EverydayTools Hub Rotate PDF is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment faire pivoter des pages PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Pivoter PDF d'EverydayTools Hub, sélectionnez l'angle de rotation (90°, 180° ou 270°), choisissez toutes les pages ou des pages spécifiques, et cliquez sur Pivoter. Le PDF corrigé se télécharge en quelques secondes." },
    { q: "Puis-je ne faire pivoter que des pages spécifiques ?", a: "Oui. Vous pouvez spécifier des numéros de page individuels ou des plages pour ne faire pivoter que certaines pages, en laissant les autres inchangées." },
    { q: "La rotation d'un PDF réduit-elle sa qualité ?", a: "Non. La rotation PDF applique des métadonnées d'orientation aux pages — elle ne re-rend pas le contenu. Le texte reste entièrement sélectionnable et la qualité des images est inchangée." },
    { q: "Puis-je annuler la rotation ?", a: "La rotation est appliquée lors du téléchargement du fichier. Pour l'annuler, retéléversez le PDF pivoté et faites-le pivoter du montant inverse." },
    { q: "Pourquoi les pages de mon PDF numérisé sont-elles de côté ?", a: "Lors de la numérisation sur un scanner à plat, le document passe parfois sous le mauvais angle. L'outil Pivoter PDF est conçu pour corriger exactement cela." },
    { q: "Pivoter PDF est-il gratuit ?", a: "Oui. L'outil Pivoter PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-unlock",
    slugs: { en: "unlock-pdf", fr: "deverrouiller-pdf" },
    title: { en: "Unlock PDF Online Free — Remove PDF Password | EverydayTools Hub", fr: "Déverrouiller PDF en Ligne Gratuit — Supprimer Mot de Passe PDF | EverydayTools Hub" },
    h1: { en: "Unlock PDF", fr: "Déverrouiller un PDF" },
    description: { en: "Remove owner password restrictions from PDF files in your browser. Free, no upload, no account. Unlock PDFs for editing and copying.", fr: "Supprimez les restrictions de mot de passe propriétaire des PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["unlock pdf online free", "remove pdf password", "pdf unlocker", "pdf password remover", "unlock pdf for editing", "remove pdf restrictions"], fr: ["déverrouiller pdf en ligne gratuit", "supprimer mot de passe pdf", "déverrouilleur pdf", "enlever protection pdf", "débloquer pdf", "pdf sans restriction"] },
    relatedTools: ["pdf-protect", "pdf-to-word", "pdf-compress", "metadata-cleaner", "checksum"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your locked PDF. The PDF must not require a password to open." },
        { name: "Remove restrictions", text: "The tool processes your PDF in the browser and removes the access restrictions." },
        { name: "Download the unlocked PDF", text: "Click Unlock. Your PDF without restrictions downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF verrouillé. Le PDF ne doit pas nécessiter de mot de passe pour s'ouvrir." },
        { name: "Suppression des restrictions", text: "L'outil traite votre PDF dans le navigateur et supprime les restrictions d'accès." },
        { name: "Téléchargez le PDF déverrouillé", text: "Cliquez sur Déverrouiller. Votre PDF sans restrictions se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Remove the password from a PDF so you can open, print, and copy it freely — without any software to install. EverydayTools handles the unlocking entirely in your browser, so your file never leaves your device.\n\nThis tool works on PDFs where you already know the password. It is designed to remove restrictions on files you legitimately own — such as PDFs you created yourself or received from a trusted sender.",
      fr: "Supprimez le mot de passe d'un PDF pour l'ouvrir, l'imprimer et le copier librement — sans aucun logiciel à installer. EverydayTools gère le déverrouillage entièrement dans votre navigateur, votre fichier ne quitte jamais votre appareil.\n\nCet outil fonctionne sur les PDF dont vous connaissez déjà le mot de passe. Il est conçu pour lever les restrictions sur des fichiers que vous possédez légitimement — tels que des PDF que vous avez créés vous-même ou reçus d'un expéditeur de confiance."
    },
    faqs: {
      en: [
    { q: "What is the difference between a user password and an owner password?", a: "A user password (open password) is required to open and view the PDF — you must know it to access the content. An owner password restricts what viewers can do with an already-opened PDF (editing, copying, printing). The Unlock PDF tool removes owner restrictions only." },
    { q: "Can this tool bypass a password-protected PDF I can't open?", a: "No. If the PDF requires a password to open (user password), this tool cannot bypass it. You must know the correct password. The tool only removes owner-level restrictions from PDFs that open without a password." },
    { q: "Is it legal to unlock a PDF?", a: "It depends on the context. Unlocking a PDF you own, created yourself, or have explicit permission to modify is generally legal. Bypassing restrictions on copyrighted material you are not authorised to copy may violate copyright law and the PDF creator's terms. Use this tool responsibly." },
    { q: "Will unlocking affect the content of my PDF?", a: "No. Unlocking only removes the access restrictions. The visual content, text, images, and file structure are unchanged." },
    { q: "Is Unlock PDF free?", a: "Yes. EverydayTools Hub Unlock PDF is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment supprimer un mot de passe PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Déverrouiller PDF d'EverydayTools Hub. Si le PDF a des restrictions propriétaires (mais pas de mot de passe d'ouverture), cliquez sur Déverrouiller et le PDF sans restrictions se télécharge. Sans compte, sans envoi serveur." },
    { q: "Quelle est la différence entre un mot de passe utilisateur et un mot de passe propriétaire ?", a: "Un mot de passe utilisateur est requis pour ouvrir et visualiser le PDF. Un mot de passe propriétaire restreint ce que les lecteurs peuvent faire avec un PDF déjà ouvert (édition, copie, impression). L'outil Déverrouiller PDF supprime uniquement les restrictions propriétaires." },
    { q: "Cet outil peut-il contourner un PDF protégé que je ne peux pas ouvrir ?", a: "Non. Si le PDF nécessite un mot de passe pour s'ouvrir (mot de passe utilisateur), cet outil ne peut pas le contourner. Vous devez connaître le mot de passe correct." },
    { q: "Est-il légal de déverrouiller un PDF ?", a: "Cela dépend du contexte. Déverrouiller un PDF que vous possédez, que vous avez créé vous-même ou pour lequel vous avez une autorisation explicite est généralement légal. Utilisez cet outil de manière responsable." },
    { q: "Le déverrouillage affectera-t-il le contenu de mon PDF ?", a: "Non. Le déverrouillage ne supprime que les restrictions d'accès. Le contenu visuel, le texte, les images et la structure du fichier sont inchangés." },
    { q: "Déverrouiller PDF est-il gratuit ?", a: "Oui. L'outil Déverrouiller PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-protect",
    slugs: { en: "protect-pdf", fr: "proteger-pdf" },
    title: { en: "Protect PDF with Password — Free, Online | EverydayTools Hub", fr: "Protéger PDF par Mot de Passe — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Protect PDF with Password", fr: "Protéger un PDF par Mot de Passe" },
    description: { en: "Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly.", fr: "Ajoutez une protection par mot de passe à un PDF dans votre navigateur. Sans envoi, sans compte, gratuit. Sécurisez vos PDF instantanément." },
    keywords: { en: ["protect pdf with password", "add password to pdf", "pdf password protection", "encrypt pdf online free", "lock pdf online", "secure pdf free"], fr: ["protéger pdf mot de passe", "ajouter mot de passe pdf", "chiffrer pdf en ligne", "sécuriser pdf gratuit", "verrouiller pdf en ligne", "protection pdf"] },
    relatedTools: ["pdf-unlock", "pdf-to-word", "metadata-cleaner", "checksum", "ai-text-scrubber"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF into the drop zone." },
        { name: "Set a password", text: "Enter the password you want to use to protect the PDF. Use a strong, memorable password." },
        { name: "Download the protected PDF", text: "Click Protect. Your password-protected PDF downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF." },
        { name: "Définissez un mot de passe", text: "Entrez le mot de passe que vous souhaitez utiliser pour protéger le PDF. Utilisez un mot de passe fort et mémorable." },
        { name: "Téléchargez le PDF protégé", text: "Cliquez sur Protéger. Votre PDF protégé par mot de passe se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Add a password to any PDF to control who can open it, print it, or copy its content — directly in your browser, with no file ever sent to a server. Your document and your password stay completely private.\n\nTwo layers of protection are available: an owner password restricts editing and printing, while a user password requires anyone opening the file to enter a passphrase. Use strong, unique passwords for sensitive documents — EverydayTools does not store or recover passwords.",
      fr: "Ajoutez un mot de passe à n'importe quel PDF pour contrôler qui peut l'ouvrir, l'imprimer ou en copier le contenu — directement dans votre navigateur, sans aucun fichier envoyé à un serveur. Votre document et votre mot de passe restent entièrement privés.\n\nDeux niveaux de protection sont disponibles : un mot de passe propriétaire restreint la modification et l'impression, tandis qu'un mot de passe utilisateur oblige quiconque ouvrant le fichier à saisir une phrase secrète. EverydayTools ne stocke ni ne récupère les mots de passe."
    },
    faqs: {
      en: [
    { q: "What encryption strength is used?", a: "The tool uses AES-256 encryption, which is the highest encryption level supported by the PDF 2.0 specification and is considered secure for protecting sensitive documents. AES-256 is the same standard used by governments and financial institutions." },
    { q: "Can I open the protected PDF on any device?", a: "Yes. Any standard PDF reader (Adobe Acrobat, Preview on macOS, Foxit, and built-in browser PDF viewers) supports password-protected PDFs with AES-256. You will be prompted to enter the password before the file opens." },
    { q: "What if I forget the password?", a: "If you forget the password, there is no recovery mechanism through EverydayTools Hub — we never store your password. You would need a dedicated PDF password recovery tool, which typically uses brute-force methods and is not guaranteed to work for strong passwords." },
    { q: "Does protecting a PDF add visible watermarks or restrictions?", a: "No. The Protect PDF tool adds password-only encryption. It does not add owner restrictions such as editing or printing locks unless you explicitly set them. It also adds no visible watermarks to your document." },
    { q: "Is Protect PDF free?", a: "Yes. EverydayTools Hub Protect PDF is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment ajouter un mot de passe à un PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Protéger PDF d'EverydayTools Hub, entrez le mot de passe souhaité et cliquez sur Protéger. Le PDF chiffré se télécharge immédiatement — sans envoi serveur, sans compte." },
    { q: "Quelle force de chiffrement est utilisée ?", a: "L'outil utilise le chiffrement AES-256, qui est le niveau de chiffrement le plus élevé supporté par la spécification PDF 2.0. AES-256 est la norme utilisée par les gouvernements et les institutions financières." },
    { q: "Puis-je ouvrir le PDF protégé sur n'importe quel appareil ?", a: "Oui. Tout lecteur PDF standard (Adobe Acrobat, Aperçu sur macOS, Foxit, navigateurs web) supporte les PDF protégés par mot de passe avec AES-256. Vous serez invité à saisir le mot de passe avant que le fichier s'ouvre." },
    { q: "Que se passe-t-il si j'oublie le mot de passe ?", a: "Si vous oubliez le mot de passe, il n'y a pas de mécanisme de récupération via EverydayTools Hub — nous ne stockons jamais votre mot de passe. Il faudrait utiliser un outil de récupération de mot de passe PDF dédié." },
    { q: "La protection d'un PDF ajoute-t-elle des filigranes visibles ?", a: "Non. L'outil Protéger PDF ajoute uniquement un chiffrement par mot de passe. Il n'ajoute pas de filigranes visibles à votre document." },
    { q: "Protéger PDF est-il gratuit ?", a: "Oui. L'outil Protéger PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans limites d'utilisation." },
      ],
    },
  },
  {
    internalSlug: "pdf-page-numbers",
    slugs: { en: "add-page-numbers-pdf", fr: "ajouter-numeros-page-pdf" },
    title: { en: "Add Page Numbers to PDF — Free, Online | EverydayTools Hub", fr: "Ajouter Numéros de Page PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Add Page Numbers to PDF", fr: "Ajouter des Numéros de Page à un PDF" },
    description: { en: "Add page numbers to every page of your PDF in your browser. Free, no upload, no account. Choose position, font, and starting number.", fr: "Ajoutez des numéros de page à chaque page de votre PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["add page numbers to pdf", "pdf page numbering", "number pdf pages online free", "insert page numbers pdf", "pdf header footer numbers", "paginate pdf"], fr: ["ajouter numéros de page pdf", "numérotation pages pdf", "numéroter pdf en ligne gratuit", "insérer numéros page pdf", "paginer pdf", "pagination pdf"] },
    relatedTools: ["pdf-watermark", "pdf-merge", "pdf-rotate", "pdf-protect", "pdf-compress"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF into the drop zone." },
        { name: "Configure numbering", text: "Choose the position (bottom center, bottom right, etc.), the font size, and the starting page number." },
        { name: "Download the numbered PDF", text: "Click Add Page Numbers. Your PDF with page numbers downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF." },
        { name: "Configurez la numérotation", text: "Choisissez la position (bas centre, bas droite, etc.), la taille de police et le numéro de page de départ." },
        { name: "Téléchargez le PDF numéroté", text: "Cliquez sur Ajouter des numéros de page. Votre PDF avec numéros de page se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Add clean, professional page numbers to any PDF — choosing your own position, starting number, and font size. Everything runs in your browser, so your document never leaves your device.\n\nPage numbers are embedded directly into the PDF as text, which means they appear in print and are fully searchable. Choose from bottom center, bottom right, bottom left, or top center placement. Set the starting number to any value — useful when a document begins at page 5 after a cover and table of contents.",
      fr: "Ajoutez des numéros de page clairs et professionnels à n'importe quel PDF — en choisissant la position, le numéro de départ et la taille de police. Tout s'exécute dans votre navigateur, votre document ne quitte jamais votre appareil.\n\nLes numéros de page sont intégrés directement dans le PDF en tant que texte — ils apparaissent à l'impression et sont entièrement sélectionnables. Choisissez parmi les positions bas centre, bas droite, bas gauche ou haut centre. Définissez le numéro de départ à n'importe quelle valeur — utile lorsqu'un document commence à la page 5 après une couverture et une table des matières."
    },
    faqs: {
      en: [
    { q: "Can I start page numbering from a number other than 1?", a: "Yes. The starting number field lets you specify any starting value. This is useful when your document is part of a larger work and you need page numbers to continue from where a previous section left off." },
    { q: "What positions are available for page numbers?", a: "The tool supports bottom center, bottom right, bottom left, and top center positions. These cover the most common use cases for academic papers, reports, and formal documents." },
    { q: "Will page numbers be added to all pages including the cover?", a: "By default, numbers are added to all pages. If you want to exclude the first page (a common requirement for title pages), split the PDF first using Split PDF, add numbers to the body pages, then merge back with Merge PDF." },
    { q: "Can I remove page numbers added by this tool?", a: "Numbers added by this tool are embedded as PDF text objects. They can be removed in Adobe Acrobat using the 'Edit PDF' mode, but not through EverydayTools Hub directly." },
    { q: "Is Add Page Numbers to PDF free?", a: "Yes. EverydayTools Hub Add Page Numbers is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment ajouter des numéros de page à un PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil d'EverydayTools Hub, sélectionnez la position et le numéro de départ, et cliquez sur Ajouter des numéros de page. Votre PDF numéroté se télécharge instantanément." },
    { q: "Puis-je commencer la numérotation à partir d'un numéro autre que 1 ?", a: "Oui. Le champ numéro de départ vous permet de spécifier n'importe quelle valeur de départ. Utile quand votre document fait partie d'un ouvrage plus grand et que vous devez continuer la numérotation." },
    { q: "Quelles positions sont disponibles pour les numéros de page ?", a: "L'outil supporte le bas centre, bas droite, bas gauche et haut centre. Ces positions couvrent les cas d'usage les plus courants pour les articles académiques, rapports et documents formels." },
    { q: "Les numéros de page seront-ils ajoutés à toutes les pages y compris la couverture ?", a: "Par défaut, les numéros sont ajoutés à toutes les pages. Pour exclure la première page, divisez d'abord le PDF, ajoutez des numéros aux pages intérieures, puis fusionnez." },
    { q: "Puis-je supprimer les numéros de page ajoutés par cet outil ?", a: "Les numéros ajoutés sont intégrés comme objets texte PDF. Ils peuvent être supprimés dans Adobe Acrobat en mode 'Modifier PDF'." },
    { q: "Ajouter des numéros de page est-il gratuit ?", a: "Oui. L'outil Ajouter des numéros de page d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-watermark",
    slugs: { en: "watermark-pdf", fr: "filigraner-pdf" },
    title: { en: "Add Watermark to PDF — Free, Online | EverydayTools Hub", fr: "Ajouter Filigrane PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Watermark PDF", fr: "Ajouter un Filigrane à un PDF" },
    description: { en: "Add a custom text watermark to every page of your PDF in your browser. Free, no upload, no account. Mark drafts or confidential documents.", fr: "Ajoutez un filigrane texte personnalisé à chaque page de votre PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["add watermark to pdf", "pdf watermark online free", "watermark pdf text", "stamp pdf confidential", "pdf draft watermark", "text watermark pdf"], fr: ["ajouter filigrane pdf", "filigrane pdf en ligne gratuit", "filigrane texte pdf", "tamponnage pdf confidentiel", "pdf brouillon filigrane", "watermark pdf"] },
    relatedTools: ["pdf-page-numbers", "pdf-protect", "pdf-compress", "watermark-image", "pdf-merge"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF into the drop zone." },
        { name: "Configure the watermark", text: "Enter the watermark text, choose the opacity, angle, and font size." },
        { name: "Download the watermarked PDF", text: "Click Add Watermark. Your PDF with the watermark on every page downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF." },
        { name: "Configurez le filigrane", text: "Entrez le texte du filigrane, choisissez l'opacité, l'angle et la taille de police." },
        { name: "Téléchargez le PDF filigrané", text: "Cliquez sur Ajouter un filigrane. Votre PDF avec le filigrane sur chaque page se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Stamp any text — a company name, CONFIDENTIAL, DRAFT, or a copyright notice — as a watermark across every page of your PDF. Set the opacity, angle, and color to match your needs. Everything happens in your browser, with no server and no account.\n\nThe watermark is applied as a text overlay on each page — clearly visible but not obscuring the content beneath it. Ideal for internal document review, draft distribution, or identifying sensitive materials before sharing.",
      fr: "Apposez n'importe quel texte — un nom d'entreprise, CONFIDENTIEL, BROUILLON ou une mention de droits d'auteur — en filigrane sur chaque page de votre PDF. Réglez l'opacité, l'angle et la couleur selon vos besoins. Tout se passe dans votre navigateur, sans serveur et sans compte.\n\nLe filigrane est appliqué comme une superposition de texte sur chaque page — clairement visible mais sans masquer le contenu sous-jacent. Idéal pour la révision interne de documents, la distribution de brouillons ou l'identification de documents sensibles avant partage."
    },
    faqs: {
      en: [
    { q: "Can I choose the position and size of the watermark?", a: "You can set the font size and rotation angle. The watermark is centered on each page by default, which is the standard position for document watermarks. Full custom positioning (top, bottom, corner) is not currently supported." },
    { q: "Is the watermark visible on every page?", a: "Yes. The tool applies the watermark to every page of the document. If you want to watermark only specific pages, split the PDF first, watermark those pages, then merge back." },
    { q: "Can the watermark be removed by the recipient?", a: "Text watermarks are embedded directly in the PDF and visible in all viewers. They can be removed using a professional PDF editor such as Adobe Acrobat Pro. For documents requiring tamper-proof watermarks, consider additional access controls." },
    { q: "What opacity should I use for a 'DRAFT' watermark?", a: "An opacity of 20–30% is typical for a subtle background watermark. For a more prominent notice, 40–50% is readable without obscuring the underlying content too much. Avoid opacity above 60% as it can make the document difficult to read." },
    { q: "Is Watermark PDF free?", a: "Yes. EverydayTools Hub Watermark PDF is completely free, with no account required and no additional watermarks from EverydayTools Hub itself." },
      ],
      fr: [
        { q: "Comment ajouter un filigrane à un PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Filigrane PDF d'EverydayTools Hub, tapez votre texte de filigrane (ex. 'CONFIDENTIEL'), définissez l'opacité et l'angle, et cliquez sur Ajouter un filigrane. Le PDF filigrané se télécharge instantanément." },
    { q: "Puis-je choisir la position et la taille du filigrane ?", a: "Vous pouvez définir la taille de police et l'angle de rotation. Le filigrane est centré sur chaque page par défaut, ce qui est la position standard pour les filigranes de documents." },
    { q: "Le filigrane est-il visible sur chaque page ?", a: "Oui. L'outil applique le filigrane à chaque page du document. Pour ne filigraner que des pages spécifiques, divisez d'abord le PDF, filigranez ces pages, puis fusionnez." },
    { q: "Le filigrane peut-il être supprimé par le destinataire ?", a: "Les filigranes texte sont intégrés directement dans le PDF et visibles dans tous les lecteurs. Ils peuvent être supprimés avec un éditeur PDF professionnel comme Adobe Acrobat Pro." },
    { q: "Quelle opacité utiliser pour un filigrane 'BROUILLON' ?", a: "Une opacité de 20 à 30 % est typique pour un filigrane subtil en arrière-plan. Pour un avis plus visible, 40 à 50 % est lisible sans trop masquer le contenu sous-jacent." },
    { q: "Filigrane PDF est-il gratuit ?", a: "Oui. L'outil Filigrane PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane supplémentaire d'EverydayTools Hub." },
      ],
    },
  },

  // ─── WORD & DOCS ─────────────────────────────────────────────────────────────
  {
    internalSlug: "word-to-text",
    slugs: { en: "convert-word-to-text", fr: "convertir-word-en-texte" },
    title: { en: "Word to Text Converter — Free, Online | EverydayTools Hub", fr: "Convertir Word en Texte — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Word to Text Converter", fr: "Convertisseur Word en Texte" },
    description: { en: "Extract plain text from Word (DOCX) files in your browser. Free, no upload, no account. Download as TXT instantly.", fr: "Extrayez le texte brut de fichiers Word (DOCX) dans votre navigateur. Gratuit, sans envoi, sans compte. Téléchargez en TXT instantanément." },
    keywords: { en: ["word to text converter", "extract text from docx", "docx to txt online free", "convert word to plain text", "word to txt", "docx text extraction"], fr: ["convertir word en texte", "extraire texte docx", "word en txt gratuit", "word vers texte brut", "docx to txt", "extraction texte word"] },
    relatedTools: ["pdf-to-text", "word-to-html", "txt-to-docx", "word-to-pdf", "word-to-markdown"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file. .docx format is supported." },
        { name: "Extract text", text: "The tool reads your Word document in the browser and extracts all text content." },
        { name: "Download as TXT", text: "Click Convert. A plain .txt file downloads to your device." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word. Le format .docx est supporté." },
        { name: "Extraction du texte", text: "L'outil analyse votre document Word dans le navigateur et en extrait tout le texte." },
        { name: "Téléchargez en TXT", text: "Cliquez sur Convertir. Un fichier .txt brut se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "Strip a Word document down to pure, clean text — removing all formatting, styles, and layout in one step. EverydayTools does this directly in your browser, so your DOCX file never touches a server.\n\nUseful for copying content into a CMS, stripping formatting before pasting into another document, or extracting text for analysis. The output is a plain TXT file with the full text content of your document, with line breaks and paragraph structure preserved.",
      fr: "Réduisez un document Word à du texte pur et propre — en supprimant toute mise en forme, style et mise en page en une seule étape. EverydayTools effectue cette opération directement dans votre navigateur, votre fichier DOCX ne touche jamais un serveur.\n\nUtile pour copier du contenu dans un CMS, nettoyer la mise en forme avant de coller dans un autre document, ou extraire du texte à des fins d'analyse. Le résultat est un fichier TXT brut avec tout le contenu textuel de votre document, sauts de ligne et structure des paragraphes préservés."
    },
    faqs: {
      en: [
    { q: "Does the converter support .doc files as well as .docx?", a: "The converter supports the modern .docx format (Word 2007 and later). Older .doc files from Word 97–2003 are not supported. To convert a .doc file, open it in Microsoft Word or LibreOffice and save it as .docx first." },
    { q: "Will the formatting be preserved in the text output?", a: "No. The Word to Text output is plain text with paragraph breaks only. Font styles, bold, italic, tables, images, and page layout are stripped. This is by design — plain text has no concept of formatting." },
    { q: "Are images in the Word document included in the output?", a: "No. Images are binary objects embedded in the DOCX and cannot be represented in plain text. Only text content from paragraphs, headings, and text boxes is extracted." },
    { q: "What is the maximum file size?", a: "The converter accepts DOCX files up to 50 MB. Most Word documents are well under this limit unless they contain many embedded images." },
    { q: "Is Word to Text Converter free?", a: "Yes. EverydayTools Hub Word to Text Converter is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment extraire du texte d'un document Word gratuitement ?", a: "Téléversez votre fichier DOCX dans le convertisseur Word en Texte d'EverydayTools Hub et cliquez sur Convertir. L'outil analyse votre document Word dans le navigateur pour en extraire tout le texte." },
    { q: "Le convertisseur supporte-t-il les fichiers .doc ainsi que .docx ?", a: "Le convertisseur supporte le format moderne .docx (Word 2007 et ultérieur). Les anciens fichiers .doc de Word 97–2003 ne sont pas supportés. Pour convertir un fichier .doc, ouvrez-le dans Word ou LibreOffice et enregistrez-le en .docx." },
    { q: "La mise en forme sera-t-elle préservée dans la sortie texte ?", a: "Non. La sortie est du texte brut avec uniquement des sauts de paragraphe. Les styles de police, les tableaux, les images et la mise en page sont supprimés." },
    { q: "Les images du document Word sont-elles incluses dans la sortie ?", a: "Non. Les images sont des objets binaires intégrés dans le DOCX et ne peuvent pas être représentées en texte brut." },
    { q: "Quelle est la taille maximale des fichiers ?", a: "Le convertisseur accepte les fichiers DOCX jusqu'à 50 Mo." },
    { q: "Le convertisseur Word en Texte est-il gratuit ?", a: "Oui. Le convertisseur Word en Texte d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans limites d'utilisation." },
      ],
    },
  },
  {
    internalSlug: "word-to-html",
    slugs: { en: "convert-word-to-html", fr: "convertir-word-en-html" },
    title: { en: "Word to HTML Converter — Free, Online | EverydayTools Hub", fr: "Convertir Word en HTML — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Word to HTML Converter", fr: "Convertisseur Word en HTML" },
    description: { en: "Convert Word (DOCX) documents to clean HTML markup in your browser. Free, no upload, no account. Ideal for web publishing.", fr: "Convertissez des documents Word (DOCX) en HTML propre dans votre navigateur. Gratuit, sans envoi, sans compte. Idéal pour la publication web." },
    keywords: { en: ["word to html converter", "docx to html online free", "convert word to html", "word document to web page", "docx html conversion", "word to html free"], fr: ["convertir word en html", "docx en html gratuit", "word vers html en ligne", "document word en page web", "word html conversion", "docx to html"] },
    relatedTools: ["pdf-to-html", "word-to-text", "html-to-pdf", "word-to-markdown", "html-formatter"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file into the drop zone." },
        { name: "Convert to HTML", text: "The tool converts your Word document to clean HTML in the browser, preserving headings, bold text, and lists." },
        { name: "Download the HTML file", text: "Click Convert. An .html file downloads, ready to publish or edit." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word." },
        { name: "Conversion en HTML", text: "L'outil convertit votre document Word en HTML propre dans le navigateur, en préservant titres, gras et listes." },
        { name: "Téléchargez le fichier HTML", text: "Cliquez sur Convertir. Un fichier .html se télécharge, prêt à être publié ou édité." },
      ],
    },
    about: {
      en: "Convert a Word document into clean HTML you can publish directly on a website or CMS. EverydayTools handles the conversion in your browser — no upload, no account, instant download.\n\nHeadings, paragraphs, bold, italic, and lists all map to proper HTML elements. The result is clean and ready to style with CSS. Review the output before publishing — complex Word formatting, embedded images, or custom styles may not translate perfectly to HTML.",
      fr: "Convertissez un document Word en HTML propre, publiable directement sur un site web ou un CMS. EverydayTools effectue la conversion dans votre navigateur — sans téléversement, sans compte, téléchargement instantané.\n\nLes titres, paragraphes, gras, italiques et listes sont tous traduits en éléments HTML appropriés. Le résultat est propre et prêt à être stylisé avec du CSS. Vérifiez le résultat avant publication — les mises en forme complexes, images intégrées ou styles Word personnalisés peuvent ne pas se traduire parfaitement en HTML."
    },
    faqs: {
      en: [
    { q: "Does the HTML output include Word styles and formatting?", a: "Semantic structure (headings, bold, italic, lists, links) is preserved. Visual styles (custom fonts, colors, complex layouts, text boxes, page borders) are not included. The output is clean semantic HTML without inline styles." },
    { q: "Are images from the Word document included?", a: "No. Images are not embedded in the HTML output. If your document has images you need in the web version, you will need to extract them separately and add `<img>` tags to the HTML manually." },
    { q: "Can I paste the HTML output directly into a CMS?", a: "Yes. The output is clean semantic HTML that can be pasted into the HTML/source view of WordPress, Drupal, Notion, or any CMS that accepts HTML input." },
    { q: "Does it support .doc files?", a: "Only the .docx format (Word 2007 and later) is supported. Open old .doc files in Microsoft Word or LibreOffice and save as .docx first." },
    { q: "Is Word to HTML Converter free?", a: "Yes. EverydayTools Hub Word to HTML Converter is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment convertir un document Word en HTML gratuitement ?", a: "Téléversez votre DOCX dans le convertisseur Word en HTML d'EverydayTools Hub et cliquez sur Convertir. L'outil convertit votre document en HTML propre dans votre navigateur." },
    { q: "La sortie HTML inclut-elle les styles et la mise en forme Word ?", a: "La structure sémantique (titres, gras, italique, listes, liens) est préservée. Les styles visuels (polices personnalisées, couleurs, mises en page complexes) ne sont pas inclus." },
    { q: "Les images du document Word sont-elles incluses ?", a: "Non. Les images ne sont pas intégrées dans la sortie HTML. Si votre document contient des images, vous devrez les extraire séparément et ajouter des balises `<img>` manuellement." },
    { q: "Puis-je coller directement la sortie HTML dans un CMS ?", a: "Oui. La sortie est un HTML sémantique propre qui peut être collé dans la vue HTML/source de WordPress, Drupal, Notion ou tout CMS acceptant une entrée HTML." },
    { q: "Supporte-t-il les fichiers .doc ?", a: "Seul le format .docx (Word 2007 et ultérieur) est supporté. Ouvrez les anciens fichiers .doc dans Word ou LibreOffice et enregistrez-les en .docx." },
    { q: "Le convertisseur Word en HTML est-il gratuit ?", a: "Oui. Le convertisseur Word en HTML d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "word-to-epub",
    slugs: { en: "convert-word-to-epub", fr: "convertir-word-en-epub" },
    title: { en: "Word to EPUB Converter — Free, Online | EverydayTools Hub", fr: "Convertir Word en EPUB — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Word to EPUB Converter", fr: "Convertisseur Word en EPUB" },
    description: { en: "Convert Word (DOCX) documents to EPUB e-book format in your browser. Free, no upload, no account. Read your Word docs on any e-reader.", fr: "Convertissez des documents Word (DOCX) en e-books EPUB dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["word to epub converter", "docx to epub online free", "convert word to epub", "word to ebook", "docx epub conversion", "word to kindle"], fr: ["convertir word en epub", "docx en epub gratuit", "word vers epub en ligne", "word en ebook", "docx epub conversion", "word to epub"] },
    relatedTools: ["pdf-to-epub", "word-to-text", "word-to-html", "word-to-markdown", "markdown-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file into the drop zone." },
        { name: "Convert to EPUB", text: "The tool extracts text from the DOCX in your browser and packages it as a standard EPUB e-book file." },
        { name: "Download the EPUB", text: "Click Convert. Your .epub file downloads, ready to transfer to any e-reader." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word." },
        { name: "Conversion en EPUB", text: "L'outil extrait le texte du DOCX dans votre navigateur et prépare un fichier e-book EPUB." },
        { name: "Téléchargez l'EPUB", text: "Cliquez sur Convertir. Votre fichier .epub se télécharge, prêt à être transféré sur n'importe quelle liseuse." },
      ],
    },
    about: {
      en: "Turn a Word document into a reflowable EPUB e-book in seconds. EPUB adapts to any screen size and font preference — unlike fixed PDF pages, it is genuinely comfortable to read on phones, tablets, and dedicated e-readers. Your file never leaves your device.\n\nEPUB 3 output is supported by Kobo, Apple Books, Nook, and most reading apps. Kindle users on firmware 5.16.2.1 or later can open it natively. For older Kindles, a free tool like Calibre converts EPUB to MOBI in seconds.",
      fr: "Transformez un document Word en e-book EPUB à flux dynamique en quelques secondes. L'EPUB s'adapte à n'importe quelle taille d'écran et préférence de police — contrairement aux pages PDF fixes, il est vraiment confortable à lire sur téléphone, tablette et liseuse. Votre fichier ne quitte jamais votre appareil.\n\nLa sortie EPUB 3 est prise en charge par Kobo, Apple Books, Nook et la plupart des applications de lecture. Les utilisateurs Kindle avec le firmware 5.16.2.1 ou ultérieur peuvent l'ouvrir nativement. Pour les anciens Kindle, un outil gratuit comme Calibre convertit l'EPUB en MOBI en quelques secondes."
    },
    faqs: {
      en: [
    { q: "Will the formatting be preserved in the EPUB?", a: "Basic structure such as headings, paragraphs, and bold/italic text is preserved. Complex formatting like custom fonts, page layouts, tables, and embedded images may not transfer fully, as EPUB uses its own reflowable layout system." },
    { q: "Can I read the EPUB on my Kindle?", a: "Kindle devices with firmware 5.16.2.1 or later support EPUB natively. For older Kindles, use the free Calibre app to convert to MOBI format, then side-load to your Kindle via USB." },
    { q: "Does this work with .doc files?", a: "Only the modern .docx format (Word 2007+) is supported. Save old .doc files as .docx in Word or LibreOffice first." },
    { q: "What is the difference between EPUB and PDF for e-readers?", a: "PDF pages have fixed dimensions and layout — they don't adapt to screen size, which makes them difficult to read on small e-reader screens without zooming and scrolling. EPUB text reflows to fit any screen, making it the preferred format for e-readers." },
    { q: "Is Word to EPUB Converter free?", a: "Yes. EverydayTools Hub Word to EPUB Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir un document Word en EPUB gratuitement ?", a: "Téléversez votre DOCX dans le convertisseur Word en EPUB d'EverydayTools Hub et cliquez sur Convertir. L'outil extrait le texte et l'empaquète en EPUB 3 dans votre navigateur." },
    { q: "La mise en forme sera-t-elle préservée dans l'EPUB ?", a: "La structure de base comme les titres, paragraphes et texte en gras/italique est préservée. La mise en forme complexe comme les polices personnalisées, mises en page, tableaux et images intégrées peut ne pas être entièrement transférée." },
    { q: "Puis-je lire l'EPUB sur ma Kindle ?", a: "Les appareils Kindle avec le firmware 5.16.2.1 ou supérieur supportent l'EPUB nativement. Pour les anciens Kindle, utilisez l'application gratuite Calibre pour convertir en MOBI." },
    { q: "Cela fonctionne-t-il avec les fichiers .doc ?", a: "Seul le format .docx moderne (Word 2007+) est supporté. Enregistrez d'abord les anciens fichiers .doc en .docx dans Word ou LibreOffice." },
    { q: "Quelle est la différence entre EPUB et PDF pour les liseuses ?", a: "Les pages PDF ont des dimensions fixes et ne s'adaptent pas à la taille de l'écran, ce qui les rend difficiles à lire sur de petits écrans. Le texte EPUB s'adapte à n'importe quel écran." },
    { q: "Le convertisseur Word en EPUB est-il gratuit ?", a: "Oui. Le convertisseur Word en EPUB d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "markdown-to-pdf",
    slugs: { en: "convert-markdown-to-pdf", fr: "convertir-markdown-en-pdf" },
    title: { en: "Markdown to PDF Converter — Free, Online | EverydayTools Hub", fr: "Convertir Markdown en PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Markdown to PDF Converter", fr: "Convertisseur Markdown en PDF" },
    description: { en: "Convert Markdown (.md) files to PDF in your browser. Free, no upload, no account. Render your Markdown as a clean, printable PDF.", fr: "Convertissez des fichiers Markdown (.md) en PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["markdown to pdf converter", "md to pdf online free", "convert markdown to pdf", "markdown pdf generator", "render markdown as pdf", "md pdf free"], fr: ["convertir markdown en pdf", "md en pdf gratuit", "markdown vers pdf en ligne", "générateur pdf markdown", "rendre markdown en pdf", "markdown pdf"] },
    relatedTools: ["txt-to-pdf", "markdown-to-docx", "html-to-pdf", "word-to-markdown", "html-to-markdown"],
    howItWorks: {
      en: [
        { name: "Upload your Markdown file", text: "Click the upload area or drag your .md file into the drop zone." },
        { name: "Render to PDF", text: "The tool processes your Markdown and renders it as a polished, print-ready PDF." },
        { name: "Download the PDF", text: "Click Convert. Your PDF downloads with clean typographic formatting." },
      ],
      fr: [
        { name: "Téléversez votre fichier Markdown", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .md." },
        { name: "Rendu en PDF", text: "L'outil traite votre Markdown et le rend en PDF avec une mise en forme soignée." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF se télécharge avec une mise en forme typographique propre." },
      ],
    },
    about: {
      en: "Convert a Markdown file into a polished PDF document — ideal for technical writers, developers, and anyone who writes in plain text and needs a shareable, print-ready output. The conversion runs entirely in your browser, with no upload to any server.\n\nMarkdown formatting — headings, paragraphs, bold, italic, lists, and code blocks — is faithfully rendered in the PDF. The output uses clean, professional typography. For an editable Word document instead, use the Markdown to Word converter.",
      fr: "Convertissez un fichier Markdown en document PDF soigné — idéal pour les rédacteurs techniques, développeurs et tous ceux qui écrivent en texte brut et ont besoin d'un résultat partageable et prêt à imprimer. La conversion s'effectue entièrement dans votre navigateur, sans envoi à un serveur.\n\nLa mise en forme Markdown — titres, paragraphes, gras, italique, listes et blocs de code — est fidèlement rendue dans le PDF. Le résultat utilise une typographie propre et professionnelle. Pour un document Word modifiable, utilisez le convertisseur Markdown en Word."
    },
    faqs: {
      en: [
    { q: "What Markdown syntax is supported?", a: "Standard Markdown is fully supported: headings (#, ##, ###), bold (**text**), italic (*text*), code blocks (```), inline code, blockquotes (>), unordered lists (-), ordered lists (1.), horizontal rules (---), and links ([text](url))." },
    { q: "Are GitHub Flavored Markdown (GFM) features supported?", a: "Basic GFM features like fenced code blocks and task lists may be supported. Tables are rendered as HTML tables in the PDF. Mermaid diagrams and other extended syntax features are not supported." },
    { q: "Can I convert a README.md file to PDF?", a: "Yes. README.md files use standard Markdown syntax and convert well with this tool. Links and images from relative paths will not resolve, but the text and structure will render correctly." },
    { q: "Can I customise the PDF styling?", a: "The current tool applies a default clean typographic style. Custom CSS styling is not supported in the browser-based version." },
    { q: "Is Markdown to PDF Converter free?", a: "Yes. EverydayTools Hub Markdown to PDF Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir du Markdown en PDF gratuitement ?", a: "Téléversez votre fichier .md dans le convertisseur Markdown en PDF d'EverydayTools Hub et cliquez sur Convertir. L'outil rend votre Markdown en PDF stylisé dans votre navigateur." },
    { q: "Quelle syntaxe Markdown est supportée ?", a: "Le Markdown standard est entièrement supporté : titres (#, ##, ###), gras (**texte**), italique (*texte*), blocs de code (```), citations (>), listes, règles horizontales (---) et liens." },
    { q: "Les fonctionnalités GitHub Flavored Markdown (GFM) sont-elles supportées ?", a: "Les fonctionnalités GFM de base comme les blocs de code délimités et les listes de tâches peuvent être supportées. Les tableaux sont rendus en tableaux HTML dans le PDF." },
    { q: "Puis-je convertir un fichier README.md en PDF ?", a: "Oui. Les fichiers README.md utilisent la syntaxe Markdown standard et se convertissent bien avec cet outil." },
    { q: "Puis-je personnaliser le style du PDF ?", a: "L'outil actuel applique un style typographique propre par défaut. La personnalisation CSS n'est pas supportée dans la version navigateur." },
    { q: "Le convertisseur Markdown en PDF est-il gratuit ?", a: "Oui. Le convertisseur Markdown en PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "markdown-to-docx",
    slugs: { en: "convert-markdown-to-word", fr: "convertir-markdown-en-word" },
    title: { en: "Markdown to Word Converter — Free, Online | EverydayTools Hub", fr: "Convertir Markdown en Word — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Markdown to Word Converter", fr: "Convertisseur Markdown en Word" },
    description: { en: "Convert Markdown (.md) to Word (DOCX) in your browser. Free, no upload, no account. Edit your Markdown in Microsoft Word instantly.", fr: "Convertissez du Markdown (.md) en Word (DOCX) dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["markdown to word converter", "md to docx online free", "convert markdown to docx", "markdown word document", "md to word free", "markdown docx conversion"], fr: ["convertir markdown en word", "md en docx gratuit", "markdown vers word", "markdown document word", "md to docx", "markdown word gratuit"] },
    relatedTools: ["markdown-to-pdf", "txt-to-docx", "word-to-text", "word-to-markdown", "html-to-markdown"],
    howItWorks: {
      en: [
        { name: "Upload your Markdown file", text: "Click the upload area or drag your .md file." },
        { name: "Convert to DOCX", text: "The tool parses your Markdown and builds a Word document structure in the browser." },
        { name: "Download the DOCX", text: "Click Convert. Your .docx file downloads, ready to open in Microsoft Word or Google Docs." },
      ],
      fr: [
        { name: "Téléversez votre fichier Markdown", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .md." },
        { name: "Conversion en DOCX", text: "L'outil analyse votre Markdown et construit une structure de document Word dans le navigateur." },
        { name: "Téléchargez le DOCX", text: "Cliquez sur Convertir. Votre fichier .docx se télécharge, prêt à être ouvert dans Word ou Google Docs." },
      ],
    },
    about: {
      en: "Write in Markdown, deliver in Word. This converter turns your Markdown file into a properly formatted DOCX document that colleagues can open, review, and comment on in Microsoft Word or Google Docs. Everything happens in your browser — no upload, no account.\n\nHeadings, bold, italic, lists, and inline code all map correctly to Word styles. The resulting document is clean and ready to use. For PDF output instead, use the Markdown to PDF converter.",
      fr: "Écrivez en Markdown, livrez en Word. Ce convertisseur transforme votre fichier Markdown en document DOCX correctement formaté que vos collègues peuvent ouvrir, réviser et commenter dans Microsoft Word ou Google Docs. Tout se passe dans votre navigateur — sans téléversement, sans compte.\n\nLes titres, le gras, l'italique, les listes et le code en ligne sont tous convertis en styles Word appropriés. Le document obtenu est propre et prêt à l'emploi. Pour une sortie PDF, utilisez le convertisseur Markdown en PDF."
    },
    faqs: {
      en: [
    { q: "What Markdown elements are converted to Word styles?", a: "Headings (# through ####) become Word Heading 1–4 styles. Bold becomes strong, italic becomes emphasis, lists become Word bullet or numbered lists, and code blocks become monospace code text. Paragraph breaks are preserved." },
    { q: "Can I edit the resulting Word document?", a: "Yes. The output is a standard .docx file that can be opened and edited in Microsoft Word, Google Docs, LibreOffice Writer, or any DOCX-compatible application." },
    { q: "Are links and images preserved?", a: "Inline links are converted to Word hyperlinks. Images referenced by URL are not embedded — only the alt text is kept. Images from local file paths are not supported in the browser-based conversion." },
    { q: "Is there a file size limit?", a: "The tool processes the Markdown source text, which is typically very small. The limit of 50 MB applies, but Markdown files are rarely larger than a few hundred KB." },
    { q: "Is Markdown to Word Converter free?", a: "Yes. EverydayTools Hub Markdown to Word Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir du Markdown en Word gratuitement ?", a: "Téléversez votre fichier .md dans le convertisseur Markdown en Word d'EverydayTools Hub et cliquez sur Convertir. L'outil construit un fichier DOCX à partir de votre Markdown dans votre navigateur." },
    { q: "Quels éléments Markdown sont convertis en styles Word ?", a: "Les titres (# à ####) deviennent des styles Word Titre 1–4. Le gras devient fort, l'italique devient emphase, les listes deviennent des listes Word à puces ou numérotées." },
    { q: "Puis-je modifier le document Word résultant ?", a: "Oui. La sortie est un fichier .docx standard qui peut être ouvert et modifié dans Word, Google Docs ou LibreOffice Writer." },
    { q: "Les liens et images sont-ils préservés ?", a: "Les liens en ligne sont convertis en hyperliens Word. Les images référencées par URL ne sont pas intégrées — seul le texte alt est conservé." },
    { q: "Y a-t-il une limite de taille de fichier ?", a: "L'outil traite le texte source Markdown, qui est généralement très petit. La limite de 50 Mo s'applique, mais les fichiers Markdown dépassent rarement quelques centaines de Ko." },
    { q: "Le convertisseur Markdown en Word est-il gratuit ?", a: "Oui. Le convertisseur Markdown en Word d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "html-to-pdf",
    slugs: { en: "convert-html-to-pdf", fr: "convertir-html-en-pdf" },
    title: { en: "HTML to PDF Converter — Free, Online | EverydayTools Hub", fr: "Convertir HTML en PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "HTML to PDF Converter", fr: "Convertisseur HTML en PDF" },
    description: { en: "Convert HTML code or snippets to PDF in your browser. Free, no upload, no account. Export web content as a printable PDF.", fr: "Convertissez du code HTML en PDF dans votre navigateur. Gratuit, sans envoi, sans compte. Exportez du contenu web en PDF imprimable." },
    keywords: { en: ["html to pdf converter", "convert html to pdf online free", "html pdf generator", "save html as pdf", "web page to pdf", "html to pdf free"], fr: ["convertir html en pdf", "html en pdf gratuit", "générateur pdf html", "enregistrer html en pdf", "page web en pdf", "html vers pdf en ligne"] },
    relatedTools: ["word-to-html", "pdf-to-html", "markdown-to-pdf", "html-formatter", "html-to-markdown"],
    howItWorks: {
      en: [
        { name: "Paste or upload your HTML", text: "Paste HTML code into the editor or upload an .html file." },
        { name: "Render to PDF", text: "The tool renders the HTML and generates a clean PDF." },
        { name: "Download the PDF", text: "Click Convert. Your PDF with the rendered HTML content downloads immediately." },
      ],
      fr: [
        { name: "Collez ou téléversez votre HTML", text: "Collez du code HTML dans l'éditeur ou téléversez un fichier .html." },
        { name: "Rendu en PDF", text: "L'outil rend le HTML et en génère un PDF propre." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF avec le contenu HTML rendu se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Turn any HTML code into a downloadable PDF — useful for saving invoices built from templates, archiving web content, creating print versions of pages, or sharing formatted content that does not require a browser to view. The conversion runs entirely in your browser.\n\nCSS styles, fonts, and layout are applied before the PDF is generated. Inline styles and embedded CSS work well. External resources like remote images or hosted fonts may not be available during conversion, so self-contained HTML gives the cleanest results.",
      fr: "Transformez n'importe quel code HTML en PDF téléchargeable — utile pour sauvegarder des factures créées à partir de modèles, archiver du contenu web, créer des versions imprimables de pages, ou partager du contenu formaté sans nécessiter un navigateur. La conversion s'effectue entièrement dans votre navigateur.\n\nLes styles CSS, les polices et la mise en page sont appliqués avant la génération du PDF. Les styles inline et le CSS intégré fonctionnent bien. Les ressources externes comme les images distantes ou les polices hébergées peuvent ne pas être disponibles — un HTML autonome donne les meilleurs résultats."
    },
    faqs: {
      en: [
    { q: "Will CSS styles be applied in the PDF output?", a: "Yes. Inline styles and embedded `<style>` blocks are applied when rendering. External stylesheet links may not load depending on the conversion context. For best results, inline your CSS before converting." },
    { q: "Can I convert a full web page to PDF?", a: "You can paste or upload the HTML source of a page. However, dynamically loaded content (JavaScript-rendered content) and externally hosted resources (images, fonts) may not appear. For a complete web page PDF, browser print-to-PDF is often more reliable." },
    { q: "Are external images loaded during conversion?", a: "External images referenced by URL may not load in the conversion context. For reliable image inclusion, embed images as Base64 data URIs directly in the HTML before converting." },
    { q: "What is HTML to PDF conversion used for?", a: "Common uses include generating invoices, receipts, and reports from HTML templates; saving web content as archival PDFs; creating print-ready documents from HTML layouts; and sharing email templates as static PDFs." },
    { q: "Is HTML to PDF Converter free?", a: "Yes. EverydayTools Hub HTML to PDF Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir du HTML en PDF gratuitement en ligne ?", a: "Collez votre code HTML ou téléversez un fichier .html dans le convertisseur HTML en PDF d'EverydayTools Hub et cliquez sur Convertir. L'outil rend le HTML en PDF dans votre navigateur." },
    { q: "Les styles CSS seront-ils appliqués dans la sortie PDF ?", a: "Oui. Les styles en ligne et les blocs `<style>` intégrés sont appliqués lors du rendu. Les liens de feuilles de style externes peuvent ne pas se charger. Pour de meilleurs résultats, intégrez votre CSS avant la conversion." },
    { q: "Puis-je convertir une page web complète en PDF ?", a: "Vous pouvez coller ou téléverser la source HTML d'une page. Cependant, le contenu chargé dynamiquement et les ressources hébergées en externe peuvent ne pas apparaître." },
    { q: "Les images externes sont-elles chargées lors de la conversion ?", a: "Les images externes référencées par URL peuvent ne pas se charger. Pour une inclusion fiable des images, intégrez-les en tant qu'URI de données Base64 directement dans le HTML avant la conversion." },
    { q: "À quoi sert la conversion HTML en PDF ?", a: "Parmi les usages courants : génération de factures et rapports à partir de modèles HTML, sauvegarde de contenu web en PDF d'archivage, création de documents prêts pour l'impression." },
    { q: "Le convertisseur HTML en PDF est-il gratuit ?", a: "Oui. Le convertisseur HTML en PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "txt-to-pdf",
    slugs: { en: "convert-text-to-pdf", fr: "convertir-texte-en-pdf" },
    title: { en: "Text to PDF Converter — Free, Online | EverydayTools Hub", fr: "Convertir Texte en PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Text to PDF Converter", fr: "Convertisseur Texte en PDF" },
    description: { en: "Convert plain text files (.txt) to PDF in your browser. Free, no upload, no account. Create a clean PDF from any text file instantly.", fr: "Convertissez des fichiers texte brut (.txt) en PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["text to pdf converter", "txt to pdf online free", "convert text to pdf", "plain text to pdf", "txt pdf generator", "text file to pdf free"], fr: ["convertir texte en pdf", "txt en pdf gratuit", "texte vers pdf en ligne", "fichier texte en pdf", "txt pdf générateur", "texte brut en pdf"] },
    relatedTools: ["markdown-to-pdf", "txt-to-docx", "pdf-to-text", "word-to-pdf", "pdf-compress"],
    howItWorks: {
      en: [
        { name: "Upload your text file", text: "Click the upload area or drag your .txt file. You can also paste text directly." },
        { name: "Convert to PDF", text: "The tool wraps the text in clean typography and generates a PDF in the browser." },
        { name: "Download the PDF", text: "Click Convert. Your PDF downloads with the text formatted for reading." },
      ],
      fr: [
        { name: "Téléversez votre fichier texte", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .txt. Vous pouvez également coller du texte directement." },
        { name: "Conversion en PDF", text: "L'outil encapsule le texte dans une typographie propre et génère un PDF dans le navigateur." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF se télécharge avec le texte formaté pour la lecture." },
      ],
    },
    about: {
      en: "Convert a plain text file into a clean, readable PDF — ready to share, print, or archive. EverydayTools handles the layout and formatting automatically, producing a professional-looking document from raw text. Your file never leaves your browser.\n\nEach paragraph and line break in the text file is preserved in the PDF output. The result is a single-column document with clean typography, suitable for reports, notes, logs, or any plain-text content that needs a more formal presentation.",
      fr: "Convertissez un fichier texte brut en PDF propre et lisible — prêt à partager, imprimer ou archiver. EverydayTools gère automatiquement la mise en page et la typographie, produisant un document professionnel à partir du texte brut. Votre fichier ne quitte jamais votre navigateur.\n\nChaque paragraphe et saut de ligne du fichier texte est préservé dans la sortie PDF. Le résultat est un document à colonne unique avec une typographie soignée, adapté aux rapports, notes, journaux ou tout contenu en texte brut nécessitant une présentation plus formelle."
    },
    faqs: {
      en: [
    { q: "Can I paste text directly without a file?", a: "Yes. You can paste text directly into the text area on the conversion page instead of uploading a .txt file. This is useful for quick conversions of short content." },
    { q: "Will the text be paginated across multiple pages?", a: "Yes. Long text files are automatically paginated with page breaks at appropriate line boundaries. The PDF will have as many pages as needed to fit all the content." },
    { q: "What fonts are used in the output PDF?", a: "The tool uses Helvetica, which is one of the 14 standard PDF fonts that are embedded in all PDF readers. This ensures consistent rendering without needing to embed font files." },
    { q: "What encoding does the converter support?", a: "UTF-8 encoded text files are supported. This covers most Latin and extended Latin characters including French accents. Non-Latin scripts (Chinese, Arabic, etc.) may not render correctly due to PDF font limitations." },
    { q: "Is Text to PDF Converter free?", a: "Yes. EverydayTools Hub Text to PDF Converter is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment convertir un fichier texte en PDF gratuitement ?", a: "Téléversez votre fichier .txt dans le convertisseur Texte en PDF d'EverydayTools Hub et cliquez sur Convertir. L'outil formate le texte avec une typographie propre et génère un PDF dans votre navigateur." },
    { q: "Puis-je coller du texte directement sans fichier ?", a: "Oui. Vous pouvez coller du texte directement dans la zone de texte sur la page de conversion au lieu de téléverser un fichier .txt." },
    { q: "Le texte sera-t-il paginé sur plusieurs pages ?", a: "Oui. Les fichiers texte longs sont automatiquement paginés avec des sauts de page aux limites de ligne appropriées." },
    { q: "Quelles polices sont utilisées dans le PDF de sortie ?", a: "L'outil utilise Helvetica, l'une des 14 polices PDF standard intégrées dans tous les lecteurs PDF. Cela garantit un rendu cohérent sans avoir besoin d'intégrer des fichiers de polices." },
    { q: "Quel encodage le convertisseur supporte-t-il ?", a: "Les fichiers texte encodés en UTF-8 sont supportés. Cela couvre la plupart des caractères latins et latins étendus, y compris les accents français." },
    { q: "Le convertisseur Texte en PDF est-il gratuit ?", a: "Oui. Le convertisseur Texte en PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "txt-to-docx",
    slugs: { en: "convert-text-to-word", fr: "convertir-texte-en-word" },
    title: { en: "Text to Word Converter — Free, Online | EverydayTools Hub", fr: "Convertir Texte en Word — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Text to Word Converter", fr: "Convertisseur Texte en Word" },
    description: { en: "Convert plain text (.txt) to Word (DOCX) in your browser. Free, no upload, no account. Turn any text file into an editable Word document.", fr: "Convertissez du texte brut (.txt) en Word (DOCX) dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["text to word converter", "txt to docx online free", "convert text to word", "plain text to docx", "txt word document", "text to word free"], fr: ["convertir texte en word", "txt en docx gratuit", "texte vers word", "texte brut en docx", "txt word document", "texte to word"] },
    relatedTools: ["txt-to-pdf", "word-to-text", "markdown-to-docx", "word-to-pdf", "markdown-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your text file", text: "Click the upload area or drag your .txt file, or paste text directly." },
        { name: "Convert to DOCX", text: "The tool wraps each paragraph of your text into a Word document structure in the browser." },
        { name: "Download the DOCX", text: "Click Convert. Your .docx file downloads, ready to edit in Word or Google Docs." },
      ],
      fr: [
        { name: "Téléversez votre fichier texte", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .txt, ou collez du texte directement." },
        { name: "Conversion en DOCX", text: "L'outil encapsule chaque paragraphe de votre texte dans une structure de document Word dans le navigateur." },
        { name: "Téléchargez le DOCX", text: "Cliquez sur Convertir. Votre fichier .docx se télécharge, prêt à être modifié dans Word ou Google Docs." },
      ],
    },
    about: {
      en: "Turn a plain text file into an editable Word document in one click — ready to format, style, and distribute. EverydayTools wraps the text content into a proper DOCX structure directly in your browser. No account, no upload, no waiting.\n\nParagraphs and line breaks from the source file are preserved as Word paragraphs. The output DOCX can be opened immediately in Microsoft Word, Google Docs, or LibreOffice for further formatting.",
      fr: "Transformez un fichier texte brut en document Word modifiable en un clic — prêt à formater, styliser et distribuer. EverydayTools structure le contenu textuel en DOCX directement dans votre navigateur. Sans compte, sans téléversement, sans attente.\n\nLes paragraphes et sauts de ligne du fichier source sont préservés comme paragraphes Word. Le fichier DOCX obtenu peut être ouvert immédiatement dans Microsoft Word, Google Docs ou LibreOffice pour une mise en forme ultérieure."
    },
    faqs: {
      en: [
    { q: "Will the text structure be preserved?", a: "Yes. Line breaks and paragraph separations are preserved in the DOCX output. Each paragraph in the text file becomes a Word paragraph, maintaining the document's logical structure." },
    { q: "Can I edit the Word document after converting?", a: "Yes. The output is a standard .docx file that can be fully edited in Microsoft Word, Google Docs, LibreOffice Writer, or any DOCX-compatible editor. You can add formatting, styles, headers, and more." },
    { q: "Does the tool support non-English text?", a: "Yes. UTF-8 text is supported, which covers most international characters including French, German, Spanish, and other Latin-based languages." },
    { q: "Is there a word or character limit?", a: "There is no explicit word limit. The tool accepts files up to 50 MB, which can hold tens of millions of characters — far more than any practical document." },
    { q: "Is Text to Word Converter free?", a: "Yes. EverydayTools Hub Text to Word Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir un fichier texte en Word gratuitement ?", a: "Téléversez votre fichier .txt dans le convertisseur Texte en Word d'EverydayTools Hub et cliquez sur Convertir. L'outil construit un document DOCX à partir de votre texte dans le navigateur." },
    { q: "La structure du texte sera-t-elle préservée ?", a: "Oui. Les sauts de ligne et les séparations de paragraphes sont préservés dans la sortie DOCX. Chaque paragraphe du fichier texte devient un paragraphe Word." },
    { q: "Puis-je modifier le document Word après la conversion ?", a: "Oui. La sortie est un fichier .docx standard qui peut être entièrement modifié dans Word, Google Docs, LibreOffice Writer ou tout éditeur compatible DOCX." },
    { q: "L'outil supporte-t-il le texte non anglais ?", a: "Oui. Le texte UTF-8 est supporté, ce qui couvre la plupart des caractères internationaux, y compris le français." },
    { q: "Y a-t-il une limite de mots ou de caractères ?", a: "Il n'y a pas de limite explicite de mots. L'outil accepte les fichiers jusqu'à 50 Mo." },
    { q: "Le convertisseur Texte en Word est-il gratuit ?", a: "Oui. Le convertisseur Texte en Word d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },

  // ─── IMAGE TOOLS ─────────────────────────────────────────────────────────────
  {
    internalSlug: "image-converter",
    slugs: { en: "convert-image-format", fr: "convertir-format-image" },
    title: { en: "Image Format Converter — Free, Online | EverydayTools Hub", fr: "Convertisseur de Format Image — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Image Format Converter", fr: "Convertisseur de Format Image" },
    description: { en: "Convert images between PNG, JPEG, WEBP, AVIF, BMP, GIF, and more in your browser. Free, no upload, batch up to 20 files.", fr: "Convertissez des images entre PNG, JPEG, WEBP, AVIF, BMP, GIF et plus dans votre navigateur. Gratuit, sans envoi, lot de 20 fichiers." },
    keywords: { en: ["image converter online free", "convert image format", "png to jpg converter", "webp to jpg free", "image format changer", "batch image converter"], fr: ["convertisseur image gratuit", "convertir format image", "png en jpg", "webp en jpg gratuit", "changer format image en ligne", "convertisseur image lot"] },
    relatedTools: ["image-compress", "image-resize", "heic-to-jpg", "background-remover", "image-crop"],
    howItWorks: {
      en: [
        { name: "Upload your images", text: "Click the upload area or drag up to 20 image files. PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, and ICO are supported." },
        { name: "Select the output format", text: "Choose the target format from the dropdown — JPEG, PNG, WEBP, AVIF, BMP, or GIF." },
        { name: "Download converted images", text: "Click Convert. Your converted images download individually or as a ZIP archive." },
      ],
      fr: [
        { name: "Téléversez vos images", text: "Cliquez sur la zone de dépôt ou faites glisser jusqu'à 20 fichiers images. PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF et ICO sont supportés." },
        { name: "Sélectionnez le format de sortie", text: "Choisissez le format cible dans le menu déroulant — JPEG, PNG, WEBP, AVIF, BMP ou GIF." },
        { name: "Téléchargez les images converties", text: "Cliquez sur Convertir. Vos images converties se téléchargent individuellement ou en archive ZIP." },
      ],
    },
    about: {
      en: "Convert images between any common format — JPEG, PNG, WebP, AVIF, BMP, GIF, TIFF, ICO, SVG — right in your browser. No account needed, no upload to any server, and batch conversions of up to 20 files at once are supported.\n\nDifferent formats suit different purposes: WebP and AVIF offer the smallest file sizes for web use, PNG preserves transparency, JPEG is universal for photos. Choose your output format, adjust quality if needed, and download all converted files in a single ZIP.",
      fr: "Convertissez des images entre n'importe quel format courant — JPEG, PNG, WebP, AVIF, BMP, GIF, TIFF, ICO, SVG — directement dans votre navigateur. Aucun compte requis, aucun envoi à un serveur, et les conversions par lot de jusqu'à 20 fichiers sont prises en charge.\n\nDifférents formats conviennent à différents usages : WebP et AVIF offrent les tailles de fichiers les plus petites pour le web, PNG préserve la transparence, JPEG est universel pour les photos. Choisissez votre format de sortie, ajustez la qualité si nécessaire, et téléchargez tous les fichiers convertis dans un ZIP."
    },
    faqs: {
      en: [
    { q: "Which image formats are supported?", a: "Input formats: PNG, JPEG/JPG, WEBP, AVIF, BMP, GIF, TIFF, ICO, and SVG. Output formats: JPEG, PNG, WEBP, AVIF, BMP, and GIF. AVIF output requires a browser that supports OffscreenCanvas with AVIF encoding." },
    { q: "Will converting JPEG to PNG increase the file size?", a: "Yes. JPEG uses lossy compression while PNG is lossless. Converting JPEG to PNG typically produces a larger file because PNG stores data without discarding any information. Convert PNG to JPEG to reduce file size, not the reverse." },
    { q: "Does converting JPEG to WEBP reduce quality?", a: "Converting to WEBP with high quality settings preserves most visual quality while significantly reducing file size (typically 25–35% smaller than JPEG at equivalent quality). WEBP supports both lossy and lossless modes." },
    { q: "Can I convert multiple images at once?", a: "Yes. The batch converter supports up to 20 images in a single operation. All converted files are available for individual download or packaged in a ZIP archive." },
    { q: "Is the Image Converter free?", a: "Yes. EverydayTools Hub Image Converter is completely free, with no account required, no watermarks, and no usage limits." },
      ],
      fr: [
        { q: "Comment convertir un format d'image gratuitement en ligne ?", a: "Téléversez vos images dans le convertisseur d'images d'EverydayTools Hub, sélectionnez le format de sortie et cliquez sur Convertir. La conversion se fait dans votre navigateur — sans compte, jusqu'à 20 images à la fois." },
    { q: "Quels formats d'image sont supportés ?", a: "Formats d'entrée : PNG, JPEG/JPG, WEBP, AVIF, BMP, GIF, TIFF, ICO et SVG. Formats de sortie : JPEG, PNG, WEBP, AVIF, BMP et GIF." },
    { q: "La conversion JPEG en PNG augmentera-t-elle la taille du fichier ?", a: "Oui. JPEG utilise une compression avec perte tandis que PNG est sans perte. La conversion JPEG en PNG produit généralement un fichier plus volumineux." },
    { q: "La conversion JPEG en WEBP réduit-elle la qualité ?", a: "Avec des paramètres de haute qualité, la conversion en WEBP préserve la plupart de la qualité visuelle tout en réduisant significativement la taille du fichier (généralement 25–35 % plus petit que JPEG à qualité équivalente)." },
    { q: "Puis-je convertir plusieurs images à la fois ?", a: "Oui. Le convertisseur par lot supporte jusqu'à 20 images en une seule opération." },
    { q: "Le convertisseur d'images est-il gratuit ?", a: "Oui. Le convertisseur d'images d'EverydayTools Hub est entièrement gratuit, sans compte requis, sans filigrane et sans limites d'utilisation." },
      ],
    },
  },
  {
    internalSlug: "heic-to-jpg",
    slugs: { en: "convert-heic-to-jpg", fr: "convertir-heic-en-jpg" },
    title: { en: "HEIC to JPG Converter — Free, Online | EverydayTools Hub", fr: "Convertir HEIC en JPG — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "HEIC to JPG Converter", fr: "Convertisseur HEIC en JPG" },
    description: { en: "Convert iPhone HEIC photos to JPEG or PNG in your browser. Free, no upload, no account. Open iPhone photos on Windows and Android.", fr: "Convertissez des photos HEIC iPhone en JPEG ou PNG dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["heic to jpg converter", "convert heic to jpg online free", "heic to jpeg", "iphone heic converter", "open heic on windows", "heic to png free"], fr: ["convertir heic en jpg", "heic en jpeg gratuit", "convertisseur heic en ligne", "ouvrir heic sur windows", "photo iphone heic converter", "heic png gratuit"] },
    relatedTools: ["image-converter", "image-compress", "background-remover", "heic-to-png", "heic-to-webp"],
    howItWorks: {
      en: [
        { name: "Upload your HEIC files", text: "Click the upload area or drag your iPhone HEIC photos. Multiple files are supported." },
        { name: "Select output format", text: "Choose JPEG or PNG as the output format." },
        { name: "Download the converted photos", text: "Click Convert. Your JPEG or PNG photos download, ready to share on any platform." },
      ],
      fr: [
        { name: "Téléversez vos fichiers HEIC", text: "Cliquez sur la zone de dépôt ou faites glisser vos photos HEIC iPhone. Plusieurs fichiers sont supportés." },
        { name: "Sélectionnez le format de sortie", text: "Choisissez JPEG ou PNG comme format de sortie." },
        { name: "Téléchargez les photos converties", text: "Cliquez sur Convertir. Vos photos JPEG ou PNG se téléchargent, prêtes à être partagées sur n'importe quelle plateforme." },
      ],
    },
    about: {
      en: "Instantly convert iPhone HEIC photos to standard JPEG or PNG files that open anywhere — on Windows, Android, or any app that doesn't support Apple's HEIC format. The entire conversion runs in your browser, so your photos never leave your device.\n\nHEIC is the format iPhones use by default to save space while maintaining quality. It's not natively supported on Windows or most non-Apple apps, which is why this converter exists. Drag in one photo or a whole batch, choose your output format, and download immediately. Free, no account required.",
      fr: "Convertissez instantanément vos photos HEIC iPhone en fichiers JPEG ou PNG standard qui s'ouvrent partout — sur Windows, Android ou n'importe quelle application ne prenant pas en charge le format HEIC d'Apple. La conversion s'effectue entièrement dans votre navigateur, vos photos ne quittent jamais votre appareil.\n\nHEIC est le format utilisé par défaut par les iPhone pour économiser de l'espace tout en préservant la qualité. Il n'est pas pris en charge nativement par Windows ni par la plupart des applications non-Apple. Glissez une photo ou un lot entier, choisissez votre format de sortie et téléchargez immédiatement. Gratuit, sans compte."
    },
    faqs: {
      en: [
        { q: "Why can't I open HEIC files on Windows?", a: "HEIC requires the HEVC/H.265 codec to decode, which Windows does not include by default. You can install the HEIC Image Extensions from the Microsoft Store ($0.99), or use a free converter like EverydayTools Hub to convert HEIC photos to JPEG before using them on Windows." },
        { q: "Will HEIC to JPG conversion reduce photo quality?", a: "JPEG is a lossy format, so some quality loss is inherent. However, at high quality settings (the tool default), the difference is barely perceptible to the human eye. Converting to PNG instead produces a lossless output but with a larger file size." },
        { q: "Can I convert multiple HEIC files at once?", a: "Yes. The converter supports batch conversion of multiple HEIC files in a single upload." },
        { q: "What if my HEIC file contains multiple frames (Live Photo)?", a: "The converter extracts the still image from Live Photo .heic files. The motion video component of Live Photos is not extracted." },
        { q: "Is HEIC to JPG Converter free?", a: "Yes. EverydayTools Hub HEIC to JPG Converter is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment convertir HEIC en JPG gratuitement ?", a: "Téléversez vos fichiers HEIC dans le convertisseur HEIC en JPG d'EverydayTools Hub, sélectionnez JPEG comme format de sortie et cliquez sur Convertir. La conversion se fait entièrement dans votre navigateur." },
        { q: "Pourquoi ne puis-je pas ouvrir les fichiers HEIC sur Windows ?", a: "HEIC nécessite le codec HEVC/H.265 pour le décodage, que Windows n'inclut pas par défaut. Vous pouvez installer les extensions d'images HEIC depuis le Microsoft Store, ou utiliser EverydayTools Hub pour convertir en JPEG." },
        { q: "La conversion HEIC en JPG réduira-t-elle la qualité de la photo ?", a: "JPEG est un format avec perte, donc une certaine perte de qualité est inhérente. Cependant, avec des paramètres de haute qualité, la différence est à peine perceptible. La conversion en PNG produit une sortie sans perte mais avec une taille de fichier plus grande." },
        { q: "Puis-je convertir plusieurs fichiers HEIC à la fois ?", a: "Oui. Le convertisseur supporte la conversion par lot de plusieurs fichiers HEIC en un seul téléversement." },
        { q: "Que se passe-t-il si mon fichier HEIC contient plusieurs images (Live Photo) ?", a: "Le convertisseur extrait l'image fixe des fichiers .heic Live Photo. La composante vidéo en mouvement des Live Photos n'est pas extraite." },
        { q: "Le convertisseur HEIC en JPG est-il gratuit ?", a: "Oui. Le convertisseur HEIC en JPG d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "png-to-webp",
    slugs: { en: "convert-png-to-webp", fr: "convertir-png-en-webp" },
    title: { en: "PNG to WebP Converter — Free, Online | EverydayTools Hub", fr: "Convertir PNG en WebP — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "PNG to WebP Converter", fr: "Convertisseur PNG en WebP" },
    description: { en: "Convert PNG images to WebP format instantly in your browser. Smaller files, same quality — free, no upload, no account required.", fr: "Convertissez des images PNG en WebP directement dans votre navigateur. Fichiers plus légers, même qualité — gratuit, sans envoi, sans compte." },
    keywords: { en: ["png to webp converter", "convert png to webp online free", "png webp online", "reduce png file size webp", "png to webp no upload", "webp converter free"], fr: ["convertir png en webp", "png en webp gratuit", "convertisseur png webp en ligne", "png vers webp sans logiciel", "webp converter gratuit", "convertir image png webp"] },
    relatedTools: ["image-converter", "image-compress", "jpg-to-png", "jpg-to-webp", "image-resize"],
    howItWorks: {
      en: [
        { name: "Upload your PNG", text: "Click the upload area or drag your PNG file. Multiple files are supported (up to 20)." },
        { name: "Convert automatically", text: "EverydayTools converts your PNG to WebP directly in your browser — no data leaves your device." },
        { name: "Download the WebP file", text: "Click Convert. Your WebP file downloads immediately, typically 25–35% smaller than the original PNG." },
      ],
      fr: [
        { name: "Téléversez votre PNG", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PNG. Plusieurs fichiers sont supportés (jusqu'à 20)." },
        { name: "Conversion automatique", text: "EverydayTools convertit votre PNG en WebP directement dans votre navigateur — aucune donnée ne quitte votre appareil." },
        { name: "Téléchargez le fichier WebP", text: "Cliquez sur Convertir. Votre fichier WebP se télécharge immédiatement, généralement 25–35 % plus petit que le PNG original." },
      ],
    },
    about: {
      en: "Convert PNG images to WebP format instantly in your browser. Smaller files, same quality — free, no upload, no account required. WebP is the modern standard for web performance.\n\nWebP images are significantly smaller than PNGs while maintaining the same visual quality and transparency. This tool handles the conversion entirely on your device. Once converted, you can download your new WebP files individually or together in a ZIP archive.",
      fr: "Convertissez des images PNG au format WebP instantanément dans votre navigateur. Des fichiers plus petits pour une qualité identique — gratuit, sans envoi, sans compte. Le WebP est le standard moderne pour la performance web.\n\nLes images WebP sont nettement plus légères que les PNG tout en conservant la même qualité visuelle et la transparence. Cet outil gère la conversion entièrement sur votre appareil. Une fois convertis, vous pouvez télécharger vos nouveaux fichiers WebP individuellement ou groupés dans un ZIP."
    },
    faqs: {
      en: [
    { q: "Why convert PNG to WebP?", a: "WebP typically produces files 25–35% smaller than PNG at the same visual quality. Smaller images improve website loading speed and reduce bandwidth consumption. All modern browsers support WebP." },
    { q: "Is WebP better than PNG?", a: "WebP is generally smaller in file size than PNG for photos and complex images. PNG is better when you need guaranteed lossless quality or compatibility with older software. For web use, WebP is the modern recommendation." },
    { q: "Does PNG to WebP conversion lose quality?", a: "By default, the converter uses high-quality WebP encoding, so quality loss is minimal. WebP supports both lossy and lossless modes; the converter uses lossless encoding for PNG transparency." },
    { q: "Can I convert multiple PNG files at once?", a: "Yes. The tool supports batch conversion of up to 20 PNG files in a single upload." },
    { q: "Is PNG to WebP Converter free?", a: "Yes. EverydayTools Hub PNG to WebP Converter is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment convertir PNG en WebP gratuitement en ligne ?", a: "Téléversez votre PNG dans le convertisseur PNG en WebP d'EverydayTools Hub et cliquez sur Convertir. Le fichier WebP se télécharge dans votre navigateur — sans compte, sans envoi à un serveur." },
    { q: "Pourquoi convertir PNG en WebP ?", a: "WebP produit généralement des fichiers 25–35 % plus petits que PNG à la même qualité visuelle. Des images plus légères améliorent la vitesse de chargement des sites web." },
    { q: "WebP est-il meilleur que PNG ?", a: "WebP est généralement plus petit en taille de fichier que PNG pour les photos et images complexes. PNG est préférable pour une compatibilité maximale avec les anciens logiciels. Pour le web, WebP est la recommandation moderne." },
    { q: "La conversion PNG en WebP perd-elle en qualité ?", a: "Par défaut, le convertisseur utilise un encodage WebP de haute qualité, donc la perte de qualité est minimale." },
    { q: "Puis-je convertir plusieurs fichiers PNG à la fois ?", a: "Oui. L'outil supporte la conversion par lot de jusqu'à 20 fichiers PNG en un seul téléversement." },
    { q: "Le convertisseur PNG en WebP est-il gratuit ?", a: "Oui. Le convertisseur PNG en WebP d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "jpg-to-png",
    slugs: { en: "convert-jpg-to-png", fr: "convertir-jpg-en-png" },
    title: { en: "JPG to PNG Converter — Free, Online | EverydayTools Hub", fr: "Convertir JPG en PNG — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "JPG to PNG Converter", fr: "Convertisseur JPG en PNG" },
    description: { en: "Convert JPG/JPEG images to PNG format instantly in your browser. Lossless output, transparent background support — free, no upload, no account.", fr: "Convertissez des images JPG/JPEG en PNG directement dans votre navigateur. Sortie sans perte, support de la transparence — gratuit, sans envoi, sans compte." },
    keywords: { en: ["jpg to png converter", "convert jpg to png online free", "jpeg to png", "jpg png no background", "convert jpeg to png free", "jpg to png transparent"], fr: ["convertir jpg en png", "jpeg en png gratuit", "convertisseur jpg png en ligne", "jpg vers png sans logiciel", "jpeg png fond transparent", "convertir photo jpg en png"] },
    relatedTools: ["image-converter", "png-to-webp", "image-compress", "jpg-to-webp", "jpg-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your JPG/JPEG", text: "Click the upload area or drag your JPEG file. Batch conversion of up to 20 files is supported." },
        { name: "Convert automatically", text: "EverydayTools converts your JPEG to PNG directly in your browser — no data leaves your device." },
        { name: "Download the PNG file", text: "Click Convert. Your PNG file downloads with full quality — no further compression is applied." },
      ],
      fr: [
        { name: "Téléversez votre JPG/JPEG", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier JPEG. La conversion par lot jusqu'à 20 fichiers est supportée." },
        { name: "Conversion automatique", text: "EverydayTools convertit votre JPEG en PNG directement dans votre navigateur — aucune donnée ne quitte votre appareil." },
        { name: "Téléchargez le fichier PNG", text: "Cliquez sur Convertir. Votre fichier PNG se télécharge avec une qualité maximale." },
      ],
    },
    about: {
      en: "Convert JPG images to PNG format instantly in your browser — free, no upload, no account. PNG is a lossless format, making it ideal for images that need to be edited or overlaid without losing quality.\n\nThe tool processes your images entirely on your device, ensuring your photos stay private. You can convert multiple files at once and download them all in a single ZIP archive. Use this tool when you need a version of your photo that supports transparency or requires higher fidelity for design work.",
      fr: "Convertissez des images JPG en PNG instantanément dans votre navigateur — gratuit, sans envoi, sans compte. Le PNG est un format sans perte, idéal pour les images qui doivent être modifiées ou superposées sans perte de qualité.\n\nL'outil traite vos images entièrement sur votre appareil, garantissant la confidentialité de vos photos. Vous pouvez convertir plusieurs fichiers à la fois et les télécharger dans un seul ZIP. Utilisez cet outil lorsque vous avez besoin d'une version de votre photo supportant la transparence ou nécessitant une plus grande fidélité pour le design."
    },
    faqs: {
      en: [
    { q: "Why convert JPG to PNG?", a: "PNG is a lossless format that supports transparency, which JPEG does not. Convert to PNG when you need to preserve every pixel exactly, need a transparent background, or need compatibility with tools that require PNG files." },
    { q: "Will the PNG file be larger than the original JPG?", a: "Yes. PNG uses lossless compression, so PNG files are typically larger than JPEG files of the same image. This is expected behaviour — the PNG contains more image information." },
    { q: "Does JPG to PNG conversion improve image quality?", a: "No. Converting from JPEG to PNG does not recover quality lost during the original JPEG compression. The PNG output is a lossless copy of whatever quality the JPEG already has." },
    { q: "Can I convert multiple JPG files at once?", a: "Yes. The tool supports batch conversion of up to 20 JPEG files in a single upload." },
    { q: "Is JPG to PNG Converter free?", a: "Yes. EverydayTools Hub JPG to PNG Converter is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment convertir JPG en PNG gratuitement en ligne ?", a: "Téléversez votre JPEG dans le convertisseur JPG en PNG d'EverydayTools Hub et cliquez sur Convertir. Le fichier PNG se télécharge dans votre navigateur — sans compte, sans envoi à un serveur." },
    { q: "Pourquoi convertir JPG en PNG ?", a: "PNG est un format sans perte qui supporte la transparence, ce que JPEG ne fait pas. Convertissez en PNG pour préserver chaque pixel exactement ou pour la compatibilité avec des outils nécessitant des fichiers PNG." },
    { q: "Le fichier PNG sera-t-il plus grand que le JPG original ?", a: "Oui. PNG utilise une compression sans perte, donc les fichiers PNG sont généralement plus grands que les fichiers JPEG de la même image. C'est un comportement attendu." },
    { q: "La conversion JPG en PNG améliore-t-elle la qualité de l'image ?", a: "Non. La conversion de JPEG en PNG ne récupère pas la qualité perdue lors de la compression JPEG originale. La sortie PNG est une copie sans perte de la qualité que le JPEG avait déjà." },
    { q: "Puis-je convertir plusieurs fichiers JPG à la fois ?", a: "Oui. L'outil supporte la conversion par lot de jusqu'à 20 fichiers JPEG en un seul téléversement." },
    { q: "Le convertisseur JPG en PNG est-il gratuit ?", a: "Oui. Le convertisseur JPG en PNG d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "image-compress",
    slugs: { en: "compress-image", fr: "compresser-image" },
    title: { en: "Compress Image Online Free — No Signup | EverydayTools Hub", fr: "Compresser Image en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Compress Image", fr: "Compresser une Image" },
    description: { en: "Reduce image file size online for free in your browser. Adjust quality with a slider. No upload, no account, supports JPG, PNG, and WEBP.", fr: "Réduisez la taille des images en ligne gratuitement dans votre navigateur. Ajustez la qualité. Sans envoi, sans compte." },
    keywords: { en: ["compress image online free", "reduce image file size", "image compressor", "shrink image online", "jpeg compressor free", "png compressor online"], fr: ["compresser image en ligne gratuit", "réduire taille image", "compresseur image", "alléger image en ligne", "compresseur jpeg gratuit", "compresseur png en ligne"] },
    relatedTools: ["image-converter", "image-resize", "heic-to-jpg", "image-crop", "background-remover"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Click the upload area or drag your image file. JPEG, PNG, and WEBP are supported." },
        { name: "Adjust the quality", text: "Use the quality slider to balance file size and visual quality. 80% is a good default for most use cases." },
        { name: "Download the compressed image", text: "Click Compress. Your smaller image downloads. The tool shows both before and after file sizes." },
      ],
      fr: [
        { name: "Téléversez votre image", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier image. JPEG, PNG et WEBP sont supportés." },
        { name: "Ajustez la qualité", text: "Utilisez le curseur de qualité pour équilibrer la taille du fichier et la qualité visuelle. 80 % est un bon défaut pour la plupart des cas." },
        { name: "Téléchargez l'image compressée", text: "Cliquez sur Compresser. Votre image plus petite se télécharge. L'outil affiche les tailles avant et après." },
      ],
    },
    about: {
      en: "Reduce the file size of your images in seconds without compromising visual quality. EverydayTools compresses JPEG, PNG, and WebP files directly in your browser, making them perfect for web use, email, or saving storage space.\n\nAdjust the quality slider to find the perfect balance between file size and clarity. The tool provides an instant preview of the new file size, and everything happens on your device — no images are ever sent to a server.",
      fr: "Réduisez la taille de vos images en quelques secondes sans compromettre la qualité visuelle. EverydayTools compresse les fichiers JPEG, PNG et WebP directement dans votre navigateur, les rendant parfaits pour le web, les e-mails ou pour gagner de l'espace disque.\n\nAjustez le curseur de qualité pour trouver l'équilibre parfait entre poids et clarté. L'outil offre un aperçu instantané de la nouvelle taille du fichier, et tout se passe sur votre appareil — aucune image n'est envoyée à un serveur."
    },
    faqs: {
      en: [
    { q: "What quality setting should I use?", a: "For web images, 70–85% typically gives the best balance of file size and visual quality. For professional printing, use 90–95%. For archival storage, use 100% (lossless). The tool shows the resulting file size as you adjust the slider." },
    { q: "Does compression reduce the image dimensions?", a: "No. The Compress Image tool reduces file size by adjusting encoding quality only. The output image has exactly the same pixel dimensions as the input. To change dimensions, use the Resize Image tool." },
    { q: "Is PNG compression lossless?", a: "PNG is a lossless format, but the tool re-encodes it at the selected quality level. At 100% quality, PNG output is lossless. At lower settings, PNG images are converted to JPEG encoding. For true lossless PNG compression, use 100% quality." },
    { q: "What is the maximum image size I can compress?", a: "The tool accepts images up to 50 MB. Very large images (50+ megapixels) may take a few seconds to process. Most standard camera and smartphone photos are well within this limit." },
    { q: "Is Compress Image free?", a: "Yes. EverydayTools Hub Compress Image is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment compresser une image gratuitement en ligne ?", a: "Téléversez votre image dans l'outil Compresser Image d'EverydayTools Hub, ajustez le curseur de qualité et cliquez sur Compresser. La réduction de taille est affichée et vous pouvez télécharger l'image compressée." },
    { q: "Quel paramètre de qualité utiliser ?", a: "Pour les images web, 70–85 % donne généralement le meilleur équilibre entre taille de fichier et qualité visuelle. Pour l'impression professionnelle, utilisez 90–95 %. L'outil affiche la taille du fichier résultant lorsque vous ajustez le curseur." },
    { q: "La compression réduit-elle les dimensions de l'image ?", a: "Non. L'outil Compresser Image réduit la taille du fichier en ajustant uniquement la qualité d'encodage. L'image de sortie a exactement les mêmes dimensions en pixels que l'entrée." },
    { q: "La compression PNG est-elle sans perte ?", a: "PNG est un format sans perte, mais l'outil ré-encode à un niveau de qualité sélectionné. À 100 % de qualité, la sortie PNG est sans perte. À des paramètres inférieurs, les images PNG sont converties en encodage JPEG." },
    { q: "Quelle est la taille maximale d'image que je peux compresser ?", a: "L'outil accepte les images jusqu'à 50 Mo." },
    { q: "Compresser Image est-il gratuit ?", a: "Oui. L'outil Compresser Image d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "image-resize",
    slugs: { en: "resize-image", fr: "redimensionner-image" },
    title: { en: "Resize Image Online Free — No Signup | EverydayTools Hub", fr: "Redimensionner Image en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Resize Image", fr: "Redimensionner une Image" },
    description: { en: "Resize images by pixel dimensions or percentage in your browser. Free, no upload, no account. Change image size instantly for web or print.", fr: "Redimensionnez des images par dimensions en pixels ou pourcentage dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["resize image online free", "change image size", "image resizer", "resize photo online", "scale image online free", "reduce image dimensions"], fr: ["redimensionner image en ligne gratuit", "changer taille image", "outil redimensionnement image", "redimensionner photo en ligne", "mettre à l'échelle image", "réduire dimensions image"] },
    relatedTools: ["image-compress", "image-crop", "image-converter", "image-to-pdf", "flip-rotate-image"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Click the upload area or drag your image. PNG, JPEG, and WEBP are supported." },
        { name: "Set the new dimensions", text: "Enter the target width and height in pixels, or specify a percentage scale. Lock aspect ratio to prevent distortion." },
        { name: "Download the resized image", text: "Click Resize. Your resized image downloads in the same format as the original." },
      ],
      fr: [
        { name: "Téléversez votre image", text: "Cliquez sur la zone de dépôt ou faites glisser votre image. PNG, JPEG et WEBP sont supportés." },
        { name: "Définissez les nouvelles dimensions", text: "Entrez la largeur et la hauteur cibles en pixels, ou spécifiez une échelle en pourcentage. Verrouillez les proportions pour éviter la distorsion." },
        { name: "Téléchargez l'image redimensionnée", text: "Cliquez sur Redimensionner. Votre image redimensionnée se télécharge dans le même format que l'original." },
      ],
    },
    about: {
      en: "Change the dimensions of your images quickly and easily. Whether you need a specific pixel width for a website or a percentage scale for a presentation, EverydayTools handles it all in your browser.\n\nMaintain the aspect ratio to prevent distortion, or set custom dimensions for your specific needs. The tool supports batch processing, so you can resize multiple images at once and download them in a single ZIP, with no file ever leaving your device.",
      fr: "Modifiez les dimensions de vos images rapidement et facilement. Que vous ayez besoin d'une largeur précise en pixels pour un site web ou d'une mise à l'échelle en pourcentage, EverydayTools gère tout dans votre navigateur.\n\nConservez les proportions pour éviter toute distorsion, ou définissez des dimensions personnalisées. L'outil prend en charge le traitement par lot : redimensionnez plusieurs images à la fois et téléchargez-les dans un seul ZIP, sans qu'aucun fichier ne quitte votre appareil."
    },
    faqs: {
      en: [
    { q: "How do I resize an image to specific pixel dimensions?", a: "Enter the exact pixel values in the width and height fields. Enable 'Lock aspect ratio' to automatically calculate the other dimension and prevent distortion. Click Resize to download the result." },
    { q: "Will resizing an image reduce its quality?", a: "Downscaling (making an image smaller) generally produces clean results as pixels are averaged together. Upscaling (making an image larger) can produce blurring because new pixels must be interpolated. The Canvas API uses bilinear interpolation for scaling." },
    { q: "Does resizing change the file format?", a: "No. The output is in the same format as the input (JPEG stays JPEG, PNG stays PNG). To change format, use the Image Converter tool." },
    { q: "Can I resize multiple images at once?", a: "The current Resize Image tool processes one image at a time. For batch resizing, use the Image Converter tool which supports up to 20 files." },
    { q: "Is Resize Image free?", a: "Yes. EverydayTools Hub Resize Image is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment redimensionner une image gratuitement en ligne ?", a: "Téléversez votre image dans l'outil Redimensionner Image d'EverydayTools Hub, entrez la largeur et la hauteur cibles (ou un pourcentage) et cliquez sur Redimensionner. L'image redimensionnée se télécharge dans votre navigateur." },
    { q: "Comment redimensionner une image à des dimensions en pixels spécifiques ?", a: "Entrez les valeurs en pixels exactes dans les champs de largeur et de hauteur. Activez 'Verrouiller les proportions' pour calculer automatiquement l'autre dimension et éviter la distorsion." },
    { q: "Le redimensionnement réduit-il la qualité de l'image ?", a: "La réduction d'échelle produit généralement des résultats propres. L'agrandissement peut produire du flou car de nouveaux pixels doivent être interpolés." },
    { q: "Le redimensionnement change-t-il le format du fichier ?", a: "Non. La sortie est dans le même format que l'entrée. Pour changer de format, utilisez l'outil Convertisseur d'images." },
    { q: "Puis-je redimensionner plusieurs images à la fois ?", a: "L'outil Redimensionner Image actuel traite une image à la fois." },
    { q: "Redimensionner Image est-il gratuit ?", a: "Oui. L'outil Redimensionner Image d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "image-crop",
    slugs: { en: "crop-image", fr: "recadrer-image" },
    title: { en: "Crop Image Online Free — No Signup | EverydayTools Hub", fr: "Recadrer Image en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Crop Image", fr: "Recadrer une Image" },
    description: { en: "Crop images with drag handles and aspect ratio presets in your browser. Free, no upload, no account. Trim, square, or custom-crop any photo.", fr: "Recadrez des images avec des poignées et des préréglages de proportions dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["crop image online free", "image cropper", "crop photo online", "trim image online free", "square crop image", "crop image to size"], fr: ["recadrer image en ligne gratuit", "outil recadrage image", "recadrer photo en ligne", "rogner image gratuit", "recadrage carré image", "recadrer image"] },
    relatedTools: ["image-resize", "image-compress", "background-remover", "flip-rotate-image", "watermark-image"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Click the upload area or drag your image file." },
        { name: "Drag to crop", text: "Adjust the crop handles on the preview. Use aspect ratio presets (1:1, 4:3, 16:9) for standard crops." },
        { name: "Download the cropped image", text: "Click Crop. Your cropped image downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre image", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier image." },
        { name: "Faites glisser pour recadrer", text: "Ajustez les poignées de recadrage sur l'aperçu. Utilisez les préréglages de proportions (1:1, 4:3, 16:9) pour les recadrages standard." },
        { name: "Téléchargez l'image recadrée", text: "Cliquez sur Recadrer. Votre image recadrée se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Trim your images to the perfect composition with our browser-based cropping tool. Select from common aspect ratios like 1:1, 4:3, or 16:9, or define a custom area to focus on what matters most in your photo.\n\nEverything happens locally on your device, ensuring your images stay private. Once you're happy with the selection, download the cropped version instantly. No upload, no account, and no waiting.",
      fr: "Recadrez vos images pour une composition parfaite avec notre outil directement dans le navigateur. Choisissez parmi des formats courants comme 1:1, 4:3 ou 16:9, ou définissez une zone personnalisée pour vous concentrer sur l'essentiel.\n\nTout se passe localement sur votre appareil, garantissant la confidentialité de vos images. Une fois votre sélection faite, téléchargez instantanément la version recadrée. Sans envoi, sans compte, sans attente."
    },
    faqs: {
      en: [
    { q: "Can I crop to a specific aspect ratio?", a: "Yes. Aspect ratio presets are available for 1:1 (square), 4:3, 16:9 (widescreen), and custom (free crop). Select the preset before dragging the crop handles to lock the proportions." },
    { q: "Will the image quality change after cropping?", a: "No. Cropping only selects a portion of the existing pixels — it does not re-encode or reduce quality. The cropped area retains full original quality." },
    { q: "Can I crop to an exact pixel size?", a: "You can set an exact pixel crop by entering precise coordinates or dimensions. For absolute pixel control, use the Resize Image tool after cropping to set the exact output dimensions." },
    { q: "Does cropping change the file format?", a: "No. The output is in the same format as the input image." },
    { q: "Is Crop Image free?", a: "Yes. EverydayTools Hub Crop Image is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment recadrer une image gratuitement en ligne ?", a: "Téléversez votre image dans l'outil Recadrer Image d'EverydayTools Hub, faites glisser les poignées de recadrage pour sélectionner la zone à conserver, et cliquez sur Recadrer." },
    { q: "Puis-je recadrer selon un format de proportion spécifique ?", a: "Oui. Des préréglages de proportions sont disponibles pour 1:1 (carré), 4:3, 16:9 (grand écran) et personnalisé." },
    { q: "La qualité de l'image changera-t-elle après le recadrage ?", a: "Non. Le recadrage sélectionne uniquement une partie des pixels existants — il ne ré-encode pas ou ne réduit pas la qualité." },
    { q: "Puis-je recadrer à une taille exacte en pixels ?", a: "Vous pouvez définir un recadrage précis en pixels en entrant des coordonnées ou dimensions précises." },
    { q: "Le recadrage change-t-il le format du fichier ?", a: "Non. La sortie est dans le même format que l'image d'entrée." },
    { q: "Recadrer Image est-il gratuit ?", a: "Oui. L'outil Recadrer Image d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "image-to-pdf",
    slugs: { en: "convert-image-to-pdf", fr: "convertir-image-en-pdf" },
    title: { en: "Image to PDF Converter — Free, Online | EverydayTools Hub", fr: "Convertir Image en PDF — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Image to PDF Converter", fr: "Convertisseur Image en PDF" },
    description: { en: "Convert one or more images to a single PDF in your browser. Free, no upload, no account. PNG, JPEG, WEBP all supported.", fr: "Convertissez une ou plusieurs images en un seul PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["image to pdf converter", "convert image to pdf online free", "jpg to pdf", "png to pdf free", "multiple images to pdf", "photos to pdf"], fr: ["convertir image en pdf", "image en pdf gratuit", "jpg en pdf", "png en pdf gratuit", "plusieurs images en pdf", "photos en pdf en ligne"] },
    relatedTools: ["pdf-to-image", "image-compress", "pdf-merge", "image-converter", "jpg-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your images", text: "Click the upload area or drag one or more images. PNG, JPEG, and WEBP are supported." },
        { name: "Arrange and convert", text: "Arrange the images in the order they should appear in the PDF, then click Convert." },
        { name: "Download the PDF", text: "Your PDF with all images as pages downloads immediately." },
      ],
      fr: [
        { name: "Téléversez vos images", text: "Cliquez sur la zone de dépôt ou faites glisser une ou plusieurs images. PNG, JPEG et WEBP sont supportés." },
        { name: "Arrangez et convertissez", text: "Arrangez les images dans l'ordre où elles doivent apparaître dans le PDF, puis cliquez sur Convertir." },
        { name: "Téléchargez le PDF", text: "Votre PDF avec toutes les images en pages se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Convert one or more images into a single, professional PDF document in seconds. Drag and drop your photos, reorder them as needed, and download the result — all without uploading a single file to a server.\n\nThis tool is ideal for creating digital portfolios, assembling scanned documents, or sharing a collection of photos in a universally readable format. The entire process runs in your browser, keeping your images private and secure.",
      fr: "Convertissez une ou plusieurs images en un seul document PDF professionnel en quelques secondes. Glissez-déposez vos photos, réorganisez-les selon vos besoins et téléchargez le résultat — le tout sans envoyer aucun fichier à un serveur.\n\nCet outil est idéal pour créer des portfolios numériques, assembler des documents numérisés ou partager une collection de photos dans un format universel. Tout le processus s'exécute dans votre navigateur, garantissant la sécurité de vos images."
    },
    faqs: {
      en: [
    { q: "Can I put multiple images into one PDF?", a: "Yes. You can upload multiple images at once and they will all be included as separate pages in a single PDF. The page order corresponds to the order of images in the upload list." },
    { q: "What image formats are supported?", a: "PNG, JPEG/JPG, and WEBP images can be converted to PDF. For HEIC photos from iPhone, use the HEIC to JPG converter first, then convert the JPEG to PDF." },
    { q: "Will the image quality be preserved in the PDF?", a: "Yes. Images are embedded in the PDF at their original resolution. No re-encoding or quality reduction is applied during the conversion." },
    { q: "Can I set the page orientation and size?", a: "The PDF pages are sized to match the image dimensions — portrait images create portrait pages, landscape images create landscape pages. Custom page size selection is not currently supported." },
    { q: "Is Image to PDF Converter free?", a: "Yes. EverydayTools Hub Image to PDF Converter is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment convertir des images en PDF gratuitement ?", a: "Téléversez vos images dans le convertisseur Image en PDF d'EverydayTools Hub, arrangez-les dans l'ordre souhaité et cliquez sur Convertir. Un PDF avec chaque image sur sa propre page se télécharge instantanément." },
    { q: "Puis-je mettre plusieurs images dans un seul PDF ?", a: "Oui. Vous pouvez téléverser plusieurs images à la fois et elles seront toutes incluses comme pages séparées dans un seul PDF." },
    { q: "Quels formats d'image sont supportés ?", a: "Les images PNG, JPEG/JPG et WEBP peuvent être converties en PDF. Pour les photos HEIC iPhone, utilisez d'abord le convertisseur HEIC en JPG." },
    { q: "La qualité de l'image sera-t-elle préservée dans le PDF ?", a: "Oui. Les images sont intégrées dans le PDF à leur résolution originale. Aucun ré-encodage ou réduction de qualité n'est appliqué." },
    { q: "Puis-je définir l'orientation et la taille de la page ?", a: "Les pages PDF sont dimensionnées pour correspondre aux dimensions de l'image. La sélection d'une taille de page personnalisée n'est pas actuellement supportée." },
    { q: "Le convertisseur Image en PDF est-il gratuit ?", a: "Oui. Le convertisseur Image en PDF d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-image",
    slugs: { en: "convert-pdf-to-image", fr: "convertir-pdf-en-image" },
    title: { en: "PDF to Image Converter — Free, Online | EverydayTools Hub", fr: "Convertir PDF en Image — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "PDF to Image Converter", fr: "Convertisseur PDF en Image" },
    description: { en: "Export PDF pages as PNG or JPEG images in your browser. Free, no upload, no account. Convert each PDF page to a high-quality image.", fr: "Exportez des pages PDF en images PNG ou JPEG dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["pdf to image converter", "convert pdf to png online free", "pdf to jpg free", "pdf page to image", "export pdf as image", "pdf to jpeg converter"], fr: ["convertir pdf en image", "pdf en png gratuit", "pdf en jpg en ligne", "page pdf en image", "exporter pdf en image", "pdf to jpeg"] },
    relatedTools: ["image-to-pdf", "image-converter", "pdf-to-text", "pdf-compress", "image-compress"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file." },
        { name: "Select output format and quality", text: "Choose PNG (lossless) or JPEG (smaller files), and set the rendering resolution." },
        { name: "Download the images", text: "Click Convert. Each page downloads as a separate image file, or all together in a ZIP archive." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PDF." },
        { name: "Sélectionnez le format et la qualité", text: "Choisissez PNG (sans perte) ou JPEG (fichiers plus petits), et définissez la résolution de rendu." },
        { name: "Téléchargez les images", text: "Cliquez sur Convertir. Chaque page se télécharge comme un fichier image séparé, ou tous ensemble dans une archive ZIP." },
      ],
    },
    about: {
      en: "Turn any PDF page into a high-quality image file. Whether you need a JPEG for a presentation or a PNG for a design project, EverydayTools extracts pages directly in your browser.\n\nSelect specific pages or convert the entire document at once. The tool handles the conversion locally on your device, ensuring your documents never touch a server. Download your images individually or as a single ZIP archive for convenience.",
      fr: "Transformez n'importe quelle page PDF en un fichier image de haute qualité. Que vous ayez besoin d'un JPEG pour une présentation ou d'un PNG pour un projet créatif, EverydayTools extrait les pages directement dans votre navigateur.\n\nSélectionnez des pages précises ou convertissez tout le document. L'outil gère la conversion localement sur votre appareil, garantissant que vos documents ne touchent jamais un serveur. Téléchargez vos images individuellement ou dans un seul ZIP."
    },
    faqs: {
      en: [
    { q: "Which is better for PDF to image: PNG or JPEG?", a: "Use PNG for presentations, screenshots, or content with text that must be sharp — it is lossless. Use JPEG for photographic PDFs where smaller file size is a priority. JPEG is typically 60–70% smaller than PNG for the same image." },
    { q: "What resolution should I use for converting PDF to image?", a: "For screen display and web use, 96–150 DPI is sufficient. For printing, use 300 DPI. For high-resolution digital archiving, 600 DPI. Higher DPI produces sharper images but much larger files." },
    { q: "Can I convert only specific pages?", a: "The tool currently converts all pages. To convert only specific pages, use the Split PDF tool first to extract those pages, then run the PDF to Image conversion on the resulting file." },
    { q: "What is the maximum PDF size that can be converted?", a: "The tool accepts PDFs up to 50 MB. Processing time increases with the number of pages and the selected resolution. Very large PDFs at high resolution may take a minute or more in the browser." },
    { q: "Is PDF to Image Converter free?", a: "Yes. EverydayTools Hub PDF to Image Converter is completely free, with no account required and no watermarks." },
      ],
      fr: [
        { q: "Comment convertir des pages PDF en images gratuitement en ligne ?", a: "Téléversez votre PDF dans le convertisseur PDF en Image d'EverydayTools Hub, sélectionnez PNG ou JPEG, choisissez une résolution et cliquez sur Convertir. Chaque page se télécharge comme image séparée." },
    { q: "Qu'est-ce qui est mieux pour PDF en image : PNG ou JPEG ?", a: "Utilisez PNG pour les présentations ou le contenu avec du texte qui doit être net — il est sans perte. Utilisez JPEG pour les PDF photographiques où la taille de fichier plus petite est une priorité." },
    { q: "Quelle résolution utiliser pour convertir un PDF en image ?", a: "Pour l'affichage sur écran, 96–150 DPI est suffisant. Pour l'impression, utilisez 300 DPI. Pour l'archivage numérique haute résolution, 600 DPI." },
    { q: "Puis-je convertir uniquement des pages spécifiques ?", a: "L'outil convertit actuellement toutes les pages. Pour convertir uniquement des pages spécifiques, utilisez d'abord l'outil Diviser PDF." },
    { q: "Quelle est la taille maximale de PDF pouvant être convertie ?", a: "L'outil accepte les PDF jusqu'à 50 Mo." },
    { q: "Le convertisseur PDF en Image est-il gratuit ?", a: "Oui. Le convertisseur PDF en Image d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans filigrane." },
      ],
    },
  },
  {
    internalSlug: "background-remover",
    slugs: { en: "remove-image-background", fr: "supprimer-fond-image" },
    title: { en: "Remove Image Background Free — AI, Online | EverydayTools Hub", fr: "Supprimer Fond Image Gratuit — IA, En Ligne | EverydayTools Hub" },
    h1: { en: "Background Remover", fr: "Supprimer le Fond d'une Image" },
    description: { en: "Remove image backgrounds using on-device AI — free, no upload, no account. Get a transparent PNG in seconds. Powered by on-device AI.", fr: "Supprimez les fonds d'images avec l'IA sur l'appareil — gratuit, sans envoi, sans compte. PNG transparent en quelques secondes." },
    keywords: { en: ["remove image background free", "background remover online", "remove background from photo", "transparent background free", "ai background removal", "remove bg free"], fr: ["supprimer fond image gratuit", "supprimer arrière-plan photo", "fond transparent gratuit", "suppression fond ia", "enlever fond image en ligne", "remove background gratuit"] },
    relatedTools: ["image-converter", "image-crop", "metadata-cleaner", "image-compress", "watermark-image"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Click the upload area or drag a PNG or JPEG photo. The subject can be a person, product, or object." },
        { name: "AI removes the background", text: "The on-device AI model runs entirely in your browser — no image is sent to any server." },
        { name: "Download the PNG", text: "Click Remove Background. A PNG with a transparent background downloads, ready for compositing or web use." },
      ],
      fr: [
        { name: "Téléversez votre image", text: "Cliquez sur la zone de dépôt ou faites glisser une photo PNG ou JPEG. Le sujet peut être une personne, un produit ou un objet." },
        { name: "L'IA supprime le fond", text: "Le modèle IA s'exécute entièrement dans votre navigateur — aucune image n'est envoyée à un serveur." },
        { name: "Téléchargez le PNG", text: "Cliquez sur Supprimer le fond. Un PNG avec un fond transparent se télécharge, prêt pour la composition ou l'utilisation web." },
      ],
    },
    about: {
      en: "Remove backgrounds from your photos instantly using intelligent edge detection that runs entirely in your browser. Get a clean cutout with a transparent background, perfect for product photos, profile pictures, or creative projects.\n\nYour images are processed locally on your device and are never sent to a server, ensuring total privacy. Once the background is removed, download your new PNG file immediately — no account, no subscription, and no hidden fees.",
      fr: "Supprimez instantanément l'arrière-plan de vos photos grâce à une détection intelligente des contours qui s'exécute entièrement dans votre navigateur. Obtenez un détourage propre avec un fond transparent, parfait pour vos photos de produits ou de profil.\n\nVos images sont traitées localement sur votre appareil et ne sont jamais envoyées à un serveur. Une fois l'arrière-plan supprimé, téléchargez votre nouveau fichier PNG immédiatement — sans compte, sans abonnement et sans frais cachés."
    },
    faqs: {
      en: [
    { q: "Is the background removal done by AI?", a: "Yes. The tool uses an on-device AI model that runs entirely in your browser. No image data is transmitted to any server." },
    { q: "What types of images work best?", a: "The AI works best with images that have a clear foreground subject (person, product, animal, logo) against a distinct background. High contrast between subject and background improves results. Very busy backgrounds or subjects with fine transparent elements (e.g., glass, thin smoke) may require manual cleanup." },
    { q: "Why does the tool take a few seconds to load?", a: "The AI model (approximately 30–50 MB) is downloaded on the first use. Subsequent uses are faster because the model is cached in the browser. The inference itself typically takes 2–10 seconds depending on image size and device speed." },
    { q: "What format is the output?", a: "The output is always a PNG with a transparent alpha channel. PNG is the only format that supports transparency at full quality. To use the result on a website or app, reference the PNG directly or convert it to WEBP format (which also supports transparency) using the Image Converter." },
    { q: "Is Background Remover free?", a: "Yes. EverydayTools Hub Background Remover is completely free, with no account required, no usage limits, and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment supprimer un fond d'une image gratuitement ?", a: "Téléversez votre image dans l'outil Supprimer le Fond d'EverydayTools Hub et cliquez sur Supprimer le fond. Le modèle IA s'exécute dans votre navigateur et produit un PNG transparent qui se télécharge sur votre appareil." },
    { q: "La suppression du fond est-elle effectuée par IA ?", a: "Oui. L'outil utilise un modèle IA sur l'appareil qui s'exécute entièrement dans votre navigateur. Aucune donnée d'image n'est transmise à un serveur." },
    { q: "Quels types d'images fonctionnent le mieux ?", a: "L'IA fonctionne mieux avec des images ayant un sujet au premier plan clair (personne, produit, animal, logo) sur un fond distinct. Les fonds très chargés peuvent nécessiter un nettoyage manuel." },
    { q: "Pourquoi l'outil prend-il quelques secondes à charger ?", a: "Le modèle IA (environ 30–50 Mo) est téléchargé lors de la première utilisation. Les utilisations suivantes sont plus rapides car le modèle est mis en cache dans le navigateur." },
    { q: "Quel format est la sortie ?", a: "La sortie est toujours un PNG avec un canal alpha transparent. PNG est le seul format qui supporte la transparence en pleine qualité." },
    { q: "Supprimer le Fond est-il gratuit ?", a: "Oui. L'outil Supprimer le Fond d'EverydayTools Hub est entièrement gratuit, sans compte requis, sans limites d'utilisation et sans filigrane." },
      ],
    },
  },

  // ─── PRIVACY TOOLS ───────────────────────────────────────────────────────────
  {
    internalSlug: "metadata-cleaner",
    slugs: { en: "clean-file-metadata", fr: "nettoyer-metadonnees-fichier" },
    title: { en: "Metadata Cleaner — Strip EXIF & Document Metadata | EverydayTools Hub", fr: "Nettoyeur de Métadonnées — Supprimer EXIF | EverydayTools Hub" },
    h1: { en: "Metadata Cleaner", fr: "Nettoyeur de Métadonnées" },
    description: { en: "Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info.", fr: "Supprimez les métadonnées EXIF, XMP et de document des photos et PDF dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["metadata cleaner", "remove exif data from photo", "strip exif online free", "remove gps from photo", "pdf metadata remover", "clean image metadata free"], fr: ["nettoyeur métadonnées", "supprimer données exif photo", "supprimer exif en ligne gratuit", "enlever gps photo", "supprimer métadonnées pdf", "nettoyer métadonnées image"] },
    relatedTools: ["ai-text-scrubber", "pdf-protect", "background-remover", "checksum", "pdf-unlock"],
    howItWorks: {
      en: [
        { name: "Upload your file", text: "Click the upload area or drag a JPEG, PNG, or PDF file." },
        { name: "Strip metadata", text: "The tool reads the file in your browser, removes all metadata (EXIF, XMP, IPTC, GPS coordinates, document properties), and writes a clean version." },
        { name: "Download the clean file", text: "Click Clean. Your file without metadata downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre fichier", text: "Cliquez sur la zone de dépôt ou faites glisser un fichier JPEG, PNG ou PDF." },
        { name: "Suppression des métadonnées", text: "L'outil lit le fichier dans votre navigateur, supprime toutes les métadonnées (EXIF, XMP, IPTC, coordonnées GPS, propriétés du document) et écrit une version propre." },
        { name: "Téléchargez le fichier propre", text: "Cliquez sur Nettoyer. Votre fichier sans métadonnées se télécharge immédiatement." },
      ],
    },
    about: {
      en: "Protect your privacy by removing hidden metadata from your photos and documents before sharing them online. EverydayTools strips GPS coordinates, camera settings, and personal identifiers from JPEGs and PDFs directly in your browser.\n\nYour files stay on your device throughout the entire process. Simply drop your files, click Clean, and download the privacy-protected versions. It's the easiest way to ensure you're not accidentally sharing more information than you intended.",
      fr: "Protégez votre vie privée en supprimant les métadonnées cachées de vos photos et documents avant de les partager. EverydayTools retire les coordonnées GPS, les réglages de l'appareil et les identifiants personnels des fichiers JPEG et PDF directement dans votre navigateur.\n\nVos fichiers restent sur votre appareil pendant tout le processus. Déposez vos fichiers, cliquez sur Nettoyer et téléchargez les versions protégées. C'est le moyen le plus simple de ne pas partager d'informations sensibles par accident."
    },
    faqs: {
      en: [
    { q: "What metadata is removed?", a: "For JPEG images: EXIF (camera model, date, GPS coordinates, orientation, shutter speed, ISO, etc.), IPTC (copyright, caption, keywords), and XMP data. For PDFs: author, title, creator application, creation date, modification date, and keywords." },
    { q: "Will removing EXIF data change the visual appearance of my photo?", a: "No. EXIF data is stored in a separate section of the JPEG file, separate from the image pixel data. Removing it has no effect on the colours, sharpness, or any visual aspect of the image." },
    { q: "Can location data really be extracted from my photos?", a: "Yes. JPEG photos taken on a smartphone typically include GPS coordinates in the EXIF data, accurate to within a few metres. Anyone who receives the photo and checks the metadata can see the exact location where it was taken. The Metadata Cleaner removes this data before you share." },
    { q: "Does PDF metadata contain personal information?", a: "Yes. PDFs created in Microsoft Word or Adobe Acrobat often embed the author's name (from the Windows username), the company name (from Office settings), the creation date, and the application used to create it. The Metadata Cleaner removes all of this from the PDF." },
    { q: "Is Metadata Cleaner free?", a: "Yes. EverydayTools Hub Metadata Cleaner is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment supprimer les données EXIF d'une photo gratuitement ?", a: "Téléversez votre JPEG, PNG ou PDF dans le Nettoyeur de Métadonnées d'EverydayTools Hub et cliquez sur Nettoyer. L'outil supprime toutes les métadonnées EXIF, XMP, IPTC et GPS dans votre navigateur." },
    { q: "Quelles métadonnées sont supprimées ?", a: "Pour les images JPEG : EXIF (modèle d'appareil, date, coordonnées GPS, orientation, etc.), IPTC et XMP. Pour les PDF : auteur, titre, application de création, date de création, date de modification et mots-clés." },
    { q: "La suppression des données EXIF modifiera-t-elle l'apparence visuelle de ma photo ?", a: "Non. Les données EXIF sont stockées dans une section séparée du fichier JPEG, indépendante des données de pixels. Leur suppression n'a aucun effet sur les couleurs, la netteté ou tout aspect visuel de l'image." },
    { q: "Les données de localisation peuvent-elles vraiment être extraites de mes photos ?", a: "Oui. Les photos JPEG prises sur un smartphone incluent généralement des coordonnées GPS dans les données EXIF, précises à quelques mètres près. Le Nettoyeur de Métadonnées supprime ces données avant que vous partagiez." },
    { q: "Les métadonnées PDF contiennent-elles des informations personnelles ?", a: "Oui. Les PDF créés dans Word ou Adobe Acrobat intègrent souvent le nom de l'auteur, le nom de l'entreprise, la date de création et l'application utilisée pour le créer." },
    { q: "Le Nettoyeur de Métadonnées est-il gratuit ?", a: "Oui. Le Nettoyeur de Métadonnées d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans limites d'utilisation." },
      ],
    },
  },
  {
    internalSlug: "ai-text-scrubber",
    slugs: { en: "remove-ai-text-watermarks", fr: "supprimer-filigranes-texte-ia" },
    title: { en: "AI Text Scrubber — Remove AI Detection Patterns | EverydayTools Hub", fr: "Nettoyeur de Texte IA — Supprimer Filigranes IA | EverydayTools Hub" },
    h1: { en: "AI Text Scrubber", fr: "Nettoyeur de Texte IA" },
    description: { en: "Remove invisible characters and AI-detection watermarks from text in your browser. Free, no upload, no account. Clean AI text watermarks.", fr: "Supprimez les caractères invisibles et filigranes de détection IA du texte dans votre navigateur. Gratuit, sans envoi, sans compte." },
    keywords: { en: ["ai text watermark remover", "remove invisible characters from text", "ai detection remover", "clean ai generated text", "unicode zero width character remover", "ai watermark scrubber"], fr: ["supprimer filigrane texte ia", "enlever caractères invisibles texte", "nettoyeur détection ia", "nettoyer texte généré ia", "supprimer caractères zéro largeur", "scrubber texte ia"] },
    relatedTools: ["metadata-cleaner", "pdf-to-text", "txt-to-pdf", "checksum", "pdf-protect"],
    howItWorks: {
      en: [
        { name: "Paste or upload your text", text: "Paste text directly or upload a .txt file containing the text to clean." },
        { name: "Scrub hidden characters", text: "The tool scans for and removes zero-width characters, invisible Unicode codepoints, and other text-level AI watermarking patterns." },
        { name: "Download the clean text", text: "Click Scrub. Your cleaned text downloads as a .txt file or can be copied directly." },
      ],
      fr: [
        { name: "Collez ou téléversez votre texte", text: "Collez du texte directement ou téléversez un fichier .txt contenant le texte à nettoyer." },
        { name: "Suppression des caractères cachés", text: "L'outil scanne et supprime les caractères de largeur nulle, les points de code Unicode invisibles et autres modèles de filigranage de texte IA." },
        { name: "Téléchargez le texte propre", text: "Cliquez sur Nettoyer. Votre texte nettoyé se télécharge en fichier .txt ou peut être copié directement." },
      ],
    },
    about: {
      en: "Sanitize your text by removing sensitive information like names, emails, and phone numbers before sharing it with AI tools or other services. EverydayTools identifies and redacts personal data directly in your browser.\n\nYour text is never sent to a server, ensuring your data remains completely private. Copy and paste your content, review the suggested redactions, and get a clean version ready for safe use. Ideal for developers and writers who need to protect confidentiality while using public AI models.",
      fr: "Sécurisez vos textes en supprimant les informations sensibles comme les noms, e-mails et numéros de téléphone avant de les partager avec des outils d'IA. EverydayTools identifie et masque les données personnelles directement dans votre navigateur.\n\nVotre texte n'est jamais envoyé à un serveur, garantissant une confidentialité totale. Copiez votre contenu, vérifiez les masquages suggérés et récupérez une version propre. Idéal pour protéger la confidentialité tout en utilisant des modèles d'IA publics."
    },
    faqs: {
      en: [
    { q: "What are zero-width characters and why are they a problem?", a: "Zero-width characters are Unicode codepoints that take up no space and are invisible when rendered. They can be inserted between visible characters without changing the displayed text. They cause problems in code (syntax errors), databases (unexpected string lengths), and can be used as AI-generation fingerprints." },
    { q: "Does AI watermarking in text actually exist?", a: "Text-level watermarking via statistical token selection and semantic patterns is used in some commercial AI systems. Zero-width character insertion is a simpler technique that some platforms use. Whether a specific piece of text is watermarked depends on which system generated it and the configuration used." },
    { q: "Will scrubbing the text change its visible content?", a: "No. Only invisible codepoints and zero-width characters are removed. All visible characters, punctuation, spaces, and line breaks are preserved." },
    { q: "Can this tool bypass AI detection tools like Turnitin or GPTZero?", a: "The tool removes hidden character-level watermarks. AI detection tools like GPTZero primarily analyse writing style and statistical patterns in the visible text, which this tool does not change. It cannot guarantee that text will pass AI-content detectors." },
    { q: "Is AI Text Scrubber free?", a: "Yes. EverydayTools Hub AI Text Scrubber is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment supprimer les filigranes IA du texte ?", a: "Collez votre texte ou téléversez un fichier .txt dans le Nettoyeur de Texte IA d'EverydayTools Hub et cliquez sur Nettoyer. L'outil scanne et supprime les caractères de largeur nulle et autres modèles de détection IA." },
    { q: "Que sont les caractères de largeur nulle et pourquoi posent-ils problème ?", a: "Les caractères de largeur nulle sont des points de code Unicode qui ne prennent pas de place et sont invisibles. Ils peuvent être insérés entre des caractères visibles sans changer le texte affiché. Ils causent des problèmes dans le code et les bases de données." },
    { q: "Le filigranage IA dans le texte existe-t-il vraiment ?", a: "Le filigranage au niveau du texte via la sélection statistique de jetons et des modèles sémantiques est utilisé dans certains systèmes IA commerciaux. L'insertion de caractères de largeur nulle est une technique plus simple." },
    { q: "Le nettoyage changera-t-il le contenu visible du texte ?", a: "Non. Seuls les points de code invisibles et les caractères de largeur nulle sont supprimés. Tous les caractères visibles, la ponctuation, les espaces et les sauts de ligne sont préservés." },
    { q: "Cet outil peut-il contourner des outils de détection IA comme GPTZero ?", a: "L'outil supprime les filigranes au niveau des caractères cachés. Les outils de détection IA comme GPTZero analysent principalement le style d'écriture et les modèles statistiques dans le texte visible, ce que cet outil ne modifie pas." },
    { q: "Le Nettoyeur de Texte IA est-il gratuit ?", a: "Oui. Le Nettoyeur de Texte IA d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },

  // ─── CALCULATORS ─────────────────────────────────────────────────────────────
  {
    internalSlug: "password-generator",
    slugs: { en: "password-generator", fr: "generateur-mot-de-passe" },
    title: { en: "Password Generator — Secure, Free, No Signup | EverydayTools Hub", fr: "Générateur de Mot de Passe — Sécurisé, Gratuit | EverydayTools Hub" },
    h1: { en: "Password Generator", fr: "Générateur de Mot de Passe" },
    description: { en: "Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.", fr: "Générez des mots de passe cryptographiquement sécurisés avec affichage d'entropie. Gratuit, sans inscription. Personnalisez longueur et caractères." },
    keywords: { en: ["password generator", "secure password generator", "random password generator", "strong password creator", "cryptographic password generator", "free password generator"], fr: ["générateur mot de passe", "générateur mot de passe sécurisé", "créer mot de passe aléatoire", "générateur mot de passe fort", "mot de passe cryptographique", "générateur mot de passe gratuit"] },
    relatedTools: ["pdf-protect", "metadata-cleaner", "percentage-calc", "checksum", "unit-converter"],
    howItWorks: {
      en: [
        { name: "Configure your options", text: "Choose the password length (4–128 characters), and toggle character sets: uppercase, lowercase, numbers, and symbols." },
        { name: "Generate instantly", text: "The generator uses crypto.getRandomValues() — the browser's cryptographically secure random number generator — to produce the password." },
        { name: "Copy and use", text: "Click the copy button to copy the password to your clipboard. The entropy in bits is displayed alongside." },
      ],
      fr: [
        { name: "Configurez vos options", text: "Choisissez la longueur du mot de passe (4–128 caractères) et activez les jeux de caractères : majuscules, minuscules, chiffres et symboles." },
        { name: "Génération instantanée", text: "Le générateur utilise crypto.getRandomValues() — le générateur de nombres aléatoires cryptographiquement sécurisé du navigateur — pour produire le mot de passe." },
        { name: "Copiez et utilisez", text: "Cliquez sur le bouton de copie pour copier le mot de passe dans votre presse-papiers. L'entropie en bits est affichée à côté." },
      ],
    },
    about: {
      en: "Create strong, secure, and unique passwords instantly to protect your online accounts. Customize your password length and choose which character types to include — uppercase, lowercase, numbers, and symbols.\n\nThe generation happens entirely in your browser, so your new password is never transmitted over the internet or stored on a server. Use it to generate random strings for API keys, WiFi passwords, or any service that requires high security.",
      fr: "Créez instantanément des mots de passe forts, sécurisés et uniques pour protéger vos comptes en ligne. Personnalisez la longueur et choisissez les types de caractères à inclure : majuscules, minuscules, chiffres et symboles.\n\nLa génération se fait entièrement dans votre navigateur : votre nouveau mot de passe n'est jamais transmis sur Internet ni stocké sur un serveur. Utilisez-le pour vos clés API, mots de passe WiFi ou tout service nécessitant une sécurité maximale."
    },
    faqs: {
      en: [
    { q: "How long should a password be?", a: "A minimum of 16 characters is recommended for general accounts. For high-security accounts (banking, email, password manager master password), use 24 characters or more. The entropy display shows how many bits of randomness the password has — aim for 80+ bits." },
    { q: "What is password entropy?", a: "Entropy is a measure of how unpredictable a password is, expressed in bits. Each additional bit doubles the number of possible combinations. A 20-character password with uppercase, lowercase, numbers, and symbols has approximately 130 bits of entropy — effectively impossible to brute-force with current technology." },
    { q: "Is the generated password stored anywhere?", a: "No. The password is generated entirely in your browser's memory using crypto.getRandomValues(). It is never transmitted to any server. EverydayTools Hub has no access to the passwords generated by this tool." },
    { q: "What character sets should I include?", a: "For maximum security, include all four character types: uppercase (A–Z), lowercase (a–z), numbers (0–9), and symbols (!@#$%^&* etc.). If a site disallows certain characters, disable only the specific types that are blocked." },
    { q: "Is the Password Generator free?", a: "Yes. EverydayTools Hub Password Generator is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment générer un mot de passe sécurisé gratuitement ?", a: "Allez dans le Générateur de Mot de Passe d'EverydayTools Hub, définissez votre longueur et options de caractères préférées, et cliquez sur Générer. L'outil utilise crypto.getRandomValues() pour produire le mot de passe instantanément." },
    { q: "Quelle longueur doit avoir un mot de passe ?", a: "Un minimum de 16 caractères est recommandé pour les comptes généraux. Pour les comptes hautement sécurisés, utilisez 24 caractères ou plus. L'affichage d'entropie montre combien de bits d'aléatoire le mot de passe possède." },
    { q: "Qu'est-ce que l'entropie d'un mot de passe ?", a: "L'entropie est une mesure de l'imprévisibilité d'un mot de passe, exprimée en bits. Chaque bit supplémentaire double le nombre de combinaisons possibles." },
    { q: "Le mot de passe généré est-il stocké quelque part ?", a: "Non. Le mot de passe est généré entièrement dans la mémoire de votre navigateur avec crypto.getRandomValues(). Il n'est jamais transmis à un serveur." },
    { q: "Quels jeux de caractères inclure ?", a: "Pour une sécurité maximale, incluez les quatre types de caractères : majuscules (A–Z), minuscules (a–z), chiffres (0–9) et symboles." },
    { q: "Le Générateur de Mot de Passe est-il gratuit ?", a: "Oui. Le Générateur de Mot de Passe d'EverydayTools Hub est entièrement gratuit, sans compte requis et sans limites d'utilisation." },
      ],
    },
  },
  {
    internalSlug: "percentage-calc",
    slugs: { en: "percentage-calculator", fr: "calculateur-pourcentage" },
    title: { en: "Percentage Calculator — Free, Online | EverydayTools Hub", fr: "Calculateur de Pourcentage — Gratuit, En Ligne | EverydayTools Hub" },
    h1: { en: "Percentage Calculator", fr: "Calculateur de Pourcentage" },
    description: { en: "Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.", fr: "Calculez des pourcentages, remises, pourboires et marges instantanément dans votre navigateur. Gratuit, sans compte." },
    keywords: { en: ["percentage calculator", "calculate percentage online", "percent calculator free", "discount calculator", "tip calculator online", "markup calculator"], fr: ["calculateur pourcentage", "calculer pourcentage en ligne", "calculatrice pourcentage gratuit", "calculateur remise", "calculateur pourboire", "calculateur marge"] },
    relatedTools: ["unit-converter", "currency-converter", "password-generator", "tip-calculator", "qr-code-generator"],
    howItWorks: {
      en: [
        { name: "Choose the calculation type", text: "Select the percentage problem you need to solve: basic percentage, discount, tip, markup, or percentage change." },
        { name: "Enter the values", text: "Fill in the known values. The calculator instantly shows the result as you type." },
        { name: "Use the result", text: "Copy the result or use it directly. No button to press — calculations update in real time." },
      ],
      fr: [
        { name: "Choisissez le type de calcul", text: "Sélectionnez le problème de pourcentage à résoudre : pourcentage de base, remise, pourboire, marge ou variation." },
        { name: "Entrez les valeurs", text: "Remplissez les valeurs connues. Le calculateur affiche instantanément le résultat au fur et à mesure que vous tapez." },
        { name: "Utilisez le résultat", text: "Copiez le résultat ou utilisez-le directement. Pas de bouton à appuyer — les calculs se mettent à jour en temps réel." },
      ],
    },
    about: {
      en: "Solve any percentage problem instantly with our versatile calculator. Whether you're calculating a discount, working out a tip, or finding a percentage increase, EverydayTools provides the answers as you type.\n\nNo complex formulas or buttons required — just enter your numbers and see the results update in real time. All calculations are performed locally in your browser, making it a fast and private way to handle everyday financial tasks.",
      fr: "Résolvez n'importe quel problème de pourcentage instantanément avec notre calculateur polyvalent. Que ce soit pour une remise, un pourboire ou une augmentation, EverydayTools vous donne les réponses au fur et à mesure que vous tapez.\n\nAucune formule complexe : entrez vos chiffres et voyez les résultats se mettre à jour en temps réel. Tous les calculs sont effectués localement dans votre navigateur, offrant un moyen rapide et privé de gérer vos calculs quotidiens."
    },
    faqs: {
      en: [
    { q: "How do I calculate a discount percentage?", a: "Use the 'Discount' calculation type. Enter the original price and the discount percentage. The calculator shows the discount amount and the final price after the discount. For example: original price $80, discount 25% → final price $60." },
    { q: "How do I calculate a tip?", a: "Use the 'Tip' calculation type. Enter the bill total and the tip percentage (common values: 10%, 15%, 18%, 20%). The calculator shows the tip amount and the total including tip. The tip section also has a split-bill calculator for splitting the total among a group." },
    { q: "How do I find what percentage one number is of another?", a: "Use 'What percentage is X of Y?'. Enter X (the part) and Y (the whole). For example: X=45, Y=180 → 25% (45 is 25% of 180)." },
    { q: "How do I calculate percentage change?", a: "Use 'Percentage change'. Enter the original value and the new value. The calculator shows the percentage increase or decrease. For example: from 80 to 100 is a 25% increase; from 100 to 80 is a 20% decrease." },
    { q: "Is the Percentage Calculator free?", a: "Yes. EverydayTools Hub Percentage Calculator is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment calculer un pourcentage en ligne ?", a: "Allez dans le Calculateur de Pourcentage d'EverydayTools Hub et sélectionnez le type de calcul. Entrez les valeurs connues — le résultat se met à jour instantanément." },
    { q: "Comment calculer une remise en pourcentage ?", a: "Utilisez le type de calcul 'Remise'. Entrez le prix original et le pourcentage de remise. Le calculateur affiche le montant de la remise et le prix final après remise." },
    { q: "Comment calculer un pourboire ?", a: "Utilisez le type de calcul 'Pourboire'. Entrez le total de la facture et le pourcentage de pourboire. Le calculateur affiche le montant du pourboire et le total avec le pourboire." },
    { q: "Comment trouver quel pourcentage un nombre représente par rapport à un autre ?", a: "Utilisez 'Quel pourcentage est X de Y ?'. Entrez X (la partie) et Y (le tout). Par exemple : X=45, Y=180 → 25%." },
    { q: "Comment calculer une variation en pourcentage ?", a: "Utilisez 'Variation en pourcentage'. Entrez la valeur originale et la nouvelle valeur. Le calculateur affiche l'augmentation ou la diminution en pourcentage." },
    { q: "Le Calculateur de Pourcentage est-il gratuit ?", a: "Oui. Le Calculateur de Pourcentage d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "unit-converter",
    slugs: { en: "unit-converter", fr: "convertisseur-unites" },
    title: { en: "Unit Converter — Free, Online, 200+ Units | EverydayTools Hub", fr: "Convertisseur d'Unités — Gratuit, En Ligne, 200+ Unités | EverydayTools Hub" },
    h1: { en: "Unit Converter", fr: "Convertisseur d'Unités" },
    description: { en: "Convert between 200+ units across 13 measurement categories in your browser. Free, no account. Length, weight, temperature, volume, and more.", fr: "Convertissez entre 200+ unités dans 13 catégories dans votre navigateur. Gratuit, sans compte. Longueur, poids, température, volume et plus." },
    keywords: { en: ["unit converter online free", "measurement converter", "metric to imperial converter", "length converter", "weight converter online", "temperature converter"], fr: ["convertisseur d'unités en ligne gratuit", "convertisseur de mesures", "convertisseur métrique impérial", "convertisseur de longueur", "convertisseur de poids", "convertisseur de température"] },
    relatedTools: ["currency-converter", "percentage-calc", "password-generator", "tip-calculator", "qr-code-generator"],
    howItWorks: {
      en: [
        { name: "Select a category", text: "Choose from 13 categories: length, weight, temperature, volume, area, speed, time, digital storage, energy, pressure, power, angle, or frequency." },
        { name: "Enter the value and unit", text: "Type the value in any unit in the category. All equivalent values in other units update instantly." },
        { name: "Read the result", text: "All conversions are shown simultaneously, so you can compare units at a glance." },
      ],
      fr: [
        { name: "Sélectionnez une catégorie", text: "Choisissez parmi 13 catégories : longueur, poids, température, volume, superficie, vitesse, temps, stockage numérique, énergie, pression, puissance, angle ou fréquence." },
        { name: "Entrez la valeur et l'unité", text: "Tapez la valeur dans n'importe quelle unité de la catégorie. Toutes les valeurs équivalentes dans les autres unités se mettent à jour instantanément." },
        { name: "Lisez le résultat", text: "Toutes les conversions sont affichées simultanément, vous permettant de comparer les unités en un coup d'œil." },
      ],
    },
    about: {
      en: "Convert measurements between hundreds of different units across length, weight, temperature, volume, and more. EverydayTools provides a comprehensive and easy-to-use interface for all your conversion needs, running entirely in your browser.\n\nSee all equivalent values simultaneously as you type, making it easy to compare different units at a glance. No data is sent to a server, and the tool works instantly for any conversion, from metric to imperial and beyond.",
      fr: "Convertissez des mesures entre des centaines d'unités : longueur, poids, température, volume et plus encore. EverydayTools offre une interface complète et simple pour tous vos besoins, fonctionnant entièrement dans votre navigateur.\n\nVisualisez toutes les valeurs équivalentes en temps réel pour comparer les unités en un coup d'œil. Aucune donnée n'est envoyée à un serveur, et l'outil fonctionne instantanément pour toutes vos conversions, du métrique à l'impérial."
    },
    faqs: {
      en: [
    { q: "What unit categories are supported?", a: "13 categories: length, mass/weight, temperature, volume, area, speed, time, digital storage, energy, pressure, power, angle, and frequency. Over 200 individual units are available across these categories." },
    { q: "How accurate are the conversions?", a: "Conversions use the standard SI definitions and internationally accepted conversion factors. All calculations are performed at full JavaScript floating-point precision (64-bit IEEE 754). For practical purposes, results are accurate to at least 10 significant figures." },
    { q: "Can I convert between metric and imperial units?", a: "Yes. The converter supports both metric (SI) and imperial/US customary units for all applicable categories. For example, in length: metres, kilometres, centimetres, millimetres (metric) alongside feet, inches, yards, miles, and nautical miles (imperial)." },
    { q: "Does the tool support temperature conversion including Kelvin?", a: "Yes. The temperature category supports Celsius, Fahrenheit, Kelvin, and Rankine. Temperature conversions use the exact conversion formulas (not simple multiplication) to handle the offset between scales correctly." },
    { q: "Is the Unit Converter free?", a: "Yes. EverydayTools Hub Unit Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Comment convertir des unités en ligne gratuitement ?", a: "Allez dans le Convertisseur d'Unités d'EverydayTools Hub, sélectionnez la catégorie de mesure, entrez une valeur dans n'importe quelle unité et toutes les valeurs équivalentes apparaissent instantanément." },
    { q: "Quelles catégories d'unités sont supportées ?", a: "13 catégories : longueur, masse/poids, température, volume, superficie, vitesse, temps, stockage numérique, énergie, pression, puissance, angle et fréquence. Plus de 200 unités individuelles sont disponibles." },
    { q: "Quelle est la précision des conversions ?", a: "Les conversions utilisent les définitions SI standard et les facteurs de conversion internationalement acceptés. Tous les calculs sont effectués à pleine précision en virgule flottante JavaScript." },
    { q: "Puis-je convertir entre unités métriques et impériales ?", a: "Oui. Le convertisseur supporte les unités métriques (SI) et impériales/américaines pour toutes les catégories applicables." },
    { q: "L'outil supporte-t-il la conversion de température incluant Kelvin ?", a: "Oui. La catégorie température supporte Celsius, Fahrenheit, Kelvin et Rankine. Les conversions de température utilisent les formules de conversion exactes pour gérer correctement le décalage entre les échelles." },
    { q: "Le Convertisseur d'Unités est-il gratuit ?", a: "Oui. Le Convertisseur d'Unités d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "currency-converter",
    slugs: { en: "currency-converter", fr: "convertisseur-devises" },
    title: { en: "Currency Converter — Live Rates, Free | EverydayTools Hub", fr: "Convertisseur de Devises — Taux en Direct, Gratuit | EverydayTools Hub" },
    h1: { en: "Currency Converter", fr: "Convertisseur de Devises" },
    description: { en: "Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com.", fr: "Convertissez entre 170 devises avec des taux de change en direct dans votre navigateur. Gratuit, sans compte. Taux mis à jour toutes les heures." },
    keywords: { en: ["currency converter online free", "live exchange rate converter", "real time currency converter", "usd to eur converter", "forex calculator free", "money converter online"], fr: ["convertisseur de devises en ligne gratuit", "convertisseur taux de change", "taux de change en direct", "calculateur forex gratuit", "convertisseur monnaie en ligne", "taux de change temps réel"] },
    relatedTools: ["unit-converter", "percentage-calc", "password-generator", "tip-calculator", "qr-code-generator"],
    howItWorks: {
      en: [
        { name: "Select currencies", text: "Choose the source currency and target currency from the dropdown. 170 currencies are available." },
        { name: "Enter the amount", text: "Type the amount to convert. The result updates in real time using live exchange rates." },
        { name: "Read the result", text: "The converted amount and the current exchange rate are displayed. Rates are refreshed from open.er-api.com and cached for 1 hour." },
      ],
      fr: [
        { name: "Sélectionnez les devises", text: "Choisissez la devise source et la devise cible dans le menu déroulant. 170 devises sont disponibles." },
        { name: "Entrez le montant", text: "Tapez le montant à convertir. Le résultat se met à jour en temps réel en utilisant les taux de change en direct." },
        { name: "Lisez le résultat", text: "Le montant converti et le taux de change actuel sont affichés. Les taux sont actualisés depuis open.er-api.com et mis en cache pendant 1 heure." },
      ],
    },
    about: {
      en: "Get accurate currency conversions using live exchange rates for over 170 world currencies. EverydayTools provides a fast, clean interface to see exactly what your money is worth, with rates updated every hour.\n\nYour conversion happens entirely in your browser, and the latest rates are cached for your convenience. Whether you're planning a trip or checking international prices, get the information you need instantly without any tracking or registration.",
      fr: "Obtenez des conversions de devises précises avec des taux de change en direct pour plus de 170 monnaies mondiales. EverydayTools offre une interface rapide et claire pour connaître la valeur de votre argent, avec des taux mis à jour toutes les heures.\n\nVotre conversion s'effectue entièrement dans votre navigateur et les derniers taux sont mis en cache. Que ce soit pour planifier un voyage ou vérifier des prix internationaux, obtenez l'information instantanément, sans suivi ni inscription."
    },
    faqs: {
      en: [
    { q: "How often are rates updated?", a: "Rates are fetched from the API and cached in your browser for 1 hour. After 1 hour, the next conversion request fetches fresh rates. The timestamp of the last update is shown in the converter." },
    { q: "What happens if the rate API is unavailable?", a: "If the live rate fetch fails (no internet, API down, etc.), the converter falls back to a built-in static rate table. Static rates are approximate and may not reflect current market rates. The converter indicates when static fallback rates are in use." },
    { q: "Are cryptocurrency exchange rates supported?", a: "No. The converter uses open.er-api.com which covers fiat currencies only. Cryptocurrency rates change every second and require specialised APIs (CoinGecko, CryptoCompare, etc.) that are outside the scope of this tool." },
    { q: "What is a mid-market exchange rate?", a: "The mid-market rate (also called the interbank rate or spot rate) is the midpoint between the buy price and sell price of a currency. It is the rate you see on Google or financial news sites. Banks and exchange offices apply a margin on top of this rate, which is their profit." },
    { q: "Is the Currency Converter free?", a: "Yes. EverydayTools Hub Currency Converter is completely free, with no account required." },
      ],
      fr: [
        { q: "Quelle est la précision des taux de change ?", a: "Les taux proviennent d'open.er-api.com, qui fournit des taux médians mis à jour toutes les heures. Les taux médians sont les taux de référence les plus équitables — ils représentent le milieu entre les taux d'achat et de vente." },
    { q: "À quelle fréquence les taux sont-ils mis à jour ?", a: "Les taux sont récupérés depuis l'API et mis en cache dans votre navigateur pendant 1 heure. Après 1 heure, la prochaine demande de conversion récupère des taux frais." },
    { q: "Que se passe-t-il si l'API de taux n'est pas disponible ?", a: "Si la récupération des taux en direct échoue, le convertisseur utilise une table de taux statiques intégrée. Les taux statiques sont approximatifs et peuvent ne pas refléter les taux du marché actuels." },
    { q: "Les taux de change de crypto-monnaies sont-ils supportés ?", a: "Non. Le convertisseur utilise open.er-api.com qui couvre uniquement les devises fiduciaires. Les taux des crypto-monnaies changent chaque seconde et nécessitent des API spécialisées." },
    { q: "Qu'est-ce qu'un taux de change médian ?", a: "Le taux médian (aussi appelé taux interbancaire ou taux au comptant) est le milieu entre le prix d'achat et le prix de vente d'une devise. Les banques appliquent une marge au-dessus de ce taux." },
    { q: "Le Convertisseur de Devises est-il gratuit ?", a: "Oui. Le Convertisseur de Devises d'EverydayTools Hub est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "avif-to-jpg",
    slugs: {
      en: "convert-avif-to-jpg",
      fr: "convertir-avif-en-jpg"
    },
    title: {
      en: "AVIF to JPG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir AVIF en JPG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "AVIF to JPG Converter",
      fr: "Convertisseur AVIF en JPG"
    },
    description: {
      en: "Convert AVIF images to JPG format in your browser. Free, no upload, no account required. AVIF is not universally supported outside modern browsers. JPEG opens on every device, app, and platform.",
      fr: "Convertissez des images AVIF en JPG dans votre navigateur. Gratuit, sans envoi, sans compte. AVIF n'est pas universellement supporté en dehors des navigateurs modernes. JPEG s'ouvre sur tous les appareils, applications et plateformes."
    },
    keywords: {
      en: [
        "avif to jpg converter",
        "convert avif to jpg online free",
        "avif to jpg free",
        "avif jpg online",
        "free avif to jpg converter",
        "avif to jpg no upload"
      ],
      fr: [
        "convertir avif en jpg",
        "avif en jpg gratuit",
        "convertisseur avif jpg en ligne",
        "avif vers jpg sans logiciel",
        "avif jpg en ligne gratuit",
        "convertir image avif en jpg"
      ]
    },
    relatedTools: [
      "avif-to-png",
      "image-converter",
      "image-compress",
      "jpg-to-png",
      "jpg-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your AVIF file",
          text: "Click the upload area or drag your .avif file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your AVIF to JPG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the JPG file",
          text: "Your JPG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier AVIF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .avif. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre AVIF en JPG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier JPG",
          text: "Votre fichier JPG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "AVIF is a next-generation format with superior compression — typically 50% smaller than JPEG — but with limited support in older software and non-browser apps.",
      fr: "AVIF est un format nouvelle génération avec une compression supérieure — environ 50 % plus petit que JPEG — mais avec un support limité dans les anciens logiciels."
    },
    faqs: {
      en: [
        {
          q: "Why convert AVIF to JPG?",
          a: "AVIF is not universally supported outside modern browsers. JPEG opens on every device, app, and platform."
        },
        {
          q: "Does AVIF to JPG conversion affect quality?",
          a: "JPEG is lossy, so minimal quality loss occurs. At high-quality settings the difference is imperceptible."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple AVIF files in a single upload."
        },
        {
          q: "Is AVIF to JPG Converter free?",
          a: "Yes. EverydayTools AVIF to JPG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir AVIF en JPG ?",
          a: "AVIF n'est pas universellement supporté en dehors des navigateurs modernes. JPEG s'ouvre sur tous les appareils, applications et plateformes."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "JPEG est avec perte, donc une légère perte de qualité se produit. À haute qualité, la différence est imperceptible."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers AVIF en un seul téléversement."
        },
        {
          q: "Le convertisseur AVIF en JPG est-il gratuit ?",
          a: "Oui. Le convertisseur AVIF en JPG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "avif-to-png",
    slugs: {
      en: "convert-avif-to-png",
      fr: "convertir-avif-en-png"
    },
    title: {
      en: "AVIF to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir AVIF en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "AVIF to PNG Converter",
      fr: "Convertisseur AVIF en PNG"
    },
    description: {
      en: "Convert AVIF images to PNG format in your browser. Free, no upload, no account required. PNG is lossless and supports transparency, making it ideal for design work where pixel-perfect quality matters.",
      fr: "Convertissez des images AVIF en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG est sans perte et supporte la transparence, ce qui le rend idéal pour le travail de design où la précision au pixel compte."
    },
    keywords: {
      en: [
        "avif to png converter",
        "convert avif to png online free",
        "avif to png free",
        "avif png online",
        "free avif to png converter",
        "avif to png no upload"
      ],
      fr: [
        "convertir avif en png",
        "avif en png gratuit",
        "convertisseur avif png en ligne",
        "avif vers png sans logiciel",
        "avif png en ligne gratuit",
        "convertir image avif en png"
      ]
    },
    relatedTools: [
      "avif-to-jpg",
      "png-to-webp",
      "image-converter",
      "background-remover",
      "png-to-jpg"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your AVIF file",
          text: "Click the upload area or drag your .avif file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your AVIF to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier AVIF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .avif. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre AVIF en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "AVIF is a next-generation format with superior compression — typically 50% smaller than JPEG — but with limited support in older software and non-browser apps.",
      fr: "AVIF est un format nouvelle génération avec une compression supérieure — environ 50 % plus petit que JPEG — mais avec un support limité dans les anciens logiciels."
    },
    faqs: {
      en: [
        {
          q: "Why convert AVIF to PNG?",
          a: "PNG is lossless and supports transparency, making it ideal for design work where pixel-perfect quality matters."
        },
        {
          q: "Does AVIF to PNG conversion affect quality?",
          a: "PNG output is lossless — no quality loss. File sizes will be larger than the source AVIF."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple AVIF files in a single upload."
        },
        {
          q: "Is AVIF to PNG Converter free?",
          a: "Yes. EverydayTools AVIF to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir AVIF en PNG ?",
          a: "PNG est sans perte et supporte la transparence, ce qui le rend idéal pour le travail de design où la précision au pixel compte."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "La sortie PNG est sans perte — aucune perte de qualité. Les fichiers seront plus grands que l'AVIF source."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers AVIF en un seul téléversement."
        },
        {
          q: "Le convertisseur AVIF en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur AVIF en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "bmp-to-jpg",
    slugs: {
      en: "convert-bmp-to-jpg",
      fr: "convertir-bmp-en-jpg"
    },
    title: {
      en: "BMP to JPG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir BMP en JPG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "BMP to JPG Converter",
      fr: "Convertisseur BMP en JPG"
    },
    description: {
      en: "Convert BMP images to JPG format in your browser. Free, no upload, no account required. BMP files are huge — often 10–50× larger than JPEG for the same image. Convert to JPEG for drastically smaller files with minimal visible quality loss.",
      fr: "Convertissez des images BMP en JPG dans votre navigateur. Gratuit, sans envoi, sans compte. Les fichiers BMP sont énormes — souvent 10 à 50 fois plus grands que JPEG. Convertissez en JPEG pour des fichiers bien plus petits avec une perte de qualité minime."
    },
    keywords: {
      en: [
        "bmp to jpg converter",
        "convert bmp to jpg online free",
        "bmp to jpg free",
        "bmp jpg online",
        "free bmp to jpg converter",
        "bmp to jpg no upload"
      ],
      fr: [
        "convertir bmp en jpg",
        "bmp en jpg gratuit",
        "convertisseur bmp jpg en ligne",
        "bmp vers jpg sans logiciel",
        "bmp jpg en ligne gratuit",
        "convertir image bmp en jpg"
      ]
    },
    relatedTools: [
      "bmp-to-webp",
      "image-converter",
      "image-compress",
      "jpg-to-png",
      "jpg-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your BMP file",
          text: "Click the upload area or drag your .bmp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your BMP to JPG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the JPG file",
          text: "Your JPG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier BMP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .bmp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre BMP en JPG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier JPG",
          text: "Votre fichier JPG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "BMP is an uncompressed Windows bitmap format. BMP stores every pixel without any compression, resulting in files that are typically 10–50× larger than the equivalent JPEG.",
      fr: "BMP est un format bitmap Windows non compressé. BMP stocke chaque pixel sans compression, donnant des fichiers 10 à 50 fois plus grands que le JPEG équivalent."
    },
    faqs: {
      en: [
        {
          q: "Why convert BMP to JPG?",
          a: "BMP files are huge — often 10–50× larger than JPEG for the same image. Convert to JPEG for drastically smaller files with minimal visible quality loss."
        },
        {
          q: "Does BMP to JPG conversion affect quality?",
          a: "JPEG is lossy. The conversion from uncompressed BMP produces a file that is typically 90–95% smaller with minimal visible change."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple BMP files in a single upload."
        },
        {
          q: "Is BMP to JPG Converter free?",
          a: "Yes. EverydayTools BMP to JPG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir BMP en JPG ?",
          a: "Les fichiers BMP sont énormes — souvent 10 à 50 fois plus grands que JPEG. Convertissez en JPEG pour des fichiers bien plus petits avec une perte de qualité minime."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "JPEG est avec perte. La conversion depuis BMP non compressé produit un fichier 90 à 95 % plus petit avec un changement visible minimal."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers BMP en un seul téléversement."
        },
        {
          q: "Le convertisseur BMP en JPG est-il gratuit ?",
          a: "Oui. Le convertisseur BMP en JPG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "bmp-to-webp",
    slugs: {
      en: "convert-bmp-to-webp",
      fr: "convertir-bmp-en-webp"
    },
    title: {
      en: "BMP to WebP Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir BMP en WebP — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "BMP to WebP Converter",
      fr: "Convertisseur BMP en WebP"
    },
    description: {
      en: "Convert BMP images to WebP format in your browser. Free, no upload, no account required. BMP is an uncompressed legacy format. WebP delivers modern compression ratios — typically 90%+ size reduction — ideal for web use.",
      fr: "Convertissez des images BMP en WebP dans votre navigateur. Gratuit, sans envoi, sans compte. BMP est un format non compressé obsolète. WebP offre une compression moderne — réduction de taille de 90 %+ — idéal pour le web."
    },
    keywords: {
      en: [
        "bmp to webp converter",
        "convert bmp to webp online free",
        "bmp to webp free",
        "bmp webp online",
        "free bmp to webp converter",
        "bmp to webp no upload"
      ],
      fr: [
        "convertir bmp en webp",
        "bmp en webp gratuit",
        "convertisseur bmp webp en ligne",
        "bmp vers webp sans logiciel",
        "bmp webp en ligne gratuit",
        "convertir image bmp en webp"
      ]
    },
    relatedTools: [
      "bmp-to-jpg",
      "png-to-webp",
      "image-converter",
      "image-compress",
      "jpg-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your BMP file",
          text: "Click the upload area or drag your .bmp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your BMP to WebP entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the WebP file",
          text: "Your WebP file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier BMP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .bmp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre BMP en WebP entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier WebP",
          text: "Votre fichier WebP se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "BMP is an uncompressed Windows bitmap format. BMP stores every pixel without any compression, resulting in files that are typically 10–50× larger than the equivalent JPEG.",
      fr: "BMP est un format bitmap Windows non compressé. BMP stocke chaque pixel sans compression, donnant des fichiers 10 à 50 fois plus grands que le JPEG équivalent."
    },
    faqs: {
      en: [
        {
          q: "Why convert BMP to WebP?",
          a: "BMP is an uncompressed legacy format. WebP delivers modern compression ratios — typically 90%+ size reduction — ideal for web use."
        },
        {
          q: "Does BMP to WebP conversion affect quality?",
          a: "WebP uses lossy compression by default. The file will be dramatically smaller than the source BMP with minimal visible quality difference."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple BMP files in a single upload."
        },
        {
          q: "Is BMP to WebP Converter free?",
          a: "Yes. EverydayTools BMP to WebP Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir BMP en WebP ?",
          a: "BMP est un format non compressé obsolète. WebP offre une compression moderne — réduction de taille de 90 %+ — idéal pour le web."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "WebP utilise une compression avec perte par défaut. Le fichier sera nettement plus petit que le BMP source avec une différence de qualité visible minimale."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers BMP en un seul téléversement."
        },
        {
          q: "Le convertisseur BMP en WebP est-il gratuit ?",
          a: "Oui. Le convertisseur BMP en WebP d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "gif-to-png",
    slugs: {
      en: "convert-gif-to-png",
      fr: "convertir-gif-en-png"
    },
    title: {
      en: "GIF to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir GIF en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "GIF to PNG Converter",
      fr: "Convertisseur GIF en PNG"
    },
    description: {
      en: "Convert GIF images to PNG format in your browser. Free, no upload, no account required. PNG is a lossless format with full 24-bit color, making it far superior to GIF for static images where quality matters.",
      fr: "Convertissez des images GIF en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG est sans perte avec 24 bits de couleur, le rendant bien supérieur à GIF pour les images statiques où la qualité compte."
    },
    keywords: {
      en: [
        "gif to png converter",
        "convert gif to png online free",
        "gif to png free",
        "gif png online",
        "free gif to png converter",
        "gif to png no upload"
      ],
      fr: [
        "convertir gif en png",
        "gif en png gratuit",
        "convertisseur gif png en ligne",
        "gif vers png sans logiciel",
        "gif png en ligne gratuit",
        "convertir image gif en png"
      ]
    },
    relatedTools: [
      "gif-to-webp",
      "png-to-webp",
      "image-converter",
      "image-compress",
      "png-to-jpg"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your GIF file",
          text: "Click the upload area or drag your .gif file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your GIF to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier GIF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .gif. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre GIF en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "GIF is a format limited to 256 colors per frame, best known for its animation support. GIF's color restriction makes it a poor choice for photos.",
      fr: "GIF est un format limité à 256 couleurs par image, surtout connu pour le support de l'animation. La restriction de couleurs de GIF en fait un mauvais choix pour les photos."
    },
    faqs: {
      en: [
        {
          q: "Why convert GIF to PNG?",
          a: "PNG is a lossless format with full 24-bit color, making it far superior to GIF for static images where quality matters."
        },
        {
          q: "Does GIF to PNG conversion affect quality?",
          a: "PNG is lossless. Converting a GIF to PNG will improve color quality (24-bit vs. 256 colors) and is lossless from the PNG side."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple GIF files in a single upload."
        },
        {
          q: "Is GIF to PNG Converter free?",
          a: "Yes. EverydayTools GIF to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir GIF en PNG ?",
          a: "PNG est sans perte avec 24 bits de couleur, le rendant bien supérieur à GIF pour les images statiques où la qualité compte."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "PNG est sans perte. La conversion d'un GIF en PNG améliore la qualité des couleurs (24 bits vs. 256 couleurs)."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers GIF en un seul téléversement."
        },
        {
          q: "Le convertisseur GIF en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur GIF en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "gif-to-webp",
    slugs: {
      en: "convert-gif-to-webp",
      fr: "convertir-gif-en-webp"
    },
    title: {
      en: "GIF to WebP Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir GIF en WebP — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "GIF to WebP Converter",
      fr: "Convertisseur GIF en WebP"
    },
    description: {
      en: "Convert GIF images to WebP format in your browser. Free, no upload, no account required. WebP supports animation just like GIF, but with dramatically better compression — typically 50–80% smaller. Ideal for web use.",
      fr: "Convertissez des images GIF en WebP dans votre navigateur. Gratuit, sans envoi, sans compte. WebP supporte l'animation comme GIF, mais avec une compression nettement meilleure — typiquement 50 à 80 % plus petite. Idéal pour le web."
    },
    keywords: {
      en: [
        "gif to webp converter",
        "convert gif to webp online free",
        "gif to webp free",
        "gif webp online",
        "free gif to webp converter",
        "gif to webp no upload"
      ],
      fr: [
        "convertir gif en webp",
        "gif en webp gratuit",
        "convertisseur gif webp en ligne",
        "gif vers webp sans logiciel",
        "gif webp en ligne gratuit",
        "convertir image gif en webp"
      ]
    },
    relatedTools: [
      "gif-to-png",
      "png-to-webp",
      "image-converter",
      "image-compress",
      "jpg-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your GIF file",
          text: "Click the upload area or drag your .gif file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your GIF to WebP entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the WebP file",
          text: "Your WebP file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier GIF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .gif. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre GIF en WebP entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier WebP",
          text: "Votre fichier WebP se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "GIF is a format limited to 256 colors per frame, best known for its animation support. GIF's color restriction makes it a poor choice for photos.",
      fr: "GIF est un format limité à 256 couleurs par image, surtout connu pour le support de l'animation. La restriction de couleurs de GIF en fait un mauvais choix pour les photos."
    },
    faqs: {
      en: [
        {
          q: "Why convert GIF to WebP?",
          a: "WebP supports animation just like GIF, but with dramatically better compression — typically 50–80% smaller. Ideal for web use."
        },
        {
          q: "Does GIF to WebP conversion affect quality?",
          a: "Animated WebP files are significantly smaller than animated GIFs. Static frames also compress better with WebP."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple GIF files in a single upload."
        },
        {
          q: "Is GIF to WebP Converter free?",
          a: "Yes. EverydayTools GIF to WebP Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir GIF en WebP ?",
          a: "WebP supporte l'animation comme GIF, mais avec une compression nettement meilleure — typiquement 50 à 80 % plus petite. Idéal pour le web."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "Les WebP animés sont nettement plus petits que les GIF animés. Les images statiques se compriment aussi mieux avec WebP."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers GIF en un seul téléversement."
        },
        {
          q: "Le convertisseur GIF en WebP est-il gratuit ?",
          a: "Oui. Le convertisseur GIF en WebP d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "heic-to-pdf",
    slugs: {
      en: "convert-heic-to-pdf",
      fr: "convertir-heic-en-pdf"
    },
    title: {
      en: "HEIC to PDF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir HEIC en PDF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "HEIC to PDF Converter",
      fr: "Convertisseur HEIC en PDF"
    },
    description: {
      en: "Convert HEIC images to PDF format in your browser. Free, no upload, no account required. Wrap one or more iPhone photos in a PDF for easy sharing, printing, or document archiving — compatible with any device.",
      fr: "Convertissez des images HEIC en PDF dans votre navigateur. Gratuit, sans envoi, sans compte. Regroupez une ou plusieurs photos iPhone dans un PDF pour un partage, une impression ou un archivage facile — compatible avec tous les appareils."
    },
    keywords: {
      en: [
        "heic to pdf converter",
        "convert heic to pdf online free",
        "heic to pdf free",
        "heic pdf online",
        "free heic to pdf converter",
        "heic to pdf no upload"
      ],
      fr: [
        "convertir heic en pdf",
        "heic en pdf gratuit",
        "convertisseur heic pdf en ligne",
        "heic vers pdf sans logiciel",
        "heic pdf en ligne gratuit",
        "convertir image heic en pdf"
      ]
    },
    relatedTools: [
      "heic-to-jpg",
      "image-to-pdf",
      "pdf-to-image",
      "image-converter",
      "heic-to-png"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your HEIC file",
          text: "Click the upload area or drag your .heic file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your HEIC to PDF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PDF file",
          text: "Your PDF with all images as pages downloads immediately."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier HEIC",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .heic. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre HEIC en PDF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PDF",
          text: "Votre PDF avec toutes les images en pages se télécharge immédiatement."
        }
      ]
    },
    about: {
      en: "HEIC is Apple's default iPhone photo format since iOS 11. HEIC offers around 50% smaller file sizes than JPEG at the same quality, but requires Apple devices or special software to open.",
      fr: "HEIC est le format photo iPhone par défaut depuis iOS 11. HEIC offre environ 50 % de fichiers plus petits que JPEG à la même qualité, mais nécessite des appareils Apple ou un logiciel spécial."
    },
    faqs: {
      en: [
        {
          q: "Why convert HEIC to PDF?",
          a: "Wrap one or more iPhone photos in a PDF for easy sharing, printing, or document archiving — compatible with any device."
        },
        {
          q: "Does HEIC to PDF conversion affect quality?",
          a: "Images are embedded in the PDF at full resolution. No quality loss occurs during the conversion."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple HEIC files in a single upload."
        },
        {
          q: "Is HEIC to PDF Converter free?",
          a: "Yes. EverydayTools HEIC to PDF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir HEIC en PDF ?",
          a: "Regroupez une ou plusieurs photos iPhone dans un PDF pour un partage, une impression ou un archivage facile — compatible avec tous les appareils."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "Les images sont intégrées dans le PDF à pleine résolution. Aucune perte de qualité ne se produit pendant la conversion."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers HEIC en un seul téléversement."
        },
        {
          q: "Le convertisseur HEIC en PDF est-il gratuit ?",
          a: "Oui. Le convertisseur HEIC en PDF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "heic-to-png",
    slugs: {
      en: "convert-heic-to-png",
      fr: "convertir-heic-en-png"
    },
    title: {
      en: "HEIC to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir HEIC en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "HEIC to PNG Converter",
      fr: "Convertisseur HEIC en PNG"
    },
    description: {
      en: "Convert HEIC images to PNG format in your browser. Free, no upload, no account required. PNG is lossless and supports transparency — ideal for design work, editing, or when you need a pixel-perfect copy of your iPhone photo.",
      fr: "Convertissez des images HEIC en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG est sans perte et supporte la transparence — idéal pour le design, l'édition ou lorsque vous avez besoin d'une copie exacte de votre photo iPhone."
    },
    keywords: {
      en: [
        "heic to png converter",
        "convert heic to png online free",
        "heic to png free",
        "heic png online",
        "free heic to png converter",
        "heic to png no upload"
      ],
      fr: [
        "convertir heic en png",
        "heic en png gratuit",
        "convertisseur heic png en ligne",
        "heic vers png sans logiciel",
        "heic png en ligne gratuit",
        "convertir image heic en png"
      ]
    },
    relatedTools: [
      "heic-to-jpg",
      "heic-to-webp",
      "png-to-webp",
      "background-remover",
      "heic-to-pdf"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your HEIC file",
          text: "Click the upload area or drag your .heic file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your HEIC to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier HEIC",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .heic. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre HEIC en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "HEIC is Apple's default iPhone photo format since iOS 11. HEIC offers around 50% smaller file sizes than JPEG at the same quality, but requires Apple devices or special software to open.",
      fr: "HEIC est le format photo iPhone par défaut depuis iOS 11. HEIC offre environ 50 % de fichiers plus petits que JPEG à la même qualité, mais nécessite des appareils Apple ou un logiciel spécial."
    },
    faqs: {
      en: [
        {
          q: "Why convert HEIC to PNG?",
          a: "PNG is lossless and supports transparency — ideal for design work, editing, or when you need a pixel-perfect copy of your iPhone photo."
        },
        {
          q: "Does HEIC to PNG conversion affect quality?",
          a: "PNG is lossless, so the output preserves full image quality. PNG files will be larger than the source HEIC."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple HEIC files in a single upload."
        },
        {
          q: "Is HEIC to PNG Converter free?",
          a: "Yes. EverydayTools HEIC to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir HEIC en PNG ?",
          a: "PNG est sans perte et supporte la transparence — idéal pour le design, l'édition ou lorsque vous avez besoin d'une copie exacte de votre photo iPhone."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "PNG est sans perte, donc la sortie préserve la qualité complète de l'image. Les fichiers PNG seront plus grands que le HEIC source."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers HEIC en un seul téléversement."
        },
        {
          q: "Le convertisseur HEIC en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur HEIC en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "heic-to-webp",
    slugs: {
      en: "convert-heic-to-webp",
      fr: "convertir-heic-en-webp"
    },
    title: {
      en: "HEIC to WebP Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir HEIC en WebP — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "HEIC to WebP Converter",
      fr: "Convertisseur HEIC en WebP"
    },
    description: {
      en: "Convert HEIC images to WebP format in your browser. Free, no upload, no account required. Convert iPhone photos to WebP for web-optimized output — small file sizes with great quality, supported by all modern browsers.",
      fr: "Convertissez des images HEIC en WebP dans votre navigateur. Gratuit, sans envoi, sans compte. Convertissez des photos iPhone en WebP pour une sortie optimisée pour le web — petits fichiers avec excellente qualité."
    },
    keywords: {
      en: [
        "heic to webp converter",
        "convert heic to webp online free",
        "heic to webp free",
        "heic webp online",
        "free heic to webp converter",
        "heic to webp no upload"
      ],
      fr: [
        "convertir heic en webp",
        "heic en webp gratuit",
        "convertisseur heic webp en ligne",
        "heic vers webp sans logiciel",
        "heic webp en ligne gratuit",
        "convertir image heic en webp"
      ]
    },
    relatedTools: [
      "heic-to-jpg",
      "heic-to-png",
      "png-to-webp",
      "image-converter",
      "heic-to-pdf"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your HEIC file",
          text: "Click the upload area or drag your .heic file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your HEIC to WebP entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the WebP file",
          text: "Your WebP file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier HEIC",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .heic. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre HEIC en WebP entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier WebP",
          text: "Votre fichier WebP se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "HEIC is Apple's default iPhone photo format since iOS 11. HEIC offers around 50% smaller file sizes than JPEG at the same quality, but requires Apple devices or special software to open.",
      fr: "HEIC est le format photo iPhone par défaut depuis iOS 11. HEIC offre environ 50 % de fichiers plus petits que JPEG à la même qualité, mais nécessite des appareils Apple ou un logiciel spécial."
    },
    faqs: {
      en: [
        {
          q: "Why convert HEIC to WebP?",
          a: "Convert iPhone photos to WebP for web-optimized output — small file sizes with great quality, supported by all modern browsers."
        },
        {
          q: "Does HEIC to WebP conversion affect quality?",
          a: "WebP offers good compression with minimal visible quality loss. Files will be significantly smaller than the source HEIC at equivalent quality."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple HEIC files in a single upload."
        },
        {
          q: "Is HEIC to WebP Converter free?",
          a: "Yes. EverydayTools HEIC to WebP Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir HEIC en WebP ?",
          a: "Convertissez des photos iPhone en WebP pour une sortie optimisée pour le web — petits fichiers avec excellente qualité."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "WebP offre une bonne compression avec une perte de qualité visible minimale. Les fichiers seront nettement plus petits que le HEIC source."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers HEIC en un seul téléversement."
        },
        {
          q: "Le convertisseur HEIC en WebP est-il gratuit ?",
          a: "Oui. Le convertisseur HEIC en WebP d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "jpg-to-avif",
    slugs: {
      en: "convert-jpg-to-avif",
      fr: "convertir-jpg-en-avif"
    },
    title: {
      en: "JPG to AVIF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir JPG en AVIF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "JPG to AVIF Converter",
      fr: "Convertisseur JPG en AVIF"
    },
    description: {
      en: "Convert JPG images to AVIF format in your browser. Free, no upload, no account required. AVIF compresses JPEG images to roughly half the file size at the same visual quality — a significant improvement for web performance.",
      fr: "Convertissez des images JPG en AVIF dans votre navigateur. Gratuit, sans envoi, sans compte. AVIF compresse les images JPEG à environ la moitié de la taille avec la même qualité visuelle — une amélioration significative pour la performance web."
    },
    keywords: {
      en: [
        "jpg to avif converter",
        "convert jpg to avif online free",
        "jpg to avif free",
        "jpg avif online",
        "free jpg to avif converter",
        "jpg to avif no upload"
      ],
      fr: [
        "convertir jpg en avif",
        "jpg en avif gratuit",
        "convertisseur jpg avif en ligne",
        "jpg vers avif sans logiciel",
        "jpg avif en ligne gratuit",
        "convertir image jpg en avif"
      ]
    },
    relatedTools: [
      "jpg-to-webp",
      "png-to-avif",
      "image-converter",
      "image-compress",
      "jpg-to-png"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your JPG file",
          text: "Click the upload area or drag your .jpg / .jpeg file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your JPG to AVIF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the AVIF file",
          text: "Your AVIF file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier JPG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .jpg / .jpeg. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre JPG en AVIF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier AVIF",
          text: "Votre fichier AVIF se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "JPG is the most universally compatible image format, supported by every device, operating system, and application. JPEG uses lossy compression and is the standard for photos.",
      fr: "JPG est le format d'image le plus universellement compatible, supporté par tous les appareils, systèmes d'exploitation et applications. JPEG utilise une compression avec perte."
    },
    faqs: {
      en: [
        {
          q: "Why convert JPG to AVIF?",
          a: "AVIF compresses JPEG images to roughly half the file size at the same visual quality — a significant improvement for web performance."
        },
        {
          q: "Does JPG to AVIF conversion affect quality?",
          a: "AVIF is more efficient than JPEG. Expect 40–60% smaller files at equivalent or better visual quality."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple JPG files in a single upload."
        },
        {
          q: "Is JPG to AVIF Converter free?",
          a: "Yes. EverydayTools JPG to AVIF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir JPG en AVIF ?",
          a: "AVIF compresse les images JPEG à environ la moitié de la taille avec la même qualité visuelle — une amélioration significative pour la performance web."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "AVIF est plus efficace que JPEG. Attendez-vous à des fichiers 40 à 60 % plus petits à qualité visuelle équivalente ou meilleure."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers JPG en un seul téléversement."
        },
        {
          q: "Le convertisseur JPG en AVIF est-il gratuit ?",
          a: "Oui. Le convertisseur JPG en AVIF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "jpg-to-pdf",
    slugs: {
      en: "convert-jpg-to-pdf",
      fr: "convertir-jpg-en-pdf"
    },
    title: {
      en: "JPG to PDF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir JPG en PDF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "JPG to PDF Converter",
      fr: "Convertisseur JPG en PDF"
    },
    description: {
      en: "Convert JPG images to PDF format in your browser. Free, no upload, no account required. Wrap one or more JPEG photos in a PDF for easy sharing, printing, or document archiving.",
      fr: "Convertissez des images JPG en PDF dans votre navigateur. Gratuit, sans envoi, sans compte. Regroupez une ou plusieurs photos JPEG dans un PDF pour un partage, une impression ou un archivage de documents facile."
    },
    keywords: {
      en: [
        "jpg to pdf converter",
        "convert jpg to pdf online free",
        "jpg to pdf free",
        "jpg pdf online",
        "free jpg to pdf converter",
        "jpg to pdf no upload"
      ],
      fr: [
        "convertir jpg en pdf",
        "jpg en pdf gratuit",
        "convertisseur jpg pdf en ligne",
        "jpg vers pdf sans logiciel",
        "jpg pdf en ligne gratuit",
        "convertir image jpg en pdf"
      ]
    },
    relatedTools: [
      "image-to-pdf",
      "pdf-to-image",
      "image-converter",
      "image-compress",
      "jpg-to-png"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your JPG file",
          text: "Click the upload area or drag your .jpg / .jpeg file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your JPG to PDF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PDF file",
          text: "Your PDF with all images as pages downloads immediately."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier JPG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .jpg / .jpeg. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre JPG en PDF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PDF",
          text: "Votre PDF avec toutes les images en pages se télécharge immédiatement."
        }
      ]
    },
    about: {
      en: "JPG is the most universally compatible image format, supported by every device, operating system, and application. JPEG uses lossy compression and is the standard for photos.",
      fr: "JPG est le format d'image le plus universellement compatible, supporté par tous les appareils, systèmes d'exploitation et applications. JPEG utilise une compression avec perte."
    },
    faqs: {
      en: [
        {
          q: "Why convert JPG to PDF?",
          a: "Wrap one or more JPEG photos in a PDF for easy sharing, printing, or document archiving."
        },
        {
          q: "Does JPG to PDF conversion affect quality?",
          a: "Images are embedded in the PDF at full original resolution. No quality loss is applied during conversion."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple JPG files in a single upload."
        },
        {
          q: "Is JPG to PDF Converter free?",
          a: "Yes. EverydayTools JPG to PDF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir JPG en PDF ?",
          a: "Regroupez une ou plusieurs photos JPEG dans un PDF pour un partage, une impression ou un archivage de documents facile."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "Les images sont intégrées dans le PDF à leur résolution originale complète. Aucune perte de qualité n'est appliquée."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers JPG en un seul téléversement."
        },
        {
          q: "Le convertisseur JPG en PDF est-il gratuit ?",
          a: "Oui. Le convertisseur JPG en PDF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "jpg-to-webp",
    slugs: {
      en: "convert-jpg-to-webp",
      fr: "convertir-jpg-en-webp"
    },
    title: {
      en: "JPG to WebP Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir JPG en WebP — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "JPG to WebP Converter",
      fr: "Convertisseur JPG en WebP"
    },
    description: {
      en: "Convert JPG images to WebP format in your browser. Free, no upload, no account required. WebP produces files 25–35% smaller than JPEG at the same visual quality — a direct improvement for web performance with no perceptible difference.",
      fr: "Convertissez des images JPG en WebP dans votre navigateur. Gratuit, sans envoi, sans compte. WebP produit des fichiers 25 à 35 % plus petits que JPEG à la même qualité visuelle — une amélioration directe pour la performance web."
    },
    keywords: {
      en: [
        "jpg to webp converter",
        "convert jpg to webp online free",
        "jpg to webp free",
        "jpg webp online",
        "free jpg to webp converter",
        "jpg to webp no upload"
      ],
      fr: [
        "convertir jpg en webp",
        "jpg en webp gratuit",
        "convertisseur jpg webp en ligne",
        "jpg vers webp sans logiciel",
        "jpg webp en ligne gratuit",
        "convertir image jpg en webp"
      ]
    },
    relatedTools: [
      "jpg-to-png",
      "png-to-webp",
      "image-converter",
      "image-compress",
      "background-remover"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your JPG file",
          text: "Click the upload area or drag your .jpg / .jpeg file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your JPG to WebP entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the WebP file",
          text: "Your WebP file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier JPG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .jpg / .jpeg. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre JPG en WebP entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier WebP",
          text: "Votre fichier WebP se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "JPG is the most universally compatible image format, supported by every device, operating system, and application. JPEG uses lossy compression and is the standard for photos.",
      fr: "JPG est le format d'image le plus universellement compatible, supporté par tous les appareils, systèmes d'exploitation et applications. JPEG utilise une compression avec perte."
    },
    faqs: {
      en: [
        {
          q: "Why convert JPG to WebP?",
          a: "WebP produces files 25–35% smaller than JPEG at the same visual quality — a direct improvement for web performance with no perceptible difference."
        },
        {
          q: "Does JPG to WebP conversion affect quality?",
          a: "WebP is lossy by default and matches JPEG quality closely. Expect 25–35% smaller files at equivalent visual quality."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple JPG files in a single upload."
        },
        {
          q: "Is JPG to WebP Converter free?",
          a: "Yes. EverydayTools JPG to WebP Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir JPG en WebP ?",
          a: "WebP produit des fichiers 25 à 35 % plus petits que JPEG à la même qualité visuelle — une amélioration directe pour la performance web."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "WebP est avec perte par défaut et correspond étroitement à la qualité JPEG. Attendez-vous à des fichiers 25 à 35 % plus petits."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers JPG en un seul téléversement."
        },
        {
          q: "Le convertisseur JPG en WebP est-il gratuit ?",
          a: "Oui. Le convertisseur JPG en WebP d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "png-to-avif",
    slugs: {
      en: "convert-png-to-avif",
      fr: "convertir-png-en-avif"
    },
    title: {
      en: "PNG to AVIF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir PNG en AVIF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "PNG to AVIF Converter",
      fr: "Convertisseur PNG en AVIF"
    },
    description: {
      en: "Convert PNG images to AVIF format in your browser. Free, no upload, no account required. PNG files are large due to lossless storage. AVIF can compress the same image to a fraction of the size — typically 60–80% smaller — while preserving strong visual quality.",
      fr: "Convertissez des images PNG en AVIF dans votre navigateur. Gratuit, sans envoi, sans compte. Les fichiers PNG sont grands en raison du stockage sans perte. AVIF peut comprimer la même image à une fraction de la taille — 60 à 80 % plus petite — tout en préservant une forte qualité."
    },
    keywords: {
      en: [
        "png to avif converter",
        "convert png to avif online free",
        "png to avif free",
        "png avif online",
        "free png to avif converter",
        "png to avif no upload"
      ],
      fr: [
        "convertir png en avif",
        "png en avif gratuit",
        "convertisseur png avif en ligne",
        "png vers avif sans logiciel",
        "png avif en ligne gratuit",
        "convertir image png en avif"
      ]
    },
    relatedTools: [
      "png-to-webp",
      "jpg-to-avif",
      "image-converter",
      "image-compress",
      "png-to-jpg"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your PNG file",
          text: "Click the upload area or drag your .png file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your PNG to AVIF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the AVIF file",
          text: "Your AVIF file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier PNG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .png. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre PNG en AVIF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier AVIF",
          text: "Votre fichier AVIF se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "PNG is a lossless format that preserves every pixel exactly, with full transparency support. PNG is ideal for graphics, logos, and screenshots.",
      fr: "PNG est un format sans perte qui préserve chaque pixel exactement, avec un support complet de la transparence. PNG est idéal pour les graphismes, logos et captures d'écran."
    },
    faqs: {
      en: [
        {
          q: "Why convert PNG to AVIF?",
          a: "PNG files are large due to lossless storage. AVIF can compress the same image to a fraction of the size — typically 60–80% smaller — while preserving strong visual quality."
        },
        {
          q: "Does PNG to AVIF conversion affect quality?",
          a: "AVIF uses lossy compression, so some data is discarded. For most images, the quality difference at standard settings is not visible."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple PNG files in a single upload."
        },
        {
          q: "Is PNG to AVIF Converter free?",
          a: "Yes. EverydayTools PNG to AVIF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir PNG en AVIF ?",
          a: "Les fichiers PNG sont grands en raison du stockage sans perte. AVIF peut comprimer la même image à une fraction de la taille — 60 à 80 % plus petite — tout en préservant une forte qualité."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "AVIF utilise une compression avec perte, donc certaines données sont supprimées. Pour la plupart des images, la différence de qualité n'est pas visible."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers PNG en un seul téléversement."
        },
        {
          q: "Le convertisseur PNG en AVIF est-il gratuit ?",
          a: "Oui. Le convertisseur PNG en AVIF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "png-to-jpg",
    slugs: {
      en: "convert-png-to-jpg",
      fr: "convertir-png-en-jpg"
    },
    title: {
      en: "PNG to JPG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir PNG en JPG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "PNG to JPG Converter",
      fr: "Convertisseur PNG en JPG"
    },
    description: {
      en: "Convert PNG images to JPG format in your browser. Free, no upload, no account required. PNG is a lossless format ideal for graphics, but PNG files are much larger than JPEG for the same photo. Convert to JPEG to reduce file size significantly.",
      fr: "Convertissez des images PNG en JPG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG est sans perte, idéal pour les graphismes, mais les fichiers PNG sont bien plus grands que JPEG pour la même photo. Convertissez en JPEG pour réduire significativement la taille."
    },
    keywords: {
      en: [
        "png to jpg converter",
        "convert png to jpg online free",
        "png to jpg free",
        "png jpg online",
        "free png to jpg converter",
        "png to jpg no upload"
      ],
      fr: [
        "convertir png en jpg",
        "png en jpg gratuit",
        "convertisseur png jpg en ligne",
        "png vers jpg sans logiciel",
        "png jpg en ligne gratuit",
        "convertir image png en jpg"
      ]
    },
    relatedTools: [
      "jpg-to-png",
      "png-to-webp",
      "image-converter",
      "image-compress",
      "background-remover"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your PNG file",
          text: "Click the upload area or drag your .png file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your PNG to JPG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the JPG file",
          text: "Your JPG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier PNG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .png. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre PNG en JPG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier JPG",
          text: "Votre fichier JPG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "PNG is a lossless format that preserves every pixel exactly, with full transparency support. PNG is ideal for graphics, logos, and screenshots.",
      fr: "PNG est un format sans perte qui préserve chaque pixel exactement, avec un support complet de la transparence. PNG est idéal pour les graphismes, logos et captures d'écran."
    },
    faqs: {
      en: [
        {
          q: "Why convert PNG to JPG?",
          a: "PNG is a lossless format ideal for graphics, but PNG files are much larger than JPEG for the same photo. Convert to JPEG to reduce file size significantly."
        },
        {
          q: "Does PNG to JPG conversion affect quality?",
          a: "JPEG is lossy — some quality is lost. The tool uses high-quality JPEG encoding so the difference is minimal. Transparent PNG areas are filled with white."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple PNG files in a single upload."
        },
        {
          q: "Is PNG to JPG Converter free?",
          a: "Yes. EverydayTools PNG to JPG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir PNG en JPG ?",
          a: "PNG est sans perte, idéal pour les graphismes, mais les fichiers PNG sont bien plus grands que JPEG pour la même photo. Convertissez en JPEG pour réduire significativement la taille."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "JPEG est avec perte — une certaine qualité est perdue. L'outil utilise un encodage JPEG haute qualité. Les zones transparentes PNG sont remplies de blanc."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers PNG en un seul téléversement."
        },
        {
          q: "Le convertisseur PNG en JPG est-il gratuit ?",
          a: "Oui. Le convertisseur PNG en JPG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "png-to-pdf",
    slugs: {
      en: "convert-png-to-pdf",
      fr: "convertir-png-en-pdf"
    },
    title: {
      en: "PNG to PDF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir PNG en PDF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "PNG to PDF Converter",
      fr: "Convertisseur PNG en PDF"
    },
    description: {
      en: "Convert PNG images to PDF format in your browser. Free, no upload, no account required. Wrap one or more PNG images in a PDF for easy sharing, printing, or embedding in documents.",
      fr: "Convertissez des images PNG en PDF dans votre navigateur. Gratuit, sans envoi, sans compte. Regroupez une ou plusieurs images PNG dans un PDF pour un partage, une impression ou une intégration dans des documents facile."
    },
    keywords: {
      en: [
        "png to pdf converter",
        "convert png to pdf online free",
        "png to pdf free",
        "png pdf online",
        "free png to pdf converter",
        "png to pdf no upload"
      ],
      fr: [
        "convertir png en pdf",
        "png en pdf gratuit",
        "convertisseur png pdf en ligne",
        "png vers pdf sans logiciel",
        "png pdf en ligne gratuit",
        "convertir image png en pdf"
      ]
    },
    relatedTools: [
      "image-to-pdf",
      "pdf-to-image",
      "png-to-webp",
      "image-compress",
      "jpg-to-pdf"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your PNG file",
          text: "Click the upload area or drag your .png file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your PNG to PDF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PDF file",
          text: "Your PDF with all images as pages downloads immediately."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier PNG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .png. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre PNG en PDF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PDF",
          text: "Votre PDF avec toutes les images en pages se télécharge immédiatement."
        }
      ]
    },
    about: {
      en: "PNG is a lossless format that preserves every pixel exactly, with full transparency support. PNG is ideal for graphics, logos, and screenshots.",
      fr: "PNG est un format sans perte qui préserve chaque pixel exactement, avec un support complet de la transparence. PNG est idéal pour les graphismes, logos et captures d'écran."
    },
    faqs: {
      en: [
        {
          q: "Why convert PNG to PDF?",
          a: "Wrap one or more PNG images in a PDF for easy sharing, printing, or embedding in documents."
        },
        {
          q: "Does PNG to PDF conversion affect quality?",
          a: "Images are embedded in the PDF at full original resolution with no quality loss."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple PNG files in a single upload."
        },
        {
          q: "Is PNG to PDF Converter free?",
          a: "Yes. EverydayTools PNG to PDF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir PNG en PDF ?",
          a: "Regroupez une ou plusieurs images PNG dans un PDF pour un partage, une impression ou une intégration dans des documents facile."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "Les images sont intégrées dans le PDF à leur résolution originale complète sans perte de qualité."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers PNG en un seul téléversement."
        },
        {
          q: "Le convertisseur PNG en PDF est-il gratuit ?",
          a: "Oui. Le convertisseur PNG en PDF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "png-to-svg",
    slugs: {
      en: "convert-png-to-svg",
      fr: "convertir-png-en-svg"
    },
    title: {
      en: "PNG to SVG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir PNG en SVG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "PNG to SVG Converter",
      fr: "Convertisseur PNG en SVG"
    },
    description: {
      en: "Convert PNG images to SVG format in your browser. Free, no upload, no account required. Convert a PNG image to an SVG vector graphic so it can scale to any size without becoming pixelated — ideal for logos and simple graphics.",
      fr: "Convertissez des images PNG en SVG dans votre navigateur. Gratuit, sans envoi, sans compte. Convertissez une image PNG en graphique vectoriel SVG pour qu'il s'adapte à n'importe quelle taille sans pixellisation — idéal pour les logos et graphismes simples."
    },
    keywords: {
      en: [
        "png to svg converter",
        "convert png to svg online free",
        "png to svg free",
        "png svg online",
        "free png to svg converter",
        "png to svg no upload"
      ],
      fr: [
        "convertir png en svg",
        "png en svg gratuit",
        "convertisseur png svg en ligne",
        "png vers svg sans logiciel",
        "png svg en ligne gratuit",
        "convertir image png en svg"
      ]
    },
    relatedTools: [
      "svg-to-png",
      "png-to-webp",
      "background-remover",
      "image-converter",
      "favicon-generator"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your PNG file",
          text: "Click the upload area or drag your .png file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your PNG to SVG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the SVG file",
          text: "Your SVG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier PNG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .png. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre PNG en SVG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier SVG",
          text: "Votre fichier SVG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "PNG is a lossless format that preserves every pixel exactly, with full transparency support. PNG is ideal for graphics, logos, and screenshots.",
      fr: "PNG est un format sans perte qui préserve chaque pixel exactement, avec un support complet de la transparence. PNG est idéal pour les graphismes, logos et captures d'écran."
    },
    faqs: {
      en: [
        {
          q: "Why convert PNG to SVG?",
          a: "Convert a PNG image to an SVG vector graphic so it can scale to any size without becoming pixelated — ideal for logos and simple graphics."
        },
        {
          q: "Does PNG to SVG conversion affect quality?",
          a: "PNG to SVG conversion works best on simple, flat-color images like logos, icons, and diagrams. Complex photos do not trace well to SVG — they produce very large files with poor results."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple PNG files in a single upload."
        },
        {
          q: "Is PNG to SVG Converter free?",
          a: "Yes. EverydayTools PNG to SVG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir PNG en SVG ?",
          a: "Convertissez une image PNG en graphique vectoriel SVG pour qu'il s'adapte à n'importe quelle taille sans pixellisation — idéal pour les logos et graphismes simples."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "La conversion PNG vers SVG fonctionne mieux sur les images simples à couleurs plates comme les logos et icônes. Les photos complexes ne se convertissent pas bien en SVG."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers PNG en un seul téléversement."
        },
        {
          q: "Le convertisseur PNG en SVG est-il gratuit ?",
          a: "Oui. Le convertisseur PNG en SVG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "svg-to-png",
    slugs: {
      en: "convert-svg-to-png",
      fr: "convertir-svg-en-png"
    },
    title: {
      en: "SVG to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir SVG en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "SVG to PNG Converter",
      fr: "Convertisseur SVG en PNG"
    },
    description: {
      en: "Convert SVG images to PNG format in your browser. Free, no upload, no account required. SVG is not supported by all apps and platforms. Convert to PNG to get a raster image at a fixed resolution that opens anywhere.",
      fr: "Convertissez des images SVG en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. SVG n'est pas supporté par toutes les applications. Convertissez en PNG pour obtenir une image raster à résolution fixe qui s'ouvre partout."
    },
    keywords: {
      en: [
        "svg to png converter",
        "convert svg to png online free",
        "svg to png free",
        "svg png online",
        "free svg to png converter",
        "svg to png no upload"
      ],
      fr: [
        "convertir svg en png",
        "svg en png gratuit",
        "convertisseur svg png en ligne",
        "svg vers png sans logiciel",
        "svg png en ligne gratuit",
        "convertir image svg en png"
      ]
    },
    relatedTools: [
      "png-to-svg",
      "image-resize",
      "png-to-webp",
      "image-converter",
      "favicon-generator"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your SVG file",
          text: "Click the upload area or drag your .svg file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your SVG to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier SVG",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .svg. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre SVG en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "SVG is a vector format defined in XML that scales to any size without losing quality. SVG is the standard for logos, icons, and illustrations on the web.",
      fr: "SVG est un format vectoriel défini en XML qui s'adapte à n'importe quelle taille sans perte de qualité. SVG est le standard pour les logos, icônes et illustrations."
    },
    faqs: {
      en: [
        {
          q: "Why convert SVG to PNG?",
          a: "SVG is not supported by all apps and platforms. Convert to PNG to get a raster image at a fixed resolution that opens anywhere."
        },
        {
          q: "Does SVG to PNG conversion affect quality?",
          a: "PNG is lossless. The output quality depends on the rendering resolution you choose — higher resolution gives sharper results."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple SVG files in a single upload."
        },
        {
          q: "Is SVG to PNG Converter free?",
          a: "Yes. EverydayTools SVG to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir SVG en PNG ?",
          a: "SVG n'est pas supporté par toutes les applications. Convertissez en PNG pour obtenir une image raster à résolution fixe qui s'ouvre partout."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "PNG est sans perte. La qualité de sortie dépend de la résolution de rendu choisie — une résolution plus élevée donne des résultats plus nets."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers SVG en un seul téléversement."
        },
        {
          q: "Le convertisseur SVG en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur SVG en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "tiff-to-jpg",
    slugs: {
      en: "convert-tiff-to-jpg",
      fr: "convertir-tiff-en-jpg"
    },
    title: {
      en: "TIFF to JPG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir TIFF en JPG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "TIFF to JPG Converter",
      fr: "Convertisseur TIFF en JPG"
    },
    description: {
      en: "Convert TIFF images to JPG format in your browser. Free, no upload, no account required. TIFF files are enormous — a single image can be hundreds of megabytes. Converting to JPEG reduces file sizes by 95%+ for sharing and web use.",
      fr: "Convertissez des images TIFF en JPG dans votre navigateur. Gratuit, sans envoi, sans compte. Les fichiers TIFF sont énormes — une seule image peut peser des centaines de mégaoctets. La conversion en JPEG réduit la taille de 95 %+ pour le partage."
    },
    keywords: {
      en: [
        "tiff to jpg converter",
        "convert tiff to jpg online free",
        "tiff to jpg free",
        "tiff jpg online",
        "free tiff to jpg converter",
        "tiff to jpg no upload"
      ],
      fr: [
        "convertir tiff en jpg",
        "tiff en jpg gratuit",
        "convertisseur tiff jpg en ligne",
        "tiff vers jpg sans logiciel",
        "tiff jpg en ligne gratuit",
        "convertir image tiff en jpg"
      ]
    },
    relatedTools: [
      "tiff-to-png",
      "tiff-to-webp",
      "image-converter",
      "image-compress",
      "jpg-to-png"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your TIFF file",
          text: "Click the upload area or drag your .tiff file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your TIFF to JPG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the JPG file",
          text: "Your JPG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier TIFF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .tiff. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre TIFF en JPG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier JPG",
          text: "Votre fichier JPG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "TIFF is a professional lossless format used in printing, scanning, and archiving. TIFF files preserve every detail at full quality but can be hundreds of megabytes each.",
      fr: "TIFF est un format professionnel sans perte utilisé en impression, numérisation et archivage. Les fichiers TIFF préservent chaque détail mais peuvent peser des centaines de mégaoctets."
    },
    faqs: {
      en: [
        {
          q: "Why convert TIFF to JPG?",
          a: "TIFF files are enormous — a single image can be hundreds of megabytes. Converting to JPEG reduces file sizes by 95%+ for sharing and web use."
        },
        {
          q: "Does TIFF to JPG conversion affect quality?",
          a: "JPEG is lossy. Converting from lossless TIFF to JPEG introduces compression artifacts, but at high quality settings these are barely perceptible."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple TIFF files in a single upload."
        },
        {
          q: "Is TIFF to JPG Converter free?",
          a: "Yes. EverydayTools TIFF to JPG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir TIFF en JPG ?",
          a: "Les fichiers TIFF sont énormes — une seule image peut peser des centaines de mégaoctets. La conversion en JPEG réduit la taille de 95 %+ pour le partage."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "JPEG est avec perte. La conversion de TIFF sans perte en JPEG introduit des artefacts de compression, mais à haute qualité ces artefacts sont à peine perceptibles."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers TIFF en un seul téléversement."
        },
        {
          q: "Le convertisseur TIFF en JPG est-il gratuit ?",
          a: "Oui. Le convertisseur TIFF en JPG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "tiff-to-png",
    slugs: {
      en: "convert-tiff-to-png",
      fr: "convertir-tiff-en-png"
    },
    title: {
      en: "TIFF to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir TIFF en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "TIFF to PNG Converter",
      fr: "Convertisseur TIFF en PNG"
    },
    description: {
      en: "Convert TIFF images to PNG format in your browser. Free, no upload, no account required. PNG preserves lossless quality like TIFF but at a much more manageable file size — typically 30–60% smaller — while retaining transparency support.",
      fr: "Convertissez des images TIFF en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG préserve la qualité sans perte comme TIFF mais avec une taille de fichier bien plus gérable — 30 à 60 % plus petite — tout en conservant la transparence."
    },
    keywords: {
      en: [
        "tiff to png converter",
        "convert tiff to png online free",
        "tiff to png free",
        "tiff png online",
        "free tiff to png converter",
        "tiff to png no upload"
      ],
      fr: [
        "convertir tiff en png",
        "tiff en png gratuit",
        "convertisseur tiff png en ligne",
        "tiff vers png sans logiciel",
        "tiff png en ligne gratuit",
        "convertir image tiff en png"
      ]
    },
    relatedTools: [
      "tiff-to-jpg",
      "tiff-to-webp",
      "image-converter",
      "background-remover",
      "png-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your TIFF file",
          text: "Click the upload area or drag your .tiff file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your TIFF to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier TIFF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .tiff. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre TIFF en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "TIFF is a professional lossless format used in printing, scanning, and archiving. TIFF files preserve every detail at full quality but can be hundreds of megabytes each.",
      fr: "TIFF est un format professionnel sans perte utilisé en impression, numérisation et archivage. Les fichiers TIFF préservent chaque détail mais peuvent peser des centaines de mégaoctets."
    },
    faqs: {
      en: [
        {
          q: "Why convert TIFF to PNG?",
          a: "PNG preserves lossless quality like TIFF but at a much more manageable file size — typically 30–60% smaller — while retaining transparency support."
        },
        {
          q: "Does TIFF to PNG conversion affect quality?",
          a: "PNG is lossless. No quality is lost in the conversion — the output is a perfect pixel-for-pixel reproduction of the source TIFF."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple TIFF files in a single upload."
        },
        {
          q: "Is TIFF to PNG Converter free?",
          a: "Yes. EverydayTools TIFF to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir TIFF en PNG ?",
          a: "PNG préserve la qualité sans perte comme TIFF mais avec une taille de fichier bien plus gérable — 30 à 60 % plus petite — tout en conservant la transparence."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "PNG est sans perte. Aucune qualité n'est perdue dans la conversion — la sortie est une reproduction parfaite pixel par pixel du TIFF source."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers TIFF en un seul téléversement."
        },
        {
          q: "Le convertisseur TIFF en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur TIFF en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "tiff-to-webp",
    slugs: {
      en: "convert-tiff-to-webp",
      fr: "convertir-tiff-en-webp"
    },
    title: {
      en: "TIFF to WebP Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir TIFF en WebP — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "TIFF to WebP Converter",
      fr: "Convertisseur TIFF en WebP"
    },
    description: {
      en: "Convert TIFF images to WebP format in your browser. Free, no upload, no account required. Convert massive TIFF archival files to WebP for web use — typically 90%+ size reduction with excellent visual quality.",
      fr: "Convertissez des images TIFF en WebP dans votre navigateur. Gratuit, sans envoi, sans compte. Convertissez des fichiers TIFF d'archivage massifs en WebP pour le web — réduction de taille de 90 %+ avec une excellente qualité visuelle."
    },
    keywords: {
      en: [
        "tiff to webp converter",
        "convert tiff to webp online free",
        "tiff to webp free",
        "tiff webp online",
        "free tiff to webp converter",
        "tiff to webp no upload"
      ],
      fr: [
        "convertir tiff en webp",
        "tiff en webp gratuit",
        "convertisseur tiff webp en ligne",
        "tiff vers webp sans logiciel",
        "tiff webp en ligne gratuit",
        "convertir image tiff en webp"
      ]
    },
    relatedTools: [
      "tiff-to-jpg",
      "tiff-to-png",
      "image-converter",
      "image-compress",
      "png-to-webp"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your TIFF file",
          text: "Click the upload area or drag your .tiff file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your TIFF to WebP entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the WebP file",
          text: "Your WebP file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier TIFF",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .tiff. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre TIFF en WebP entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier WebP",
          text: "Votre fichier WebP se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "TIFF is a professional lossless format used in printing, scanning, and archiving. TIFF files preserve every detail at full quality but can be hundreds of megabytes each.",
      fr: "TIFF est un format professionnel sans perte utilisé en impression, numérisation et archivage. Les fichiers TIFF préservent chaque détail mais peuvent peser des centaines de mégaoctets."
    },
    faqs: {
      en: [
        {
          q: "Why convert TIFF to WebP?",
          a: "Convert massive TIFF archival files to WebP for web use — typically 90%+ size reduction with excellent visual quality."
        },
        {
          q: "Does TIFF to WebP conversion affect quality?",
          a: "WebP uses lossy compression. Converting from lossless TIFF to WebP introduces compression, but at standard settings results are visually near-indistinguishable from the original."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple TIFF files in a single upload."
        },
        {
          q: "Is TIFF to WebP Converter free?",
          a: "Yes. EverydayTools TIFF to WebP Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir TIFF en WebP ?",
          a: "Convertissez des fichiers TIFF d'archivage massifs en WebP pour le web — réduction de taille de 90 %+ avec une excellente qualité visuelle."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "WebP utilise une compression avec perte. La conversion de TIFF sans perte vers WebP introduit une compression, mais à des paramètres standards les résultats sont visuellement presque indistinguables."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers TIFF en un seul téléversement."
        },
        {
          q: "Le convertisseur TIFF en WebP est-il gratuit ?",
          a: "Oui. Le convertisseur TIFF en WebP d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "webp-to-avif",
    slugs: {
      en: "convert-webp-to-avif",
      fr: "convertir-webp-en-avif"
    },
    title: {
      en: "WebP to AVIF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir WebP en AVIF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "WebP to AVIF Converter",
      fr: "Convertisseur WebP en AVIF"
    },
    description: {
      en: "Convert WebP images to AVIF format in your browser. Free, no upload, no account required. AVIF offers even better compression than WebP — typically 20–30% smaller at the same visual quality — and is increasingly supported by browsers.",
      fr: "Convertissez des images WebP en AVIF dans votre navigateur. Gratuit, sans envoi, sans compte. AVIF offre une compression encore meilleure que WebP — 20 à 30 % plus petite à la même qualité — et est de plus en plus supporté par les navigateurs."
    },
    keywords: {
      en: [
        "webp to avif converter",
        "convert webp to avif online free",
        "webp to avif free",
        "webp avif online",
        "free webp to avif converter",
        "webp to avif no upload"
      ],
      fr: [
        "convertir webp en avif",
        "webp en avif gratuit",
        "convertisseur webp avif en ligne",
        "webp vers avif sans logiciel",
        "webp avif en ligne gratuit",
        "convertir image webp en avif"
      ]
    },
    relatedTools: [
      "webp-to-png",
      "png-to-avif",
      "image-converter",
      "image-compress",
      "webp-to-jpg"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your WebP file",
          text: "Click the upload area or drag your .webp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your WebP to AVIF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the AVIF file",
          text: "Your AVIF file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier WebP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .webp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre WebP en AVIF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier AVIF",
          text: "Votre fichier AVIF se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "WebP is Google's modern web image format, offering 25–35% smaller file sizes than JPEG at the same visual quality. WebP supports both transparency and animation.",
      fr: "WebP est le format d'image web moderne de Google, offrant des fichiers 25 à 35 % plus petits que JPEG à la même qualité. WebP supporte la transparence et l'animation."
    },
    faqs: {
      en: [
        {
          q: "Why convert WebP to AVIF?",
          a: "AVIF offers even better compression than WebP — typically 20–30% smaller at the same visual quality — and is increasingly supported by browsers."
        },
        {
          q: "Does WebP to AVIF conversion affect quality?",
          a: "AVIF is lossy. Files will be 20–30% smaller than WebP at equivalent visual quality."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple WebP files in a single upload."
        },
        {
          q: "Is WebP to AVIF Converter free?",
          a: "Yes. EverydayTools WebP to AVIF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir WebP en AVIF ?",
          a: "AVIF offre une compression encore meilleure que WebP — 20 à 30 % plus petite à la même qualité — et est de plus en plus supporté par les navigateurs."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "AVIF est avec perte. Les fichiers seront 20 à 30 % plus petits que WebP à qualité visuelle équivalente."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers WebP en un seul téléversement."
        },
        {
          q: "Le convertisseur WebP en AVIF est-il gratuit ?",
          a: "Oui. Le convertisseur WebP en AVIF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "webp-to-jpg",
    slugs: {
      en: "convert-webp-to-jpg",
      fr: "convertir-webp-en-jpg"
    },
    title: {
      en: "WebP to JPG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir WebP en JPG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "WebP to JPG Converter",
      fr: "Convertisseur WebP en JPG"
    },
    description: {
      en: "Convert WebP images to JPG format in your browser. Free, no upload, no account required. JPEG has universal compatibility across all devices, operating systems, and apps. WebP may not open in older software.",
      fr: "Convertissez des images WebP en JPG dans votre navigateur. Gratuit, sans envoi, sans compte. JPEG est universellement compatible sur tous les appareils, systèmes d'exploitation et applications. WebP peut ne pas s'ouvrir dans les anciens logiciels."
    },
    keywords: {
      en: [
        "webp to jpg converter",
        "convert webp to jpg online free",
        "webp to jpg free",
        "webp jpg online",
        "free webp to jpg converter",
        "webp to jpg no upload"
      ],
      fr: [
        "convertir webp en jpg",
        "webp en jpg gratuit",
        "convertisseur webp jpg en ligne",
        "webp vers jpg sans logiciel",
        "webp jpg en ligne gratuit",
        "convertir image webp en jpg"
      ]
    },
    relatedTools: [
      "webp-to-png",
      "jpg-to-webp",
      "image-converter",
      "image-compress",
      "background-remover"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your WebP file",
          text: "Click the upload area or drag your .webp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your WebP to JPG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the JPG file",
          text: "Your JPG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier WebP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .webp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre WebP en JPG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier JPG",
          text: "Votre fichier JPG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "WebP is Google's modern web image format, offering 25–35% smaller file sizes than JPEG at the same visual quality. WebP supports both transparency and animation.",
      fr: "WebP est le format d'image web moderne de Google, offrant des fichiers 25 à 35 % plus petits que JPEG à la même qualité. WebP supporte la transparence et l'animation."
    },
    faqs: {
      en: [
        {
          q: "Why convert WebP to JPG?",
          a: "JPEG has universal compatibility across all devices, operating systems, and apps. WebP may not open in older software."
        },
        {
          q: "Does WebP to JPG conversion affect quality?",
          a: "JPEG is lossy. Converting WebP to JPEG may introduce slight quality reduction at standard settings."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple WebP files in a single upload."
        },
        {
          q: "Is WebP to JPG Converter free?",
          a: "Yes. EverydayTools WebP to JPG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir WebP en JPG ?",
          a: "JPEG est universellement compatible sur tous les appareils, systèmes d'exploitation et applications. WebP peut ne pas s'ouvrir dans les anciens logiciels."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "JPEG est avec perte. La conversion de WebP en JPEG peut introduire une légère réduction de qualité à des paramètres standards."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers WebP en un seul téléversement."
        },
        {
          q: "Le convertisseur WebP en JPG est-il gratuit ?",
          a: "Oui. Le convertisseur WebP en JPG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "webp-to-pdf",
    slugs: {
      en: "convert-webp-to-pdf",
      fr: "convertir-webp-en-pdf"
    },
    title: {
      en: "WebP to PDF Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir WebP en PDF — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "WebP to PDF Converter",
      fr: "Convertisseur WebP en PDF"
    },
    description: {
      en: "Convert WebP images to PDF format in your browser. Free, no upload, no account required. Wrap one or more WebP images in a PDF for easy sharing, printing, or document archiving.",
      fr: "Convertissez des images WebP en PDF dans votre navigateur. Gratuit, sans envoi, sans compte. Regroupez une ou plusieurs images WebP dans un PDF pour un partage, une impression ou un archivage de documents facile."
    },
    keywords: {
      en: [
        "webp to pdf converter",
        "convert webp to pdf online free",
        "webp to pdf free",
        "webp pdf online",
        "free webp to pdf converter",
        "webp to pdf no upload"
      ],
      fr: [
        "convertir webp en pdf",
        "webp en pdf gratuit",
        "convertisseur webp pdf en ligne",
        "webp vers pdf sans logiciel",
        "webp pdf en ligne gratuit",
        "convertir image webp en pdf"
      ]
    },
    relatedTools: [
      "image-to-pdf",
      "pdf-to-image",
      "webp-to-jpg",
      "image-converter",
      "webp-to-png"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your WebP file",
          text: "Click the upload area or drag your .webp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your WebP to PDF entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PDF file",
          text: "Your PDF with all images as pages downloads immediately."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier WebP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .webp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre WebP en PDF entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PDF",
          text: "Votre PDF avec toutes les images en pages se télécharge immédiatement."
        }
      ]
    },
    about: {
      en: "WebP is Google's modern web image format, offering 25–35% smaller file sizes than JPEG at the same visual quality. WebP supports both transparency and animation.",
      fr: "WebP est le format d'image web moderne de Google, offrant des fichiers 25 à 35 % plus petits que JPEG à la même qualité. WebP supporte la transparence et l'animation."
    },
    faqs: {
      en: [
        {
          q: "Why convert WebP to PDF?",
          a: "Wrap one or more WebP images in a PDF for easy sharing, printing, or document archiving."
        },
        {
          q: "Does WebP to PDF conversion affect quality?",
          a: "Images are embedded in the PDF at full original resolution. No quality loss is applied during conversion."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple WebP files in a single upload."
        },
        {
          q: "Is WebP to PDF Converter free?",
          a: "Yes. EverydayTools WebP to PDF Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir WebP en PDF ?",
          a: "Regroupez une ou plusieurs images WebP dans un PDF pour un partage, une impression ou un archivage de documents facile."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "Les images sont intégrées dans le PDF à leur résolution originale complète. Aucune perte de qualité n'est appliquée."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers WebP en un seul téléversement."
        },
        {
          q: "Le convertisseur WebP en PDF est-il gratuit ?",
          a: "Oui. Le convertisseur WebP en PDF d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "webp-to-png",
    slugs: {
      en: "convert-webp-to-png",
      fr: "convertir-webp-en-png"
    },
    title: {
      en: "WebP to PNG Converter — Free, Online | EverydayTools Hub",
      fr: "Convertir WebP en PNG — Gratuit, En Ligne | EverydayTools Hub"
    },
    h1: {
      en: "WebP to PNG Converter",
      fr: "Convertisseur WebP en PNG"
    },
    description: {
      en: "Convert WebP images to PNG format in your browser. Free, no upload, no account required. PNG is lossless and has near-universal compatibility for design work and apps that don't support WebP.",
      fr: "Convertissez des images WebP en PNG dans votre navigateur. Gratuit, sans envoi, sans compte. PNG est sans perte et a une compatibilité quasi universelle pour le travail de design et les applications ne supportant pas WebP."
    },
    keywords: {
      en: [
        "webp to png converter",
        "convert webp to png online free",
        "webp to png free",
        "webp png online",
        "free webp to png converter",
        "webp to png no upload"
      ],
      fr: [
        "convertir webp en png",
        "webp en png gratuit",
        "convertisseur webp png en ligne",
        "webp vers png sans logiciel",
        "webp png en ligne gratuit",
        "convertir image webp en png"
      ]
    },
    relatedTools: [
      "webp-to-jpg",
      "png-to-webp",
      "image-converter",
      "background-remover",
      "image-compress"
    ],
    howItWorks: {
      en: [
        {
          name: "Upload your WebP file",
          text: "Click the upload area or drag your .webp file. Multiple files are supported for batch conversion."
        },
        {
          name: "Convert automatically",
          text: "EverydayTools converts your WebP to PNG entirely in your browser — no image is ever sent to a server."
        },
        {
          name: "Download the PNG file",
          text: "Your PNG file downloads immediately — no quality reduction applied beyond the chosen format's own compression."
        }
      ],
      fr: [
        {
          name: "Téléversez votre fichier WebP",
          text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .webp. Plusieurs fichiers sont supportés pour la conversion par lot."
        },
        {
          name: "Conversion automatique",
          text: "EverydayTools convertit votre WebP en PNG entièrement dans votre navigateur — aucune image n'est envoyée à un serveur."
        },
        {
          name: "Téléchargez le fichier PNG",
          text: "Votre fichier PNG se télécharge immédiatement — sans réduction de qualité supplémentaire."
        }
      ]
    },
    about: {
      en: "WebP is Google's modern web image format, offering 25–35% smaller file sizes than JPEG at the same visual quality. WebP supports both transparency and animation.",
      fr: "WebP est le format d'image web moderne de Google, offrant des fichiers 25 à 35 % plus petits que JPEG à la même qualité. WebP supporte la transparence et l'animation."
    },
    faqs: {
      en: [
        {
          q: "Why convert WebP to PNG?",
          a: "PNG is lossless and has near-universal compatibility for design work and apps that don't support WebP."
        },
        {
          q: "Does WebP to PNG conversion affect quality?",
          a: "PNG is lossless. Converting from WebP to PNG produces a full-quality output, though file sizes will be larger than the WebP source."
        },
        {
          q: "Can I convert multiple files at once?",
          a: "Yes. The tool supports batch conversion of multiple WebP files in a single upload."
        },
        {
          q: "Is WebP to PNG Converter free?",
          a: "Yes. EverydayTools WebP to PNG Converter is completely free, with no account required and no watermarks."
        }
      ],
      fr: [
        {
          q: "Pourquoi convertir WebP en PNG ?",
          a: "PNG est sans perte et a une compatibilité quasi universelle pour le travail de design et les applications ne supportant pas WebP."
        },
        {
          q: "La conversion affecte-t-elle la qualité ?",
          a: "PNG est sans perte. La conversion de WebP en PNG produit une sortie pleine qualité, bien que les fichiers soient plus grands que la source WebP."
        },
        {
          q: "Puis-je convertir plusieurs fichiers à la fois ?",
          a: "Oui. L'outil supporte la conversion par lot de plusieurs fichiers WebP en un seul téléversement."
        },
        {
          q: "Le convertisseur WebP en PNG est-il gratuit ?",
          a: "Oui. Le convertisseur WebP en PNG d'EverydayTools est entièrement gratuit, sans compte requis et sans filigrane."
        }
      ]
    }
  },
  {
    internalSlug: "tip-calculator",
    slugs: {
      en: "tip-calculator",
      fr: "calculateur-pourboire"
    },
    title: {
      en: "Tip & Percentage Calculator — Free | EverydayTools Hub",
      fr: "Calculateur Pourboire & Pourcentage — Gratuit | EverydayTools Hub"
    },
    h1: {
      en: "Tip & Percentage Calculator",
      fr: "Calculateur de Pourboire & Pourcentage"
    },
    description: {
      en: "Calculate tip amounts, split bills between people, and work out percentage changes instantly. Free, no account.",
      fr: "Calculez les pourboires, répartissez une addition et calculez les variations de pourcentage instantanément. Gratuit, sans compte."
    },
    keywords: {
      en: [
        "tip calculator",
        "tip calculator free online",
        "bill split calculator",
        "percentage calculator",
        "how much to tip",
        "restaurant tip calculator"
      ],
      fr: [
        "calculateur pourboire",
        "calculer pourboire gratuit",
        "répartir addition",
        "calculateur pourcentage",
        "combien laisser de pourboire",
        "calculateur pourboire restaurant"
      ]
    },
    relatedTools: [
      "percentage-calc",
      "unit-converter",
      "currency-converter",
      "qr-code-generator",
      "password-generator"
    ],
    howItWorks: {
      en: [
        {
          name: "Enter the bill amount",
          text: "Type the total bill in the amount field."
        },
        {
          name: "Set the tip percentage",
          text: "Use the slider or quick-tap buttons (15%, 18%, 20%, 25%) to choose a tip percentage."
        },
        {
          name: "See the results instantly",
          text: "The tip amount, total, and per-person share (if splitting) update in real time. No button required."
        }
      ],
      fr: [
        {
          name: "Entrez le montant de l'addition",
          text: "Tapez le total de l'addition dans le champ de montant."
        },
        {
          name: "Définissez le pourcentage de pourboire",
          text: "Utilisez le curseur ou les boutons rapides (15 %, 18 %, 20 %, 25 %) pour choisir un pourcentage."
        },
        {
          name: "Voyez les résultats instantanément",
          text: "Le montant du pourboire, le total et la part par personne se mettent à jour en temps réel. Aucun bouton requis."
        }
      ]
    },
    about: {
      en: "Calculate the right tip amount for any bill in seconds. Enter your bill total, choose a tip percentage, and optionally split the total between multiple people. The calculator updates as you type — no button press required.\n\nThe tool also includes a percentage calculator for more general use: find what percentage one number is of another, or calculate a percentage change between two values. Everything runs locally in your browser.",
      fr: "Calculez le bon montant de pourboire pour n'importe quelle addition en quelques secondes. Entrez le total de votre addition, choisissez un pourcentage de pourboire et répartissez éventuellement le total entre plusieurs personnes. Le calculateur se met à jour au fur et à mesure que vous tapez.\n\nL'outil inclut aussi un calculateur de pourcentage général : trouvez quel pourcentage un nombre représente par rapport à un autre, ou calculez une variation de pourcentage entre deux valeurs. Tout s'exécute localement dans votre navigateur."
    },
    faqs: {
      en: [
        {
          q: "What is the standard tip percentage?",
          a: "In the United States, 15–20% is standard for table service. 15% is acceptable for average service, 18–20% for good service, and 25%+ for exceptional service. In many other countries, tipping is optional or at a lower rate."
        },
        {
          q: "How do I split a bill between multiple people?",
          a: "Enter the bill total and tip percentage, then drag the \"number of people\" slider. The calculator shows both the per-person tip and the per-person total."
        },
        {
          q: "What is a percentage change?",
          a: "Percentage change shows how much a value has increased or decreased relative to the original. Formula: ((new value − original value) ÷ original value) × 100. The tool calculates this automatically."
        },
        {
          q: "Is the Tip Calculator free?",
          a: "Yes. EverydayTools Tip & Percentage Calculator is completely free, with no account required."
        }
      ],
      fr: [
        {
          q: "Quel est le pourcentage de pourboire standard ?",
          a: "Aux États-Unis, 15–20 % est standard pour le service à table. En France, le service est généralement inclus dans l'addition, mais il est courant de laisser 1–5 % pour un bon service."
        },
        {
          q: "Comment répartir une addition entre plusieurs personnes ?",
          a: "Entrez le total de l'addition et le pourcentage de pourboire, puis ajustez le curseur \"nombre de personnes\". Le calculateur affiche la part de pourboire et le total par personne."
        },
        {
          q: "Qu'est-ce qu'une variation de pourcentage ?",
          a: "La variation de pourcentage indique de combien une valeur a augmenté ou diminué par rapport à l'original. Formule : ((nouvelle valeur − valeur originale) ÷ valeur originale) × 100."
        },
        {
          q: "Le calculateur de pourboire est-il gratuit ?",
          a: "Oui. Le calculateur de pourboire et pourcentage d'EverydayTools est entièrement gratuit, sans compte requis."
        }
      ]
    }
  },
  {
    internalSlug: "base64",
    slugs: { en: "base64-encoder-decoder", fr: "encodeur-decodeur-base64" },
    title: { en: "Base64 Encoder / Decoder — Free Online Tool | EverydayTools Hub", fr: "Encodeur / Décodeur Base64 — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Base64 Encoder / Decoder", fr: "Encodeur / Décodeur Base64" },
    description: { en: "Encode text or files to Base64, or decode Base64 strings back to plain text. Instant results, no server required.", fr: "Encodez du texte ou des fichiers en Base64, ou décodez des chaînes Base64 en texte brut. Résultats instantanés." },
    keywords: {
      en: ["base64 encoder decoder online", "encode text to base64", "decode base64 string", "base64 converter free", "base64 encode file"],
      fr: ["encodeur decodeur base64 en ligne", "encoder texte base64", "decoder base64", "convertisseur base64 gratuit"],
    },
    relatedTools: ["url-encoder", "json-formatter", "checksum", "html-formatter", "qr-code-generator"],
    howItWorks: {
      en: [
        { name: "Enter or paste text", text: "Type or paste your text, or switch to File mode to upload a binary file for encoding." },
        { name: "Choose Encode or Decode", text: "Select Encode to convert plain text to a Base64 string, or Decode to convert a Base64 string back to readable text." },
        { name: "Copy the result", text: "The output appears instantly. Click Copy to grab the result to your clipboard." },
      ],
      fr: [
        { name: "Saisissez ou collez du texte", text: "Tapez ou collez votre texte, ou passez en mode Fichier pour encoder un fichier binaire." },
        { name: "Choisissez Encoder ou Décoder", text: "Sélectionnez Encoder pour convertir du texte brut en chaîne Base64, ou Décoder pour l'inverse." },
        { name: "Copiez le résultat", text: "La sortie apparaît instantanément. Cliquez sur Copier pour récupérer le résultat." },
      ],
    },
    about: {
      en: "Base64 is an encoding scheme that represents binary data as a sequence of printable ASCII characters. It is widely used in email attachments (MIME), embedding images in HTML/CSS as data URIs, storing binary data in JSON, and transmitting data over text-only channels. EverydayTools Base64 handles both text encoding and binary file encoding.",
      fr: "Base64 est un schéma d'encodage qui représente des données binaires sous forme de caractères ASCII imprimables. Il est largement utilisé dans les pièces jointes e-mail (MIME), l'intégration d'images en HTML/CSS via des URI de données, le stockage de données binaires en JSON et la transmission sur des canaux texte uniquement.",
    },
    faqs: {
      en: [
        { q: "What is Base64 used for?", a: "Base64 encoding is used whenever binary data (images, files, keys) must be transmitted over a medium that only handles text — such as email bodies, JSON payloads, HTML attributes, or configuration files." },
        { q: "Is Base64 a form of encryption?", a: "No. Base64 is encoding, not encryption. It does not provide any security or confidentiality. Anyone with a Base64 string can decode it instantly. For secure storage, use proper encryption." },
        { q: "Can I encode large files?", a: "Yes, but Base64 expansion is roughly 33% — a 1 MB file becomes about 1.33 MB when encoded. For very large files the encoding may be slow in the browser." },
        { q: "Is the Base64 tool free?", a: "Yes. EverydayTools Base64 Encoder / Decoder is completely free with no account required." },
      ],
      fr: [
        { q: "À quoi sert le Base64 ?", a: "L'encodage Base64 est utilisé lorsque des données binaires doivent être transmises via un canal ne gérant que le texte — comme les corps d'e-mail, les payloads JSON, les attributs HTML ou les fichiers de configuration." },
        { q: "Le Base64 est-il une forme de chiffrement ?", a: "Non. Le Base64 est de l'encodage, pas du chiffrement. Il n'offre aucune sécurité. N'importe qui ayant la chaîne Base64 peut la décoder instantanément. Pour un stockage sécurisé, utilisez un vrai chiffrement." },
        { q: "L'outil Base64 est-il gratuit ?", a: "Oui. L'encodeur/décodeur Base64 d'EverydayTools est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "checksum",
    slugs: { en: "file-checksum-calculator", fr: "calculateur-checksum-fichier" },
    title: { en: "File Checksum Calculator — SHA-256, SHA-512 & More | EverydayTools Hub", fr: "Calculateur Checksum Fichier — SHA-256, SHA-512 | EverydayTools Hub" },
    h1: { en: "File Checksum Calculator", fr: "Calculateur de Checksum de Fichier" },
    description: { en: "Verify file integrity with SHA-1, SHA-256, SHA-384, and SHA-512 checksums. Paste the expected hash to confirm your download is authentic.", fr: "Vérifiez l'intégrité d'un fichier avec les checksums SHA-1, SHA-256, SHA-384 et SHA-512. Collez le hash attendu pour confirmer l'authenticité." },
    keywords: {
      en: ["file checksum calculator", "sha256 hash online", "verify file integrity", "sha512 checksum", "md5 sha1 sha256 online", "hash generator"],
      fr: ["calculateur checksum fichier", "sha256 en ligne", "verifier integrite fichier", "hash sha256 gratuit", "generateur hash"],
    },
    relatedTools: ["metadata-cleaner", "pdf-protect", "base64", "ai-text-scrubber", "url-encoder"],
    howItWorks: {
      en: [
        { name: "Drop your file", text: "Drag any file into the upload area or click to browse. The file is read entirely in your browser." },
        { name: "Select hash algorithm", text: "Choose SHA-1, SHA-256, SHA-384, or SHA-512. The hash is computed immediately after the file loads." },
        { name: "Compare with expected hash", text: "Paste the expected hash from the download source. The tool instantly shows a match or mismatch." },
      ],
      fr: [
        { name: "Déposez votre fichier", text: "Faites glisser n'importe quel fichier dans la zone de dépôt ou cliquez pour naviguer. Le fichier est lu dans votre navigateur." },
        { name: "Sélectionnez l'algorithme", text: "Choisissez SHA-1, SHA-256, SHA-384 ou SHA-512. Le hash est calculé dès que le fichier est chargé." },
        { name: "Comparez avec le hash attendu", text: "Collez le hash fourni par la source du téléchargement. L'outil affiche immédiatement une correspondance ou une différence." },
      ],
    },
    about: {
      en: "A checksum (or cryptographic hash) is a fixed-length fingerprint of a file's content. Even a single changed byte produces a completely different hash — making checksums the standard way to verify that a downloaded file has not been corrupted or tampered with. SHA-256 is the most commonly used algorithm today; SHA-1 is legacy but still seen on older software sites.",
      fr: "Un checksum (ou hash cryptographique) est une empreinte de longueur fixe du contenu d'un fichier. Un seul octet modifié produit un hash entièrement différent — ce qui en fait le moyen standard de vérifier qu'un fichier téléchargé n'a pas été corrompu ou altéré. SHA-256 est l'algorithme le plus courant aujourd'hui ; SHA-1 est obsolète mais encore présent sur d'anciens sites logiciels.",
    },
    faqs: {
      en: [
        { q: "Why should I verify a file checksum?", a: "Checksums let you confirm that a downloaded file is exactly what the publisher intended. If a file was corrupted during transfer or replaced by a malicious version, its hash will differ from the one listed on the official download page." },
        { q: "Which hash algorithm should I use?", a: "SHA-256 is the current standard for file integrity checks. SHA-512 provides stronger guarantees but is rarely required in practice. Avoid SHA-1 for new workflows — it has known weaknesses. MD5 is not supported as it is considered cryptographically broken." },
        { q: "How large a file can I check?", a: "There is no hard size limit. The file is read in chunks so that even multi-gigabyte files can be hashed without memory issues. Larger files will take longer to process." },
      ],
      fr: [
        { q: "Pourquoi vérifier le checksum d'un fichier ?", a: "Les checksums vous permettent de confirmer qu'un fichier téléchargé est exactement celui prévu par l'éditeur. Si un fichier a été corrompu pendant le transfert ou remplacé par une version malveillante, son hash différera de celui indiqué sur la page de téléchargement officielle." },
        { q: "Quel algorithme de hash utiliser ?", a: "SHA-256 est le standard actuel pour les vérifications d'intégrité. Évitez SHA-1 pour de nouveaux usages — il présente des faiblesses connues. MD5 n'est pas pris en charge car cryptographiquement compromis." },
        { q: "Le calculateur de checksum est-il gratuit ?", a: "Oui. EverydayTools File Checksum Calculator est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "csv-to-excel",
    slugs: { en: "convert-csv-to-excel", fr: "convertir-csv-en-excel" },
    title: { en: "CSV to Excel Converter — Free Online XLSX Tool | EverydayTools Hub", fr: "Convertir CSV en Excel — Outil XLSX Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "CSV to Excel Converter", fr: "Convertisseur CSV en Excel" },
    description: { en: "Convert CSV files to Excel (.xlsx) spreadsheets instantly. Preserves delimiters, handles quoting, and supports large datasets.", fr: "Convertissez des fichiers CSV en tableurs Excel (.xlsx) instantanément. Préserve les délimiteurs et gère les guillemets." },
    keywords: {
      en: ["csv to excel converter", "convert csv to xlsx online", "csv to spreadsheet free", "csv to xls online", "import csv excel"],
      fr: ["convertir csv en excel", "csv en xlsx en ligne gratuit", "csv vers tableur", "importer csv excel"],
    },
    relatedTools: ["excel-to-csv", "csv-viewer", "csv-to-json", "excel-to-pdf", "json-formatter"],
    howItWorks: {
      en: [
        { name: "Paste or upload your CSV", text: "Paste CSV text directly or upload a .csv file. The tool automatically detects the delimiter (comma, semicolon, tab)." },
        { name: "Convert to XLSX", text: "Click Convert. Each CSV row becomes a spreadsheet row, with proper column alignment and cell typing." },
        { name: "Download the Excel file", text: "Your .xlsx file downloads immediately, ready to open in Excel, Google Sheets, or LibreOffice." },
      ],
      fr: [
        { name: "Collez ou uploadez votre CSV", text: "Collez du texte CSV directement ou uploadez un fichier .csv. L'outil détecte automatiquement le délimiteur (virgule, point-virgule, tabulation)." },
        { name: "Convertissez en XLSX", text: "Cliquez sur Convertir. Chaque ligne CSV devient une ligne de feuille de calcul, avec un alignement des colonnes et un typage des cellules appropriés." },
        { name: "Téléchargez le fichier Excel", text: "Votre fichier .xlsx se télécharge immédiatement, prêt à ouvrir dans Excel, Google Sheets ou LibreOffice." },
      ],
    },
    about: {
      en: "CSV (Comma-Separated Values) is the most portable tabular format, but it lacks Excel features like multiple sheets, cell formatting, or formulas. Converting to XLSX makes your data easier to analyse, sort, and share — especially with colleagues who rely on Excel.",
      fr: "Le CSV (Comma-Separated Values) est le format tabulaire le plus portable, mais il manque des fonctionnalités Excel comme les feuilles multiples, la mise en forme des cellules ou les formules. La conversion en XLSX facilite l'analyse, le tri et le partage des données.",
    },
    faqs: {
      en: [
        { q: "What delimiters are supported?", a: "The converter auto-detects commas, semicolons, and tab characters as delimiters. If your file uses a different separator, paste the CSV and the column alignment will show whether detection was correct." },
        { q: "Are there limits on file size or row count?", a: "CSV text up to a few tens of MB is supported. Excel has a hard limit of 1,048,576 rows per sheet; if your CSV exceeds this, only the first million rows will be included." },
        { q: "Is CSV to Excel Converter free?", a: "Yes. EverydayTools CSV to Excel Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Quels délimiteurs sont pris en charge ?", a: "Le convertisseur détecte automatiquement les virgules, points-virgules et tabulations. Si votre fichier utilise un autre séparateur, collez le CSV et l'alignement des colonnes indiquera si la détection est correcte." },
        { q: "Y a-t-il des limites de taille ou de nombre de lignes ?", a: "Les textes CSV jusqu'à quelques dizaines de Mo sont pris en charge. Excel a une limite de 1 048 576 lignes par feuille." },
        { q: "Le convertisseur CSV en Excel est-il gratuit ?", a: "Oui. EverydayTools CSV en Excel est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "csv-to-json",
    slugs: { en: "convert-csv-to-json", fr: "convertir-csv-en-json" },
    title: { en: "CSV to JSON Converter — Free Online Tool | EverydayTools Hub", fr: "Convertir CSV en JSON — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "CSV ↔ JSON Converter", fr: "Convertisseur CSV ↔ JSON" },
    description: { en: "Convert CSV to JSON or JSON to CSV instantly. Paste text or upload a file and get a clean, structured result immediately.", fr: "Convertissez du CSV en JSON ou du JSON en CSV instantanément. Collez du texte ou chargez un fichier." },
    keywords: {
      en: ["csv to json converter", "convert csv to json online", "json to csv free", "csv json transform", "parse csv online"],
      fr: ["convertir csv en json", "csv en json en ligne gratuit", "json en csv", "transformer csv json"],
    },
    relatedTools: ["csv-to-excel", "csv-viewer", "json-formatter", "excel-to-csv", "base64"],
    howItWorks: {
      en: [
        { name: "Paste or upload your data", text: "Switch between CSV→JSON and JSON→CSV modes. Paste text directly or upload a file." },
        { name: "Instant conversion", text: "The converter runs as you type. CSV is parsed using the first row as header keys; JSON arrays are unrolled to rows." },
        { name: "Copy or download the result", text: "Copy the output to your clipboard or download it as a file." },
      ],
      fr: [
        { name: "Collez ou chargez vos données", text: "Basculez entre les modes CSV→JSON et JSON→CSV. Collez du texte directement ou chargez un fichier." },
        { name: "Conversion instantanée", text: "Le convertisseur s'exécute au fur et à mesure de la saisie. Le CSV est analysé en utilisant la première ligne comme clés d'en-tête." },
        { name: "Copiez ou téléchargez le résultat", text: "Copiez la sortie dans votre presse-papier ou téléchargez-la sous forme de fichier." },
      ],
    },
    about: {
      en: "CSV and JSON are the two most common formats for structured tabular data. CSV is preferred in spreadsheets and databases; JSON is preferred in APIs and JavaScript applications. This tool converts in both directions, making it easy to move data between these worlds.",
      fr: "CSV et JSON sont les deux formats les plus courants pour les données tabulaires structurées. Le CSV est préféré dans les tableurs et bases de données ; le JSON est préféré dans les API et applications JavaScript. Cet outil convertit dans les deux sens.",
    },
    faqs: {
      en: [
        { q: "How does CSV to JSON conversion work?", a: "The first row of the CSV is treated as the key names for each JSON object. Each subsequent row becomes an object in the output array. Empty cells become empty strings or null values." },
        { q: "What about nested JSON?", a: "The converter handles flat arrays of objects. Deeply nested JSON structures will be flattened to a single level when converting to CSV." },
        { q: "Is the CSV ↔ JSON Converter free?", a: "Yes. EverydayTools CSV ↔ JSON Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Comment fonctionne la conversion CSV en JSON ?", a: "La première ligne du CSV est utilisée comme noms de clés pour chaque objet JSON. Chaque ligne suivante devient un objet dans le tableau de sortie." },
        { q: "Qu'en est-il du JSON imbriqué ?", a: "Le convertisseur gère les tableaux plats d'objets. Les structures JSON profondément imbriquées sont aplaties lors de la conversion en CSV." },
        { q: "Le convertisseur CSV ↔ JSON est-il gratuit ?", a: "Oui. EverydayTools CSV ↔ JSON est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "csv-viewer",
    slugs: { en: "csv-file-viewer", fr: "visualiseur-fichier-csv" },
    title: { en: "CSV Viewer — View & Sort CSV Files Online | EverydayTools Hub", fr: "Visualiseur CSV — Afficher et Trier des Fichiers CSV En Ligne | EverydayTools Hub" },
    h1: { en: "CSV File Viewer", fr: "Visualiseur de Fichier CSV" },
    description: { en: "View and sort CSV files as a formatted table. Upload a file or paste CSV text — no account, no server upload required.", fr: "Affichez et triez des fichiers CSV sous forme de tableau formaté. Chargez un fichier ou collez du texte CSV." },
    keywords: {
      en: ["csv viewer online", "view csv file online", "csv table viewer free", "open csv online", "csv file reader"],
      fr: ["visualiseur csv en ligne", "afficher fichier csv", "lecteur csv gratuit", "ouvrir csv en ligne"],
    },
    relatedTools: ["csv-to-excel", "csv-to-json", "excel-to-csv", "excel-to-pdf", "json-formatter"],
    howItWorks: {
      en: [
        { name: "Upload or paste your CSV", text: "Drop a .csv file into the upload area, or paste CSV text directly into the editor. The first row is treated as column headers." },
        { name: "Explore the table", text: "The CSV renders as a clean, scrollable table. Click any column header to sort ascending or descending." },
        { name: "Export if needed", text: "Download the current view as CSV or convert to Excel using the linked tools." },
      ],
      fr: [
        { name: "Chargez ou collez votre CSV", text: "Déposez un fichier .csv ou collez du texte CSV directement. La première ligne est traitée comme en-têtes de colonnes." },
        { name: "Explorez le tableau", text: "Le CSV s'affiche sous forme de tableau propre et défilable. Cliquez sur n'importe quel en-tête de colonne pour trier." },
        { name: "Exportez si nécessaire", text: "Téléchargez la vue actuelle en CSV ou convertissez-la en Excel avec les outils liés." },
      ],
    },
    about: {
      en: "CSV files are plain text and can't be directly previewed in most browsers. This viewer renders any CSV as a formatted table, making it easy to spot data issues, check column counts, and scan row values — without opening Excel or a text editor.",
      fr: "Les fichiers CSV sont du texte brut et ne peuvent pas être directement prévisualisés dans la plupart des navigateurs. Ce visualiseur affiche n'importe quel CSV sous forme de tableau formaté, facilitant la détection de problèmes de données et la vérification des colonnes.",
    },
    faqs: {
      en: [
        { q: "What delimiters does the CSV Viewer support?", a: "Comma, semicolon, and tab are auto-detected. If the table columns look misaligned, try switching the delimiter manually." },
        { q: "Can I edit the data in the viewer?", a: "The viewer is read-only. To edit cells and save changes, export to Excel first using the CSV to Excel tool, make your edits there, and re-export as CSV if needed." },
        { q: "Is the CSV Viewer free?", a: "Yes. EverydayTools CSV Viewer is completely free with no account required." },
      ],
      fr: [
        { q: "Quels délimiteurs le visualiseur CSV prend-il en charge ?", a: "Virgule, point-virgule et tabulation sont détectés automatiquement. Si les colonnes semblent mal alignées, essayez de changer le délimiteur manuellement." },
        { q: "Puis-je modifier les données dans le visualiseur ?", a: "Le visualiseur est en lecture seule. Pour modifier des cellules, exportez d'abord en Excel, faites vos modifications, puis réexportez en CSV si nécessaire." },
        { q: "Le visualiseur CSV est-il gratuit ?", a: "Oui. EverydayTools CSV Viewer est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "excel-to-csv",
    slugs: { en: "convert-excel-to-csv", fr: "convertir-excel-en-csv" },
    title: { en: "Excel to CSV Converter — Free Online XLSX to CSV | EverydayTools Hub", fr: "Convertir Excel en CSV — XLSX vers CSV Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Excel to CSV Converter", fr: "Convertisseur Excel en CSV" },
    description: { en: "Convert Excel spreadsheets (.xlsx, .xls) to CSV format instantly. Handles multi-sheet workbooks — choose which sheet to export.", fr: "Convertissez des tableurs Excel (.xlsx, .xls) en format CSV instantanément. Supporte les classeurs multi-feuilles." },
    keywords: {
      en: ["excel to csv converter", "convert xlsx to csv online", "xls to csv free", "excel spreadsheet to csv", "export excel as csv"],
      fr: ["convertir excel en csv", "xlsx en csv en ligne gratuit", "xls vers csv", "exporter excel en csv"],
    },
    relatedTools: ["csv-to-excel", "excel-to-pdf", "csv-viewer", "csv-to-json", "json-formatter"],
    howItWorks: {
      en: [
        { name: "Upload your Excel file", text: "Drag a .xlsx or .xls file into the upload area. Multi-sheet workbooks are detected automatically." },
        { name: "Select the sheet", text: "If your workbook has multiple sheets, choose which one to export. Each sheet exports separately." },
        { name: "Download the CSV", text: "Click Convert. A .csv file with proper quoting for values containing commas or newlines downloads immediately." },
      ],
      fr: [
        { name: "Chargez votre fichier Excel", text: "Déposez un fichier .xlsx ou .xls. Les classeurs multi-feuilles sont détectés automatiquement." },
        { name: "Sélectionnez la feuille", text: "Si votre classeur a plusieurs feuilles, choisissez celle à exporter. Chaque feuille s'exporte séparément." },
        { name: "Téléchargez le CSV", text: "Cliquez sur Convertir. Un fichier .csv avec des guillemets appropriés se télécharge immédiatement." },
      ],
    },
    about: {
      en: "CSV is the universal interchange format for tabular data — readable by every database, programming language, and analytics tool. Exporting an Excel file to CSV strips formulas, formatting, and multiple sheets, leaving clean, portable data that imports anywhere.",
      fr: "Le CSV est le format d'échange universel pour les données tabulaires — lisible par chaque base de données, langage de programmation et outil d'analyse. L'exportation d'un fichier Excel en CSV supprime les formules, la mise en forme et les feuilles multiples, laissant des données propres et portables.",
    },
    faqs: {
      en: [
        { q: "Are Excel formulas included in the CSV?", a: "No. CSV stores only plain values — the computed result of each formula, not the formula itself. If you need to preserve formulas, keep the original .xlsx file." },
        { q: "What encoding does the CSV use?", a: "Output is UTF-8, which handles special characters, accents, and non-Latin scripts correctly." },
        { q: "Is Excel to CSV Converter free?", a: "Yes. EverydayTools Excel to CSV Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Les formules Excel sont-elles incluses dans le CSV ?", a: "Non. Le CSV ne stocke que des valeurs brutes — le résultat calculé de chaque formule, pas la formule elle-même. Si vous avez besoin de conserver les formules, gardez le fichier .xlsx original." },
        { q: "Quel encodage utilise le CSV ?", a: "La sortie est en UTF-8, ce qui gère correctement les caractères spéciaux, les accents et les scripts non latins." },
        { q: "Le convertisseur Excel en CSV est-il gratuit ?", a: "Oui. EverydayTools Excel en CSV est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "excel-to-pdf",
    slugs: { en: "convert-excel-to-pdf", fr: "convertir-excel-en-pdf" },
    title: { en: "Excel to PDF Converter — Free Online XLSX to PDF | EverydayTools Hub", fr: "Convertir Excel en PDF — XLSX vers PDF Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Excel to PDF Converter", fr: "Convertisseur Excel en PDF" },
    description: { en: "Convert Excel spreadsheets to PDF format. Renders tables and data into a printable, shareable PDF document.", fr: "Convertissez des tableurs Excel en PDF. Transforme tableaux et données en un document PDF imprimable et partageable." },
    keywords: {
      en: ["excel to pdf converter", "convert xlsx to pdf online", "xls to pdf free", "excel spreadsheet to pdf", "print excel as pdf"],
      fr: ["convertir excel en pdf", "xlsx en pdf en ligne gratuit", "xls vers pdf", "imprimer excel en pdf"],
    },
    relatedTools: ["excel-to-csv", "pdf-compress", "pdf-merge", "csv-to-excel", "pdf-to-excel"],
    howItWorks: {
      en: [
        { name: "Upload your Excel file", text: "Drop a .xlsx or .xls file. The spreadsheet is parsed and rendered for PDF output." },
        { name: "Render as PDF", text: "Each sheet is rendered as a paginated PDF table, with column headers and row data preserved." },
        { name: "Download the PDF", text: "Click Convert. Your PDF downloads immediately, ready to share, print, or archive." },
      ],
      fr: [
        { name: "Chargez votre fichier Excel", text: "Déposez un fichier .xlsx ou .xls. Le tableur est analysé et rendu pour la sortie PDF." },
        { name: "Rendu en PDF", text: "Chaque feuille est rendue sous forme de tableau PDF paginé, avec les en-têtes de colonnes et les données de lignes préservés." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF se télécharge immédiatement, prêt à partager, imprimer ou archiver." },
      ],
    },
    about: {
      en: "Excel files require Excel or compatible software to open. A PDF is universally readable on any device without additional software. Converting your spreadsheet to PDF is useful for sharing reports, invoices, or data summaries with recipients who don't need to edit the data.",
      fr: "Les fichiers Excel nécessitent Excel ou un logiciel compatible pour être ouverts. Un PDF est universellement lisible sur n'importe quel appareil sans logiciel supplémentaire. Convertir votre tableur en PDF est utile pour partager des rapports, factures ou résumés de données.",
    },
    faqs: {
      en: [
        { q: "Will the PDF look exactly like the Excel sheet?", a: "The converter renders table data faithfully, but advanced formatting (conditional formatting, charts, custom fonts) may not transfer perfectly. For pixel-perfect output, use Excel's own export to PDF feature." },
        { q: "Can I convert multiple sheets at once?", a: "Currently each conversion outputs one PDF per workbook, with each sheet on separate pages. Charts and pivot tables are not rendered." },
        { q: "Is Excel to PDF Converter free?", a: "Yes. EverydayTools Excel to PDF Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Le PDF ressemblera-t-il exactement à la feuille Excel ?", a: "Le convertisseur reproduit fidèlement les données tabulaires, mais la mise en forme avancée (mise en forme conditionnelle, graphiques, polices personnalisées) peut ne pas être parfaitement transférée." },
        { q: "Puis-je convertir plusieurs feuilles à la fois ?", a: "Actuellement, chaque conversion produit un PDF par classeur, avec chaque feuille sur des pages séparées. Les graphiques et tableaux croisés dynamiques ne sont pas rendus." },
        { q: "Le convertisseur Excel en PDF est-il gratuit ?", a: "Oui. EverydayTools Excel en PDF est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "favicon-generator",
    slugs: { en: "favicon-generator", fr: "generateur-favicon" },
    title: { en: "Favicon Generator — Create ICO & PNG Favicons | EverydayTools Hub", fr: "Générateur de Favicon — Créer des Favicons ICO & PNG | EverydayTools Hub" },
    h1: { en: "Favicon Generator", fr: "Générateur de Favicon" },
    description: { en: "Generate favicons in all standard sizes (16×16 to 512×512) from any PNG, JPG, or SVG image. Download as a ZIP with all formats included.", fr: "Générez des favicons dans toutes les tailles standard (16×16 à 512×512) à partir d'une image PNG, JPG ou SVG. Téléchargez en ZIP." },
    keywords: {
      en: ["favicon generator", "create favicon online", "favicon ico generator", "favicon from image", "website favicon maker", "apple touch icon generator"],
      fr: ["générateur favicon", "créer favicon en ligne", "favicon ico", "favicon depuis image", "favicon site web"],
    },
    relatedTools: ["image-converter", "image-resize", "image-crop", "png-to-webp", "svg-to-png"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Drop a PNG, JPG, or SVG. Square images produce the best results — the tool crops to a square automatically if needed." },
        { name: "Choose sizes", text: "All standard favicon sizes are selected by default: 16×16, 32×32, 64×64, 128×128, Apple Touch Icon (180×180), and Android (192×192)." },
        { name: "Download as ZIP", text: "Click Generate. A ZIP archive containing all selected sizes as individual PNG/ICO files downloads to your device." },
      ],
      fr: [
        { name: "Chargez votre image", text: "Déposez un PNG, JPG ou SVG. Les images carrées donnent les meilleurs résultats — l'outil recadre automatiquement en carré si nécessaire." },
        { name: "Choisissez les tailles", text: "Toutes les tailles de favicon standard sont sélectionnées par défaut : 16×16, 32×32, 64×64, 128×128, Apple Touch Icon (180×180) et Android (192×192)." },
        { name: "Téléchargez en ZIP", text: "Cliquez sur Générer. Une archive ZIP contenant toutes les tailles sélectionnées se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "A favicon is the small icon shown in browser tabs, bookmarks, and the address bar. Modern browsers and mobile devices require multiple sizes — 16×16 for tabs, 32×32 for desktop shortcuts, 180×180 for Apple devices, and 192×192 for Android. Starting from a high-resolution square image gives the best results across all sizes.",
      fr: "Un favicon est la petite icône affichée dans les onglets du navigateur, les favoris et la barre d'adresse. Les navigateurs modernes et les appareils mobiles nécessitent plusieurs tailles — 16×16 pour les onglets, 32×32 pour les raccourcis bureau, 180×180 pour les appareils Apple et 192×192 pour Android.",
    },
    faqs: {
      en: [
        { q: "What image size should I start with?", a: "Use at least a 512×512 pixel square image for the best downscaling quality. Simple, high-contrast designs work best at small sizes — thin details and text become illegible at 16×16 pixels." },
        { q: "How do I install a favicon on my website?", a: "Place the favicon files at the root of your web server and add <link rel=\"icon\" href=\"/favicon.ico\"> to the <head> of your HTML. For Apple devices, add <link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">." },
        { q: "Is Favicon Generator free?", a: "Yes. EverydayTools Favicon Generator is completely free with no account required." },
      ],
      fr: [
        { q: "Quelle taille d'image dois-je utiliser ?", a: "Utilisez au moins une image carrée de 512×512 pixels pour la meilleure qualité de réduction. Les designs simples et à fort contraste fonctionnent mieux aux petites tailles — les détails fins et le texte deviennent illisibles à 16×16 pixels." },
        { q: "Comment installer un favicon sur mon site web ?", a: "Placez les fichiers favicon à la racine de votre serveur web et ajoutez <link rel=\"icon\" href=\"/favicon.ico\"> dans le <head> de votre HTML. Pour les appareils Apple, ajoutez <link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">." },
        { q: "Le générateur de favicon est-il gratuit ?", a: "Oui. EverydayTools Favicon Generator est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "flip-rotate-image",
    slugs: { en: "flip-and-rotate-image", fr: "retourner-pivoter-image" },
    title: { en: "Flip & Rotate Image — Free Online Tool | EverydayTools Hub", fr: "Retourner et Pivoter une Image — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Flip & Rotate Image", fr: "Retourner et Pivoter une Image" },
    description: { en: "Flip images horizontally or vertically, or rotate by any angle. Supports PNG, JPEG, and WebP. Instant download.", fr: "Retournez des images horizontalement ou verticalement, ou faites pivoter selon n'importe quel angle. PNG, JPEG, WebP." },
    keywords: {
      en: ["flip image online", "rotate image free", "mirror image horizontally", "rotate image 90 degrees", "flip photo vertically online"],
      fr: ["retourner image en ligne", "pivoter image gratuit", "miroir horizontal image", "rotation image 90 degrés"],
    },
    relatedTools: ["image-crop", "image-resize", "watermark-image", "image-compress", "background-remover"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Drop or select a PNG, JPEG, or WebP file. A preview appears immediately." },
        { name: "Apply transformations", text: "Click Flip Horizontal, Flip Vertical, or set a custom rotation angle. Transformations stack and preview live." },
        { name: "Download the result", text: "Click Download. The transformed image saves in the same format as the original." },
      ],
      fr: [
        { name: "Chargez votre image", text: "Déposez ou sélectionnez un fichier PNG, JPEG ou WebP. Un aperçu apparaît immédiatement." },
        { name: "Appliquez les transformations", text: "Cliquez sur Retourner horizontal, Retourner vertical ou définissez un angle de rotation personnalisé. Les transformations s'accumulent et l'aperçu est en direct." },
        { name: "Téléchargez le résultat", text: "Cliquez sur Télécharger. L'image transformée est enregistrée dans le même format que l'original." },
      ],
    },
    about: {
      en: "Flip and rotation are the most basic image orientation corrections. Flipping horizontally mirrors the image left-to-right — useful for fixing selfies or creating reflection effects. Vertical flip mirrors top-to-bottom. Custom rotation lets you straighten a tilted horizon or create artistic compositions.",
      fr: "Le retournement et la rotation sont les corrections d'orientation d'image les plus basiques. Le retournement horizontal crée un miroir gauche-droite — utile pour corriger des selfies ou créer des effets de réflexion. La rotation personnalisée permet de redresser un horizon incliné.",
    },
    faqs: {
      en: [
        { q: "Does rotating by a non-90° angle crop the image?", a: "Yes. When rotating by an arbitrary angle (e.g. 15°), the corners of the original image go outside the canvas. The tool adds a transparent or white border to accommodate the full rotated image." },
        { q: "Is the original image quality preserved?", a: "Flip operations are lossless. Rotation by arbitrary angles involves resampling which may introduce very minor softness at a pixel level." },
        { q: "Is Flip & Rotate free?", a: "Yes. EverydayTools Flip & Rotate Image is completely free with no account required." },
      ],
      fr: [
        { q: "Une rotation non-90° recadre-t-elle l'image ?", a: "Oui. Lors d'une rotation par un angle arbitraire, les coins de l'image originale sortent du canevas. L'outil ajoute une bordure transparente ou blanche pour accueillir l'image pivotée complète." },
        { q: "La qualité de l'image originale est-elle préservée ?", a: "Les opérations de retournement sont sans perte. La rotation par des angles arbitraires implique un rééchantillonnage qui peut introduire une légère douceur au niveau des pixels." },
        { q: "Retourner & Pivoter est-il gratuit ?", a: "Oui. EverydayTools Flip & Rotate Image est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "html-formatter",
    slugs: { en: "html-formatter-beautifier", fr: "formateur-html-beautifier" },
    title: { en: "HTML Formatter & Minifier — Free Online Beautifier | EverydayTools Hub", fr: "Formateur & Minificateur HTML — Beautifier Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "HTML Formatter & Minifier", fr: "Formateur & Minificateur HTML" },
    description: { en: "Beautify or minify HTML code with a single click. Proper indentation, consistent formatting, and configurable indent size.", fr: "Embellissez ou minifiez du code HTML en un clic. Indentation correcte, mise en forme cohérente." },
    keywords: {
      en: ["html formatter online", "beautify html code", "html minifier free", "html indenter", "pretty print html", "html beautifier"],
      fr: ["formateur html en ligne", "embellir code html", "minificateur html gratuit", "indenter html", "html beautifier gratuit"],
    },
    relatedTools: ["json-formatter", "html-to-markdown", "html-to-pdf", "url-encoder", "word-to-html"],
    howItWorks: {
      en: [
        { name: "Paste your HTML", text: "Paste raw or minified HTML into the left editor. Any valid HTML — full pages or fragments — is accepted." },
        { name: "Format or Minify", text: "Click Beautify for readable, properly indented output. Click Minify to collapse all whitespace for production use." },
        { name: "Copy the result", text: "The formatted HTML appears in the right panel. Click Copy to grab it to your clipboard." },
      ],
      fr: [
        { name: "Collez votre HTML", text: "Collez du HTML brut ou minifié dans l'éditeur de gauche. Tout HTML valide — pages complètes ou fragments — est accepté." },
        { name: "Formatez ou minifiez", text: "Cliquez sur Beautifier pour une sortie lisible et correctement indentée. Cliquez sur Minifier pour supprimer tous les espaces blancs." },
        { name: "Copiez le résultat", text: "Le HTML formaté apparaît dans le panneau de droite. Cliquez sur Copier pour le récupérer." },
      ],
    },
    about: {
      en: "Well-formatted HTML is easier to read, debug, and maintain. Minified HTML removes all unnecessary whitespace to reduce file size — useful for production deployments where every byte counts. This formatter handles both directions and supports configurable indent sizes (2 or 4 spaces, or tabs).",
      fr: "Un HTML bien formaté est plus facile à lire, déboguer et maintenir. Le HTML minifié supprime tous les espaces inutiles pour réduire la taille du fichier — utile pour les déploiements en production. Ce formateur gère les deux directions.",
    },
    faqs: {
      en: [
        { q: "Does formatting change how the HTML renders in a browser?", a: "No. Whitespace between HTML tags is generally ignored by browsers. Formatting and minifying only affect the source code readability, not the rendered output." },
        { q: "Can I format HTML with embedded CSS or JavaScript?", a: "Yes. Inline <style> blocks and <script> blocks are preserved as-is. Embedded code is not re-formatted." },
        { q: "Is HTML Formatter free?", a: "Yes. EverydayTools HTML Formatter is completely free with no account required." },
      ],
      fr: [
        { q: "Le formatage change-t-il le rendu HTML dans un navigateur ?", a: "Non. Les espaces blancs entre les balises HTML sont généralement ignorés par les navigateurs. Le formatage et la minification n'affectent que la lisibilité du code source." },
        { q: "Puis-je formater du HTML avec du CSS ou JavaScript intégré ?", a: "Oui. Les blocs <style> et <script> en ligne sont préservés tels quels. Le code intégré n'est pas reformaté." },
        { q: "Le formateur HTML est-il gratuit ?", a: "Oui. EverydayTools HTML Formatter est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "html-to-markdown",
    slugs: { en: "convert-html-to-markdown", fr: "convertir-html-en-markdown" },
    title: { en: "HTML to Markdown Converter — Free Online Tool | EverydayTools Hub", fr: "Convertir HTML en Markdown — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "HTML to Markdown Converter", fr: "Convertisseur HTML en Markdown" },
    description: { en: "Convert HTML markup to clean Markdown syntax. Handles headings, links, lists, bold, italic, code blocks, and tables.", fr: "Convertissez du HTML en syntaxe Markdown propre. Gère les titres, liens, listes, gras, italique, blocs de code et tableaux." },
    keywords: {
      en: ["html to markdown converter", "convert html to markdown online", "html to md free", "html markdown transform", "paste html get markdown"],
      fr: ["convertir html en markdown", "html en markdown en ligne gratuit", "transformateur html markdown"],
    },
    relatedTools: ["html-formatter", "markdown-to-pdf", "markdown-to-docx", "word-to-html", "html-to-pdf"],
    howItWorks: {
      en: [
        { name: "Paste your HTML", text: "Paste HTML content into the left panel. Full pages or fragments are both accepted." },
        { name: "Convert instantly", text: "The Markdown equivalent appears in the right panel in real time as you type or paste." },
        { name: "Copy the Markdown", text: "Click Copy to grab the Markdown output, ready to paste into a README, CMS, or documentation tool." },
      ],
      fr: [
        { name: "Collez votre HTML", text: "Collez du contenu HTML dans le panneau de gauche. Les pages complètes ou les fragments sont acceptés." },
        { name: "Conversion instantanée", text: "L'équivalent Markdown apparaît dans le panneau de droite en temps réel." },
        { name: "Copiez le Markdown", text: "Cliquez sur Copier pour récupérer la sortie Markdown, prête à coller dans un README, CMS ou outil de documentation." },
      ],
    },
    about: {
      en: "Markdown is the preferred format for documentation, README files, blog posts, and notes — it's readable as plain text and renders beautifully in GitHub, Notion, Obsidian, and most modern CMSs. This converter strips HTML tags and translates them to their Markdown equivalents, giving you clean, portable text.",
      fr: "Markdown est le format préféré pour la documentation, les fichiers README, les articles de blog et les notes — il est lisible en texte brut et s'affiche magnifiquement dans GitHub, Notion, Obsidian et la plupart des CMS modernes. Ce convertisseur transforme les balises HTML en leur équivalent Markdown.",
    },
    faqs: {
      en: [
        { q: "What HTML elements are converted to Markdown?", a: "Headings (h1–h6), paragraphs, links, images, bold, italic, inline code, code blocks, unordered and ordered lists, blockquotes, and tables are all converted. Complex CSS styling is stripped." },
        { q: "What happens to HTML that has no Markdown equivalent?", a: "Elements like <div>, <span>, <figure>, and custom attributes are stripped. Only the text content and supported structural elements are preserved." },
        { q: "Is HTML to Markdown Converter free?", a: "Yes. EverydayTools HTML to Markdown Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Quels éléments HTML sont convertis en Markdown ?", a: "Les titres (h1–h6), paragraphes, liens, images, gras, italique, code en ligne, blocs de code, listes et tableaux sont tous convertis. Les styles CSS complexes sont supprimés." },
        { q: "Que se passe-t-il avec le HTML sans équivalent Markdown ?", a: "Les éléments comme <div>, <span> et les attributs personnalisés sont supprimés. Seul le contenu textuel et les éléments structurels supportés sont préservés." },
        { q: "Le convertisseur HTML en Markdown est-il gratuit ?", a: "Oui. EverydayTools HTML en Markdown est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "json-formatter",
    slugs: { en: "json-formatter-validator", fr: "formateur-validateur-json" },
    title: { en: "JSON Formatter & Validator — Free Online Beautifier | EverydayTools Hub", fr: "Formateur & Validateur JSON — Beautifier Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "JSON Formatter & Validator", fr: "Formateur & Validateur JSON" },
    description: { en: "Format, validate, and minify JSON. Highlights syntax errors, pretty-prints with configurable indentation, and minifies for production.", fr: "Formatez, validez et minifiez du JSON. Met en évidence les erreurs de syntaxe et pretty-print avec indentation configurable." },
    keywords: {
      en: ["json formatter online", "validate json free", "json beautifier", "json minifier", "pretty print json", "json syntax checker"],
      fr: ["formateur json en ligne", "valider json gratuit", "json beautifier", "json minificateur", "pretty print json"],
    },
    relatedTools: ["csv-to-json", "base64", "html-formatter", "url-encoder", "csv-viewer"],
    howItWorks: {
      en: [
        { name: "Paste your JSON", text: "Paste raw or minified JSON into the input panel. Syntax errors are highlighted in red immediately." },
        { name: "Format or Minify", text: "Click Beautify for readable output with 2-space indentation, or Minify to produce compact single-line JSON." },
        { name: "Copy the result", text: "The formatted JSON appears in the output panel. Click Copy to grab it." },
      ],
      fr: [
        { name: "Collez votre JSON", text: "Collez du JSON brut ou minifié dans le panneau d'entrée. Les erreurs de syntaxe sont immédiatement mises en évidence en rouge." },
        { name: "Formatez ou minifiez", text: "Cliquez sur Beautifier pour une sortie lisible avec indentation à 2 espaces, ou sur Minifier pour produire un JSON compact sur une seule ligne." },
        { name: "Copiez le résultat", text: "Le JSON formaté apparaît dans le panneau de sortie. Cliquez sur Copier." },
      ],
    },
    about: {
      en: "JSON (JavaScript Object Notation) is the standard format for REST APIs, configuration files, and data exchange. Minified JSON compresses whitespace for transmission efficiency; formatted JSON is readable for debugging and review. This formatter handles both and flags syntax errors before you copy or use the output.",
      fr: "JSON (JavaScript Object Notation) est le format standard pour les API REST, les fichiers de configuration et l'échange de données. Le JSON minifié compresse les espaces pour l'efficacité de transmission ; le JSON formaté est lisible pour le débogage. Ce formateur gère les deux et signale les erreurs de syntaxe.",
    },
    faqs: {
      en: [
        { q: "What JSON syntax errors are detected?", a: "Missing commas, unclosed brackets or braces, unquoted keys, trailing commas (not valid in JSON), and invalid escape sequences are all flagged with the line number of the error." },
        { q: "What is the size limit for JSON input?", a: "Input up to a few MB is supported. Very large JSON files (50 MB+) may be slow to parse in the browser." },
        { q: "Is JSON Formatter free?", a: "Yes. EverydayTools JSON Formatter & Validator is completely free with no account required." },
      ],
      fr: [
        { q: "Quelles erreurs de syntaxe JSON sont détectées ?", a: "Les virgules manquantes, les crochets ou accolades non fermés, les clés non entre guillemets, les virgules de fin (non valides en JSON) et les séquences d'échappement invalides sont tous signalés avec le numéro de ligne de l'erreur." },
        { q: "Quelle est la limite de taille pour l'entrée JSON ?", a: "L'entrée jusqu'à quelques Mo est prise en charge. Les très grands fichiers JSON (50 Mo+) peuvent être lents à analyser dans le navigateur." },
        { q: "Le formateur JSON est-il gratuit ?", a: "Oui. EverydayTools JSON Formatter & Validator est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "lorem-ipsum",
    slugs: { en: "lorem-ipsum-generator", fr: "generateur-lorem-ipsum" },
    title: { en: "Lorem Ipsum Generator — Free Placeholder Text | EverydayTools Hub", fr: "Générateur Lorem Ipsum — Texte de Remplacement Gratuit | EverydayTools Hub" },
    h1: { en: "Lorem Ipsum Generator", fr: "Générateur Lorem Ipsum" },
    description: { en: "Generate Lorem Ipsum placeholder text by word, sentence, or paragraph count. Copy instantly for use in designs, mockups, and prototypes.", fr: "Générez du texte Lorem Ipsum par nombre de mots, phrases ou paragraphes. Copiez instantanément pour maquettes et prototypes." },
    keywords: {
      en: ["lorem ipsum generator", "placeholder text generator", "dummy text online", "lorem ipsum paragraphs", "design placeholder text"],
      fr: ["générateur lorem ipsum", "générateur texte placeholder", "texte factice en ligne", "lorem ipsum paragraphes"],
    },
    relatedTools: ["word-counter", "url-encoder", "json-formatter", "html-formatter", "base64"],
    howItWorks: {
      en: [
        { name: "Set the output type", text: "Choose whether to generate by words, sentences, or paragraphs." },
        { name: "Set the count", text: "Enter the quantity you need. The preview updates instantly." },
        { name: "Copy the text", text: "Click Copy. Your placeholder text is ready to paste into Figma, HTML, a CMS, or anywhere else." },
      ],
      fr: [
        { name: "Définissez le type de sortie", text: "Choisissez de générer par mots, phrases ou paragraphes." },
        { name: "Définissez le nombre", text: "Entrez la quantité souhaitée. L'aperçu se met à jour instantanément." },
        { name: "Copiez le texte", text: "Cliquez sur Copier. Votre texte de remplacement est prêt à coller dans Figma, HTML, un CMS ou n'importe où ailleurs." },
      ],
    },
    about: {
      en: "Lorem Ipsum text has been the standard placeholder for typesetting and design since the 1500s. It mimics natural language letter distribution without conveying meaning, allowing designers and developers to focus on layout and typography without distraction from readable content.",
      fr: "Le texte Lorem Ipsum est le texte de remplacement standard pour la typographie et le design depuis les années 1500. Il imite la distribution naturelle des lettres d'une langue sans véhiculer de sens, permettant aux designers et développeurs de se concentrer sur la mise en page et la typographie.",
    },
    faqs: {
      en: [
        { q: "Where does Lorem Ipsum text come from?", a: "It derives from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' by Cicero, written in 45 BC. The text was scrambled in the 1500s to make it unreadable for design proofing purposes." },
        { q: "Is the generated text always the same?", a: "The standard Lorem Ipsum passage is deterministic. For variation, many generators use random word selection from a Lorem Ipsum word list — this tool offers both." },
        { q: "Is Lorem Ipsum Generator free?", a: "Yes. EverydayTools Lorem Ipsum Generator is completely free with no account required." },
      ],
      fr: [
        { q: "D'où vient le texte Lorem Ipsum ?", a: "Il est dérivé des sections 1.10.32 et 1.10.33 du 'de Finibus Bonorum et Malorum' de Cicéron, écrit en 45 av. J.-C. Le texte a été brouillé dans les années 1500 pour le rendre illisible à des fins de maquette typographique." },
        { q: "Le texte généré est-il toujours le même ?", a: "Le passage Lorem Ipsum standard est déterministe. Pour les variations, de nombreux générateurs utilisent une sélection aléatoire de mots d'une liste Lorem Ipsum." },
        { q: "Le générateur Lorem Ipsum est-il gratuit ?", a: "Oui. EverydayTools Lorem Ipsum Generator est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "ocr",
    slugs: { en: "ocr-image-to-text", fr: "ocr-image-en-texte" },
    title: { en: "OCR — Extract Text from Images Free Online | EverydayTools Hub", fr: "OCR — Extraire le Texte des Images Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "OCR — Image to Text", fr: "OCR — Image en Texte" },
    description: { en: "Extract text from scanned images, photos, and screenshots using Tesseract OCR. Supports 40+ languages. Download as TXT.", fr: "Extrayez du texte d'images numérisées, photos et captures d'écran avec Tesseract OCR. Supporte 40+ langues. Téléchargez en TXT." },
    keywords: {
      en: ["ocr online free", "extract text from image", "image to text converter", "tesseract ocr online", "scan text from photo", "ocr jpg png"],
      fr: ["ocr en ligne gratuit", "extraire texte image", "convertisseur image en texte", "tesseract ocr", "scanner texte photo"],
    },
    relatedTools: ["pdf-to-text", "metadata-cleaner", "pdf-to-word", "image-converter", "pdf-to-image"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Drop a PNG, JPG, TIFF, or BMP image. Photos of printed text, scanned documents, or screenshots all work." },
        { name: "Select language", text: "Choose the language of the text in your image for better recognition accuracy (default: English)." },
        { name: "Extract and download", text: "Click Extract. The recognised text appears in the output area. Copy to clipboard or download as a .txt file." },
      ],
      fr: [
        { name: "Chargez votre image", text: "Déposez une image PNG, JPG, TIFF ou BMP. Les photos de texte imprimé, les documents numérisés ou les captures d'écran fonctionnent tous." },
        { name: "Sélectionnez la langue", text: "Choisissez la langue du texte dans votre image pour une meilleure précision de reconnaissance (par défaut : Anglais)." },
        { name: "Extrayez et téléchargez", text: "Cliquez sur Extraire. Le texte reconnu apparaît dans la zone de sortie. Copiez ou téléchargez en fichier .txt." },
      ],
    },
    about: {
      en: "OCR (Optical Character Recognition) converts images of text into machine-readable characters. This tool uses Tesseract.js — a port of Google's Tesseract engine — to recognise text in over 40 languages directly in your browser. Best results come from high-resolution images with good contrast between text and background.",
      fr: "L'OCR (Reconnaissance Optique de Caractères) convertit les images de texte en caractères lisibles par machine. Cet outil utilise Tesseract.js — un portage du moteur Tesseract de Google — pour reconnaître le texte dans plus de 40 langues directement dans votre navigateur.",
    },
    faqs: {
      en: [
        { q: "What image quality gives the best OCR results?", a: "High resolution (300 DPI or higher), good contrast between text and background, horizontal text orientation, and minimal noise produce the best results. Blurry, low-contrast, or tilted images will have lower accuracy." },
        { q: "Does OCR work with handwriting?", a: "Tesseract was designed for printed text and produces poor results with cursive handwriting. Block letters or very neat printing may be partially recognised but accuracy will be lower than for printed documents." },
        { q: "Is OCR free?", a: "Yes. EverydayTools OCR tool is completely free with no account required." },
      ],
      fr: [
        { q: "Quelle qualité d'image donne les meilleurs résultats OCR ?", a: "Une haute résolution (300 DPI ou plus), un bon contraste entre le texte et l'arrière-plan, une orientation horizontale du texte et un minimum de bruit produisent les meilleurs résultats." },
        { q: "L'OCR fonctionne-t-il avec l'écriture manuscrite ?", a: "Tesseract a été conçu pour le texte imprimé et produit de mauvais résultats avec l'écriture cursive. Les lettres en majuscules peuvent être partiellement reconnues mais avec une précision inférieure." },
        { q: "L'outil OCR est-il gratuit ?", a: "Oui. EverydayTools OCR est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-excel",
    slugs: { en: "convert-pdf-to-excel", fr: "convertir-pdf-en-excel" },
    title: { en: "PDF to Excel Converter — Extract Tables Free Online | EverydayTools Hub", fr: "Convertir PDF en Excel — Extraire Tableaux Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "PDF to Excel Converter", fr: "Convertisseur PDF en Excel" },
    description: { en: "Extract tables from PDF files into an Excel spreadsheet (.xlsx). Detects table structure and maps data to rows and columns.", fr: "Extrayez des tableaux de fichiers PDF dans un tableur Excel (.xlsx). Détecte la structure des tableaux et mappe les données." },
    keywords: {
      en: ["pdf to excel converter", "extract table from pdf", "convert pdf to xlsx online", "pdf table extractor free", "pdf to spreadsheet"],
      fr: ["convertir pdf en excel", "extraire tableau pdf", "pdf en xlsx gratuit", "extracteur tableau pdf"],
    },
    relatedTools: ["excel-to-pdf", "pdf-to-text", "csv-to-excel", "pdf-to-word", "excel-to-csv"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Drop a PDF containing tables. The tool scans each page for table-like structures." },
        { name: "Table detection", text: "Detected tables are listed by page. Select which tables to include in the Excel output." },
        { name: "Download the XLSX", text: "Click Export. Each detected table becomes a sheet in the downloaded Excel workbook." },
      ],
      fr: [
        { name: "Chargez votre PDF", text: "Déposez un PDF contenant des tableaux. L'outil scanne chaque page à la recherche de structures de type tableau." },
        { name: "Détection des tableaux", text: "Les tableaux détectés sont listés par page. Sélectionnez ceux à inclure dans la sortie Excel." },
        { name: "Téléchargez le XLSX", text: "Cliquez sur Exporter. Chaque tableau détecté devient une feuille dans le classeur Excel téléchargé." },
      ],
    },
    about: {
      en: "Extracting tables from PDF is notoriously difficult because PDFs describe visual positions, not data structure. This tool uses heuristics to detect rectangular table regions and map cell positions to rows and columns. Results are best on PDFs created from spreadsheets or word processors; scanned PDFs or PDFs with complex nested tables may produce partial results.",
      fr: "L'extraction de tableaux depuis des PDF est notoirement difficile car les PDF décrivent des positions visuelles, pas une structure de données. Cet outil utilise des heuristiques pour détecter les régions tabulaires rectangulaires.",
    },
    faqs: {
      en: [
        { q: "Does this work on scanned PDFs?", a: "Scanned PDFs (image-only PDFs) do not contain text data, so table extraction is not possible. Use the OCR tool first to convert the scan to a text-based PDF, then try table extraction." },
        { q: "Will all tables be extracted correctly?", a: "Simple single-level tables with clear borders extract well. Merged cells, nested tables, and tables spanning multiple pages may produce imperfect results that need manual cleanup in Excel." },
        { q: "Is PDF to Excel Converter free?", a: "Yes. EverydayTools PDF to Excel Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Cela fonctionne-t-il sur les PDF numérisés ?", a: "Les PDF numérisés (PDF image uniquement) ne contiennent pas de données textuelles. Utilisez d'abord l'outil OCR pour convertir le scan en PDF basé sur du texte, puis essayez l'extraction de tableaux." },
        { q: "Tous les tableaux seront-ils correctement extraits ?", a: "Les tableaux simples à un seul niveau avec des bordures claires s'extraient bien. Les cellules fusionnées et les tableaux imbriqués peuvent produire des résultats imparfaits." },
        { q: "Le convertisseur PDF en Excel est-il gratuit ?", a: "Oui. EverydayTools PDF en Excel est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "pdf-to-pptx",
    slugs: { en: "convert-pdf-to-powerpoint", fr: "convertir-pdf-en-powerpoint" },
    title: { en: "PDF to PowerPoint Converter — Free Online Tool | EverydayTools Hub", fr: "Convertir PDF en PowerPoint — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "PDF to PowerPoint Converter", fr: "Convertisseur PDF en PowerPoint" },
    description: { en: "Convert each PDF page into a PowerPoint slide (.pptx). Each page becomes an image slide — great for presentations and repurposing content.", fr: "Convertissez chaque page PDF en une diapositive PowerPoint (.pptx). Chaque page devient une diapositive image." },
    keywords: {
      en: ["pdf to powerpoint converter", "convert pdf to pptx online", "pdf to slides free", "pdf page to powerpoint slide"],
      fr: ["convertir pdf en powerpoint", "pdf en pptx gratuit", "pdf en diapositives", "convertir page pdf en slide"],
    },
    relatedTools: ["pptx-to-pdf", "pdf-to-word", "pptx-to-images", "pdf-compress", "reorder-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Drop a PDF file. Each page will become one slide in the output presentation." },
        { name: "Convert to PPTX", text: "Each PDF page is rendered as a high-quality image and placed on a widescreen slide." },
        { name: "Download the presentation", text: "The .pptx file downloads immediately, ready to open in PowerPoint or Google Slides." },
      ],
      fr: [
        { name: "Chargez votre PDF", text: "Déposez un fichier PDF. Chaque page deviendra une diapositive dans la présentation de sortie." },
        { name: "Conversion en PPTX", text: "Chaque page PDF est rendue comme une image haute qualité et placée sur une diapositive au format large." },
        { name: "Téléchargez la présentation", text: "Le fichier .pptx se télécharge immédiatement, prêt à ouvrir dans PowerPoint ou Google Slides." },
      ],
    },
    about: {
      en: "Converting PDF pages to PowerPoint slides is a common workflow for repurposing reports, brochures, or academic papers as presentations. Since PDF pages are rendered as images per slide, the visual appearance is preserved exactly — though the text becomes part of an image and won't be editable in PowerPoint.",
      fr: "Convertir des pages PDF en diapositives PowerPoint est un flux de travail courant pour réutiliser des rapports, brochures ou documents académiques en présentations. Les pages PDF étant rendues comme images par diapositive, l'apparence visuelle est préservée exactement.",
    },
    faqs: {
      en: [
        { q: "Can I edit the text on slides after conversion?", a: "No. Each slide contains the PDF page as an image. Text within the image is not selectable or editable in PowerPoint. For editable text, use the PDF to Word converter instead." },
        { q: "What aspect ratio are the slides?", a: "Slides are created in the standard widescreen 16:9 format. The PDF page image is scaled to fit within the slide area." },
        { q: "Is PDF to PowerPoint Converter free?", a: "Yes. EverydayTools PDF to PowerPoint Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Puis-je modifier le texte des diapositives après la conversion ?", a: "Non. Chaque diapositive contient la page PDF sous forme d'image. Le texte dans l'image n'est pas sélectionnable dans PowerPoint. Pour un texte modifiable, utilisez plutôt le convertisseur PDF en Word." },
        { q: "Quel format ont les diapositives ?", a: "Les diapositives sont créées au format large standard 16:9. L'image de la page PDF est mise à l'échelle pour s'adapter à la zone de diapositive." },
        { q: "Le convertisseur PDF en PowerPoint est-il gratuit ?", a: "Oui. EverydayTools PDF en PowerPoint est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "pptx-to-images",
    slugs: { en: "convert-powerpoint-to-images", fr: "convertir-powerpoint-en-images" },
    title: { en: "PowerPoint to Images — Export Slides as PNG | EverydayTools Hub", fr: "PowerPoint en Images — Exporter les Diapositives en PNG | EverydayTools Hub" },
    h1: { en: "PowerPoint to Images", fr: "PowerPoint en Images" },
    description: { en: "Export each PowerPoint slide as a PNG image and download all images as a ZIP archive. No PowerPoint required.", fr: "Exportez chaque diapositive PowerPoint en PNG et téléchargez toutes les images en ZIP. Sans PowerPoint requis." },
    keywords: {
      en: ["powerpoint to images", "convert pptx to png", "export slides as images", "pptx to jpg free", "screenshot presentation slides"],
      fr: ["powerpoint en images", "convertir pptx en png", "exporter diapositives en images", "pptx en jpg gratuit"],
    },
    relatedTools: ["pptx-to-pdf", "image-converter", "pdf-to-image", "image-compress", "pdf-to-pptx"],
    howItWorks: {
      en: [
        { name: "Upload your PPTX", text: "Drop a .pptx file. The presentation is parsed and each slide is rendered." },
        { name: "Slides rendered as images", text: "Each slide becomes a high-resolution PNG image, preserving fonts, colors, and layout." },
        { name: "Download the ZIP", text: "All slide images download as a single ZIP archive. Individual slide images are named slide-1.png, slide-2.png, etc." },
      ],
      fr: [
        { name: "Chargez votre PPTX", text: "Déposez un fichier .pptx. La présentation est analysée et chaque diapositive est rendue." },
        { name: "Diapositives rendues en images", text: "Chaque diapositive devient une image PNG haute résolution, préservant les polices, couleurs et mise en page." },
        { name: "Téléchargez le ZIP", text: "Toutes les images de diapositives se téléchargent dans une seule archive ZIP." },
      ],
    },
    about: {
      en: "Exporting presentation slides as images is useful for embedding them on websites, sending previews by email, uploading to social media, or creating thumbnail grids. PNG output preserves slide content at high resolution without requiring recipients to have PowerPoint installed.",
      fr: "L'exportation de diapositives de présentation en images est utile pour les intégrer sur des sites Web, envoyer des aperçus par e-mail, publier sur les réseaux sociaux ou créer des grilles de miniatures. La sortie PNG préserve le contenu des diapositives en haute résolution.",
    },
    faqs: {
      en: [
        { q: "Are animations and transitions included?", a: "No. Animations and slide transitions are static — each slide is captured as a single frame showing the fully-built slide state." },
        { q: "What resolution are the exported images?", a: "Images are exported at 96–150 DPI by default, which is sufficient for web use. Slides are rendered at the native 16:9 aspect ratio." },
        { q: "Is PowerPoint to Images free?", a: "Yes. EverydayTools PowerPoint to Images is completely free with no account required." },
      ],
      fr: [
        { q: "Les animations et transitions sont-elles incluses ?", a: "Non. Les animations et transitions de diapositives sont statiques — chaque diapositive est capturée comme une seule image montrant l'état final." },
        { q: "Quelle résolution ont les images exportées ?", a: "Les images sont exportées à 96–150 DPI par défaut, ce qui est suffisant pour une utilisation web. Les diapositives sont rendues au format natif 16:9." },
        { q: "PowerPoint en Images est-il gratuit ?", a: "Oui. EverydayTools PowerPoint en Images est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "pptx-to-pdf",
    slugs: { en: "convert-powerpoint-to-pdf", fr: "convertir-powerpoint-en-pdf" },
    title: { en: "PowerPoint to PDF Converter — Free Online PPTX to PDF | EverydayTools Hub", fr: "Convertir PowerPoint en PDF — PPTX vers PDF Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "PowerPoint to PDF Converter", fr: "Convertisseur PowerPoint en PDF" },
    description: { en: "Convert PowerPoint presentations (.pptx) to PDF. Each slide becomes a PDF page — shareable, printable, and viewable without PowerPoint.", fr: "Convertissez des présentations PowerPoint (.pptx) en PDF. Chaque diapositive devient une page PDF — partageable et imprimable." },
    keywords: {
      en: ["powerpoint to pdf", "convert pptx to pdf online", "pptx pdf free", "presentation to pdf", "slides to pdf converter"],
      fr: ["powerpoint en pdf", "convertir pptx en pdf gratuit", "présentation en pdf", "diapositives en pdf"],
    },
    relatedTools: ["pptx-to-images", "pdf-compress", "pdf-merge", "pdf-to-pptx", "reorder-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your PPTX file", text: "Drop a .pptx file. Each slide is rendered and queued for PDF output." },
        { name: "Each slide becomes a page", text: "Slides are rendered in order as PDF pages, preserving layout, fonts, and images." },
        { name: "Download the PDF", text: "Your PDF downloads immediately, ready to share, print, or archive." },
      ],
      fr: [
        { name: "Chargez votre fichier PPTX", text: "Déposez un fichier .pptx. Chaque diapositive est rendue et mise en file pour la sortie PDF." },
        { name: "Chaque diapositive devient une page", text: "Les diapositives sont rendues dans l'ordre en pages PDF, en préservant la mise en page, les polices et les images." },
        { name: "Téléchargez le PDF", text: "Votre PDF se télécharge immédiatement, prêt à partager, imprimer ou archiver." },
      ],
    },
    about: {
      en: "PDF is the universal presentation format — readable on any device without PowerPoint, preserving layout regardless of fonts or OS. Sharing presentations as PDFs prevents accidental edits, ensures consistent rendering, and keeps file sizes manageable.",
      fr: "Le PDF est le format de présentation universel — lisible sur n'importe quel appareil sans PowerPoint, préservant la mise en page indépendamment des polices ou du système d'exploitation. Partager des présentations en PDF prévient les modifications accidentelles.",
    },
    faqs: {
      en: [
        { q: "Will animations and videos be in the PDF?", a: "No. PDFs are static — each slide is rendered as a single page showing the fully-built state. Animations, embedded videos, and sound are removed." },
        { q: "Can I convert only specific slides?", a: "Currently the converter exports all slides. To export a subset, use the Reorder PDF Pages tool after conversion to remove unwanted pages." },
        { q: "Is PowerPoint to PDF Converter free?", a: "Yes. EverydayTools PowerPoint to PDF Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Les animations et vidéos seront-elles dans le PDF ?", a: "Non. Les PDF sont statiques — chaque diapositive est rendue comme une seule page. Les animations, vidéos intégrées et sons sont supprimés." },
        { q: "Puis-je convertir uniquement certaines diapositives ?", a: "Actuellement, le convertisseur exporte toutes les diapositives. Pour exporter un sous-ensemble, utilisez l'outil Réorganiser les pages PDF après la conversion." },
        { q: "Le convertisseur PowerPoint en PDF est-il gratuit ?", a: "Oui. EverydayTools PowerPoint en PDF est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "qr-code-generator",
    slugs: { en: "qr-code-generator", fr: "generateur-qr-code" },
    title: { en: "QR Code Generator — Free, No Signup | EverydayTools Hub", fr: "Générateur de QR Code — Gratuit, Sans Inscription | EverydayTools Hub" },
    h1: { en: "QR Code Generator", fr: "Générateur de QR Code" },
    description: { en: "Generate QR codes for URLs, text, Wi-Fi credentials, or contact cards (vCard). Download as PNG or SVG — free, no account.", fr: "Générez des QR codes pour URL, texte, Wi-Fi ou cartes de contact (vCard). Téléchargez en PNG ou SVG." },
    keywords: {
      en: ["qr code generator free", "create qr code online", "wifi qr code generator", "url to qr code", "vcard qr code", "qr code download"],
      fr: ["générateur qr code gratuit", "créer qr code en ligne", "qr code wifi", "url en qr code", "qr code téléchargement"],
    },
    relatedTools: ["url-encoder", "base64", "password-generator", "percentage-calc", "unit-converter"],
    howItWorks: {
      en: [
        { name: "Choose content type", text: "Select URL, plain text, Wi-Fi (SSID + password + security type), or Contact (vCard with name, phone, email)." },
        { name: "Enter your data", text: "Fill in the fields. The QR code preview updates in real time." },
        { name: "Download", text: "Download the QR code as a PNG for digital use or SVG for scalable print use." },
      ],
      fr: [
        { name: "Choisissez le type de contenu", text: "Sélectionnez URL, texte brut, Wi-Fi (SSID + mot de passe + type de sécurité) ou Contact (vCard)." },
        { name: "Entrez vos données", text: "Remplissez les champs. L'aperçu du QR code se met à jour en temps réel." },
        { name: "Téléchargez", text: "Téléchargez le QR code en PNG pour un usage numérique ou en SVG pour une impression évolutive." },
      ],
    },
    about: {
      en: "QR codes are two-dimensional barcodes that encode data as a pattern of black and white squares. Smartphones scan them instantly with the camera app. Common uses include linking to websites, sharing Wi-Fi credentials without typing, sharing contact details, and redirecting printed materials to web content.",
      fr: "Les QR codes sont des codes-barres bidimensionnels qui encodent des données sous forme de motif de carrés noirs et blancs. Les smartphones les scannent instantanément avec l'application caméra. Utilisations courantes : liens vers des sites web, partage d'identifiants Wi-Fi, partage de coordonnées.",
    },
    faqs: {
      en: [
        { q: "What is the maximum amount of data a QR code can hold?", a: "QR codes can hold up to about 3,000 alphanumeric characters. Longer data produces denser, harder-to-scan codes. For URLs, keep links short using a URL shortener for best scannability." },
        { q: "Can QR codes expire?", a: "QR codes themselves do not expire — they are just encoded data. If a QR code points to a URL, it will stop working if the URL becomes unavailable." },
        { q: "Is QR Code Generator free?", a: "Yes. EverydayTools QR Code Generator is completely free with no account required." },
      ],
      fr: [
        { q: "Quelle est la quantité maximale de données qu'un QR code peut contenir ?", a: "Les QR codes peuvent contenir jusqu'à environ 3 000 caractères alphanumériques. Les données plus longues produisent des codes plus denses, plus difficiles à scanner. Pour les URL, gardez les liens courts." },
        { q: "Les QR codes expirent-ils ?", a: "Les QR codes eux-mêmes n'expirent pas — ce sont juste des données encodées. Si un QR code pointe vers une URL, il cessera de fonctionner si l'URL devient indisponible." },
        { q: "Le générateur de QR code est-il gratuit ?", a: "Oui. EverydayTools QR Code Generator est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "reorder-pdf",
    slugs: { en: "reorder-pdf-pages", fr: "reorganiser-pages-pdf" },
    title: { en: "Reorder PDF Pages — Drag & Drop Page Manager | EverydayTools Hub", fr: "Réorganiser les Pages PDF — Gestionnaire par Glisser-Déposer | EverydayTools Hub" },
    h1: { en: "Reorder PDF Pages", fr: "Réorganiser les Pages PDF" },
    description: { en: "Drag and drop to reorder, delete, and rearrange pages in a PDF. Preview thumbnails for every page. Download the reorganised PDF.", fr: "Glissez-déposez pour réorganiser, supprimer et déplacer les pages d'un PDF. Aperçu miniature de chaque page." },
    keywords: {
      en: ["reorder pdf pages", "rearrange pdf pages online", "drag drop pdf pages", "delete pdf pages free", "pdf page manager"],
      fr: ["réorganiser pages pdf", "déplacer pages pdf en ligne", "glisser déposer pages pdf", "supprimer pages pdf gratuit"],
    },
    relatedTools: ["pdf-split", "pdf-merge", "pdf-rotate", "pdf-compress", "pdf-page-numbers"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Drop a PDF file. All pages are rendered as thumbnails so you can see what each contains." },
        { name: "Drag to reorder", text: "Drag thumbnail cards to rearrange the page order. Click the delete icon on any card to remove that page." },
        { name: "Download the result", text: "Click Save. The reordered PDF downloads with the pages in the new order." },
      ],
      fr: [
        { name: "Chargez votre PDF", text: "Déposez un fichier PDF. Toutes les pages sont rendues sous forme de miniatures." },
        { name: "Glissez pour réorganiser", text: "Faites glisser les vignettes pour réorganiser l'ordre des pages. Cliquez sur l'icône de suppression pour retirer une page." },
        { name: "Téléchargez le résultat", text: "Cliquez sur Enregistrer. Le PDF réorganisé se télécharge avec les pages dans le nouvel ordre." },
      ],
    },
    about: {
      en: "PDF page management is one of the most common document tasks — removing a blank page, moving an appendix to the front, or reversing the scan order of a batch of documents. This tool lets you see every page and drag them into exactly the order you need.",
      fr: "La gestion des pages PDF est l'une des tâches documentaires les plus courantes — supprimer une page blanche, déplacer une annexe en tête, ou inverser l'ordre de numérisation d'un lot de documents.",
    },
    faqs: {
      en: [
        { q: "Is there a page limit?", a: "The tool handles PDFs with hundreds of pages, but rendering thumbnails for very large PDFs (200+ pages) may take a few seconds." },
        { q: "Can I undo a deleted page?", a: "Yes. Deleted pages are removed from the visual order but not saved until you click Download. Refresh the page to start over with the original file." },
        { q: "Is Reorder PDF Pages free?", a: "Yes. EverydayTools Reorder PDF Pages is completely free with no account required." },
      ],
      fr: [
        { q: "Y a-t-il une limite de pages ?", a: "L'outil gère les PDF avec des centaines de pages, mais le rendu des miniatures pour les très grands PDF (200+ pages) peut prendre quelques secondes." },
        { q: "Puis-je annuler une page supprimée ?", a: "Oui. Les pages supprimées sont retirées de l'ordre visuel mais pas sauvegardées jusqu'à ce que vous cliquiez sur Télécharger. Actualisez la page pour recommencer avec le fichier original." },
        { q: "Réorganiser les pages PDF est-il gratuit ?", a: "Oui. EverydayTools Reorder PDF Pages est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "url-encoder",
    slugs: { en: "url-encoder-decoder", fr: "encodeur-decodeur-url" },
    title: { en: "URL Encoder / Decoder — Free Online Tool | EverydayTools Hub", fr: "Encodeur / Décodeur URL — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "URL Encoder / Decoder", fr: "Encodeur / Décodeur URL" },
    description: { en: "Encode or decode URL components instantly. Converts special characters to percent-encoding (%20, %2F, etc.) and back.", fr: "Encodez ou décodez des composants URL instantanément. Convertit les caractères spéciaux en encodage pourcent (%20, etc.)." },
    keywords: {
      en: ["url encoder decoder online", "percent encoding online", "encode url free", "decode url online", "urlencode urldecode", "url escape characters"],
      fr: ["encodeur decodeur url en ligne", "encodage pourcent", "encoder url gratuit", "decoder url en ligne", "urlencode urldecode"],
    },
    relatedTools: ["base64", "json-formatter", "qr-code-generator", "html-formatter", "word-counter"],
    howItWorks: {
      en: [
        { name: "Paste your URL or text", text: "Paste a full URL or just a text value into the input field." },
        { name: "Choose Encode or Decode", text: "Encode converts special characters to percent-encoding (e.g., spaces become %20). Decode reverses this." },
        { name: "Copy the result", text: "The converted text appears instantly. Click Copy to grab it." },
      ],
      fr: [
        { name: "Collez votre URL ou texte", text: "Collez une URL complète ou juste une valeur textuelle dans le champ d'entrée." },
        { name: "Choisissez Encoder ou Décoder", text: "L'encodage convertit les caractères spéciaux en encodage pourcent (par ex., les espaces deviennent %20). Le décodage inverse cela." },
        { name: "Copiez le résultat", text: "Le texte converti apparaît instantanément. Cliquez sur Copier." },
      ],
    },
    about: {
      en: "URLs can only contain a limited set of characters. Special characters — spaces, accents, slashes, ampersands — must be percent-encoded when used in query strings or path segments. URL encoding is essential when building API requests, constructing query parameters, or debugging web traffic.",
      fr: "Les URL ne peuvent contenir qu'un ensemble limité de caractères. Les caractères spéciaux — espaces, accents, barres obliques, esperluettes — doivent être encodés en pourcentage lorsqu'ils sont utilisés dans des chaînes de requête ou des segments de chemin.",
    },
    faqs: {
      en: [
        { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL, preserving characters like /, :, and # that have structural meaning. encodeURIComponent encodes a single component (e.g., a query parameter value), converting those structural characters too. This tool encodes components by default." },
        { q: "Why is a space encoded as %20 sometimes and + other times?", a: "In the query string of a form submission (application/x-www-form-urlencoded), spaces are encoded as +. In other URL contexts, the correct encoding is %20. This tool uses %20 (RFC 3986 standard)." },
        { q: "Is URL Encoder / Decoder free?", a: "Yes. EverydayTools URL Encoder / Decoder is completely free with no account required." },
      ],
      fr: [
        { q: "Quelle est la différence entre encodeURI et encodeURIComponent ?", a: "encodeURI encode une URL complète, en préservant les caractères comme /, : et # qui ont une signification structurelle. encodeURIComponent encode un seul composant (par ex., une valeur de paramètre de requête), convertissant également ces caractères structurels." },
        { q: "Pourquoi un espace est-il encodé comme %20 ou + selon les cas ?", a: "Dans la chaîne de requête d'une soumission de formulaire, les espaces sont encodés comme +. Dans d'autres contextes d'URL, l'encodage correct est %20. Cet outil utilise %20 (standard RFC 3986)." },
        { q: "L'encodeur/décodeur URL est-il gratuit ?", a: "Oui. EverydayTools URL Encoder / Decoder est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "watermark-image",
    slugs: { en: "add-watermark-to-image", fr: "ajouter-filigrane-image" },
    title: { en: "Add Watermark to Image — Free Online Tool | EverydayTools Hub", fr: "Ajouter un Filigrane à une Image — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Add Watermark to Image", fr: "Ajouter un Filigrane à une Image" },
    description: { en: "Add text watermarks to images with custom position, opacity, font size, and color. Supports PNG, JPEG, and WebP.", fr: "Ajoutez des filigranes texte à des images avec position, opacité, taille de police et couleur personnalisées. PNG, JPEG, WebP." },
    keywords: {
      en: ["add watermark to image online", "image watermark free", "text watermark photo", "watermark picture online", "custom watermark photo"],
      fr: ["ajouter filigrane image en ligne", "filigrane photo gratuit", "filigrane texte image", "watermark photo en ligne"],
    },
    relatedTools: ["flip-rotate-image", "image-resize", "image-compress", "image-crop", "background-remover"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Drop or select a PNG, JPEG, or WebP image. A live preview shows the watermark position." },
        { name: "Configure the watermark", text: "Enter the watermark text, then adjust font size, color, opacity (0–100%), and position (9 anchor points or free drag)." },
        { name: "Download", text: "Click Apply & Download. The watermarked image downloads in the same format as the original." },
      ],
      fr: [
        { name: "Chargez votre image", text: "Déposez ou sélectionnez une image PNG, JPEG ou WebP. Un aperçu en direct montre la position du filigrane." },
        { name: "Configurez le filigrane", text: "Entrez le texte du filigrane, puis ajustez la taille de police, la couleur, l'opacité (0–100 %) et la position (9 points d'ancrage ou glissement libre)." },
        { name: "Téléchargez", text: "Cliquez sur Appliquer et Télécharger. L'image avec filigrane se télécharge dans le même format que l'original." },
      ],
    },
    about: {
      en: "Watermarks protect intellectual property by visibly marking images with a name, copyright notice, or website URL. A well-placed semi-transparent watermark makes unauthorised use obvious while keeping the image presentable. This tool lets you place text watermarks precisely without installing any software.",
      fr: "Les filigranes protègent la propriété intellectuelle en marquant visiblement les images avec un nom, une notice de copyright ou une URL de site Web. Un filigrane semi-transparent bien placé rend l'utilisation non autorisée évidente tout en gardant l'image présentable.",
    },
    faqs: {
      en: [
        { q: "Can I add an image watermark instead of text?", a: "Currently only text watermarks are supported. For image-over-image compositing, use image editing software such as GIMP or Photoshop." },
        { q: "Does adding a watermark reduce image quality?", a: "No. The watermark is rendered on a canvas copy of the original image and exported at the same resolution. JPEG output may have minor compression artefacts depending on the quality setting." },
        { q: "Is Add Watermark free?", a: "Yes. EverydayTools Add Watermark to Image is completely free with no account required." },
      ],
      fr: [
        { q: "Puis-je ajouter un filigrane image plutôt que texte ?", a: "Actuellement, seuls les filigranes texte sont pris en charge. Pour la composition image sur image, utilisez un logiciel d'édition d'images comme GIMP ou Photoshop." },
        { q: "L'ajout d'un filigrane réduit-il la qualité de l'image ?", a: "Non. Le filigrane est rendu sur une copie canvas de l'image originale et exporté à la même résolution." },
        { q: "Ajouter un filigrane est-il gratuit ?", a: "Oui. EverydayTools Add Watermark to Image est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "word-counter",
    slugs: { en: "word-character-counter", fr: "compteur-mots-caracteres" },
    title: { en: "Word & Character Counter — Free Online Tool | EverydayTools Hub", fr: "Compteur de Mots et Caractères — Outil Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Word & Character Counter", fr: "Compteur de Mots et Caractères" },
    description: { en: "Count words, characters (with/without spaces), sentences, paragraphs, and estimated reading time. Paste any text to analyze instantly.", fr: "Comptez mots, caractères (avec/sans espaces), phrases, paragraphes et temps de lecture estimé. Collez n'importe quel texte." },
    keywords: {
      en: ["word counter online", "character counter free", "count words online", "word count tool", "reading time calculator", "sentence counter"],
      fr: ["compteur de mots en ligne", "compteur de caractères gratuit", "compter mots en ligne", "outil de comptage de mots", "calculateur temps de lecture"],
    },
    relatedTools: ["lorem-ipsum", "url-encoder", "word-to-pdf", "html-formatter", "json-formatter"],
    howItWorks: {
      en: [
        { name: "Paste or type your text", text: "Drop text directly into the editor. Word, character, sentence, and paragraph counts update as you type." },
        { name: "Review statistics", text: "See word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time at 200 WPM." },
        { name: "Use for any text", text: "Perfect for essays, tweets, SEO meta descriptions, SMS messages, or any content with a length requirement." },
      ],
      fr: [
        { name: "Collez ou tapez votre texte", text: "Déposez du texte directement dans l'éditeur. Les comptages de mots, caractères, phrases et paragraphes se mettent à jour au fur et à mesure de la frappe." },
        { name: "Consultez les statistiques", text: "Voir le nombre de mots, de caractères (avec et sans espaces), de phrases, de paragraphes et le temps de lecture estimé à 200 MPM." },
        { name: "Utilisez pour n'importe quel texte", text: "Parfait pour les essais, tweets, méta-descriptions SEO, messages SMS ou tout contenu avec une contrainte de longueur." },
      ],
    },
    about: {
      en: "Word and character counts matter in many contexts: academic papers with word limits, tweets (280 characters), SMS (160 characters), meta descriptions (155 characters), LinkedIn posts, and book chapters. This tool gives you an instant breakdown of every text metric without pasting into Word or Google Docs.",
      fr: "Les comptages de mots et de caractères sont importants dans de nombreux contextes : dissertations avec limites de mots, tweets (280 caractères), SMS (160 caractères), méta-descriptions (155 caractères), publications LinkedIn et chapitres de livres.",
    },
    faqs: {
      en: [
        { q: "Does the word counter work with languages other than English?", a: "Yes. Words are counted by splitting on whitespace, which works for any space-separated language. Character counting is Unicode-aware, so accented characters, CJK characters, and emoji are each counted as one character." },
        { q: "What counts as a word?", a: "Any sequence of non-whitespace characters. Hyphenated words (e.g., 'well-known') count as one word. Numbers and punctuation are included if attached to letters." },
        { q: "Is the Word Counter free?", a: "Yes. EverydayTools Word & Character Counter is completely free with no account required." },
      ],
      fr: [
        { q: "Le compteur de mots fonctionne-t-il avec des langues autres que l'anglais ?", a: "Oui. Les mots sont comptés en divisant sur les espaces blancs, ce qui fonctionne pour toute langue séparée par des espaces. Le comptage des caractères est compatible Unicode, donc les caractères accentués, CJK et emojis comptent chacun comme un caractère." },
        { q: "Qu'est-ce qui compte comme un mot ?", a: "Toute séquence de caractères non-espaces. Les mots avec trait d'union (par ex., 'bien-connu') comptent comme un seul mot." },
        { q: "Le compteur de mots est-il gratuit ?", a: "Oui. EverydayTools Word & Character Counter est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "word-to-markdown",
    slugs: { en: "convert-word-to-markdown", fr: "convertir-word-en-markdown" },
    title: { en: "Word to Markdown Converter — Free DOCX to MD | EverydayTools Hub", fr: "Convertir Word en Markdown — DOCX vers MD Gratuit | EverydayTools Hub" },
    h1: { en: "Word to Markdown Converter", fr: "Convertisseur Word en Markdown" },
    description: { en: "Convert DOCX files to clean Markdown. Preserves headings, lists, bold, italic, links, and tables. Ready for GitHub, Notion, or any Markdown editor.", fr: "Convertissez des fichiers DOCX en Markdown propre. Préserve titres, listes, gras, italique, liens et tableaux." },
    keywords: {
      en: ["word to markdown converter", "docx to markdown online", "convert word to md", "docx md free", "word document to markdown"],
      fr: ["convertir word en markdown", "docx en markdown en ligne", "word en md gratuit", "document word en markdown"],
    },
    relatedTools: ["html-to-markdown", "markdown-to-pdf", "word-to-text", "word-to-html", "markdown-to-docx"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Drop a .docx file. The document is parsed for its structural content." },
        { name: "Convert to Markdown", text: "Headings become # symbols, bold becomes **text**, lists become - or 1. syntax, and links are preserved as [text](url)." },
        { name: "Copy or download", text: "Copy the Markdown directly or download as a .md file for use in any editor." },
      ],
      fr: [
        { name: "Chargez votre DOCX", text: "Déposez un fichier .docx. Le document est analysé pour son contenu structurel." },
        { name: "Conversion en Markdown", text: "Les titres deviennent des symboles #, le gras devient **texte**, les listes deviennent la syntaxe - ou 1., et les liens sont préservés." },
        { name: "Copiez ou téléchargez", text: "Copiez le Markdown directement ou téléchargez en fichier .md pour utilisation dans n'importe quel éditeur." },
      ],
    },
    about: {
      en: "Markdown has become the default writing format for documentation, GitHub READMEs, Notion pages, and static site generators. Converting Word documents to Markdown strips proprietary formatting while preserving the document's structure and meaning — making it easy to publish Word content anywhere Markdown is accepted.",
      fr: "Markdown est devenu le format d'écriture par défaut pour la documentation, les README GitHub, les pages Notion et les générateurs de sites statiques. Convertir des documents Word en Markdown supprime la mise en forme propriétaire tout en préservant la structure et le sens du document.",
    },
    faqs: {
      en: [
        { q: "Are images in the DOCX included?", a: "Images embedded in the Word document are not currently extracted. Only text content and structure (headings, lists, tables, formatting) are converted." },
        { q: "What Word formatting maps to Markdown?", a: "Heading styles (Heading 1–6) → # to ######. Bold → **bold**. Italic → *italic*. Hyperlinks → [text](url). Numbered and bulleted lists → 1. and - syntax. Simple tables → Markdown table pipes." },
        { q: "Is Word to Markdown free?", a: "Yes. EverydayTools Word to Markdown Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Les images dans le DOCX sont-elles incluses ?", a: "Les images intégrées dans le document Word ne sont pas actuellement extraites. Seul le contenu texte et la structure sont convertis." },
        { q: "Quel formatage Word correspond à Markdown ?", a: "Styles de titre (Titre 1–6) → # à ######. Gras → **gras**. Italique → *italique*. Hyperliens → [texte](url). Listes numérotées et à puces → 1. et - syntaxe." },
        { q: "Word en Markdown est-il gratuit ?", a: "Oui. EverydayTools Word to Markdown Converter est entièrement gratuit, sans compte requis." },
      ],
    },
  },
  {
    internalSlug: "word-to-pdf",
    slugs: { en: "convert-word-to-pdf", fr: "convertir-word-en-pdf" },
    title: { en: "Word to PDF Converter — Free DOCX to PDF Online | EverydayTools Hub", fr: "Convertir Word en PDF — DOCX vers PDF Gratuit En Ligne | EverydayTools Hub" },
    h1: { en: "Word to PDF Converter", fr: "Convertisseur Word en PDF" },
    description: { en: "Convert Word documents (.docx, .doc) to PDF. Preserves text, headings, lists, and basic formatting. No signup, no upload to servers.", fr: "Convertissez des documents Word (.docx, .doc) en PDF. Préserve texte, titres, listes et mise en forme de base. Sans inscription." },
    keywords: {
      en: ["word to pdf converter", "convert docx to pdf online", "doc to pdf free", "word document to pdf", "docx pdf online"],
      fr: ["convertir word en pdf", "docx en pdf en ligne gratuit", "doc en pdf", "document word en pdf", "convertisseur word pdf"],
    },
    relatedTools: ["word-to-text", "pdf-compress", "txt-to-pdf", "pdf-merge", "markdown-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your Word document", text: "Drop a .docx or .doc file. The document content is extracted." },
        { name: "Convert to PDF", text: "Text, headings, paragraphs, lists, and basic formatting are rendered into a clean, paginated PDF." },
        { name: "Download the PDF", text: "Your PDF downloads immediately, ready to share or print." },
      ],
      fr: [
        { name: "Chargez votre document Word", text: "Déposez un fichier .docx ou .doc. Le contenu du document est extrait." },
        { name: "Conversion en PDF", text: "Le texte, les titres, les paragraphes, les listes et la mise en forme de base sont rendus dans un PDF propre et paginé." },
        { name: "Téléchargez le PDF", text: "Votre PDF se télécharge immédiatement, prêt à partager ou imprimer." },
      ],
    },
    about: {
      en: "PDF is the standard for sharing documents that should look the same on every device — preserving layout, fonts, and formatting regardless of what software the recipient has. Converting a Word document to PDF locks in the appearance and prevents unintentional edits.",
      fr: "Le PDF est le standard pour partager des documents qui doivent avoir le même aspect sur chaque appareil — préservant la mise en page, les polices et la mise en forme indépendamment du logiciel du destinataire. Convertir un document Word en PDF fixe l'apparence et prévient les modifications non intentionnelles.",
    },
    faqs: {
      en: [
        { q: "Will the PDF look exactly like the Word document?", a: "Text, headings, paragraphs, and lists are faithfully rendered. Complex layouts (text boxes, columns, custom fonts, tracked changes) may not render perfectly. For pixel-perfect output, use Word's own Save As PDF feature." },
        { q: "Are .doc files supported as well as .docx?", a: "Yes, both .docx (modern) and .doc (legacy) formats are accepted." },
        { q: "Is Word to PDF Converter free?", a: "Yes. EverydayTools Word to PDF Converter is completely free with no account required." },
      ],
      fr: [
        { q: "Le PDF ressemblera-t-il exactement au document Word ?", a: "Le texte, les titres, les paragraphes et les listes sont fidèlement rendus. Les mises en page complexes (zones de texte, colonnes, polices personnalisées) peuvent ne pas être parfaitement reproduites. Pour un résultat pixel-perfect, utilisez la fonctionnalité Enregistrer en PDF de Word." },
        { q: "Les fichiers .doc sont-ils pris en charge en plus de .docx ?", a: "Oui, les formats .docx (moderne) et .doc (héritage) sont tous deux acceptés." },
        { q: "Le convertisseur Word en PDF est-il gratuit ?", a: "Oui. EverydayTools Word to PDF Converter est entièrement gratuit, sans compte requis." },
      ],
    },
  },
];

export type Locale = "en" | "fr";

export const SLUG_MAP_EN_TO_INTERNAL: Record<string, string> = Object.fromEntries(
  SEO_TOOLS.map((t) => [t.slugs.en, t.internalSlug])
);

export const SLUG_MAP_FR_TO_INTERNAL: Record<string, string> = Object.fromEntries(
  SEO_TOOLS.map((t) => [t.slugs.fr, t.internalSlug])
);

export const SLUG_MAP_INTERNAL_TO_EN: Record<string, string> = Object.fromEntries(
  SEO_TOOLS.map((t) => [t.internalSlug, t.slugs.en])
);

export const SLUG_MAP_INTERNAL_TO_FR: Record<string, string> = Object.fromEntries(
  SEO_TOOLS.map((t) => [t.internalSlug, t.slugs.fr])
);

export function getToolSeoByInternalSlug(internalSlug: string): ToolSeoEntry | undefined {
  return SEO_TOOLS.find((t) => t.internalSlug === internalSlug);
}

export function getToolSeoByLocaleSlug(localeSlug: string, locale: Locale): ToolSeoEntry | undefined {
  return SEO_TOOLS.find((t) => t.slugs[locale] === localeSlug);
}

export const HREFLANG_MANIFEST = SEO_TOOLS.map((t) => ({
  en: `/en/${t.slugs.en}`,
  fr: `/fr/${t.slugs.fr}`,
}));
