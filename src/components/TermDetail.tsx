import { Badge } from './Badge'
import type { Term, Language, TranslationDirection } from '@/lib/types'
import { t } from '@/lib/i18n'

interface TermDetailProps {
  term: Term
  uiLang?: Language
  direction?: TranslationDirection
}

export function TermDetail({ term, uiLang = 'sk', direction = 'sk-en' }: TermDetailProps) {
  // Parse direction to get source and target languages
  const [sourceLang, targetLang] = direction.split('-') as [Language, Language]

  // Get translations for the current direction
  const sourceTranslation = term.translations[sourceLang]
  const targetTranslation = term.translations[targetLang]

  // Fallback if translation doesn't exist
  const sourceTerm = sourceTranslation?.term || ''
  const targetTerm = targetTranslation?.term || ''
  const definition = sourceTranslation?.definition || ''
  const exampleUsage = sourceTranslation?.exampleUsage || ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {sourceTerm}
        </h1>
        <p className="text-2xl text-primary-600 dark:text-primary-400">{targetTerm}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('term.definition', uiLang)}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{definition}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('term.example', uiLang)}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 italic">{exampleUsage}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('term.category', uiLang)}
        </h2>
        <div className="flex flex-wrap gap-2">
          {sourceTranslation?.categories.map((categoryName, idx) => (
            <Badge key={idx} variant="primary" size="md">
              {categoryName}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
