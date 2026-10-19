import React from 'react';
import { useLocale } from '@/hooks/use-locale';
import CsvToJson from './csv-to-json';

export default function JsonToCsv() {
  useLocale();
  return <CsvToJson initialDirection="json-to-csv" toolSlug="json-to-csv" />;
}
