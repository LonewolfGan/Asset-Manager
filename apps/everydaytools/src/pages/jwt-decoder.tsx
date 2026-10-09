import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useJwtDecoderWorkflow } from '@/hooks/use-jwt-decoder-workflow';
import { JwtCommandBar, JwtWorkbench } from '@/components/jwt-decoder';

export default function JwtDecoder() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';
  const title =
    t.tools['jwt-decoder']?.title ?? (isFr ? 'Décodeur JWT' : 'JWT Decoder');
  const desc =
    t.tools['jwt-decoder']?.description ??
    (isFr
      ? 'Inspectez, décodez et vérifiez les JSON Web Tokens (en-tête, revendications payload et signatures HMAC) en local dans votre navigateur.'
      : 'Inspect, decode and verify JSON Web Tokens (Header, Payload claims, and HMAC signatures) securely in your browser.');

  const {
    tokenInput,
    secretKey,
    setSecretKey,
    isBase64Secret,
    setIsBase64Secret,
    showSecret,
    setShowSecret,
    isDragging,
    setIsDragging,
    history,
    verificationResult,
    decoded,
    hasToken,
    stats,
    handleUpdateToken,
    handleUndo,
    handleCleanToken,
    handleClear,
    handleFileUpload,
    handleDownload,
  } = useJwtDecoderWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="jwt-decoder"
    >
      <div className="w-full space-y-4">
        {/* Barre de commande supérieure épurée */}
        <JwtCommandBar
          isFr={isFr}
          hasToken={hasToken}
          decoded={decoded}
          historyLength={history.length}
          onCleanToken={handleCleanToken}
          onUndo={handleUndo}
          onClear={handleClear}
          onDownload={handleDownload}
          copiedLabel={t.common.copied}
        />

        {/* L'Atelier principal : Deux volets architecturaux ouverts */}
        <JwtWorkbench
          isFr={isFr}
          tokenInput={tokenInput}
          hasToken={hasToken}
          decoded={decoded}
          stats={stats}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onUpdateToken={handleUpdateToken}
          onFileUpload={handleFileUpload}
          copiedLabel={t.common.copied}
          verificationResult={verificationResult}
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          showSecret={showSecret}
          setShowSecret={setShowSecret}
          isBase64Secret={isBase64Secret}
          setIsBase64Secret={setIsBase64Secret}
        />
      </div>
    </ToolPageLayout>
  );
}
