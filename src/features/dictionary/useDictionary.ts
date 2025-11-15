// Hook for managing dictionary state and operations

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Term, TranslationDirection } from '@/lib/types'
import { getTerms } from '@/lib/api'
import { debounce } from '@/lib/utils'

const DEBOUNCE_DELAY = 300

interface UseDictionaryResult {
  terms: Term[]
  loading: boolean
  error: string | null
  query: string
  direction: TranslationDirection
  setQuery: (query: string) => void
  setDirection: (direction: TranslationDirection) => void
}

export function useDictionary(): UseDictionaryResult {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get initial values from URL params
  const initialQuery = searchParams.get('q') || ''
  const initialDirection = (searchParams.get('dir') as TranslationDirection) || 'sk-en'

  // State
  const [terms, setTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQueryState] = useState(initialQuery)
  const [direction, setDirectionState] = useState<TranslationDirection>(initialDirection)

  // Save search to history
  const saveSearchToHistory = (query: string, resultCount: number) => {
    if (!query) return // Don't save empty searches

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const newItem = {
      query,
      timestamp: Date.now(),
      resultCount,
    }

    // Add to beginning and limit to 50 items
    const updated = [newItem, ...history].slice(0, 50)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  // Fetch terms from API
  const fetchTerms = async (
    searchQuery: string,
    searchDirection: TranslationDirection
  ) => {
    setLoading(true)
    setError(null)

    try {
      const results = await getTerms({
        query: searchQuery || undefined,
        direction: searchDirection,
      })
      setTerms(results)

      // Save to history only if there's a query
      if (searchQuery) {
        saveSearchToHistory(searchQuery, results.length)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load terms')
      setTerms([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function - use ref to avoid recreation
  const debouncedSearchRef = useRef(
    debounce((searchQuery: string, searchDirection: TranslationDirection) => {
      fetchTerms(searchQuery, searchDirection)
    }, DEBOUNCE_DELAY)
  )

  // Update URL params when filters change
  const updateSearchParams = useCallback(
    (newQuery: string, newDirection: TranslationDirection) => {
      const params = new URLSearchParams()
      if (newQuery) params.set('q', newQuery)
      if (newDirection !== 'sk-en') params.set('dir', newDirection)
      setSearchParams(params, { replace: true })
    },
    [setSearchParams]
  )

  // Set query and trigger search
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery)
      updateSearchParams(newQuery, direction)
      debouncedSearchRef.current(newQuery, direction)
    },
    [direction, updateSearchParams]
  )

  // Set direction and trigger search
  const setDirection = useCallback(
    (newDirection: TranslationDirection) => {
      setDirectionState(newDirection)
      updateSearchParams(query, newDirection)
      fetchTerms(query, newDirection)
    },
    [query, updateSearchParams]
  )

  // Initial load
  useEffect(() => {
    fetchTerms(query, direction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    terms,
    loading,
    error,
    query,
    direction,
    setQuery,
    setDirection,
  }
}
