'use client';
import { useI18n } from '@/services/i18n-context';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'am' : 'en')}
      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
    >
      <span>{locale === 'en' ? 'ET' : 'EN'}</span>
      <span>{locale === 'en' ? 'Amharic' : 'English'}</span>
    </button>
  );
}