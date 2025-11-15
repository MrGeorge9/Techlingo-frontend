import { createContext, useContext, useState, ReactNode } from 'react'
import type { Language } from '@/lib/types'

interface UIContextType {
  uiLang: Language
  setUiLang: (lang: Language) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLang] = useState<Language>(() => {
    const stored = localStorage.getItem('uiLang') as Language | null
    return stored || 'sk'
  })

  const handleSetUiLang = (lang: Language) => {
    setUiLang(lang)
    localStorage.setItem('uiLang', lang)
  }

  return (
    <UIContext.Provider value={{ uiLang, setUiLang: handleSetUiLang }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
