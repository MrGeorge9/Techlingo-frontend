import { Link } from 'react-router-dom'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'
import type { Term, Language, TranslationDirection } from '@/lib/types'

interface TermCardProps {
  term: Term
  onClick?: (term: Term) => void
  direction?: TranslationDirection
}

export function TermCard({ term, onClick, direction = 'sk-en' }: TermCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(term)
    }
  }

  // Parse direction to get source and target languages
  const [sourceLang, targetLang] = direction.split('-') as [Language, Language]

  // Get translations for the current direction
  const sourceTranslation = term.translations[sourceLang]
  const targetTranslation = term.translations[targetLang]

  // Fallback if translation doesn't exist
  const sourceTerm = sourceTranslation?.term || ''
  const targetTerm = targetTranslation?.term || ''
  const definition = sourceTranslation?.definition || ''

  const content = (
    <Card hover className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {sourceTerm}
          </h3>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <p className="text-base font-semibold text-primary-600 dark:text-primary-400">{targetTerm}</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {definition}
        </p>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          {sourceTranslation?.categories.map((categoryName, idx) => (
            <Badge key={idx} variant="default" size="sm">
              {categoryName}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (onClick) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {content}
      </div>
    )
  }

  return <Link to={`/term/${term.id}`}>{content}</Link>
}
