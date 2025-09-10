import { useEffect, useRef, useState } from 'react'

/**
 * Hook to encapsulate Google reCAPTCHA v2 (explicit render) logic with dark/light theme re-render.
 * Returns refs & helpers: containerRef (attach div), ready (bool), getToken(), reset(), rerender().
 */
export default function useRecaptcha(siteKey, themeSource = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const loadedRef = useRef(false)
  const renderVersionRef = useRef(0)
  const [ready, setReady] = useState(false)

  const renderCaptcha = () => {
    if (!window.grecaptcha || !containerRef.current || !siteKey) return
    setReady(false)
    while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild)
    const inner = document.createElement('div')
    containerRef.current.appendChild(inner)
    const currentVersion = ++renderVersionRef.current
    try {
      widgetIdRef.current = window.grecaptcha.render(inner, { sitekey: siteKey, theme: themeSource(), callback: () => {}, 'error-callback': () => setReady(false), 'expired-callback': () => setReady(false) })
      setTimeout(() => { if (renderVersionRef.current === currentVersion) setReady(true) }, 60)
    } catch {
      setTimeout(() => { if (renderVersionRef.current === currentVersion && !ready) renderCaptcha() }, 400)
    }
  }

  useEffect(() => {
    const cbName = '__onRecaptchaGlobal'
    if (!window[cbName]) { window[cbName] = () => { loadedRef.current = true; renderCaptcha() } }
    if (window.grecaptcha && window.grecaptcha.render) { loadedRef.current = true; renderCaptcha() }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const obs = new MutationObserver(() => {
      if (!loadedRef.current || !window.grecaptcha) return
      try { if (widgetIdRef.current !== null) window.grecaptcha.reset(widgetIdRef.current) } catch {}
      widgetIdRef.current = null
      renderCaptcha()
    })
    obs.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const getToken = () => window.grecaptcha?.getResponse(widgetIdRef.current) || ''
  const reset = () => { try { if (widgetIdRef.current !== null) window.grecaptcha.reset(widgetIdRef.current) } catch {} }

  return { containerRef, ready, getToken, reset, rerender: renderCaptcha }
}
