import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  colors: typeof lightColors
}

const lightColors = {
  background: '#f0f9ff',
  surface: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  primary: '#3b82f6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
}

const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  primary: '#60a5fa',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@epcvina_theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [mode, setModeState] = useState<ThemeMode>('auto')

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (saved) {
        setModeState(saved as ThemeMode)
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const setMode = async (newMode: ThemeMode) => {
    try {
      setModeState(newMode)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const isDark = mode === 'dark' || (mode === 'auto' && systemColorScheme === 'dark')
  const colors = isDark ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
