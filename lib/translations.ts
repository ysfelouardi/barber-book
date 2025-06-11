import en from '@/lang/en.json'
import es from '@/lang/es.json'
import ar from '@/lang/ar.json'
import fr from '@/lang/fr.json'

// Load translations from JSON files
export const translations = {
  en,
  es,
  ar,
  fr,
} as const

export type Locale = keyof typeof translations

// Helper function to get nested translation
export function getTranslation(translations: any, path: string): string {
  return path.split('.').reduce((obj, key) => obj?.[key], translations) || path
}
