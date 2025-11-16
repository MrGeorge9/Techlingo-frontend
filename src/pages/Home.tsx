import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { DirectionSwitch } from '@/components/DirectionSwitch'
import { TermCard } from '@/components/TermCard'
import { TermDetail } from '@/components/TermDetail'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/EmptyState'
import { useDictionary } from '@/features/dictionary/useDictionary'
import type { Term } from '@/lib/types'
import { t, getTermCountText } from '@/lib/i18n'
import { useUI } from '@/contexts/UIContext'

export function Home() {
  const { uiLang } = useUI()
  const {
    terms,
    loading,
    error,
    query,
    direction,
    setQuery,
    setDirection,
  } = useDictionary()

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)

  const handleTermClick = (term: Term) => {
    setSelectedTerm(term)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/assets/logo-light.png"
              alt="Tech Lingo"
              className="h-20 dark:hidden"
            />
            <img
              src="/assets/logo-dark.png"
              alt="Tech Lingo"
              className="h-20 hidden dark:block"
            />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-xl font-medium max-w-2xl mx-auto">
            {t('common.tagline', uiLang)}
          </p>
        </div>

        <div className="mb-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('search.title', uiLang)}</h2>
            </div>
            <div className="space-y-5">
              <SearchBar value={query} onChange={setQuery} uiLang={uiLang} />
              <div className="max-w-md">
                <DirectionSwitch value={direction} onChange={setDirection} uiLang={uiLang} />
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading terms...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && terms.length === 0 && (
          <EmptyState
            icon={
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title={t('search.noResults', uiLang)}
            description={t('search.noResultsDesc', uiLang)}
          />
        )}

        {!loading && !error && terms.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('search.results', uiLang)}
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                {terms.length} {getTermCountText(terms.length, uiLang)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terms.map((term) => (
                <TermCard key={term.id} term={term} onClick={handleTermClick} direction={direction} />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={selectedTerm !== null}
        onClose={() => setSelectedTerm(null)}
        title={selectedTerm?.translations?.sk?.term || selectedTerm?.translations?.en?.term || ''}
        size="lg"
      >
        {selectedTerm && <TermDetail term={selectedTerm} uiLang={uiLang} direction={direction} />}
      </Modal>
    </div>
  )
}
