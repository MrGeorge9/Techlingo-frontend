// Utility functions

/**
 * Combine class names, filtering out falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Debounce function - delays execution until after wait milliseconds
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Get items from localStorage with JSON parsing
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Set items to localStorage with JSON stringification
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
  }
}

/**
 * Format direction from languages
 */
export function formatDirection(from: string, to: string): string {
  return `${from}-${to}` as const
}

/**
 * Parse direction into source and target languages
 */
export function parseDirection(direction: string): { source: string; target: string } {
  const [source, target] = direction.split('-')
  return { source, target }
}

/**
 * Remove diacritics from text for accent-insensitive search
 * Example: "železo" -> "zelezo", "čaj" -> "caj"
 */
export function removeDiacritics(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters into base + diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
}
