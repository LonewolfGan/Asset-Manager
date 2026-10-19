import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolError } from '@/lib/analytics';
import { consumeHandoffText, consumeHandoffFile } from '@/lib/file-handoff';
import { getPresetIconSvg } from '@/lib/qr-icons';
import {
  InputMode,
  ErrorLevel,
  WifiEnc,
  DotStyle,
  EyeStyle,
  getContrastRatio,
  getContrastAssessment,
  buildQrPayload,
  isPayloadEmpty,
  parseHandoffPayload,
} from '@/lib/qr-code-logic';
import { renderQrToCanvas } from '@/lib/qr-code-canvas';
import { exportQrPng, exportQrSvg, copyQrImageToClipboard } from '@/lib/qr-code-export';
import { getAvailableIconSwatches } from '@/lib/qr-code-swatches';
import { useQrIconPicker } from './use-qr-icon-picker';
import { useQrHistory, QrHistorySnapshot } from './use-qr-history';

export function useQrCodeGenerator() {
  const { t, locale } = useLocale();
  const isFr = (locale as string).startsWith('fr');
  const tq = t.qrCode;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePresetRef = useRef<string | null>(null);

  // Mode Selection & Payload Inputs
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('https://everydaytools.qzz.io');
  const [rawText, setRawText] = useState('EverydayTools — Fast, secure, privacy-first web utilities.');
  const [wifiSsid, setWifiSsid] = useState('Studio_Network_5G');
  const [wifiPass, setWifiPass] = useState('EverydaySecure2026');
  const [wifiEnc, setWifiEnc] = useState<WifiEnc>('WPA');
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [vcardName, setVcardName] = useState('Alexandre Martin');
  const [vcardOrg, setVcardOrg] = useState('Design Studio');
  const [vcardEmail, setVcardEmail] = useState('alexandre@everydaytools.app');
  const [vcardPhone, setVcardPhone] = useState('+33 6 12 34 56 78');
  const [vcardUrl, setVcardUrl] = useState('https://everydaytools.qzz.io');

  // Styling & Customization States
  const [dotStyle, setDotStyle] = useState<DotStyle>('rounded');
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>('rounded');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState('#f97316');
  const [logoScale, setLogoScale] = useState(22);
  const [fgColor, setFgColor] = useState('#09090b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [genError, setGenError] = useState<string | null>(null);

  const isInternalHistoryUpdateRef = useRef(false);

  const applySnapshot = useCallback((s: QrHistorySnapshot) => {
    isInternalHistoryUpdateRef.current = true;
    setMode(s.mode);
    setUrl(s.url);
    setRawText(s.rawText);
    setWifiSsid(s.wifiSsid);
    setWifiPass(s.wifiPass);
    setWifiEnc(s.wifiEnc);
    setVcardName(s.vcardName);
    setVcardOrg(s.vcardOrg);
    setVcardEmail(s.vcardEmail);
    setVcardPhone(s.vcardPhone);
    setVcardUrl(s.vcardUrl);
    setDotStyle(s.dotStyle);
    setEyeStyle(s.eyeStyle);
    setLogoUrl(s.logoUrl);
    setLogoScale(s.logoScale);
    setActivePresetId(s.activePresetId);
    activePresetRef.current = s.activePresetId;
    setIconColor(s.iconColor);
    setFgColor(s.fgColor);
    setBgColor(s.bgColor);
  }, []);

  const initialSnapshot = useMemo<QrHistorySnapshot>(() => ({
    mode: 'url',
    url: 'https://everydaytools.qzz.io',
    rawText: 'EverydayTools — Fast, secure, privacy-first web utilities.',
    wifiSsid: 'Studio_Network_5G',
    wifiPass: 'EverydaySecure2026',
    wifiEnc: 'WPA',
    vcardName: 'Alexandre Martin',
    vcardOrg: 'Design Studio',
    vcardEmail: 'alexandre@everydaytools.app',
    vcardPhone: '+33 6 12 34 56 78',
    vcardUrl: 'https://everydaytools.qzz.io',
    fgColor: '#09090b',
    bgColor: '#ffffff',
    dotStyle: 'rounded',
    eyeStyle: 'rounded',
    logoUrl: null,
    logoScale: 22,
    activePresetId: null,
    iconColor: '#f97316',
  }), []);

  const { pushSnapshot, undo, redo, canUndo, canRedo } = useQrHistory(initialSnapshot, applySnapshot);

  const currentSnapshot = useMemo<QrHistorySnapshot>(() => ({
    mode, url, rawText, wifiSsid, wifiPass, wifiEnc,
    vcardName, vcardOrg, vcardEmail, vcardPhone, vcardUrl,
    fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale, activePresetId, iconColor,
  }), [
    mode, url, rawText, wifiSsid, wifiPass, wifiEnc,
    vcardName, vcardOrg, vcardEmail, vcardPhone, vcardUrl,
    fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale, activePresetId, iconColor,
  ]);

  // Handoff consumption at mount
  useEffect(() => {
    const handoffText = consumeHandoffText();
    if (handoffText) {
      const parsed = parseHandoffPayload(handoffText);
      setMode(parsed.mode);
      if (parsed.data.url !== undefined) setUrl(parsed.data.url);
      if (parsed.data.rawText !== undefined) setRawText(parsed.data.rawText);
      if (parsed.data.wifiSsid !== undefined) setWifiSsid(parsed.data.wifiSsid);
      if (parsed.data.wifiPass !== undefined) setWifiPass(parsed.data.wifiPass);
      if (parsed.data.wifiEnc !== undefined) setWifiEnc(parsed.data.wifiEnc);
      if (parsed.data.vcardName !== undefined) setVcardName(parsed.data.vcardName);
      if (parsed.data.vcardOrg !== undefined) setVcardOrg(parsed.data.vcardOrg);
      if (parsed.data.vcardPhone !== undefined) setVcardPhone(parsed.data.vcardPhone);
      if (parsed.data.vcardEmail !== undefined) setVcardEmail(parsed.data.vcardEmail);
      if (parsed.data.vcardUrl !== undefined) setVcardUrl(parsed.data.vcardUrl);
    }
    const handoffFile = consumeHandoffFile();
    if (handoffFile && handoffFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          activePresetRef.current = null;
          setActivePresetId(null);
          setLogoUrl(e.target.result);
        }
      };
      reader.readAsDataURL(handoffFile);
    }
  }, []);

  // Sync to history
  useEffect(() => {
    if (isInternalHistoryUpdateRef.current) {
      isInternalHistoryUpdateRef.current = false;
      return;
    }
    pushSnapshot(currentSnapshot);
  }, [currentSnapshot, pushSnapshot]);

  const handleIconColorChange = useCallback((newColor: string) => {
    setIconColor(newColor);
    if (activePresetRef.current) setLogoUrl(getPresetIconSvg(activePresetRef.current, newColor));
  }, []);

  const selectPresetIcon = useCallback((iconId: string) => {
    activePresetRef.current = iconId;
    setActivePresetId(iconId);
    setLogoUrl(getPresetIconSvg(iconId, iconColor));
  }, [iconColor]);

  const clearLogo = useCallback(() => {
    activePresetRef.current = null;
    setLogoUrl(null);
    setActivePresetId(null);
  }, []);

  const iconPicker = useQrIconPicker();

  const errLevel: ErrorLevel = 'H';
  const size = 1024;
  const margin = 2;

  const contrastRatio = useMemo(() => getContrastRatio(fgColor, bgColor), [fgColor, bgColor]);
  const contrastAssessment = useMemo(() => getContrastAssessment(contrastRatio, isFr), [contrastRatio, isFr]);
  const availableIconSwatches = useMemo(() => getAvailableIconSwatches(fgColor, bgColor, isFr), [fgColor, bgColor, isFr]);

  useEffect(() => {
    if (activePresetId && getContrastRatio(iconColor, bgColor) < 3.0) {
      handleIconColorChange(fgColor);
    }
  }, [bgColor, fgColor, iconColor, activePresetId, handleIconColorChange]);

  const content = useMemo(() => buildQrPayload(mode, {
    url, rawText, wifiSsid, wifiPass, wifiEnc, vcardName, vcardOrg, vcardEmail, vcardPhone, vcardUrl
  }), [mode, url, rawText, wifiSsid, wifiPass, wifiEnc, vcardName, vcardOrg, vcardEmail, vcardPhone, vcardUrl]);

  const isEmpty = useMemo(() => isPayloadEmpty(content, mode), [content, mode]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        activePresetRef.current = null;
        setActivePresetId(null);
        setLogoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderQrToCanvas(canvas, {
      content, isEmpty, size, margin, errLevel, fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale,
    })
      .then(() => setGenError(null))
      .catch((err: any) => {
        trackToolError('qr-code-generator', 'render-error');
        setGenError(err?.message || 'Error generating QR code');
      });
  }, [content, isEmpty, size, margin, errLevel, fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale]);

  const downloadPng = useCallback(() => exportQrPng(canvasRef.current, mode), [mode]);
  const downloadSvg = useCallback(async () => {
    if (isEmpty || !content) return;
    exportQrSvg({ content, errLevel, size, margin, fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale }, mode);
  }, [content, isEmpty, mode, size, margin, errLevel, fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale]);
  const copyImage = useCallback(async () => copyQrImageToClipboard(canvasRef.current, isEmpty), [isEmpty]);
  const invertColors = () => { setFgColor(bgColor); setBgColor(fgColor); };

  return {
    t, isFr, tq, canvasRef, fileInputRef,
    mode, setMode,
    url, setUrl, rawText, setRawText,
    wifiSsid, setWifiSsid, wifiPass, setWifiPass, wifiEnc, setWifiEnc,
    showWifiPass, setShowWifiPass,
    vcardName, setVcardName, vcardOrg, setVcardOrg,
    vcardEmail, setVcardEmail, vcardPhone, setVcardPhone, vcardUrl, setVcardUrl,
    dotStyle, setDotStyle, eyeStyle, setEyeStyle,
    logoUrl, activePresetId, iconColor, logoScale, setLogoScale,
    handleIconColorChange, selectPresetIcon, clearLogo, handleLogoUpload,
    iconPicker, size, fgColor, setFgColor, bgColor, setBgColor,
    genError, contrastRatio, contrastAssessment, availableIconSwatches,
    content, isEmpty, downloadPng, downloadSvg, copyImage, invertColors,
    undo, redo, canUndo, canRedo,
  };
}
