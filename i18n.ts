import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'es', 'ar', 'fr'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return {
    locale: locale as string,
    messages: (await import(`./lang/${locale}.json`)).default,
  }
})
