/**
 * Array of animal emojis for user avatars
 */
const ANIMAL_EMOJIS = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🦁',
  '🐮',
  '🐷',
  '🐸',
  '🐵',
  '🐔',
  '🐧',
  '🐦',
  '🐤',
  '🐣',
  '🐥',
  '🦆',
  '🦅',
  '🦉',
  '🦇',
  '🐺',
  '🐗',
  '🐴',
  '🦄',
  '🐝',
  '🐛',
  '🦋',
  '🐌',
  '🐞',
  '🐜',
  '🦟',
  '🦗',
  '🕷️',
  '🦂',
  '🐢',
  '🐍',
  '🦎',
  '🦖',
  '🦕',
  '🐙',
  '🦑',
  '🦐',
  '🦀',
  '🐡',
  '🐠',
  '🐟',
  '🐬',
  '🐳',
  '🐋',
  '🦈',
  '🐊',
  '🐅',
  '🐆',
  '🦓',
  '🦏',
  '🦛',
  '🐘',
  '🦒',
  '🦘',
  '🐪',
  '🐫',
  '🦙',
  '🦥',
  '🦦',
  '🦨',
  '🦡',
  '🐾',
]

/**
 * Generates a simple hash from a string
 * @param str - The input string
 * @returns A hash number
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Gets a consistent animal emoji avatar for a user based on their name
 * @param name - The user's name
 * @returns An animal emoji
 */
export function getAnimalAvatar(name: string): string {
  if (!name || name.trim().length === 0) {
    return '🐾' // Default fallback
  }

  // Normalize the name to ensure consistency
  const normalizedName = name.toLowerCase().trim()

  // Generate a hash and use it to select an emoji
  const hash = simpleHash(normalizedName)
  const index = hash % ANIMAL_EMOJIS.length

  return ANIMAL_EMOJIS[index]
}

/**
 * Gets the first letter of a name as a fallback
 * @param name - The user's name
 * @returns The first letter in uppercase
 */
export function getInitialFallback(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?'
  }
  return name.charAt(0).toUpperCase()
}

/**
 * Gets the admin avatar (barber pole emoji)
 * @returns The barber pole emoji
 */
export function getAdminAvatar(): string {
  return '💈'
}
