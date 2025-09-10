import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Load environment variables (Netlify provides process.env.* at build)
// SITE_RECAPTCHA_KEY is not auto-exposed by Vite (needs VITE_ prefix), so we inject manually.
const siteRecaptchaKey = process.env.SITE_RECAPTCHA_KEY || ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.SITE_RECAPTCHA_KEY': JSON.stringify(siteRecaptchaKey),
  },
})
