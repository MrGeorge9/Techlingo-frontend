import { useState, useEffect } from 'react'
import type { LanguageData, CreateLanguageRequest, UpdateLanguageRequest } from '../lib/languageTypes'
import { Button } from './Button'
import { Input } from './Input'

interface LanguageFormProps {
  language?: LanguageData | null
  onSubmit: (data: CreateLanguageRequest | UpdateLanguageRequest) => Promise<void>
  onCancel: () => void
}

export function LanguageForm({ language, onSubmit, onCancel }: LanguageFormProps) {
  const [formData, setFormData] = useState<CreateLanguageRequest>({
    code: '',
    name: '',
    nativeName: '',
    flag: '',
    isActive: true,
    displayOrder: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (language) {
      setFormData({
        code: language.code,
        name: language.name,
        nativeName: language.nativeName || '',
        flag: language.flag || '',
        isActive: language.isActive,
        displayOrder: language.displayOrder,
      })
    }
  }, [language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (language) {
        // Editing - send only updated fields (exclude code)
        const updateData: UpdateLanguageRequest = {
          name: formData.name,
          nativeName: formData.nativeName || undefined,
          flag: formData.flag || undefined,
          isActive: formData.isActive,
          displayOrder: formData.displayOrder,
        }
        await onSubmit(updateData)
      } else {
        // Creating - send all fields
        await onSubmit(formData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save language')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Language Code *
        </label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
          placeholder="e.g., sk, en, de"
          required
          disabled={!!language} // Cannot edit code
          pattern="[a-z]{2,10}"
          title="2-10 lowercase letters only"
        />
        <p className="text-xs text-gray-500 mt-1">
          {language ? 'Language code cannot be changed' : '2-10 lowercase letters (e.g., sk, en, de, fr)'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Language Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Slovak, English"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Native Name
        </label>
        <Input
          value={formData.nativeName}
          onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
          placeholder="e.g., Slovenčina, English"
        />
        <p className="text-xs text-gray-500 mt-1">Language name in its own language</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Flag Emoji
        </label>
        <Input
          value={formData.flag}
          onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
          placeholder="e.g., 🇸🇰, 🇬🇧"
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">Optional flag emoji or icon</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Order
        </label>
        <Input
          type="number"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
          min="0"
        />
        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : language ? 'Update Language' : 'Create Language'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
