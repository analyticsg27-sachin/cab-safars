'use client';

import { useState, useEffect } from 'react';
import { getLang, t, type Lang, type TKey, LANG_KEY } from './translations';

export function useTranslation() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(getLang());
    function onStorage(e: StorageEvent) {
      if (e.key === LANG_KEY) setLang((e.newValue as Lang) || 'en');
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return {
    lang,
    t: (key: TKey) => t(key, lang),
  };
}
