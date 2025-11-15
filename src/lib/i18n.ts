// Simple i18n helper for UI translations
// Extensible for more languages

import type { Language, CategoryKey, TranslationDirection } from './types'

export const AVAILABLE_LANGUAGES = [
  { code: 'sk' as Language, name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'cz' as Language, name: 'Čeština', flag: '🇨🇿' },
]

interface Translations {
  [key: string]: {
    sk: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.dictionary': { sk: 'Slovník', en: 'Dictionary' },
  'nav.exercises': { sk: 'Cvičenia', en: 'Exercises' },
  'nav.trending': { sk: 'Najvyhľadávanejšie', en: 'Trending' },

  // Search
  'search.placeholder': { sk: 'Hľadať termín...', en: 'Search term...' },
  'search.noResults': { sk: 'Žiadne výsledky', en: 'No results' },
  'search.noResultsDesc': {
    sk: 'Skúste zmeniť vyhľadávací výraz alebo filter',
    en: 'Try changing your search query or filters',
  },
  'search.clearFilters': { sk: 'Zrušiť filtre', en: 'Clear filters' },
  'search.title': { sk: 'Vyhľadávanie termínov', en: 'Search terms' },
  'search.results': { sk: 'Výsledky vyhľadávania', en: 'Search results' },

  // Direction
  'direction.label': { sk: 'Smer prekladu', en: 'Translation direction' },
  'direction.sk-en': { sk: 'SK → EN', en: 'SK → EN' },
  'direction.en-sk': { sk: 'EN → SK', en: 'EN → SK' },

  // Categories
  'category.all': { sk: 'Všetky kategórie', en: 'All categories' },
  'category.label': { sk: 'Kategórie', en: 'Categories' },
  'category.selected': { sk: 'vybraných', en: 'selected' },
  'category.clearAll': { sk: 'Zrušiť všetky', en: 'Clear all' },
  'category.material': { sk: 'Materiály', en: 'Materials' },
  'category.statics': { sk: 'Statika', en: 'Statics' },
  'category.structure': { sk: 'Konštrukcie', en: 'Structure' },
  'category.finishing': { sk: 'Dokončovacie práce', en: 'Finishing' },
  'category.energy': { sk: 'Energia', en: 'Energy' },
  'category.hvac': { sk: 'Vzduchotechnika', en: 'HVAC' },
  'category.other': { sk: 'Iné', en: 'Other' },

  // Term details
  'term.definition': { sk: 'Definícia', en: 'Definition' },
  'term.category': { sk: 'Kategória', en: 'Category' },
  'term.example': { sk: 'Príklad použitia', en: 'Usage example' },
  'term.close': { sk: 'Zavrieť', en: 'Close' },

  // Trending
  'trending.title': { sk: 'Najvyhľadávanejšie', en: 'Most Searched' },
  'trending.empty': { sk: 'Zatiaľ žiadne vyhľadávania', en: 'No searches yet' },
  'trending.emptyDesc': {
    sk: 'Začnite vyhľadávať termíny a tu sa objavia najpopulárnejšie',
    en: 'Start searching terms and the most popular ones will appear here',
  },
  'trending.viewCount': { sk: 'zobrazení', en: 'views' },

  // Results
  'results.count': { sk: 'Počet výsledkov', en: 'Results count' },
  'results.showing': { sk: 'Zobrazených', en: 'Showing' },

  // Exercises
  'exercises.title': { sk: 'Cvičenia', en: 'Exercises' },
  'exercises.comingSoon': { sk: 'Čoskoro', en: 'Coming soon' },
  'exercises.description': {
    sk: 'Testujte svoje znalosti stavebnej terminológie',
    en: 'Test your knowledge of construction terminology',
  },

  // Common
  'common.loading': { sk: 'Načítavam...', en: 'Loading...' },
  'common.error': { sk: 'Chyba', en: 'Error' },
  'common.back': { sk: 'Späť', en: 'Back' },
  'common.tagline': {
    sk: 'Stavebný slovník pre profesionálov a študentov',
    en: 'Construction dictionary for professionals and students'
  },
  'common.term': { sk: 'termín', en: 'term' },
  'common.terms': { sk: 'termíny', en: 'terms' },
  'common.termsMany': { sk: 'termínov', en: 'terms' },
}

/**
 * Get translation for a key in the specified language
 */
export function t(key: string, lang: Language = 'sk'): string {
  const translation = translations[key]
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`)
    return key
  }
  // For now, only SK and EN are supported in translations
  const supportedLang = (lang === 'sk' || lang === 'en') ? lang : 'sk'
  return translation[supportedLang] || translation.sk || key
}

/**
 * Get category name in the specified language
 */
export function getCategoryName(category: CategoryKey | 'all', lang: Language = 'sk'): string {
  return t(`category.${category}`, lang)
}

/**
 * Get direction label
 */
export function getDirectionLabel(direction: TranslationDirection, lang: Language = 'sk'): string {
  return t(`direction.${direction}`, lang)
}

/**
 * Format language pair for display
 */
export function formatLanguagePair(from: Language, to: Language): string {
  const fromLang = AVAILABLE_LANGUAGES.find((l) => l.code === from)
  const toLang = AVAILABLE_LANGUAGES.find((l) => l.code === to)
  return `${fromLang?.flag || from.toUpperCase()} → ${toLang?.flag || to.toUpperCase()}`
}

/**
 * Get correct plural form for term count
 * Slovak: 1=termín, 2-4=termíny, 5+=termínov
 * English: 1=term, 2+=terms
 */
export function getTermCountText(count: number, lang: Language = 'sk'): string {
  const supportedLang = (lang === 'sk' || lang === 'en') ? lang : 'sk'

  if (supportedLang === 'sk') {
    if (count === 1) return t('common.term', lang)
    if (count >= 2 && count <= 4) return t('common.terms', lang)
    return t('common.termsMany', lang)
  } else {
    // English
    return count === 1 ? t('common.term', lang) : t('common.terms', lang)
  }
}
