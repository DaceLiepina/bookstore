import type {
  CatalogTranslations,
  RuPlural,
  SimplePlural,
} from '../features/language/types';

export function pluralRu(n: number, forms: RuPlural): string {
  if (n % 10 === 1 && n % 100 !== 11) return forms.one;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
    return forms.few;
  return forms.many;
}

export function pluralSimple(n: number, forms: SimplePlural): string {
  return n === 1 ? forms.one : forms.other;
}

export function getFoundBooksText(
  count: number,
  t: CatalogTranslations,
  lang: string
): string {
  const word =
    lang === 'ru'
      ? pluralRu(count, t.wRBooks!)
      : pluralSimple(count, t.wSBooks!);

  return t.foundBooks
    .replace('{count}', count.toString())
    .replace('{books}', word);
}
