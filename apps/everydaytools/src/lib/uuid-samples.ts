/**
 * Predefined realistic UUID samples for the inspector and demonstration purposes.
 */

export interface UuidSample {
  id: string;
  label: {
    fr: string;
    en: string;
  };
  uuid: string;
  version: string;
}

export const UUID_SAMPLES: UuidSample[] = [
  {
    id: 'v4-sample',
    label: {
      fr: 'Exemple UUIDv4 (Aléatoire)',
      en: 'UUIDv4 Sample (Random)',
    },
    uuid: 'c86326d9-f521-4f36-9e90-2e452601da19',
    version: 'v4',
  },
  {
    id: 'v7-sample',
    label: {
      fr: 'Exemple UUIDv7 (Horodaté)',
      en: 'UUIDv7 Sample (Timestamped)',
    },
    uuid: '018ecf6a-6f60-7a0e-bc25-2c8cbf99d108',
    version: 'v7',
  },
  {
    id: 'nil-sample',
    label: {
      fr: 'UUID Nil (Tout zéros)',
      en: 'Nil UUID (All zeros)',
    },
    uuid: '00000000-0000-0000-0000-000000000000',
    version: 'nil',
  },
];
