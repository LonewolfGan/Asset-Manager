export type Locale = "EN" | "FR";

export type Translations = {
  nav: {
    groups: Record<string, string>;
    links: Record<string, string>;
    searchPlaceholder: string;
    breadcrumb: {
      home: string; pdf: string; word: string; image: string;
      privacy: string; calculators: string; tools: string;
      textCode: string; excelSpreadsheets: string; documents: string;
    };
  };
  home: {
    title: string;
    subtitle: string;
    allTools: string;
    allToolsSubtitle: (n: number) => string;
    categories: Record<string, string>;
    toolCategory: Record<string, string>;
    sectionLabels: Record<string, string>;
    sectionDescriptions: Record<string, string>;
    toolCount: (n: number) => string;
    resultCount: (n: number) => string;
    resultsFor: string;
    noResults: (q: string) => string;
    clearSearch: string;
    recentlyUsed: string;
    pinned: string;
  };
  tools: Record<string, { title: string; description: string }>;
  ui: {
    dropzone: string;
    dropzoneHint: (accept: string, maxMb: number) => string;
    lightMode: string;
    darkMode: string;
    loading: string;
    fileExceedsSize: (filename: string, maxMb: number) => string;
    formatNotAccepted: (filename: string) => string;
    uploadAriaLabel: (label: string, formats: string, maxMb: number) => string;
    defaultUploadAriaLabel: (formats: string, maxMb: number) => string;
    note: string;
    removeFileAria: (filename: string) => string;
  };
  footer: {
    tagline: string;
    rights: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePreferences: string;
    security: string;
    columns: { pdf: string; images: string; utilities: string };
  };
  cookie: {
    message: string;
    neverUploaded: string;
    privacyPolicy: string;
    essentialOnly: string;
    acceptAll: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  tipCalc: {
    tabTip: string; tabPercent: string;
    billAmount: string; tipPct: string; numPeople: string;
    bill: string; tip: (pct: number) => string; total: string;
    tipPerPerson: string; totalPerPerson: string;
    pctOf: string; whatIs: string; isWhatPctOf: string;
    pctChange: string; pctChangeFrom: string; pctChangeTo: string;
  };
  pctCalc: {
    tabs: { of: string; isWhat: string; change: string; discount: string; tip: string; markup: string };
    labels: {
      whatIsPct: string; ofY: string; xIsWhat: string; changeFrom: string; changeTo: string;
      discountPct: string; origPrice: string; tipPct: string; billAmount: string;
      splitBetween: string; marginPct: string; cost: string;
    };
    result: string; increase: string; decrease: string;
    finalPrice: string; saved: string; tipLabel: string;
    perPerson: string; sellingPrice: string; markupLabel: string;
  };
  unitConverter: {
    from: string; to: string; pin: string; pinned: string;
    pinnedConversions: string; swapAriaLabel: string;
    categoryNames: Record<string, string>;
    unitNames: Record<string, string>;
  };
  currencyConverter: {
    from: string; to: string; quickConversions: string; recentHistory: string;
    noRecent: string;
    liveRatesUpdated: (min: number) => string;
    liveRatesJust: string;
    offlineSnapshot: (date: string) => string;
  };
  passwordGenerator: {
    length: (n: number) => string;
    uppercase: string; lowercase: string; numbers: string; symbols: string; pronounceable: string;
    count: string; regenerate: string; copy: string;
    bulkGeneration: string; history: string; clearHistory: string;
    strength: { weak: string; fair: string; strong: string; veryStrong: string; exceptional: string };
  };
  formatSelector: { search: string; noResults: string };
  aiTextScrubber: {
    tabInvisible: string;
    tabStylistic: string;
    placeholder: string;
    scan: string;
    removeBtn: string;
    scrubPhrases: string;
    foundCount: (n: number) => string;
    cleanedOutput: string;
    copy: string;
    downloadTxt: string;
    disclaimer: string;
  };
  backgroundRemover: {
    note: string;
    removeBtn: string;
    removeMultipleBtn: (n: number) => string;
    processingImage: string;
    processingCount: (current: number, total: number) => string;
    original: string;
    result: string;
    inspect: string;
    downloadAll: string;
    downloadSingle: string;
    processAnother: string;
    cancel: string;
    dragSliderHint: string;
  };
  metadataCleaner: {
    tabImages: string;
    tabPdfs: string;
    tabDocs: string;
    analyzeBtn: string;
    foundMetadata: string;
    cleanBtn: string;
    cleaningLabel: string;
    disclaimer: string;
    cleaning: string;
    error: string;
    readyBadge: string;
    downloadCleaned: string;
    convertAnother: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    featureExif: string;
    featureExifDesc: string;
    featurePdfDoc: string;
    featurePdfDocDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestHybridNote: string;
  };
  pdfCompress: {
    compressionLevel: string;
    compressBtn: string;
    compressingLabel: string;
    statsOriginal: string;
    statsCompressed: string;
    statsReduction: string;
    downloadBtn: (filename: string) => string;
    note: string;
    extremeTitle: string;
    extremeDesc: string;
    extremeBadge: string;
    recommendedTitle: string;
    recommendedDesc: string;
    recommendedBadge: string;
    lowTitle: string;
    lowDesc: string;
    lowBadge: string;
    changeFile: string;
    anotherFile: string;
    recommendedTag: string;
  };
  qrCode: {
    contentType: string;
    modes: {
      url: string;
      text: string;
      wifi: string;
      vcard: string;
    };
    content: string;
    textLabel: string;
    enterText: string;
    wifiSsid: string;
    wifiPass: string;
    encryption: string;
    encNone: string;
    fullName: string;
    email: string;
    phone: string;
    options: string;
    size: (n: number) => string;
    margin: (n: number) => string;
    errorCorrection: string;
    qrColor: string;
    bgColor: string;
    preview: string;
    emptyHint: string;
    downloadPng: string;
    copyImage: string;
    copied: string;
    privacyNote: string;
  };
  pdfMerge: {
    mergeBtn: (n: number) => string;
    mergingLabel: string;
    errorMin2: string;
    addMore: string;
    clearAll: string;
    sortAZ: string;
    totalSize: string;
    filesCount: (n: number) => string;
    needTwoPrompt: string;
    dragTip: string;
    mergedSuccess: string;
    downloadMerged: string;
    honestServerNote: string;
  };
  imageCompress: {
    qualitySlider: string;
    targetSize: string;
    quality: string;
    smallest: string;
    original100: string;
    targetSizeLabel: string;
    kbPerFile: string;
    resize: string;
    noResize: string;
    scalePercent: string;
    maxWH: string;
    pxKeepsAspect: string;
    stripExif: string;
    compressBtn: (n: number) => string;
    compressing: string;
    originalLabel: string;
    compressedLabel: string;
    processing: string;
    downloadBtn: string;
    removeBtn: string;
    dropHint: string;
    downloadAll: (n: number) => string;
    compressAnother: string;
    compare: string;
    backToList: string;
    batchProgress: (done: number, total: number) => string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    honestServerNote: string;
    dimensions: string;
    maxWidth: string;
    maxHeight: string;
    clearAll: string;
    statusPending: string;
    statusProcessing: string;
    statusDone: string;
    statusError: string;
  };
  imageResize: {
    byPixels: string;
    byPercentage: string;
    width: string;
    height: string;
    lockAspectRatio: string;
    percentage: string;
    originalDimensions: string;
    targetDimensions: string;
    resizeBtn: string;
    resizing: string;
    invalidDimensions: string;
    invalidPercentage: string;
    step1: string;
    step2: string;
    step3: string;
    honestServerNote: string;
    resizeAnother: string;
  };
  imageCrop: {
    aspectFree: string;
    aspectSquare: string;
    aspect43: string;
    aspect169: string;
    aspect32: string;
    selection: (w: number, h: number) => string;
    dragPrompt: string;
    cropBtn: string;
    cropping: string;
    cancel: string;
    cropAnother: string;
    step1: string;
    step2: string;
    step3: string;
    honestServerNote: string;
  };
  flipRotateImage: {
    rotateHeading: string;
    flipHeading: string;
    normalOrientation: string;
    rotateLeft: string;
    rotateRight: string;
    rotate180: string;
    flipHorizontal: string;
    flipVertical: string;
    resetTransform: string;
    outputFormat: string;
    applyBtn: string;
    applying: string;
    changeImage: string;
    editAnother: string;
    currentOrientation: string;
    step1: string;
    step2: string;
    step3: string;
    honestServerNote: string;
  };
  watermarkImage: {
    watermarkText: string;
    fontSize: string;
    color: string;
    opacity: string;
    position: string;
    positions: {
      topLeft: string;
      topRight: string;
      center: string;
      bottomLeft: string;
      bottomRight: string;
    };
    applyBtn: string;
    applying: string;
    changeImage: string;
    watermarkAnother: string;
    step1: string;
    step2: string;
    step3: string;
    honestServerNote: string;
  };
  faviconGenerator: {
    includedSizes: string;
    browserPreview: string;
    mobilePreview: string;
    sampleTab: string;
    sampleApp: string;
    htmlSnippetTitle: string;
    copyHtml: string;
    copied: string;
    generateBtn: string;
    generating: string;
    changeImage: string;
    generateAnother: string;
    downloadZip: string;
    step1: string;
    step2: string;
    step3: string;
    honestServerNote: string;
  };
  documentConverter: {
    inputFile?: string;
    selectDesc?: string;
    dragDrop?: string;
    clickBrowse?: string;
    convertBtn: string;
    processingBtn?: string;
    converting: string;
    conversionFailed?: string;
    output?: string;
    outputDesc?: string;
    downloadTxt?: string;
    pdfSuccess?: string;
    ready?: string;
    error: string;
    readyBadge: string;
    downloadFile: (ext: string) => string;
    convertAnother: string;
    targetLabel: string;
    featureEngine: string;
    featureEngineDesc: string;
    featureFidelity: string;
    featureFidelityDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  imageConverter: {
    settings: string;
    outputFormat: string;
    quality: string;
    convertAll: string;
    converting: string;
    downloadAll: string;
    download: string;
    addImages: string;
    dragDrop: string;
    processing: string;
    clearAll: string;
    honestServerNote: string;
    convertAnother: string;
  };
  ocr: {
    modelNote: string;
    extractBtn: string;
    extracting: string;
    extractedText: string;
    error: string;
    readyBadge: string;
    downloadTxt: string;
    convertAnother: string;
    languageLabel: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    featureAccuracy: string;
    featureAccuracyDesc: string;
    featureFormats: string;
    featureFormatsDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  wordCounter: {
    words: string;
    chars: string;
    noSpaces: string;
    sentences: string;
    paragraphs: string;
    readingTime: string;
    clear: string;
    copyText: string;
    pasteHere: string;
  };
  common: {
    download: string;
    downloadAll: (n: number) => string;
    copy: string;
    copied: string;
    reset: string;
    remove: string;
    clear: string;
    processing: string;
    converting: string;
    quality: string;
    original: string;
    converted: string;
    extractText: string;
    extractedText: string;
    dropFileHere: string;
    dropFilesHere: (label: string) => string;
    uploadFile: string;
    pasteText: string;
    outputAppearsHere: string;
    convertToPdf: string;
    downloadPdf: string;
    downloadCsv: string;
    downloadTxt: string;
    convertFiles: (n: number, ext: string) => string;
    pdfReady: (kb: string) => string;
    sheet: string;
    exportSheet: string;
    convertBtn: string;
    preview: (n: number) => string;
    orPasteDirectly: string;
    errorGeneric: string;
    view: string;
    copyText: string;
    format: string;
    minify: string;
    encode: string;
    decode: string;
    generate: string;
  };
  jsonFormatter: {
    inputLabel: string;
    formattedOutput: string;
    minifiedOutput: string;
    indent: string;
    stats: (chars: number, bytes: number) => string;
    invalidJson: string;
  };
  htmlFormatter: {
    inputLabel: string;
    outputLabel: string;
    bytes: (n: number) => string;
  };
  urlEncoder: {
    rawUrlText: string;
    encodedUrl: string;
    encodedOutput: string;
    decodedOutput: string;
    quickExamples: string;
    invalidInput: string;
    examples: { space: string; ampersand: string; equals: string; hash: string };
  };
  base64Encoder: {
    uploadFile: string;
    plainTextInput: string;
    base64Input: string;
    base64Output: string;
    decodedText: string;
    encodePlaceholder: string;
    decodePlaceholder: string;
    chars: (n: number) => string;
    invalidInput: string;
  };
  loremIpsum: {
    types: { paragraphs: string; sentences: string; words: string; lists: string };
    count: string;
    classicStart: string;
  };
  nextToolMenu: {
    title: string;
    openIn: string;
    otherTools: string;
    openInOtherTools: string;
    steps: {
      compressImage: { label: string; desc: string };
      resizeDimensions: { label: string; desc: string };
      convertFormat: { label: string; desc: string };
      cropImage: { label: string; desc: string };
      watermarkImage: { label: string; desc: string };
      applyFilters: { label: string; desc: string };
      compressPdf: { label: string; desc: string };
      pdfToWord: { label: string; desc: string };
      protectPdf: { label: string; desc: string };
      watermarkPdf: { label: string; desc: string };
      pdfToImage: { label: string; desc: string };
      wordToPdf: { label: string; desc: string };
      wordToEpub: { label: string; desc: string };
      wordToMarkdown: { label: string; desc: string };
      universalConverter: { label: string; desc: string };
    };
  };
  resultPanel: {
    readyToDownload: string;
    downloadExt: (ext: string) => string;
    downloadAria: (filename: string) => string;
    extractedText: string;
    copyAll: string;
    copied: string;
    downloadTxtAria: string;
    copyAria: string;
  };
  toolProcessor: {
    uploading: string;
    processing: string;
    takeSeconds: string;
    completed: string;
    startOver: string;
    download: string;
    failed: string;
    defaultError: string;
    retry: string;
    original: string;
    result: string;
    steps: {
      analyzing: string;
      processing: string;
      optimizing: string;
      finalizing: string;
    };
  };
  pdfUnlock: {
    note: string;
    unlockBtn: string;
    unlocking: string;
    error: string;
    readyBadge?: string;
    downloadPdf?: string;
    unlockAnother?: string;
    passwordLabel?: string;
    passwordPlaceholder?: string;
    passwordHelp?: string;
    featureRestrictions?: string;
    featureRestrictionsDesc?: string;
    featureCompatibility?: string;
    featureCompatibilityDesc?: string;
    featurePrivate?: string;
    featurePrivateDesc?: string;
    honestServerNote: string;
  };
  pdfProtect: {
    cardTitle: string;
    userPasswordLabel: string;
    userPasswordPlaceholder: string;
    ownerPasswordLabel: string;
    ownerPasswordPlaceholder: string;
    allowPrinting: string;
    allowCopying: string;
    allowModifying: string;
    protectBtn: string;
    encrypting: string;
    errorNoPassword: string;
    error: string;
    readyBadge?: string;
    downloadPdf?: string;
    protectAnother?: string;
    aes256Badge?: string;
    permissionsTitle?: string;
    permissionsDesc?: string;
    generatePasswordBtn?: string;
    strengthWeak?: string;
    strengthMedium?: string;
    strengthStrong?: string;
    honestServerNote: string;
  };
  pdfRotate: {
    cardTitle: string;
    right90: string;
    upsideDown180: string;
    left270: string;
    rotateBtn: string;
    rotating: string;
    error: string;
    rotateAllRight?: string;
    rotateAllLeft?: string;
    resetRotations?: string;
    rotateSingleRight?: string;
    rotateSingleLeft?: string;
    pageLabel?: (n: number) => string;
    pagesCount?: (n: number) => string;
    saveRotatedPdf?: string;
    renderingPages?: string;
    loadDifferent?: string;
    honestServerNote: string;
  };
  pdfSplit: {
    optionsTitle: string;
    everyPage: string;
    rangeOption: string;
    rangePlaceholder: string;
    splitBtn: string;
    splitting: string;
    error: string;
    modeRangeTitle?: string;
    modeRangeDesc?: string;
    modeExtractTitle?: string;
    modeExtractDesc?: string;
    allPagesSub?: string;
    selectPagesSub?: string;
    mergeOption?: string;
    mergeOptionHelp?: string;
    addRangeBtn?: string;
    fromPage?: string;
    toPage?: string;
    pagesCount?: (n: number) => string;
    selectAll?: string;
    deselectAll?: string;
    evenPages?: string;
    oddPages?: string;
    pagesSelected?: (sel: number, tot: number) => string;
    readyBadge?: string;
    downloadPdf?: string;
    downloadZip?: string;
    splitAnother?: string;
    honestServerNote: string;
  };
  pdfToWord: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadDocx: string;
    convertAnother: string;
    featureFidelity: string;
    featureFidelityDesc: string;
    featureEditable: string;
    featureEditableDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  pdfToExcel: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadXlsx: string;
    convertAnother: string;
    featureTables: string;
    featureTablesDesc: string;
    featureCells: string;
    featureCellsDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  pdfToPptx: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPptx: string;
    convertAnother: string;
    featureSlides: string;
    featureSlidesDesc: string;
    featureLayout: string;
    featureLayoutDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  pdfToText: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadTxt: string;
    copyText: string;
    copiedText: string;
    previewText?: string;
    convertAnother: string;
    featureEncoding: string;
    featureEncodingDesc: string;
    featureClean: string;
    featureCleanDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfWatermark: {
    cardTitle: string;
    watermarkText: string;
    fontSize: (n: number) => string;
    opacity: (pct: number) => string;
    color: string;
    colors: { gray: string; black: string; red: string; blue: string };
    applyBtn: string;
    applying: string;
    error: string;
    rotation?: string;
    presets?: string;
    livePreview?: string;
    pagesScope?: string;
    pagesScopeAll?: string;
    pagesScopeFirst?: string;
    pagesScopeCustom?: string;
    downloadWatermarked?: string;
    changeFile?: string;
    honestServerNote: string;
  };
  pdfPageNumbers: {
    cardTitle: string;
    position: string;
    positions: {
      bottomCenter: string;
      bottomRight: string;
      bottomLeft: string;
      topCenter: string;
      topRight: string;
      topLeft: string;
    };
    startNumber: string;
    fontSize: string;
    applyBtn: string;
    applying: string;
    error: string;
    format?: string;
    formatSimple?: string;
    formatPageN?: string;
    formatPageNofTotal?: string;
    formatFraction?: string;
    skipFirstCover?: string;
    skipFirstCoverDesc?: string;
    downloadNumbered?: string;
    changeFile?: string;
    livePreview?: string;
    honestServerNote: string;
  };
  reorderPdf: {
    instructions: string;
    savePdf: string;
    saving: string;
    pageCount: (n: number) => string;
    loadDifferent: string;
    loadingThumbs: string;
    loadFailed: string;
    saveFailed: string;
    moveLeft?: string;
    moveRight?: string;
    reverseOrder?: string;
    resetOrder?: string;
    deletePage?: string;
    saveReorderedPdf?: string;
    honestServerNote: string;
  };
  pdfToHtml: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadHtml: string;
    convertAnother: string;
    featureStructure: string;
    featureStructureDesc: string;
    featureResponsive: string;
    featureResponsiveDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfToMarkdown: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadMd: string;
    copyMd: string;
    copiedMd: string;
    convertAnother: string;
    featureSyntax: string;
    featureSyntaxDesc: string;
    featureTables: string;
    featureTablesDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfToEpub: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadEpub: string;
    convertAnother: string;
    featureFlowable: string;
    featureFlowableDesc: string;
    featureReader: string;
    featureReaderDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestClientNote: string;
  };
  pdfToImage: {
    format: string;
    resolution: string;
    standardDpi: string;
    highDpi: string;
    maxDpi: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadImages: string;
    convertAnother: string;
    featureHighRes: string;
    featureHighResDesc: string;
    featureZip: string;
    featureZipDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfToPdfa: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdfa: string;
    convertAnother: string;
    featureCompliance: string;
    featureComplianceDesc: string;
    featureFonts: string;
    featureFontsDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfOcr: {
    language: string;
    langAll: string;
    langEng: string;
    langFra: string;
    langSpa: string;
    langDeu: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadTxt: string;
    copyText: string;
    copiedText: string;
    convertAnother: string;
    featureOcr: string;
    featureOcrDesc: string;
    featureMultilingual: string;
    featureMultilingualDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfRepair: {
    repairBtn: string;
    repairing: string;
    error: string;
    readyBadge: string;
    downloadRepaired: string;
    convertAnother: string;
    featureXref: string;
    featureXrefDesc: string;
    featureStream: string;
    featureStreamDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  pdfMetadata: {
    cardTitle: string;
    titleField: string;
    authorField: string;
    subjectField: string;
    keywordsField: string;
    keywordsPlaceholder: string;
    creatorField: string;
    producerField: string;
    saveBtn: string;
    saving: string;
    downloadPdf: string;
    changeFile: string;
    readyBadge: string;
    featureLocal: string;
    featureLocalDesc: string;
    featureFullControl: string;
    featureFullControlDesc: string;
    featureInstant: string;
    featureInstantDesc: string;
    honestClientNote: string;
  };
  wordToPdf: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureFidelity: string;
    featureFidelityDesc: string;
    featureLayout: string;
    featureLayoutDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  excelToPdf: {
    sheetLabel: string;
    allSheets: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureGrid: string;
    featureGridDesc: string;
    featureSheets: string;
    featureSheetsDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  pptxToPdf: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureSlides: string;
    featureSlidesDesc: string;
    featureLayout: string;
    featureLayoutDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  imageToPdf: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureMultiImage: string;
    featureMultiImageDesc: string;
    featureQuality: string;
    featureQualityDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    filesSelected: (n: number) => string;
    honestServerNote: string;
  };
  htmlToPdf: {
    tabUpload: string;
    tabPaste: string;
    pastePlaceholder: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureHtml5: string;
    featureHtml5Desc: string;
    featureStyling: string;
    featureStylingDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  markdownToPdf: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureTypography: string;
    featureTypographyDesc: string;
    featureSyntax: string;
    featureSyntaxDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  txtToPdf: {
    tabUpload: string;
    tabPaste: string;
    pastePlaceholder: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadPdf: string;
    convertAnother: string;
    featureFormatting: string;
    featureFormattingDesc: string;
    featureEncoding: string;
    featureEncodingDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1?: string;
    statusMilestone2?: string;
    statusMilestone3?: string;
    statusMilestone4?: string;
    honestServerNote: string;
  };
  wordToText: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadTxt: string;
    copyText: string;
    copiedText: string;
    convertAnother: string;
    featureExtract: string;
    featureExtractDesc: string;
    featureClean: string;
    featureCleanDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    honestServerNote: string;
  };
  wordToHtml: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadHtml: string;
    copyHtml: string;
    copiedHtml: string;
    convertAnother: string;
    featureSemantic: string;
    featureSemanticDesc: string;
    featureStyles: string;
    featureStylesDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    honestServerNote: string;
  };
  wordToMarkdown: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadMd: string;
    copyMd: string;
    copiedMd: string;
    convertAnother: string;
    featureFormatting: string;
    featureFormattingDesc: string;
    featureTables: string;
    featureTablesDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    honestServerNote: string;
  };
  wordToEpub: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadEpub: string;
    convertAnother: string;
    featureReflow: string;
    featureReflowDesc: string;
    featureEreader: string;
    featureEreaderDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestClientNote: string;
  };
  markdownToDocx: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadDocx: string;
    convertAnother: string;
    featureStyles: string;
    featureStylesDesc: string;
    featureOpenXml: string;
    featureOpenXmlDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    honestServerNote: string;
  };
  txtToDocx: {
    tabUpload: string;
    tabPaste: string;
    pastePlaceholder: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadDocx: string;
    convertAnother: string;
    featureEditable: string;
    featureEditableDesc: string;
    featureMargins: string;
    featureMarginsDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    honestServerNote: string;
  };
  excelToCsv: {
    sheetLabel: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadCsv: string;
    convertAnother: string;
    featureSheets: string;
    featureSheetsDesc: string;
    featureDelimiters: string;
    featureDelimitersDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestClientNote: string;
  };
  csvToExcel: {
    tabUpload: string;
    tabPaste: string;
    pastePlaceholder: string;
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadXlsx: string;
    convertAnother: string;
    featureAutoType: string;
    featureAutoTypeDesc: string;
    featureOpenXml: string;
    featureOpenXmlDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestClientNote: string;
  };
  pptxToImages: {
    convertBtn: string;
    converting: string;
    error: string;
    readyBadge: string;
    downloadZip: string;
    convertAnother: string;
    featureSlides: string;
    featureSlidesDesc: string;
    featureZip: string;
    featureZipDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    slidesCount: (n: number) => string;
    honestServerNote: string;
  };
  imageUpscale: {
    scaleLabel: string;
    sharpenLabel: string;
    sharpenDesc: string;
    upscaleBtn: string;
    upscaling: string;
    error: string;
    readyBadge: string;
    downloadImage: string;
    convertAnother: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    featureScale: string;
    featureScaleDesc: string;
    featureSharpen: string;
    featureSharpenDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestServerNote: string;
  };
  checksum: {
    verifyPlaceholder: string;
    matchSuccess: string;
    matchMismatch: string;
    copyHash: string;
    checkAnother: string;
    verifyTitle: string;
    statusMilestone1: string;
    statusMilestone2: string;
    statusMilestone3: string;
    statusMilestone4: string;
    featureMultiAlgo: string;
    featureMultiAlgoDesc: string;
    featureVerification: string;
    featureVerificationDesc: string;
    featurePrivate: string;
    featurePrivateDesc: string;
    honestClientNote: string;
  };
};

const EN: Translations = {
  nav: {
    searchPlaceholder: "Search tools...",
    breadcrumb: {
      home: "Home", pdf: "PDF Tools", word: "Word Tools", image: "Image Tools",
      privacy: "Privacy Tools", calculators: "Utilities & Network", tools: "Tools",
      textCode: "Text & Code", excelSpreadsheets: "Excel & Spreadsheets", documents: "Documents",
    },
    groups: {
      pdf: "PDF Tools",
      documents: "Documents",
      images: "Images",
      textCode: "Text & Code",
      tools: "Tools",
    },
    links: {
      // PDF
      "pdf-to-word": "PDF to Word",
      "pdf-to-text": "PDF to Text",
      "pdf-to-html": "PDF to HTML",
      "pdf-to-epub": "PDF to EPUB",
      "pdf-merge": "Merge PDFs",
      "pdf-split": "Split PDF",
      "pdf-rotate": "Rotate PDF",
      "pdf-unlock": "Unlock PDF",
      "pdf-protect": "Protect PDF",
      "pdf-page-numbers": "Add Page Numbers",
      "pdf-watermark": "Watermark PDF",
      "pdf-compress": "Compress PDF",
      "pdf-to-image": "PDF to Image",
      "pdf-to-excel": "PDF to Excel",
      "reorder-pdf": "Reorder Pages",
      "ocr": "OCR: Image to Text",
      // Documents
      "word-to-pdf": "Word to PDF",
      "word-to-text": "Word to Text",
      "word-to-html": "Word to HTML",
      "word-to-epub": "Word to EPUB",
      "word-to-markdown": "Word to Markdown",
      "html-to-markdown": "HTML to Markdown",
      "markdown-to-pdf": "Markdown to PDF",
      "markdown-to-docx": "Markdown to Word",
      "html-to-pdf": "HTML to PDF",
      "txt-to-pdf": "Text to PDF",
      "txt-to-docx": "Text to Word",
      "excel-to-pdf": "Excel to PDF",
      "excel-to-csv": "Excel to CSV",
      "csv-to-excel": "CSV to Excel",
      "csv-to-json": "CSV ↔ JSON",
      "csv-viewer": "CSV Viewer",
      "pptx-to-pdf": "PowerPoint to PDF",
      "pptx-to-images": "PowerPoint to Images",
      "pdf-to-pptx": "PDF to PowerPoint",
      // Images
      "image-converter": "Image Converter",
      "image-compress": "Compress Image",
      "image-resize": "Resize Image",
      "image-crop": "Crop Image",
      "image-to-pdf": "Image to PDF",
      "background-remover": "Background Remover",
      "flip-rotate-image": "Flip & Rotate",
      "watermark-image": "Add Watermark",
      "favicon-generator": "Favicon Generator",
      "heic-to-jpg": "HEIC to JPG",
      "heic-to-png": "HEIC to PNG",
      "heic-to-webp": "HEIC to WebP",
      "heic-to-pdf": "HEIC to PDF",
      "png-to-webp": "PNG to WebP",
      "jpg-to-webp": "JPG to WebP",
      "gif-to-webp": "GIF to WebP",
      "bmp-to-webp": "BMP to WebP",
      "tiff-to-webp": "TIFF to WebP",
      "webp-to-png": "WebP to PNG",
      "webp-to-jpg": "WebP to JPG",
      "webp-to-pdf": "WebP to PDF",
      "webp-to-avif": "WebP to AVIF",
      "jpg-to-avif": "JPG to AVIF",
      "png-to-avif": "PNG to AVIF",
      "avif-to-jpg": "AVIF to JPG",
      "avif-to-png": "AVIF to PNG",
      "jpg-to-png": "JPG to PNG",
      "png-to-jpg": "PNG to JPG",
      "png-to-svg": "PNG to SVG",
      "svg-to-png": "SVG to PNG",
      "gif-to-png": "GIF to PNG",
      "bmp-to-jpg": "BMP to JPG",
      "tiff-to-jpg": "TIFF to JPG",
      "tiff-to-png": "TIFF to PNG",
      "jpg-to-pdf": "JPG to PDF",
      "png-to-pdf": "PNG to PDF",
      // Text & Code
      "json-formatter": "JSON Formatter",
      "html-formatter": "HTML Formatter",
      "base64": "Base64 Encode / Decode",
      "url-encoder": "URL Encode / Decode",
      "word-counter": "Word Counter",
      "lorem-ipsum": "Lorem Ipsum",
      // Privacy & Tools
      "metadata-cleaner": "Metadata Cleaner",
      "ai-text-scrubber": "AI Text Scrubber",
      "checksum": "File Checksum",
      "password-generator": "Password Generator",
      "currency-converter": "Currency Converter",
      "unit-converter": "Unit Converter",
      "qr-code-generator": "QR Code Generator",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Your browser, upgraded. 86+ free tools for everyday tasks. Convert PDFs, edit images, format code, and crunch numbers with complete privacy and zero sign-ups.",
    allTools: "All Tools",
    allToolsSubtitle: (n: number) => `Browse all ${n} free tools for documents, images, and daily productivity. Fast, private, and no signup needed.`,
    categories: {
      pdf: "PDF Tools",
      word: "Word & Docs",
      image: "Image Tools",
      privacy: "Privacy",
      calculators: "Utilities & Network",
    },
    toolCategory: {
      pdf: "PDF",
      word: "Document",
      image: "Image",
      privacy: "Privacy",
      calculators: "Utility",
    },
    sectionLabels: {
      Documents: "Documents",
      Images: "Images",
      Privacy: "Privacy",
      Calculators: "Calculators",
    },
    sectionDescriptions: {
      Documents: "PDF and Word file tools",
      Images: "Convert, compress, and process images",
      Privacy: "Strip metadata and AI watermarks",
      Calculators: "Conversions, generators, and calculators",
    },
    toolCount: (n) => `${n} ${n === 1 ? "tool" : "tools"}`,
    resultCount: (n) => `${n} ${n === 1 ? "result" : "results"}`,
    resultsFor: "for",
    noResults: (q) => `No tools match "${q}"`,
    clearSearch: "Clear search",
    recentlyUsed: "Recently used",
    pinned: "Pinned",
  },
  tools: {
    "pdf-to-word": { title: "PDF to Word", description: "Turns a PDF into a DOCX file you can edit in Word. Works well on text-based PDFs. Scanned or image-heavy files produce simpler output." },
    "pdf-to-text": { title: "PDF to Text", description: "Extracts every word from a PDF as plain text. Strips all formatting, which is useful when you need the content without the layout. Works on any PDF, regardless of how complex the original design is." },
    "pdf-to-html": { title: "PDF to HTML", description: "Converts a PDF into HTML markup. Results depend on how the original PDF was structured. Works best on straightforward text documents." },
    "pdf-to-epub": { title: "PDF to EPUB", description: "Converts a PDF to EPUB format for reading on Kindle, Apple Books, or similar apps. Text-heavy documents with simple layouts convert cleanest. Give it a try if you want to read PDF content comfortably on a phone or tablet." },
    "pdf-compress": { title: "Compress PDF", description: "Reduces a PDF file size. Useful when a file is too large to email or upload somewhere with a size limit. Pick a compression level that fits your needs and download the result in seconds." },
    "pdf-merge": { title: "Merge PDFs", description: "Combines multiple PDFs into one file. Drag them into the right order before merging if the page sequence matters. Useful for combining reports, invoices, or any set of related documents into a single package." },
    "pdf-split": { title: "Split PDF", description: "Cuts a PDF into individual pages or custom page ranges. Good when you only need part of a long document. Save time by extracting exactly what you need instead of working with the whole file." },
    "pdf-rotate": { title: "Rotate PDF", description: "Rotates PDF pages 90, 180, or 270 degrees. Fixes scanned documents that came out sideways. Apply the correction to one page or every page at once." },
    "pdf-unlock": { title: "Unlock PDF", description: "Removes owner-level restrictions from a PDF, such as copy-paste blocks or print bans. Does not bypass the password required to open the file. Great for regaining full access to your own locked documents." },
    "pdf-protect": { title: "Protect PDF", description: "Adds a password to a PDF. Anyone who tries to open it will need to enter the password you set. Use it to protect contracts, personal documents, or any sensitive file before sharing." },
    "pdf-page-numbers": { title: "Add Page Numbers", description: "Stamps page numbers onto every page of a PDF. Set the starting number, position, and font size. Comes in handy for manuscripts, reports, and any multi-page document that needs organization." },
    "pdf-watermark": { title: "Watermark PDF", description: "Adds a text watermark across every page of a PDF. Control what it says, the opacity, and the rotation angle. Perfect for marking drafts, confidential files, or adding branding to your documents." },
    "word-to-text": { title: "Word to Text", description: "Extracts the plain text from a Word document. Strips all styles and formatting, leaving just the words. Handy when you need the raw content without hidden formatting or tracked changes." },
    "word-to-html": { title: "Word to HTML", description: "Converts a DOCX file to HTML. Useful for putting document content into a webpage or CMS. The output is clean and ready to use with minimal cleanup required." },
    "word-to-epub": { title: "Word to EPUB", description: "Converts a Word document to EPUB. Straightforward documents with clear headings and paragraphs convert cleanest. Read your converted documents on any e-reader, phone, or tablet." },
    "markdown-to-pdf": { title: "Markdown to PDF", description: "Renders a Markdown file as a PDF. Headings, lists, tables, and code blocks all come through correctly. Perfect for turning documentation, notes, or README files into a shareable format." },
    "markdown-to-docx": { title: "Markdown to Word", description: "Converts a Markdown file to a Word document. Good for when you write in Markdown but need to send a .docx. Formatting carries over cleanly, so collaborators see the structure you intended." },
    "html-to-pdf": { title: "HTML to PDF", description: "Converts HTML to a PDF. Paste your markup, check the preview, and download. Great for archiving web pages or generating printable reports from HTML." },
    "txt-to-pdf": { title: "Text to PDF", description: "Converts a plain text file to PDF with proper margins and line wrapping. Content is wrapped automatically for a clean, readable layout. No special formatting needed — just upload your .txt and download the result." },
    "txt-to-docx": { title: "Text to Word", description: "Converts a .txt file to a Word document. For when someone needs .docx and you only have plain text. Saves you the hassle of manually formatting plain text inside Word." },
    "image-converter": { title: "Image Converter", description: "Converts images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, ICO, and SVG. Handles batches of up to 20 files. All processing happens in your browser, so nothing gets uploaded to a server." },
    "heic-to-jpg": { title: "HEIC to JPG", description: "Converts iPhone HEIC photos to JPEG. HEIC is standard on Apple devices but most apps and websites still won't open it. Convert your photos once and share them anywhere without compatibility worries." },
    "image-compress": { title: "Compress Image", description: "Reduces image file size using a quality slider. The before and after sizes update as you adjust. Lets you find the perfect balance between visual quality and file size." },
    "image-resize": { title: "Resize Image", description: "Resizes images by pixel dimensions or percentage. Lock the aspect ratio or stretch it freely. Perfect for preparing images for social media, email, or website uploads." },
    "image-crop": { title: "Crop Image", description: "Crops images with drag handles. Includes presets for 1:1, 16:9, 4:3, and other common ratios. Position your crop exactly where you want it before downloading at full resolution." },
    "image-to-pdf": { title: "Image to PDF", description: "Combines one or more images into a PDF. Add multiple images and reorder them before generating. Useful for turning scanned photos or screenshots into a single document." },
    "pdf-to-image": { title: "PDF to Image", description: "Convert PDF pages into high-resolution PNG, JPG, WEBP, AVIF, TIFF, or GIF images." },
    "background-remover": { title: "Background Remover", description: "Removes image backgrounds using a server-side AI model. Upload your image and get a transparent PNG in seconds. The result is ready to use in designs, presentations, or as a product photo." },
    "metadata-cleaner": { title: "Metadata Cleaner", description: "Strips EXIF, XMP, and document metadata from photos and PDFs. Removes GPS coordinates, device info, and author names before sharing. An essential step before publishing files online to protect your privacy." },
    "ai-text-scrubber": { title: "AI Text Scrubber", description: "Removes invisible Unicode characters and patterns that AI detection tools flag. Paste your text, clean it, copy the result. Your text reads exactly the same, but without the embedded invisible signals." },
    "password-generator": { title: "Password Generator", description: "Generates cryptographically random passwords using the browser's built-in randomness. Shows entropy in bits so you can see how strong each one is. Customize length, include symbols and numbers, and generate multiple passwords at once." },
    "unit-converter": { title: "Unit Converter", description: "Converts between 200 units across 13 categories including length, weight, temperature, area, volume, and speed. Results update as you type. Pin your most-used conversions for quick access anytime you come back." },
    "currency-converter": { title: "Currency Converter", description: "Live exchange rates for 170 currencies, updated every hour. Falls back to cached rates if the API is unavailable. Track recent conversions and use quick shortcuts for the pairs you check most often." },
    "qr-code-generator": { title: "QR Code Generator", description: "Creates QR codes from URLs, plain text, Wi-Fi credentials, or contact cards. Download as PNG or SVG. Perfect for sharing links, connecting guests to Wi-Fi, or adding digital business cards." },
    "document-converter": { title: "Document Converter", description: "Converts PDFs, Word documents, and text files between formats. Processing runs in the browser. No files are uploaded anywhere — your documents stay on your machine the whole time." },
    "pdf-to-excel": { title: "PDF to Excel", description: "Extracts tables from a PDF and puts them into an Excel spreadsheet. Works well on structured data. Scanned PDFs produce messier results." },
    "reorder-pdf": { title: "Reorder PDF Pages", description: "Drag PDF pages into a new order and remove any you do not want, then download the result. Reorganize entire documents in seconds without installing any software. Perfect for fixing the page order of scanned files or rearranging presentation slides." },
    "ocr": { title: "OCR: Image to Text", description: "Reads text from images and scanned documents using Tesseract.js. The recognition runs in the browser with no server involved. Supports multiple languages and works well on clear, high-contrast text." },
    "word-to-pdf": { title: "Word to PDF", description: "Converts a DOCX to PDF. Useful for sharing documents that need to look the same on any device. Fonts, tables, and page breaks all carry over, so what you see is what they get." },
    "word-to-markdown": { title: "Word to Markdown", description: "Converts a Word document to Markdown. Headings, bold, italic, and lists translate well. Complex formatting gets simplified." },
    "html-to-markdown": { title: "HTML to Markdown", description: "Converts HTML into Markdown. Strips the tags and produces readable plain-text Markdown. Ideal for migrating content from a CMS or website to a Markdown-based platform." },
    "excel-to-pdf": { title: "Excel to PDF", description: "Converts an Excel spreadsheet to PDF in the browser. Each sheet becomes a page in the output. Charts, tables, and formatting are all preserved in the exported PDF." },
    "excel-to-csv": { title: "Excel to CSV", description: "Exports Excel sheets as CSV files. Each sheet becomes one CSV file. CSV is the universal format for moving data between spreadsheets, databases, and analytics tools." },
    "csv-to-excel": { title: "CSV to Excel", description: "Converts a CSV file to an Excel workbook. Column types are auto-detected where the data is clear. No import wizard needed — just upload the CSV and download a proper .xlsx file." },
    "csv-to-json": { title: "CSV \u2194 JSON", description: "Converts between CSV and JSON. Paste one format and get the other. Column headers become JSON keys." },
    "csv-viewer": { title: "CSV Viewer", description: "Opens a CSV and displays it as a sortable table in the browser. No spreadsheet software required. Click column headers to sort data and inspect values in a clean, readable layout." },
    "pptx-to-pdf": { title: "PowerPoint to PDF", description: "Converts a PowerPoint file to PDF. Each slide becomes a page in the output. Share presentations with anyone, even if they don't have PowerPoint installed." },
    "pptx-to-images": { title: "PowerPoint to Images", description: "Exports each slide in a PowerPoint as a PNG image. All slides download together as a ZIP. Useful for pulling individual slides into design tools or embedding them in other documents." },
    "pdf-to-pptx": { title: "PDF to PowerPoint", description: "Converts each PDF page into a PowerPoint slide as an embedded image. Lets you use existing PDF content inside PowerPoint without redrawing anything. Each page becomes a slide you can position, annotate, or present directly." },
    "heic-to-png": { title: "HEIC to PNG", description: "Converts HEIC photos to PNG. PNG is lossless and opens in every image viewer. Perfect for when you need full quality without compatibility issues." },
    "heic-to-webp": { title: "HEIC to WebP", description: "Converts HEIC photos to WebP. WebP files are smaller than JPEG at similar quality. A great choice for the web since WebP loads faster and saves bandwidth." },
    "heic-to-pdf": { title: "HEIC to PDF", description: "Packages HEIC photos into a PDF document. Each photo becomes a page in the output. Useful for sharing multiple iPhone photos as a single document." },
    "flip-rotate-image": { title: "Flip & Rotate Image", description: "Flips images horizontally or vertically, or rotates by any angle. Good for fixing phone photos that came out sideways. Works at full resolution, so you never lose quality from the rotation." },
    "watermark-image": { title: "Add Watermark", description: "Adds a text watermark to an image. Set the position, font size, opacity, and color. Protect your work or brand your images before sharing them online." },
    "favicon-generator": { title: "Favicon Generator", description: "Generates a full set of favicon sizes from any image. Downloads as a ZIP with PNG files and an .ico file. Everything you need for browser tabs, PWAs, and mobile home screen icons in one download." },
    "png-to-webp": { title: "PNG to WebP", description: "Converts PNG to WebP. WebP is smaller than PNG for most images at high quality settings. A quick way to shrink images without visibly changing how they look." },
    "jpg-to-webp": { title: "JPG to WebP", description: "Converts JPEG to WebP. WebP usually compresses better than JPEG at the same visual quality. Switch your images to WebP for faster page loads and lower bandwidth usage." },
    "gif-to-webp": { title: "GIF to WebP", description: "Converts GIF to WebP. WebP supports animation and is typically smaller than an equivalent GIF. Get the same animation at a fraction of the file size." },
    "bmp-to-webp": { title: "BMP to WebP", description: "Converts BMP to WebP. BMP files are uncompressed and large. WebP is much more practical for sharing." },
    "tiff-to-webp": { title: "TIFF to WebP", description: "Converts TIFF to WebP. Useful for shrinking scanned documents or images from photography workflows. Dramatically smaller files without sacrificing visual quality." },
    "webp-to-png": { title: "WebP to PNG", description: "Converts WebP to PNG. Useful when you need a format that older tools still recognize. Keeps full quality for use in design apps, print, or archiving." },
    "webp-to-jpg": { title: "WebP to JPG", description: "Converts WebP to JPEG. JPEG opens in any photo app or browser. The universal fallback format when WebP is not supported by the receiving app." },
    "webp-to-pdf": { title: "WebP to PDF", description: "Embeds a WebP image in a PDF document. Each WebP file becomes a page in the output. Useful for including web-optimized images in a clean, printable format." },
    "webp-to-avif": { title: "WebP to AVIF", description: "Converts WebP to AVIF. AVIF compresses further than WebP at similar visual quality. Upgrade your images to the latest format for even better compression rates." },
    "jpg-to-avif": { title: "JPG to AVIF", description: "Converts JPEG to AVIF. AVIF typically produces smaller files than JPEG at the same quality. Future-proof your images with the next generation of compression technology." },
    "png-to-avif": { title: "PNG to AVIF", description: "Converts PNG to AVIF. Worth trying on large images since AVIF handles both lossy and lossless compression well. Great for reducing storage without deciding between quality modes upfront." },
    "avif-to-jpg": { title: "AVIF to JPG", description: "Converts AVIF to JPEG. JPEG works in any browser or photo app. The safest fallback when you need universal compatibility." },
    "avif-to-png": { title: "AVIF to PNG", description: "Converts AVIF to PNG. PNG is lossless and opens in every modern image viewer. Go back to a fully lossless format when compatibility matters more than file size." },
    "jpg-to-png": { title: "JPG to PNG", description: "Converts JPEG to PNG. PNG is lossless and supports transparency, which JPEG does not. Useful when you need a transparent background or want to avoid compression artifacts." },
    "png-to-jpg": { title: "PNG to JPG", description: "Converts PNG to JPEG. JPEG produces smaller files for photos, though some detail is discarded in compression. Good for shrinking images before uploading where every kilobyte counts." },
    "png-to-svg": { title: "PNG to SVG", description: "Wraps a PNG image inside an SVG container. The image stays raster. This is for SVG embedding workflows, not vectorizing." },
    "svg-to-png": { title: "SVG to PNG", description: "Rasterizes an SVG to PNG. Set the output dimensions and the vector gets drawn at that resolution. Perfect for exporting icons and logos at exact sizes for web or print use." },
    "gif-to-png": { title: "GIF to PNG", description: "Extracts the first frame of a GIF as a PNG still. Useful when you need a static image from an animated file. Creates a clean thumbnail or preview without keeping the animation." },
    "bmp-to-jpg": { title: "BMP to JPG", description: "Converts BMP to JPEG. BMP files are uncompressed and very large. JPEG handles photos at a fraction of the size." },
    "tiff-to-jpg": { title: "TIFF to JPG", description: "Converts TIFF to JPEG. TIFF is common in photography and scanning but JPEG is more practical for sharing. A simple way to make large scans email-friendly without a noticeable drop in quality." },
    "tiff-to-png": { title: "TIFF to PNG", description: "Converts TIFF to PNG. PNG keeps lossless quality and opens in any modern image viewer. Get the same high quality with better compatibility across all platforms." },
    "jpg-to-pdf": { title: "JPG to PDF", description: "Packages a JPEG into a PDF. Common for sharing photos through systems that only accept PDFs. Combine multiple JPEGs into one PDF with each photo on its own page." },
    "png-to-pdf": { title: "PNG to PDF", description: "Packages a PNG into a PDF. Common for exporting screenshots or diagrams in a fixed-layout format. Keep your images in order and share them as one clean document." },
    "checksum": { title: "File Checksum", description: "Calculates SHA-256, SHA-1, SHA-384, or SHA-512 checksums for any file. Compare the result against a published hash to confirm a download was not corrupted. A must-have tool for verifying file integrity after downloading from the internet." },
    "json-formatter": { title: "JSON Formatter", description: "Formats and validates JSON. Also minifies it. Paste messy JSON and get clean indented output, or the reverse." },
    "html-formatter": { title: "HTML Formatter", description: "Formats messy HTML into readable indented code. Also minifies it when you need to strip whitespace. Handles any HTML snippet, from inline markup to full documents." },
    "base64": { title: "Base64 Encoder / Decoder", description: "Encodes text or files to Base64, or decodes Base64 back to readable text. Common in email attachments, data URIs, and API authentication. Works with both text input and file uploads for maximum flexibility." },
    "url-encoder": { title: "URL Encoder / Decoder", description: "Encodes and decodes URL components in real time. Useful for query strings that contain special characters. Results update as you type, so there is no waiting around." },
    "word-counter": { title: "Word & Character Counter", description: "Counts words, characters, sentences, and paragraphs as you type. Gives a reading time estimate based on average reading pace. Perfect for hitting word count targets or keeping your content concise." },
    "lorem-ipsum": { title: "Lorem Ipsum Generator", description: "Generates placeholder text for designs and prototypes. Set how many paragraphs, sentences, or words you want. Classic Lorem Ipsum included — just pick the amount you need and copy it." },
    "image-upscale": { title: "Image Upscaler", description: "Enlarges images by 2x or 4x with sharp detail preservation and unsharp masking." },
    "image-filters": { title: "Image Filters & Effects", description: "Applies grayscale, sepia, invert, blur, brightness, contrast, and hue effects in real time." },
    "pdf-to-pdfa": { title: "PDF to PDF/A", description: "Converts PDF documents into ISO-standardized PDF/A-2b format for guaranteed long-term preservation." },
    "pdf-repair": { title: "Repair PDF", description: "Recovers and repairs corrupted, broken, or unreadable PDF documents." },
    "pdf-ocr": { title: "PDF OCR", description: "Extracts editable text from scanned PDF documents and document images." },
    "pdf-metadata": { title: "Edit PDF Metadata", description: "Views and updates PDF Title, Author, Subject, Keywords, Creator, and Producer properties." },
    "pdf-to-markdown": { title: "PDF to Markdown", description: "Converts PDF documents into clean, structured Markdown syntax." },
    "odt-to-pdf": { title: "ODT to PDF", description: "Converts OpenDocument ODT files to PDF with full layout fidelity." },
    "rtf-to-pdf": { title: "RTF to PDF", description: "Converts Rich Text Format RTF documents to PDF." },
    "data-converter": { title: "Data Converter", description: "Converts structured data between JSON, CSV, XML, and YAML formats in real-time." },
    "json-diff": { title: "JSON Diff", description: "Compares two JSON payloads side-by-side to highlight additions, deletions, and modifications." },
    "csv-editor": { title: "CSV Editor", description: "Online interactive spreadsheet grid to edit, manage columns, and export CSV/Excel files." },
    "css-formatter": { title: "CSS Formatter & Minifier", description: "Minifies stylesheets for fast loading or beautifies compressed CSS into readable blocks." },
    "js-formatter": { title: "JS / TS Beautifier", description: "Cleans and formats JavaScript and TypeScript code with standard indentation." },
    "markdown-preview": { title: "Markdown Live Editor", description: "Live split-screen Markdown editor with real-time HTML preview and export." },
    "diff-checker": { title: "Text Diff Checker", description: "Compares two text snippets to highlight additions, deletions, and modifications." },
    "regex-tester": { title: "Regex Tester", description: "Tests regular expressions with real-time matching, groups extraction, and string replacement." },
    "jwt-decoder": { title: "JWT Token Decoder", description: "Decodes JSON Web Tokens (header, payload, claims) and checks expiration securely." },
    "barcode-generator": { title: "Barcode Generator", description: "Generates CODE128, EAN-13, UPC-A, and CODE39 barcodes as vector SVG or PNG." },
    "hash-generator": { title: "Hash Generator", description: "Computes SHA-256, SHA-512, SHA-384, and SHA-1 hashes simultaneously using SubtleCrypto." },
    "uuid-generator": { title: "UUID Generator", description: "Generates cryptographic RFC 4122 v4 UUIDs in bulk with custom options." },
    "color-converter": { title: "Color Converter", description: "Converts colors between HEX, RGB, HSL, and CMYK color spaces with live preview." },
    "color-palette": { title: "Color Palette Generator", description: "Generates balanced color harmonies and exports CSS/HEX color codes." },
    "speed-test": { title: "Internet Speed Test", description: "Measures internet download speeds and response ping latency in real time." },
  },
  ui: {
    dropzone: "Drop file here or click to browse",
    dropzoneHint: (accept, maxMb) => `${accept} · max ${maxMb} MB`,
    lightMode: "Light mode",
    darkMode: "Dark mode",
    loading: "Loading…",
    fileExceedsSize: (fn, maxMb) => `${fn} exceeds the ${maxMb} MB limit.`,
    formatNotAccepted: (fn) => `${fn} — format not accepted.`,
    uploadAriaLabel: (label, formats, maxMb) => `${label}. Drag and drop or press Enter to browse. Accepts ${formats}, up to ${maxMb} MB.`,
    defaultUploadAriaLabel: (formats, maxMb) => `Upload file. Drag and drop or press Enter to browse. Accepts ${formats}, up to ${maxMb} MB.`,
    note: "Note:",
    removeFileAria: (fn) => `Remove ${fn}`,
  },
  footer: {
    tagline: "A collection of browser-based tools for everyday file tasks. Fast, private, and free.",
    rights: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePreferences: "Cookie Preferences",
    security: "Security",
    columns: { pdf: "PDF Tools", images: "Image Tools", utilities: "Utilities" },
  },
  cookie: {
    message: "We respect your privacy — our analytics are completely anonymous with no cookies and no personal data. With your OK, a few ads help keep every tool free for everyone. Your files are",
    neverUploaded: "never uploaded",
    privacyPolicy: "Privacy policy",
    essentialOnly: "Essential only",
    acceptAll: "Accept all",
  },
  notFound: {
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    backHome: "Back to all tools",
  },
  tipCalc: {
    tabTip: "Tip Calculator", tabPercent: "Percentages",
    billAmount: "Bill Amount", tipPct: "Tip Percentage", numPeople: "Number of People",
    bill: "Bill", tip: (pct) => `Tip (${pct}%)`, total: "Total",
    tipPerPerson: "Tip / person", totalPerPerson: "Total / person",
    pctOf: "What is X% of Y?", whatIs: "What is", isWhatPctOf: "is what % of",
    pctChange: "% change from X to Y", pctChangeFrom: "% change from", pctChangeTo: "to",
  },
  pctCalc: {
    tabs: { of: "X % of Y", isWhat: "X is what % of Y", change: "Percentage Change", discount: "Discount", tip: "Tip & Split", markup: "Markup / Margin" },
    labels: {
      whatIsPct: "What is (X)%", ofY: "of (Y)", xIsWhat: "(X) is what percent", changeFrom: "Change from (X)", changeTo: "to (Y)",
      discountPct: "Discount % (X)", origPrice: "Original Price (Y)", tipPct: "Tip % (X)", billAmount: "Bill Amount (Y)",
      splitBetween: "Split between (People)", marginPct: "Margin % (X)", cost: "Cost (Y)",
    },
    result: "Result", increase: "Increase", decrease: "Decrease",
    finalPrice: "Final", saved: "Saved", tipLabel: "Tip",
    perPerson: "Per Person", sellingPrice: "Selling Price", markupLabel: "Markup",
  },
  unitConverter: {
    from: "From", to: "To", pin: "Pin", pinned: "Pinned",
    pinnedConversions: "Pinned Conversions", swapAriaLabel: "Swap units",
    categoryNames: {
      length: "Length", weight: "Weight", temperature: "Temperature", volume: "Volume",
      area: "Area", speed: "Speed", pressure: "Pressure", energy: "Energy",
      power: "Power", data: "Data", time: "Time", angle: "Angle", frequency: "Frequency",
    },
    unitNames: {
      "meter": "Meter", "kilometer": "Kilometer", "centimeter": "Centimeter", "millimeter": "Millimeter",
      "mile": "Mile", "yard": "Yard", "foot": "Foot", "inch": "Inch",
      "nautical-mile": "Nautical Mile", "light-year": "Light Year",
      "kilogram": "Kilogram", "gram": "Gram", "milligram": "Milligram",
      "pound": "Pound", "ounce": "Ounce", "stone": "Stone",
      "ton-metric": "Ton (Metric)", "ton-imperial": "Ton (Imperial)", "ton-us": "Ton (US)",
      "celsius": "Celsius", "fahrenheit": "Fahrenheit", "kelvin": "Kelvin",
      "liter": "Liter", "milliliter": "Milliliter",
      "gallon-us": "Gallon (US)", "gallon-uk": "Gallon (UK)",
      "quart": "Quart", "pint": "Pint", "cup": "Cup",
      "fluid-ounce": "Fluid Ounce", "tablespoon": "Tablespoon", "teaspoon": "Teaspoon",
      "cubic-meter": "Cubic Meter", "cubic-centimeter": "Cubic Centimeter",
      "square-meter": "Square Meter", "square-kilometer": "Square Kilometer",
      "square-centimeter": "Square Centimeter", "square-millimeter": "Square Millimeter",
      "square-mile": "Square Mile", "square-yard": "Square Yard",
      "square-foot": "Square Foot", "square-inch": "Square Inch",
      "hectare": "Hectare", "acre": "Acre",
      "meter-second": "Meter / Second", "kilometer-hour": "Kilometer / Hour",
      "mile-hour": "Mile / Hour", "knot": "Knot", "foot-second": "Foot / Second",
      "pascal": "Pascal", "kilopascal": "Kilopascal", "megapascal": "Megapascal",
      "bar": "Bar", "millibar": "Millibar", "psi": "PSI",
      "atm": "Atmosphere", "torr": "Torr", "mmhg": "Millimeter of Mercury",
      "joule": "Joule", "kilojoule": "Kilojoule", "megajoule": "Megajoule",
      "calorie": "Calorie", "kilocalorie": "Kilocalorie",
      "watt-hour": "Watt Hour", "kilowatt-hour": "Kilowatt Hour",
      "electron-volt": "Electron Volt", "btu": "BTU",
      "watt": "Watt", "kilowatt": "Kilowatt", "megawatt": "Megawatt",
      "horsepower-metric": "Horsepower (Metric)", "horsepower-imperial": "Horsepower (Imperial)",
      "btu-hour": "BTU / Hour",
      "byte": "Byte", "bit": "Bit", "kilobyte": "Kilobyte",
      "megabyte": "Megabyte", "gigabyte": "Gigabyte", "terabyte": "Terabyte",
      "kibibyte": "Kibibyte", "mebibyte": "Mebibyte",
      "gibibyte": "Gibibyte", "tebibyte": "Tebibyte",
      "second": "Second", "millisecond": "Millisecond", "microsecond": "Microsecond",
      "minute": "Minute", "hour": "Hour", "day": "Day",
      "week": "Week", "month": "Month", "year": "Year",
      "degree": "Degree", "radian": "Radian", "gradian": "Gradian",
      "arcminute": "Arcminute", "arcsecond": "Arcsecond",
      "hertz": "Hertz", "kilohertz": "Kilohertz", "megahertz": "Megahertz",
      "gigahertz": "Gigahertz", "rpm": "RPM",
    },
  },
  currencyConverter: {
    from: "From", to: "To",
    quickConversions: "Quick Conversions", recentHistory: "Recent History",
    noRecent: "No recent conversions.",
    liveRatesUpdated: (min) => `Live rates, updated ${min} min ago`,
    liveRatesJust: "Live rates, just updated",
    offlineSnapshot: (date) => `Offline snapshot, rates as of ${date}`,
  },
  passwordGenerator: {
    length: (n) => `Length: ${n}`,
    uppercase: "Uppercase (A-Z)", lowercase: "Lowercase (a-z)",
    numbers: "Numbers (0-9)", symbols: "Symbols (!@#$)", pronounceable: "Pronounceable mode",
    count: "Generate Count", regenerate: "Regenerate", copy: "Copy",
    bulkGeneration: "Bulk Generation", history: "History", clearHistory: "Clear History",
    strength: { weak: "Weak", fair: "Fair", strong: "Strong", veryStrong: "Very Strong", exceptional: "Exceptional" },
  },
  formatSelector: { search: "Search...", noResults: "No results found" },
  aiTextScrubber: {
    tabInvisible: "Invisible Character Remover",
    tabStylistic: "Stylistic Scrubber",
    placeholder: "Paste text here...",
    scan: "Scan",
    removeBtn: "Remove",
    scrubPhrases: "Scrub Phrases",
    foundCount: (n) => `${n} invisible character${n === 1 ? "" : "s"} found.`,
    cleanedOutput: "Cleaned Output",
    copy: "Copy",
    downloadTxt: "Download .txt",
    disclaimer: "Disclaimer: This does not guarantee bypass of all AI detection methods, including cryptographic watermarking techniques.",
  },
  backgroundRemover: {
    note: "Photos are processed securely over an encrypted connection and deleted immediately after processing.",
    removeBtn: "Remove Background",
    removeMultipleBtn: (n) => `Remove Background (${n} images)`,
    processingImage: "Removing background...",
    processingCount: (current, total) => `Processing image ${current} of ${total}`,
    original: "Original",
    result: "Result",
    inspect: "Inspect cutout",
    downloadAll: "Download all (ZIP)",
    downloadSingle: "Download PNG",
    processAnother: "Process another image",
    cancel: "Cancel",
    dragSliderHint: "Drag slider to inspect cutout",
  },
  metadataCleaner: {
    tabImages: "Images",
    tabPdfs: "PDFs",
    tabDocs: "Documents (DOCX)",
    analyzeBtn: "Analyze Metadata",
    foundMetadata: "Found Metadata",
    cleanBtn: "Clean & Download",
    cleaningLabel: "Cleaning...",
    disclaimer: "Disclaimer: This tool removes common metadata fields (EXIF, XMP, document properties). It does not guarantee removal of cryptographic fingerprints, steganographic data, or AI model watermarks embedded in pixel values.",
    cleaning: "Stripping EXIF, GPS, author, and revision metadata…",
    error: "Metadata cleaning failed. Please check your file.",
    readyBadge: "Metadata stripped successfully",
    downloadCleaned: "Download Sanitized File",
    convertAnother: "Clean another file",
    statusMilestone1: "Inspecting file headers and embedded metadata…",
    statusMilestone2: "Purging EXIF, GPS, camera profiles and tags…",
    statusMilestone3: "Stripping author history and revision tracking…",
    statusMilestone4: "Rebuilding clean, sanitized document…",
    featureExif: "EXIF & GPS Removal",
    featureExifDesc: "Strips camera make, model, geolocation, timestamps, and thumbnails.",
    featurePdfDoc: "PDF & Document Scrubbing",
    featurePdfDocDesc: "Removes author names, titles, software signatures, and edit histories.",
    featurePrivate: "Private & Safe",
    featurePrivateDesc: "PDFs are cleaned locally; images are stripped securely and purged immediately.",
    honestHybridNote: "PDFs are scrubbed directly in your browser. Images and documents are sanitized securely on our server and deleted immediately.",
  },
  pdfCompress: {
    compressionLevel: "Select Compression Level",
    compressBtn: "Compress PDF",
    compressingLabel: "Optimizing PDF and compressing images...",
    statsOriginal: "Original Size",
    statsCompressed: "Compressed Size",
    statsReduction: "Space Saved",
    downloadBtn: (filename) => `Download ${filename}`,
    note: "All text layers, vector outlines, and PDF bookmarks are preserved while heavy embedded images and streams are compressed.",
    extremeTitle: "Extreme Compression",
    extremeDesc: "Less quality, high compression — ideal for email attachments",
    extremeBadge: "Smallest file",
    recommendedTitle: "Recommended Compression",
    recommendedDesc: "Great quality, high compression — best for sharing and storage",
    recommendedBadge: "Best balance",
    lowTitle: "Low Compression",
    lowDesc: "Highest visual quality, moderate compression — best for printing",
    lowBadge: "Print & Archive",
    changeFile: "Change file",
    anotherFile: "Compress another PDF",
    recommendedTag: "Recommended",
  },
  qrCode: {
    contentType: "Content Type",
    modes: {
      url: "URL",
      text: "Text",
      wifi: "Wi-Fi",
      vcard: "Contact",
    },
    content: "Content",
    textLabel: "Text",
    enterText: "Enter your text...",
    wifiSsid: "Network name (SSID)",
    wifiPass: "Password",
    encryption: "Encryption",
    encNone: "None",
    fullName: "Full name",
    email: "Email address",
    phone: "Phone number",
    options: "Options",
    size: (n) => `Size: ${n}px`,
    margin: (n) => `Margin: ${n}`,
    errorCorrection: "Error correction",
    qrColor: "QR Color",
    bgColor: "Background",
    preview: "Preview",
    emptyHint: "Enter content to generate a QR code",
    downloadPng: "Download PNG",
    copyImage: "Copy as image",
    copied: "Copied!",
    privacyNote: "Generated entirely in your browser. No data is sent to external servers.",
  },
  pdfMerge: {
    mergeBtn: (n) => `Merge ${n} PDF files`,
    mergingLabel: "Merging and organizing pages...",
    errorMin2: "Please select at least 2 PDF files to merge.",
    addMore: "Add more PDFs",
    clearAll: "Clear list",
    sortAZ: "Sort A-Z",
    totalSize: "Total size",
    filesCount: (n) => `${n} ${n === 1 ? 'file' : 'files'} selected`,
    needTwoPrompt: "Add at least one more PDF to merge them into a single document.",
    dragTip: "Adjust the order using the arrow buttons before merging.",
    mergedSuccess: "PDFs merged successfully!",
    downloadMerged: "Download merged PDF",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after merging.",
  },
  imageCompress: {
    qualitySlider: "Quality slider",
    targetSize: "Target file size",
    quality: "Quality",
    smallest: "1 (smallest)",
    original100: "100 (original)",
    targetSizeLabel: "Target size",
    kbPerFile: "KB per file",
    resize: "Resize",
    noResize: "No resize",
    scalePercent: "Scale %",
    maxWH: "Max W/H",
    pxKeepsAspect: "px, keeps aspect ratio",
    stripExif: "Strip EXIF metadata (GPS, camera info, timestamps)",
    compressBtn: (n) => `Compress ${n} image${n === 1 ? "" : "s"}`,
    compressing: "Compressing...",
    originalLabel: "Original",
    compressedLabel: "Compressed",
    processing: "Processing...",
    downloadBtn: "Download",
    removeBtn: "Remove",
    dropHint: "Drop images here or click to select. Up to 20 files, 20 MB each.",
    downloadAll: (n) => `Download All (${n})`,
    compressAnother: "Compress another image",
    compare: "Compare before & after",
    backToList: "Back to image list",
    batchProgress: (done, total) => `${done} of ${total} images compressed`,
    step1: "Reading image data...",
    step2: "Optimizing compression levels...",
    step3: "Stripping unnecessary metadata...",
    step4: "Finalizing optimized file...",
    honestServerNote: "Files are securely processed via encrypted connection and immediately deleted.",
    dimensions: "Dimensions",
    maxWidth: "Max width",
    maxHeight: "Max height",
    clearAll: "Clear all",
    statusPending: "Ready",
    statusProcessing: "Compressing...",
    statusDone: "Compressed",
    statusError: "Failed",
  },
  imageResize: {
    byPixels: "By Pixels",
    byPercentage: "By Percentage",
    width: "Width (px)",
    height: "Height (px)",
    lockAspectRatio: "Lock aspect ratio",
    percentage: "Percentage scale",
    originalDimensions: "Original dimensions",
    targetDimensions: "Target dimensions",
    resizeBtn: "Resize Image",
    resizing: "Resizing image...",
    invalidDimensions: "Please enter valid width and height dimensions.",
    invalidPercentage: "Please enter a valid percentage above 0.",
    step1: "Reading image dimensions...",
    step2: "Resampling image pixels...",
    step3: "Encoding resized image...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately.",
    resizeAnother: "Resize another image",
  },
  imageCrop: {
    aspectFree: "Free",
    aspectSquare: "1:1 (Square)",
    aspect43: "4:3",
    aspect169: "16:9",
    aspect32: "3:2",
    selection: (w, h) => `Selection: ${w} × ${h} px`,
    dragPrompt: "Click and drag to select an area",
    cropBtn: "Crop Image",
    cropping: "Cropping image...",
    cancel: "Cancel",
    cropAnother: "Crop another image",
    step1: "Reading crop coordinates...",
    step2: "Extracting cropped region...",
    step3: "Encoding final image...",
    honestServerNote: "Files are securely processed via encrypted connection and immediately deleted.",
  },
  flipRotateImage: {
    rotateHeading: "Rotation",
    flipHeading: "Flip",
    normalOrientation: "Original orientation",
    rotateLeft: "Rotate 90° Left",
    rotateRight: "Rotate 90° Right",
    rotate180: "Rotate 180°",
    flipHorizontal: "Flip Horizontal",
    flipVertical: "Flip Vertical",
    resetTransform: "Reset Orientation",
    outputFormat: "Output format",
    applyBtn: "Apply & Download",
    applying: "Applying transformations...",
    changeImage: "Change image",
    editAnother: "Transform another image",
    currentOrientation: "Current orientation",
    step1: "Reading image...",
    step2: "Applying orientation transformations...",
    step3: "Encoding final image...",
    honestServerNote: "Files are securely processed via encrypted connection and immediately deleted.",
  },
  watermarkImage: {
    watermarkText: "Watermark text",
    fontSize: "Font size",
    color: "Color",
    opacity: "Opacity",
    position: "Position",
    positions: {
      topLeft: "Top Left",
      topRight: "Top Right",
      center: "Center",
      bottomLeft: "Bottom Left",
      bottomRight: "Bottom Right",
    },
    applyBtn: "Apply Watermark & Download",
    applying: "Applying watermark...",
    changeImage: "Change image",
    watermarkAnother: "Watermark another image",
    step1: "Reading image and font settings...",
    step2: "Compositing watermark overlay...",
    step3: "Encoding final image...",
    honestServerNote: "Files are securely processed via encrypted connection and immediately deleted.",
  },
  faviconGenerator: {
    includedSizes: "Sizes included in the ZIP",
    browserPreview: "Browser tab preview",
    mobilePreview: "Mobile icon preview",
    sampleTab: "My Awesome Website",
    sampleApp: "App Icon",
    htmlSnippetTitle: "HTML head tags to include in your website",
    copyHtml: "Copy HTML",
    copied: "Copied!",
    generateBtn: "Generate & Download Favicon ZIP",
    generating: "Generating favicon package...",
    changeImage: "Change image",
    generateAnother: "Generate another favicon",
    downloadZip: "Download Favicons ZIP",
    step1: "Resampling icon to standard resolutions...",
    step2: "Assembling multi-resolution ICO container...",
    step3: "Packaging into zip archive...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately.",
  },
  documentConverter: {
    inputFile: "Input File",
    selectDesc: "Select a PDF, DOCX, or TXT file.",
    dragDrop: "Drag & drop your file here",
    clickBrowse: "or click to browse",
    convertBtn: "Convert Document",
    processingBtn: "Processing...",
    converting: "Converting document…",
    conversionFailed: "Conversion Failed",
    output: "Output",
    outputDesc: "Extracted text or downloaded file.",
    downloadTxt: "Download as TXT",
    pdfSuccess: "PDF converted and downloaded successfully.",
    ready: "Ready to convert.",
    error: "Document conversion failed. Please check your file.",
    readyBadge: "Conversion completed successfully",
    downloadFile: (ext: string) => `Download ${ext.toUpperCase()}`,
    convertAnother: "Convert another document",
    targetLabel: "Convert to:",
    featureEngine: "LibreOffice Engine",
    featureEngineDesc: "Powered by headless LibreOffice for industry-standard format fidelity.",
    featureFidelity: "Preserved Layouts",
    featureFidelityDesc: "Accurate conversion of fonts, tables, margins, and graphics.",
    featurePrivate: "Private & Ephemeral",
    featurePrivateDesc: "Processed in isolated sandboxes and wiped immediately.",
    statusMilestone1: "Analyzing document structure...",
    statusMilestone2: "Initializing document engine...",
    statusMilestone3: "Converting styles, graphics, and layout...",
    statusMilestone4: "Generating final output file...",
    honestServerNote: "Documents are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  imageConverter: {
    settings: "Settings",
    outputFormat: "Output Format",
    quality: "Quality",
    convertAll: "Convert All",
    converting: "Converting...",
    downloadAll: "Download All (ZIP)",
    download: "Download",
    addImages: "Add Images",
    dragDrop: "Drag & drop or click to browse (max 20)",
    processing: "Processing...",
    clearAll: "Clear All",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately.",
    convertAnother: "Convert another image",
  },
  ocr: {
    modelNote: "Server-side Tesseract neural OCR engine. Supports multi-column text and scanned documents.",
    extractBtn: "Extract Text (OCR)",
    extracting: "Extracting text from image with OCR…",
    extractedText: "Extracted Text",
    error: "OCR text extraction failed. Please ensure the image contains legible text.",
    readyBadge: "Text extracted successfully",
    downloadTxt: "Download Text (.txt)",
    convertAnother: "Scan another image",
    languageLabel: "Document language",
    statusMilestone1: "Uploading image securely…",
    statusMilestone2: "Pre-processing and contrast optimization…",
    statusMilestone3: "Running Tesseract neural OCR engine…",
    statusMilestone4: "Structuring recognized text output…",
    featureAccuracy: "Neural Tesseract OCR",
    featureAccuracyDesc: "Deep learning models recognize printed and scanned text with high accuracy.",
    featureFormats: "Universal Image Support",
    featureFormatsDesc: "Works with JPG, PNG, WebP, TIFF, BMP, and GIF image scans.",
    featurePrivate: "Encrypted & Ephemeral",
    featurePrivateDesc: "Images are processed securely in memory and deleted immediately.",
    honestServerNote: "Images are processed securely on our server using Tesseract OCR and purged immediately.",
  },
  wordCounter: {
    words: "Words",
    chars: "Characters",
    noSpaces: "No spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    readingTime: "Reading time",
    clear: "Clear",
    copyText: "Copy text",
    pasteHere: "Paste or type your text here…",
  },
  common: {
    download: "Download",
    downloadAll: (n) => `Download all ${n} files as ZIP`,
    copy: "Copy",
    copied: "Copied!",
    reset: "Reset",
    remove: "Remove",
    clear: "Clear",
    processing: "Processing…",
    converting: "Converting…",
    quality: "Quality",
    original: "Original",
    converted: "Converted",
    extractText: "Extract Text",
    extractedText: "Extracted Text",
    dropFileHere: "Drop file here, or click to browse",
    dropFilesHere: (label) => `Drop ${label} files here or click to browse`,
    uploadFile: "Upload File",
    pasteText: "Paste text here…",
    outputAppearsHere: "Output appears here…",
    convertToPdf: "Convert to PDF",
    downloadPdf: "Download PDF",
    downloadCsv: "Download CSV",
    downloadTxt: "Download .txt",
    convertFiles: (n, ext) => `Convert ${n} file${n > 1 ? 's' : ''} to ${ext}`,
    pdfReady: (kb) => `PDF ready, ${kb} KB`,
    sheet: "Sheet:",
    exportSheet: "Export sheet:",
    convertBtn: "Convert",
    preview: (n) => `Preview (${n} rows)`,
    orPasteDirectly: "Or paste directly:",
    errorGeneric: "Something went wrong. Please try again.",
    view: "View",
    copyText: "Copy text",
    format: "Format",
    minify: "Minify",
    encode: "Encode",
    decode: "Decode",
    generate: "Generate",
  },
  jsonFormatter: {
    inputLabel: "Input JSON",
    formattedOutput: "Formatted Output",
    minifiedOutput: "Minified Output",
    indent: "Indent:",
    stats: (chars, bytes) => `${chars} chars · ${bytes} bytes`,
    invalidJson: "Invalid JSON",
  },
  htmlFormatter: {
    inputLabel: "Input HTML",
    outputLabel: "Output",
    bytes: (n) => `${n} bytes`,
  },
  urlEncoder: {
    rawUrlText: "Raw URL / text",
    encodedUrl: "Encoded URL",
    encodedOutput: "Encoded output",
    decodedOutput: "Decoded output",
    quickExamples: "Quick examples",
    invalidInput: "Invalid input",
    examples: { space: "Space", ampersand: "Ampersand", equals: "Equals", hash: "Hash" },
  },
  base64Encoder: {
    uploadFile: "Upload file → Base64",
    plainTextInput: "Plain text input",
    base64Input: "Base64 input",
    base64Output: "Base64 output",
    decodedText: "Decoded text",
    encodePlaceholder: "Type or paste text to encode…",
    decodePlaceholder: "Paste Base64 to decode…",
    chars: (n) => `${n} chars`,
    invalidInput: "Invalid input",
  },
  loremIpsum: {
    types: { paragraphs: "Paragraphs", sentences: "Sentences", words: "Words", lists: "Lists" },
    count: "Count:",
    classicStart: "Start with classic Lorem ipsum",
  },
  nextToolMenu: {
    title: "Open In Next Tool",
    openIn: "Open in...",
    otherTools: "Other tools",
    openInOtherTools: "Open in other tools",
    steps: {
      compressImage: { label: "Compress image", desc: "Reduce file size" },
      resizeDimensions: { label: "Resize dimensions", desc: "Custom width & height" },
      convertFormat: { label: "Convert format", desc: "Export as JPG, WebP, PNG" },
      cropImage: { label: "Crop image", desc: "Aspect ratio & custom crop" },
      watermarkImage: { label: "Add watermark", desc: "Text & logo protection" },
      applyFilters: { label: "Apply filters", desc: "Color adjustments & styling" },
      compressPdf: { label: "Compress PDF", desc: "Reduce document size" },
      pdfToWord: { label: "PDF to Word", desc: "Editable DOCX format" },
      protectPdf: { label: "Protect with password", desc: "Encrypt & secure" },
      watermarkPdf: { label: "Add watermark", desc: "Text & stamp overlay" },
      pdfToImage: { label: "PDF to Images", desc: "Extract pages as images" },
      wordToPdf: { label: "Convert to PDF", desc: "High fidelity layout" },
      wordToEpub: { label: "Convert to EPUB", desc: "Standard e-book reader" },
      wordToMarkdown: { label: "Convert to Markdown", desc: "Clean Markdown for docs" },
      universalConverter: { label: "Universal Converter", desc: "ODT, RTF, HTML & more" },
    },
  },
  resultPanel: {
    readyToDownload: "Ready to download",
    downloadExt: (ext) => `Download ${ext}`,
    downloadAria: (fn) => `Download ${fn}`,
    extractedText: "Extracted Text",
    copyAll: "Copy all",
    copied: "Copied",
    downloadTxtAria: "Download extracted text as .txt",
    copyAria: "Copy extracted text",
  },
  toolProcessor: {
    uploading: "Uploading file...",
    processing: "Processing your file...",
    takeSeconds: "This may take a few seconds",
    completed: "Processing completed",
    startOver: "Start over",
    download: "Download",
    failed: "Processing failed",
    defaultError: "Unable to process the file. Please check the file and try again.",
    retry: "Retry",
    original: "Original",
    result: "Result",
    steps: {
      analyzing: "Analyzing file...",
      processing: "Processing...",
      optimizing: "Optimizing output...",
      finalizing: "Finalizing...",
    },
  },
  pdfUnlock: {
    note: "Remove owner restrictions (printing, text copying, and form editing) or enter the password to fully decrypt.",
    unlockBtn: "Unlock & Decrypt PDF",
    unlocking: "Removing encryption and restrictions...",
    error: "Unlock failed. Please verify your password.",
    readyBadge: "PDF unlocked successfully!",
    downloadPdf: "Download Unlocked PDF",
    unlockAnother: "Unlock another PDF",
    passwordLabel: "Document Password (if required)",
    passwordPlaceholder: "Enter password if document is locked",
    passwordHelp: "Leave blank if file only has printing or editing restrictions.",
    featureRestrictions: "Remove Restrictions",
    featureRestrictionsDesc: "Instantly unlock printing, copying, and modifications.",
    featureCompatibility: "Universal Compatibility",
    featureCompatibilityDesc: "Fully compatible with Adobe Acrobat, browsers, and mobile viewers.",
    featurePrivate: "Secure & Ephemeral",
    featurePrivateDesc: "Processed entirely in volatile memory, never stored on disk.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after unlocking.",
  },
  pdfProtect: {
    cardTitle: "PASSWORDS & PERMISSIONS",
    userPasswordLabel: "Document Password (Required to Open)",
    userPasswordPlaceholder: "Enter strong password",
    ownerPasswordLabel: "Permissions Password (Optional)",
    ownerPasswordPlaceholder: "Set master password for permissions",
    allowPrinting: "Allow Printing",
    allowCopying: "Allow Text & Image Extraction",
    allowModifying: "Allow Document Modification",
    protectBtn: "Protect PDF (AES-256)",
    encrypting: "Encrypting with AES-256...",
    errorNoPassword: "Please set at least one password.",
    error: "Protection failed. Please try again.",
    readyBadge: "PDF encrypted successfully!",
    downloadPdf: "Download Protected PDF",
    protectAnother: "Protect another PDF",
    aes256Badge: "Military-Grade AES-256",
    permissionsTitle: "Document Permissions",
    permissionsDesc: "Choose which actions authorized viewers can perform.",
    generatePasswordBtn: "Generate strong password",
    strengthWeak: "Weak",
    strengthMedium: "Good",
    strengthStrong: "Very Strong",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after encryption.",
  },
  pdfRotate: {
    cardTitle: "Rotation Options",
    right90: "Right (90°)",
    upsideDown180: "Upside Down (180°)",
    left270: "Left (270°)",
    rotateBtn: "Apply Rotation",
    rotating: "Rotating PDF pages...",
    error: "Rotation failed. Please try again.",
    rotateAllRight: "Rotate all right (90°)",
    rotateAllLeft: "Rotate all left (90°)",
    resetRotations: "Reset orientations",
    rotateSingleRight: "Rotate 90° right",
    rotateSingleLeft: "Rotate 90° left",
    pageLabel: (n: number) => `Page ${n}`,
    pagesCount: (n: number) => `${n} page${n > 1 ? 's' : ''}`,
    saveRotatedPdf: "Download Rotated PDF",
    renderingPages: "Generating page previews...",
    loadDifferent: "Select another PDF",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after rotating.",
  },
  pdfSplit: {
    optionsTitle: "Split Options",
    everyPage: "Extract every page into individual PDFs (ZIP)",
    rangeOption: "Extract specific pages or ranges",
    rangePlaceholder: "e.g. 1-3, 5, 7-10",
    splitBtn: "Split PDF",
    splitting: "Splitting PDF...",
    error: "Split failed. Please try again.",
    modeRangeTitle: "Split by Custom Ranges",
    modeRangeDesc: "Specify one or more page intervals to separate",
    modeExtractTitle: "Extract Specific Pages",
    modeExtractDesc: "Select exact pages to pull into a new file",
    allPagesSub: "Extract every page into a standalone PDF (ZIP)",
    selectPagesSub: "Choose specific pages from document",
    mergeOption: "Merge all extracted pages into a single PDF document",
    mergeOptionHelp: "Generates 1 clean PDF containing all chosen pages in order",
    addRangeBtn: "Add another range",
    fromPage: "From page",
    toPage: "to page",
    pagesCount: (n) => `${n} page${n > 1 ? "s" : ""}`,
    selectAll: "Select all",
    deselectAll: "Clear",
    evenPages: "Even pages",
    oddPages: "Odd pages",
    pagesSelected: (sel, tot) => `${sel} of ${tot} pages selected`,
    readyBadge: "Split completed successfully",
    downloadPdf: "Download Extracted PDF",
    downloadZip: "Download Archive (.ZIP)",
    splitAnother: "Split another PDF",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after splitting.",
  },
  pdfToWord: {
    convertBtn: "Convert to Word (DOCX)",
    converting: "Converting to DOCX...",
    error: "Conversion failed. Please try again.",
    readyBadge: "Conversion completed successfully",
    downloadDocx: "Download Word Document (.DOCX)",
    convertAnother: "Convert another PDF",
    featureFidelity: "Formatting & Style Preservation",
    featureFidelityDesc: "Headings, paragraphs, alignment, and tables preserved faithfully.",
    featureEditable: "100% Editable DOCX",
    featureEditableDesc: "Fully compatible with Microsoft Word, Google Docs, and LibreOffice.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed entirely in ephemeral memory, never stored on disk.",
    statusMilestone1: "Parsing PDF structure and typography...",
    statusMilestone2: "Detecting paragraphs, headings and tables...",
    statusMilestone3: "Synthesizing Word OpenXML elements...",
    statusMilestone4: "Finalizing editable document...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pdfToExcel: {
    convertBtn: "Convert to Excel (XLSX)",
    converting: "Extracting tables...",
    error: "Extraction failed. Please try again.",
    readyBadge: "Excel tables extracted successfully",
    downloadXlsx: "Download Excel Workbook (.XLSX)",
    convertAnother: "Convert another PDF",
    featureTables: "Precision Table Extraction",
    featureTablesDesc: "Detects grid lines, headers, rows, and columns automatically.",
    featureCells: "Clean Number & Cell Formatting",
    featureCellsDesc: "Numbers, dates, and formulas ready for instant analysis.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed entirely in ephemeral memory, never saved.",
    statusMilestone1: "Parsing document structure and vector lines...",
    statusMilestone2: "Extracting tabular data and column headers...",
    statusMilestone3: "Constructing Excel worksheets and cell grids...",
    statusMilestone4: "Finalizing workbook...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after extraction.",
  },
  pdfToPptx: {
    convertBtn: "Convert to PowerPoint (PPTX)",
    converting: "Creating presentation...",
    error: "Conversion failed. Please try again.",
    readyBadge: "PowerPoint slides generated successfully",
    downloadPptx: "Download PowerPoint Presentation (.PPTX)",
    convertAnother: "Convert another PDF",
    featureSlides: "Page-to-Slide Mapping",
    featureSlidesDesc: "Each PDF page is converted into a native presentation slide.",
    featureLayout: "Preserved Layout & Elements",
    featureLayoutDesc: "Text, vector graphics, and images arranged faithfully.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed entirely in memory without persistent storage.",
    statusMilestone1: "Parsing PDF pages and visual components...",
    statusMilestone2: "Generating PowerPoint slide layouts...",
    statusMilestone3: "Embedding typography and vector assets...",
    statusMilestone4: "Compiling presentation...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pdfToText: {
    convertBtn: "Extract Plain Text",
    converting: "Extracting text content...",
    error: "Failed to extract text. Please try again.",
    readyBadge: "Text extracted successfully",
    downloadTxt: "Download TXT File",
    copyText: "Copy to Clipboard",
    copiedText: "Copied!",
    previewText: "Preview Text",
    convertAnother: "Extract another PDF",
    featureEncoding: "Clean UTF-8 Output",
    featureEncodingDesc: "Flawless preservation of accents, symbols, and formatting breaks.",
    featureClean: "Instant Preview & Copy",
    featureCleanDesc: "Read or copy extracted text directly or download as a .txt file.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed strictly in volatile memory, never persisted on disk.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after extraction.",
  },
  pdfWatermark: {
    cardTitle: "Watermark Configuration",
    watermarkText: "Watermark Text",
    fontSize: (n) => `Font Size (${n}px)`,
    opacity: (pct) => `Opacity (${pct}%)`,
    color: "Color",
    colors: { gray: "Subtle Gray", black: "Bold Black", red: "Urgent Red", blue: "Navy Blue" },
    applyBtn: "Apply Watermark & Download",
    applying: "Applying watermark across pages...",
    error: "Watermark application failed. Please try again.",
    rotation: "Angle / Orientation",
    presets: "Quick Presets",
    livePreview: "Live Document Preview",
    pagesScope: "Target Pages",
    pagesScopeAll: "All Pages",
    pagesScopeFirst: "First Page Only",
    pagesScopeCustom: "Custom Page Range",
    downloadWatermarked: "Download Watermarked PDF",
    changeFile: "Change Document",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after watermarking.",
  },
  pdfPageNumbers: {
    cardTitle: "Page Numbering Options",
    position: "Stamp Position",
    positions: {
      bottomCenter: "Bottom Center",
      bottomRight: "Bottom Right",
      bottomLeft: "Bottom Left",
      topCenter: "Top Center",
      topRight: "Top Right",
      topLeft: "Top Left",
    },
    startNumber: "Start Number",
    fontSize: "Font Size",
    applyBtn: "Number Pages & Download",
    applying: "Stamping page numbers...",
    error: "Page numbering failed. Please try again.",
    format: "Numbering Format",
    formatSimple: "Simple (1, 2, 3...)",
    formatPageN: "Page 1, Page 2...",
    formatPageNofTotal: "Page 1 of 10...",
    formatFraction: "1/10, 2/10...",
    skipFirstCover: "Skip Cover Page",
    skipFirstCoverDesc: "Do not display page number on the very first page.",
    downloadNumbered: "Download Numbered PDF",
    changeFile: "Change Document",
    livePreview: "Live Placement Preview",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after numbering.",
  },
  reorderPdf: {
    instructions: "Drag pages or use directional arrows to reorder, click × to delete",
    savePdf: "Save & Download PDF",
    saving: "Generating reordered PDF…",
    pageCount: (n) => `${n} page${n !== 1 ? 's' : ''}`,
    loadDifferent: "Select another PDF",
    loadingThumbs: "Rendering page thumbnails…",
    loadFailed: "Failed to load PDF",
    saveFailed: "Failed to save PDF",
    moveLeft: "Move left",
    moveRight: "Move right",
    reverseOrder: "Reverse all",
    resetOrder: "Reset original order",
    deletePage: "Remove page",
    saveReorderedPdf: "Download Reordered PDF",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after generation.",
  },
  pdfToHtml: {
    convertBtn: "Convert to HTML",
    converting: "Generating HTML webpage…",
    error: "Failed to convert PDF to HTML. Please try again.",
    readyBadge: "HTML generated successfully",
    downloadHtml: "Download HTML (.html)",
    convertAnother: "Convert another PDF",
    featureStructure: "Semantic HTML5",
    featureStructureDesc: "Extracts headings, paragraphs, and formatted text blocks.",
    featureResponsive: "Web-Ready Markup",
    featureResponsiveDesc: "Clean, styled HTML ready to view in browser or embed in CMS.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed entirely in ephemeral memory, never stored on disk.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pdfToMarkdown: {
    convertBtn: "Convert to Markdown",
    converting: "Converting to Markdown syntax…",
    error: "Failed to convert PDF to Markdown. Please try again.",
    readyBadge: "Markdown generated successfully",
    downloadMd: "Download Markdown (.md)",
    copyMd: "Copy Markdown",
    copiedMd: "Copied!",
    convertAnother: "Convert another PDF",
    featureSyntax: "Clean Markdown Syntax",
    featureSyntaxDesc: "Clean headings (#), lists (-), bold/italic and code formatting.",
    featureTables: "Table Extraction",
    featureTablesDesc: "Preserves tabular structure into standard Markdown tables.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed strictly in volatile memory, never persisted.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pdfToEpub: {
    convertBtn: "Convert to EPUB",
    converting: "Generating EPUB e-book…",
    error: "Failed to generate EPUB e-book. Please try again.",
    readyBadge: "EPUB e-book ready",
    downloadEpub: "Download EPUB (.epub)",
    convertAnother: "Convert another PDF",
    featureFlowable: "Reflowable Layout",
    featureFlowableDesc: "Adjust font size and read comfortably across e-readers and smartphones.",
    featureReader: "E-Reader Compatible",
    featureReaderDesc: "Standard EPUB format compatible with Apple Books, Kindle, Kobo, etc.",
    featurePrivate: "100% Client-Side",
    featurePrivateDesc: "Processed directly in your browser without uploading to any server.",
    honestClientNote: "This tool runs entirely in your browser using client-side libraries. No files are uploaded to any server.",
  },
  pdfToImage: {
    format: "Image Format",
    resolution: "Resolution / DPI",
    standardDpi: "Web Standard (72 DPI)",
    highDpi: "Print Quality (150 DPI)",
    maxDpi: "Ultra HD (300 DPI)",
    convertBtn: "Extract Images",
    converting: "Rendering PDF pages into images…",
    error: "Failed to render images from PDF. Please try again.",
    readyBadge: "Images generated successfully",
    downloadImages: "Download Images (ZIP / Image)",
    convertAnother: "Convert another PDF",
    featureHighRes: "Crisp High-DPI Output",
    featureHighResDesc: "Export at up to 300 DPI for crystal clear typography and sharp graphics.",
    featureZip: "Auto ZIP Archive",
    featureZipDesc: "Multi-page documents are packaged as an organized ZIP download.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed entirely in memory and purged immediately.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after extraction.",
  },
  pdfToPdfa: {
    convertBtn: "Convert to PDF/A (Archival)",
    converting: "Enforcing PDF/A-2b ISO standard compliance…",
    error: "Failed to convert to PDF/A. Please try again.",
    readyBadge: "PDF/A-2b archive document ready",
    downloadPdfa: "Download PDF/A (.pdf)",
    convertAnother: "Convert another PDF",
    featureCompliance: "ISO 19005-2 Standard",
    featureComplianceDesc: "Guaranteed long-term readability across future platforms and viewers.",
    featureFonts: "Embedded Fonts & Color Spaces",
    featureFontsDesc: "Embeds all glyphs, device-independent colors, and metadata.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Strict in-memory conversion without permanent storage.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pdfOcr: {
    language: "Document Language",
    langAll: "English & French (Auto-detect)",
    langEng: "English",
    langFra: "French",
    langSpa: "Spanish",
    langDeu: "German",
    convertBtn: "Recognize & Extract Text",
    converting: "Running optical character recognition (OCR)…",
    error: "Failed to extract text via OCR. Please check that the file is not password protected.",
    readyBadge: "OCR text extracted successfully",
    downloadTxt: "Download Extracted Text (.txt)",
    copyText: "Copy to Clipboard",
    copiedText: "Copied!",
    convertAnother: "Scan another PDF",
    featureOcr: "Tesseract OCR Engine",
    featureOcrDesc: "Extracts editable, selectable text from scans, photocopies, and photos.",
    featureMultilingual: "Multilingual Support",
    featureMultilingualDesc: "Recognizes English, French, Spanish, German, and accented characters.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Processed securely in memory and deleted right after extraction.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after recognition.",
  },
  pdfRepair: {
    repairBtn: "Analyze & Repair PDF",
    repairing: "Reconstructing XREF tables and repairing streams…",
    error: "Could not repair PDF file. The file may be entirely empty or corrupted beyond recovery.",
    readyBadge: "PDF successfully repaired",
    downloadRepaired: "Download Repaired PDF",
    convertAnother: "Repair another PDF",
    featureXref: "XREF Table Rebuilding",
    featureXrefDesc: "Restores broken cross-reference tables and corrupt page trees.",
    featureStream: "Stream Recovery",
    featureStreamDesc: "Salvages undamaged objects and fixes truncated byte streams.",
    featurePrivate: "Secure & Private",
    featurePrivateDesc: "Repaired in isolated sandbox memory without disk persistence.",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after repair.",
  },
  pdfMetadata: {
    cardTitle: "Document Properties & Metadata",
    titleField: "Document Title",
    authorField: "Author / Creator",
    subjectField: "Subject",
    keywordsField: "Keywords (comma separated)",
    keywordsPlaceholder: "e.g. invoice, 2026, financial",
    creatorField: "Application / Creator",
    producerField: "PDF Producer",
    saveBtn: "Save Metadata & Download",
    saving: "Writing updated metadata…",
    downloadPdf: "Download Updated PDF",
    changeFile: "Change Document",
    readyBadge: "Metadata updated successfully",
    featureLocal: "100% Client-Side",
    featureLocalDesc: "Read and write metadata directly in your browser without uploading.",
    featureFullControl: "Comprehensive Fields",
    featureFullControlDesc: "Customize title, author, subject, keywords, and producer tags.",
    featureInstant: "Instant Save",
    featureInstantDesc: "Applies tags in milliseconds preserving original layout and contents.",
    honestClientNote: "This tool runs entirely in your browser using pdf-lib. No files are uploaded to any server.",
  },
  wordToPdf: {
    convertBtn: "Convert to PDF",
    converting: "Converting Word document to PDF…",
    error: "Word to PDF conversion failed. Please verify your document.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert another document",
    featureFidelity: "Preserved Typography",
    featureFidelityDesc: "Preserves headings, styles, fonts, margins, and inline images.",
    featureLayout: "Layout Integrity",
    featureLayoutDesc: "Accurately converts multi-column text, bullet lists, and tables.",
    featurePrivate: "Secure Processing",
    featurePrivateDesc: "Files are securely processed over encrypted channels and immediately erased.",
    statusMilestone1: "Reading Word document and styles...",
    statusMilestone2: "Processing typography and embedded media...",
    statusMilestone3: "Rendering vector PDF pages...",
    statusMilestone4: "Finalizing PDF file...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  excelToPdf: {
    sheetLabel: "Select sheet to convert:",
    allSheets: "Active Sheet",
    convertBtn: "Convert to PDF",
    converting: "Rendering spreadsheet to PDF…",
    error: "Excel to PDF conversion failed. Please verify your file.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert another spreadsheet",
    featureGrid: "Accurate Grid & Data",
    featureGridDesc: "Preserves cell borders, formatting, alignments, and number styles.",
    featureSheets: "Sheet Selection",
    featureSheetsDesc: "Detects workbook sheets and lets you convert target worksheets cleanly.",
    featurePrivate: "Secure Processing",
    featurePrivateDesc: "Files are encrypted in transit and purged immediately after processing.",
    statusMilestone1: "Parsing spreadsheet workbook and sheets...",
    statusMilestone2: "Calculating column widths and grid layout...",
    statusMilestone3: "Rendering pages and cell formatting...",
    statusMilestone4: "Exporting PDF document...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  pptxToPdf: {
    convertBtn: "Convert to PDF",
    converting: "Converting presentation to PDF…",
    error: "Presentation conversion failed. Please verify your file.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert another presentation",
    featureSlides: "Slide-by-Slide Export",
    featureSlidesDesc: "Each PowerPoint slide converts into an exact sequential PDF page.",
    featureLayout: "Clean Vector Layouts",
    featureLayoutDesc: "Preserves titles, body text, diagrams, and shapes accurately.",
    featurePrivate: "Confidentiality",
    featurePrivateDesc: "Presentations are transmitted securely and deleted immediately.",
    statusMilestone1: "Loading presentation slides...",
    statusMilestone2: "Extracting shapes, text boxes, and assets...",
    statusMilestone3: "Composing PDF vector slide pages...",
    statusMilestone4: "Compiling PDF document...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  imageToPdf: {
    convertBtn: "Convert to PDF",
    converting: "Generating PDF from images…",
    error: "Image to PDF conversion failed. Please check your image files.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert more images",
    featureMultiImage: "Multi-Image Support",
    featureMultiImageDesc: "Combine multiple JPG, PNG, WEBP, or HEIC files into one PDF.",
    featureQuality: "Original Resolution",
    featureQualityDesc: "Embeds photos and graphics at full resolution without quality loss.",
    featurePrivate: "Client-Side First",
    featurePrivateDesc: "Embeds standard images directly in your browser without uploading.",
    filesSelected: (n: number) => `${n} image${n > 1 ? "s" : ""} selected`,
    honestServerNote: "Standard images are embedded directly in your browser. Other formats are converted securely and deleted immediately.",
  },
  htmlToPdf: {
    tabUpload: "Upload HTML File",
    tabPaste: "Paste HTML Code",
    pastePlaceholder: "Paste your HTML snippet or document source here...",
    convertBtn: "Convert to PDF",
    converting: "Rendering HTML to PDF…",
    error: "HTML to PDF conversion failed. Please check the HTML markup.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert another HTML",
    featureHtml5: "Modern HTML5",
    featureHtml5Desc: "Supports standard semantic HTML elements and clean typography.",
    featureStyling: "Visual Fidelity",
    featureStylingDesc: "Renders layout structure, headers, lists, and formatted content.",
    featurePrivate: "Confidential & Secure",
    featurePrivateDesc: "Markup is processed securely over HTTPS and deleted right away.",
    statusMilestone1: "Parsing HTML document and tags...",
    statusMilestone2: "Applying typographic styles and layouts...",
    statusMilestone3: "Generating paginated PDF views...",
    statusMilestone4: "Finalizing output PDF...",
    honestServerNote: "Files and snippets are processed securely and deleted immediately after conversion.",
  },
  markdownToPdf: {
    convertBtn: "Convert to PDF",
    converting: "Rendering Markdown to PDF…",
    error: "Markdown to PDF conversion failed. Please check your file.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert another Markdown file",
    featureTypography: "Clean Typography",
    featureTypographyDesc: "Elegant styles for headings, blockquotes, code blocks, and lists.",
    featureSyntax: "GitHub Flavored Markdown",
    featureSyntaxDesc: "Renders standard tables, checkboxes, formatting, and inline links.",
    featurePrivate: "Secure Conversion",
    featurePrivateDesc: "Processed via encrypted channels and erased immediately.",
    statusMilestone1: "Parsing Markdown syntax and tokens...",
    statusMilestone2: "Generating typographic layout and elements...",
    statusMilestone3: "Rendering pages and line heights...",
    statusMilestone4: "Compiling output PDF...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  txtToPdf: {
    tabUpload: "Upload TXT File",
    tabPaste: "Paste Text",
    pastePlaceholder: "Type or paste your text content here...",
    convertBtn: "Convert to PDF",
    converting: "Formatting text into PDF…",
    error: "Text to PDF conversion failed. Please check your text.",
    readyBadge: "PDF generated successfully",
    downloadPdf: "Download PDF",
    convertAnother: "Convert more text",
    featureFormatting: "Crisp Typography",
    featureFormattingDesc: "Formatted with comfortable margins, line heights, and clear font hierarchy.",
    featureEncoding: "UTF-8 Support",
    featureEncodingDesc: "Accurately handles all international characters, accents, and symbols.",
    featurePrivate: "Privacy Assured",
    featurePrivateDesc: "Text is securely rendered and never retained on servers.",
    statusMilestone1: "Reading text stream...",
    statusMilestone2: "Applying pagination and line wraps...",
    statusMilestone3: "Rendering PDF text objects...",
    statusMilestone4: "Finalizing document...",
    honestServerNote: "Text is processed securely through encrypted connection and erased immediately after PDF generation.",
  },
  wordToText: {
    convertBtn: "Extract Plain Text",
    converting: "Extracting text from Word document…",
    error: "Word to text extraction failed. Please check your document.",
    readyBadge: "Text extracted successfully",
    downloadTxt: "Download Text File (.txt)",
    copyText: "Copy Text",
    copiedText: "Copied!",
    convertAnother: "Convert another document",
    featureExtract: "Full Content Extraction",
    featureExtractDesc: "Extracts all paragraphs, headers, and bullet items into clean UTF-8 text.",
    featureClean: "No Markup Bloat",
    featureCleanDesc: "Outputs unstyled, pristine plain text ready for scripts or editors.",
    featurePrivate: "Secure Processing",
    featurePrivateDesc: "Files are processed via encrypted channels and purged immediately.",
    statusMilestone1: "Reading Word document structure...",
    statusMilestone2: "Extracting paragraphs and headers...",
    statusMilestone3: "Sanitizing formatting and line endings...",
    statusMilestone4: "Finalizing plain text output...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  wordToHtml: {
    convertBtn: "Convert to HTML",
    converting: "Converting Word document to HTML…",
    error: "Word to HTML conversion failed. Please check your document.",
    readyBadge: "HTML generated successfully",
    downloadHtml: "Download HTML (.html)",
    copyHtml: "Copy HTML",
    copiedHtml: "Copied!",
    convertAnother: "Convert another document",
    featureSemantic: "Semantic HTML5",
    featureSemanticDesc: "Generates clean semantic elements for headings, paragraphs, and lists.",
    featureStyles: "Web-Ready Styles",
    featureStylesDesc: "Preserves bold, italic, tables, and links without excessive proprietary markup.",
    featurePrivate: "Private & Secure",
    featurePrivateDesc: "Documents are processed securely and deleted immediately.",
    statusMilestone1: "Analyzing Word XML elements...",
    statusMilestone2: "Translating typography to HTML5 tags...",
    statusMilestone3: "Formatting tables and hyperlinks...",
    statusMilestone4: "Compiling HTML output...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  wordToMarkdown: {
    convertBtn: "Convert to Markdown",
    converting: "Converting Word document to Markdown…",
    error: "Word to Markdown conversion failed. Please check your file.",
    readyBadge: "Markdown generated successfully",
    downloadMd: "Download Markdown (.md)",
    copyMd: "Copy Markdown",
    copiedMd: "Copied!",
    convertAnother: "Convert another document",
    featureFormatting: "Standard CommonMark",
    featureFormattingDesc: "Accurately converts headings, lists, blockquotes, and code blocks.",
    featureTables: "Table Preservation",
    featureTablesDesc: "Converts Word tables directly into clean GitHub Flavored Markdown tables.",
    featurePrivate: "Secure & Ephemeral",
    featurePrivateDesc: "Processed via encrypted channels and purged immediately.",
    statusMilestone1: "Parsing Word document OpenXML...",
    statusMilestone2: "Mapping styles to Markdown syntax...",
    statusMilestone3: "Constructing table structures...",
    statusMilestone4: "Finalizing Markdown file...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  wordToEpub: {
    convertBtn: "Generate EPUB",
    converting: "Creating EPUB e-book in your browser…",
    error: "EPUB generation failed. Please check your document.",
    readyBadge: "EPUB created successfully",
    downloadEpub: "Download EPUB (.epub)",
    convertAnother: "Convert another manuscript",
    featureReflow: "Reflowable Layout",
    featureReflowDesc: "Adapts automatically to e-readers, smartphones, and tablet screens.",
    featureEreader: "E-Reader Compatible",
    featureEreaderDesc: "Compatible with Apple Books, Kindle, Kobo, and standard e-readers.",
    featurePrivate: "100% In-Browser",
    featurePrivateDesc: "Document is converted entirely on your device without server upload.",
    honestClientNote: "This tool runs entirely in your browser using mammoth and epub-gen. No files are uploaded to any server.",
  },
  markdownToDocx: {
    convertBtn: "Convert to Word (DOCX)",
    converting: "Converting Markdown to Word document…",
    error: "Markdown to DOCX conversion failed. Please check your Markdown file.",
    readyBadge: "Word document generated successfully",
    downloadDocx: "Download Word Document (.docx)",
    convertAnother: "Convert another Markdown file",
    featureStyles: "Native Word Headings",
    featureStylesDesc: "Creates real Word Heading 1, 2, 3 styles, blockquotes, and bullet lists.",
    featureOpenXml: "Standard OpenXML",
    featureOpenXmlDesc: "Compatible with Microsoft Office, LibreOffice, and Google Docs.",
    featurePrivate: "Confidential & Safe",
    featurePrivateDesc: "Files are encrypted in transit and purged immediately after generation.",
    statusMilestone1: "Parsing Markdown syntax and tokens...",
    statusMilestone2: "Building OpenXML document structure...",
    statusMilestone3: "Applying paragraph styles and font themes...",
    statusMilestone4: "Compiling .docx container...",
    honestServerNote: "Files are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  txtToDocx: {
    tabUpload: "Upload TXT File",
    tabPaste: "Paste Text",
    pastePlaceholder: "Type or paste your text content here...",
    convertBtn: "Convert to Word (DOCX)",
    converting: "Generating Word document from text…",
    error: "Text to DOCX conversion failed. Please check your text.",
    readyBadge: "Word document generated successfully",
    downloadDocx: "Download Word Document (.docx)",
    convertAnother: "Convert more text",
    featureEditable: "Fully Editable",
    featureEditableDesc: "Produces a clean, editable .docx document ready for word processors.",
    featureMargins: "Balanced Layout",
    featureMarginsDesc: "Formatted with standard margins, comfortable line heights, and typography.",
    featurePrivate: "Secure Processing",
    featurePrivateDesc: "Text is securely transmitted and immediately discarded after export.",
    statusMilestone1: "Reading text content...",
    statusMilestone2: "Creating OpenXML paragraphs...",
    statusMilestone3: "Applying margins and standard styles...",
    statusMilestone4: "Packaging .docx document...",
    honestServerNote: "Files and text are processed securely through encrypted connection and deleted immediately after conversion.",
  },
  excelToCsv: {
    sheetLabel: "Select sheet to export:",
    convertBtn: "Export to CSV",
    converting: "Exporting spreadsheet sheet to CSV…",
    error: "Spreadsheet parsing failed. Please check your Excel file.",
    readyBadge: "CSV exported successfully",
    downloadCsv: "Download CSV (.csv)",
    convertAnother: "Convert another workbook",
    featureSheets: "Sheet Selection",
    featureSheetsDesc: "Easily choose any sheet from multi-sheet Excel workbooks.",
    featureDelimiters: "Standard UTF-8 CSV",
    featureDelimitersDesc: "Clean comma-separated values compatible with all databases and tools.",
    featurePrivate: "100% In-Browser",
    featurePrivateDesc: "Your financial and sensitive tabular data never leaves your device.",
    honestClientNote: "This tool runs entirely in your browser using SheetJS. No files are uploaded to any server.",
  },
  csvToExcel: {
    tabUpload: "Upload CSV File",
    tabPaste: "Paste CSV Data",
    pastePlaceholder: "name,department,salary\nAlice,Engineering,95000\nBob,Design,85000",
    convertBtn: "Convert to Excel (.xlsx)",
    converting: "Generating Excel workbook in your browser…",
    error: "CSV parsing failed. Please check your data format.",
    readyBadge: "Excel workbook generated successfully",
    downloadXlsx: "Download Excel (.xlsx)",
    convertAnother: "Convert more CSV data",
    featureAutoType: "Automatic Type Inference",
    featureAutoTypeDesc: "Correctly recognizes numbers, dates, strings, and boolean values.",
    featureOpenXml: "Standard XLSX Container",
    featureOpenXmlDesc: "Fully compatible with Microsoft Excel, Apple Numbers, and Google Sheets.",
    featurePrivate: "100% In-Browser",
    featurePrivateDesc: "All parsing and generation occurs on your computer without uploads.",
    honestClientNote: "This tool runs entirely in your browser using PapaParse and SheetJS. No data is uploaded to any server.",
  },
  pptxToImages: {
    convertBtn: "Convert Slides to PNG",
    converting: "Rendering presentation slides to PNG images…",
    error: "PowerPoint conversion failed. Please check your presentation file.",
    readyBadge: "Slides converted successfully",
    downloadZip: "Download All Slides (.zip)",
    convertAnother: "Convert another presentation",
    featureSlides: "Pixel-Accurate Slides",
    featureSlidesDesc: "High-resolution rendering preserves layout, vector shapes, and typography.",
    featureZip: "Single ZIP Archive",
    featureZipDesc: "Download all generated slide images in an organized, numbered archive.",
    featurePrivate: "Secure & Purged",
    featurePrivateDesc: "Presentations are transmitted over TLS and erased immediately after rendering.",
    slidesCount: (n: number) => `${n} slide${n > 1 ? "s" : ""} rendered`,
    honestServerNote: "Presentations are processed securely via LibreOffice on the server and purged immediately after conversion.",
  },
  imageUpscale: {
    scaleLabel: "Upscale Factor:",
    sharpenLabel: "Edge Sharpening",
    sharpenDesc: "Enhances texture contrast and fine edge definitions during enlargement.",
    upscaleBtn: "Upscale Image",
    upscaling: "Enlarging and enhancing image resolution…",
    error: "Image upscaling failed. Please check your image file.",
    readyBadge: "Image upscaled successfully",
    downloadImage: "Download Upscaled Image",
    convertAnother: "Upscale another image",
    statusMilestone1: "Uploading high-resolution source image…",
    statusMilestone2: "Applying Lanczos3 interpolation scaling…",
    statusMilestone3: "Enhancing micro-contrast and edge sharpness…",
    statusMilestone4: "Encoding output with optimal compression…",
    featureScale: "2x & 4x Enlargement",
    featureScaleDesc: "Lanczos3 high-order resampling delivers crisp edges and reduces blur.",
    featureSharpen: "Adaptive Unsharp Mask",
    featureSharpenDesc: "Preserves photographic textures and clarity without ring artifacts.",
    featurePrivate: "Private & Purged",
    featurePrivateDesc: "Images are processed securely over encrypted channels and removed instantly.",
    honestServerNote: "Images are upscaled securely on our server using Sharp/Lanczos3 and immediately purged.",
  },
  checksum: {
    verifyPlaceholder: "Paste expected hash to verify (e.g. SHA-256)...",
    matchSuccess: "Hash matches!",
    matchMismatch: "Hash does not match expected value",
    copyHash: "Copy checksum",
    checkAnother: "Verify another file",
    verifyTitle: "Verify Integrity against Expected Hash",
    statusMilestone1: "Reading file into memory buffer…",
    statusMilestone2: "Computing cryptographic SHA digests…",
    statusMilestone3: "Verifying binary checksum output…",
    statusMilestone4: "Checksums calculated successfully!",
    featureMultiAlgo: "4 Hash Algorithms",
    featureMultiAlgoDesc: "Computes SHA-1, SHA-256, SHA-384, and SHA-512 simultaneously in browser.",
    featureVerification: "Instant Verification",
    featureVerificationDesc: "Compare against publisher hashes to ensure download integrity.",
    featurePrivate: "100% In-Browser",
    featurePrivateDesc: "Calculated entirely using the native Web Cryptography API without uploads.",
    honestClientNote: "This tool runs entirely in your browser using the native Web Cryptography API. No files are uploaded to any server.",
  },
};

const FR: Translations = {
  nav: {
    searchPlaceholder: "Rechercher des outils...",
    breadcrumb: {
      home: "Accueil", pdf: "Outils PDF", word: "Outils Word", image: "Outils Image",
      privacy: "Outils Confidentialité", calculators: "Utilitaires & Réseau", tools: "Outils",
      textCode: "Texte & Code", excelSpreadsheets: "Excel & Tableurs", documents: "Documents",
    },
    groups: {
      pdf: "Outils PDF",
      documents: "Documents",
      images: "Images",
      textCode: "Texte & Code",
      tools: "Outils",
    },
    links: {
      // PDF
      "pdf-to-word": "PDF en Word",
      "pdf-to-text": "PDF en Texte",
      "pdf-to-html": "PDF en HTML",
      "pdf-to-epub": "PDF en EPUB",
      "pdf-merge": "Fusionner les PDF",
      "pdf-split": "Diviser le PDF",
      "pdf-rotate": "Faire pivoter le PDF",
      "pdf-unlock": "Déverrouiller le PDF",
      "pdf-protect": "Protéger le PDF",
      "pdf-page-numbers": "Numéroter les Pages",
      "pdf-watermark": "Filigrane PDF",
      "pdf-compress": "Compresser le PDF",
      "pdf-to-image": "PDF en Image",
      "pdf-to-excel": "PDF en Excel",
      "reorder-pdf": "Réorganiser les Pages",
      "ocr": "OCR: Image en Texte",
      // Documents
      "word-to-pdf": "Word en PDF",
      "word-to-text": "Word en Texte",
      "word-to-html": "Word en HTML",
      "word-to-epub": "Word en EPUB",
      "word-to-markdown": "Word en Markdown",
      "html-to-markdown": "HTML en Markdown",
      "markdown-to-pdf": "Markdown en PDF",
      "markdown-to-docx": "Markdown en Word",
      "html-to-pdf": "HTML en PDF",
      "txt-to-pdf": "Texte en PDF",
      "txt-to-docx": "Texte en Word",
      "excel-to-pdf": "Excel en PDF",
      "excel-to-csv": "Excel en CSV",
      "csv-to-excel": "CSV en Excel",
      "csv-to-json": "CSV ↔ JSON",
      "csv-viewer": "Visionneuse CSV",
      "pptx-to-pdf": "PowerPoint en PDF",
      "pptx-to-images": "PowerPoint en Images",
      "pdf-to-pptx": "PDF en PowerPoint",
      // Images
      "image-converter": "Convertisseur d'Image",
      "image-compress": "Compresser l'Image",
      "image-resize": "Redimensionner l'Image",
      "image-crop": "Rogner l'Image",
      "image-to-pdf": "Image en PDF",
      "background-remover": "Suppression du Fond",
      "flip-rotate-image": "Retourner & Pivoter",
      "watermark-image": "Ajouter un Filigrane",
      "favicon-generator": "Générateur de Favicon",
      "heic-to-jpg": "HEIC en JPG",
      "heic-to-png": "HEIC en PNG",
      "heic-to-webp": "HEIC en WebP",
      "heic-to-pdf": "HEIC en PDF",
      "png-to-webp": "PNG en WebP",
      "jpg-to-webp": "JPG en WebP",
      "gif-to-webp": "GIF en WebP",
      "bmp-to-webp": "BMP en WebP",
      "tiff-to-webp": "TIFF en WebP",
      "webp-to-png": "WebP en PNG",
      "webp-to-jpg": "WebP en JPG",
      "webp-to-pdf": "WebP en PDF",
      "webp-to-avif": "WebP en AVIF",
      "jpg-to-avif": "JPG en AVIF",
      "png-to-avif": "PNG en AVIF",
      "avif-to-jpg": "AVIF en JPG",
      "avif-to-png": "AVIF en PNG",
      "jpg-to-png": "JPG en PNG",
      "png-to-jpg": "PNG en JPG",
      "png-to-svg": "PNG en SVG",
      "svg-to-png": "SVG en PNG",
      "gif-to-png": "GIF en PNG",
      "bmp-to-jpg": "BMP en JPG",
      "tiff-to-jpg": "TIFF en JPG",
      "tiff-to-png": "TIFF en PNG",
      "jpg-to-pdf": "JPG en PDF",
      "png-to-pdf": "PNG en PDF",
      // Texte & Code
      "json-formatter": "Formateur JSON",
      "html-formatter": "Formateur HTML",
      "base64": "Base64 Encoder / Décoder",
      "url-encoder": "URL Encoder / Décoder",
      "word-counter": "Compteur de Mots",
      "lorem-ipsum": "Lorem Ipsum",
      // Confidentialité & Outils
      "metadata-cleaner": "Nettoyeur de Métadonnées",
      "ai-text-scrubber": "Nettoyeur de Texte IA",
      "checksum": "Somme de Contrôle",
      "password-generator": "Générateur de Mot de Passe",
      "currency-converter": "Convertisseur de Devises",
      "unit-converter": "Convertisseur d'Unités",
      "qr-code-generator": "Générateur de QR Code",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Votre boîte à outils du quotidien. Plus de 86 outils gratuits et confidentiels pour convertir vos documents, optimiser vos images et calculer rapidement, sans inscription.",
    allTools: "Tous les outils",
    allToolsSubtitle: (n: number) => `Découvrez l'ensemble de nos ${n} outils gratuits pour documents, images et productivité. Rapide, confidentiel et sans compte.`,
    categories: {
      pdf: "Outils PDF",
      word: "Word et Documents",
      image: "Outils Image",
      privacy: "Confidentialité",
      calculators: "Calculatrices",
    },
    toolCategory: {
      pdf: "PDF",
      word: "Document",
      image: "Image",
      privacy: "Confidentialité",
      calculators: "Utilitaire",
    },
    sectionLabels: {
      Documents: "Documents",
      Images: "Images",
      Privacy: "Confidentialité",
      Calculators: "Calculatrices",
    },
    sectionDescriptions: {
      Documents: "Outils PDF et Word",
      Images: "Convertir, compresser et traiter les images",
      Privacy: "Supprimer métadonnées et filigranes IA",
      Calculators: "Conversions, générateurs et calculatrices",
    },
    toolCount: (n) => `${n} ${n === 1 ? "outil" : "outils"}`,
    resultCount: (n) => `${n} ${n === 1 ? "résultat" : "résultats"}`,
    resultsFor: "pour",
    noResults: (q) => `Aucun outil ne correspond à « ${q} »`,
    clearSearch: "Effacer la recherche",
    recentlyUsed: "Récemment utilisés",
    pinned: "Épinglés",
  },
  tools: {
    "pdf-to-word": { title: "PDF en Word", description: "Transformez vos PDF en documents Word modifiables. Idéal pour réutiliser vos anciens rapports ou extraire du contenu sans tout retaper. Tables, titres et paragraphes sont conservés pour un résultat prêt à l'emploi." },
    "pdf-to-text": { title: "PDF en Texte", description: "Extrayez chaque mot de n'importe quel PDF et obtenez un texte clair et copiable en un instant. La mise en page disparaît, seul le contenu compte. Parfait pour récupérer du texte avant de le coller dans un autre outil." },
    "pdf-to-html": { title: "PDF en HTML", description: "Convertissez votre PDF en une vraie page web avec un balisage HTML propre et sémantique. Idéal pour intégrer du contenu PDF dans un site ou un CMS. Fonctionne mieux sur des documents texte bien structurés." },
    "pdf-to-epub": { title: "PDF en EPUB", description: "Convertissez vos PDF en e-books EPUB pour les lire sur votre liseuse, téléphone ou tablette. Le texte s'adapte à la taille de votre écran. Idéal pour les livres et documents longs sans mise en page fixe." },
    "pdf-compress": { title: "Compresser le PDF", description: "Réduisez la taille de vos PDF sans perte de qualité visible. Pratique pour les envois par email ou les portails avec limite de taille. Choisissez votre niveau de compression avant de télécharger le résultat." },
    "pdf-merge": { title: "Fusionner les PDF", description: "Combinez plusieurs PDF en un seul document. Aussi simple que de glisser des fichiers dans un dossier. Ordonnez les pages avant de fusionner et téléchargez un fichier propre et organisé." },
    "pdf-split": { title: "Diviser le PDF", description: "Découpez un gros PDF en plusieurs parties. Extrayez uniquement les pages dont vous avez besoin. Gagnez du temps en ne travaillant qu'avec les sections qui vous intéressent." },
    "pdf-rotate": { title: "Faire pivoter le PDF", description: "Corrigez les scans de travers ou pivotez les pages dans le bon sens en un clic. Choisissez une rotation de 90, 180 ou 270 degrés. Appliquez la correction à une page ou à l'ensemble du document." },
    "pdf-unlock": { title: "Déverrouiller le PDF", description: "Supprimez les restrictions de mot de passe de votre PDF pour enfin pouvoir l'utiliser. Idéal pour récupérer l'accès à vos propres verrouillés. Ne contourne pas le mot de passe d'ouverture du fichier." },
    "pdf-protect": { title: "Protéger le PDF", description: "Verrouillez votre PDF avec un mot de passe pour protéger son contenu des regards indiscrets. Parfait pour les contrats et documents sensibles avant envoi. Seuls ceux qui connaissent le mot de passe peuvent ouvrir le fichier." },
    "pdf-page-numbers": { title: "Numéroter les Pages", description: "Ajoutez des numéros de page à chaque page de votre PDF. Simple, propre et personnalisable avec choix de la position et du numéro de départ. Idéal pour les rapports, manuscrits et tout document professionnel." },
    "pdf-watermark": { title: "Filigrane PDF", description: "Tamponnez votre PDF avec un filigrane personnalisé. Marquez-le comme brouillon ou revendiquez la propriété avant de partager. Contrôlez le texte, l'opacité, l'angle et la taille du filigrane." },
    "word-to-text": { title: "Word en Texte", description: "Supprimez toute la mise en forme d'un DOCX et obtenez du texte brut. Rien que les mots, sans mise en forme cachée ni suivi des modifications. Pratique quand vous avez besoin du contenu brut sans les fioritures." },
    "word-to-html": { title: "Word en HTML", description: "Transformez vos documents Word en code HTML propre et prêt pour la production. Les titres, listes et liens restent intacts. Idéal pour publier du contenu directement dans un CMS sans retouche." },
    "word-to-epub": { title: "Word en EPUB", description: "Convertissez vos documents Word en e-books EPUB pour les lire sur n'importe quel appareil. Compatible avec Kindle, Kobo et Apple Books. Les documents avec des titres et paragraphes clairs donnent les meilleurs résultats." },
    "markdown-to-pdf": { title: "Markdown en PDF", description: "Convertissez vos fichiers Markdown en beaux documents PDF avec une mise en forme soignée. Les titres, tableaux et blocs de code sont parfaitement rendus. Idéal pour transformer votre documentation en un format partageable." },
    "markdown-to-docx": { title: "Markdown en Word", description: "Convertissez du Markdown en un vrai document Word. Le formatage est préservé, les titres et listes restent intacts. Parfait pour les collaborateurs qui travaillent avec Word plutôt qu'en Markdown." },
    "html-to-pdf": { title: "HTML en PDF", description: "Transformez n'importe quelle page HTML ou extrait de code en PDF téléchargeable en quelques secondes. Utile pour archiver des pages web ou générer des rapports imprimables. Collez votre code HTML, vérifiez l'aperçu et téléchargez." },
    "txt-to-pdf": { title: "Texte en PDF", description: "Convertissez du texte brut en un document PDF propre avec de vraies marges et un retour à la ligne automatique. Idéal pour partager des notes, du code ou des logs dans un format lisible. Aucune mise en forme spéciale requise." },
    "txt-to-docx": { title: "Texte en Word", description: "Convertissez vos fichiers texte en documents Word que vous pouvez ouvrir, modifier et formater. Plus besoin de copier-coller dans Word — le résultat est directement un vrai DOCX. Gain de temps pour les conversions simples." },
    "image-converter": { title: "Convertisseur d'Image", description: "Convertissez n'importe quelle image en PNG, JPEG, WebP, AVIF et plus. Traitement par lot jusqu'à 20 fichiers, tout dans votre navigateur. Rien n'est téléchargé sur un serveur, vos images restent sur votre machine." },
    "heic-to-jpg": { title: "HEIC en JPG", description: "Ouvrez les photos HEIC de votre iPhone sur n'importe quel appareil en les convertissant en JPEG standard. HEIC est le format par défaut des appareils Apple mais souvent incompatible ailleurs. Convertissez vos photos une fois et partagez-les sans souci de compatibilité." },
    "image-compress": { title: "Compresser l'Image", description: "Compressez vos images sans sacrifier la qualité. Prêtes pour le web en quelques secondes, sans perte visible. Le curseur de qualité vous permet de trouver le bon équilibre entre taille et netteté." },
    "image-resize": { title: "Redimensionner l'Image", description: "Redimensionnez les images aux dimensions exactes ou en pourcentage. Verrouillez le ratio pour éviter la déformation. Idéal pour préparer des images pour les réseaux sociaux, les emails ou le web." },
    "image-crop": { title: "Rogner l'Image", description: "Rognez vos images avec des poignées et des ratios prédéfinis comme 1:1 ou 16:9. Cadrage précis à chaque fois avec aperçu en direct. Téléchargez le résultat en pleine résolution après avoir positionné votre recadrage." },
    "image-to-pdf": { title: "Image en PDF", description: "Combinez plusieurs images en un seul PDF. Idéal pour regrouper des photos ou des scans en une pièce jointe. Ajoutez les images dans l'ordre souhaité avant de générer le document final." },
    "pdf-to-image": { title: "PDF en Image", description: "Convertissez les pages de votre PDF en images PNG, JPG, WEBP, AVIF, TIFF ou GIF haute fidélité." },
    "background-remover": { title: "Suppression du Fond", description: "Supprimez l'arrière-plan de vos images grâce à un modèle IA côté serveur. Importez votre image et obtenez un PNG transparent en quelques secondes. Le résultat est prêt à être utilisé dans vos designs, présentations ou photos de produits." },
    "metadata-cleaner": { title: "Nettoyeur de Métadonnées", description: "Supprimez les métadonnées EXIF cachées de vos fichiers: localisation GPS, modèle d'appareil, auteur et date de création. Une étape essentielle avant de partager des fichiers en ligne pour protéger votre vie privée. Fonctionne sur les photos, PDFs et documents." },
    "ai-text-scrubber": { title: "Nettoyeur de Texte IA", description: "Supprimez les caractères invisibles et les motifs que les détecteurs d'IA repèrent. Résultat propre et naturel, identique à l'original. Collez votre texte, nettoyez-le, copiez le résultat terminé." },
    "password-generator": { title: "Générateur de Mot de Passe", description: "Générez des mots de passe sécurisés via le générateur aléatoire cryptographique de votre navigateur. L'entropie s'affiche en temps réel pour voir la robustesse de chaque mot de passe. Personnalisez la longueur et incluez symboles, chiffres ou majuscules." },
    "unit-converter": { title: "Convertisseur d'Unités", description: "Convertissez entre des centaines d'unités dans 13 catégories: longueur, poids, température, vitesse, données et plus. Les résultats se mettent à jour en temps réel pendant la saisie. Épinglez vos conversions favorites pour un accès rapide." },
    "currency-converter": { title: "Convertisseur de Devises", description: "Convertissez entre les devises du monde entier avec des taux en direct mis à jour toutes les heures. Le système utilise des taux mis en cache si l'API est indisponible. Consultez vos conversions récentes et utilisez les raccourcis pour les paires courantes." },
    "qr-code-generator": { title: "Générateur de QR Code", description: "Générez des QR codes pour URLs, textes, Wi-Fi ou cartes de contact en un clic. Téléchargez le résultat en PNG ou SVG. Idéal pour partager des liens, connecter des invités au Wi-Fi ou créer des cartes de visite numériques." },
    "document-converter": { title: "Convertisseur de Documents", description: "Convertissez PDF, DOCX et TXT directement dans votre navigateur. Tout le traitement reste sur votre machine sans rien envoyer sur un serveur. Sélectionnez votre fichier et le format de sortie, le reste se fait automatiquement." },
    "pdf-to-excel": { title: "PDF en Excel", description: "Extrayez les tableaux de vos PDF et transformez-les en véritables feuilles de calcul Excel. Fonctionne bien sur les données structurées avec des lignes et colonnes claires. Les PDF scannés peuvent produire des résultats moins précis." },
    "reorder-pdf": { title: "Réorganiser les Pages PDF", description: "Réorganisez et supprimez des pages PDF par glisser-déposer, puis téléchargez le résultat. Réorganisez des documents entiers en quelques secondes sans installer de logiciel. Idéal pour corriger l'ordre des pages d'un scan ou réarranger une présentation." },
    "ocr": { title: "OCR: Image en Texte", description: "Transformez vos images scannées en vrai texte sélectionnable via l'IA locale. Vos fichiers ne quittent jamais votre appareil. Prend en charge plusieurs langues et fonctionne bien sur du texte clair et contrasté." },
    "word-to-pdf": { title: "Word en PDF", description: "Convertissez vos documents Word en PDF avec une mise en forme parfaitement préservée. Polices, tableaux et sauts de page sont conservés à l'identique. Idéal pour partager des documents qui doivent s'afficher exactement comme prévu." },
    "word-to-markdown": { title: "Word en Markdown", description: "Transformez vos documents Word en Markdown propre. Un vrai gain de temps pour développeurs et rédacteurs. Les titres, listes et styles de base sont bien conservés, le formatage complexe est simplifié." },
    "html-to-markdown": { title: "HTML en Markdown", description: "Convertissez n'importe quel HTML en Markdown clair et lisible, sans la soupe de balises. Idéal pour migrer du contenu depuis un CMS ou un site web vers une plateforme Markdown. Les liens et listes sont correctement convertis." },
    "excel-to-pdf": { title: "Excel en PDF", description: "Convertissez vos feuilles de calcul en PDF en conservant chaque tableau, graphique et mise en page. Chaque feuille Excel devient une page du PDF final. Partagez vos données sans craindre qu'elles soient modifiées." },
    "excel-to-csv": { title: "Excel en CSV", description: "Convertissez vos feuilles Excel au format CSV universel, compatible avec tous les outils et bases de données. Chaque feuille devient un fichier CSV séparé. Le format CSV supprime les formules et ne conserve que les données brutes." },
    "csv-to-excel": { title: "CSV en Excel", description: "Transformez vos données CSV en un vrai fichier Excel avec colonnes et mise en forme. Les types de colonnes sont détectés automatiquement quand les données sont claires. Plus besoin d'assistant d'importation compliqué." },
    "csv-to-json": { title: "CSV ↔ JSON", description: "Passez du CSV au JSON et vice-versa sans perdre une seule donnée. Les en-têtes de colonnes deviennent les clés JSON. Utilitaire rapide pour les API et les échanges de données entre applications." },
    "csv-viewer": { title: "Visionneuse CSV", description: "Affichez et triez vos fichiers CSV dans un tableau clair, sans rien télécharger nulle part. Cliquez sur les en-têtes de colonnes pour trier les données. Aucun tableur requis pour inspecter vos fichiers." },
    "pptx-to-pdf": { title: "PowerPoint en PDF", description: "Convertissez vos diapositives PowerPoint en documents PDF que tout le monde peut ouvrir. Chaque diapositive devient une page du PDF. Partagez vos présentations sans craindre les problèmes de polices ou de mise en page." },
    "pptx-to-images": { title: "PowerPoint en Images", description: "Exportez chaque diapositive en image PNG et téléchargez le tout dans un fichier ZIP. Pratique pour utiliser des diapositives dans des outils de design ou les intégrer dans d'autres documents." },
    "pdf-to-pptx": { title: "PDF en PowerPoint", description: "Transformez des pages PDF en diapositives PowerPoint modifiables. Réutilisez du contenu existant sans repartir de zéro. Chaque page devient une diapositive avec l'image intégrée, prête à être repositionnée ou annotée." },
    "heic-to-png": { title: "HEIC en PNG", description: "Convertissez vos photos HEIC en PNG pour une compatibilité maximale partout. Le PNG est sans perte et s'ouvre dans tous les visualiseurs d'images. Idéal quand vous avez besoin d'une qualité parfaite sans souci de compatibilité." },
    "heic-to-webp": { title: "HEIC en WebP", description: "Convertissez vos photos HEIC en WebP légères. Idéal pour le web moderne avec des fichiers plus petits et un chargement plus rapide. La qualité visuelle reste excellente tout en économisant de la bande passante." },
    "heic-to-pdf": { title: "HEIC en PDF", description: "Convertissez une ou plusieurs photos HEIC en un seul document PDF. Chaque photo devient une page du fichier final. Pratique pour partager plusieurs photos iPhone sous forme d'un document unique." },
    "flip-rotate-image": { title: "Retourner & Pivoter", description: "Retournez horizontalement, verticalement ou pivotez à n'importe quel angle. Idéal pour corriger les photos de travers prises avec un téléphone. Fonctionne en pleine résolution sans perte de qualité." },
    "watermark-image": { title: "Ajouter un Filigrane", description: "Ajoutez des filigranes textes personnalisés pour protéger vos photos ou les marquer à votre nom. Contrôlez la position, la taille, l'opacité et la couleur du texte. Protégez votre travail avant de le partager en ligne." },
    "favicon-generator": { title: "Générateur de Favicon", description: "Générez des favicons dans toutes les tailles nécessaires, puis téléchargez le tout en ZIP. Le pack contient tout le nécessaire pour les onglets de navigateur, les PWA et les icônes d'écran d'accueil mobile. Fonctionne à partir de n'importe quelle image source." },
    "png-to-webp": { title: "PNG en WebP", description: "Convertissez vos PNG en WebP pour des fichiers plus légers à qualité égale. Le WebP est pris en charge par tous les navigateurs modernes. Un gain de place immédiat sans changement visuel visible." },
    "jpg-to-webp": { title: "JPG en WebP", description: "Convertissez vos JPEG en WebP pour un chargement plus rapide sans perte de qualité. Les fichiers WebP sont généralement 25 à 35% plus petits que les JPEG au même niveau de qualité. Passez au WebP pour des pages web plus rapides." },
    "gif-to-webp": { title: "GIF en WebP", description: "Convertissez vos GIF en WebP pour une taille réduite et une compatibilité avec les navigateurs modernes. Le WebP supporte l'animation et produit des fichiers bien plus petits qu'un GIF équivalent. Obtenez la même animation à une fraction du poids." },
    "bmp-to-webp": { title: "BMP en WebP", description: "Convertissez vos fichiers BMP en WebP pour un usage pratique sur le web. Les fichiers BMP sont volumineux car non compressés. Le WebP offre une compression efficace sans perte de qualité visible." },
    "tiff-to-webp": { title: "TIFF en WebP", description: "Convertissez vos TIFF en WebP. Idéal pour les photographes qui passent au web et veulent des fichiers plus légers. La qualité reste comparable tout en réduisant considérablement la taille." },
    "webp-to-png": { title: "WebP en PNG", description: "Convertissez vos WebP en PNG pour un format que tout le monde peut ouvrir. Le PNG conserve toute la qualité pour les applications de design et l'impression. Utile quand vous devez partager avec des outils qui ne supportent pas encore le WebP." },
    "webp-to-jpg": { title: "WebP en JPG", description: "Convertissez vos images WebP en JPEG pour une compatibilité maximale avec tous les appareils. Le JPEG s'ouvre dans toutes les applications et services photo. Le format de repli universel quand le WebP n'est pas accepté." },
    "webp-to-pdf": { title: "WebP en PDF", description: "Convertissez vos images WebP en documents PDF. Chaque image devient une page du fichier final. Pratique pour inclure des images optimisées pour le web dans un format de document standard." },
    "webp-to-avif": { title: "WebP en AVIF", description: "Convertissez vos WebP au format AVIF nouvelle génération pour une compression encore meilleure. L'AVIF surpasse le WebP en termes de compression à qualité équivalente. Passez au format le plus récent pour des fichiers toujours plus légers." },
    "jpg-to-avif": { title: "JPG en AVIF", description: "Convertissez vos JPEG en AVIF pour une qualité supérieure avec des fichiers plus légers. L'AVIF compresse généralement 20 à 50% mieux que le JPEG sans perte visible. Préparez vos images pour l'avenir avec la prochaine génération de compression." },
    "png-to-avif": { title: "PNG en AVIF", description: "Convertissez vos PNG en AVIF, le format de compression d'images de nouvelle génération. L'AVIF gère aussi bien la compression avec et sans perte. Idéal pour réduire le stockage sans choisir entre qualité et taille." },
    "avif-to-jpg": { title: "AVIF en JPG", description: "Convertissez vos AVIF en JPEG pour une compatibilité optimale. Le JPEG fonctionne dans tous les navigateurs et applications photo sans exception. Le format de repli idéal quand l'AVIF n'est pas encore supporté." },
    "avif-to-png": { title: "AVIF en PNG", description: "Reconvertissez vos images AVIF au format PNG. Le PNG est sans perte et s'ouvre dans tous les visualiseurs d'images modernes. Passez à un format totalement compatible sans sacrifier la qualité." },
    "jpg-to-png": { title: "JPG en PNG", description: "Convertissez vos JPEG en PNG pour une qualité sans perte avec support de la transparence. Contrairement au JPEG, le PNG préserve chaque pixel exactement. Idéal quand vous avez besoin d'un fond transparent ou voulez éviter les artefacts de compression." },
    "png-to-jpg": { title: "PNG en JPG", description: "Convertissez vos PNG en JPEG pour des fichiers plus légers à partager par email. Le JPEG produit des fichiers bien plus petits pour les photos, même si certains détails sont perdus pendant la compression. Pratique quand chaque kilo compte." },
    "png-to-svg": { title: "PNG en SVG", description: "Intégrez votre image PNG dans un conteneur SVG. Utile quand une plateforme exige du SVG sans pouvoir vectoriser. L'image reste au format raster mais est encapsulée dans un balisage SVG compatible." },
    "svg-to-png": { title: "SVG en PNG", description: "Rastérisez vos graphiques SVG en images PNG nettes à la taille en pixels de votre choix. Parfait pour exporter des icônes et logos à des dimensions exactes. Le rendu vectoriel est converti en pixels à la résolution souhaitée." },
    "gif-to-png": { title: "GIF en PNG", description: "Extrayez la première image d'un GIF en une image PNG nette. Utile pour créer une vignette ou un aperçu statique à partir d'un fichier animé. La qualité est préservée sans les données d'animation." },
    "bmp-to-jpg": { title: "BMP en JPG", description: "Convertissez vos vieux fichiers BMP en JPEG pour récupérer de l'espace et faciliter le partage. Les BMP sont volumineux car non compressés. Le JPEG offre une taille bien plus raisonnable pour les photos." },
    "tiff-to-jpg": { title: "TIFF en JPG", description: "Convertissez vos TIFF en JPEG. Idéal pour partager des photos haute résolution en ligne ou par email. Les fichiers JPEG sont beaucoup plus légers tout en conservant un bon rendu visuel." },
    "tiff-to-png": { title: "TIFF en PNG", description: "Convertissez vos images TIFF en PNG pour une meilleure compatibilité web. Le PNG conserve la qualité sans perte et s'ouvre dans tous les navigateurs. Obtenez la même qualité avec une compatibilité élargie." },
    "jpg-to-pdf": { title: "JPG en PDF", description: "Convertissez vos images JPEG en PDF. Combinez plusieurs photos en un seul document avec chaque image sur sa propre page. Solution simple pour envoyer des photos via des systèmes qui n'acceptent que les PDF." },
    "png-to-pdf": { title: "PNG en PDF", description: "Convertissez vos images PNG en PDF avec une qualité parfaite et chaque image sur sa propre page. Pratique pour les captures d'écran, diagrammes et illustrations. Gardez vos images dans l'ordre et partagez-les comme un seul document." },
    "checksum": { title: "Somme de Contrôle", description: "Générez et vérifiez les sommes de contrôle SHA-1, SHA-256 ou SHA-512 de vos fichiers. Confirmez qu'un téléchargement n'a pas été modifié ou corrompu. Un outil essentiel pour vérifier l'intégrité des fichiers après téléchargement." },
    "json-formatter": { title: "Formateur JSON", description: "Formatez, validez et minifiez du JSON dans votre navigateur. Instantanément, sans serveur ni envoi de données. Collez du JSON désordonné et obtenez une sortie indentée propre, ou l'inverse." },
    "html-formatter": { title: "Formateur HTML", description: "Formatez ou minifiez du code HTML en un clic. Garde votre balisage lisible et bien structuré. Idéal pour nettoyer du code généré automatiquement avant de le mettre en production." },
    "base64": { title: "Base64 Encoder / Décoder", description: "Encodez ou décodez du texte et des fichiers en Base64 en temps réel. Pratique pour les data URIs et les payloads d'API. Fonctionne aussi bien avec la saisie texte qu'avec le téléchargement de fichiers." },
    "url-encoder": { title: "URL Encoder / Décoder", description: "Encodez et décodez les composants d'URL à la volée. Fini les chaînes de requête mal formées avec des caractères spéciaux. Les résultats se mettent à jour en temps réel pendant la saisie." },
    "word-counter": { title: "Compteur de Mots", description: "Comptez les mots, caractères, phrases et estimez le temps de lecture. Idéal pour vérifier les limites de mots dans vos textes. Utile pour les rédacteurs, étudiants et toute personne qui doit respecter un nombre de mots précis." },
    "lorem-ipsum": { title: "Générateur Lorem Ipsum", description: "Générez du texte de remplissage pour vos maquettes et prototypes dans la quantité désirée. Choisissez entre paragraphes, phrases ou mots individuels. Le Lorem Ipsum classique est inclus — sélectionnez la quantité et copiez le résultat." },
    "image-upscale": { title: "Agrandir l'Image (Upscale)", description: "Agrandissez vos images en 2x ou 4x avec préservation des détails et netteté renforcée." },
    "image-filters": { title: "Filtres & Effets d'Image", description: "Appliquez des filtres créatifs, niveaux de gris, sépia, flou, contraste et saturation en temps réel." },
    "pdf-to-pdfa": { title: "PDF en PDF/A", description: "Convertissez vos documents PDF au standard ISO PDF/A-2b pour un archivage pérenne garanti." },
    "pdf-repair": { title: "Réparer le PDF", description: "Réparez et restaurez les fichiers PDF endommagés, corrompus ou illisibles." },
    "pdf-ocr": { title: "OCR PDF", description: "Extrayez le texte modifiable de documents scannés et d'images grâce à la reconnaissance optique." },
    "pdf-metadata": { title: "Modifier Métadonnées PDF", description: "Consultez et modifiez le titre, auteur, sujet, mots-clés et propriétés de vos documents PDF." },
    "pdf-to-markdown": { title: "PDF en Markdown", description: "Convertissez vos documents PDF en syntaxe Markdown propre et parfaitement structurée." },
    "odt-to-pdf": { title: "ODT en PDF", description: "Convertissez vos fichiers OpenDocument ODT en PDF avec une fidélité de mise en page totale." },
    "rtf-to-pdf": { title: "RTF en PDF", description: "Convertissez vos documents au format texte enrichi RTF en PDF prêts à partager." },
    "data-converter": { title: "Convertisseur de Données", description: "Convertissez vos données entre JSON, CSV, XML et YAML en temps réel." },
    "json-diff": { title: "Comparateur JSON (Diff)", description: "Comparez deux objets JSON côte à côte avec surbrillance des ajouts, suppressions et modifications." },
    "csv-editor": { title: "Éditeur CSV", description: "Tableur interactif en ligne pour modifier vos colonnes, filtrer et exporter en CSV ou Excel." },
    "css-formatter": { title: "Formateur & Minifieur CSS", description: "Minifiez vos feuilles de style pour le web ou formatez du code CSS compressé en blocs lisibles." },
    "js-formatter": { title: "Formateur JS / TS", description: "Embellissez et formatez votre code JavaScript et TypeScript avec une indentation impeccable." },
    "markdown-preview": { title: "Éditeur Markdown en Direct", description: "Éditeur Markdown interactif avec prévisualisation HTML en direct et options d'export." },
    "diff-checker": { title: "Comparateur de Texte (Diff)", description: "Comparez deux textes pour visualiser instantanément les différences ligne par ligne." },
    "regex-tester": { title: "Testeur Regex", description: "Testez vos expressions régulières en temps réel avec extraction des groupes et remplacement." },
    "jwt-decoder": { title: "Décodeur de Token JWT", description: "Décodez vos jetons JSON Web Tokens (en-tête, payload, signatures) et vérifiez leur expiration." },
    "barcode-generator": { title: "Générateur de Code-Barres", description: "Générez des codes-barres CODE128, EAN-13, UPC-A et CODE39 en formats vectoriel SVG ou PNG." },
    "hash-generator": { title: "Générateur de Hash", description: "Calculez simultanément les empreintes SHA-256, SHA-512, SHA-384 et SHA-1 via SubtleCrypto." },
    "uuid-generator": { title: "Générateur d'UUID", description: "Générez des identifiants uniques RFC 4122 v4 en lot avec options de casse et préfixe." },
    "color-converter": { title: "Convertisseur de Couleurs", description: "Convertissez instantanément vos couleurs entre HEX, RGB, HSL et CMYK avec aperçu en direct." },
    "color-palette": { title: "Générateur de Palettes", description: "Créez des harmonies chromatiques esthétiques et exportez les codes CSS et Tailwind." },
    "speed-test": { title: "Test de Débit Internet", description: "Mesurez votre débit descendant, montant et temps de latence ping en direct." },
  },
  ui: {
    dropzone: "Déposez un fichier ici ou cliquez pour parcourir",
    dropzoneHint: (accept, maxMb) => `${accept} · max ${maxMb} Mo`,
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    loading: "Chargement…",
    fileExceedsSize: (fn, maxMb) => `${fn} dépasse la limite de ${maxMb} Mo.`,
    formatNotAccepted: (fn) => `${fn} — format non pris en charge.`,
    uploadAriaLabel: (label, formats, maxMb) => `${label}. Glissez-déposez ou appuyez sur Entrée pour parcourir. Accepte ${formats}, jusqu'à ${maxMb} Mo.`,
    defaultUploadAriaLabel: (formats, maxMb) => `Envoyer un fichier. Glissez-déposez ou appuyez sur Entrée pour parcourir. Accepte ${formats}, jusqu'à ${maxMb} Mo.`,
    note: "Remarque :",
    removeFileAria: (fn) => `Supprimer ${fn}`,
  },
  footer: {
    tagline: "Une collection d'outils en ligne pour les tâches courantes. Rapide, privé et gratuit.",
    rights: "Tous droits réservés.",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    cookiePreferences: "Préférences de cookies",
    security: "Sécurité",
    columns: { pdf: "Outils PDF", images: "Outils Image", utilities: "Utilitaires" },
  },
  cookie: {
    message: "Nous respectons votre vie privée — nos analyses sont totalement anonymes, sans cookies ni données personnelles. Avec votre accord, quelques publicités aident à garder tous les outils gratuits. Vos fichiers ne sont",
    neverUploaded: "jamais téléchargés",
    privacyPolicy: "Politique de confidentialité",
    essentialOnly: "Essentiel seulement",
    acceptAll: "Tout accepter",
  },
  notFound: {
    title: "Page introuvable",
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    backHome: "Retour aux outils",
  },
  tipCalc: {
    tabTip: "Calculateur de Pourboire", tabPercent: "Pourcentages",
    billAmount: "Montant de l'addition", tipPct: "Pourcentage de pourboire", numPeople: "Nombre de personnes",
    bill: "Addition", tip: (pct) => `Pourboire (${pct}%)`, total: "Total",
    tipPerPerson: "Pourboire / personne", totalPerPerson: "Total / personne",
    pctOf: "Quel est X% de Y ?", whatIs: "Quel est", isWhatPctOf: "est quel % de",
    pctChange: "% de variation de X à Y", pctChangeFrom: "% de variation de", pctChangeTo: "à",
  },
  pctCalc: {
    tabs: { of: "X % de Y", isWhat: "X est quel % de Y", change: "Variation en %", discount: "Remise", tip: "Pourboire & Partage", markup: "Marge / Majoration" },
    labels: {
      whatIsPct: "Quel est (X)%", ofY: "de (Y)", xIsWhat: "(X) est quel pourcentage", changeFrom: "Variation de (X)", changeTo: "à (Y)",
      discountPct: "Remise % (X)", origPrice: "Prix d'origine (Y)", tipPct: "Pourboire % (X)", billAmount: "Montant de l'addition (Y)",
      splitBetween: "Partager entre (personnes)", marginPct: "Marge % (X)", cost: "Coût (Y)",
    },
    result: "Résultat", increase: "Augmentation", decrease: "Diminution",
    finalPrice: "Final", saved: "Économisé", tipLabel: "Pourboire",
    perPerson: "Par personne", sellingPrice: "Prix de vente", markupLabel: "Marge",
  },
  unitConverter: {
    from: "De", to: "Vers", pin: "Épingler", pinned: "Épinglé",
    pinnedConversions: "Conversions épinglées", swapAriaLabel: "Inverser les unités",
    categoryNames: {
      length: "Longueur", weight: "Masse", temperature: "Température", volume: "Volume",
      area: "Superficie", speed: "Vitesse", pressure: "Pression", energy: "Énergie",
      power: "Puissance", data: "Données", time: "Temps", angle: "Angle", frequency: "Fréquence",
    },
    unitNames: {
      "meter": "Mètre", "kilometer": "Kilomètre", "centimeter": "Centimètre", "millimeter": "Millimètre",
      "mile": "Mile", "yard": "Yard", "foot": "Pied", "inch": "Pouce",
      "nautical-mile": "Mille nautique", "light-year": "Année-lumière",
      "kilogram": "Kilogramme", "gram": "Gramme", "milligram": "Milligramme",
      "pound": "Livre", "ounce": "Once", "stone": "Stone",
      "ton-metric": "Tonne (métrique)", "ton-imperial": "Tonne (impériale)", "ton-us": "Tonne (US)",
      "celsius": "Celsius", "fahrenheit": "Fahrenheit", "kelvin": "Kelvin",
      "liter": "Litre", "milliliter": "Millilitre",
      "gallon-us": "Gallon (US)", "gallon-uk": "Gallon (UK)",
      "quart": "Quart", "pint": "Pinte", "cup": "Tasse",
      "fluid-ounce": "Once liquide", "tablespoon": "Cuillère à soupe", "teaspoon": "Cuillère à café",
      "cubic-meter": "Mètre cube", "cubic-centimeter": "Centimètre cube",
      "square-meter": "Mètre carré", "square-kilometer": "Kilomètre carré",
      "square-centimeter": "Centimètre carré", "square-millimeter": "Millimètre carré",
      "square-mile": "Mile carré", "square-yard": "Yard carré",
      "square-foot": "Pied carré", "square-inch": "Pouce carré",
      "hectare": "Hectare", "acre": "Acre",
      "meter-second": "Mètre / Seconde", "kilometer-hour": "Kilomètre / Heure",
      "mile-hour": "Mile / Heure", "knot": "Nœud", "foot-second": "Pied / Seconde",
      "pascal": "Pascal", "kilopascal": "Kilopascal", "megapascal": "Mégapascal",
      "bar": "Bar", "millibar": "Millibar", "psi": "PSI",
      "atm": "Atmosphère", "torr": "Torr", "mmhg": "Millimètre de mercure",
      "joule": "Joule", "kilojoule": "Kilojoule", "megajoule": "Mégajoule",
      "calorie": "Calorie", "kilocalorie": "Kilocalorie",
      "watt-hour": "Wattheure", "kilowatt-hour": "Kilowattheure",
      "electron-volt": "Électronvolt", "btu": "BTU",
      "watt": "Watt", "kilowatt": "Kilowatt", "megawatt": "Mégawatt",
      "horsepower-metric": "Cheval-vapeur (métrique)", "horsepower-imperial": "Cheval-vapeur (impérial)",
      "btu-hour": "BTU / Heure",
      "byte": "Octet", "bit": "Bit", "kilobyte": "Kilooctet",
      "megabyte": "Mégaoctet", "gigabyte": "Gigaoctet", "terabyte": "Téraoctet",
      "kibibyte": "Kibioctet", "mebibyte": "Mébioctet",
      "gibibyte": "Gibioctet", "tebibyte": "Tébioctet",
      "second": "Seconde", "millisecond": "Milliseconde", "microsecond": "Microseconde",
      "minute": "Minute", "hour": "Heure", "day": "Jour",
      "week": "Semaine", "month": "Mois", "year": "Année",
      "degree": "Degré", "radian": "Radian", "gradian": "Grade",
      "arcminute": "Minute d'arc", "arcsecond": "Seconde d'arc",
      "hertz": "Hertz", "kilohertz": "Kilohertz", "megahertz": "Mégahertz",
      "gigahertz": "Gigahertz", "rpm": "tr/min",
    },
  },
  currencyConverter: {
    from: "De", to: "Vers",
    quickConversions: "Conversions rapides", recentHistory: "Historique récent",
    noRecent: "Aucune conversion récente.",
    liveRatesUpdated: (min) => `Taux en direct, mis à jour il y a ${min} min`,
    liveRatesJust: "Taux en direct, vient d'être mis à jour",
    offlineSnapshot: (date) => `Données hors ligne, taux au ${date}`,
  },
  passwordGenerator: {
    length: (n) => `Longueur : ${n}`,
    uppercase: "Majuscules (A-Z)", lowercase: "Minuscules (a-z)",
    numbers: "Chiffres (0-9)", symbols: "Symboles (!@#$)", pronounceable: "Mode prononçable",
    count: "Nombre à générer", regenerate: "Régénérer", copy: "Copier",
    bulkGeneration: "Génération en masse", history: "Historique", clearHistory: "Effacer l'historique",
    strength: { weak: "Faible", fair: "Correct", strong: "Fort", veryStrong: "Très fort", exceptional: "Exceptionnel" },
  },
  formatSelector: { search: "Rechercher...", noResults: "Aucun résultat" },
  aiTextScrubber: {
    tabInvisible: "Suppression de caractères invisibles",
    tabStylistic: "Nettoyage stylistique",
    placeholder: "Collez votre texte ici...",
    scan: "Analyser",
    removeBtn: "Supprimer",
    scrubPhrases: "Nettoyer les phrases",
    foundCount: (n) => `${n} caractère${n === 1 ? "" : "s"} invisible${n === 1 ? "" : "s"} trouvé${n === 1 ? "" : "s"}.`,
    cleanedOutput: "Résultat nettoyé",
    copy: "Copier",
    downloadTxt: "Télécharger .txt",
    disclaimer: "Avertissement : Ceci ne garantit pas le contournement de toutes les méthodes de détection d'IA, y compris les techniques de filigrane cryptographique.",
  },
  backgroundRemover: {
    note: "Vos images sont traitées de manière sécurisée par connexion chiffrée et supprimées dès la fin de l'opération.",
    removeBtn: "Supprimer l'arrière-plan",
    removeMultipleBtn: (n) => `Supprimer l'arrière-plan (${n} images)`,
    processingImage: "Suppression de l'arrière-plan en cours...",
    processingCount: (current, total) => `Traitement de l'image ${current} sur ${total}`,
    original: "Original",
    result: "Résultat",
    inspect: "Inspecter le détourage",
    downloadAll: "Tout télécharger (ZIP)",
    downloadSingle: "Télécharger le PNG",
    processAnother: "Détourer une autre image",
    cancel: "Annuler",
    dragSliderHint: "Glissez le curseur pour inspecter",
  },
  metadataCleaner: {
    tabImages: "Images",
    tabPdfs: "PDFs",
    tabDocs: "Documents (DOCX)",
    analyzeBtn: "Analyser les métadonnées",
    foundMetadata: "Métadonnées trouvées",
    cleanBtn: "Nettoyer et télécharger",
    cleaningLabel: "Nettoyage...",
    disclaimer: "Avertissement : Cet outil supprime les champs de métadonnées courants (EXIF, XMP, propriétés du document). Il ne garantit pas la suppression des empreintes cryptographiques, des données stéganographiques ou des filigranes de modèle IA intégrés dans les valeurs de pixels.",
    cleaning: "Suppression des métadonnées EXIF, GPS, auteur et révisions…",
    error: "Le nettoyage des métadonnées a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Métadonnées supprimées avec succès",
    downloadCleaned: "Télécharger le fichier assaini",
    convertAnother: "Nettoyer un autre fichier",
    statusMilestone1: "Inspection des en-têtes et métadonnées intégrées…",
    statusMilestone2: "Purge des données EXIF, GPS, profils et balises…",
    statusMilestone3: "Suppression de l'historique d'auteur et du suivi…",
    statusMilestone4: "Reconstruction du fichier nettoyé et sécurisé…",
    featureExif: "Suppression EXIF & GPS",
    featureExifDesc: "Supprime marque, modèle de l'appareil, géolocalisation, date et miniatures.",
    featurePdfDoc: "Purge des PDF & documents",
    featurePdfDocDesc: "Supprime le nom d'auteur, titre, signatures logicielles et historiques de révision.",
    featurePrivate: "Privé & sécurisé",
    featurePrivateDesc: "Les PDF sont nettoyés localement ; les images sont traitées de façon sécurisée et effacées.",
    honestHybridNote: "Les PDF sont nettoyés directement dans votre navigateur. Les images et documents sont assainis sur notre serveur puis supprimés immédiatement.",
  },
  pdfCompress: {
    compressionLevel: "Choisissez le niveau de compression",
    compressBtn: "Compresser le PDF",
    compressingLabel: "Optimisation du PDF et compression des images...",
    statsOriginal: "Taille originale",
    statsCompressed: "Taille compressée",
    statsReduction: "Espace économisé",
    downloadBtn: (filename) => `Télécharger ${filename}`,
    note: "Le texte reste net et sélectionnable, les polices et signets sont préservés tout en allégeant considérablement le fichier.",
    extremeTitle: "Compression Extrême",
    extremeDesc: "Moins de qualité, haute compression — idéal pour pièces jointes e-mails",
    extremeBadge: "Fichier minimal",
    recommendedTitle: "Compression Recommandée",
    recommendedDesc: "Bonne qualité, bonne compression — le meilleur choix pour le web et le partage",
    recommendedBadge: "Meilleur équilibre",
    lowTitle: "Faible Compression",
    lowDesc: "Haute qualité, moins de compression — idéal pour l'impression haute définition",
    lowBadge: "Impression & Archive",
    changeFile: "Changer de fichier",
    anotherFile: "Compresser un autre PDF",
    recommendedTag: "Recommandé",
  },
  qrCode: {
    contentType: "Type de contenu",
    modes: {
      url: "URL",
      text: "Texte",
      wifi: "Wi-Fi",
      vcard: "Contact",
    },
    content: "Contenu",
    textLabel: "Texte",
    enterText: "Entrez votre texte...",
    wifiSsid: "Nom du réseau (SSID)",
    wifiPass: "Mot de passe",
    encryption: "Chiffrement",
    encNone: "Aucun",
    fullName: "Nom complet",
    email: "Adresse e-mail",
    phone: "Téléphone",
    options: "Options",
    size: (n) => `Taille : ${n}px`,
    margin: (n) => `Marge : ${n}`,
    errorCorrection: "Correction d'erreur",
    qrColor: "Couleur QR",
    bgColor: "Couleur de fond",
    preview: "Aperçu",
    emptyHint: "Entrez du contenu pour générer un QR code",
    downloadPng: "Télécharger PNG",
    copyImage: "Copier en tant qu'image",
    copied: "Copié !",
    privacyNote: "Généré entièrement dans votre navigateur. Aucune donnée n'est transmise.",
  },
  pdfMerge: {
    mergeBtn: (n) => `Fusionner les ${n} fichiers PDF`,
    mergingLabel: "Fusion et assemblage des pages...",
    errorMin2: "Veuillez sélectionner au moins 2 fichiers PDF à fusionner.",
    addMore: "Ajouter d'autres PDF",
    clearAll: "Vider la liste",
    sortAZ: "Trier A-Z",
    totalSize: "Poids total",
    filesCount: (n) => `${n} ${n === 1 ? 'fichier sélectionné' : 'fichiers sélectionnés'}`,
    needTwoPrompt: "Ajoutez au moins un deuxième fichier PDF pour pouvoir les fusionner en un seul document.",
    dragTip: "Ajustez l'ordre des documents à l'aide des flèches avant de fusionner.",
    mergedSuccess: "PDFs fusionnés avec succès !",
    downloadMerged: "Télécharger le PDF fusionné",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la fusion.",
  },
  imageCompress: {
    qualitySlider: "Curseur de qualité",
    targetSize: "Taille cible",
    quality: "Qualité",
    smallest: "1 (plus petit)",
    original100: "100 (original)",
    targetSizeLabel: "Taille cible",
    kbPerFile: "Ko par fichier",
    resize: "Redimensionner",
    noResize: "Sans redimensionnement",
    scalePercent: "Échelle %",
    maxWH: "Max L/H",
    pxKeepsAspect: "px, conserve le ratio",
    stripExif: "Supprimer les métadonnées EXIF (GPS, info appareil, horodatages)",
    compressBtn: (n) => `Compresser ${n} image${n === 1 ? "" : "s"}`,
    compressing: "Compression...",
    originalLabel: "Original",
    compressedLabel: "Compressé",
    processing: "Traitement...",
    downloadBtn: "Télécharger",
    removeBtn: "Supprimer",
    dropHint: "Déposez des images ici ou cliquez pour sélectionner. 20 fichiers max, 20 Mo chacun.",
    downloadAll: (n) => `Tout télécharger (${n})`,
    compressAnother: "Compresser une autre image",
    compare: "Comparer avant & après",
    backToList: "Retour à la liste",
    batchProgress: (done, total) => `${done} sur ${total} images compressées`,
    step1: "Lecture des données de l'image...",
    step2: "Optimisation de la compression...",
    step3: "Suppression des métadonnées inutiles...",
    step4: "Finalisation du fichier optimisé...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
    dimensions: "Dimensions",
    maxWidth: "Largeur max",
    maxHeight: "Hauteur max",
    clearAll: "Tout effacer",
    statusPending: "Prêt",
    statusProcessing: "Compression...",
    statusDone: "Compressé",
    statusError: "Échec",
  },
  imageResize: {
    byPixels: "Par pixels",
    byPercentage: "Par pourcentage",
    width: "Largeur (px)",
    height: "Hauteur (px)",
    lockAspectRatio: "Conserver les proportions",
    percentage: "Échelle en pourcentage",
    originalDimensions: "Dimensions originales",
    targetDimensions: "Dimensions cibles",
    resizeBtn: "Redimensionner l'image",
    resizing: "Redimensionnement de l'image...",
    invalidDimensions: "Veuillez saisir des dimensions valides pour la largeur et la hauteur.",
    invalidPercentage: "Veuillez saisir un pourcentage valide supérieur à 0.",
    step1: "Lecture des dimensions de l'image...",
    step2: "Rééchantillonnage des pixels...",
    step3: "Encodage de l'image redimensionnée...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
    resizeAnother: "Redimensionner une autre image",
  },
  imageCrop: {
    aspectFree: "Libre",
    aspectSquare: "1:1 (Carré)",
    aspect43: "4:3",
    aspect169: "16:9",
    aspect32: "3:2",
    selection: (w, h) => `Sélection : ${w} × ${h} px`,
    dragPrompt: "Cliquez et glissez pour sélectionner une zone",
    cropBtn: "Recadrer l'image",
    cropping: "Recadrage de l'image...",
    cancel: "Annuler",
    cropAnother: "Recadrer une autre image",
    step1: "Lecture des coordonnées de recadrage...",
    step2: "Extraction de la zone recadrée...",
    step3: "Encodage de l'image finale...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
  },
  flipRotateImage: {
    rotateHeading: "Rotation",
    flipHeading: "Retournement",
    normalOrientation: "Orientation d'origine",
    rotateLeft: "Pivoter 90° à gauche",
    rotateRight: "Pivoter 90° à droite",
    rotate180: "Pivoter 180°",
    flipHorizontal: "Retourner horizontalement",
    flipVertical: "Retourner verticalement",
    resetTransform: "Réinitialiser l'orientation",
    outputFormat: "Format de sortie",
    applyBtn: "Appliquer et télécharger",
    applying: "Application des transformations...",
    changeImage: "Changer d'image",
    editAnother: "Transformer une autre image",
    currentOrientation: "Orientation actuelle",
    step1: "Lecture de l'image...",
    step2: "Application des transformations d'orientation...",
    step3: "Encodage de l'image finale...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
  },
  watermarkImage: {
    watermarkText: "Texte du filigrane",
    fontSize: "Taille de police",
    color: "Couleur",
    opacity: "Opacité",
    position: "Position",
    positions: {
      topLeft: "Haut gauche",
      topRight: "Haut droite",
      center: "Centre",
      bottomLeft: "Bas gauche",
      bottomRight: "Bas droite",
    },
    applyBtn: "Appliquer le filigrane et télécharger",
    applying: "Application du filigrane...",
    changeImage: "Changer d'image",
    watermarkAnother: "Filigraner une autre image",
    step1: "Lecture de l'image et configuration...",
    step2: "Composition du calque de filigrane...",
    step3: "Encodage de l'image finale...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
  },
  faviconGenerator: {
    includedSizes: "Tailles incluses dans le fichier ZIP",
    browserPreview: "Aperçu onglet de navigateur",
    mobilePreview: "Aperçu icône mobile",
    sampleTab: "Mon Super Site Web",
    sampleApp: "Icône App",
    htmlSnippetTitle: "Balises HTML à inclure dans votre site web",
    copyHtml: "Copier le code HTML",
    copied: "Copié !",
    generateBtn: "Générer et télécharger le pack ZIP",
    generating: "Génération du pack de favicons...",
    changeImage: "Changer d'image",
    generateAnother: "Générer un autre favicon",
    downloadZip: "Télécharger le ZIP des favicons",
    step1: "Redimensionnement aux résolutions standard...",
    step2: "Assemblage du conteneur ICO multi-résolution...",
    step3: "Compression dans l'archive ZIP finale...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
  },
  documentConverter: {
    inputFile: "Fichier d'entrée",
    selectDesc: "Sélectionnez un fichier PDF, DOCX ou TXT.",
    dragDrop: "Déposez votre fichier ici",
    clickBrowse: "ou cliquez pour parcourir",
    convertBtn: "Convertir le document",
    processingBtn: "Traitement...",
    converting: "Conversion du document…",
    conversionFailed: "Conversion échouée",
    output: "Résultat",
    outputDesc: "Texte extrait ou fichier téléchargé.",
    downloadTxt: "Télécharger en TXT",
    pdfSuccess: "PDF converti et téléchargé avec succès.",
    ready: "Prêt à convertir.",
    error: "La conversion du document a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Conversion terminée avec succès",
    downloadFile: (ext: string) => `Télécharger le fichier ${ext.toUpperCase()}`,
    convertAnother: "Convertir un autre document",
    targetLabel: "Convertir en :",
    featureEngine: "Moteur LibreOffice",
    featureEngineDesc: "Propulsé par LibreOffice sans interface pour une fidélité maximale.",
    featureFidelity: "Mise en page préservée",
    featureFidelityDesc: "Conversion précise des polices, tableaux, marges et éléments graphiques.",
    featurePrivate: "Privé & éphémère",
    featurePrivateDesc: "Traité dans des bacs à sable isolés et effacé immédiatement.",
    statusMilestone1: "Analyse de la structure du document...",
    statusMilestone2: "Initialisation du moteur de conversion...",
    statusMilestone3: "Conversion des styles et de la mise en page...",
    statusMilestone4: "Génération du fichier de sortie...",
    honestServerNote: "Documents traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après conversion.",
  },
  imageConverter: {
    settings: "Paramètres",
    outputFormat: "Format de sortie",
    quality: "Qualité",
    convertAll: "Tout convertir",
    converting: "Conversion...",
    downloadAll: "Tout télécharger (ZIP)",
    download: "Télécharger",
    addImages: "Ajouter des images",
    dragDrop: "Glissez-déposez ou cliquez pour parcourir (max 20)",
    processing: "Traitement...",
    clearAll: "Tout effacer",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement.",
    convertAnother: "Convertir une autre image",
  },
  ocr: {
    modelNote: "Moteur neuronal Tesseract OCR côté serveur. Prend en charge le texte multi-colonnes et les documents scannés.",
    extractBtn: "Extraire le texte (OCR)",
    extracting: "Extraction du texte de l'image par OCR…",
    extractedText: "Texte extrait",
    error: "L'extraction OCR a échoué. Assurez-vous que l'image contient du texte lisible.",
    readyBadge: "Texte extrait avec succès",
    downloadTxt: "Télécharger le texte (.txt)",
    convertAnother: "Scanner une autre image",
    languageLabel: "Langue du document",
    statusMilestone1: "Envoi sécurisé de l'image…",
    statusMilestone2: "Prétraitement et optimisation du contraste…",
    statusMilestone3: "Exécution du moteur neuronal Tesseract…",
    statusMilestone4: "Structuration du texte reconnu…",
    featureAccuracy: "OCR neuronal Tesseract",
    featureAccuracyDesc: "Modèles d'apprentissage profond pour reconnaître fidèlement les textes imprimés et scannés.",
    featureFormats: "Support universel",
    featureFormatsDesc: "Compatible avec les scans JPG, PNG, WebP, TIFF, BMP et GIF.",
    featurePrivate: "Chiffré & éphémère",
    featurePrivateDesc: "Les images sont traitées en mémoire et effacées immédiatement.",
    honestServerNote: "Les images sont analysées de façon sécurisée sur notre serveur avec Tesseract OCR et supprimées immédiatement.",
  },
  wordCounter: {
    words: "Mots",
    chars: "Caractères",
    noSpaces: "Sans espaces",
    sentences: "Phrases",
    paragraphs: "Paragraphes",
    readingTime: "Temps de lecture",
    clear: "Effacer",
    copyText: "Copier le texte",
    pasteHere: "Collez ou tapez votre texte ici…",
  },
  common: {
    download: "Télécharger",
    downloadAll: (n) => `Télécharger les ${n} fichiers en ZIP`,
    copy: "Copier",
    copied: "Copié !",
    reset: "Réinitialiser",
    remove: "Supprimer",
    clear: "Effacer",
    processing: "Traitement…",
    converting: "Conversion…",
    quality: "Qualité",
    original: "Original",
    converted: "Converti",
    extractText: "Extraire le texte",
    extractedText: "Texte extrait",
    dropFileHere: "Déposez le fichier ici, ou cliquez pour parcourir",
    dropFilesHere: (label) => `Déposez les fichiers ${label} ici ou cliquez pour parcourir`,
    uploadFile: "Parcourir",
    pasteText: "Collez votre texte ici…",
    outputAppearsHere: "La sortie apparaît ici…",
    convertToPdf: "Convertir en PDF",
    downloadPdf: "Télécharger le PDF",
    downloadCsv: "Télécharger le CSV",
    downloadTxt: "Télécharger .txt",
    convertFiles: (n, ext) => `Convertir ${n} fichier${n > 1 ? 's' : ''} en ${ext}`,
    pdfReady: (kb) => `PDF prêt, ${kb} Ko`,
    sheet: "Feuille :",
    exportSheet: "Exporter la feuille :",
    convertBtn: "Convertir",
    preview: (n) => `Aperçu (${n} lignes)`,
    orPasteDirectly: "Ou collez directement :",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    view: "Afficher",
    copyText: "Copier le texte",
    format: "Formater",
    minify: "Minifier",
    encode: "Encoder",
    decode: "Décoder",
    generate: "Générer",
  },
  jsonFormatter: {
    inputLabel: "JSON d'entrée",
    formattedOutput: "Résultat formaté",
    minifiedOutput: "Résultat minifié",
    indent: "Indentation :",
    stats: (chars, bytes) => `${chars} caractères · ${bytes} octets`,
    invalidJson: "JSON invalide",
  },
  htmlFormatter: {
    inputLabel: "HTML d'entrée",
    outputLabel: "Résultat",
    bytes: (n) => `${n} octets`,
  },
  urlEncoder: {
    rawUrlText: "URL brute / texte",
    encodedUrl: "URL encodée",
    encodedOutput: "Résultat encodé",
    decodedOutput: "Résultat décodé",
    quickExamples: "Exemples rapides",
    invalidInput: "Entrée invalide",
    examples: { space: "Espace", ampersand: "Esperluette", equals: "Égal", hash: "Dièse" },
  },
  base64Encoder: {
    uploadFile: "Envoyer un fichier → Base64",
    plainTextInput: "Texte brut",
    base64Input: "Entrée Base64",
    base64Output: "Résultat Base64",
    decodedText: "Texte décodé",
    encodePlaceholder: "Tapez ou collez le texte à encoder…",
    decodePlaceholder: "Collez le Base64 à décoder…",
    chars: (n) => `${n} caractères`,
    invalidInput: "Entrée invalide",
  },
  loremIpsum: {
    types: { paragraphs: "Paragraphes", sentences: "Phrases", words: "Mots", lists: "Listes" },
    count: "Nombre :",
    classicStart: "Commencer avec le Lorem ipsum classique",
  },
  nextToolMenu: {
    title: "Ouvrir dans un autre outil",
    openIn: "Ouvrir dans...",
    otherTools: "Autres outils",
    openInOtherTools: "Ouvrir dans d'autres outils",
    steps: {
      compressImage: { label: "Compresser l'image", desc: "Réduire le poids du fichier" },
      resizeDimensions: { label: "Redimensionner", desc: "Largeur et hauteur personnalisées" },
      convertFormat: { label: "Convertir le format", desc: "Exporter en JPG, WebP, PNG" },
      cropImage: { label: "Recadrer l'image", desc: "Ratio d'aspect et recadrage libre" },
      watermarkImage: { label: "Ajouter un filigrane", desc: "Protection texte et logo" },
      applyFilters: { label: "Appliquer des filtres", desc: "Ajustements de couleur et style" },
      compressPdf: { label: "Compresser le PDF", desc: "Réduire la taille du document" },
      pdfToWord: { label: "PDF en Word", desc: "Format DOCX modifiable" },
      protectPdf: { label: "Protéger par mot de passe", desc: "Chiffrer et sécuriser" },
      watermarkPdf: { label: "Ajouter un filigrane", desc: "Tampon et texte en surimpression" },
      pdfToImage: { label: "PDF en images", desc: "Extraire les pages en images" },
      wordToPdf: { label: "Convertir en PDF", desc: "Mise en page haute fidélité" },
      wordToEpub: { label: "Convertir en EPUB", desc: "Liseuse d'e-book standard" },
      wordToMarkdown: { label: "Convertir en Markdown", desc: "Markdown propre pour docs" },
      universalConverter: { label: "Convertisseur universel", desc: "ODT, RTF, HTML et plus" },
    },
  },
  resultPanel: {
    readyToDownload: "Prêt à télécharger",
    downloadExt: (ext) => `Télécharger ${ext}`,
    downloadAria: (fn) => `Télécharger ${fn}`,
    extractedText: "Texte extrait",
    copyAll: "Tout copier",
    copied: "Copié !",
    downloadTxtAria: "Télécharger le texte extrait en .txt",
    copyAria: "Copier le texte extrait",
  },
  toolProcessor: {
    uploading: "Envoi du fichier...",
    processing: "Traitement en cours...",
    takeSeconds: "Cela peut prendre quelques secondes",
    completed: "Traitement terminé",
    startOver: "Recommencer",
    download: "Télécharger",
    failed: "Le traitement a échoué",
    defaultError: "Impossible de traiter le fichier. Veuillez vérifier le fichier et réessayer.",
    retry: "Réessayer",
    original: "Original",
    result: "Résultat",
    steps: {
      analyzing: "Analyse du fichier...",
      processing: "Traitement...",
      optimizing: "Optimisation du résultat...",
      finalizing: "Finalisation...",
    },
  },
  pdfUnlock: {
    note: "Supprimez les restrictions de droits (impression, copie de texte et modification) ou déchiffrez complètement le PDF avec son mot de passe.",
    unlockBtn: "Déverrouiller & Déchiffrer le PDF",
    unlocking: "Suppression du chiffrement et des restrictions...",
    error: "Échec du déverrouillage. Veuillez vérifier le mot de passe.",
    readyBadge: "PDF déverrouillé avec succès !",
    downloadPdf: "Télécharger le PDF déverrouillé",
    unlockAnother: "Déverrouiller un autre PDF",
    passwordLabel: "Mot de passe du document (si requis)",
    passwordPlaceholder: "Entrez le mot de passe si le fichier est protégé",
    passwordHelp: "Laissez vide si le document a seulement des restrictions d'impression ou de modification.",
    featureRestrictions: "Suppression des restrictions",
    featureRestrictionsDesc: "Débloque immédiatement l'impression, la copie et la sélection de texte.",
    featureCompatibility: "Compatibilité universelle",
    featureCompatibilityDesc: "Fichier parfaitement lisible dans Acrobat, les navigateurs et sur mobile.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement direct en mémoire vive éphémère, aucun document conservé.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après le déverrouillage.",
  },
  pdfProtect: {
    cardTitle: "MOTS DE PASSE ET PERMISSIONS",
    userPasswordLabel: "Mot de passe d'ouverture (requis pour ouvrir)",
    userPasswordPlaceholder: "Entrez un mot de passe robuste",
    ownerPasswordLabel: "Mot de passe maître / permissions (optionnel)",
    ownerPasswordPlaceholder: "Mot de passe maître pour modifier les droits",
    allowPrinting: "Autoriser l'impression",
    allowCopying: "Autoriser l'extraction de texte et d'images",
    allowModifying: "Autoriser la modification du document",
    protectBtn: "Protéger le PDF (AES-256)",
    encrypting: "Chiffrement AES-256 en cours...",
    errorNoPassword: "Veuillez définir au moins un mot de passe d'ouverture.",
    error: "Échec de la protection. Veuillez réessayer.",
    readyBadge: "PDF protégé avec succès !",
    downloadPdf: "Télécharger le PDF protégé",
    protectAnother: "Protéger un autre PDF",
    aes256Badge: "Chiffrement militaire AES-256",
    permissionsTitle: "Permissions du document",
    permissionsDesc: "Définissez précisément les actions permises aux lecteurs autorisés.",
    generatePasswordBtn: "Générer un mot de passe fort",
    strengthWeak: "Faible",
    strengthMedium: "Moyen",
    strengthStrong: "Très fort",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après le chiffrement.",
  },
  pdfRotate: {
    cardTitle: "Options de rotation",
    right90: "Vers la droite (90°)",
    upsideDown180: "À l'envers (180°)",
    left270: "Vers la gauche (270°)",
    rotateBtn: "Appliquer la rotation",
    rotating: "Rotation des pages du PDF...",
    error: "Échec de la rotation. Veuillez réessayer.",
    rotateAllRight: "Tourner toutes (90° droite)",
    rotateAllLeft: "Tourner toutes (90° gauche)",
    resetRotations: "Réinitialiser les orientations",
    rotateSingleRight: "Pivoter 90° à droite",
    rotateSingleLeft: "Pivoter 90° à gauche",
    pageLabel: (n: number) => `Page ${n}`,
    pagesCount: (n: number) => `${n} page${n > 1 ? 's' : ''}`,
    saveRotatedPdf: "Télécharger le PDF pivoté",
    renderingPages: "Génération des aperçus des pages...",
    loadDifferent: "Choisir un autre PDF",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la rotation.",
  },
  pdfSplit: {
    optionsTitle: "Options de découpage",
    everyPage: "Extraire chaque page en fichiers PDF individuels (ZIP)",
    rangeOption: "Extraire des pages ou plages spécifiques",
    rangePlaceholder: "ex. 1-3, 5, 7-10",
    splitBtn: "Découper le PDF",
    splitting: "Découpage du PDF...",
    error: "Échec du découpage. Veuillez réessayer.",
    modeRangeTitle: "Diviser par plages personnalisées",
    modeRangeDesc: "Définissez un ou plusieurs intervalles de pages",
    modeExtractTitle: "Extraire des pages spécifiques",
    modeExtractDesc: "Sélectionnez précisément les pages à extraire",
    allPagesSub: "Toutes les pages dans des PDF distincts (ZIP)",
    selectPagesSub: "Sélection manuelle ou par numéros",
    mergeOption: "Fusionner toutes les pages extraites dans un seul fichier PDF",
    mergeOptionHelp: "Crée un document PDF unique et ordonné avec les pages choisies",
    addRangeBtn: "Ajouter une autre plage",
    fromPage: "De la page",
    toPage: "à la page",
    pagesCount: (n) => `${n} page${n > 1 ? "s" : ""}`,
    selectAll: "Toutes",
    deselectAll: "Effacer",
    evenPages: "Pages paires",
    oddPages: "Pages impaires",
    pagesSelected: (sel, tot) => `${sel} sur ${tot} pages sélectionnées`,
    readyBadge: "Découpage terminé avec succès",
    downloadPdf: "Télécharger le PDF extrait",
    downloadZip: "Télécharger l'archive (.ZIP)",
    splitAnother: "Découper un autre PDF",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après le découpage.",
  },
  pdfToWord: {
    convertBtn: "Convertir en Word (DOCX)",
    converting: "Conversion en cours...",
    error: "Échec de la conversion. Veuillez réessayer.",
    readyBadge: "Conversion terminée avec succès !",
    downloadDocx: "Télécharger le document Word (.DOCX)",
    convertAnother: "Convertir un autre PDF",
    featureFidelity: "Préservation des styles et mises en page",
    featureFidelityDesc: "Titres, corps de texte, alignements et tableaux fidèlement retranscrits.",
    featureEditable: "DOCX 100% Modifiable",
    featureEditableDesc: "Parfaitement compatible avec Microsoft Word, Google Docs et LibreOffice.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement éphémère direct en mémoire vive, aucun document conservé.",
    statusMilestone1: "Analyse de la structure et typographie du PDF...",
    statusMilestone2: "Détection des titres, paragraphes et tableaux...",
    statusMilestone3: "Génération des balises Word OpenXML (.docx)...",
    statusMilestone4: "Finalisation du document éditable...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pdfToExcel: {
    convertBtn: "Convertir en Excel (XLSX)",
    converting: "Extraction des tableaux...",
    error: "Échec de l'extraction. Veuillez réessayer.",
    readyBadge: "Tableaux Excel extraits avec succès !",
    downloadXlsx: "Télécharger le classeur Excel (.XLSX)",
    convertAnother: "Convertir un autre PDF",
    featureTables: "Détection précise des tableaux",
    featureTablesDesc: "Reconnaissance automatique des en-têtes, lignes, colonnes et grilles.",
    featureCells: "Données prêtes à l'analyse",
    featureCellsDesc: "Cellules typées (chiffres, dates, texte) exploitables immédiatement.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement direct en mémoire vive, aucune copie enregistrée.",
    statusMilestone1: "Analyse de la structure et des tracés vectoriels...",
    statusMilestone2: "Extraction des données tabulaires et en-têtes...",
    statusMilestone3: "Génération des feuilles de calcul et grilles Excel...",
    statusMilestone4: "Finalisation du classeur...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après l'extraction.",
  },
  pdfToPptx: {
    convertBtn: "Convertir en PowerPoint (PPTX)",
    converting: "Création de la présentation...",
    error: "Échec de la conversion. Veuillez réessayer.",
    readyBadge: "Présentation PowerPoint générée avec succès !",
    downloadPptx: "Télécharger la présentation PowerPoint (.PPTX)",
    convertAnother: "Convertir un autre PDF",
    featureSlides: "Conversion page par diapositive",
    featureSlidesDesc: "Chaque page du document devient une diapositive PowerPoint dédiée.",
    featureLayout: "Fidélité visuelle maximale",
    featureLayoutDesc: "Titres, images, graphismes et mises en page fidèlement reproduits.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement direct en mémoire sécurisée, aucun fichier stocké.",
    statusMilestone1: "Analyse des pages et éléments graphiques du PDF...",
    statusMilestone2: "Création de la structure des diapositives...",
    statusMilestone3: "Intégration des médias, polices et vecteurs...",
    statusMilestone4: "Finalisation du diaporama...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pdfToText: {
    convertBtn: "Extraire le texte brut",
    converting: "Extraction du contenu texte...",
    error: "Échec de l'extraction du texte. Veuillez réessayer.",
    readyBadge: "Texte extrait avec succès !",
    downloadTxt: "Télécharger le fichier TXT",
    copyText: "Copier le texte",
    copiedText: "Copié !",
    previewText: "Voir l'aperçu",
    convertAnother: "Extraire un autre PDF",
    featureEncoding: "Format UTF-8 propre",
    featureEncodingDesc: "Conservation impeccable des accents, symboles et retours à la ligne.",
    featureClean: "Aperçu & Copie instantanés",
    featureCleanDesc: "Lisez et copiez le texte directement ou téléchargez-le au format TXT.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement strict en mémoire vive éphémère, aucun stockage sur disque.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après l'extraction.",
  },
  pdfWatermark: {
    cardTitle: "Configuration du filigrane",
    watermarkText: "Texte du filigrane",
    fontSize: (n) => `Taille de police (${n}px)`,
    opacity: (pct) => `Opacité (${pct}%)`,
    color: "Couleur",
    colors: { gray: "Gris subtil", black: "Noir intense", red: "Rouge urgent", blue: "Bleu marine" },
    applyBtn: "Appliquer le filigrane & Télécharger",
    applying: "Incrustation du filigrane sur les pages...",
    error: "Échec de l'application du filigrane. Veuillez réessayer.",
    rotation: "Angle / Orientation",
    presets: "Modèles rapides",
    livePreview: "Aperçu en direct du document",
    pagesScope: "Pages ciblées",
    pagesScopeAll: "Toutes les pages",
    pagesScopeFirst: "Première page uniquement",
    pagesScopeCustom: "Plage de pages personnalisée",
    downloadWatermarked: "Télécharger le PDF avec filigrane",
    changeFile: "Changer de document",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après l'ajout du filigrane.",
  },
  pdfPageNumbers: {
    cardTitle: "Options de numérotation",
    position: "Emplacement du numéro",
    positions: {
      bottomCenter: "En bas au centre",
      bottomRight: "En bas à droite",
      bottomLeft: "En bas à gauche",
      topCenter: "En haut au centre",
      topRight: "En haut à droite",
      topLeft: "En haut à gauche",
    },
    startNumber: "Numéro de départ",
    fontSize: "Taille de police",
    applyBtn: "Numéroter les pages & Télécharger",
    applying: "Numérotation des pages du PDF...",
    error: "Échec de la numérotation. Veuillez réessayer.",
    format: "Format du numéro",
    formatSimple: "Simple (1, 2, 3...)",
    formatPageN: "Page 1, Page 2...",
    formatPageNofTotal: "Page 1 sur 10...",
    formatFraction: "1/10, 2/10...",
    skipFirstCover: "Ignorer la page de couverture",
    skipFirstCoverDesc: "Ne pas afficher de numéro sur la première page du document.",
    downloadNumbered: "Télécharger le PDF numéroté",
    changeFile: "Changer de document",
    livePreview: "Aperçu en direct du placement",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la numérotation.",
  },
  reorderPdf: {
    instructions: "Glissez les pages ou utilisez les flèches directionnelles, cliquez sur × pour retirer",
    savePdf: "Enregistrer & Télécharger",
    saving: "Création du PDF réorganisé…",
    pageCount: (n) => `${n} page${n !== 1 ? 's' : ''}`,
    loadDifferent: "Choisir un autre PDF",
    loadingThumbs: "Génération des miniatures de pages…",
    loadFailed: "Échec du chargement du PDF",
    saveFailed: "Échec de l'enregistrement du PDF",
    moveLeft: "Déplacer vers la gauche",
    moveRight: "Déplacer vers la droite",
    reverseOrder: "Inverser tout",
    resetOrder: "Ordre d'origine",
    deletePage: "Supprimer la page",
    saveReorderedPdf: "Télécharger le PDF réorganisé",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la génération.",
  },
  pdfToHtml: {
    convertBtn: "Convertir en HTML",
    converting: "Génération de la page HTML…",
    error: "Échec de la conversion du PDF en HTML. Veuillez réessayer.",
    readyBadge: "Page HTML générée avec succès !",
    downloadHtml: "Télécharger le fichier HTML (.html)",
    convertAnother: "Convertir un autre PDF",
    featureStructure: "HTML5 sémantique",
    featureStructureDesc: "Extraction ordonnée des titres, paragraphes et blocs de texte.",
    featureResponsive: "Prêt pour le Web",
    featureResponsiveDesc: "Code propre et stylisé, prêt pour affichage web ou intégration CMS.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement direct en mémoire vive, aucune copie enregistrée.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pdfToMarkdown: {
    convertBtn: "Convertir en Markdown",
    converting: "Conversion en syntaxe Markdown…",
    error: "Échec de la conversion en Markdown. Veuillez réessayer.",
    readyBadge: "Fichier Markdown généré avec succès !",
    downloadMd: "Télécharger le Markdown (.md)",
    copyMd: "Copier le Markdown",
    copiedMd: "Copié !",
    convertAnother: "Convertir un autre PDF",
    featureSyntax: "Syntaxe Markdown propre",
    featureSyntaxDesc: "Titres (#), listes à puces, styles gras/italique et blocs de code préservés.",
    featureTables: "Extraction des tableaux",
    featureTablesDesc: "Conversion des grilles de données en tableaux Markdown standards.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement strict en mémoire volatile, aucune persistance.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pdfToEpub: {
    convertBtn: "Convertir en EPUB",
    converting: "Génération du livre numérique EPUB…",
    error: "Échec de la génération du livre EPUB. Veuillez réessayer.",
    readyBadge: "Livre numérique EPUB prêt !",
    downloadEpub: "Télécharger l'EPUB (.epub)",
    convertAnother: "Convertir un autre PDF",
    featureFlowable: "Mise en page fluide",
    featureFlowableDesc: "Texte redimensionnable pour un confort de lecture optimal sur liseuse et mobile.",
    featureReader: "Compatible liseuses",
    featureReaderDesc: "Format standard EPUB lisible sur Apple Livres, Kindle, Kobo et autres liseuses.",
    featurePrivate: "100% dans le navigateur",
    featurePrivateDesc: "Traitement direct sur votre appareil sans envoi vers un serveur.",
    honestClientNote: "Cet outil fonctionne entièrement dans votre navigateur avec des bibliothèques locales. Aucun fichier n'est téléversé.",
  },
  pdfToImage: {
    format: "Format d'image",
    resolution: "Résolution / DPI",
    standardDpi: "Standard Web (72 DPI)",
    highDpi: "Qualité Impression (150 DPI)",
    maxDpi: "Ultra Haute Définition (300 DPI)",
    convertBtn: "Extraire les images",
    converting: "Rendu des pages PDF en images…",
    error: "Échec du rendu des images. Veuillez réessayer.",
    readyBadge: "Images générées avec succès !",
    downloadImages: "Télécharger les images (ZIP / Image)",
    convertAnother: "Convertir un autre PDF",
    featureHighRes: "Résolution Haute Précision",
    featureHighResDesc: "Export jusqu'à 300 DPI pour des textes nets et des graphismes impeccables.",
    featureZip: "Archive ZIP automatique",
    featureZipDesc: "Les documents multi-pages sont rassemblés dans un fichier ZIP organisé.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement direct en mémoire et purge immédiate.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après l'extraction.",
  },
  pdfToPdfa: {
    convertBtn: "Convertir en PDF/A (Archivage)",
    converting: "Application des normes de conformité ISO PDF/A-2b…",
    error: "Échec de la conversion en PDF/A. Veuillez réessayer.",
    readyBadge: "Document d'archive PDF/A-2b prêt !",
    downloadPdfa: "Télécharger le PDF/A (.pdf)",
    convertAnother: "Convertir un autre PDF",
    featureCompliance: "Norme ISO 19005-2",
    featureComplianceDesc: "Garantit la lisibilité et l'intégrité du document sur le très long terme.",
    featureFonts: "Polices & Couleurs incorporées",
    featureFontsDesc: "Intègre tous les glyphes, profils colorimétriques et métadonnées nécessaires.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Conversion stricte en mémoire vive, sans enregistrement durable.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pdfOcr: {
    language: "Langue du document",
    langAll: "Français & Anglais (Détection auto)",
    langEng: "Anglais",
    langFra: "Français",
    langSpa: "Espagnol",
    langDeu: "Allemand",
    convertBtn: "Reconnaître & Extraire le texte",
    converting: "Reconnaissance optique des caractères (OCR) en cours…",
    error: "Échec de l'extraction OCR. Vérifiez que le document n'est pas protégé par mot de passe.",
    readyBadge: "Texte extrait par OCR avec succès !",
    downloadTxt: "Télécharger le texte extrait (.txt)",
    copyText: "Copier dans le presse-papiers",
    copiedText: "Copié !",
    convertAnother: "Numériser un autre PDF",
    featureOcr: "Moteur Tesseract OCR",
    featureOcrDesc: "Extrait du texte sélectionnable et modifiable à partir de scans et photos.",
    featureMultilingual: "Support multilingue",
    featureMultilingualDesc: "Reconnaît les caractères accentués, le français, l'anglais, l'espagnol et l'allemand.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Traitement sécurisé en mémoire et suppression immédiate après reconnaissance.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la reconnaissance.",
  },
  pdfRepair: {
    repairBtn: "Analyser & Réparer le PDF",
    repairing: "Reconstruction des tables XREF et réparation des flux…",
    error: "Impossible de réparer le fichier PDF. Le document est peut-être irrémédiablement corrompu ou vide.",
    readyBadge: "PDF réparé avec succès !",
    downloadRepaired: "Télécharger le PDF réparé",
    convertAnother: "Réparer un autre PDF",
    featureXref: "Reconstruction XREF",
    featureXrefDesc: "Recrée la table d'index et l'arborescence des pages endommagées.",
    featureStream: "Récupération des flux",
    featureStreamDesc: "Sauve les objets intègres et corrige les flux d'octets tronqués.",
    featurePrivate: "Sécurité & Confidentialité",
    featurePrivateDesc: "Réparation en environnement mémoire isolé, sans persistance sur disque.",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la réparation.",
  },
  pdfMetadata: {
    cardTitle: "Propriétés & Métadonnées du document",
    titleField: "Titre du document",
    authorField: "Auteur / Créateur",
    subjectField: "Sujet",
    keywordsField: "Mots-clés (séparés par des virgules)",
    keywordsPlaceholder: "ex. facture, 2026, comptabilité",
    creatorField: "Application / Logiciel créateur",
    producerField: "Producteur PDF",
    saveBtn: "Enregistrer & Télécharger",
    saving: "Écriture des métadonnées…",
    downloadPdf: "Télécharger le PDF mis à jour",
    changeFile: "Changer de document",
    readyBadge: "Métadonnées enregistrées avec succès !",
    featureLocal: "100% dans le navigateur",
    featureLocalDesc: "Lecture et modification des métadonnées directement sur votre appareil.",
    featureFullControl: "Contrôle complet",
    featureFullControlDesc: "Personnalisez titre, auteur, sujet, mots-clés et logiciel producteur.",
    featureInstant: "Enregistrement instantané",
    featureInstantDesc: "Applique les modifications en quelques millisecondes sans réencodage lourd.",
    honestClientNote: "Cet outil fonctionne entièrement dans votre navigateur avec pdf-lib. Aucun fichier n'est téléversé.",
  },
  wordToPdf: {
    convertBtn: "Convertir en PDF",
    converting: "Conversion du document Word en PDF…",
    error: "La conversion Word vers PDF a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir un autre document",
    featureFidelity: "Typographie préservée",
    featureFidelityDesc: "Préserve les titres, styles, polices, marges et images intégrées.",
    featureLayout: "Intégrité de mise en page",
    featureLayoutDesc: "Convertit fidèlement le texte multi-colonnes, listes et tableaux.",
    featurePrivate: "Traitement sécurisé",
    featurePrivateDesc: "Fichiers traités via des canaux chiffrés et supprimés immédiatement.",
    statusMilestone1: "Lecture du document Word et des styles...",
    statusMilestone2: "Traitement de la typographie et des médias...",
    statusMilestone3: "Rendu vectoriel des pages PDF...",
    statusMilestone4: "Finalisation du fichier PDF...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  excelToPdf: {
    sheetLabel: "Sélectionner la feuille à convertir :",
    allSheets: "Feuille active",
    convertBtn: "Convertir en PDF",
    converting: "Rendu du tableur en PDF…",
    error: "La conversion Excel vers PDF a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir un autre tableur",
    featureGrid: "Grille & données fidèles",
    featureGridDesc: "Conserve les bordures de cellules, mises en forme et alignements.",
    featureSheets: "Choix de la feuille",
    featureSheetsDesc: "Détecte les feuilles du classeur pour convertir celle de votre choix.",
    featurePrivate: "Traitement sécurisé",
    featurePrivateDesc: "Fichiers chiffrés en transit et purgés immédiatement après traitement.",
    statusMilestone1: "Analyse du classeur et des feuilles...",
    statusMilestone2: "Calcul des largeurs de colonnes et de la grille...",
    statusMilestone3: "Mise en page et rendu des cellules...",
    statusMilestone4: "Exportation du document PDF...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  pptxToPdf: {
    convertBtn: "Convertir en PDF",
    converting: "Conversion de la présentation en PDF…",
    error: "La conversion de la présentation a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir une autre présentation",
    featureSlides: "Export diapositive par diapositive",
    featureSlidesDesc: "Chaque diapositive PowerPoint devient une page séquentielle dans le PDF.",
    featureLayout: "Mise en page vectorielle nette",
    featureLayoutDesc: "Préserve les titres, textes, schémas et formes avec précision.",
    featurePrivate: "Confidentialité totale",
    featurePrivateDesc: "Présentations transmises de façon sécurisée et supprimées immédiatement.",
    statusMilestone1: "Chargement des diapositives...",
    statusMilestone2: "Extraction des zones de texte, formes et éléments...",
    statusMilestone3: "Composition des pages vectorielles du PDF...",
    statusMilestone4: "Compilation finale du document PDF...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  imageToPdf: {
    convertBtn: "Convertir en PDF",
    converting: "Génération du PDF à partir des images…",
    error: "La conversion des images en PDF a échoué. Veuillez vérifier vos fichiers.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir d'autres images",
    featureMultiImage: "Images multiples",
    featureMultiImageDesc: "Combinez plusieurs photos JPG, PNG, WEBP ou HEIC dans un seul PDF.",
    featureQuality: "Résolution originale",
    featureQualityDesc: "Intègre vos photos et illustrations en pleine résolution sans compression inutile.",
    featurePrivate: "Traitement local prioritaire",
    featurePrivateDesc: "Les formats courants sont intégrés directement dans votre navigateur sans téléversement.",
    filesSelected: (n: number) => `${n} image${n > 1 ? "s" : ""} sélectionnée${n > 1 ? "s" : ""}`,
    honestServerNote: "Les images courantes sont intégrées directement dans votre navigateur. Les autres formats sont convertis de façon sécurisée puis supprimés.",
  },
  htmlToPdf: {
    tabUpload: "Fichier HTML",
    tabPaste: "Coller du code HTML",
    pastePlaceholder: "Collez votre code HTML ou document source ici...",
    convertBtn: "Convertir en PDF",
    converting: "Rendu HTML vers PDF…",
    error: "La conversion HTML vers PDF a échoué. Veuillez vérifier le balisage.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir un autre HTML",
    featureHtml5: "HTML5 moderne",
    featureHtml5Desc: "Prend en charge les balises sémantiques et la typographie standard.",
    featureStyling: "Fidélité visuelle",
    featureStylingDesc: "Rendu soigné des titres, paragraphes, listes et contenus formatés.",
    featurePrivate: "Confidentiel & sécurisé",
    featurePrivateDesc: "Le contenu est traité via HTTPS et supprimé immédiatement.",
    statusMilestone1: "Analyse du document HTML et des balises...",
    statusMilestone2: "Application des styles typographiques...",
    statusMilestone3: "Génération des pages PDF...",
    statusMilestone4: "Finalisation du fichier PDF...",
    honestServerNote: "Les fichiers et extraits sont traités de façon sécurisée et supprimés immédiatement après conversion.",
  },
  markdownToPdf: {
    convertBtn: "Convertir en PDF",
    converting: "Rendu du Markdown en PDF…",
    error: "La conversion Markdown vers PDF a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir un autre fichier Markdown",
    featureTypography: "Typographie soignée",
    featureTypographyDesc: "Mise en page élégante des titres, citations, blocs de code et listes.",
    featureSyntax: "GitHub Flavored Markdown",
    featureSyntaxDesc: "Prend en charge les tableaux, cases à cocher, gras, italique et liens.",
    featurePrivate: "Conversion sécurisée",
    featurePrivateDesc: "Traitement via des canaux sécurisés et suppression immédiate.",
    statusMilestone1: "Analyse de la syntaxe Markdown...",
    statusMilestone2: "Génération de la typographie et des éléments...",
    statusMilestone3: "Rendu des pages et interlignes...",
    statusMilestone4: "Compilation du document PDF...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  txtToPdf: {
    tabUpload: "Fichier texte (.txt)",
    tabPaste: "Coller du texte",
    pastePlaceholder: "Saisissez ou collez votre texte ici...",
    convertBtn: "Convertir en PDF",
    converting: "Mise en forme du texte en PDF…",
    error: "La conversion texte vers PDF a échoué. Veuillez vérifier votre texte.",
    readyBadge: "PDF généré avec succès",
    downloadPdf: "Télécharger le PDF",
    convertAnother: "Convertir d'autre texte",
    featureFormatting: "Typographie nette",
    featureFormattingDesc: "Formaté avec des marges équilibrées, un interligne aéré et une police lisible.",
    featureEncoding: "Support UTF-8 complet",
    featureEncodingDesc: "Gère tous les caractères internationaux, accents et symboles.",
    featurePrivate: "Confidentialité garantie",
    featurePrivateDesc: "Le texte est rendu de façon sécurisée et n'est jamais conservé.",
    statusMilestone1: "Lecture du flux textuel...",
    statusMilestone2: "Application de la pagination et des retours à la ligne...",
    statusMilestone3: "Rendu des objets texte PDF...",
    statusMilestone4: "Finalisation du document...",
    honestServerNote: "Le texte est traité via connexion chiffrée et effacé immédiatement après génération du PDF.",
  },
  wordToText: {
    convertBtn: "Extraire le texte brut",
    converting: "Extraction du texte du document Word…",
    error: "L'extraction du texte a échoué. Veuillez vérifier votre document.",
    readyBadge: "Texte extrait avec succès",
    downloadTxt: "Télécharger le fichier texte (.txt)",
    copyText: "Copier le texte",
    copiedText: "Copié !",
    convertAnother: "Convertir un autre document",
    featureExtract: "Extraction intégrale",
    featureExtractDesc: "Extrait tous les paragraphes, titres et listes en texte UTF-8 propre.",
    featureClean: "Sans balises parasites",
    featureCleanDesc: "Produit un texte brut non stylisé idéal pour scripts ou éditeurs.",
    featurePrivate: "Traitement sécurisé",
    featurePrivateDesc: "Fichiers traités via des canaux chiffrés et supprimés immédiatement.",
    statusMilestone1: "Lecture de la structure du document Word...",
    statusMilestone2: "Extraction des paragraphes et en-têtes...",
    statusMilestone3: "Nettoyage de la mise en forme et des sauts de ligne...",
    statusMilestone4: "Finalisation du texte brut...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  wordToHtml: {
    convertBtn: "Convertir en HTML",
    converting: "Conversion du document Word en HTML…",
    error: "La conversion Word vers HTML a échoué. Veuillez vérifier votre document.",
    readyBadge: "Code HTML généré avec succès",
    downloadHtml: "Télécharger le fichier HTML (.html)",
    copyHtml: "Copier le HTML",
    copiedHtml: "Copié !",
    convertAnother: "Convertir un autre document",
    featureSemantic: "HTML5 sémantique",
    featureSemanticDesc: "Génère des balises sémantiques propres pour titres, paragraphes et listes.",
    featureStyles: "Styles adaptés au web",
    featureStylesDesc: "Préserve gras, italique, tableaux et liens sans surcharge propriétaire.",
    featurePrivate: "Privé & sécurisé",
    featurePrivateDesc: "Documents traités en toute confidentialité et effacés immédiatement.",
    statusMilestone1: "Analyse des éléments XML du document Word...",
    statusMilestone2: "Traduction de la typographie en balises HTML5...",
    statusMilestone3: "Mise en page des tableaux et liens...",
    statusMilestone4: "Compilation du code HTML...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  wordToMarkdown: {
    convertBtn: "Convertir en Markdown",
    converting: "Conversion du document Word en Markdown…",
    error: "La conversion Word vers Markdown a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Markdown généré avec succès",
    downloadMd: "Télécharger le Markdown (.md)",
    copyMd: "Copier le Markdown",
    copiedMd: "Copié !",
    convertAnother: "Convertir un autre document",
    featureFormatting: "CommonMark standard",
    featureFormattingDesc: "Convertit fidèlement titres, listes, citations et blocs de code.",
    featureTables: "Préservation des tableaux",
    featureTablesDesc: "Convertit les tableaux Word directement en tableaux GitHub Flavored Markdown.",
    featurePrivate: "Sécurisé & éphémère",
    featurePrivateDesc: "Traité via des canaux sécurisés et purgé immédiatement.",
    statusMilestone1: "Analyse de la structure OpenXML...",
    statusMilestone2: "Correspondance des styles vers la syntaxe Markdown...",
    statusMilestone3: "Construction de la structure des tableaux...",
    statusMilestone4: "Finalisation du fichier Markdown...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  wordToEpub: {
    convertBtn: "Générer l'e-book EPUB",
    converting: "Création de l'e-book EPUB dans votre navigateur…",
    error: "La génération de l'EPUB a échoué. Veuillez vérifier votre document.",
    readyBadge: "E-book EPUB créé avec succès",
    downloadEpub: "Télécharger l'EPUB (.epub)",
    convertAnother: "Convertir un autre manuscrit",
    featureReflow: "Mise en page fluide",
    featureReflowDesc: "S'adapte automatiquement aux écrans de liseuses, smartphones et tablettes.",
    featureEreader: "Compatible liseuses",
    featureEreaderDesc: "Compatible Apple Livres, Kindle, Kobo et toutes les liseuses standard.",
    featurePrivate: "100% dans le navigateur",
    featurePrivateDesc: "Le document est converti localement sur votre appareil sans téléversement.",
    honestClientNote: "Cet outil s'exécute entièrement dans votre navigateur avec mammoth et epub-gen. Aucun fichier n'est téléversé.",
  },
  markdownToDocx: {
    convertBtn: "Convertir en Word (DOCX)",
    converting: "Conversion du Markdown en document Word…",
    error: "La conversion Markdown vers Word a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Document Word généré avec succès",
    downloadDocx: "Télécharger le document Word (.docx)",
    convertAnother: "Convertir un autre fichier Markdown",
    featureStyles: "Styles de titres natifs",
    featureStylesDesc: "Génère de vrais styles Titre 1, 2, 3 Word, citations et listes à puces.",
    featureOpenXml: "OpenXML standard",
    featureOpenXmlDesc: "Parfaitement compatible Microsoft Office, LibreOffice et Google Docs.",
    featurePrivate: "Confidentiel & sécurisé",
    featurePrivateDesc: "Fichiers chiffrés en transit et purgés immédiatement après traitement.",
    statusMilestone1: "Analyse de la syntaxe et des jetons Markdown...",
    statusMilestone2: "Construction de l'arborescence OpenXML...",
    statusMilestone3: "Application des styles de paragraphes et thèmes...",
    statusMilestone4: "Compilation de l'archive .docx...",
    honestServerNote: "Fichiers traités de façon sécurisée via connexion chiffrée et supprimés immédiatement après la conversion.",
  },
  txtToDocx: {
    tabUpload: "Fichier texte (.txt)",
    tabPaste: "Coller du texte",
    pastePlaceholder: "Saisissez ou collez votre texte ici...",
    convertBtn: "Convertir en Word (DOCX)",
    converting: "Génération du document Word à partir du texte…",
    error: "La conversion du texte vers Word a échoué. Veuillez vérifier votre texte.",
    readyBadge: "Document Word généré avec succès",
    downloadDocx: "Télécharger le document Word (.docx)",
    convertAnother: "Convertir d'autre texte",
    featureEditable: "Entièrement modifiable",
    featureEditableDesc: "Produit un document .docx propre et prêt à être édité dans votre traitement de texte.",
    featureMargins: "Mise en page soignée",
    featureMarginsDesc: "Formaté avec des marges standards, un interligne confortable et une typographie claire.",
    featurePrivate: "Traitement sécurisé",
    featurePrivateDesc: "Texte transmis de façon chiffrée et effacé immédiatement après génération.",
    statusMilestone1: "Lecture du texte...",
    statusMilestone2: "Création des paragraphes OpenXML...",
    statusMilestone3: "Application des marges et styles par défaut...",
    statusMilestone4: "Assemblage du document .docx...",
    honestServerNote: "Les fichiers et textes sont traités via connexion chiffrée et supprimés immédiatement après conversion.",
  },
  excelToCsv: {
    sheetLabel: "Sélectionner la feuille à exporter :",
    convertBtn: "Exporter en CSV",
    converting: "Export de la feuille Excel en CSV…",
    error: "L'analyse du tableur a échoué. Veuillez vérifier votre fichier Excel.",
    readyBadge: "CSV exporté avec succès",
    downloadCsv: "Télécharger le CSV (.csv)",
    convertAnother: "Convertir un autre classeur",
    featureSheets: "Sélection de la feuille",
    featureSheetsDesc: "Choisissez facilement n'importe quelle feuille d'un classeur multi-onglets.",
    featureDelimiters: "CSV UTF-8 standard",
    featureDelimitersDesc: "Valeurs séparées par des virgules compatibles avec toutes les bases de données.",
    featurePrivate: "100% dans le navigateur",
    featurePrivateDesc: "Vos données financières et confidentielles ne quittent jamais votre appareil.",
    honestClientNote: "Cet outil s'exécute entièrement dans votre navigateur avec SheetJS. Aucun fichier n'est téléversé.",
  },
  csvToExcel: {
    tabUpload: "Fichier CSV (.csv)",
    tabPaste: "Coller des données CSV",
    pastePlaceholder: "nom,departement,salaire\nAlice,Ingénierie,95000\nBob,Design,85000",
    convertBtn: "Convertir en Excel (.xlsx)",
    converting: "Génération du classeur Excel dans votre navigateur…",
    error: "L'analyse du CSV a échoué. Veuillez vérifier le format de vos données.",
    readyBadge: "Classeur Excel généré avec succès",
    downloadXlsx: "Télécharger l'Excel (.xlsx)",
    convertAnother: "Convertir d'autres données CSV",
    featureAutoType: "Inférence automatique de types",
    featureAutoTypeDesc: "Reconnaît fidèlement les nombres, dates, textes et valeurs booléennes.",
    featureOpenXml: "Format standard XLSX",
    featureOpenXmlDesc: "Parfaitement compatible Microsoft Excel, Apple Numbers et Google Sheets.",
    featurePrivate: "100% dans le navigateur",
    featurePrivateDesc: "L'analyse et la création se font localement sur votre ordinateur sans téléversement.",
    honestClientNote: "Cet outil s'exécute entièrement dans votre navigateur avec PapaParse et SheetJS. Aucune donnée n'est téléversée.",
  },
  pptxToImages: {
    convertBtn: "Convertir les diapositives en PNG",
    converting: "Rendu des diapositives de la présentation en images PNG…",
    error: "La conversion PowerPoint a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Diapositives converties avec succès",
    downloadZip: "Télécharger toutes les diapositives (.zip)",
    convertAnother: "Convertir une autre présentation",
    featureSlides: "Rendu haute précision",
    featureSlidesDesc: "Rendu haute résolution préservant disposition, formes vectorielles et polices.",
    featureZip: "Archive ZIP unique",
    featureZipDesc: "Téléchargez toutes les diapositives sous forme d'images numérotées dans un fichier ZIP.",
    featurePrivate: "Sécurisé & éphémère",
    featurePrivateDesc: "Présentations transmises via TLS et supprimées immédiatement après rendu.",
    slidesCount: (n: number) => `${n} diapositive${n > 1 ? "s" : ""} générée${n > 1 ? "s" : ""}`,
    honestServerNote: "Les présentations sont traitées de façon sécurisée via LibreOffice sur le serveur et supprimées immédiatement après conversion.",
  },
  imageUpscale: {
    scaleLabel: "Facteur d'agrandissement :",
    sharpenLabel: "Netteté des contours",
    sharpenDesc: "Améliore le contraste des textures et la netteté des détails lors de l'agrandissement.",
    upscaleBtn: "Agrandir l'image",
    upscaling: "Agrandissement et amélioration de la résolution…",
    error: "L'agrandissement de l'image a échoué. Veuillez vérifier votre fichier.",
    readyBadge: "Image agrandie avec succès",
    downloadImage: "Télécharger l'image haute résolution",
    convertAnother: "Agrandir une autre image",
    statusMilestone1: "Envoi de l'image source haute résolution…",
    statusMilestone2: "Application du redimensionnement par interpolation Lanczos3…",
    statusMilestone3: "Amélioration du micro-contraste et de la netteté…",
    statusMilestone4: "Encodage du résultat avec compression optimale…",
    featureScale: "Agrandissement 2x & 4x",
    featureScaleDesc: "Le rééchantillonnage Lanczos3 garantit des contours nets et limite le flou.",
    featureSharpen: "Masque de netteté adaptatif",
    featureSharpenDesc: "Conserve la texture photographique et la clarté sans créer d'artefacts.",
    featurePrivate: "Privé & éphémère",
    featurePrivateDesc: "Images traitées via des canaux chiffrés et supprimées immédiatement.",
    honestServerNote: "Les images sont agrandies de façon sécurisée sur notre serveur avec Sharp/Lanczos3 puis immédiatement supprimées.",
  },
  checksum: {
    verifyPlaceholder: "Collez le hachage attendu pour vérification (ex. SHA-256)...",
    matchSuccess: "Le hachage correspond !",
    matchMismatch: "Le hachage ne correspond pas à la valeur attendue",
    copyHash: "Copier la somme de contrôle",
    checkAnother: "Vérifier un autre fichier",
    verifyTitle: "Vérifier l'intégrité par rapport au hachage attendu",
    statusMilestone1: "Lecture du fichier dans le tampon mémoire…",
    statusMilestone2: "Calcul des empreintes cryptographiques SHA…",
    statusMilestone3: "Vérification des sommes binaires…",
    statusMilestone4: "Sommes de contrôle calculées avec succès !",
    featureMultiAlgo: "4 algorithmes de hachage",
    featureMultiAlgoDesc: "Calcule simultanément SHA-1, SHA-256, SHA-384 et SHA-512 dans le navigateur.",
    featureVerification: "Vérification instantanée",
    featureVerificationDesc: "Comparez avec le hachage de l'éditeur pour garantir l'intégrité du fichier.",
    featurePrivate: "100% dans le navigateur",
    featurePrivateDesc: "Calculé entièrement avec l'API Web Cryptography native sans aucun téléversement.",
    honestClientNote: "Cet outil fonctionne entièrement dans votre navigateur via l'API Web Cryptography. Aucun fichier n'est téléversé.",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { EN, FR };
