'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '@/hooks/useTranslations'

interface Country {
  code: string
  name: string
  flag: string
  prefix: string
}

const countryData: Omit<Country, 'name'>[] = [
  // Europe
  { code: 'ES', flag: '🇪🇸', prefix: '+34' },
  { code: 'FR', flag: '🇫🇷', prefix: '+33' },
  { code: 'GB', flag: '🇬🇧', prefix: '+44' },
  { code: 'DE', flag: '🇩🇪', prefix: '+49' },
  { code: 'IT', flag: '🇮🇹', prefix: '+39' },
  { code: 'PT', flag: '🇵🇹', prefix: '+351' },
  { code: 'NL', flag: '🇳🇱', prefix: '+31' },
  { code: 'BE', flag: '🇧🇪', prefix: '+32' },
  { code: 'CH', flag: '🇨🇭', prefix: '+41' },
  { code: 'AT', flag: '🇦🇹', prefix: '+43' },
  { code: 'SE', flag: '🇸🇪', prefix: '+46' },
  { code: 'NO', flag: '🇳🇴', prefix: '+47' },
  { code: 'DK', flag: '🇩🇰', prefix: '+45' },
  { code: 'FI', flag: '🇫🇮', prefix: '+358' },
  { code: 'PL', flag: '🇵🇱', prefix: '+48' },
  { code: 'CZ', flag: '🇨🇿', prefix: '+420' },
  { code: 'HU', flag: '🇭🇺', prefix: '+36' },
  { code: 'GR', flag: '🇬🇷', prefix: '+30' },
  { code: 'IE', flag: '🇮🇪', prefix: '+353' },
  { code: 'RO', flag: '🇷🇴', prefix: '+40' },
  { code: 'HR', flag: '🇭🇷', prefix: '+385' },
  { code: 'BG', flag: '🇧🇬', prefix: '+359' },
  { code: 'SK', flag: '🇸🇰', prefix: '+421' },
  { code: 'SI', flag: '🇸🇮', prefix: '+386' },
  { code: 'LT', flag: '🇱🇹', prefix: '+370' },
  { code: 'LV', flag: '🇱🇻', prefix: '+371' },
  { code: 'EE', flag: '🇪🇪', prefix: '+372' },

  // North America
  { code: 'US', flag: '🇺🇸', prefix: '+1' },
  { code: 'CA', flag: '🇨🇦', prefix: '+1' },
  { code: 'MX', flag: '🇲🇽', prefix: '+52' },

  // South America
  { code: 'BR', flag: '🇧🇷', prefix: '+55' },
  { code: 'AR', flag: '🇦🇷', prefix: '+54' },
  { code: 'CL', flag: '🇨🇱', prefix: '+56' },
  { code: 'CO', flag: '🇨🇴', prefix: '+57' },
  { code: 'PE', flag: '🇵🇪', prefix: '+51' },
  { code: 'VE', flag: '🇻🇪', prefix: '+58' },
  { code: 'EC', flag: '🇪🇨', prefix: '+593' },
  { code: 'UY', flag: '🇺🇾', prefix: '+598' },
  { code: 'PY', flag: '🇵🇾', prefix: '+595' },
  { code: 'BO', flag: '🇧🇴', prefix: '+591' },

  // Asia
  { code: 'CN', flag: '🇨🇳', prefix: '+86' },
  { code: 'JP', flag: '🇯🇵', prefix: '+81' },
  { code: 'KR', flag: '🇰🇷', prefix: '+82' },
  { code: 'IN', flag: '🇮🇳', prefix: '+91' },
  { code: 'ID', flag: '🇮🇩', prefix: '+62' },
  { code: 'TH', flag: '🇹🇭', prefix: '+66' },
  { code: 'VN', flag: '🇻🇳', prefix: '+84' },
  { code: 'PH', flag: '🇵🇭', prefix: '+63' },
  { code: 'MY', flag: '🇲🇾', prefix: '+60' },
  { code: 'SG', flag: '🇸🇬', prefix: '+65' },
  { code: 'HK', flag: '🇭🇰', prefix: '+852' },
  { code: 'TW', flag: '🇹🇼', prefix: '+886' },
  { code: 'AE', flag: '🇦🇪', prefix: '+971' },
  { code: 'SA', flag: '🇸🇦', prefix: '+966' },
  { code: 'IL', flag: '🇮🇱', prefix: '+972' },
  { code: 'TR', flag: '🇹🇷', prefix: '+90' },
  { code: 'PK', flag: '🇵🇰', prefix: '+92' },
  { code: 'BD', flag: '🇧🇩', prefix: '+880' },
  { code: 'LK', flag: '🇱🇰', prefix: '+94' },

  // Africa
  { code: 'ZA', flag: '🇿🇦', prefix: '+27' },
  { code: 'NG', flag: '🇳🇬', prefix: '+234' },
  { code: 'EG', flag: '🇪🇬', prefix: '+20' },
  { code: 'KE', flag: '🇰🇪', prefix: '+254' },
  { code: 'GH', flag: '🇬🇭', prefix: '+233' },
  { code: 'MA', flag: '🇲🇦', prefix: '+212' },
  { code: 'TN', flag: '🇹🇳', prefix: '+216' },
  { code: 'DZ', flag: '🇩🇿', prefix: '+213' },
  { code: 'ET', flag: '🇪🇹', prefix: '+251' },
  { code: 'UG', flag: '🇺🇬', prefix: '+256' },

  // Oceania
  { code: 'AU', flag: '🇦🇺', prefix: '+61' },
  { code: 'NZ', flag: '🇳🇿', prefix: '+64' },

  // Middle East
  { code: 'IR', flag: '🇮🇷', prefix: '+98' },
  { code: 'IQ', flag: '🇮🇶', prefix: '+964' },
  { code: 'JO', flag: '🇯🇴', prefix: '+962' },
  { code: 'LB', flag: '🇱🇧', prefix: '+961' },
  { code: 'SY', flag: '🇸🇾', prefix: '+963' },
  { code: 'KW', flag: '🇰🇼', prefix: '+965' },
  { code: 'QA', flag: '🇶🇦', prefix: '+974' },
  { code: 'BH', flag: '🇧🇭', prefix: '+973' },
  { code: 'OM', flag: '🇴🇲', prefix: '+968' },

  // Other
  { code: 'RU', flag: '🇷🇺', prefix: '+7' },
  { code: 'UA', flag: '🇺🇦', prefix: '+380' },
  { code: 'BY', flag: '🇧🇾', prefix: '+375' },
  { code: 'KZ', flag: '🇰🇿', prefix: '+7' },
]

interface CountryPhoneInputProps {
  value?: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  className?: string
}

export default function CountryPhoneInput({
  value = '',
  onChange,
  error,
  placeholder,
  className = '',
}: CountryPhoneInputProps) {
  const { t } = useTranslations()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Create countries array with translated names
  const countries: Country[] = countryData.map((country) => ({
    ...country,
    name: t(`countries.${country.code}`),
  }))

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Default to Spain

  // Parse initial value to extract country code and phone number
  useEffect(() => {
    if (value) {
      const country = countries.find((c) => value.startsWith(c.prefix))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.substring(country.prefix.length))
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value, countries])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchTerm('')
    // Update the full phone number
    onChange(country.prefix + phoneNumber)
  }

  // Filter countries based on search term
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.prefix.includes(searchTerm)
  )

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value
    setPhoneNumber(newPhoneNumber)
    // Update the full phone number with country prefix
    onChange(selectedCountry.prefix + newPhoneNumber)
  }

  const defaultPlaceholder = t('booking.form.phonePlaceholder')

  return (
    <div className="relative">
      <div className={`flex ${className}`}>
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-2 px-3 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-gray-100 transition-colors ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.prefix}</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder={t('countryInput.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Countries List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    {t('countryInput.noResults')}
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.prefix}</div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder || defaultPlaceholder}
          className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
      )}
    </div>
  )
}
