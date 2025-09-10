import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Netlify will replace at build if defined; we rely on process via define shim only, avoid direct reference for ESLint.
const siteRecaptchaKey = (globalThis?.process && globalThis.process.env && globalThis.process.env.SITE_RECAPTCHA_KEY) || ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.SITE_RECAPTCHA_KEY': JSON.stringify(siteRecaptchaKey),
    'process.env': '{}',
  },
})
