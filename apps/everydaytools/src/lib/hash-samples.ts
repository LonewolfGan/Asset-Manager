/**
 * Predefined realistic input samples for the Cryptographic Hash Generator.
 */

export interface HashSample {
  id: string;
  label: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  text: string;
}

export const HASH_SAMPLES: HashSample[] = [
  {
    id: 'hello',
    label: {
      fr: 'Hello World',
      en: 'Hello World',
    },
    description: {
      fr: 'Texte d’introduction classique pour vérifier les empreintes standards',
      en: 'Classic introduction text for standard hash verification',
    },
    text: 'Hello, world!',
  },
  {
    id: 'password',
    label: {
      fr: 'Mot de passe sécurisé',
      en: 'Secure Password',
    },
    description: {
      fr: 'Exemple de mot de passe complexe avec caractères spéciaux',
      en: 'Complex password example with special characters',
    },
    text: 'Tr0ub4dor&3#2026',
  },
  {
    id: 'jwt-token',
    label: {
      fr: 'Jeton JWT / API',
      en: 'JWT / API Token',
    },
    description: {
      fr: 'Jeton d’authentification pour tester la signature HMAC',
      en: 'Authentication token for testing HMAC signatures',
    },
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  },
  {
    id: 'document-snippet',
    label: {
      fr: 'Paragraphe texte',
      en: 'Text Paragraph',
    },
    description: {
      fr: 'Paragraphe de documentation technique EverydayTools',
      en: 'EverydayTools technical documentation paragraph',
    },
    text: 'EverydayTools — Modern developer utilities studio running 100% locally in your browser.',
  },
];

export function getHashSampleById(id: string): HashSample | undefined {
  return HASH_SAMPLES.find((s) => s.id === id);
}
