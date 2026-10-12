import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isAdmin: boolean
}

const WEBSITE_STORAGE_KEY = 'lee_car_theme'
const ADMIN_STORAGE_KEY = 'lee_car_admin_theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Website customer theme: defaults to 'dark'
  const [websiteTheme, setWebsiteThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(WEBSITE_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // ignore
    }
    return 'dark'
  })

  // Admin dashboard theme: defaults to 'light'
  const [adminTheme, setAdminThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // ignore
    }
    return 'light'
  })

  const currentTheme: Theme = isAdmin ? adminTheme : websiteTheme

  // Synchronize DOM data-theme attribute whenever current theme or route section changes
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', currentTheme)
      document.documentElement.style.colorScheme = currentTheme
    } catch (err) {
      console.warn('Error applying theme attribute:', err)
    }
  }, [currentTheme, isAdmin])

  const setTheme = (newTheme: Theme) => {
    if (isAdmin) {
      setAdminThemeState(newTheme)
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, newTheme)
      } catch (err) {
        console.warn('Error saving admin theme to localStorage:', err)
      }
    } else {
      setWebsiteThemeState(newTheme)
      try {
        localStorage.setItem(WEBSITE_STORAGE_KEY, newTheme)
      } catch (err) {
        console.warn('Error saving website theme to localStorage:', err)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme, isAdmin }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

