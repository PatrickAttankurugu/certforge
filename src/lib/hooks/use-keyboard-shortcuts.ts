'use client'

import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  /** Map of option IDs (A, B, C, D, ...) to trigger selection */
  optionIds?: string[]
  /** Called when an option letter key is pressed */
  onSelectOption?: (optionId: string) => void
  /** Called when Enter is pressed */
  onSubmit?: () => void
  /** Called when right arrow or 'n' key is pressed */
  onNext?: () => void
  /** Called when left arrow or 'p' key is pressed */
  onPrevious?: () => void
  /** Whether shortcuts are active */
  enabled?: boolean
}

export function useKeyboardShortcuts({
  optionIds = [],
  onSelectOption,
  onSubmit,
  onNext,
  onPrevious,
  enabled = true,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire when typing in inputs, textareas, or contenteditable elements
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const key = e.key.toUpperCase()

      // Option selection: A, B, C, D, E (case-insensitive)
      if (onSelectOption && optionIds.length > 0) {
        const letterIndex = key.charCodeAt(0) - 65 // A=0, B=1, C=2, D=3
        if (letterIndex >= 0 && letterIndex < optionIds.length && key.length === 1) {
          e.preventDefault()
          onSelectOption(optionIds[letterIndex])
          return
        }
      }

      // Submit: Enter
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault()
        onSubmit()
        return
      }

      // Navigation: Arrow keys or n/p
      if ((e.key === 'ArrowRight' || key === 'N') && onNext) {
        e.preventDefault()
        onNext()
        return
      }
      if ((e.key === 'ArrowLeft' || key === 'P') && onPrevious) {
        e.preventDefault()
        onPrevious()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, optionIds, onSelectOption, onSubmit, onNext, onPrevious])
}
