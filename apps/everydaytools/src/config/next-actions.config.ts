import {
  Minimize2,
  Lock,
  Stamp,
  Hash,
  Layers,
  Scissors,
  FileText,
  FileSpreadsheet,
  Image,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NextActionItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  iconColor?: string;
  accentBg?: string;
  badge?: string;
  supportsHandoff: boolean;
}

export interface NextActionConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryActions: NextActionItem[];
  suggestedTools: NextActionItem[];
}

export const NEXT_ACTIONS_REGISTRY: Record<string, NextActionConfig> = {
  'word-to-pdf': {
    eyebrow: 'WORKFLOW RECOMMANDÉ',
    title: 'Poursuivre avec ce document',
    description: 'Votre PDF est téléchargé. Vous pouvez l\'enchaîner directement avec l\'une des actions ci-dessous.',
    primaryActions: [
      {
        id: 'pdf-compress',
        title: 'Compresser pour envoi par e-mail',
        description: 'Réduisez la taille du fichier jusqu\'à 80% tout en préservant la netteté.',
        route: '/pdf-compress',
        icon: Minimize2,
        iconColor: '#EA580C', // orange-600
        accentBg: 'rgba(234, 88, 12, 0.08)',
        badge: 'Fichier auto-injecté',
        supportsHandoff: true,
      },
      {
        id: 'pdf-protect',
        title: 'Verrouiller par mot de passe',
        description: 'Ajoutez un chiffrement sécurisé avant de partager ou d\'archiver ce document.',
        route: '/pdf-protect',
        icon: Lock,
        iconColor: '#2563EB', // blue-600
        accentBg: 'rgba(37, 99, 235, 0.08)',
        badge: 'Fichier auto-injecté',
        supportsHandoff: true,
      },
    ],
    suggestedTools: [
      {
        id: 'pdf-watermark',
        title: 'Ajouter un filigrane',
        description: 'Apposez un tampon personnalisé ou confidentiel.',
        route: '/pdf-watermark',
        icon: Stamp,
        iconColor: '#059669', // emerald-600
        supportsHandoff: false,
      },
      {
        id: 'pdf-page-numbers',
        title: 'Numéroter les pages',
        description: 'Insérez une pagination propre et personnalisée.',
        route: '/pdf-page-numbers',
        icon: Hash,
        iconColor: '#7C3AED', // purple-600
        supportsHandoff: false,
      },
    ],
  },
};
