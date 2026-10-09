import { useState, useCallback, useRef } from 'react';
import {
  type PdfMetadataForm,
  type PdfInitialValues,
  cleanTag,
  inferTitleFromFilename,
} from '@/lib/pdf-metadata-logic';

export function usePdfMetadataForm() {
  const [title, setTitle] = useState('');
  const [showInTitleBar, setShowInTitleBar] = useState(true);
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [creator, setCreator] = useState('');
  const [producer, setProducer] = useState('');
  const [language, setLanguage] = useState('');
  const [dateMode, setDateMode] = useState<'keep' | 'today' | 'custom' | 'clear'>('keep');
  const [customDate, setCustomDate] = useState<string>('');
  const [showTechFields, setShowTechFields] = useState(false);

  const initialValuesRef = useRef<PdfInitialValues>({
    title: '',
    author: '',
    subject: '',
    tags: [],
    creator: '',
    producer: '',
    language: '',
    creationDate: null,
  });

  const resetForm = useCallback(() => {
    setTitle('');
    setShowInTitleBar(true);
    setAuthor('');
    setSubject('');
    setTags([]);
    setTagInput('');
    setCreator('');
    setProducer('');
    setLanguage('');
    setDateMode('keep');
    setCustomDate('');
    setShowTechFields(false);
  }, []);

  const handleWipeMetadata = useCallback(() => {
    setTitle('');
    setShowInTitleBar(false);
    setAuthor('');
    setSubject('');
    setTags([]);
    setTagInput('');
    setCreator('');
    setProducer('');
    setLanguage('');
    setDateMode('clear');
  }, []);

  const handleInferTitle = useCallback((filename: string) => {
    setTitle(inferTitleFromFilename(filename));
  }, []);

  const handleRestoreInitial = useCallback(() => {
    const init = initialValuesRef.current;
    setTitle(init.title);
    setAuthor(init.author);
    setSubject(init.subject);
    setTags([...init.tags]);
    setCreator(init.creator);
    setProducer(init.producer);
    setLanguage(init.language);
    setDateMode('keep');
    if (init.creationDate && !isNaN(init.creationDate.getTime())) {
      setCustomDate(init.creationDate.toISOString().split('T')[0]);
    } else {
      setCustomDate('');
    }
  }, []);

  const handleAddTag = useCallback((tagToAdd: string) => {
    const cleaned = cleanTag(tagToAdd);
    if (!cleaned) return;
    setTags((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setTagInput('');
  }, []);

  const handleRemoveTag = useCallback((indexToRemove: number) => {
    setTags((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag(tagInput);
      } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
        handleRemoveTag(tags.length - 1);
      }
    },
    [tagInput, tags.length, handleAddTag, handleRemoveTag]
  );

  const setFormData = useCallback((data: PdfMetadataForm, initialValues: PdfInitialValues) => {
    setTitle(data.title);
    setShowInTitleBar(data.showInTitleBar);
    setAuthor(data.author);
    setSubject(data.subject);
    setTags(data.tags);
    setCreator(data.creator);
    setProducer(data.producer);
    setLanguage(data.language);
    setDateMode(data.dateMode);
    setCustomDate(data.customDate);
    initialValuesRef.current = initialValues;
    setShowTechFields(Boolean(data.creator || data.producer));
  }, []);

  const getFormData = useCallback((): PdfMetadataForm => {
    return {
      title,
      showInTitleBar,
      author,
      subject,
      tags,
      creator,
      producer,
      language,
      dateMode,
      customDate,
    };
  }, [title, showInTitleBar, author, subject, tags, creator, producer, language, dateMode, customDate]);

  return {
    title,
    setTitle,
    showInTitleBar,
    setShowInTitleBar,
    author,
    setAuthor,
    subject,
    setSubject,
    tags,
    setTags,
    tagInput,
    setTagInput,
    creator,
    setCreator,
    producer,
    setProducer,
    language,
    setLanguage,
    dateMode,
    setDateMode,
    customDate,
    setCustomDate,
    showTechFields,
    setShowTechFields,
    initialValues: initialValuesRef.current,
    resetForm,
    handleWipeMetadata,
    handleInferTitle,
    handleRestoreInitial,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown,
    setFormData,
    getFormData,
  };
}
