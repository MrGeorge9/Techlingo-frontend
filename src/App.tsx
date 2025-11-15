import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { TermPage } from './pages/TermPage'
import { Exercises } from './pages/Exercises'
import { Login } from './pages/Login'
import { AdminDashboard } from './pages/AdminDashboard'
import { t } from './lib/i18n'
import { useDarkMode } from './hooks/useDarkMode'
import { UIProvider, useUI } from './contexts/UIContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function Navigation() {
  const location = useLocation()
  const { theme, toggleTheme } = useDarkMode()
  const { uiLang, setUiLang } = useUI()
  const { isAdmin } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">
            <Link
              to="/"
              className="flex items-center transition-all hover:scale-105 hover:opacity-90"
            >
              <img
                src="/assets/logo-light.png"
                alt="Tech Lingo"
                className="h-12 dark:hidden"
              />
              <img
                src="/assets/logo-dark.png"
                alt="Tech Lingo"
                className="h-12 hidden dark:block"
              />
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link
                to="/"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                }`}
              >
                {t('nav.dictionary', uiLang)}
              </Link>
              <Link
                to="/exercises"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/exercises')
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                }`}
              >
                {t('nav.exercises', uiLang)}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setUiLang('sk')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  uiLang === 'sk'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                SK
              </button>
              <button
                onClick={() => setUiLang('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  uiLang === 'en'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            {/* Public routes with navigation */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                  <Navigation />
                  <Home />
                </div>
              }
            />
            <Route
              path="/term/:id"
              element={
                <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                  <Navigation />
                  <TermPage />
                </div>
              }
            />
            <Route
              path="/exercises"
              element={
                <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                  <Navigation />
                  <Exercises />
                </div>
              }
            />

            {/* Auth routes without navigation */}
            <Route path="/login" element={<Login />} />

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
