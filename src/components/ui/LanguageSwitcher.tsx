import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  applyGoogleTranslateLanguage,
  LANGUAGE_OPTIONS,
  normalizeLanguageCode,
} from '@/i18n'

const LanguageSwitcher: React.FC<{ variant?: string }> = ({ variant }) => {
  const { i18n } = useTranslation()
  const currentLang = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = normalizeLanguageCode(event.target.value)

    void i18n.changeLanguage(language)
    applyGoogleTranslateLanguage(language)
    window.setTimeout(() => applyGoogleTranslateLanguage(language), 300)
  }

  return (
    <select
      className={`language-switcher${variant ? ` language-switcher--${variant}` : ''}`}
      value={currentLang}
      onChange={handleChange}
      aria-label="Select language"
    >
      {LANGUAGE_OPTIONS.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher
