import { useEffect, useState } from 'react'

// useTheme: manages light/dark theme; persists explicit user choice and syncs with system when no user override.
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [userPreferred, setUserPreferred] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('theme') !== null
  })

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    body.classList.toggle('dark', isDark)
  }, [theme])

  useEffect(() => {
    if (userPreferred) localStorage.setItem('theme', theme)
    else localStorage.removeItem('theme')
  }, [theme, userPreferred])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => { if (!userPreferred) setTheme(e.matches ? 'dark' : 'light') }
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    return () => { if (mql.removeEventListener) mql.removeEventListener('change', onChange); else mql.removeListener(onChange) }
  }, [userPreferred])

  return { theme, setTheme, userPreferred, setUserPreferred }
}
