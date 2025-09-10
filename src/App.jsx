import { useEffect, useState, useRef } from 'react'
import logo from './assets/logo.svg'
import useTheme from './hooks/useTheme'
import { galleryImages } from './data/gallery'
import { kpis } from './data/stats'
import { contacts as contactsData } from './data/contacts'
import Header from './components/Header'

// Use only SITE_RECAPTCHA_KEY as per documentation (injected via vite.config.js define)
const RECAPTCHA_SITE_KEY = import.meta.env.SITE_RECAPTCHA_KEY

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme, userPreferred, setUserPreferred } = useTheme()
  const livestockImage = '/photo_pigs.jpeg'
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const captchaRef = useRef(null)
  const captchaIdRef = useRef(null)
  const [captchaReady, setCaptchaReady] = useState(false)

  // Мінімальна версія: одноразове створення віджета. Без перерендеру при зміні теми. Додаємо захист від дублювання.
  const renderCaptchaOnce = () => {
    if (!captchaRef.current) return
    // Якщо віджет вже всередині (Google додає елемент з класом g-recaptcha)
    if (captchaRef.current.querySelector('.g-recaptcha')) {
      if (!captchaReady) setCaptchaReady(true)
      return
    }
    if (captchaIdRef.current !== null) return
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('[reCAPTCHA] Відсутній SITE_RECAPTCHA_KEY')
      return
    }
    if (!window.grecaptcha || !window.grecaptcha.render) return
    try {
      captchaIdRef.current = window.grecaptcha.render(captchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: theme === 'dark' ? 'dark' : 'light',
        callback: () => {},
        'error-callback': () => setStatus({ type: 'error', msg: 'Помилка reCAPTCHA. Спробуйте ще.' }),
        'expired-callback': () => setStatus({ type: 'error', msg: 'reCAPTCHA прострочена. Підтвердьте ще раз.' }),
      })
      setCaptchaReady(true)
    } catch (e) {
      console.error('[reCAPTCHA] Помилка рендеру', e)
    }
  }

  useEffect(() => {
    window.onRecaptchaLoad = () => {
      renderCaptchaOnce()
    }
    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptchaOnce()
    }
  }, [])

  useEffect(() => {
    if (!window.grecaptcha || !captchaRef.current) return
    if (captchaIdRef.current === null) return
    setCaptchaReady(false)
    const oldNode = captchaRef.current
    const parent = oldNode.parentNode
    if (!parent) return
    parent.removeChild(oldNode)
    const newNode = document.createElement('div')
    newNode.id = 'recaptcha-container'
    newNode.className = 'pt-1'
    captchaRef.current = newNode
    const submitBtn = parent.querySelector('button[type="submit"]')
    if (submitBtn) {
      parent.insertBefore(newNode, submitBtn)
    } else {
      parent.appendChild(newNode)
    }
    captchaIdRef.current = null
    setTimeout(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        renderCaptchaOnce()
      }
    }, 60)
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

  // Інші useEffect та код залишаються незмінними
  // ... (решта вашого коду)

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-emerald-400/30 selection:text-emerald-100 font-sans">
      {/* Background layers: visible in both themes (lighter in light) */}
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        {/* animated gradient blob */}
        <div
          className="absolute -top-40 -left-40 h-[35rem] w-[35rem] rounded-full blur-3xl opacity-20 dark:opacity-30 motion-safe:animate-gradient will-change-transform"
          style={{ backgroundImage: 'linear-gradient(120deg, #10b981, #06b6d4, #7c3aed)', backgroundSize: '200% 200%' }}
          data-parallax="0.08"
        />
        {/* subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-100 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <Header theme={theme} setTheme={setTheme} userPreferred={userPreferred} setUserPreferred={setUserPreferred} />

      <main className="pt-28">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="relative z-10">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium tracking-widest uppercase">Фермерське господарство</p>
                <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="text-gradient">«Калина Лошнівська»</span>
                </h1>
                <p className="mt-5 text-neutral-600 dark:text-neutral-300 max-w-xl">
                  Сучасне багатопрофільне підприємство, що поєднує рослинництво та тваринництво. Засноване у 2011 році в селі Лошнів Теребовлянської громади.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#about" className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-semibold shadow-[0_0_30px_#10b981]/40 transition">Дізнатися більше</a>
                  <a href="#contact" className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition">Контакти</a>
                </div>
                {/* KPI cards */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
                  {kpis.map(({ id, stat, label }) => (
                    <div key={id} className="rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-4 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">{stat}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero image */}
              <div className="relative flex items-center justify-center">
                <img
                  src={logo}
                  alt="Логотип ФГ «Калина Лошнівська»"
                  className="w-full h-auto max-w-[28rem] sm:max-w-[34rem] lg:max-w-[40rem] animate-float"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="relative py-24 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-8">Про нас</h2>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <p>
                Фермерське Господарство «Калина Лошнівська» знаходиться в селі Лошнів Теребовлянської громади. Свою діяльність розпочало у 2011 році та було створено сімʼєю Стечишин — Аллою Василівною та Андрієм Володимировичем. Керівник господарства — Стечишин Алла Василівна.
              </p>
              <p>
                Господарство обробляє понад 5000 гектарів земель у селах Лошнів, Сущин, Остальці (Теребовлянська громада) та Завадівка, Гончарівка, Садове, Коропець, Тростянці, Устя-Зелене, Коржова, Межигірʼя, Маркова, Бобрівники (Монастирищина).
              </p>
              <p>
                Ми впроваджуємо сучасні аграрні технології, дбаємо про родючість ґрунтів та якість продукції, розвиваємо тваринництво й підтримуємо громади.
              </p>
            </div>
          </div>
        </section>

        {/* Crops */}
        <section id="crops" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Рослинництво</h2>
            <p className="text-neutral-700 dark:text-neutral-300 max-w-3xl">
              На наших полях вирощуються зернові (пшениця, ячмінь, кукурудза), бобові та олійні культури. Використовуємо якісне насіння, точне внесення та системи збереження родючості, що забезпечують стабільно високі врожаї.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ['Зернові', 'Пшениця, ячмінь, кукурудза — основа продовольчої безпеки.'],
                ['Олійні', 'Соняшник та ріпак із контролем якості на кожному етапі.'],
                ['Бобові', 'Покращення структури ґрунту та сівозміни.'],
                ['Сучасна техніка', 'ПАР, диференційоване внесення, GPS-моніторинг.'],
                ['Збереження ґрунтів', 'Мульчування, мінімальний обробіток, сидерати.'],
                ['Логістика', 'Раціональні ланцюги від поля до складу.'],
              ].map(([title, desc]) => (
                <div key={title} className="group relative rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-6 overflow-hidden">
                  <h3 className="font-semibold text-black dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Livestock */}
        <section id="livestock" className="relative py-24 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Тваринництво</h2>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Господарство активно розвиває свинарство — понад 7 000 голів свиней датської генетики. У власності — два сучасні свинокомплекси у селах Лошнів та Сущин. Ми забезпечуємо оптимальні умови вирощування, збалансоване харчування та ветеринарний супровід.
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• 2 свинокомплекси (Лошнів, Сущин)</li>
                  <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• 7000+ голів</li>
                  <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Контроль якості та біобезпека</li>
                  <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Ветеринарний супровід</li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur overflow-hidden shadow-2xl">
                  <img
                    src={livestockImage}
                    alt="Свинарство та виробничі потужності"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10">
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-600/15 dark:ring-emerald-500/20 blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social responsibility */}
        <section id="social" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Соціальна відповідальність</h2>
            <p className="text-neutral-700 dark:text-neutral-300 max-w-3xl">
              Ми активно підтримуємо громади та захисників України: допомога ЗСУ та волонтерам, ремонт та облаштування інфраструктури, підтримка освіти, спорту й культурних ініціатив. Загалом надано понад 12 млн грн допомоги та гуманітарки.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Підтримка ЗСУ та волонтерських ініціатив</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Гуманітарна допомога громадам</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Ремонт доріг і соціальних обʼєктів</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Підтримка освіти, спорту та молоді</li>
            </ul>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold">Фото</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((src, i) => (
                <div key={src} className="group rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur overflow-hidden">
                  <div className="aspect-[4/3] bg-neutral-200/50 dark:bg-neutral-800/50">
                    <img
                      src={src}
                      alt={`Фото ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative py-24 scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold">Контакти</h2>
                <p className="mt-3 text-neutral-700 dark:text-neutral-300">Запитання, партнерства чи співпраця — будемо раді звʼязку.</p>
                <div className="mt-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                  <div>
                    Юридична адреса: 46133, Тернопільська обл., Тернопільський р-н, с. Лошнів, вул. Центральна, 43, оф. 1
                  </div>
                  <div>Код ЄДРПОУ: 37625021</div>
                  <div>
                    Ел. пошта:
                    {' '}
                    <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href="mailto:kaluna.loshniv@ukr.net">kaluna.loshniv@ukr.net</a>
                    {', '}
                    <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href="mailto:agroprogrester@ukr.net">agroprogrester@ukr.net</a>
                  </div>
                </div>

                {/* Key contacts */}
                <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                  {contactsData.map(({ name, position, phone }) => (
                    <div key={name} className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">
                      <div className="font-medium">{position}</div>
                      <div>{name} — <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href={`tel:${phone}`}>{phone}</a></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: form card with heading inside */}
              <form
                name="contact"
                data-netlify="true"
                data-netlify-recaptcha="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur p-6 space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Не заповнюйте це поле:{' '}
                    <input name="bot-field" onChange={() => {}} />
                  </label>
                </p>
                <h3 className="text-xl font-semibold">Напишіть нам</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Залиште свої контакти та повідомлення — ми відповімо.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400"
                    placeholder="Імʼя *"
                    name="firstName"
                    value={formState.firstName}
                    onChange={(e)=>setFormState({...formState, firstName: e.target.value})}
                    required
                  />
                  <input
                    className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400"
                    placeholder="Прізвище"
                    name="lastName"
                    value={formState.lastName}
                    onChange={(e)=>setFormState({...formState, lastName: e.target.value})}
                  />
                </div>
                <input
                  className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400"
                  placeholder="Email *"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={(e)=>setFormState({...formState, email: e.target.value})}
                  required
                />
                <textarea
                  rows={4}
                  className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400"
                  placeholder="Повідомлення *"
                  name="message"
                  value={formState.message}
                  onChange={(e)=>setFormState({...formState, message: e.target.value})}
                  required
                  maxLength={2000}
                />
                {/* reCAPTCHA БЛОК: НЕ РУХАТИ ЧЕРЕЗ JS. Повинен бути БЕЗПОСЕРЕДНЬО НАД кнопкою */}
                <div className="recaptcha-wrapper">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Захист reCAPTCHA</div>
                  <div
                    ref={captchaRef}
                    id="recaptcha-container"
                    className="min-h-[78px] flex items-center justify-start"
                    aria-label="reCAPTCHA"
                  >
                    {!RECAPTCHA_SITE_KEY && (
                      <div className="text-xs text-red-600 dark:text-red-400">Немає ключа SITE_RECAPTCHA_KEY</div>
                    )}
                    {RECAPTCHA_SITE_KEY && !captchaReady && (
                      <div className="animate-pulse h-10 w-64 rounded bg-neutral-200 dark:bg-neutral-700" />
                    )}
                  </div>
                </div>
                <button
                  disabled={submitting || !captchaReady}
                  aria-disabled={submitting || !captchaReady}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500/90 hover:dark:bg-emerald-400 text-white dark:text-neutral-900 py-3 font-semibold transition"
                >
                  {submitting ? 'Надсилання…' : 'Надіслати'}
                </button>
                {status.type && (
                  <div role="status" aria-live="polite" className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : status.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{status.msg}</div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-black/5 dark:border-white/10 py-10 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ФГ «Калина Лошнівська»</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-black dark:hover:text-white">Про нас</a>
            <a href="#contact" className="hover:text-black dark:hover:text-white">Контакти</a>
            {/* Socials */}
            <a
              href="https://www.instagram.com/kalynaloshnivska?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="hover:text-black dark:hover:text-white"
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
              className="hover:text-black dark:hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.6V12H10v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1V8h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
