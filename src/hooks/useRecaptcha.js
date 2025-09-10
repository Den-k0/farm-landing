import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Google reCAPTCHA v2 explicit render hook with theme re-render + debug.
 */
export default function useRecaptcha(siteKey, themeSource = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const loadedRef = useRef(false)
  const renderVersionRef = useRef(0)
  const attemptRef = useRef(0)
  const readyRef = useRef(false)
  const lastThemeRef = useRef(null)
  const [ready, setReady] = useState(false)

  const setReadySafe = (v) => { readyRef.current = v; setReady(v) }

  const debug = (msg, extra) => { if (typeof window !== 'undefined') console.log('[reCAPTCHA]', msg, extra || '') }

  const renderCaptcha = useCallback(() => {
    if (!siteKey) { debug('Abort: empty siteKey'); return }
    if (!window.grecaptcha) { debug('Abort: grecaptcha not ready'); return }
    if (!containerRef.current) { debug('Abort: container missing'); return }

    const currentTheme = themeSource()
    lastThemeRef.current = currentTheme

    setReadySafe(false)
    while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild)
    const inner = document.createElement('div')
    inner.setAttribute('data-recaptcha-inner', 'true')
    containerRef.current.appendChild(inner)
    const currentVersion = ++renderVersionRef.current
    const attempt = ++attemptRef.current
    debug('Render attempt', { attempt, version: currentVersion, theme: currentTheme })
    try {
      widgetIdRef.current = window.grecaptcha.render(inner, {
        sitekey: siteKey,
        theme: currentTheme,
        callback: () => { debug('Solved callback') },
        'error-callback': () => { debug('Error callback'); setReadySafe(false) },
        'expired-callback': () => { debug('Expired callback'); setReadySafe(false) }
      })
      setTimeout(() => {
        if (renderVersionRef.current === currentVersion) {
          const iframe = containerRef.current?.querySelector('iframe')
          if (iframe) { setReadySafe(true); debug('Render success (iframe present)', { attempt }) }
          else { debug('Iframe not found yet; scheduling retry', { attempt }); setTimeout(() => { if (renderVersionRef.current === currentVersion && !readyRef.current) renderCaptcha() }, 400) }
        }
      }, 80)
    } catch (err) {
      debug('Render exception', err)
      setTimeout(() => { if (renderVersionRef.current === currentVersion && !readyRef.current) renderCaptcha() }, 500)
    }
  }, [siteKey, themeSource])

  // Load bridge or immediate render
  useEffect(() => {
    const cbName = '__onRecaptchaGlobal'
    if (!window[cbName]) { window[cbName] = () => { debug('Global onload callback'); loadedRef.current = true; renderCaptcha() }; debug('Registered global callback placeholder') }
    if (window.grecaptcha && window.grecaptcha.render) { debug('grecaptcha already present; rendering immediately'); loadedRef.current = true; renderCaptcha() }
    else { const t = setTimeout(() => { if (!window.grecaptcha) debug('Still no grecaptcha after 2000ms') }, 2000); return () => clearTimeout(t) }
  }, [renderCaptcha])

  // Watch theme changes via class mutation.
  useEffect(() => {
    const html = document.documentElement
    const obs = new MutationObserver(() => {
      if (!loadedRef.current || !window.grecaptcha) return
      const newTheme = themeSource()
      if (newTheme === lastThemeRef.current) return // prevent unnecessary re-render
      try { if (widgetIdRef.current !== null) window.grecaptcha.reset(widgetIdRef.current) } catch (err) { debug('Reset error', err) }
      widgetIdRef.current = null
      debug('Theme change detected; re-rendering', { newTheme, prev: lastThemeRef.current })
      renderCaptcha()
    })
    obs.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [renderCaptcha, themeSource])

  const getToken = () => window.grecaptcha?.getResponse(widgetIdRef.current) || ''
  const reset = () => { try { if (widgetIdRef.current !== null) window.grecaptcha.reset(widgetIdRef.current); renderCaptcha() } catch (err) { debug('Reset manual error', err) } }

  return { containerRef, ready, getToken, reset, rerender: renderCaptcha }
}
