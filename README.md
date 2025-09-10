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
- Modular section components (Hero, About, Crops, Livestock, Social, Gallery, Contact)
- Responsive layout, reduced-motion friendly animations
- Light/Dark theme with system preference sync + manual override
- Accessible navigation (aria labels, focus-visible outlines, semantic landmarks)
- Netlify form submission (honeypot + reCAPTCHA token) via progressive enhancement
- Encapsulated reCAPTCHA logic hook with theme-aware re-render
- Background gradient + grid visual layer isolated in Layout

## Project Structure
```
root
├─ index.html                # HTML entry (preloads theme, loads reCAPTCHA script, hidden Netlify form)
├─ vite.config.js            # Vite config + env define for SITE_RECAPTCHA_KEY
├─ tailwind.config.js        # Tailwind v4 config (dark mode via class)
├─ postcss.config.js         # Tailwind + autoprefixer pipeline
├─ eslint.config.js          # Flat ESLint config with a11y
├─ package.json              # Scripts & dependencies
├─ src/
│  ├─ main.jsx               # React root render
│  ├─ App.jsx                # Combines sections inside Layout
│  ├─ index.css              # Tailwind import + custom utilities (gradient, grid, text-gradient)
│  ├─ assets/                # Static svg/logo assets
│  ├─ components/
│  │  ├─ Header.jsx          # Fixed header + nav + mobile menu toggle
│  │  ├─ Footer.jsx          # Footer links + social icons
│  │  ├─ ThemeToggle.jsx     # Theme switch (Alt-click resets to system)
│  │  ├─ icons/              # Sun/Moon icon components
│  │  └─ layout/
│  │     └─ Layout.jsx       # Page shell (background layers, Header, Footer, <main>)
│  │  └─ sections/
│  │     ├─ Hero.jsx         # Hero headline, KPIs, logo
│  │     ├─ About.jsx        # Company description
│  │     ├─ Crops.jsx        # Crop production highlights
│  │     ├─ Livestock.jsx    # Livestock overview + image
│  │     ├─ Social.jsx       # Social responsibility list
│  │     ├─ Gallery.jsx      # Image gallery grid (static sources)
│  │     └─ Contact.jsx      # Contact info + Netlify form + reCAPTCHA
│  ├─ hooks/
│  │  ├─ useTheme.js         # Theme state (persist & system sync)
│  │  └─ useRecaptcha.js     # Encapsulated reCAPTCHA lifecycle
│  ├─ data/
│  │  ├─ stats.js            # KPI statistics for hero
│  │  ├─ gallery.js          # Gallery image source list
│  │  └─ contacts.js         # Contact people list
│  ├─ utils/
│  │  └─ form.js             # encode() + validateContact()
│  └─ App.jsx                # (Imported by main) renders sections via Layout
└─ public/                   # Public images (imported by path)
```

## Environment Variables
Set in Netlify UI or local `.env` (never commit secrets):
- SITE_RECAPTCHA_KEY: public reCAPTCHA v2 checkbox site key (exposed to client)
(Secret key is stored only in Netlify backend settings; not in repository.)

## reCAPTCHA Integration
1. `index.html` loads the Google script with `onload=onRecaptchaLoad&render=explicit`.
2. Hidden Netlify form registers fields for build parsing.
3. `useRecaptcha` hook performs explicit render into a ref container, tracks readiness and re-renders when theme changes.
4. Contact form fetch-posts URL-encoded body including `g-recaptcha-response` token.

## Form Handling
- Validation: minimal client-side (required fields + email regex) via `validateContact`.
- Honeypot: `bot-field` hidden input.
- Rate limiting: 3 second cooldown between submissions.
- Accessible status region with `aria-live`.

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

## Potential Improvements
- Image optimization (WebP/AVIF + <picture>)
- Lazy loading heavy sections (Gallery) with `React.lazy`
- Structured data (JSON-LD) for Organization
- Central Card / Section UI primitives
- Unit tests for hooks (if expanded)

## Deployment
- Deployed to Netlify; form + reCAPTCHA handled automatically server-side.
- Ensure `SITE_RECAPTCHA_KEY` is present in Netlify environment variables before build.

## License
Internal project (no explicit OSS license specified). Add a LICENSE file if open-sourcing.
