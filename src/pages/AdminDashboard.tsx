import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { TermFormDynamic as TermForm } from '@/components/TermFormDynamic'
import { CategoryForm } from '@/components/CategoryForm'
import { LanguageForm } from '@/components/LanguageForm'
import { LanguageManagement } from '@/components/LanguageManagement'
import { Badge } from '@/components/Badge'
import { Input } from '@/components/Input'
import type { Term } from '@/lib/types'
import type { LanguageData, CreateLanguageRequest, UpdateLanguageRequest } from '@/lib/languageTypes'
import { getTerms, createTerm, updateTerm, deleteTerm } from '@/lib/api'
import { getLanguages, createLanguage, updateLanguage } from '@/lib/languageApi'
import { removeDiacritics } from '@/lib/utils'
import type { Category } from '@/lib/categoryApi'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categoryApi'

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Terms state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)
  const [terms, setTerms] = useState<Term[]>([])
  const [filteredTerms, setFilteredTerms] = useState<Term[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Categories state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Languages state
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
  const [showEditLanguageModal, setShowEditLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null)
  const [languages, setLanguages] = useState<LanguageData[]>([])
  const [languagesCount, setLanguagesCount] = useState(0)


  // General state
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'terms' | 'categories' | 'languages'>('terms')

  // Load data on mount
  useEffect(() => {
    loadTerms()
    loadLanguages()
    loadCategories()
  }, [])

  // Filter terms based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTerms(terms)
    } else {
      const normalizedQuery = removeDiacritics(searchQuery).toLowerCase()
      const filtered = terms.filter((term) => {
        // Search across all language translations
        return Object.values(term.translations).some((translation) => {
          return (
            removeDiacritics(translation.term || '').toLowerCase().includes(normalizedQuery) ||
            removeDiacritics(translation.definition || '').toLowerCase().includes(normalizedQuery) ||
            removeDiacritics(translation.exampleUsage || '').toLowerCase().includes(normalizedQuery)
          )
        })
      })
      setFilteredTerms(filtered)
    }
  }, [searchQuery, terms])

  const loadTerms = async () => {
    setLoading(true)
    try {
      const allTerms = await getTerms()
      setTerms(allTerms)
      setFilteredTerms(allTerms)
    } catch (error) {
      console.error('Failed to load terms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddTerm = async (newTerm: Omit<Term, 'id'>) => {
    try {
      const createdTerm = await createTerm(newTerm)
      setTerms([...terms, createdTerm])
      setShowAddModal(false)
      setSuccessMessage('Termín bol úspešne pridaný!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadTerms()
    } catch (error) {
      console.error('Failed to create term:', error)
      alert('Chyba pri vytváraní termínu: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleEditTerm = async (updatedTerm: Omit<Term, 'id'>) => {
    if (!selectedTerm) return

    try {
      const updated = await updateTerm(selectedTerm.id, updatedTerm)
      setTerms(terms.map((t) => (t.id === updated.id ? updated : t)))
      setShowEditModal(false)
      setSelectedTerm(null)
      setSuccessMessage('Termín bol úspešne upravený!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadTerms()
    } catch (error) {
      console.error('Failed to update term:', error)
      alert('Chyba pri úprave termínu: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleDeleteTerm = async (termId: number) => {
    if (!confirm('Naozaj chcete vymazať tento termín?')) return

    try {
      await deleteTerm(termId)
      setTerms(terms.filter((t) => t.id !== termId))
      setSuccessMessage('Termín bol úspešne vymazaný!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to delete term:', error)
      alert('Chyba pri mazaní termínu: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const openEditModal = (term: Term) => {
    setSelectedTerm(term)
    setShowEditModal(true)
  }

  // Load categories
  const loadCategories = async () => {
    try {
      const allCategories = await getCategories()
      setCategories(allCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  // Category management functions
  const handleAddCategory = async (newCategory: Omit<Category, 'id'>) => {
    try {
      await createCategory(newCategory)
      setShowAddCategoryModal(false)
      setSuccessMessage('Kategória bola úspešne pridaná!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadCategories()
    } catch (error) {
      console.error('Failed to create category:', error)
      alert('Chyba pri vytváraní kategórie: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleEditCategory = async (updatedCategory: Omit<Category, 'id'>) => {
    if (!selectedCategory || !selectedCategory.id) return

    try {
      await updateCategory(selectedCategory.id, updatedCategory)
      setShowEditCategoryModal(false)
      setSelectedCategory(null)
      setSuccessMessage('Kategória bola úspešne upravená!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadCategories()
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('Chyba pri úprave kategórie: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Naozaj chcete vymazať túto kategóriu?')) return

    try {
      await deleteCategory(categoryId)
      setSuccessMessage('Kategória bola úspešne vymazaná!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Chyba pri mazaní kategórie: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const openEditCategoryModal = (category: Category) => {
    setSelectedCategory(category)
    setShowEditCategoryModal(true)
  }

  

  const loadLanguages = async () => {
    try {
      const langs = await getLanguages(false)
      setLanguages(langs)
      setLanguagesCount(langs.length)
    } catch (error) {
      console.error('Failed to load languages:', error)
    }
  }

  const handleAddLanguage = async (newLanguage: CreateLanguageRequest) => {
    try {
      await createLanguage(newLanguage)
      setShowAddLanguageModal(false)
      setSuccessMessage('Jazyk bol úspešne pridaný!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadLanguages()
    } catch (error) {
      console.error('Failed to create language:', error)
      alert('Chyba pri vytváraní jazyka: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const handleEditLanguage = async (updatedLanguage: UpdateLanguageRequest) => {
    if (!selectedLanguage) return
    try {
      await updateLanguage(selectedLanguage.id, updatedLanguage)
      setShowEditLanguageModal(false)
      setSelectedLanguage(null)
      setSuccessMessage('Jazyk bol úspešne upravený!')
      setTimeout(() => setSuccessMessage(''), 3000)
      await loadLanguages()
    } catch (error) {
      console.error('Failed to update language:', error)
      alert('Chyba pri úprave jazyka: ' + (error instanceof Error ? error.message : 'Neznáma chyba'))
    }
  }

  const openEditLanguageModal = (language: LanguageData) => {
    setSelectedLanguage(language)
    setShowEditLanguageModal(true)
  }

return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        {/* Header */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/logo-light.png"
                alt="Tech Lingo"
                className="h-10 dark:hidden"
              />
              <img
                src="/assets/logo-dark.png"
                alt="Tech Lingo"
                className="h-10 hidden dark:block"
              />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">|</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Prihlásený: <span className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</span>
              </div>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Hlavná stránka
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Odhlásiť sa
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Spravujte termíny a kategórie slovníka
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Celkom termínov</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{terms.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pridané dnes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kategórie</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{categories.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jazyky</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{languagesCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'terms'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Termíny ({terms.length})
            </button>

            <button
              onClick={() => setActiveTab('languages')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'languages'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Jazyky ({languagesCount})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Kategórie ({categories.length})
            </button>
          </div>
        </div>

        {/* Terms Tab */}
        {activeTab === 'terms' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Zoznam termínov
                </h2>
                <Button
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Pridať termín</span>
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Hľadať termín..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredTerms.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery ? 'Žiadne výsledky vyhľadávania' : 'Zatiaľ neboli pridané žiadne termíny'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Pridať prvý termín
                  </Button>
                )}
              </div>
              ) : (
                <div className="space-y-4">
                  {filteredTerms.map((term) => (
                  <div
                    key={term.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {term.translations.sk?.term || ''}
                          </h3>
                          <span className="text-gray-400">→</span>
                          <p className="text-gray-600 dark:text-gray-400">{term.translations.en?.term || ''}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {term.translations.sk?.definition || term.translations.en?.definition || 'Žiadna definícia'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {term.translations.sk?.categories.map((categoryName, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {categoryName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => openEditModal(term)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Upraviť"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTerm(term.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Vymazať"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Správa kategórií
                </h2>
                <Button
                  variant="primary"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Pridať kategóriu</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Zatiaľ neboli pridané žiadne kategórie
                  </p>
                  <Button variant="primary" onClick={() => setShowAddCategoryModal(true)}>
                    Pridať prvú kategóriu
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const count = terms.filter((t) => t.categoryKeys.includes(cat.key as any)).length
                    return (
                      <div
                        key={cat.key}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {cat.translations?.sk?.name || cat.translations?.en?.name || cat.key}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Kľúč: {cat.key}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {Object.entries(cat.translations || {}).map(([lang, trans]) => (
                                <span key={lang} className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {lang.toUpperCase()}: {trans.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="primary" size="sm">
                            {count} {count === 1 ? 'termín' : count < 5 ? 'termíny' : 'termínov'}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              title="Upraviť"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => cat.id && handleDeleteCategory(cat.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Vymazať"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <Card>
            <CardHeader>
              <LanguageManagement
                onLanguageAdded={loadLanguages}
                onLanguageUpdated={loadLanguages}
                onLanguageDeleted={loadLanguages}
                onOpenAddModal={() => setShowAddLanguageModal(true)}
                onOpenEditModal={openEditLanguageModal}
              />
            </CardHeader>
          </Card>
        )}

      </div>

      {/* Add Term Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Pridať nový termín"
        size="lg"
      >
        <TermForm onSubmit={handleAddTerm} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Term Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTerm(null)
        }}
        title="Upraviť termín"
        size="lg"
      >
        {selectedTerm && (
          <TermForm
            term={selectedTerm}
            onSubmit={handleEditTerm}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedTerm(null)
            }}
          />
        )}
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        title="Pridať novú kategóriu"
        size="lg"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowAddCategoryModal(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditCategoryModal}
        onClose={() => {
          setShowEditCategoryModal(false)
          setSelectedCategory(null)
        }}
        title="Upraviť kategóriu"
        size="lg"
      >
        {selectedCategory && (
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleEditCategory}
            onCancel={() => {
              setShowEditCategoryModal(false)
              setSelectedCategory(null)
            }}
          />
        )}
      </Modal>

      {/* Add Language Modal */}
      <Modal
        isOpen={showAddLanguageModal}
        onClose={() => setShowAddLanguageModal(false)}
        title="Pridať nový jazyk"
        size="lg"
      >
        <LanguageForm
          onSubmit={handleAddLanguage}
          onCancel={() => setShowAddLanguageModal(false)}
        />
      </Modal>

      {/* Edit Language Modal */}
      <Modal
        isOpen={showEditLanguageModal}
        onClose={() => {
          setShowEditLanguageModal(false)
          setSelectedLanguage(null)
        }}
        title="Upraviť jazyk"
        size="lg"
      >
        {selectedLanguage && (
          <LanguageForm
            language={selectedLanguage}
            onSubmit={handleEditLanguage}
            onCancel={() => {
              setShowEditLanguageModal(false)
              setSelectedLanguage(null)
            }}
          />
        )}
      </Modal>

    </div>
    </>
  )
}
