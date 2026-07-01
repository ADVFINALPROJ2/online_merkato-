'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Locale = 'en' | 'am';

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}>({
  locale: 'en',
  t: (key) => key,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved === 'en' || saved === 'am') setLocale(saved);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/i18n/${locale}`)
      .then((r) => r.json())
      .then(setTranslations)
      .catch(() => {});
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);