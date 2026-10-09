import React from 'react';
import { Gamepad2, Tv, Video } from 'lucide-react';
import type { SpeedTestAssessment } from '@/lib/speed-test-logic';
import { getLatencyVerdict } from '@/lib/speed-test-dial-logic';
import NetworkStatusIllustration from '@/components/NetworkStatusIllustration';

interface SpeedTestDiagnosticCockpitProps {
  assessment: SpeedTestAssessment;
  downloadSpeed: number;
  uploadSpeed: number | null;
  ping: number;
  isFr: boolean;
}

export const SpeedTestDiagnosticCockpit: React.FC<SpeedTestDiagnosticCockpitProps> = ({
  assessment,
  downloadSpeed,
  uploadSpeed,
  ping,
  isFr,
}) => {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm p-6 sm:p-10 space-y-8">
      {/* Top Diagnostic Synthesis Row with Genuine Vector Art */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
            <NetworkStatusIllustration className="w-full h-full object-contain" primaryColor="#FF6B35" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              {isFr ? 'Diagnostic de Connexion Réseau' : 'Network Performance Diagnostic'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              {isFr
                ? `Latence de réponse : ${ping} ms (${getLatencyVerdict(ping, isFr).toLowerCase()}) • Bande passante active : ${downloadSpeed.toFixed(1)} Mbps en téléchargement, ${uploadSpeed?.toFixed(1) ?? '--'} Mbps en envoi.`
                : `Response latency: ${ping} ms (${getLatencyVerdict(ping, isFr).toLowerCase()}) • Active throughput: ${downloadSpeed.toFixed(1)} Mbps download, ${uploadSpeed?.toFixed(1) ?? '--'} Mbps upload.`}
            </p>
          </div>
        </div>

        {/* Dual Telemetry Highlights: Latency Verdict & 10 GB ETA */}
        <div className="flex items-center gap-8 lg:text-right shrink-0 pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-border/60 pt-4 lg:pt-0">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {isFr ? 'Qualité Latence' : 'Latency Rating'}
            </span>
            <p className="text-lg sm:text-xl font-mono font-bold text-foreground tracking-tight mt-0.5">
              {getLatencyVerdict(ping, isFr)}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {isFr ? 'Transfert 10 Go' : '10 GB Download'}
            </span>
            <p className="text-lg sm:text-xl font-mono font-bold text-foreground tracking-tight mt-0.5">
              ~{assessment.suitability.download10GbMinutes}{' '}
              <span className="text-xs font-normal text-muted-foreground">min</span>
            </p>
          </div>
        </div>
      </div>

      {/* Panoramic 3 Workload Capability Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 gap-8 md:gap-0">
        {/* Channel 1: Gaming & Esports */}
        <div className="pt-6 md:pt-0 md:px-6 first:md:pl-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-zinc-400" />
              {isFr ? 'Jeux en ligne & Esports' : 'Online Gaming & Esports'}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-border bg-zinc-100 dark:bg-zinc-800 text-foreground">
              {ping <= 30
                ? isFr ? 'Optimal' : 'Optimal'
                : ping <= 60
                ? isFr ? 'Très Réactif' : 'Responsive'
                : ping <= 90
                ? isFr ? 'Jouable' : 'Playable'
                : isFr ? 'Latence Élevée' : 'High Latency'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
            <span>{isFr ? 'Latence mesurée :' : 'Latency:'} {ping} ms</span>
            <span className="text-zinc-400">({isFr ? 'Seuil < 35 ms' : 'Target < 35 ms'})</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {ping <= 45
              ? isFr
                ? 'Excellente réactivité du signal : temps de réponse optimal pour les jeux compétitifs, le multijoueur et le cloud gaming sans saccade.'
                : 'Excellent response time: optimal latency for competitive multiplayer gaming and cloud gaming without perceived delay.'
              : isFr
              ? 'Latence modérée : adapté aux jeux occasionnels en ligne.'
              : 'Moderate response time: suitable for casual multiplayer gaming.'}
          </p>
        </div>

        {/* Channel 2: 4K Media Streaming */}
        <div className="pt-6 md:pt-0 md:px-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tv className="w-4 h-4 text-zinc-400" />
              {isFr ? 'Streaming Vidéo' : 'Video Streaming'}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-border bg-zinc-100 dark:bg-zinc-800 text-foreground">
              {assessment.streamingMaxResolution}
            </span>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
            <span>{isFr ? 'Débit mesuré :' : 'Bandwidth:'} {downloadSpeed.toFixed(1)} Mbps</span>
            <span className="text-zinc-400">({isFr ? 'Requis ~25 Mbps' : 'Requires ~25 Mbps'})</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {downloadSpeed >= 25
              ? isFr
                ? 'Bande passante ample pour diffuser du contenu 4K Ultra HD et HDR sur plusieurs écrans sans aucune mise en mémoire tampon.'
                : 'Ample throughput for 4K Ultra HD and HDR multi-screen playback without buffering.'
              : downloadSpeed >= 10
              ? isFr
                ? 'Parfait pour le streaming Full HD 1080p fluide sans coupure sur téléviseur, ordinateur ou tablette.'
                : 'Ideal for continuous Full HD 1080p playback across televisions, laptops, or mobile devices.'
              : isFr
              ? 'Adapté pour le streaming HD 720p standard et la vidéo mobile.'
              : 'Suitable for standard HD 720p streaming and mobile playback.'}
          </p>
        </div>

        {/* Channel 3: Video Conferencing */}
        <div className="pt-6 md:pt-0 md:px-6 last:md:pr-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Video className="w-4 h-4 text-zinc-400" />
              {isFr ? 'Visioconférences Pro' : 'Video Conferences'}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-border bg-zinc-100 dark:bg-zinc-800 text-foreground">
              {uploadSpeed !== null && uploadSpeed >= 3 && ping <= 60
                ? isFr ? 'Qualité HD' : 'HD Quality'
                : isFr ? 'Fluide' : 'Stable'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
            <span>{isFr ? 'Débit montant :' : 'Upload:'} {uploadSpeed !== null ? uploadSpeed.toFixed(1) : '--'} Mbps</span>
            <span className="text-zinc-400">({isFr ? 'Requis > 2 Mbps' : 'Requires > 2 Mbps'})</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isFr
              ? 'Débit suffisant pour les appels Zoom, Google Meet et Microsoft Teams en haute définition avec partage d\'écran fluide.'
              : 'Reliable capacity for Zoom, Google Meet, and Teams video calls with smooth screen sharing.'}
          </p>
        </div>
      </div>
    </div>
  );
};
