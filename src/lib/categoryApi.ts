// Category API functions

const API_BASE_URL = '/api'

export interface CategoryTranslation {
  language: string
  name: string
}

export interface Category {
  id?: number
  key: string
  translations: Record<string, CategoryTranslation>
}

export interface CreateCategoryRequest {
  key: string
  translations: Record<string, CategoryTranslation>
}

export interface UpdateCategoryRequest {
  key: string
  translations: Record<string, CategoryTranslation>
}

/**
 * Get all categories
 * GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch categories: ' + response.statusText)
  }

  return response.json()
}

/**
 * Get a single category by ID
 * GET /api/categories/:id
 */
export async function getCategoryById(id: number): Promise<Category> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch category: ' + response.statusText)
  }

  return response.json()
}

/**
 * Create a new category
 * POST /api/categories
 */
export async function createCategory(category: CreateCategoryRequest): Promise<Category> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to create category: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Update an existing category
 * PUT /api/categories/:id
 */
export async function updateCategory(id: number, category: UpdateCategoryRequest): Promise<Category> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to update category: ' + (errorText || response.statusText))
  }

  return response.json()
}

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
export async function deleteCategory(id: number): Promise<void> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error('Failed to delete category: ' + (errorText || response.statusText))
  }
}
