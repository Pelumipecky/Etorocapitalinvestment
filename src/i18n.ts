import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import pt from './locales/pt.json'
import ptBR from './locales/pt-BR.json'

type TranslationDictionary = Record<string, unknown>

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'pt-BR', label: 'Portuguese (BR)' },
  { code: 'ru', label: 'Russian' },
  { code: 'it', label: 'Italian' },
  { code: 'ko', label: 'Korean' },
  { code: 'tr', label: 'Turkish' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'th', label: 'Thai' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
  { code: 'sv', label: 'Swedish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'ms', label: 'Malay' }
] as const

export const SUPPORTED_LANGUAGE_CODES: string[] = LANGUAGE_OPTIONS.map((language) => language.code)

export const GOOGLE_TRANSLATE_LANGUAGE_MAP: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  zh: 'zh-CN',
  ja: 'ja',
  pt: 'pt',
  'pt-BR': 'pt',
  ru: 'ru',
  it: 'it',
  ko: 'ko',
  tr: 'tr',
  vi: 'vi',
  th: 'th',
  nl: 'nl',
  pl: 'pl',
  id: 'id',
  ar: 'ar',
  hi: 'hi',
  sv: 'sv',
  uk: 'uk',
  tl: 'tl',
  ms: 'ms'
}

const RTL_LANGUAGE_CODES = new Set<string>(['ar'])

function hasTranslations(translation: TranslationDictionary): boolean {
  return Object.keys(translation).length > 0
}

export function normalizeLanguageCode(language?: string | null): string {
  if (!language) {
    return 'en'
  }

  const cleaned = language.replace('_', '-')

  if (SUPPORTED_LANGUAGE_CODES.includes(cleaned)) {
    return cleaned
  }

  const exactMatch = SUPPORTED_LANGUAGE_CODES.find(
    (supportedLanguage) => supportedLanguage.toLowerCase() === cleaned.toLowerCase()
  )

  if (exactMatch) {
    return exactMatch
  }

  const baseLanguage = cleaned.split('-')[0].toLowerCase()
  const baseMatch = SUPPORTED_LANGUAGE_CODES.find(
    (supportedLanguage) => supportedLanguage.toLowerCase() === baseLanguage
  )

  return baseMatch ?? 'en'
}

function syncDocumentLanguage(language: string): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.lang = language
  document.documentElement.dir = RTL_LANGUAGE_CODES.has(language) ? 'rtl' : 'ltr'
}

export function applyGoogleTranslateLanguage(language: string): void {
  if (typeof document === 'undefined') {
    return
  }

  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null

  if (!select) {
    return
  }

  const googleLanguage = GOOGLE_TRANSLATE_LANGUAGE_MAP[language] ?? language

  if (select.value === googleLanguage) {
    return
  }

  select.value = googleLanguage
  select.dispatchEvent(new Event('change'))
}

const ptBRTranslations = hasTranslations(ptBR as TranslationDictionary) ? ptBR : pt

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  fr: {
    translation: fr
  },
  de: {
    translation: de
  },
  zh: {
    translation: zh
  },
  ja: {
    translation: ja
  },
  pt: {
    translation: pt
  },
  'pt-BR': {
    translation: ptBRTranslations
  },
  ru: { translation: en },
  it: { translation: en },
  ko: { translation: en },
  tr: { translation: en },
  vi: { translation: en },
  th: { translation: en },
  nl: { translation: en },
  pl: { translation: en },
  id: { translation: en },
  ar: { translation: en },
  hi: { translation: en },
  sv: { translation: en },
  uk: { translation: en },
  tl: { translation: en },
  ms: { translation: en }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n

try {
  const stored = localStorage.getItem('i18nextLng')

  if (stored) {
    const normalizedStoredLanguage = normalizeLanguageCode(stored)

    if (stored !== normalizedStoredLanguage) {
      localStorage.setItem('i18nextLng', normalizedStoredLanguage)
    }
  }
} catch (error) {
  // localStorage may not be available in some test environments; ignore.
}

const initialLanguage = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language)
syncDocumentLanguage(initialLanguage)

if (initialLanguage !== (i18n.resolvedLanguage || i18n.language)) {
  void i18n.changeLanguage(initialLanguage)
}

i18n.on('languageChanged', (language) => {
  syncDocumentLanguage(normalizeLanguageCode(language))
})
