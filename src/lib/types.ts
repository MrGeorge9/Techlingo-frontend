// Core types for the dictionary application

// Dynamic language support - any language code can be used
export type Language = string

// Dynamic translation direction - format: 'from-to' (e.g., 'sk-en', 'en-de')
export type TranslationDirection = string

export type CategoryKey =
  | 'material'
  | 'statics'
  | 'structure'
  | 'finishing'
  | 'energy'
  | 'hvac'
  | 'other'

export interface Translation {
  term: string
  definition: string
  exampleUsage: string
  categories: string[] // Translated category names for display
}

export interface Term {
  id: number
  slug: string
  categoryKeys: CategoryKey[] // Technical keys for filtering
  translations: Record<string, Translation> // Translations per language (dynamic keys)
  createdAt?: string
  updatedAt?: string
}

export interface DictionaryData {
  terms: Term[]
}

export interface SearchParams {
  query?: string
  direction?: TranslationDirection
  category?: CategoryKey
  categories?: CategoryKey[]
}

export interface GetTermsParams extends SearchParams {
  limit?: number
  offset?: number
}

export interface TranslateRequest {
  text: string
  from: Language
  to: Language
}

export interface TranslateResponse {
  originalText: string
  translatedText: string
  confidence?: number
}

// UI State types
export interface UILanguage {
  code: Language
  name: string
}

export interface FilterState {
  query: string
  direction: TranslationDirection
  category: CategoryKey | 'all'
}
