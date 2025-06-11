import { useParams } from 'next/navigation'
import { translations, getTranslation, type Locale } from '@/lib/translations'

export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'

  const t = (key: string) => {
    const localeTranslations = translations[locale] || translations.en
    return getTranslation(localeTranslations, key)
  }

  return { t, locale }
}
