import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { locales } from '../../i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BarberBook',
  description: 'Book your barber appointment with ease',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💈</text></svg>',
  },
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
