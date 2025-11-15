// Language Management API
import type { LanguageData, CreateLanguageRequest, UpdateLanguageRequest } from './languageTypes'

const API_BASE_URL = '/api'

/**
 * Get all languages
 * GET /api/languages?activeOnly=true
 */
export async function getLanguages(activeOnly = false): Promise<LanguageData[]> {
  const url = API_BASE_URL + '/languages' + (activeOnly ? '?activeOnly=true' : '')
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch languages: ' + response.statusText)
  }

  return response.json()
}

/**
 * Get language by ID
 * GET /api/languages/:id
 */
export async function getLanguageById(id: number): Promise<LanguageData> {
  const response = await fetch(API_BASE_URL + '/languages/' + id)

  if (!response.ok) {
    throw new Error('Failed to fetch language: ' + response.statusText)
  }

  return response.json()
}

/**
 * Get language by code
 * GET /api/languages/code/:code
 */
export async function getLanguageByCode(code: string): Promise<LanguageData> {
  const response = await fetch(API_BASE_URL + '/languages/code/' + code)

  if (!response.ok) {
    throw new Error('Failed to fetch language: ' + response.statusText)
  }

  return response.json()
}

/**
 * Create a new language (admin only)
 * POST /api/languages
 */
export async function createLanguage(request: CreateLanguageRequest): Promise<LanguageData> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/languages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to create language: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Update an existing language (admin only)
 * PUT /api/languages/:id
 */
export async function updateLanguage(id: number, request: UpdateLanguageRequest): Promise<LanguageData> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/languages/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to update language: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Toggle language active status (admin only)
 * PATCH /api/languages/:id/toggle
 */
export async function toggleLanguageStatus(id: number): Promise<LanguageData> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/languages/' + id + '/toggle', {
    method: 'PATCH',
    headers: {
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to toggle language status: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Delete a language (admin only)
 * DELETE /api/languages/:id
 */
export async function deleteLanguage(id: number): Promise<void> {
  const token = localStorage.getItem('token')

  const response = await fetch(API_BASE_URL + '/languages/' + id, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': 'Bearer ' + token })
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to delete language: ' + (errorText || response.statusText))
  }
}
