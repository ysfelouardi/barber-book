import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { locales } from '../../i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BarberBook',
  description: 'Book your barber appointment with ease',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
