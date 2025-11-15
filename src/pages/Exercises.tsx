import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import type { Language } from '@/lib/types'
import { t } from '@/lib/i18n'

export function Exercises() {
  const uiLang: Language = 'sk'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            {t('exercises.title', uiLang)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('exercises.description', uiLang)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <EmptyState
            icon={
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
            title={t('exercises.comingSoon', uiLang)}
            description="Pripravujeme pre vás interaktívne cvičenia na precvičovanie stavebnej terminológie. Funkčnosť bude dostupná v budúcich verziách."
            action={
              <Link to="/">
                <Button variant="primary">{t('nav.dictionary', uiLang)}</Button>
              </Link>
            }
          />

          {/* Placeholder for future features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                TODO: Flashcards
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Precvičujte si termíny pomocou kartičiek
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                TODO: Quiz
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Otestujte svoje znalosti v kvíze
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                TODO: Matching
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Priraďte termíny k ich prekladom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
