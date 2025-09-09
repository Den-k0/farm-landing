import Moon from './icons/Moon'
import Sun from './icons/Sun'

export default function ThemeToggle({ theme, setTheme, userPreferred, setUserPreferred }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        if (e.altKey) {
          setUserPreferred(false)
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setTheme(prefersDark ? 'dark' : 'light')
          return
        }
        setUserPreferred(true)
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
      }}
      className="inline-flex items-center justify-center rounded border border-black/10 dark:border-white/10 h-10 w-10 hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Перемкнути тему (Alt — за системою)"
      aria-pressed={userPreferred ? (theme === 'dark') : undefined}
      title="Перемкнути тему (Alt — за системою)"
    >
      {theme === 'dark' ? (
        <Moon className="h-6 w-6 sm:h-7" />
      ) : (
        <Sun className="h-6 w-6 sm:h-7" />
      )}
    </button>
  )
}
