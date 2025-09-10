import { useState, useRef, useEffect } from 'react'
import { contacts as contactsData } from '../../data/contacts'

const RECAPTCHA_SITE_KEY = import.meta.env.SITE_RECAPTCHA_KEY

export default function Contact() {
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const [submitting, setSubmitting] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)
  const captchaRef = useRef(null)
  const captchaIdRef = useRef(null)
  const recaptchaLoadedRef = useRef(false)
  const renderVersionRef = useRef(0)

  const performRender = () => {
    if (!window.grecaptcha || !captchaRef.current || !RECAPTCHA_SITE_KEY) return
    setCaptchaReady(false)
    while (captchaRef.current.firstChild) captchaRef.current.removeChild(captchaRef.current.firstChild)
    const inner = document.createElement('div')
    captchaRef.current.appendChild(inner)
    const currentVersion = ++renderVersionRef.current
    try {
      captchaIdRef.current = window.grecaptcha.render(inner, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        callback: () => {},
        'error-callback': () => setStatus({ type: 'error', msg: 'Помилка reCAPTCHA. Спробуйте ще.' }),
        'expired-callback': () => setStatus({ type: 'error', msg: 'reCAPTCHA прострочена. Підтвердьте ще раз.' })
      })
      setTimeout(() => { if (renderVersionRef.current === currentVersion) setCaptchaReady(true) }, 50)
    } catch (e) {
      setTimeout(() => { if (renderVersionRef.current === currentVersion && !captchaReady) performRender() }, 400)
    }
  }

  useEffect(() => {
    window.onRecaptchaLoadContact = () => {
      recaptchaLoadedRef.current = true
      performRender()
    }
    if (window.grecaptcha && window.grecaptcha.render) {
      recaptchaLoadedRef.current = true
      performRender()
    }
  }, [])

  // Підтримка переключення теми (MutationObserver на клас html)
  useEffect(() => {
    const html = document.documentElement
    const obs = new MutationObserver(() => {
      if (!recaptchaLoadedRef.current || !window.grecaptcha) return
      if (captchaIdRef.current !== null) {
        try { window.grecaptcha.reset(captchaIdRef.current) } catch {}
        captchaIdRef.current = null
      }
      performRender()
    })
    obs.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const encode = (data) => Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&')

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
    const formData = { 'form-name': 'contact', 'g-recaptcha-response': token, ...formState, pageUrl: window.location.href }
    try {
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode(formData) })
      if (response.ok) {
        setStatus({ type: 'success', msg: 'Повідомлення надіслано.' })
        setFormState({ firstName: '', lastName: '', email: '', message: '' })
        if (window.grecaptcha && captchaIdRef.current !== null) window.grecaptcha.reset(captchaIdRef.current)
      } else throw new Error('Network error')
    } catch {
      setStatus({ type: 'error', msg: 'Помилка при надсиланні. Спробуйте ще раз.' })
    } finally { setSubmitting(false) }
  }

  return (
    <section id="contact" className="relative py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Контакти</h2>
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
            data-netlify="true"
            data-netlify-recaptcha="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur p-6 space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Не заповнюйте це поле: <input name="bot-field" onChange={() => {}} /></label></p>
            <h3 className="text-xl font-semibold">Напишіть нам</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Залиште свої контакти та повідомлення — ми відповімо.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Імʼя *" name="firstName" value={formState.firstName} onChange={e=>setFormState({...formState, firstName:e.target.value})} required />
              <input className="rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Прізвище" name="lastName" value={formState.lastName} onChange={e=>setFormState({...formState, lastName:e.target.value})} />
            </div>
            <input className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Email *" name="email" type="email" value={formState.email} onChange={e=>setFormState({...formState, email:e.target.value})} required />
            <textarea rows={4} className="w-full rounded-lg bg-white border border-black/5 dark:bg-white/5 dark:border-white/10 px-4 py-3 outline-none placeholder:text-neutral-400" placeholder="Повідомлення *" name="message" value={formState.message} onChange={e=>setFormState({...formState, message:e.target.value})} required maxLength={2000} />
            <div ref={captchaRef} id="recaptcha-container" className="min-h-[78px] pt-1" aria-label="reCAPTCHA" />
            {status.type && <div role="status" aria-live="polite" className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : status.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{status.msg}</div>}
            <button disabled={submitting || !captchaReady} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500/90 hover:dark:bg-emerald-400 text-white dark:text-neutral-900 py-3 font-semibold transition">{submitting ? 'Надсилання…' : 'Надіслати'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
