import { useState, useEffect, FormEvent } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import type { Category, CategoryTranslation } from '@/lib/categoryApi'
import type { LanguageData } from '@/lib/languageTypes'
import { getLanguages } from '@/lib/languageApi'

interface CategoryFormProps {
  category?: Category
  onSubmit: (category: Omit<Category, 'id'>) => void
  onCancel: () => void
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [languages, setLanguages] = useState<LanguageData[]>([])
  const [loadingLanguages, setLoadingLanguages] = useState(true)
  const [formData, setFormData] = useState<{
    key: string
    translations: Record<string, CategoryTranslation>
  }>({
    key: category?.key || '',
    translations: category?.translations || {},
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load active languages on mount
  useEffect(() => {
    const loadActiveLanguages = async () => {
      try {
        const activeLanguages = await getLanguages(true)
        setLanguages(activeLanguages)

        // Initialize empty translations for all active languages if creating new category
        if (!category) {
          const emptyTranslations: Record<string, CategoryTranslation> = {}
          activeLanguages.forEach((lang) => {
            emptyTranslations[lang.code] = {
              language: lang.code,
              name: '',
            }
          })
          setFormData(prev => ({
            ...prev,
            translations: emptyTranslations
          }))
        }
      } catch (error) {
        console.error('Failed to load languages:', error)
      } finally {
        setLoadingLanguages(false)
      }
    }
    loadActiveLanguages()
  }, [category])

  const handleKeyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, key: value }))
    // Clear error when user starts typing
    if (errors.key) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.key
        return newErrors
      })
    }
  }

  const handleTranslationChange = (langCode: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langCode]: {
          language: langCode,
          name: name,
        },
      },
    }))

    // Clear error for this language
    if (errors[`translation_${langCode}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`translation_${langCode}`]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Validate key
    if (!formData.key.trim()) {
      newErrors.key = 'Kľúč kategórie je povinný'
    } else if (!/^[a-z0-9_-]+$/.test(formData.key)) {
      newErrors.key = 'Kľúč môže obsahovať iba malé písmená, čísla, pomlčky a podčiarkovníky'
    }

    // Validate that at least one translation has a name
    const hasAtLeastOneName = Object.values(formData.translations).some(
      (translation) => translation.name.trim() !== ''
    )

    if (!hasAtLeastOneName) {
      newErrors.general = 'Aspoň jeden názov musí byť vyplnený'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Filter out empty translations before submitting
    const filledTranslations: Record<string, CategoryTranslation> = {}
    Object.entries(formData.translations).forEach(([lang, trans]) => {
      if (trans.name.trim() !== '') {
        filledTranslations[lang] = trans
      }
    })

    onSubmit({
      key: formData.key,
      translations: filledTranslations,
    })
  }

  if (loadingLanguages) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General error */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Key */}
      <div>
        <Input
          label="Kľúč kategórie *"
          value={formData.key}
          onChange={(e) => handleKeyChange(e.target.value)}
          placeholder="material"
          error={errors.key}
          required
          disabled={!!category} // Disable key editing when editing existing category
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL-friendly identifikátor (iba malé písmená, čísla, pomlčky)
        </p>
      </div>

      {/* Translations for each active language */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Názvy kategórie v rôznych jazykoch *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          Vyplňte názov aspoň v jednom jazyku
        </p>

        <div className="grid grid-cols-1 gap-4">
          {languages.map((lang) => (
            <div key={lang.code} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                {lang.flag && <span className="text-2xl mr-2">{lang.flag}</span>}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {lang.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({lang.code.toUpperCase()})
                </span>
              </div>
              <Input
                value={formData.translations[lang.code]?.name || ''}
                onChange={(e) => handleTranslationChange(lang.code, e.target.value)}
                placeholder={`Názov v jazyku ${lang.name.toLowerCase()}`}
                error={errors[`translation_${lang.code}`]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Zrušiť
        </Button>
        <Button type="submit" variant="primary">
          {category ? 'Uložiť zmeny' : 'Pridať kategóriu'}
        </Button>
      </div>
    </form>
  )
}
