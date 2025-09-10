import { useEffect, useState, useRef } from 'react'
import logo from './assets/logo.svg'
import useTheme from './hooks/useTheme'
import Header from './components/Header'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Crops from './components/sections/Crops'
import Livestock from './components/sections/Livestock'
import Social from './components/sections/Social'
import Gallery from './components/sections/Gallery'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'

// Use only SITE_RECAPTCHA_KEY as per documentation (injected via vite.config.js define)
const RECAPTCHA_SITE_KEY = import.meta.env.SITE_RECAPTCHA_KEY

function App() {
  const { theme, setTheme, userPreferred, setUserPreferred } = useTheme()
  const livestockImage = '/photo_pigs.jpeg'
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const captchaRef = useRef(null)
  const captchaIdRef = useRef(null)
  const [captchaReady, setCaptchaReady] = useState(false)
  const recaptchaLoadedRef = useRef(false)
  const renderVersionRef = useRef(0)

  // Базовий одноразовий рендер (викликається після завантаження скрипта)
  const initialRender = () => {
    if (!window.grecaptcha || !captchaRef.current || captchaIdRef.current !== null) return
    performRender()
  }

  const performRender = () => {
    if (!window.grecaptcha || !captchaRef.current) return
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('Missing SITE_RECAPTCHA_KEY (ensure it is set)')
      return
    }
    setCaptchaReady(false)
    // Очищаємо контейнер повністю (iframe старої капчі може залишатись, тому видаляємо дітей)
    while (captchaRef.current.firstChild) captchaRef.current.removeChild(captchaRef.current.firstChild)
    const inner = document.createElement('div')
    captchaRef.current.appendChild(inner)
    const currentVersion = ++renderVersionRef.current
    try {
      captchaIdRef.current = window.grecaptcha.render(inner, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: theme === 'dark' ? 'dark' : 'light',
        callback: () => {},
        'error-callback': () => setStatus({ type: 'error', msg: 'Помилка reCAPTCHA. Спробуйте ще.' }),
        'expired-callback': () => setStatus({ type: 'error', msg: 'reCAPTCHA прострочена. Підтвердьте ще раз.' })
      })
      // Невелика пауза щоб iframe вставився, тоді ставимо готовність
      setTimeout(() => {
        if (renderVersionRef.current === currentVersion) setCaptchaReady(true)
      }, 50)
    } catch (e) {
      console.warn('reCAPTCHA render error', e)
      // Повтор через 400 мс якщо ще актуальна версія і не готово
      setTimeout(() => {
        if (renderVersionRef.current === currentVersion && !captchaReady) performRender()
      }, 400)
    }
  }

  // Завантаження скрипта -> перший рендер
  useEffect(() => {
    window.onRecaptchaLoad = () => {
      recaptchaLoadedRef.current = true
      initialRender()
    }
    if (window.grecaptcha && window.grecaptcha.render) {
      recaptchaLoadedRef.current = true
      initialRender()
    }
  }, [])

  // Перебудова при зміні теми (Google не підтримує live switch, тому повна перебудова)
  useEffect(() => {
    if (!recaptchaLoadedRef.current) return
    if (!window.grecaptcha) return
    // Скидаємо токен попередньої теми
    if (captchaIdRef.current !== null) {
      try { window.grecaptcha.reset(captchaIdRef.current) } catch {}
      captchaIdRef.current = null
    }
    performRender()
  }, [theme])

  const encode = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    
    setStatus({ type: null, msg: '' })
    const { firstName, email, message } = formState
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', msg: 'Заповніть обовʼязкові поля.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', msg: 'Некоректний email.' })
      return
    }
    
    const token = window.grecaptcha?.getResponse(captchaIdRef.current)
    if (!token) {
      setStatus({ type: 'error', msg: 'Підтвердьте reCAPTCHA.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'info', msg: 'Надсилання…' })

    const formData = {
      'form-name': 'contact',
      'g-recaptcha-response': token,
      ...formState,
      pageUrl: window.location.href
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(formData)
      })

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Повідомлення надіслано.' })
        setFormState({ firstName: '', lastName: '', email: '', message: '' })
        if (window.grecaptcha && captchaIdRef.current !== null) {
          window.grecaptcha.reset(captchaIdRef.current)
        }
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Помилка при надсиланні. Спробуйте ще раз.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-emerald-400/30 selection:text-emerald-100 font-sans">
      {/* Background layers */}
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 h-[35rem] w-[35rem] rounded-full blur-3xl opacity-20 dark:opacity-30 motion-safe:animate-gradient will-change-transform"
          style={{ backgroundImage: 'linear-gradient(120deg, #10b981, #06b6d4, #7c3aed)', backgroundSize: '200% 200%' }}
          data-parallax="0.08"
        />
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-100 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <Header theme={theme} setTheme={setTheme} userPreferred={userPreferred} setUserPreferred={setUserPreferred} />

      <main className="pt-28">
        <Hero />
        <About />
        <Crops />
        <Livestock />
        <Social />
        <Gallery />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
