import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BarberBook',
  description: 'Barber appointment booking system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // This root layout just passes children through
  // The [locale]/layout.tsx handles the html/body structure
  return children
}
