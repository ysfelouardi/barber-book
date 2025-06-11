'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useTranslations } from '@/hooks/useTranslations'

const locales = ['en', 'es', 'ar', 'fr'] as const

export default function SimpleLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { t, locale } = useTranslations()

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    ar: { name: 'العربية', flag: '🇲🇦' },
    fr: { name: 'Français', flag: '🇫🇷' },
  }

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef} dir="ltr">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className="text-sm font-medium text-gray-700">
          {languages[locale as keyof typeof languages]?.flag}{' '}
          {languages[locale as keyof typeof languages]?.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1">
          {locales.map((localeOption) => (
            <button
              key={localeOption}
              onClick={() => handleLocaleChange(localeOption)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                locale === localeOption ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{languages[localeOption].flag}</span>
              <span className="text-sm font-medium">{languages[localeOption].name}</span>
              {locale === localeOption && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
