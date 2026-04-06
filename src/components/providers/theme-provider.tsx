'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'

export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'rose' | 'cyan'

interface ColorSchemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'blue',
  setColorScheme: () => {},
})

export function useColorScheme() {
  return useContext(ColorSchemeContext)
}

export const COLOR_SCHEMES: { value: ColorScheme; label: string; hue: string }[] = [
  { value: 'blue', label: 'Ocean Blue', hue: '264' },
  { value: 'green', label: 'Emerald', hue: '145' },
  { value: 'purple', label: 'Violet', hue: '300' },
  { value: 'orange', label: 'Amber', hue: '60' },
  { value: 'rose', label: 'Rose', hue: '350' },
  { value: 'cyan', label: 'Teal', hue: '195' },
]

function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('blue')

  useEffect(() => {
    const stored = localStorage.getItem('certforge-color-scheme') as ColorScheme | null
    if (stored && COLOR_SCHEMES.some((s) => s.value === stored)) {
      setColorSchemeState(stored)
      document.documentElement.setAttribute('data-scheme', stored)
    }
  }, [])

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
    localStorage.setItem('certforge-color-scheme', scheme)
    document.documentElement.setAttribute('data-scheme', scheme)
  }

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </NextThemesProvider>
  )
}
