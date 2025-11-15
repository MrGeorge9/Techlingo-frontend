import { Input } from './Input'
import type { Language } from '@/lib/types'
import { t } from '@/lib/i18n'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  uiLang?: Language
}

export function SearchBar({ value, onChange, placeholder, uiLang = 'sk' }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('search.placeholder', uiLang)}
        className="pl-10"
        aria-label={t('search.placeholder', uiLang)}
      />
    </div>
  )
}
