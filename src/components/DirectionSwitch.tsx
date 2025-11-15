import { useState, useEffect } from 'react'
import type { Language, TranslationDirection } from '@/lib/types'
import type { LanguageData } from '@/lib/languageTypes'
import { t } from '@/lib/i18n'
import { getLanguages } from '@/lib/languageApi'

interface DirectionSwitchProps {
  value: TranslationDirection
  onChange: (direction: TranslationDirection) => void
  uiLang?: Language
}

export function DirectionSwitch({ value, onChange, uiLang = 'sk' }: DirectionSwitchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [availableDirections, setAvailableDirections] = useState<TranslationDirection[]>([])
  const [directionsMap, setDirectionsMap] = useState<Record<string, { from: LanguageData; to: LanguageData }>>({})
  const [loading, setLoading] = useState(true)

  // Load active languages and generate translation directions
  useEffect(() => {
    const loadDirections = async () => {
      try {
        const languages = await getLanguages(true)

        const directions: TranslationDirection[] = []
        const map: Record<string, { from: LanguageData; to: LanguageData }> = {}

        for (const from of languages) {
          for (const to of languages) {
            if (from.code !== to.code) {
              const direction = `${from.code}-${to.code}`
              directions.push(direction)
              map[direction] = { from, to }
            }
          }
        }

        setAvailableDirections(directions)
        setDirectionsMap(map)

        if (directions.length > 0 && !directions.includes(value)) {
          onChange(directions[0])
        }
      } catch (error) {
        console.error('Failed to load languages for directions:', error)
        setAvailableDirections(['sk-en', 'en-sk'])
      } finally {
        setLoading(false)
      }
    }

    loadDirections()
  }, [])

  const selectDirection = (direction: TranslationDirection) => {
    onChange(direction)
    setIsOpen(false)
  }

  const getDirectionLabel = (direction: TranslationDirection): string => {
    const mapping = directionsMap[direction]
    if (mapping) {
      return `${mapping.from.flag || mapping.from.code.toUpperCase()} → ${mapping.to.flag || mapping.to.code.toUpperCase()}`
    }

    const [from, to] = direction.split('-')
    return `${from?.toUpperCase()} → ${to?.toUpperCase()}`
  }

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('direction.label', uiLang)}
        </label>
        <div className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="animate-pulse h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('direction.label', uiLang)}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            {getDirectionLabel(value)}
          </span>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            <div className="p-2 space-y-1">
              {availableDirections.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Žiadne smery prekladu</div>
              ) : (
                availableDirections.map((direction) => {
                  const isSelected = value === direction
                  return (
                    <button
                      key={direction}
                      onClick={() => selectDirection(direction)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{getDirectionLabel(direction)}</span>
                      {isSelected && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}