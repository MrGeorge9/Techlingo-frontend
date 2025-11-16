import { useState, useEffect, FormEvent } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import type { Term, CategoryKey } from '@/lib/types'
import type { LanguageData } from '@/lib/languageTypes'
import { getLanguages } from '@/lib/languageApi'

interface TermFormProps {
  term?: Term
  onSubmit: (term: Omit<Term, 'id'>) => void
  onCancel: () => void
}

const CATEGORIES: CategoryKey[] = ['material', 'statics', 'structure', 'finishing', 'energy', 'hvac', 'other']

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  material: 'Materiály',
  statics: 'Statika',
  structure: 'Konštrukcie',
  finishing: 'Povrchové úpravy',
  energy: 'Energia',
  hvac: 'Vzduchotechnika',
  other: 'Ostatné',
}

export function TermFormDynamic({ term, onSubmit, onCancel }: TermFormProps) {
  const [activeLanguages, setActiveLanguages] = useState<LanguageData[]>([])
  const [loadingLanguages, setLoadingLanguages] = useState(true)
  const [activeTabLang, setActiveTabLang] = useState<string>('sk')

  const [formData, setFormData] = useState<{
    slug: string
    categoryKeys: CategoryKey[]
    translations: Record<string, { term: string; definition: string; exampleUsage: string; categories: string[] }>
  }>({
    slug: term?.slug || '',
    categoryKeys: term?.categoryKeys || [] as CategoryKey[],
    translations: term?.translations || {},
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load active languages
  useEffect(() => {
    const loadActiveLanguages = async () => {
      try {
        const langs = await getLanguages(true) // Get only active languages
        setActiveLanguages(langs)
        if (langs.length > 0 && !activeTabLang) {
          setActiveTabLang(langs[0].code)
        }
      } catch (error) {
        console.error('Failed to load languages:', error)
        // Fallback to default languages
        setActiveLanguages([
          { id: 1, code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', isActive: true, displayOrder: 1 },
          { id: 2, code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isActive: true, displayOrder: 2 },
        ])
        setActiveTabLang('sk')
      } finally {
        setLoadingLanguages(false)
      }
    }

    loadActiveLanguages()
  }, [])

  const handleTranslationChange = (langCode: string, field: 'term' | 'definition' | 'exampleUsage', value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langCode]: {
          ...(prev.translations[langCode] || { term: '', definition: '', exampleUsage: '', categories: [] }),
          [field]: value,
        },
      },
    }))

    // Clear error when user starts typing
    const errorKey = `${langCode}_${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const toggleCategory = (cat: CategoryKey) => {
    const newCategories = formData.categoryKeys.includes(cat)
      ? formData.categoryKeys.filter((c) => c !== cat)
      : [...formData.categoryKeys, cat]
    setFormData((prev) => ({ ...prev, categoryKeys: newCategories }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Validate that at least one language has data
    const hasAnyTranslation = activeLanguages.some(lang => {
      const trans = formData.translations[lang.code]
      return trans && trans.term && trans.definition
    })

    if (!hasAnyTranslation) {
      newErrors.general = 'Vyplňte aspoň jeden jazyk'
    }

    // Validate slug
    if (!formData.slug.trim()) {
      // Auto-generate slug from first available term
      const firstLang = activeLanguages.find(lang => formData.translations[lang.code]?.term)
      if (firstLang) {
        const slug = formData.translations[firstLang.code].term
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        setFormData((prev) => ({ ...prev, slug }))
      } else {
        newErrors.slug = 'Slug je povinný'
      }
    }

    if (formData.categoryKeys.length === 0) {
      newErrors.categoryKeys = 'Vyberte aspoň jednu kategóriu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Build translations with category labels
    const translations: Record<string, any> = {}
    activeLanguages.forEach(lang => {
      const trans = formData.translations[lang.code]
      translations[lang.code] = {
        term: trans?.term || '',
        definition: trans?.definition || '',
        exampleUsage: trans?.exampleUsage || '',
        categories: formData.categoryKeys.map(key => CATEGORY_LABELS[key])
      }
    })

    const termData: Omit<Term, 'id'> = {
      slug: formData.slug,
      categoryKeys: formData.categoryKeys,
      translations,
    }

    onSubmit(termData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      {/* Slug Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Slug (URL identifikátor)
        </label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="napr. zelezobeton"
          className={errors.slug ? 'border-red-500' : ''}
        />
        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Ponechaj prázdne pre automatické generovanie
        </p>
      </div>

      {/* Language Tabs */}
      {!loadingLanguages && activeLanguages.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 overflow-x-auto">
            {activeLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveTabLang(lang.code)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTabLang === lang.code
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {lang.flag} {lang.nativeName || lang.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Language-specific fields */}
      {loadingLanguages ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        activeLanguages.map((lang) => (
          <div
            key={lang.code}
            className={activeTabLang === lang.code ? 'space-y-4' : 'hidden'}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Termín ({lang.name})
              </label>
              <Input
                value={formData.translations[lang.code]?.term || ''}
                onChange={(e) => handleTranslationChange(lang.code, 'term', e.target.value)}
                placeholder={`Zadajte termín v jazyku ${lang.name}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Definícia ({lang.name})
              </label>
              <textarea
                value={formData.translations[lang.code]?.definition || ''}
                onChange={(e) => handleTranslationChange(lang.code, 'definition', e.target.value)}
                placeholder={`Zadajte definíciu v jazyku ${lang.name}`}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Príklad použitia ({lang.name})
              </label>
              <textarea
                value={formData.translations[lang.code]?.exampleUsage || ''}
                onChange={(e) => handleTranslationChange(lang.code, 'exampleUsage', e.target.value)}
                placeholder={`Zadajte príklad v jazyku ${lang.name}`}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        ))
      )}

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kategórie *
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.categoryKeys.includes(cat)
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        {errors.categoryKeys && <p className="text-red-500 text-xs mt-1">{errors.categoryKeys}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {term ? 'Uložiť zmeny' : 'Pridať termín'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Zrušiť
        </Button>
      </div>
    </form>
  )
}
