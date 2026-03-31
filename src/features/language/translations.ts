import { en } from './en';
import { ru } from './ru';
import { de } from './de';
import type { Language } from './languageSlice';
import type { Translations } from './types';

export const translations: Record<Language, Translations> = {
    en,
    ru,
    de,
};
