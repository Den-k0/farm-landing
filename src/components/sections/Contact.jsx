import { useState, useRef, useEffect, useCallback } from 'react'
import { contacts as contactsData } from '../../data/contacts'
import useTheme from '../../hooks/useTheme'
import { encode, validateContact } from '../../utils/form'

const RECAPTCHA_SITE_KEY = import.meta.env.SITE_RECAPTCHA_KEY

export default function Contact() {
  // Ensure theme side-effects (class toggling) run, value itself not needed here
  useTheme()
  // --- FORM STATE ---
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  // --- RECAPTCHA STATE (old model) ---
  const captchaRef = useRef(null)
  const captchaIdRef = useRef(null)
  const recaptchaLoadedRef = useRef(false)
  const renderVersionRef = useRef(0)
  const [captchaReady, setCaptchaReady] = useState(false)
  const readyRef = useRef(false)
  const lastDomThemeRef = useRef(null)

  const getDomTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

  const performRender = useCallback(() => {
    if (!window.grecaptcha || !captchaRef.current) return
    if (!RECAPTCHA_SITE_KEY) { console.warn('Missing SITE_RECAPTCHA_KEY (ensure it is set)'); return }
    const domTheme = getDomTheme()
    setCaptchaReady(false); readyRef.current = false
    while (captchaRef.current.firstChild) captchaRef.current.removeChild(captchaRef.current.firstChild)
    const inner = document.createElement('div')
    // give inner a unique id each time to avoid any internal caching quirks
    inner.id = `recaptcha-inner-${Date.now()}-${Math.random().toString(36).slice(2)}`
    captchaRef.current.appendChild(inner)
    const currentVersion = ++renderVersionRef.current
    console.debug('[reCAPTCHA] render v', currentVersion, 'theme=', domTheme)
    try {
      captchaIdRef.current = window.grecaptcha.render(inner, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: domTheme,
        callback: () => {},
        'error-callback': () => setStatus({ type: 'error', msg: 'Помилка reCAPTCHA. Спробуйте ще.' }),
        'expired-callback': () => setStatus({ type: 'error', msg: 'reCAPTCHA прострочена. Підтвердьте ще раз.' })
      })
      setTimeout(() => { if (renderVersionRef.current === currentVersion) { setCaptchaReady(true); readyRef.current = true } }, 60)
    } catch { /* ignore render error, retry below */ }
    // retry if still not ready after short delay
    setTimeout(() => { if (renderVersionRef.current === currentVersion && !readyRef.current) performRender() }, 400)
  }, [])

  const initialRender = useCallback(() => {
    if (!window.grecaptcha || !captchaRef.current || captchaIdRef.current !== null) return
    performRender()
  }, [performRender])

  // Script load -> first render
  useEffect(() => {
    const prev = window.onRecaptchaLoad
    window.onRecaptchaLoad = () => {
      if (typeof prev === 'function') { try { prev() } catch { /* ignore previous callback error */ } }
      recaptchaLoadedRef.current = true
      console.debug('[reCAPTCHA] script loaded')
      initialRender()
      lastDomThemeRef.current = getDomTheme()
    }
    if (window.grecaptcha && window.grecaptcha.render) {
      recaptchaLoadedRef.current = true
      console.debug('[reCAPTCHA] script already present')
      initialRender()
      lastDomThemeRef.current = getDomTheme()
    }
  }, [initialRender])

  // Observe actual DOM class changes to trigger re-render AFTER class switched.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentDomTheme = getDomTheme()
      if (currentDomTheme === lastDomThemeRef.current) return
      lastDomThemeRef.current = currentDomTheme
      if (!recaptchaLoadedRef.current || !window.grecaptcha) return
      console.debug('[reCAPTCHA] detected DOM theme change =>', currentDomTheme, 'rebuilding widget')
      if (captchaIdRef.current !== null) {
        try { window.grecaptcha.reset(captchaIdRef.current) } catch { /* ignore */ }
        captchaIdRef.current = null
      }
      requestAnimationFrame(() => setTimeout(() => performRender(), 0))
    })
    const html = document.documentElement
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [performRender])

  // --- FORM HANDLERS ---
  const onChange = (field) => (e) => setFormState(s => ({ ...s, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (Date.now() - lastSubmitTime < 3000) return
    setStatus({ type: null, msg: '' })
    const validationError = validateContact(formState)
    if (validationError) { setStatus({ type: 'error', msg: validationError }); return }
    const token = window.grecaptcha?.getResponse(captchaIdRef.current)
    if (!token) { setStatus({ type: 'error', msg: 'Підтвердьте reCAPTCHA.' }); return }
    setSubmitting(true)
    setStatus({ type: 'info', msg: 'Надсилання…' })
    const formData = { 'form-name': 'contact', 'g-recaptcha-response': token, ...formState, pageUrl: window.location.href }
    try {
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode(formData) })
      if (response.ok) {
        setStatus({ type: 'success', msg: 'Повідомлення надіслано.' })
        setFormState({ firstName: '', lastName: '', email: '', message: '' })
        if (window.grecaptcha && captchaIdRef.current !== null) { try { window.grecaptcha.reset(captchaIdRef.current) } catch { /* ignore */ } }
        setLastSubmitTime(Date.now())
      } else throw new Error('Network error')
    } catch { setStatus({ type: 'error', msg: 'Помилка при надсиланні. Спробуйте ще раз.' }) }
    finally { setSubmitting(false) }
  }

  return (
    <section id="contact" className="relative py-24 scroll-mt-24" aria-labelledby="contact-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 id="contact-title" className="text-3xl sm:text-4xl font-extrabold">Контакти</h2>
            <p className="mt-3 text-neutral-700 dark:text-neutral-300">Запитання, партнерства чи співпраця — будемо раді звʼязку.</p>
            <div className="mt-6 space-y-2 text-neutral-700 dark:text-neutral-300">
              <div>Юридична адреса: 46133, Тернопільська обл., Тернопільський р-н, с. Лошнів, вул. Центральна, 43, оф. 1</div>
              <div>Код ЄДРПОУ: 37625021</div>
              <div>Ел. пошта: <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href="mailto:kaluna.loshniv@ukr.net">kaluna.loshniv@ukr.net</a>, <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href="mailto:agroprogrester@ukr.net">agroprogrester@ukr.net</a></div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              {contactsData.map(({ name, position, phone }) => (
                <div key={name} className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">
                  <div className="font-medium">{position}</div>
                  <div>{name} — <a className="underline hover:text-emerald-600 dark:hover:text-emerald-400" href={`tel:${phone}`}>{phone}</a></div>
                </div>
              ))}
            </div>
          </div>
          <form
            name="contact"
            aria-labelledby="contact-form-title"
            data-netlify="true"
            data-netlify-recaptcha="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur p-6 space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Не заповнюйте це поле: <input name="bot-field" onChange={() => {}} /></label></p>
            <h3 id="contact-form-title" className="text-xl font-semibold">Напишіть нам</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Залиште свої контакти та повідомлення — ми відповімо.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Імʼя *" name="firstName" value={formState.firstName} onChange={onChange('firstName')} required />
              <input className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Прізвище" name="lastName" value={formState.lastName} onChange={onChange('lastName')} />
            </div>
            <input className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Email *" name="email" type="email" value={formState.email} onChange={onChange('email')} required />
            <textarea rows={4} className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Повідомлення *" name="message" value={formState.message} onChange={onChange('message')} required maxLength={2000} />
            <div ref={captchaRef} id="recaptcha-container" className="min-h-[78px] pt-1" aria-label="reCAPTCHA" />
            {status.type && <div role="status" aria-live="polite" className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : status.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{status.msg}</div>}
            <button disabled={submitting || !captchaReady} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500/90 hover:dark:bg-emerald-400 text-white dark:text-neutral-900 py-3 font-semibold transition">
              {submitting ? 'Надсилання…' : 'Надіслати'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
