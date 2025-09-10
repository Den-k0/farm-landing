import Header from '../Header'
import Footer from '../Footer'
import useTheme from '../../hooks/useTheme'

export default function Layout({ children }) {
  const { theme, setTheme, userPreferred, setUserPreferred } = useTheme()
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-emerald-400/30 selection:text-emerald-100 font-sans">
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[35rem] w-[35rem] rounded-full blur-3xl opacity-20 dark:opacity-30 motion-safe:animate-gradient will-change-transform" style={{ backgroundImage: 'linear-gradient(120deg, #10b981, #06b6d4, #7c3aed)', backgroundSize: '200% 200%' }} data-parallax="0.08" />
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-100 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>
      <Header theme={theme} setTheme={setTheme} userPreferred={userPreferred} setUserPreferred={setUserPreferred} />
      <main className="pt-28" id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
