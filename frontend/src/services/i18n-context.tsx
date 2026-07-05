'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Locale = 'en' | 'am';

const I18nContext = createContext({
  locale: 'en' as Locale,
  t: (key: string) => key,
  setLocale: (locale: Locale) => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved === 'en' || saved === 'am') setLocale(saved);
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${base}/i18n/${locale}`);
        if (!res.ok) {
          throw new Error('Failed to load translations');
        }

        const data = await res.json();
        setTranslations(data);
      } catch (err) {
        console.error('i18n load failed:', err);
        setTranslations({});
      }
    };

    loadTranslations();
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