import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { NextActionModalShell } from './NextActionModalShell';
import {
  CompressImageGraphic,
  ResizeImageGraphic,
  CropImageGraphic,
  RemoveBgGraphic,
  WatermarkImageGraphic,
  FlipRotateImageGraphic,
  ExportPdfGraphic,
} from './ImageWorkflowGraphics';
import { setHandoffFile } from '@/lib/file-handoff';
import { useLocale } from '@/hooks/use-locale';

interface ImageNextActionModalProps {
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
  resultBlob?: Blob | null;
  resultFilename?: string;
  file?: File | null;
}

interface RawWorkflowActionItem {
  id: string;
  shortTag: string;
  tagColor: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  ctaText: { fr: string; en: string };
  route: string;
  supportsHandoff: boolean;
  graphic: React.ReactNode;
  accentBorder: string;
  glowColor: string;
}

const ALL_IMAGE_ACTIONS: RawWorkflowActionItem[] = [
  {
    id: 'image-compress',
    shortTag: 'COMPRESS',
    tagColor: 'text-orange-600 dark:text-orange-400',
    title: {
      fr: 'Compresser l’image',
      en: 'Compress image',
    },
    description: {
      fr: 'Allégez le poids de l’image jusqu’à 80% sans perte de netteté visible pour le web et les e-mails.',
      en: 'Reduce file size up to 80% without noticeable quality loss for web and email use.',
    },
    ctaText: {
      fr: 'Ouvrir Compress',
      en: 'Open Compress',
    },
    route: '/image-compress',
    supportsHandoff: true,
    graphic: <CompressImageGraphic />,
    accentBorder: 'hover:border-orange-500/50 dark:hover:border-orange-400/50',
    glowColor: '#FF6B35',
  },
  {
    id: 'image-resize',
    shortTag: 'RESIZE',
    tagColor: 'text-sky-600 dark:text-sky-400',
    title: {
      fr: 'Redimensionner au pixel',
      en: 'Resize to exact dimensions',
    },
    description: {
      fr: 'Ajustez largeur et hauteur avec verrouillage du ratio d’aspect pour réseaux sociaux et formats web.',
      en: 'Adjust width and height with aspect ratio lock for social media and web publishing.',
    },
    ctaText: {
      fr: 'Ouvrir Resize',
      en: 'Open Resize',
    },
    route: '/image-resize',
    supportsHandoff: true,
    graphic: <ResizeImageGraphic />,
    accentBorder: 'hover:border-sky-500/50 dark:hover:border-sky-400/50',
    glowColor: '#0284C7',
  },
  {
    id: 'image-crop',
    shortTag: 'CROP',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    title: {
      fr: 'Recadrer & Cadrer',
      en: 'Crop & Frame',
    },
    description: {
      fr: 'Isolez la zone clé de l’image avec viseur photographique et ratios prédéfinis 16:9, 1:1, 4:3.',
      en: 'Frame and isolate key areas with photographic viewfinder and presets (16:9, 1:1, 4:3).',
    },
    ctaText: {
      fr: 'Ouvrir Crop',
      en: 'Open Crop',
    },
    route: '/image-crop',
    supportsHandoff: true,
    graphic: <CropImageGraphic />,
    accentBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
    glowColor: '#10B981',
  },
  {
    id: 'background-remover',
    shortTag: 'REMOVE BG',
    tagColor: 'text-purple-600 dark:text-purple-400',
    title: {
      fr: 'Détourer l’arrière-plan',
      en: 'Remove background',
    },
    description: {
      fr: 'Isolez le sujet principal par IA pour obtenir une transparence PNG pure en un clic instantané.',
      en: 'Isolate main subjects with AI for transparent PNG cutouts in one instant click.',
    },
    ctaText: {
      fr: 'Ouvrir Détourer',
      en: 'Open Cutout',
    },
    route: '/background-remover',
    supportsHandoff: true,
    graphic: <RemoveBgGraphic />,
    accentBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
    glowColor: '#8B5CF6',
  },
  {
    id: 'watermark-image',
    shortTag: 'WATERMARK',
    tagColor: 'text-amber-600 dark:text-amber-400',
    title: {
      fr: 'Ajouter un filigrane',
      en: 'Add watermark',
    },
    description: {
      fr: 'Protégez vos créations visuelles avec un sceau ou un bandeau d’authenticité opacifié.',
      en: 'Protect creative assets with customizable text signatures, tiles, or copyright stamps.',
    },
    ctaText: {
      fr: 'Ouvrir Filigrane',
      en: 'Open Watermark',
    },
    route: '/watermark-image',
    supportsHandoff: true,
    graphic: <WatermarkImageGraphic />,
    accentBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
    glowColor: '#F59E0B',
  },
  {
    id: 'flip-rotate-image',
    shortTag: 'ROTATE',
    tagColor: 'text-indigo-600 dark:text-indigo-400',
    title: {
      fr: 'Pivoter & Miroir',
      en: 'Rotate & Flip',
    },
    description: {
      fr: 'Tournez l’image à 90°, 180° ou appliquez une symétrie axiale horizontale ou verticale nette.',
      en: 'Rotate by 90°, 180° or apply crisp horizontal and vertical mirror reflections.',
    },
    ctaText: {
      fr: 'Ouvrir Rotation',
      en: 'Open Rotate',
    },
    route: '/flip-rotate-image',
    supportsHandoff: true,
    graphic: <FlipRotateImageGraphic />,
    accentBorder: 'hover:border-indigo-500/50 dark:hover:border-indigo-400/50',
    glowColor: '#6366F1',
  },
  {
    id: 'image-to-pdf',
    shortTag: 'EXPORT PDF',
    tagColor: 'text-red-600 dark:text-red-400',
    title: {
      fr: 'Convertir en document PDF',
      en: 'Convert to PDF',
    },
    description: {
      fr: 'Encapsulez votre image optimisée dans un PDF vectoriel prêt pour l’archivage ou l’impression.',
      en: 'Package your optimized image into a clean PDF ready for archiving or high-res printing.',
    },
    ctaText: {
      fr: 'Ouvrir Image en PDF',
      en: 'Open Image to PDF',
    },
    route: '/image-to-pdf',
    supportsHandoff: true,
    graphic: <ExportPdfGraphic />,
    accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
    glowColor: '#EC1C24',
  },
];

