'use client'

import { useTheme } from 'next-themes'
import { useColorScheme, COLOR_SCHEMES, type ColorScheme } from '@/components/providers/theme-provider'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const SCHEME_COLORS: Record<ColorScheme, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-violet-500',
  orange: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-teal-500',
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const { colorScheme, setColorScheme } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Mode toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent/50 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {/* Color scheme dots */}
        <div className="flex items-center gap-1">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => setColorScheme(scheme.value)}
              className={cn(
                'h-4 w-4 rounded-full transition-all',
                SCHEME_COLORS[scheme.value],
                colorScheme === scheme.value
                  ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                  : 'opacity-50 hover:opacity-80'
              )}
              aria-label={scheme.label}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dark/Light/System mode */}
      <div>
        <p className="text-sm font-medium mb-2">Appearance</p>
        <div className="flex gap-2">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Monitor, label: 'System' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                theme === value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Color scheme */}
      <div>
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Color Scheme
        </p>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => setColorScheme(scheme.value)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all',
                colorScheme === scheme.value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              <span className={cn('h-3.5 w-3.5 rounded-full shrink-0', SCHEME_COLORS[scheme.value])} />
              {scheme.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
