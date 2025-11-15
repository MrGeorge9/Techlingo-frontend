import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { TermDetail } from '@/components/TermDetail'
import { getTermById } from '@/lib/api'
import type { Term, Language } from '@/lib/types'
import { t } from '@/lib/i18n'

export function TermPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const uiLang: Language = 'sk'

  const [term, setTerm] = useState<Term | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const fetchTerm = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getTermById(id)
        if (result) {
          setTerm(result)
        } else {
          setError('Term not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load term')
      } finally {
        setLoading(false)
      }
    }

    fetchTerm()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !term) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200 mb-4">
              {error || 'Term not found'}
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              {t('common.back', uiLang)}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('common.back', uiLang)}
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-primary-100 dark:border-primary-900/30 p-8">
          <TermDetail term={term} uiLang={uiLang} />
        </div>
      </div>
    </div>
  )
}
