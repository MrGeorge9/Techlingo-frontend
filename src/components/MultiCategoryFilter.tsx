import { useState } from 'react'
import type { CategoryKey, Language } from '@/lib/types'
import { getCategoryName, t } from '@/lib/i18n'
import { Badge } from './Badge'

interface MultiCategoryFilterProps {
  value: CategoryKey[]
  onChange: (categories: CategoryKey[]) => void
  uiLang?: Language
}

const CATEGORIES: CategoryKey[] = [
  'material',
  'statics',
  'structure',
  'finishing',
  'energy',
  'hvac',
  'other',
]

export function MultiCategoryFilter({ value, onChange, uiLang = 'sk' }: MultiCategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (category: CategoryKey) => {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category))
    } else {
      onChange([...value, category])
    }
  }

  const clearAll = () => {
    onChange([])
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('category.label', uiLang)} {value.length > 0 && `(${value.length})`}
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            {value.length === 0 ? t('category.all', uiLang) : `${value.length} ${t('category.selected', uiLang)}`}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={clearAll}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                {t('category.clearAll', uiLang)}
              </button>
            </div>

            <div className="p-2 space-y-1">
              {CATEGORIES.map((category) => {
                const isSelected = value.includes(category)
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{getCategoryName(category, uiLang)}</span>
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
              })}
            </div>
          </div>
        </>
      )}

      {/* Selected categories display */}
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((category) => (
            <Badge
              key={category}
              variant="primary"
              size="sm"
              className="cursor-pointer hover:opacity-80"
              onClick={() => toggleCategory(category)}
            >
              {getCategoryName(category, uiLang)}
              <svg className="w-3 h-3 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
