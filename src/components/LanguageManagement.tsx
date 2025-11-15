import { useState, useEffect } from 'react'
import type { LanguageData, CreateLanguageRequest, UpdateLanguageRequest } from '../lib/languageTypes'
import { getLanguages, createLanguage, updateLanguage, deleteLanguage, toggleLanguageStatus } from '../lib/languageApi'
import { Button } from './Button'
import { Badge } from './Badge'

interface LanguageManagementProps {
  onLanguageAdded?: () => void
  onLanguageUpdated?: () => void
  onLanguageDeleted?: () => void
  onOpenAddModal: () => void
  onOpenEditModal: (language: LanguageData) => void
}

export function LanguageManagement({
  onLanguageAdded,
  onLanguageUpdated,
  onLanguageDeleted,
  onOpenAddModal,
  onOpenEditModal
}: LanguageManagementProps) {
  const [languages, setLanguages] = useState<LanguageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLanguages()
  }, [])

  const loadLanguages = async () => {
    setLoading(true)
    try {
      const langs = await getLanguages(false) // Get all languages, not just active
      setLanguages(langs)
    } catch (error) {
      console.error('Failed to load languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const updatedLanguage = await toggleLanguageStatus(id)
      setLanguages(languages.map(lang => lang.id === id ? updatedLanguage : lang))
      if (onLanguageUpdated) onLanguageUpdated()
    } catch (error) {
      console.error('Failed to toggle language status:', error)
      alert('Chyba pri zmene stavu jazyka: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Naozaj chcete vymazať jazyk "${code}"? Túto akciu nie je možné vrátiť späť.`)) {
      return
    }

    try {
      await deleteLanguage(id)
      setLanguages(languages.filter(lang => lang.id !== id))
      if (onLanguageDeleted) onLanguageDeleted()
    } catch (error) {
      console.error('Failed to delete language:', error)
      alert('Chyba pri mazaní jazyka: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Správa jazykov
        </h2>
        <Button
          variant="primary"
          onClick={onOpenAddModal}
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Pridať jazyk</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : languages.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Zatiaľ neboli pridané žiadne jazyky
          </p>
          <Button variant="primary" onClick={onOpenAddModal}>
            Pridať prvý jazyk
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-2xl">
                  {lang.flag || '🌐'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {lang.name}
                    </h3>
                    {lang.nativeName && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400">{lang.nativeName}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Kód: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{lang.code}</span>
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Poradie: {lang.displayOrder}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={lang.isActive ? 'success' : 'default'} size="sm">
                  {lang.isActive ? 'Aktívny' : 'Neaktívny'}
                </Badge>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(lang.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    title={lang.isActive ? 'Deaktivovať' : 'Aktivovať'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onOpenEditModal(lang)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Upraviť"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(lang.id, lang.code)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Vymazať"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
