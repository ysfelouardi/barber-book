import { useParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { translations, getTranslation, type Locale } from '@/lib/translations'

export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'

  const t = useCallback(
    (key: string) => {
      const localeTranslations = translations[locale] || translations.en
      return getTranslation(localeTranslations, key)
    },
    [locale]
  )

  return useMemo(() => ({ t, locale }), [t, locale])
}
