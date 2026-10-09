import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  NextActionModalShell,
  type WorkflowActionItem,
} from './NextActionModalShell';
import {
  CompressGraphic,
  ProtectGraphic,
  MergeGraphic,
  PaginateGraphic,
  WatermarkGraphic,
  SplitGraphic,
  RotatePdfGraphic,
} from './WorkflowGraphics';
import { setHandoffFile } from '@/lib/file-handoff';

interface NextActionModalProps {
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
  resultBlob?: Blob | null;
  resultFilename?: string;
  file?: File | null;
}

const ALL_PDF_ACTIONS: WorkflowActionItem[] = [
  {
    id: 'pdf-compress',
    shortTag: 'COMPRESS',
    tagColor: 'text-orange-600 dark:text-orange-400',
    title: 'Compresser le document',
    description:
      'Allégez la taille du PDF jusqu’à 80% pour l’envoi par e-mail ou Slack sans dégradation.',
    ctaText: 'Ouvrir Compress',
    route: '/pdf-compress',
    supportsHandoff: true,
    graphic: <CompressGraphic />,
    accentBorder: 'hover:border-orange-500/50 dark:hover:border-orange-400/50',
    glowColor: '#FF6B35',
  },
  {
    id: 'pdf-protect',
    shortTag: 'PROTECT',
    tagColor: 'text-blue-600 dark:text-blue-400',
    title: 'Chiffrer & Protéger',
    description:
      'Définissez un mot de passe fort et un chiffrement AES-256 standard pour sécuriser vos données.',
    ctaText: 'Ouvrir Protect',
    route: '/pdf-protect',
    supportsHandoff: true,
    graphic: <ProtectGraphic />,
    accentBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
    glowColor: '#2563EB',
  },
  {
    id: 'pdf-merge',
    shortTag: 'MERGE',
    tagColor: 'text-purple-600 dark:text-purple-400',
    title: 'Assembler des documents',
    description:
      'Combinez ce PDF avec d’autres pièces jointes, contrats ou annexes dans l’ordre voulu.',
    ctaText: 'Ouvrir Merge',
    route: '/pdf-merge',
    supportsHandoff: true,
    graphic: <MergeGraphic />,
    accentBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
    glowColor: '#8B5CF6',
  },
  {
    id: 'pdf-page-numbers',
    shortTag: 'PAGINATE',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Numéroter les pages',
    description:
      'Insérez une pagination claire et calibrée en en-tête ou pied de page pour vos dossiers.',
    ctaText: 'Ouvrir Pagination',
    route: '/pdf-page-numbers',
    supportsHandoff: true,
    graphic: <PaginateGraphic />,
    accentBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
    glowColor: '#10B981',
  },
  {
    id: 'pdf-watermark',
    shortTag: 'WATERMARK',
    tagColor: 'text-amber-600 dark:text-amber-400',
    title: 'Ajouter un filigrane',
    description:
      'Apposez un tampon personnalisé ou confidentiel pour certifier votre document officiel.',
    ctaText: 'Ouvrir Filigrane',
    route: '/pdf-watermark',
    supportsHandoff: true,
    graphic: <WatermarkGraphic />,
    accentBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
    glowColor: '#F59E0B',
  },
  {
    id: 'pdf-split',
    shortTag: 'SPLIT',
    tagColor: 'text-rose-600 dark:text-rose-400',
    title: 'Diviser & Extraire',
    description:
      'Isolez des pages spécifiques ou séparez le PDF en plusieurs fichiers distincts.',
    ctaText: 'Ouvrir Split',
    route: '/pdf-split',
    supportsHandoff: true,
    graphic: <SplitGraphic />,
    accentBorder: 'hover:border-rose-500/50 dark:hover:border-rose-400/50',
    glowColor: '#F43F5E',
  },
  {
    id: 'pdf-rotate',
    shortTag: 'ROTATE',
    tagColor: 'text-cyan-600 dark:text-cyan-400',
    title: 'Pivoter les pages',
    description:
      'Corrigez l’orientation de vos pages à 90°, 180° ou 270° avec réalignement visuel instantané.',
    ctaText: 'Ouvrir Rotation',
    route: '/pdf-rotate',
    supportsHandoff: true,
    graphic: <RotatePdfGraphic />,
    accentBorder: 'hover:border-cyan-500/50 dark:hover:border-cyan-400/50',
    glowColor: '#06B6D4',
  },
];

export function NextActionModal({
  toolId,
  isOpen,
  onClose,
  resultBlob,
  resultFilename,
  file,
}: NextActionModalProps) {
  const [, setLocation] = useLocation();
  const [showAllMobile, setShowAllMobile] = React.useState(false);

  const handleActionSelect = (action: WorkflowActionItem) => {
    if (action.supportsHandoff) {
      if (resultBlob && resultFilename) {
        setHandoffFile(resultBlob, resultFilename);
      } else if (file) {
        setHandoffFile(file, file.name);
      }
    }
    onClose();
    setLocation(action.route);
  };

  // Exclude current active tool to eliminate recursive loops, dynamically selecting 6 actions
  const displayedActions = useMemo(() => {
    return ALL_PDF_ACTIONS
      .filter((action) => action.id !== toolId)
      .slice(0, 6)
      .map((action, idx) => ({
        ...action,
        tag: `0${idx + 1} // ${action.shortTag}`,
      }));
  }, [toolId]);

  return (
    <NextActionModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Actions recommandées"
      subtitleMobile="Sélectionnez l'étape suivante pour votre document"
      closeLabel="Fermer"
      actions={displayedActions}
      onSelectAction={handleActionSelect}
    />
  );
}

export default NextActionModal;
