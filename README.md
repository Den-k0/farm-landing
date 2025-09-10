# Kalyna Loshnivska Farm Landing

Single-page marketing site for the Ukrainian farm enterprise "ФГ «Калина Лошнівська»" built with Vite, React 19 and Tailwind CSS v4. Provides company overview (crops, livestock, social responsibility, gallery, contacts) with dark/light theme, accessible UI and Netlify form protected by Google reCAPTCHA v2.

## Tech Stack
- React 19 (functional components, hooks)
- Vite 7 (fast dev / build, ESM)
- Tailwind CSS 4 (class-based dark mode, custom utilities)
- Netlify Forms + Google reCAPTCHA v2 Checkbox
- ESLint (core + react-hooks + react-refresh + jsx-a11y)
- Prettier formatting

## Features
- Modular section architecture (Hero, About, Crops, Livestock, Social, Gallery, Contact)
- Light / Dark theme with system sync + persistent override (Alt+click reset)
- Accessible navigation (focus-visible, aria landmarks, semantic structure)
- Netlify form with honeypot + token submission (URL-encoded)
- Explicit reCAPTCHA v2 render with theme-based re-render
- Optimized static assets (WebP images, SVG logo)

## Project Structure
```
root
├─ index.html              # Entry HTML, theme pre-init, reCAPTCHA script, hidden Netlify form
├─ vite.config.js          # Vite config (exposes SITE_RECAPTCHA_KEY)
├─ tailwind.config.js      # Tailwind v4 config (dark mode class)
├─ postcss.config.js       # PostCSS (Tailwind + autoprefixer)
├─ eslint.config.js        # Flat ESLint config
├─ package.json            # Scripts + dependencies
├─ README.md               # Documentation
├─ public/                 # Public static images (served as-is)
└─ src/
   ├─ main.jsx             # React root render
   ├─ App.jsx              # Assembles sections inside Layout
   ├─ index.css            # Tailwind import + custom utilities (gradients, text effects)
   ├─ assets/              # SVG logos
   ├─ data/                # stats.js, gallery.js, contacts.js
   ├─ hooks/
   │  └─ useTheme.js       # Theme state + persistence + system sync
   ├─ utils/
   │  └─ form.js           # encode(), validateContact()
   └─ components/
      ├─ Header.jsx        # Top navigation + mobile menu + ThemeToggle
      ├─ Footer.jsx        # Footer links + social icons
      ├─ ThemeToggle.jsx   # Theme switch control
      ├─ icons/            # Sun / Moon icons
      ├─ layout/
      │  └─ Layout.jsx     # Background layers + shell (Header, Footer, <main>)
      └─ sections/
         ├─ Hero.jsx       # Hero heading, KPIs, logo
         ├─ About.jsx      # Company description
         ├─ Crops.jsx      # Crop production summary
         ├─ Livestock.jsx  # Livestock overview + image
         ├─ Social.jsx     # Social responsibility
         ├─ Gallery.jsx    # Image grid
         └─ Contact.jsx    # Contacts + Netlify form + reCAPTCHA
```

## Environment
Create `.env` (NOT committed):
```
SITE_RECAPTCHA_KEY=your_public_v2_checkbox_site_key
```
Netlify: set the same key in build environment. Secret key configured only in Netlify admin (server side).

## Theming
- Dark mode toggled by adding/removing `dark` class on `<html>` (and body for safety).
- User preference persisted in `localStorage`; Alt+click resets to system.
- System preference changes auto-sync when no explicit user override.

## Accessibility
- Landmark roles and `aria-label` for navigation.
- Focus outlines (`focus-visible`) for interactive elements.
- ReCAPTCHA container labeled; status messages announced with `aria-live`.

## Development
Install deps and start dev server:
```
npm install
npm run dev
```
Build production bundle:
```
npm run build
```
Preview production build:
```
npm run preview
```

## Linting & Formatting
```
npm run lint
npm run format
```

## Deployment
- Deployed to Netlify; form + reCAPTCHA handled automatically server-side.
- Ensure `SITE_RECAPTCHA_KEY` is present in Netlify environment variables before build.
