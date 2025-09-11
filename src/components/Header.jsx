import { useState } from 'react'
import logo from '../assets/logo.svg'
import ThemeToggle from './ThemeToggle'

export default function Header({ theme, setTheme, userPreferred, setUserPreferred }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/40 border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">
          <img src={logo} alt="ФГ «Калина Лошнівська»" className="hidden sm:block h-12 w-auto drop-shadow" />
          <span className="font-semibold tracking-wide">ФГ «Калина Лошнівська»</span>
        </a>
        <nav aria-label="Основна навігація" className="hidden md:flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
          <a href="#about" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Про нас</a>
          <a href="#crops" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Рослинництво</a>
          <a href="#livestock" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Тваринництво</a>
          <a href="#social" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Соцвідповідальність</a>
          <a href="#gallery" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Фото</a>
          <a href="#contact" className="hover:text-black dark:hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Контакти</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} userPreferred={userPreferred} setUserPreferred={setUserPreferred} />
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            aria-label="Меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 backdrop-blur" role="dialog" aria-label="Мобільна навігація">
          <div className="px-4 py-3 space-y-2">
            <a href="#about" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Про нас</a>
            <a href="#crops" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Рослинництво</a>
            <a href="#livestock" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Тваринництво</a>
            <a href="#social" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Соцвідповідальність</a>
            <a href="#gallery" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Фото</a>
            <a href="#contact" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Контакти</a>
          </div>
        </div>
      )}
    </header>
  )
}
