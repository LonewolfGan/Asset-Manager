import { useState, useEffect, useCallback, useRef } from 'react';
import { apiUrl } from '@/lib/apiBase';

export interface UsePasswordSpeechOptions {
  isFr: boolean;
}

export function usePasswordSpeech({ isFr }: UsePasswordSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const getBestVoice = useCallback((targetLang: 'fr' | 'en') => {
    const list = voices.length > 0 ? voices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
    if (!list || list.length === 0) return null;

    const prefix = targetLang === 'fr' ? 'fr' : 'en';
    const langVoices = list.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
    if (langVoices.length === 0) return null;

    const naturalVoice = langVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('natural') ||
        name.includes('google') ||
        name.includes('neural') ||
        name.includes('premium') ||
        name.includes('enhanced') ||
        name.includes('siri')
      );
    });
    if (naturalVoice) return naturalVoice;

    const remoteVoice = langVoices.find((v) => !v.localService);
    if (remoteVoice) return remoteVoice;

    const defaultVoice = langVoices.find((v) => v.default);
    if (defaultVoice) return defaultVoice;

    return langVoices[0];
  }, [voices]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const fallbackSpeechSynthesis = useCallback((textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const targetLang = isFr ? 'fr' : 'en';
    utterance.lang = isFr ? 'fr-FR' : 'en-US';

    const bestVoice = getBestVoice(targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isFr, getBestVoice]);

  const speakPassword = useCallback((password: string) => {
    if (!password) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);

    const spokenText = password.charAt(0).toUpperCase() + password.slice(1).toLowerCase();
    const lang = isFr ? 'fr' : 'en';

    try {
      const endpoint = apiUrl(`/api/text/tts?text=${encodeURIComponent(spokenText)}&lang=${lang}`);
      const audio = new Audio(endpoint);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        fallbackSpeechSynthesis(spokenText);
      };

      audio.play().catch(() => {
        fallbackSpeechSynthesis(spokenText);
      });
    } catch {
      fallbackSpeechSynthesis(spokenText);
    }
  }, [isSpeaking, stopSpeaking, isFr, fallbackSpeechSynthesis]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSpeaking,
    speakPassword,
    stopSpeaking,
  };
}
