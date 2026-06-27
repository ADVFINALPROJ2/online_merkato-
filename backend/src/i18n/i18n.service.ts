import { Injectable } from '@nestjs/common';
import * as en from './locales/en.json';
import * as am from './locales/am.json';

type Locale = 'en' | 'am';

@Injectable()
export class I18nService {
  private translations: Record<Locale, any> = { en, am };

  t(key: string, locale: Locale = 'en'): string {
    const keys = key.split('.');
    let value = this.translations[locale];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        let fallback = this.translations['en'];
        for (const fk of keys) fallback = fallback?.[fk];
        return fallback ?? key;
      }
    }
    return value ?? key;
  }

  getAll(locale: Locale = 'en') {
    return this.translations[locale] ?? this.translations['en'];
  }

  getSupportedLocales(): Locale[] {
    return ['en', 'am'];
  }
}
