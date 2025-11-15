// Language Management types (for dynamic language support)

export interface LanguageData {
  id: number
  code: string
  name: string
  nativeName?: string
  flag?: string
  isActive: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateLanguageRequest {
  code: string
  name: string
  nativeName?: string
  flag?: string
  isActive?: boolean
  displayOrder?: number
}

export interface UpdateLanguageRequest {
  name?: string
  nativeName?: string
  flag?: string
  isActive?: boolean
  displayOrder?: number
}
