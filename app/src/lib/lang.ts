export type Lang = 'en' | 'es';

export interface Localized {
  en: string;
  es: string;
}

export const LANGS: Lang[] = ['en', 'es'];

export function isLang(value: string): value is Lang {
  return value === 'en' || value === 'es';
}

export function pick(value: Localized, lang: Lang): string {
  return value[lang];
}

export function pickAll(values: Localized[], lang: Lang): string[] {
  return values.map((value) => value[lang]);
}
