'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('verilex-theme', theme)
  window.dispatchEvent(new Event('verilex-theme-change'))
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => { setTheme((localStorage.getItem('verilex-theme') as Theme) || 'dark') }, [])
  const toggle = () => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); applyTheme(next) }
  return <button onClick={toggle} className={compact ? 'w-9 h-9 flex items-center justify-center rounded-lg transition-colors' : 'btn-ghost text-sm'} style={compact ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' } : undefined} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <Moon size={compact ? 14 : 16} /> : <Sun size={compact ? 14 : 16} />} {!compact && <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>}</button>
}

export function ThemeInitializer() {
  useEffect(() => { applyTheme((localStorage.getItem('verilex-theme') as Theme) || 'dark') }, [])
  return null
}
