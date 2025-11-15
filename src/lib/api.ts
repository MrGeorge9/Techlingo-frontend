// API layer - REST API integration with backend

import type {
  Term,
  GetTermsParams,
  TranslateRequest,
  TranslateResponse,
} from './types'

const API_BASE_URL = '/api'

/**
 * Get all terms with optional filtering
 * GET /api/terms?q=...&dir=...&cat=...
 */
export async function getTerms(params?: GetTermsParams): Promise<Term[]> {
  const searchParams = new URLSearchParams()

  if (params?.query) {
    searchParams.append('q', params.query)
  }

  if (params?.direction) {
    searchParams.append('dir', params.direction)
  }

  if (params?.categories && params.categories.length > 0) {
    params.categories.forEach(cat => searchParams.append('cat', cat))
  } else if (params?.category) {
    searchParams.append('cat', params.category)
  }

  const queryString = searchParams.toString()
  const url = API_BASE_URL + '/terms' + (queryString ? '?' + queryString : '')

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch terms: ' + response.statusText)
  }

  return response.json()
}

/**
 * Get a single term by ID
 * GET /api/terms/:id
 */
export async function getTermById(id: string): Promise<Term | null> {
  const response = await fetch(API_BASE_URL + '/terms/' + id)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch term: ' + response.statusText)
  }

  return response.json()
}

/**
 * Get a single term by slug
 * GET /api/terms/slug/:slug
 */
export async function getTermBySlug(slug: string): Promise<Term | null> {
  const response = await fetch(API_BASE_URL + '/terms/slug/' + slug)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch term: ' + response.statusText)
  }

  return response.json()
}

/**
 * Search terms (alias for getTerms with query)
 * GET /api/terms?q=...
 */
export async function searchTerms(query: string, params?: Omit<GetTermsParams, 'query'>) {
  return getTerms({ ...params, query })
}

/**
 * Translate text using the translation API
 * POST /api/translate
 * TODO: Implement when backend translation endpoint is ready
 */
export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  // TODO: Implement actual API call when backend is ready
  // const response = await fetch(API_BASE_URL + '/translate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request),
  // })
  // return response.json()

  // Mock implementation for now
  return {
    originalText: request.text,
    translatedText: '[Translated: ' + request.text + ']',
    confidence: 0.95,
  }
}

/**
 * Get available category keys
 * Note: This could be moved to a separate /api/categories endpoint
 */
export async function getCategories(): Promise<string[]> {
  // Get all terms and extract unique category keys
  const terms = await getTerms()
  const allCategories = terms.flatMap((t) => t.categoryKeys)
  return Array.from(new Set(allCategories))
}

/**
 * Create a new term
 * POST /api/terms
 */
export async function createTerm(term: Omit<Term, 'id' | 'createdAt' | 'updatedAt'>): Promise<Term> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/terms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
    body: JSON.stringify(term),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to create term: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Update an existing term
 * PUT /api/terms/:id
 */
export async function updateTerm(id: number, term: Omit<Term, 'id' | 'createdAt' | 'updatedAt'>): Promise<Term> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/terms/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
    body: JSON.stringify(term),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to update term: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Delete a term
 * DELETE /api/terms/:id
 */
export async function deleteTerm(id: number): Promise<void> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/terms/' + id, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to delete term: ' + (errorText || response.statusText))
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function loginUser(email: string, password: string): Promise<{ token: string; user: { id: number; email: string; role: string } }> {
  const response = await fetch(API_BASE_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Login failed: ' + (errorText || response.statusText))
  }

  return response.json()
}