export function ImageNextActionModal({
  toolId,
  isOpen,
  onClose,
  resultBlob,
  resultFilename,
  file,
}: ImageNextActionModalProps) {
  const [, setLocation] = useLocation();
  const { locale } = useLocale();
  const isFr = locale === 'FR';

  const handleActionSelect = (action: { route: string; supportsHandoff: boolean }) => {
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

  // Exclude current active tool to eliminate redundant loops, dynamically selecting 6 actions
  const displayedActions = useMemo(() => {
    return ALL_IMAGE_ACTIONS
      .filter((action) => action.id !== toolId)
      .slice(0, 6)
      .map((action, idx) => ({
        ...action,
        title: isFr ? action.title.fr : action.title.en,
        description: isFr ? action.description.fr : action.description.en,
        ctaText: isFr ? action.ctaText.fr : action.ctaText.en,
        tag: `0${idx + 1} // ${action.shortTag}`,
      }));
  }, [toolId, isFr]);

  return (
    <NextActionModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isFr ? 'Actions recommandées' : 'Recommended next actions'}
      subtitleMobile={isFr ? 'Sélectionnez l’étape suivante pour votre image' : 'Choose the next step for your image'}
      closeLabel={isFr ? 'Fermer' : 'Close'}
      moreActionsLabel={(count) => `+ ${count} ${isFr ? 'autres actions' : 'more actions'}`}
      actions={displayedActions}
      onSelectAction={handleActionSelect}
    />
  );
}

export default ImageNextActionModal;
