export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-black/5 dark:border-white/10 py-10 text-sm text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>© {year} ФГ «Калина Лошнівська»</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#about" className="hover:text-black dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Про нас</a>
          <a href="#contact" className="hover:text-black dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded">Контакти</a>
          <a
            href="https://www.instagram.com/kalynaloshnivska?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="hover:text-black dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61575513316816"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="hover:text-black dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.6V12H10v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1V8h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
