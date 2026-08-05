'use client';

import { useState, useEffect } from 'react';
import { getLang, t, type Lang, type TKey, LANG_KEY } from './translations';

export const LANG_EVENT = 'cs:lang';

export function setLanguage(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: lang }));
}

export function useTranslation() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(getLang());
    const onLangEvent = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY) setLang((e.newValue as Lang) || 'en');
    };
    window.addEventListener(LANG_EVENT, onLangEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(LANG_EVENT, onLangEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { lang, t: (key: TKey) => t(key, lang) };
}
