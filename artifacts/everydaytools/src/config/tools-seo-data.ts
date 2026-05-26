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
  // ─── PDF TOOLS ───────────────────────────────────────────────────────────────
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
    relatedTools: ["pdf-compress", "pdf-to-text", "txt-to-docx"],
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
      en: "PDF to Word conversion is one of the most common document tasks, and EverydayTools Hub PDF to Word Converter makes it fast, private, and completely free. The tool uses the PDF.js library running entirely inside your browser to parse each page of your PDF, extract the text content, and rebuild it as a structured DOCX file using the docx library — all without sending a single byte to a remote server.\n\nThis browser-based approach means your documents never leave your device, which is essential when converting contracts, medical records, or any sensitive material. It also means the tool works offline after the initial page load.\n\nThe converter preserves text and basic paragraph structure. Complex layouts — such as multi-column pages, embedded tables, or heavily formatted covers — may require manual adjustment after conversion, which is true of all PDF-to-Word tools regardless of cost. For best results, use PDFs that were originally created from Word or other text-based sources rather than scanned documents.\n\nRelated tools: use our Compress PDF tool to reduce file size before converting, or our Text to Word converter for simpler plain-text documents. EverydayTools Hub is free, no signup required.",
      fr: "La conversion PDF en Word est l'une des tâches documentaires les plus fréquentes, et le convertisseur PDF en Word d'EverydayTools Hub la rend rapide, privée et entièrement gratuite. L'outil utilise la bibliothèque PDF.js dans votre navigateur pour analyser chaque page du PDF, en extraire le contenu textuel et le reconstruire en fichier DOCX structuré — sans envoyer aucune donnée à un serveur distant.\n\nCette approche entièrement côté navigateur signifie que vos documents ne quittent jamais votre appareil, ce qui est essentiel lors de la conversion de contrats, de dossiers médicaux ou de tout document sensible. La conversion préserve le texte et la structure de base des paragraphes. Les mises en page complexes — colonnes multiples, tableaux intégrés, pages de couverture très formatées — peuvent nécessiter un ajustement manuel après conversion.\n\nPour de meilleurs résultats, utilisez des PDF créés à partir de documents Word plutôt que des documents numérisés. EverydayTools Hub est gratuit, sans inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert a PDF to Word online for free?", a: "Upload your PDF file to EverydayTools Hub PDF to Word Converter and click Convert. The tool runs entirely in your browser, extracting the text from each page and building a DOCX file you can download instantly. No account, no payment, no file size limit beyond 50 MB." },
        { q: "Is the PDF to Word conversion done in my browser or on a server?", a: "All conversion happens entirely in your browser using JavaScript. Your PDF file is never uploaded to any server. This means your data stays private, and the tool works even without an internet connection after the first page load." },
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
    relatedTools: ["pdf-to-word", "pdf-to-html", "txt-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF. Files up to 50 MB are supported." },
        { name: "Extract text automatically", text: "PDF.js parses every page in your browser and extracts all text content in reading order." },
        { name: "Download as TXT", text: "Click Convert. A plain .txt file containing all extracted text downloads to your device." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier PDF. Jusqu'à 50 Mo." },
        { name: "Extraction automatique", text: "PDF.js analyse chaque page dans votre navigateur et extrait tout le contenu textuel dans l'ordre de lecture." },
        { name: "Téléchargez en TXT", text: "Cliquez sur Convertir. Un fichier .txt contenant tout le texte extrait se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "EverydayTools Hub PDF to Text Converter extracts every text element from a PDF and outputs a clean, plain-text TXT file — all inside your browser, with no server uploads and no account required.\n\nPDF files store content as positioned visual objects rather than flowing text. The PDF to Text Converter uses PDF.js to parse the binary structure of the file, identify text tokens, and reconstruct them in reading order across all pages. The result is a flat text file suitable for copy-pasting, analysis, archiving, or importing into text-based systems.\n\nText extraction works best on PDFs created digitally (from Word, InDesign, LaTeX, or similar tools). Scanned PDFs — where pages are stored as images — do not contain extractable text layers; for these, an OCR (optical character recognition) step is required, which is outside the scope of this tool.\n\nCommon use cases include extracting content from research papers, e-books, reports, or legal documents for further analysis or editing. Use the related PDF to Word converter if you need a fully formatted editable document rather than plain text. EverydayTools Hub is free, no signup required.",
      fr: "Le convertisseur PDF en Texte d'EverydayTools Hub extrait tous les éléments textuels d'un PDF et produit un fichier TXT brut — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes fichiers PDF stockent le contenu sous forme d'objets visuels positionnés plutôt que de texte continu. Le convertisseur utilise PDF.js pour analyser la structure binaire du fichier, identifier les jetons de texte et les reconstruire dans l'ordre de lecture sur toutes les pages.\n\nL'extraction de texte fonctionne mieux sur les PDF créés numériquement (depuis Word, InDesign, LaTeX, etc.). Les PDF numérisés — où les pages sont des images — ne contiennent pas de couche de texte extractible ; une étape de reconnaissance optique de caractères (OCR) serait nécessaire pour ces fichiers.\n\nUtilisez le convertisseur PDF en Word associé si vous souhaitez un document formaté plutôt que du texte brut. EverydayTools Hub est gratuit, sans inscription.",
    },
    faqs: {
      en: [
        { q: "How do I extract text from a PDF for free?", a: "Upload your PDF to the PDF to Text Converter on EverydayTools Hub and click Convert. The tool runs in your browser, extracts all text from every page, and lets you download a plain TXT file. No software to install, no account to create." },
        { q: "Does this tool work with scanned PDFs?", a: "No. Scanned PDFs contain images of pages rather than actual text data. PDF to Text extraction only works on PDFs that were created digitally (for example, exported from Word or generated by a printer driver). For scanned PDFs, you need an OCR tool." },
        { q: "Is the extracted text in the correct reading order?", a: "For most standard PDFs, yes. PDF.js reconstructs text tokens in reading order across pages. Complex layouts — such as multi-column documents, footnotes, or side-by-side tables — may have text from different columns interleaved. Manual cleanup may be needed for such documents." },
        { q: "Can I extract text from a specific page range?", a: "The current version extracts text from all pages. To extract from specific pages only, split your PDF first using the Split PDF tool, then run the text extraction on the resulting file." },
        { q: "What happens to my PDF after conversion?", a: "Nothing is stored or transmitted. The entire conversion runs in your browser's memory. Once you close the tab or navigate away, the file data is gone. EverydayTools Hub never sees your documents." },
        { q: "Is PDF to Text Converter free?", a: "Yes. EverydayTools Hub PDF to Text Converter is completely free with no usage limits, no account needed, and no watermarks on the output. It will remain free." },
      ],
      fr: [
        { q: "Comment extraire du texte d'un PDF gratuitement ?", a: "Téléversez votre PDF dans le convertisseur PDF en Texte d'EverydayTools Hub et cliquez sur Convertir. L'outil s'exécute dans votre navigateur, extrait le texte de chaque page et vous permet de télécharger un fichier TXT. Sans logiciel, sans compte." },
        { q: "Cet outil fonctionne-t-il avec les PDF numérisés ?", a: "Non. Les PDF numérisés contiennent des images de pages plutôt que des données textuelles. L'extraction ne fonctionne que sur les PDF créés numériquement (exportés depuis Word, LaTeX, etc.). Pour les PDF numérisés, un outil OCR est nécessaire." },
        { q: "Le texte extrait respecte-t-il l'ordre de lecture ?", a: "Pour la plupart des PDF standards, oui. PDF.js reconstruit les jetons de texte dans l'ordre de lecture. Les mises en page complexes (documents multi-colonnes, notes de bas de page, tableaux côte à côte) peuvent donner un texte entremêlé nécessitant une correction manuelle." },
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
    relatedTools: ["pdf-to-text", "pdf-to-word", "html-to-pdf"],
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
      en: "EverydayTools Hub PDF to HTML Converter turns PDF content into clean HTML markup — directly in your browser, with no server uploads and no account needed.\n\nThe tool uses PDF.js to parse each page of the PDF, extract text elements, and structure them as HTML paragraphs. This makes it straightforward to publish PDF content on a website, blog, or content management system without manual copy-pasting.\n\nThe generated HTML preserves the text content and basic paragraph structure. Unlike dedicated desktop converters, browser-based PDF to HTML conversion does not attempt to replicate exact visual layouts, tables, or embedded images — it focuses on producing clean, readable HTML that can be styled with CSS. For complex documents with heavy formatting, manual HTML editing may be needed.\n\nCommon use cases include converting PDF reports, whitepapers, or documentation into web-publishable content. To convert in the other direction, use the HTML to PDF converter. EverydayTools Hub is free, no signup required, and all processing is done in your browser for maximum privacy.",
      fr: "Le convertisseur PDF en HTML d'EverydayTools Hub transforme le contenu d'un PDF en code HTML propre — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nL'outil utilise PDF.js pour analyser chaque page du PDF, extraire les éléments textuels et les structurer en paragraphes HTML. Cela facilite la publication du contenu d'un PDF sur un site web, un blog ou un CMS sans copier-coller manuel.\n\nLe HTML généré préserve le contenu textuel et la structure de base des paragraphes. La conversion navigateur ne tente pas de reproduire les mises en page exactes, les tableaux ou les images intégrées — elle produit un HTML lisible et stylable avec CSS.\n\nPour convertir dans l'autre sens, utilisez le convertisseur HTML en PDF. EverydayTools Hub est gratuit, sans inscription, et tout le traitement est effectué dans votre navigateur.",
    },
    faqs: {
      en: [
        { q: "How do I convert a PDF to HTML online for free?", a: "Upload your PDF to the PDF to HTML Converter on EverydayTools Hub and click Convert. The tool parses the PDF in your browser, extracts the text into HTML paragraphs, and lets you download the HTML file — no account, no upload to a server." },
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
    relatedTools: ["pdf-to-word", "word-to-epub", "pdf-to-text"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF file. Files up to 50 MB are supported." },
        { name: "Extract and package", text: "The tool extracts text from each page in your browser and packages it into a valid EPUB 3 e-book container." },
        { name: "Download the EPUB", text: "Click Convert. Your .epub file downloads and can be opened on any e-reader, Kindle (via calibre), or reading app." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Extraction et emballage", text: "L'outil extrait le texte de chaque page dans votre navigateur et l'empaquète dans un conteneur EPUB 3 valide." },
        { name: "Téléchargez l'EPUB", text: "Cliquez sur Convertir. Votre fichier .epub se télécharge et peut être ouvert sur n'importe quelle liseuse ou application de lecture." },
      ],
    },
    about: {
      en: "EverydayTools Hub PDF to EPUB Converter transforms PDF documents into reflowable EPUB e-books — entirely in your browser, without uploading files to any server.\n\nThe EPUB format (Electronic Publication) is the standard for e-books and is supported by virtually all e-readers — Kobo, Nook, Apple Books, and reading apps like Moon+ Reader. Unlike PDF, which locks content into fixed pages, EPUB text reflows to fit any screen size, making it far more comfortable to read on small devices.\n\nThe converter extracts text from each PDF page using PDF.js, then packages it into a valid EPUB 3 file using the epub-gen-memory library. The output is a properly structured EPUB with metadata, spine, and content files inside a ZIP container.\n\nFor Kindle users, note that Kindle natively supports EPUB on devices running firmware 5.16.2.1 or later. For older Kindles, convert the EPUB to MOBI format using Calibre (free desktop app). Use the related Word to EPUB converter for DOCX-based documents. EverydayTools Hub is free, no signup required.",
      fr: "Le convertisseur PDF en EPUB d'EverydayTools Hub transforme des documents PDF en e-books EPUB à flux dynamique — entièrement dans votre navigateur, sans téléchargement à un serveur.\n\nLe format EPUB (Electronic Publication) est le standard des livres numériques, supporté par pratiquement toutes les liseuses — Kobo, Nook, Apple Books et applications comme Moon+ Reader. Contrairement au PDF, qui verrouille le contenu en pages fixes, le texte EPUB s'adapte à n'importe quelle taille d'écran.\n\nLe convertisseur extrait le texte de chaque page PDF avec PDF.js, puis l'empaquète dans un fichier EPUB 3 valide. Le résultat est un EPUB structuré avec métadonnées, spine et fichiers de contenu dans un conteneur ZIP.\n\nPour les utilisateurs Kindle, notez que Kindle supporte nativement l'EPUB depuis le firmware 5.16.2.1. Pour les anciens Kindle, convertissez l'EPUB en MOBI avec Calibre. EverydayTools Hub est gratuit, sans inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert a PDF to EPUB online for free?", a: "Upload your PDF to EverydayTools Hub PDF to EPUB Converter and click Convert. The tool runs in your browser, extracts the text, packages it as EPUB, and lets you download the file instantly — no account, no server upload." },
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
    relatedTools: ["pdf-to-word", "pdf-merge", "pdf-split"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your PDF. Files up to 50 MB are supported." },
        { name: "Compress in the browser", text: "pdf-lib reprocesses the PDF content in your browser, removing redundant data and optimising the internal structure." },
        { name: "Download the compressed PDF", text: "Click Compress. Your smaller PDF downloads instantly — the same content, less space." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF. Jusqu'à 50 Mo acceptés." },
        { name: "Compression dans le navigateur", text: "pdf-lib retraite le contenu du PDF dans votre navigateur, supprimant les données redondantes et optimisant la structure interne." },
        { name: "Téléchargez le PDF compressé", text: "Cliquez sur Compresser. Votre PDF allégé se télécharge instantanément — même contenu, moins d'espace." },
      ],
    },
    about: {
      en: "EverydayTools Hub Compress PDF tool reduces the file size of PDF documents directly in your browser, using the pdf-lib library — no server uploads, no account, completely free.\n\nLarge PDF files can be problematic for email attachments, website uploads, and cloud storage. The compressor reprocesses the PDF's internal structure, removing redundant cross-reference tables, duplicate font data, and unused resources that accumulate when PDFs are created or modified multiple times.\n\nThe level of compression depends on the content of the original PDF. PDFs consisting primarily of text typically see modest reductions. PDFs with many embedded images often see the largest size reductions, as image streams can be re-encoded more efficiently. The tool targets structure-level compression without degrading visual quality.\n\nFor the maximum compression, consider using our companion tools: Merge PDFs to consolidate related documents, or Split PDF to work with only the pages you need. EverydayTools Hub is completely free, browser-based, and requires no signup. Your files never leave your device.",
      fr: "L'outil Compresser PDF d'EverydayTools Hub réduit la taille des fichiers PDF directement dans votre navigateur, en utilisant la bibliothèque pdf-lib — sans envoi à un serveur, sans compte, entièrement gratuit.\n\nLes PDF volumineux peuvent poser problème pour les pièces jointes par e-mail, les téléchargements sur des sites web et le stockage en ligne. Le compresseur retraite la structure interne du PDF, supprimant les tableaux de références croisées redondants, les données de polices dupliquées et les ressources inutilisées.\n\nLe niveau de compression dépend du contenu du PDF original. Les PDF principalement textuels voient des réductions modestes. Les PDF avec de nombreuses images intégrées voient souvent les plus grandes réductions de taille.\n\nEverydayTools Hub est entièrement gratuit, basé sur le navigateur et ne nécessite aucune inscription. Vos fichiers ne quittent jamais votre appareil.",
    },
    faqs: {
      en: [
        { q: "How do I compress a PDF for free online?", a: "Upload your PDF to EverydayTools Hub Compress PDF tool and click Compress. The tool reduces the file size by optimising the PDF's internal structure in your browser — no server upload, no account required. The compressed file downloads in seconds." },
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
    relatedTools: ["pdf-split", "pdf-compress", "pdf-rotate"],
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
      en: "EverydayTools Hub Merge PDF tool combines multiple PDF files into a single document — entirely in your browser, with no server uploads and no account required.\n\nMerging PDFs is a common task when compiling reports, assembling application packages, combining scanned documents, or creating presentation portfolios. The tool uses pdf-lib to read each uploaded PDF, extract its pages, and write them sequentially into a new PDF document.\n\nUp to 20 PDF files can be merged in one operation. The order can be adjusted by dragging files in the upload list before merging. All PDF metadata from individual files is replaced with fresh metadata in the output.\n\nFor the inverse operation, use the Split PDF tool to divide a merged document back into individual pages or sections. The Compress PDF tool can then reduce the size of the resulting merged file. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Fusionner PDFs d'EverydayTools Hub combine plusieurs fichiers PDF en un seul document — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa fusion de PDF est une tâche courante lors de la compilation de rapports, de l'assemblage de dossiers de candidature, de la combinaison de documents numérisés ou de la création de portfolios de présentation. L'outil utilise pdf-lib pour lire chaque PDF téléversé, extraire ses pages et les écrire séquentiellement dans un nouveau document PDF.\n\nJusqu'à 20 fichiers PDF peuvent être fusionnés en une seule opération. L'ordre peut être ajusté en faisant glisser les fichiers avant la fusion. Utilisez l'outil Diviser PDF pour l'opération inverse. EverydayTools Hub est gratuit, basé sur le navigateur, sans inscription.",
    },
    faqs: {
      en: [
        { q: "How do I merge PDF files online for free?", a: "Upload your PDF files to EverydayTools Hub Merge PDF tool, arrange them in the desired order, and click Merge. The combined PDF downloads in seconds — no server upload, no account required." },
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
    relatedTools: ["pdf-merge", "pdf-compress", "pdf-rotate"],
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
      en: "EverydayTools Hub Split PDF tool divides a PDF document into individual pages or custom page ranges — entirely in your browser, with no server uploads and no account required.\n\nSplitting PDFs is useful when you need to extract specific chapters from an e-book, separate pages from a batch-scanned document, share only part of a report, or reduce a large PDF to a manageable subset. The tool uses pdf-lib to read the source PDF and write the specified pages into new PDF files.\n\nYou can split all pages into individual one-page PDFs, or define custom ranges to group pages together. Output files are packaged in a ZIP archive for convenient download.\n\nFor the inverse operation, use the Merge PDF tool to combine individual files back into one. The Compress PDF tool can reduce the size of split sections. EverydayTools Hub is free, browser-based, and no signup is required. Your files never leave your device.",
      fr: "L'outil Diviser PDF d'EverydayTools Hub divise un document PDF en pages individuelles ou en plages de pages personnalisées — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa division de PDF est utile pour extraire des chapitres spécifiques d'un e-book, séparer des pages d'un document numérisé par lots, partager uniquement une partie d'un rapport, ou réduire un grand PDF à un sous-ensemble gérable.\n\nVous pouvez diviser toutes les pages en PDF d'une seule page, ou définir des plages personnalisées pour regrouper des pages. Les fichiers de sortie sont compressés dans une archive ZIP pour un téléchargement pratique.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription. Vos fichiers ne quittent jamais votre appareil.",
    },
    faqs: {
      en: [
        { q: "How do I split a PDF into separate pages online for free?", a: "Upload your PDF to EverydayTools Hub Split PDF, choose 'All pages' to extract each page as an individual PDF, and click Split. A ZIP archive with all the individual pages downloads to your device — no account, no server upload." },
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
    relatedTools: ["pdf-merge", "pdf-split", "pdf-compress"],
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
      en: "EverydayTools Hub Rotate PDF tool corrects page orientations in PDF documents — all in your browser, with no server uploads and no account required.\n\nWrongly oriented PDF pages are common when scanning documents on flatbed scanners, when combining pages from different sources, or when printing to PDF from rotated content. The Rotate PDF tool uses pdf-lib to apply rotation metadata to each specified page, producing a corrected PDF in seconds.\n\nRotation values of 90°, 180°, and 270° clockwise are supported. You can rotate all pages at once or target individual pages by number. The rotation is applied as PDF page rotation metadata, not as a re-rendering of the content, which means text remains fully selectable and the file quality is unchanged.\n\nFor related tasks, use the Split PDF tool to isolate pages that need rotation, rotate them, then merge back using the Merge PDF tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Pivoter PDF d'EverydayTools Hub corrige l'orientation des pages dans les documents PDF — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes pages PDF mal orientées sont fréquentes lors de la numérisation sur des scanners à plat, lors de la combinaison de pages provenant de différentes sources, ou lors de l'impression en PDF à partir de contenu pivoté. L'outil utilise pdf-lib pour appliquer des métadonnées de rotation à chaque page spécifiée.\n\nLes valeurs de rotation de 90°, 180° et 270° dans le sens des aiguilles d'une montre sont prises en charge. Vous pouvez faire pivoter toutes les pages à la fois ou cibler des pages individuelles par numéro. La rotation est appliquée comme métadonnées de rotation PDF, donc le texte reste sélectionnable.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I rotate PDF pages online for free?", a: "Upload your PDF to EverydayTools Hub Rotate PDF, select the rotation angle (90°, 180°, or 270°), choose all pages or specific ones, and click Rotate. The corrected PDF downloads in seconds — no account required." },
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
    relatedTools: ["pdf-protect", "pdf-to-word", "pdf-compress"],
    howItWorks: {
      en: [
        { name: "Upload your PDF", text: "Click the upload area or drag your locked PDF. The PDF must not require a password to open." },
        { name: "Remove restrictions", text: "pdf-lib processes the PDF in your browser and removes owner-level restriction metadata." },
        { name: "Download the unlocked PDF", text: "Click Unlock. Your PDF without restrictions downloads immediately." },
      ],
      fr: [
        { name: "Téléversez votre PDF", text: "Cliquez sur la zone de dépôt ou faites glisser votre PDF verrouillé. Le PDF ne doit pas nécessiter de mot de passe pour s'ouvrir." },
        { name: "Suppression des restrictions", text: "pdf-lib traite le PDF dans votre navigateur et supprime les métadonnées de restriction au niveau propriétaire." },
        { name: "Téléchargez le PDF déverrouillé", text: "Cliquez sur Déverrouiller. Votre PDF sans restrictions se télécharge immédiatement." },
      ],
    },
    about: {
      en: "EverydayTools Hub Unlock PDF tool removes owner-level password restrictions from PDF files — entirely in your browser, with no server uploads and no account required.\n\nPDF documents can be protected in two ways: with a user password (required to open the file) and an owner password (restricts editing, copying, and printing). The Unlock PDF tool targets owner restrictions — it can remove editing and copy locks from PDFs that do not require a password to open.\n\nThis is useful when you receive a PDF that you are authorised to use but the creator has set restrictions unnecessarily, or when you need to make changes to a PDF you created yourself but no longer have the owner password for.\n\nNote: This tool is intended for use with PDFs you own or have permission to modify. It cannot bypass user (open) passwords — for those, you must know the correct password. Use the Protect PDF tool to add your own password protection to a PDF. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Déverrouiller PDF d'EverydayTools Hub supprime les restrictions de mot de passe propriétaire des fichiers PDF — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes documents PDF peuvent être protégés de deux façons : avec un mot de passe utilisateur (requis pour ouvrir le fichier) et un mot de passe propriétaire (restreint l'édition, la copie et l'impression). L'outil cible les restrictions propriétaires — il peut supprimer les verrous d'édition et de copie des PDF qui ne nécessitent pas de mot de passe pour s'ouvrir.\n\nCet outil est destiné à être utilisé avec des PDF que vous possédez ou pour lesquels vous avez l'autorisation de les modifier. Il ne peut pas contourner les mots de passe utilisateur.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I remove a PDF password online for free?", a: "Upload your PDF to EverydayTools Hub Unlock PDF. If the PDF has owner restrictions (but no open password), click Unlock and the unrestricted PDF downloads to your device. No account or server upload needed." },
        { q: "What is the difference between a user password and an owner password?", a: "A user password (open password) is required to open and view the PDF — you must know it to access the content. An owner password restricts what viewers can do with an already-opened PDF (editing, copying, printing). The Unlock PDF tool removes owner restrictions only." },
        { q: "Can this tool bypass a password-protected PDF I can't open?", a: "No. If the PDF requires a password to open (user password), this tool cannot bypass it. You must know the correct password. The tool only removes owner-level restrictions from PDFs that open without a password." },
        { q: "Is it legal to unlock a PDF?", a: "It depends on the context. Unlocking a PDF you own, created yourself, or have explicit permission to modify is generally legal. Bypassing restrictions on copyrighted material you are not authorised to copy may violate copyright law and the PDF creator's terms. Use this tool responsibly." },
        { q: "Will unlocking affect the content of my PDF?", a: "No. Unlocking only removes restriction metadata. The visual content, text, images, and file structure are unchanged." },
        { q: "Is Unlock PDF free?", a: "Yes. EverydayTools Hub Unlock PDF is completely free, with no account required and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment supprimer un mot de passe PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Déverrouiller PDF d'EverydayTools Hub. Si le PDF a des restrictions propriétaires (mais pas de mot de passe d'ouverture), cliquez sur Déverrouiller et le PDF sans restrictions se télécharge. Sans compte, sans envoi serveur." },
        { q: "Quelle est la différence entre un mot de passe utilisateur et un mot de passe propriétaire ?", a: "Un mot de passe utilisateur est requis pour ouvrir et visualiser le PDF. Un mot de passe propriétaire restreint ce que les lecteurs peuvent faire avec un PDF déjà ouvert (édition, copie, impression). L'outil Déverrouiller PDF supprime uniquement les restrictions propriétaires." },
        { q: "Cet outil peut-il contourner un PDF protégé que je ne peux pas ouvrir ?", a: "Non. Si le PDF nécessite un mot de passe pour s'ouvrir (mot de passe utilisateur), cet outil ne peut pas le contourner. Vous devez connaître le mot de passe correct." },
        { q: "Est-il légal de déverrouiller un PDF ?", a: "Cela dépend du contexte. Déverrouiller un PDF que vous possédez, que vous avez créé vous-même ou pour lequel vous avez une autorisation explicite est généralement légal. Utilisez cet outil de manière responsable." },
        { q: "Le déverrouillage affectera-t-il le contenu de mon PDF ?", a: "Non. Le déverrouillage ne supprime que les métadonnées de restriction. Le contenu visuel, le texte, les images et la structure du fichier sont inchangés." },
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
    relatedTools: ["pdf-unlock", "pdf-to-word", "metadata-cleaner"],
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
      en: "EverydayTools Hub Protect PDF tool encrypts PDF documents with a password — directly in your browser, with no server uploads and no account required.\n\nPassword-protecting a PDF restricts access to authorised recipients only, making it essential for sharing sensitive documents such as contracts, financial statements, medical records, or personal correspondence. The tool uses AES-256 encryption via pdf-lib, which is the strongest encryption level supported by the PDF specification.\n\nThe protected PDF requires the password to be entered before it can be opened in any PDF reader. Note that the password you set is used as the encryption key — EverydayTools Hub does not store or transmit your password or your file at any point.\n\nTo remove protection later, use the Unlock PDF tool with the correct password. For stripping document metadata instead of adding encryption, use the Metadata Cleaner tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Protéger PDF d'EverydayTools Hub chiffre les documents PDF avec un mot de passe — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa protection d'un PDF par mot de passe restreint l'accès aux seuls destinataires autorisés, ce qui est essentiel pour partager des documents sensibles tels que des contrats, des relevés financiers, des dossiers médicaux ou de la correspondance personnelle. L'outil utilise le chiffrement AES-256 via pdf-lib.\n\nLe PDF protégé nécessite que le mot de passe soit saisi avant de pouvoir être ouvert dans n'importe quel lecteur PDF. EverydayTools Hub ne stocke ni ne transmet votre mot de passe ou votre fichier à aucun moment.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I add a password to a PDF online for free?", a: "Upload your PDF to EverydayTools Hub Protect PDF, enter the password you want, and click Protect. The encrypted PDF downloads immediately — no server upload, no account required." },
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
    relatedTools: ["pdf-watermark", "pdf-merge", "pdf-rotate"],
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
      en: "EverydayTools Hub Add Page Numbers to PDF tool stamps sequential page numbers on every page of a PDF document — directly in your browser, with no server uploads and no account required.\n\nPage numbering is essential for professional documents such as reports, theses, contracts, and manuals, making it easy for readers to reference specific sections. The tool uses pdf-lib to overlay text on each page at the specified position, using the Helvetica font at the chosen size.\n\nYou can customise the starting number (useful when combining a numbered document with others), the position on the page (bottom center, bottom right, bottom left, top center), and the font size. Numbers are added as PDF text objects, which means they are fully searchable and printable.\n\nTo add a custom text watermark instead, use the Watermark PDF tool. For combining multiple numbered documents, use Merge PDF. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Ajouter des Numéros de Page d'EverydayTools Hub estampille des numéros de page séquentiels sur chaque page d'un document PDF — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa numérotation des pages est essentielle pour les documents professionnels tels que les rapports, thèses, contrats et manuels. L'outil utilise pdf-lib pour superposer du texte sur chaque page à la position spécifiée, en utilisant la police Helvetica à la taille choisie.\n\nVous pouvez personnaliser le numéro de départ, la position sur la page (bas centre, bas droite, bas gauche, haut centre) et la taille de la police. Les numéros sont ajoutés en tant qu'objets texte PDF, ce qui signifie qu'ils sont entièrement recherchables et imprimables.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I add page numbers to a PDF online for free?", a: "Upload your PDF to EverydayTools Hub Add Page Numbers tool, select the position and starting number, and click Add Page Numbers. Your numbered PDF downloads instantly — no account required." },
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
    relatedTools: ["pdf-page-numbers", "pdf-protect", "pdf-compress"],
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
      en: "EverydayTools Hub Watermark PDF tool stamps a custom text watermark on every page of a PDF document — directly in your browser, with no server uploads and no account required.\n\nWatermarks are used to mark documents as drafts, indicate confidentiality, discourage unauthorised reproduction, or brand documents with an organisation name. Common watermark texts include 'DRAFT', 'CONFIDENTIAL', 'COPY', 'SAMPLE', or a company name.\n\nThe tool uses pdf-lib to overlay semi-transparent rotated text on each page. You can control the watermark text, font size, opacity (from subtle to prominent), and diagonal angle. The watermark is rendered at the page centre by default.\n\nFor adding only page numbers rather than custom text, use the Add Page Numbers to PDF tool. For encryption-based document protection, use the Protect PDF tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Filigrane PDF d'EverydayTools Hub estampille un filigrane texte personnalisé sur chaque page d'un document PDF — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes filigranes sont utilisés pour marquer les documents comme des brouillons, indiquer la confidentialité, décourager la reproduction non autorisée ou apposer une marque d'organisation. Les textes de filigrane courants incluent 'BROUILLON', 'CONFIDENTIEL', 'COPIE', 'ÉCHANTILLON' ou le nom d'une entreprise.\n\nL'outil utilise pdf-lib pour superposer du texte semi-transparent pivoté sur chaque page. Vous pouvez contrôler le texte, la taille de police, l'opacité et l'angle.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I add a watermark to a PDF online for free?", a: "Upload your PDF to EverydayTools Hub Watermark PDF, type your watermark text (e.g., 'CONFIDENTIAL'), set the opacity and angle, and click Add Watermark. The watermarked PDF downloads instantly — no account required." },
        { q: "Can I choose the position and size of the watermark?", a: "You can set the font size and rotation angle. The watermark is centered on each page by default, which is the standard position for document watermarks. Full custom positioning (top, bottom, corner) is not currently supported." },
        { q: "Is the watermark visible on every page?", a: "Yes. The tool applies the watermark to every page of the document. If you want to watermark only specific pages, split the PDF first, watermark those pages, then merge back." },
        { q: "Can the watermark be removed by the recipient?", a: "Text watermarks added by pdf-lib are embedded PDF text objects. They can be removed in advanced PDF editors like Adobe Acrobat Pro. For documents requiring tamper-proof watermarks, consider additional access controls." },
        { q: "What opacity should I use for a 'DRAFT' watermark?", a: "An opacity of 20–30% is typical for a subtle background watermark. For a more prominent notice, 40–50% is readable without obscuring the underlying content too much. Avoid opacity above 60% as it can make the document difficult to read." },
        { q: "Is Watermark PDF free?", a: "Yes. EverydayTools Hub Watermark PDF is completely free, with no account required and no additional watermarks from EverydayTools Hub itself." },
      ],
      fr: [
        { q: "Comment ajouter un filigrane à un PDF gratuitement en ligne ?", a: "Téléversez votre PDF dans l'outil Filigrane PDF d'EverydayTools Hub, tapez votre texte de filigrane (ex. 'CONFIDENTIEL'), définissez l'opacité et l'angle, et cliquez sur Ajouter un filigrane. Le PDF filigrané se télécharge instantanément." },
        { q: "Puis-je choisir la position et la taille du filigrane ?", a: "Vous pouvez définir la taille de police et l'angle de rotation. Le filigrane est centré sur chaque page par défaut, ce qui est la position standard pour les filigranes de documents." },
        { q: "Le filigrane est-il visible sur chaque page ?", a: "Oui. L'outil applique le filigrane à chaque page du document. Pour ne filigraner que des pages spécifiques, divisez d'abord le PDF, filigranez ces pages, puis fusionnez." },
        { q: "Le filigrane peut-il être supprimé par le destinataire ?", a: "Les filigranes texte ajoutés par pdf-lib sont des objets texte PDF intégrés. Ils peuvent être supprimés dans des éditeurs PDF avancés comme Adobe Acrobat Pro." },
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
    relatedTools: ["pdf-to-text", "word-to-html", "txt-to-docx"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file. .docx format is supported." },
        { name: "Extract text", text: "Mammoth.js parses the DOCX structure in your browser and extracts all text content." },
        { name: "Download as TXT", text: "Click Convert. A plain .txt file downloads to your device." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word. Le format .docx est supporté." },
        { name: "Extraction du texte", text: "Mammoth.js analyse la structure DOCX dans votre navigateur et en extrait tout le contenu textuel." },
        { name: "Téléchargez en TXT", text: "Cliquez sur Convertir. Un fichier .txt brut se télécharge sur votre appareil." },
      ],
    },
    about: {
      en: "EverydayTools Hub Word to Text Converter extracts the plain text content from Word (DOCX) files — directly in your browser, with no server uploads and no account required.\n\nDOCX files are ZIP archives containing XML, images, and formatting data. The converter uses Mammoth.js to parse the DOCX XML structure and extract all textual content, stripping formatting, styles, headers, footers, and embedded objects to produce clean plain text.\n\nThis is useful for content analysis, data processing pipelines, archiving text from Word documents, or feeding DOCX content into tools that expect plain text. The output preserves paragraph breaks but removes all font styling, tables, and page layout.\n\nFor a more structured output that preserves some formatting as HTML, use the Word to HTML converter. For creating new Word documents from plain text, use the Text to Word converter. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Word en Texte d'EverydayTools Hub extrait le contenu textuel brut des fichiers Word (DOCX) — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes fichiers DOCX sont des archives ZIP contenant du XML, des images et des données de mise en forme. Le convertisseur utilise Mammoth.js pour analyser la structure XML du DOCX et en extraire tout le contenu textuel, en supprimant la mise en forme, les styles, les en-têtes, les pieds de page et les objets intégrés.\n\nCela est utile pour l'analyse de contenu, les pipelines de traitement de données, l'archivage de texte provenant de documents Word ou l'alimentation de contenu DOCX dans des outils qui attendent du texte brut.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I extract text from a Word document for free?", a: "Upload your DOCX file to EverydayTools Hub Word to Text Converter and click Convert. The tool uses Mammoth.js in your browser to extract all text, and you can download the result as a TXT file — no account, no server upload." },
        { q: "Does the converter support .doc files as well as .docx?", a: "The converter supports the modern .docx format (Word 2007 and later). Older .doc files from Word 97–2003 are not supported. To convert a .doc file, open it in Microsoft Word or LibreOffice and save it as .docx first." },
        { q: "Will the formatting be preserved in the text output?", a: "No. The Word to Text output is plain text with paragraph breaks only. Font styles, bold, italic, tables, images, and page layout are stripped. This is by design — plain text has no concept of formatting." },
        { q: "Are images in the Word document included in the output?", a: "No. Images are binary objects embedded in the DOCX and cannot be represented in plain text. Only text content from paragraphs, headings, and text boxes is extracted." },
        { q: "What is the maximum file size?", a: "The converter accepts DOCX files up to 50 MB. Most Word documents are well under this limit unless they contain many embedded images." },
        { q: "Is Word to Text Converter free?", a: "Yes. EverydayTools Hub Word to Text Converter is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment extraire du texte d'un document Word gratuitement ?", a: "Téléversez votre fichier DOCX dans le convertisseur Word en Texte d'EverydayTools Hub et cliquez sur Convertir. L'outil utilise Mammoth.js dans votre navigateur pour extraire tout le texte." },
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
    relatedTools: ["pdf-to-html", "word-to-text", "html-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file into the drop zone." },
        { name: "Convert to HTML", text: "Mammoth.js converts the DOCX XML structure to semantic HTML in your browser, preserving headings, bold, and lists." },
        { name: "Download the HTML file", text: "Click Convert. An .html file downloads, ready to publish or edit." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word." },
        { name: "Conversion en HTML", text: "Mammoth.js convertit la structure XML du DOCX en HTML sémantique dans votre navigateur, préservant titres, gras et listes." },
        { name: "Téléchargez le fichier HTML", text: "Cliquez sur Convertir. Un fichier .html se télécharge, prêt à être publié ou édité." },
      ],
    },
    about: {
      en: "EverydayTools Hub Word to HTML Converter transforms Word (DOCX) documents into clean, semantic HTML — directly in your browser, with no server uploads and no account required.\n\nUnlike simply extracting text, Word to HTML preserves the document's semantic structure: headings become `<h1>`–`<h6>` elements, bold becomes `<strong>`, italic becomes `<em>`, and bulleted lists become `<ul>` elements. This makes the output ready for direct use in a website, CMS, or blog without manual reformatting.\n\nThe tool uses Mammoth.js, which is designed specifically for converting DOCX to clean HTML with a focus on semantic markup rather than layout reproduction. Images are not included in the HTML output — they would need to be extracted and referenced separately.\n\nFor converting in the reverse direction, use the HTML to PDF tool. EverydayTools Hub is free, browser-based, and no signup is required. Your documents never leave your device.",
      fr: "Le convertisseur Word en HTML d'EverydayTools Hub transforme des documents Word (DOCX) en HTML sémantique propre — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nContrairement à la simple extraction de texte, Word en HTML préserve la structure sémantique du document : les titres deviennent des éléments `<h1>`–`<h6>`, le gras devient `<strong>`, l'italique devient `<em>` et les listes à puces deviennent des éléments `<ul>`.\n\nL'outil utilise Mammoth.js, conçu spécifiquement pour convertir DOCX en HTML propre en mettant l'accent sur le balisage sémantique plutôt que sur la reproduction de la mise en page.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription. Vos documents ne quittent jamais votre appareil.",
    },
    faqs: {
      en: [
        { q: "How do I convert a Word document to HTML for free?", a: "Upload your DOCX to EverydayTools Hub Word to HTML Converter and click Convert. Mammoth.js converts the document structure to semantic HTML in your browser, and the HTML file downloads — no account or server upload needed." },
        { q: "Does the HTML output include Word styles and formatting?", a: "Semantic structure (headings, bold, italic, lists, links) is preserved. Visual styles (custom fonts, colors, complex layouts, text boxes, page borders) are not included. The output is clean semantic HTML without inline styles." },
        { q: "Are images from the Word document included?", a: "No. Images are not embedded in the HTML output. If your document has images you need in the web version, you will need to extract them separately and add `<img>` tags to the HTML manually." },
        { q: "Can I paste the HTML output directly into a CMS?", a: "Yes. The output is clean semantic HTML that can be pasted into the HTML/source view of WordPress, Drupal, Notion, or any CMS that accepts HTML input." },
        { q: "Does it support .doc files?", a: "Only the .docx format (Word 2007 and later) is supported. Open old .doc files in Microsoft Word or LibreOffice and save as .docx first." },
        { q: "Is Word to HTML Converter free?", a: "Yes. EverydayTools Hub Word to HTML Converter is completely free, with no account required and no usage limits." },
      ],
      fr: [
        { q: "Comment convertir un document Word en HTML gratuitement ?", a: "Téléversez votre DOCX dans le convertisseur Word en HTML d'EverydayTools Hub et cliquez sur Convertir. Mammoth.js convertit la structure du document en HTML sémantique dans votre navigateur." },
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
    relatedTools: ["pdf-to-epub", "word-to-text", "word-to-html"],
    howItWorks: {
      en: [
        { name: "Upload your DOCX", text: "Click the upload area or drag your Word file into the drop zone." },
        { name: "Convert to EPUB", text: "The tool extracts text from the DOCX in your browser and packages it into an EPUB 3 e-book file." },
        { name: "Download the EPUB", text: "Click Convert. Your .epub file downloads, ready to transfer to any e-reader." },
      ],
      fr: [
        { name: "Téléversez votre DOCX", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier Word." },
        { name: "Conversion en EPUB", text: "L'outil extrait le texte du DOCX dans votre navigateur et l'empaquète dans un fichier e-book EPUB 3." },
        { name: "Téléchargez l'EPUB", text: "Cliquez sur Convertir. Votre fichier .epub se télécharge, prêt à être transféré sur n'importe quelle liseuse." },
      ],
    },
    about: {
      en: "EverydayTools Hub Word to EPUB Converter transforms Word (DOCX) documents into reflowable EPUB e-books — entirely in your browser, with no server uploads and no account required.\n\nEPUB is the standard e-book format supported by Kobo, Nook, Apple Books, and most reading apps. Converting your Word documents to EPUB makes them comfortable to read on any screen size, since the text reflows to fit the device rather than being locked into fixed page dimensions.\n\nThe tool extracts text and basic structure from the DOCX using Mammoth.js, then packages it into a valid EPUB 3 container using epub-gen-memory. The process runs entirely in your browser — your documents never leave your device.\n\nFor Kindle users, Kindle devices running firmware 5.16.2.1 or later support EPUB natively. For converting the output to MOBI for older Kindles, use the free Calibre desktop app. EverydayTools Hub is free and no signup is required.",
      fr: "Le convertisseur Word en EPUB d'EverydayTools Hub transforme des documents Word (DOCX) en e-books EPUB à flux dynamique — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nL'EPUB est le format e-book standard supporté par Kobo, Nook, Apple Books et la plupart des applications de lecture. La conversion de vos documents Word en EPUB les rend confortables à lire sur n'importe quelle taille d'écran.\n\nL'outil extrait le texte et la structure de base du DOCX avec Mammoth.js, puis l'empaquète dans un conteneur EPUB 3 valide avec epub-gen-memory. Le processus s'exécute entièrement dans votre navigateur.\n\nEverydayTools Hub est gratuit et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert a Word document to EPUB for free?", a: "Upload your DOCX to EverydayTools Hub Word to EPUB Converter and click Convert. The tool extracts the text and packages it as EPUB 3 in your browser — no account, no server upload." },
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
    relatedTools: ["txt-to-pdf", "markdown-to-docx", "html-to-pdf"],
    howItWorks: {
      en: [
        { name: "Upload your Markdown file", text: "Click the upload area or drag your .md file into the drop zone." },
        { name: "Render to PDF", text: "The tool converts your Markdown to HTML using marked.js, then renders it as a PDF with print-quality styling." },
        { name: "Download the PDF", text: "Click Convert. Your PDF downloads with clean typographic formatting." },
      ],
      fr: [
        { name: "Téléversez votre fichier Markdown", text: "Cliquez sur la zone de dépôt ou faites glisser votre fichier .md." },
        { name: "Rendu en PDF", text: "L'outil convertit votre Markdown en HTML avec marked.js, puis le rendu en PDF avec un style de qualité impression." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF se télécharge avec une mise en forme typographique propre." },
      ],
    },
    about: {
      en: "EverydayTools Hub Markdown to PDF Converter renders Markdown documents as clean, printable PDFs — directly in your browser, with no server uploads and no account required.\n\nMarkdown is widely used by developers, technical writers, and note-takers for its simple, readable syntax. Converting Markdown to PDF makes it suitable for sharing, printing, and archiving with consistent formatting that doesn't rely on the recipient having a Markdown renderer.\n\nThe tool uses marked.js to convert the Markdown source to HTML, then applies clean print-quality CSS styling before generating the PDF. Common Markdown elements — headings, bold, italic, code blocks, blockquotes, links, and lists — are all rendered correctly.\n\nFor converting to a Word document instead, use the Markdown to Word converter. For plain text to PDF conversion, use the Text to PDF tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Markdown en PDF d'EverydayTools Hub rend des documents Markdown en PDF propres et imprimables — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLe Markdown est largement utilisé par les développeurs, les rédacteurs techniques et les preneurs de notes pour sa syntaxe simple et lisible. La conversion en PDF le rend adapté au partage, à l'impression et à l'archivage avec une mise en forme cohérente.\n\nL'outil utilise marked.js pour convertir la source Markdown en HTML, puis applique un style CSS propre de qualité impression avant de générer le PDF.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert Markdown to PDF for free?", a: "Upload your .md file to EverydayTools Hub Markdown to PDF Converter and click Convert. The tool renders your Markdown as a styled PDF in your browser and downloads the file — no account, no server upload." },
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
    relatedTools: ["markdown-to-pdf", "txt-to-docx", "word-to-text"],
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
      en: "EverydayTools Hub Markdown to Word Converter transforms Markdown documents into editable Word (DOCX) files — entirely in your browser, with no server uploads and no account required.\n\nMarkdown is excellent for writing, but collaborators often need a Word document for editing and review. This converter bridges that gap — write in Markdown, deliver in Word. The tool parses the Markdown source and rebuilds it as structured DOCX content using the docx library.\n\nHeadings, paragraphs, bold, italic, inline code, and lists are all correctly mapped to Word styles. The resulting DOCX file can be opened directly in Microsoft Word, Google Docs, LibreOffice, or any standard DOCX-compatible editor.\n\nFor PDF output from Markdown, use the Markdown to PDF converter. For converting in the reverse direction (Word to plain text), use the Word to Text tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Markdown en Word d'EverydayTools Hub transforme des documents Markdown en fichiers Word (DOCX) modifiables — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLe Markdown est excellent pour l'écriture, mais les collaborateurs ont souvent besoin d'un document Word pour l'édition et la révision. Ce convertisseur comble cette lacune — rédigez en Markdown, livrez en Word.\n\nLes titres, paragraphes, gras, italique, code en ligne et listes sont tous correctement mappés aux styles Word. Le fichier DOCX résultant peut être ouvert directement dans Word, Google Docs ou LibreOffice.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert Markdown to Word for free?", a: "Upload your .md file to EverydayTools Hub Markdown to Word Converter and click Convert. The tool builds a DOCX file from your Markdown in your browser and downloads it — no account, no server upload." },
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
    relatedTools: ["word-to-html", "pdf-to-html", "markdown-to-pdf"],
    howItWorks: {
      en: [
        { name: "Paste or upload your HTML", text: "Paste HTML code into the editor or upload an .html file." },
        { name: "Render to PDF", text: "The tool renders the HTML in a headless browser context and captures it as a PDF." },
        { name: "Download the PDF", text: "Click Convert. Your PDF with the rendered HTML content downloads immediately." },
      ],
      fr: [
        { name: "Collez ou téléversez votre HTML", text: "Collez du code HTML dans l'éditeur ou téléversez un fichier .html." },
        { name: "Rendu en PDF", text: "L'outil rend le HTML dans un contexte de navigateur sans interface et le capture en PDF." },
        { name: "Téléchargez le PDF", text: "Cliquez sur Convertir. Votre PDF avec le contenu HTML rendu se télécharge immédiatement." },
      ],
    },
    about: {
      en: "EverydayTools Hub HTML to PDF Converter turns HTML code into printable PDF documents — directly in your browser, with no server uploads and no account required.\n\nHTML to PDF conversion is useful for saving web content, generating print-friendly versions of pages, archiving online articles, creating invoices from HTML templates, or converting email templates to PDF for sharing.\n\nThe tool renders the HTML using the browser's native rendering engine, which means CSS styles, fonts, and basic layout are applied before generating the PDF. Inline styles and embedded CSS are supported. External resources (remote images, Google Fonts loaded over CDN) may not load in the conversion context.\n\nFor the reverse direction, use the PDF to HTML converter. For converting from Markdown rather than raw HTML, use the Markdown to PDF tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur HTML en PDF d'EverydayTools Hub transforme du code HTML en documents PDF imprimables — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa conversion HTML en PDF est utile pour sauvegarder du contenu web, générer des versions imprimables de pages, archiver des articles en ligne, créer des factures à partir de modèles HTML, ou convertir des modèles d'e-mail en PDF.\n\nL'outil rend le HTML en utilisant le moteur de rendu natif du navigateur, ce qui signifie que les styles CSS, les polices et la mise en page de base sont appliqués avant la génération du PDF.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert HTML to PDF online for free?", a: "Paste your HTML code or upload an .html file to EverydayTools Hub HTML to PDF Converter and click Convert. The tool renders the HTML as a PDF in your browser and downloads the file — no account required." },
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
    relatedTools: ["markdown-to-pdf", "txt-to-docx", "pdf-to-text"],
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
      en: "EverydayTools Hub Text to PDF Converter creates clean PDF documents from plain text files — directly in your browser, with no server uploads and no account required.\n\nPlain text files (.txt) lack formatting and are difficult to share professionally. Converting them to PDF gives them a consistent presentation — a fixed layout with readable typography that looks the same on every device and can be printed reliably.\n\nThe tool uses pdf-lib to lay out the text on PDF pages with margins and line breaks, producing a printable document. Long text files are automatically paginated across multiple pages.\n\nFor a more formatted output from Markdown syntax, use the Markdown to PDF converter. For creating Word documents from text, use the Text to Word converter. For the reverse operation (extracting text from a PDF), use the PDF to Text tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Texte en PDF d'EverydayTools Hub crée des documents PDF propres à partir de fichiers texte brut — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes fichiers texte brut (.txt) manquent de mise en forme et sont difficiles à partager de manière professionnelle. Les convertir en PDF leur donne une présentation cohérente — une mise en page fixe avec une typographie lisible.\n\nL'outil utilise pdf-lib pour disposer le texte sur des pages PDF avec des marges et des sauts de ligne, produisant un document imprimable. Les fichiers texte longs sont automatiquement paginés sur plusieurs pages.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert a text file to PDF for free?", a: "Upload your .txt file to EverydayTools Hub Text to PDF Converter and click Convert. The tool formats the text with clean typography and generates a PDF in your browser — no account required." },
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
    relatedTools: ["txt-to-pdf", "word-to-text", "markdown-to-docx"],
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
      en: "EverydayTools Hub Text to Word Converter creates editable Word (DOCX) documents from plain text files — directly in your browser, with no server uploads and no account required.\n\nPlain text files are widely used for storing content, code output, and log data, but they lack the formatting structure expected in professional documents. Converting to DOCX makes it easy to further format the content in Microsoft Word, Google Docs, or LibreOffice.\n\nThe tool uses the docx library to wrap text paragraphs into a structured DOCX container. Each paragraph in the text file becomes a Word paragraph. Line breaks are preserved. The output can be immediately opened and formatted as needed.\n\nFor creating PDFs from text instead, use the Text to PDF converter. For the reverse operation (extracting text from a Word document), use the Word to Text tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Texte en Word d'EverydayTools Hub crée des documents Word (DOCX) modifiables à partir de fichiers texte brut — directement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes fichiers texte brut sont largement utilisés pour stocker du contenu, des sorties de code et des données de journaux, mais ils manquent de la structure de mise en forme attendue dans les documents professionnels. La conversion en DOCX facilite la mise en forme ultérieure du contenu dans Word, Google Docs ou LibreOffice.\n\nL'outil utilise la bibliothèque docx pour encapsuler les paragraphes de texte dans un conteneur DOCX structuré. Chaque paragraphe du fichier texte devient un paragraphe Word.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert a text file to Word for free?", a: "Upload your .txt file to EverydayTools Hub Text to Word Converter and click Convert. The tool builds a DOCX document from your text in the browser and downloads it — no account required." },
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
    relatedTools: ["image-compress", "image-resize", "heic-to-jpg"],
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
      en: "EverydayTools Hub Image Format Converter converts images between all major formats — entirely in your browser, with no server uploads and no account required.\n\nDifferent contexts require different image formats. JPEG offers the best compression for photographs. PNG supports transparency and lossless compression for screenshots and graphics. WEBP is a modern format with superior compression that reduces web page load times. AVIF offers even better compression than WEBP. BMP and GIF formats are supported for legacy compatibility.\n\nThe conversion uses the HTML5 Canvas API, which is built into every modern browser. Up to 20 images can be converted in a single batch, with all output images available in a ZIP archive. No image data is transmitted to any server.\n\nFor reducing the file size of images after conversion, use the Compress Image tool. For changing image dimensions, use the Resize Image tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur de format image d'EverydayTools Hub convertit les images entre tous les formats principaux — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nDifférents contextes nécessitent différents formats d'image. JPEG offre la meilleure compression pour les photographies. PNG supporte la transparence et la compression sans perte pour les captures d'écran et graphiques. WEBP est un format moderne avec une compression supérieure. AVIF offre encore mieux que WEBP.\n\nLa conversion utilise l'API Canvas HTML5, intégrée dans chaque navigateur moderne. Jusqu'à 20 images peuvent être converties en un seul lot.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert an image format online for free?", a: "Upload your image(s) to EverydayTools Hub Image Converter, select the output format from the dropdown, and click Convert. The conversion happens in your browser and the files download — no account required, up to 20 images at once." },
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
    relatedTools: ["image-converter", "image-compress", "background-remover"],
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
      en: "EverydayTools Hub HEIC to JPG Converter converts iPhone and iPad photos from HEIC format to the universally compatible JPEG or PNG format — entirely in your browser, with no server uploads and no account required.\n\nHEIC (High Efficiency Image Container) is the default photo format on iPhones running iOS 11 and later. While HEIC offers about 50% better compression than JPEG at the same visual quality, it is not natively supported on Windows 10 (without the HEIC codec from the Microsoft Store), older versions of Android, or many web platforms and image editors.\n\nThe tool uses the heic2any library to decode the HEIC format entirely in your browser. No photo data is transmitted to any server, making it safe for personal and sensitive photos.\n\nFor further size reduction after conversion, use the Compress Image tool. For removing backgrounds from converted photos, use the Background Remover. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur HEIC en JPG d'EverydayTools Hub convertit les photos iPhone et iPad du format HEIC au format JPEG ou PNG universellement compatible — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nHEIC (High Efficiency Image Container) est le format de photo par défaut sur les iPhones fonctionnant sous iOS 11 et versions ultérieures. Bien que HEIC offre environ 50 % de meilleure compression que JPEG à la même qualité visuelle, il n'est pas nativement supporté sur Windows 10, les anciennes versions d'Android ou de nombreuses plateformes web.\n\nL'outil utilise la bibliothèque heic2any pour décoder le format HEIC entièrement dans votre navigateur. Aucune donnée photo n'est transmise à un serveur.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert HEIC to JPG for free?", a: "Upload your HEIC files to EverydayTools Hub HEIC to JPG Converter, select JPEG as the output format, and click Convert. The conversion happens entirely in your browser and the JPEG files download — no account, no server upload." },
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
    internalSlug: "image-compress",
    slugs: { en: "compress-image", fr: "compresser-image" },
    title: { en: "Compress Image Online Free — No Signup | EverydayTools Hub", fr: "Compresser Image en Ligne Gratuit — Sans Inscription | EverydayTools Hub" },
    h1: { en: "Compress Image", fr: "Compresser une Image" },
    description: { en: "Reduce image file size online for free in your browser. Adjust quality with a slider. No upload, no account, supports JPG, PNG, and WEBP.", fr: "Réduisez la taille des images en ligne gratuitement dans votre navigateur. Ajustez la qualité. Sans envoi, sans compte." },
    keywords: { en: ["compress image online free", "reduce image file size", "image compressor", "shrink image online", "jpeg compressor free", "png compressor online"], fr: ["compresser image en ligne gratuit", "réduire taille image", "compresseur image", "alléger image en ligne", "compresseur jpeg gratuit", "compresseur png en ligne"] },
    relatedTools: ["image-converter", "image-resize", "heic-to-jpg"],
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
      en: "EverydayTools Hub Compress Image tool reduces the file size of JPEG, PNG, and WEBP images using a quality slider — entirely in your browser, with no server uploads and no account required.\n\nLarge image files slow down websites, consume storage, and make file transfers slower. The compressor uses the HTML5 Canvas API to re-encode the image at a lower quality level. A quality of 80% typically reduces JPEG file sizes by 60–80% while maintaining visually acceptable quality for web use.\n\nThe quality slider goes from 1% (maximum compression, most quality loss) to 100% (lossless re-encoding). Most web images benefit from a quality setting of 70–85%. The tool displays the original and compressed file sizes side by side, so you can see the trade-off before downloading.\n\nFor changing image format (for example to WEBP for better compression), use the Image Converter. For changing image dimensions, use the Resize Image tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Compresser Image d'EverydayTools Hub réduit la taille des fichiers JPEG, PNG et WEBP à l'aide d'un curseur de qualité — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes gros fichiers images ralentissent les sites web, consomment du stockage et ralentissent les transferts de fichiers. Le compresseur utilise l'API Canvas HTML5 pour ré-encoder l'image à un niveau de qualité inférieur.\n\nLe curseur de qualité va de 1 % (compression maximale) à 100 % (ré-encodage sans perte). La plupart des images web bénéficient d'un paramètre de qualité de 70–85 %. L'outil affiche les tailles de fichier originales et compressées côte à côte.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I compress an image for free online?", a: "Upload your image to EverydayTools Hub Compress Image, adjust the quality slider, and click Compress. The file size reduction is shown, and you can download the compressed image — no account required, no server upload." },
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
    relatedTools: ["image-compress", "image-crop", "image-converter"],
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
      en: "EverydayTools Hub Resize Image tool changes the pixel dimensions of images — entirely in your browser, with no server uploads and no account required.\n\nResizing images is one of the most common image editing tasks. Use cases include reducing large photos for web upload (which speeds up page loading), preparing images for social media platforms with specific dimension requirements, scaling down photos for email, or creating thumbnails.\n\nThe tool uses the HTML5 Canvas API to resample the image to the specified dimensions. You can enter exact pixel dimensions for width and/or height, or specify a percentage scale. The aspect ratio lock ensures the image is not distorted when resizing by one dimension.\n\nFor reducing file size without changing dimensions, use the Compress Image tool. For cropping to a specific area, use the Crop Image tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Redimensionner Image d'EverydayTools Hub modifie les dimensions en pixels des images — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLe redimensionnement d'images est l'une des tâches d'édition d'images les plus courantes. Les cas d'usage incluent la réduction de grandes photos pour le téléchargement sur le web, la préparation d'images pour les réseaux sociaux avec des exigences de dimensions spécifiques, la mise à l'échelle de photos pour les e-mails ou la création de miniatures.\n\nL'outil utilise l'API Canvas HTML5 pour rééchantillonner l'image aux dimensions spécifiées. Vous pouvez entrer des dimensions en pixels exactes ou spécifier un pourcentage.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I resize an image online for free?", a: "Upload your image to EverydayTools Hub Resize Image, enter the target width and height (or a percentage), and click Resize. The resized image downloads in your browser — no account required, no server upload." },
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
    relatedTools: ["image-resize", "image-compress", "background-remover"],
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
      en: "EverydayTools Hub Crop Image tool lets you crop photos and images interactively — entirely in your browser, with no server uploads and no account required.\n\nCropping is one of the fundamental photo editing operations. Use cases include removing unwanted areas from a photo, creating square profile pictures, cropping thumbnails for specific aspect ratios, zooming into a subject by cropping, or framing a subject more precisely.\n\nThe tool provides an interactive crop box with drag handles that you can position and resize freely. Aspect ratio presets (1:1 for square, 4:3 for standard, 16:9 for widescreen, and custom) make it easy to crop to standard formats. The final crop is rendered using the HTML5 Canvas API entirely in your browser.\n\nFor changing image dimensions without cropping, use the Resize Image tool. For removing image backgrounds instead, use the Background Remover. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Recadrer Image d'EverydayTools Hub vous permet de recadrer des photos et des images de manière interactive — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLe recadrage est l'une des opérations fondamentales d'édition de photos. Les cas d'usage incluent la suppression de zones indésirables, la création de photos de profil carrées, le recadrage de miniatures pour des formats spécifiques, ou le cadrage plus précis d'un sujet.\n\nL'outil fournit une boîte de recadrage interactive avec des poignées de glissement. Les préréglages de proportions (1:1 pour carré, 4:3 pour standard, 16:9 pour grand écran) facilitent le recadrage aux formats standard.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I crop an image online for free?", a: "Upload your image to EverydayTools Hub Crop Image, drag the crop handles to select the area you want to keep, and click Crop. The cropped image downloads — no account required, no server upload." },
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
    relatedTools: ["pdf-to-image", "image-compress", "pdf-merge"],
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
      en: "EverydayTools Hub Image to PDF Converter packages one or more images into a single PDF document — entirely in your browser, with no server uploads and no account required.\n\nConverting images to PDF is useful for creating printable photo albums, sending multiple photos in a single file, archiving scan results, submitting identity documents, or creating visual reports from screenshots.\n\nThe tool uses pdf-lib to create a new PDF document and embed each image as a full page. The PDF page dimensions are sized to match each image. Multiple images become multiple pages in a single PDF. The order of images in the PDF corresponds to the order they were added.\n\nFor the reverse operation (extracting pages from a PDF as images), use the PDF to Image tool. For merging the resulting PDFs with other documents, use the Merge PDF tool. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur Image en PDF d'EverydayTools Hub regroupe une ou plusieurs images en un seul document PDF — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa conversion d'images en PDF est utile pour créer des albums photos imprimables, envoyer plusieurs photos dans un seul fichier, archiver des résultats de numérisation, soumettre des documents d'identité ou créer des rapports visuels à partir de captures d'écran.\n\nL'outil utilise pdf-lib pour créer un nouveau document PDF et intégrer chaque image en page complète. Plusieurs images deviennent plusieurs pages dans un seul PDF.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert images to PDF for free?", a: "Upload your images to EverydayTools Hub Image to PDF Converter, arrange them in the desired order, and click Convert. A PDF with each image on its own page downloads instantly — no account required." },
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
    relatedTools: ["image-to-pdf", "image-converter", "pdf-to-text"],
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
      en: "EverydayTools Hub PDF to Image Converter exports each page of a PDF as a high-quality PNG or JPEG image — entirely in your browser, with no server uploads and no account required.\n\nConverting PDF pages to images is useful for creating preview thumbnails, sharing individual pages as images, embedding PDF content in social media or presentations, or preparing images for further processing.\n\nThe tool uses PDF.js to render each page to a canvas at the specified resolution (DPI), then exports the canvas as a PNG or JPEG image. Higher resolution settings produce sharper images but larger files. The standard 150 DPI setting is sufficient for screen use; use 300 DPI for print-quality output.\n\nFor the reverse operation (creating a PDF from images), use the Image to PDF converter. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le convertisseur PDF en Image d'EverydayTools Hub exporte chaque page d'un PDF en image PNG ou JPEG de haute qualité — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLa conversion de pages PDF en images est utile pour créer des miniatures d'aperçu, partager des pages individuelles en tant qu'images, intégrer du contenu PDF dans des présentations ou des réseaux sociaux.\n\nL'outil utilise PDF.js pour rendre chaque page sur un canvas à la résolution spécifiée, puis exporte le canvas en PNG ou JPEG. Des paramètres de résolution plus élevés produisent des images plus nettes mais des fichiers plus volumineux.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert PDF pages to images online for free?", a: "Upload your PDF to EverydayTools Hub PDF to Image Converter, select PNG or JPEG output, choose a resolution, and click Convert. Each page downloads as a separate image — no account, no server upload." },
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
    description: { en: "Remove image backgrounds using on-device AI — free, no upload, no account. Get a transparent PNG in seconds. Powered by @imgly/background-removal.", fr: "Supprimez les fonds d'images avec l'IA sur l'appareil — gratuit, sans envoi, sans compte. PNG transparent en quelques secondes." },
    keywords: { en: ["remove image background free", "background remover online", "remove background from photo", "transparent background free", "ai background removal", "remove bg free"], fr: ["supprimer fond image gratuit", "supprimer arrière-plan photo", "fond transparent gratuit", "suppression fond ia", "enlever fond image en ligne", "remove background gratuit"] },
    relatedTools: ["image-converter", "image-crop", "metadata-cleaner"],
    howItWorks: {
      en: [
        { name: "Upload your image", text: "Click the upload area or drag a PNG or JPEG photo. The subject can be a person, product, or object." },
        { name: "AI removes the background", text: "The @imgly/background-removal AI model runs entirely in your browser — no image is sent to any server." },
        { name: "Download the PNG", text: "Click Remove Background. A PNG with a transparent background downloads, ready for compositing or web use." },
      ],
      fr: [
        { name: "Téléversez votre image", text: "Cliquez sur la zone de dépôt ou faites glisser une photo PNG ou JPEG. Le sujet peut être une personne, un produit ou un objet." },
        { name: "L'IA supprime le fond", text: "Le modèle IA @imgly/background-removal s'exécute entièrement dans votre navigateur — aucune image n'est envoyée à un serveur." },
        { name: "Téléchargez le PNG", text: "Cliquez sur Supprimer le fond. Un PNG avec un fond transparent se télécharge, prêt pour la composition ou l'utilisation web." },
      ],
    },
    about: {
      en: "EverydayTools Hub Background Remover uses on-device AI to remove image backgrounds and produce transparent PNGs — entirely in your browser, with no server uploads and no account required.\n\nThe tool uses the @imgly/background-removal library, which runs a U-2-Net neural network model in the browser using ONNX Runtime Web. This means the AI inference happens locally on your device — no photo is ever transmitted to a cloud server, making it safe for personal, product, or sensitive photos.\n\nBackground removal is essential for product photography (e-commerce listings), portrait photography, social media content creation, logo and branding work, and creating composite images. The AI model handles complex edges such as hair, fur, and semi-transparent areas better than traditional threshold-based tools.\n\nNote: the model loads the first time you use the tool (approximately 30–50 MB). Subsequent uses on the same device are faster as the model is cached. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "L'outil Supprimer le Fond d'EverydayTools Hub utilise l'IA sur l'appareil pour supprimer les fonds d'images et produire des PNG transparents — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nL'outil utilise la bibliothèque @imgly/background-removal, qui exécute un modèle de réseau neuronal U-2-Net dans le navigateur avec ONNX Runtime Web. Cela signifie que l'inférence IA se déroule localement sur votre appareil — aucune photo n'est jamais transmise à un serveur cloud.\n\nLa suppression de fond est essentielle pour la photographie de produits, les portraits, la création de contenu pour les réseaux sociaux et les images composites. Le modèle IA gère bien les contours complexes comme les cheveux, la fourrure et les zones semi-transparentes.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I remove a background from an image for free?", a: "Upload your image to EverydayTools Hub Background Remover and click Remove Background. The AI model runs in your browser, detects the foreground subject, and produces a transparent PNG that downloads to your device — no account, no server upload." },
        { q: "Is the background removal done by AI?", a: "Yes. The tool uses @imgly/background-removal, which runs a U-2-Net neural network model using ONNX Runtime Web, entirely in your browser. No image data is transmitted to any server." },
        { q: "What types of images work best?", a: "The AI works best with images that have a clear foreground subject (person, product, animal, logo) against a distinct background. High contrast between subject and background improves results. Very busy backgrounds or subjects with fine transparent elements (e.g., glass, thin smoke) may require manual cleanup." },
        { q: "Why does the tool take a few seconds to load?", a: "The AI model (approximately 30–50 MB) is downloaded on the first use. Subsequent uses are faster because the model is cached in the browser. The inference itself typically takes 2–10 seconds depending on image size and device speed." },
        { q: "What format is the output?", a: "The output is always a PNG with a transparent alpha channel. PNG is the only format that supports transparency at full quality. To use the result on a website or app, reference the PNG directly or convert it to WEBP format (which also supports transparency) using the Image Converter." },
        { q: "Is Background Remover free?", a: "Yes. EverydayTools Hub Background Remover is completely free, with no account required, no usage limits, and no watermarks on the output." },
      ],
      fr: [
        { q: "Comment supprimer un fond d'une image gratuitement ?", a: "Téléversez votre image dans l'outil Supprimer le Fond d'EverydayTools Hub et cliquez sur Supprimer le fond. Le modèle IA s'exécute dans votre navigateur et produit un PNG transparent qui se télécharge sur votre appareil." },
        { q: "La suppression du fond est-elle effectuée par IA ?", a: "Oui. L'outil utilise @imgly/background-removal, qui exécute un modèle de réseau neuronal U-2-Net avec ONNX Runtime Web, entièrement dans votre navigateur. Aucune donnée d'image n'est transmise à un serveur." },
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
    relatedTools: ["ai-text-scrubber", "pdf-protect", "background-remover"],
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
      en: "EverydayTools Hub Metadata Cleaner strips all embedded metadata from image and document files — entirely in your browser, with no server uploads and no account required.\n\nDigital photos contain EXIF metadata that can reveal sensitive information: GPS coordinates showing where a photo was taken, the camera model and serial number, the date and time, software used, and even the author's name. PDFs and Word documents embed author names, company information, revision history, and software fingerprints. The Metadata Cleaner removes all of this.\n\nThe tool uses piexifjs for JPEG EXIF removal and exifr for reading other metadata types, along with pdf-lib for PDF metadata cleaning. The cleaned file retains its full visual quality — only the hidden metadata layer is removed.\n\nFor scrubbing AI-detectable text patterns rather than file metadata, use the AI Text Scrubber tool. EverydayTools Hub is free, browser-based, and no signup is required. Your files never leave your device.",
      fr: "Le nettoyeur de métadonnées d'EverydayTools Hub supprime toutes les métadonnées intégrées des fichiers images et documents — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nLes photos numériques contiennent des métadonnées EXIF qui peuvent révéler des informations sensibles : les coordonnées GPS montrant où une photo a été prise, le modèle d'appareil photo, la date et l'heure, le logiciel utilisé, et même le nom de l'auteur. Les PDF et documents Word intègrent des noms d'auteur, des informations sur l'entreprise et des historiques de révision.\n\nL'outil utilise piexifjs pour la suppression EXIF JPEG et pdf-lib pour le nettoyage des métadonnées PDF. Le fichier nettoyé conserve sa pleine qualité visuelle.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I remove EXIF data from a photo for free?", a: "Upload your JPEG, PNG, or PDF to EverydayTools Hub Metadata Cleaner and click Clean. The tool strips all EXIF, XMP, IPTC, and GPS metadata in your browser and downloads the clean file — no account, no server upload." },
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
    relatedTools: ["metadata-cleaner", "pdf-to-text", "txt-to-pdf"],
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
      en: "EverydayTools Hub AI Text Scrubber removes invisible Unicode characters and AI-generation watermarks from text — entirely in your browser, with no server uploads and no account required.\n\nSome AI text generation systems (including certain configurations of GPT-4 and Claude) embed zero-width Unicode characters, variation selectors, and other invisible codepoints as watermarks that can be detected to identify AI-generated content. The scrubber identifies and strips these patterns, producing clean UTF-8 text.\n\nThe tool also removes other problematic invisible characters that can cause issues in code, databases, and web forms: zero-width spaces (U+200B), zero-width non-joiner (U+200C), zero-width joiner (U+200D), word joiner (U+2060), and other Unicode special-use characters that have no visible glyph.\n\nFor removing metadata from files (EXIF, document properties) rather than text patterns, use the Metadata Cleaner. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le Nettoyeur de Texte IA d'EverydayTools Hub supprime les caractères Unicode invisibles et les filigranes de génération IA du texte — entièrement dans votre navigateur, sans envoi à un serveur et sans compte requis.\n\nCertains systèmes de génération de texte IA intègrent des caractères Unicode de largeur nulle, des sélecteurs de variation et d'autres points de code invisibles comme filigranes pouvant être détectés. Le nettoyeur identifie et supprime ces modèles, produisant du texte UTF-8 propre.\n\nL'outil supprime également d'autres caractères invisibles problématiques : espaces de largeur nulle (U+200B), non-joncteur de largeur nulle (U+200C), joncteur de largeur nulle (U+200D) et autres caractères Unicode à usage spécial.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I remove AI watermarks from text?", a: "Paste your text or upload a .txt file to EverydayTools Hub AI Text Scrubber and click Scrub. The tool scans for and removes zero-width characters, invisible Unicode codepoints, and other text-level AI detection patterns, then downloads the clean text." },
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
    relatedTools: ["pdf-protect", "metadata-cleaner", "percentage-calc"],
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
      en: "EverydayTools Hub Password Generator creates cryptographically secure random passwords using your browser's built-in crypto.getRandomValues() API — no server involved, no data stored, completely free and private.\n\nWeak passwords are the most common cause of account compromises. A strong password should be at least 16 characters long, use a mix of uppercase letters, lowercase letters, numbers, and symbols, and be unique for each account. The Password Generator creates passwords meeting these criteria instantly.\n\nThe tool displays the entropy of each generated password in bits. Entropy measures the unpredictability of the password: a password with 80 bits of entropy is roughly 1 trillion trillion times harder to guess than one with 40 bits. Security experts recommend at least 80 bits of entropy for general passwords and 128+ bits for high-security accounts.\n\nPasswords are generated entirely in your browser and never transmitted anywhere. For storing passwords securely, use a password manager. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le Générateur de Mot de Passe d'EverydayTools Hub crée des mots de passe aléatoires cryptographiquement sécurisés en utilisant l'API crypto.getRandomValues() intégrée à votre navigateur — sans serveur impliqué, sans données stockées, entièrement gratuit et privé.\n\nLes mots de passe faibles sont la cause la plus courante de compromission de comptes. Un mot de passe fort doit comporter au moins 16 caractères, utiliser un mélange de majuscules, minuscules, chiffres et symboles, et être unique pour chaque compte.\n\nL'outil affiche l'entropie de chaque mot de passe généré en bits. L'entropie mesure l'imprévisibilité : un mot de passe avec 80 bits d'entropie est environ 1 billion de billions de fois plus difficile à deviner qu'un avec 40 bits.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I generate a secure password for free?", a: "Go to EverydayTools Hub Password Generator, set your preferred length and character options, and click Generate. The tool uses crypto.getRandomValues() — a cryptographically secure RNG — to produce the password instantly. Click the copy button to use it." },
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
    relatedTools: ["unit-converter", "currency-converter", "password-generator"],
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
      en: "EverydayTools Hub Percentage Calculator solves all common percentage problems instantly — entirely in your browser, with no account required and no data sent to any server.\n\nPercentage calculations appear in everyday situations: calculating a restaurant tip, working out a sale discount, determining the percentage change between two values, calculating tax, or finding what percentage one number is of another. The calculator covers all these use cases with clearly labelled inputs and instant results.\n\nThe tool supports: basic percentage (X% of Y), percentage increase/decrease, percentage of total, discount calculation (original price minus percentage), tip calculation (bill amount plus tip percentage), and markup (cost plus markup percentage). All calculations update in real time as you type.\n\nFor currency conversions (including applying currency discounts), use the Currency Converter. For unit conversions, use the Unit Converter. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le Calculateur de Pourcentage d'EverydayTools Hub résout tous les problèmes courants de pourcentage instantanément — entièrement dans votre navigateur, sans compte requis et sans données envoyées à un serveur.\n\nLes calculs de pourcentage apparaissent dans des situations quotidiennes : calculer un pourboire au restaurant, déterminer une remise de vente, calculer la variation en pourcentage entre deux valeurs, calculer une taxe ou trouver quel pourcentage représente un nombre par rapport à un autre.\n\nL'outil prend en charge : le pourcentage de base (X% de Y), l'augmentation/diminution en pourcentage, le pourcentage du total, le calcul de remise, le calcul de pourboire et la marge. Tous les calculs se mettent à jour en temps réel.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I calculate a percentage online?", a: "Go to EverydayTools Hub Percentage Calculator and select the calculation type. Enter the known values — the result updates instantly. For example, for '20% of 150', select 'Percentage of number', enter 20 and 150, and the result (30) appears immediately." },
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
    relatedTools: ["currency-converter", "percentage-calc", "password-generator"],
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
      en: "EverydayTools Hub Unit Converter converts between more than 200 units across 13 measurement categories — entirely in your browser, with no server involved, no account required, and completely free.\n\nThe 13 supported categories are: length (metres, feet, inches, miles, kilometres, nautical miles, and more), mass/weight (kilograms, pounds, ounces, stones, tonnes), temperature (Celsius, Fahrenheit, Kelvin, Rankine), volume (litres, gallons, pints, cups, fluid ounces), area, speed, time, digital storage, energy, pressure, power, angle, and frequency.\n\nAll conversions use a graph-based conversion system — each unit has a defined relationship to a canonical base unit, and conversions are calculated by chaining these relationships. This ensures accuracy across all unit pairs without needing to store a conversion table for every possible combination.\n\nFor currency conversions with live exchange rates, use the Currency Converter. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le Convertisseur d'Unités d'EverydayTools Hub convertit entre plus de 200 unités dans 13 catégories de mesure — entièrement dans votre navigateur, sans serveur, sans compte requis et entièrement gratuit.\n\nLes 13 catégories supportées sont : longueur (mètres, pieds, pouces, miles, kilomètres, milles nautiques et plus), masse/poids (kilogrammes, livres, onces, stones, tonnes), température (Celsius, Fahrenheit, Kelvin, Rankine), volume (litres, gallons, pintes, tasses, onces liquides), superficie, vitesse, temps, stockage numérique, énergie, pression, puissance, angle et fréquence.\n\nToutes les conversions utilisent un système basé sur des graphes — chaque unité a une relation définie avec une unité de base canonique.\n\nEverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How do I convert units online for free?", a: "Go to EverydayTools Hub Unit Converter, select the measurement category, enter a value in any unit, and all equivalent values in other units appear instantly — no account required." },
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
    relatedTools: ["unit-converter", "percentage-calc", "password-generator"],
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
      en: "EverydayTools Hub Currency Converter converts between 170 world currencies using live exchange rates — entirely in your browser, with no account required and completely free.\n\nExchange rates are fetched from open.er-api.com, a free public API that provides mid-market rates updated every hour. The rates are cached in your browser's localStorage for 1 hour to reduce API requests and provide fast conversion even with a slow connection. If the live rate fetch fails, a built-in static fallback rate table is used.\n\nThe converter supports 170 currencies including all major currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY), all EU member state currencies, most emerging market currencies, and cryptocurrencies are not included (exchange rates for cryptocurrencies require specialised APIs due to their 24/7 volatility).\n\nNote: the rates shown are mid-market rates — the midpoint between buy and sell prices. Actual rates offered by banks, currency exchange services, or payment processors will include a spread or fee. EverydayTools Hub is free, browser-based, and no signup is required.",
      fr: "Le Convertisseur de Devises d'EverydayTools Hub convertit entre 170 devises mondiales en utilisant des taux de change en direct — entièrement dans votre navigateur, sans compte requis et entièrement gratuit.\n\nLes taux de change sont récupérés depuis open.er-api.com, une API publique gratuite qui fournit des taux médians mis à jour toutes les heures. Les taux sont mis en cache dans le localStorage de votre navigateur pendant 1 heure pour réduire les requêtes API.\n\nLe convertisseur supporte 170 devises incluant toutes les devises principales (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY), toutes les devises des États membres de l'UE et la plupart des devises des marchés émergents.\n\nNote : les taux affichés sont des taux médians — le milieu entre les prix d'achat et de vente. Les taux réels proposés par les banques incluront un écart ou des frais. EverydayTools Hub est gratuit, basé sur le navigateur et ne nécessite aucune inscription.",
    },
    faqs: {
      en: [
        { q: "How accurate are the exchange rates?", a: "Rates come from open.er-api.com, which provides mid-market rates updated every hour. Mid-market rates are the fairest reference rates — they represent the midpoint between buy and sell rates. Actual rates from banks or exchange services include a spread that is typically 0.5–3% above the mid-market rate." },
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
