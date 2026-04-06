'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Locale, type TranslationKey, getTranslations, LOCALE_NAMES } from './translations'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  locales: typeof LOCALE_NAMES
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('certforge-locale')
      if (saved && (saved === 'en' || saved === 'es' || saved === 'pt' || saved === 'ja')) {
        return saved
      }
    }
    return 'en'
  })

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('certforge-locale', newLocale)
    }
  }, [])

  const translations = getTranslations(locale)

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[key] ?? key
    },
    [translations]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales: LOCALE_NAMES }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
