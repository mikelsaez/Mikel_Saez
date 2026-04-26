# Mikel Saez de Vicuña — Portfolio Website

A premium, production-ready personal portfolio website built with **React + Vite**, featuring a multilingual system, interactive world map, custom cursor effects, and smooth GSAP animations.

---

## 🌐 Live Preview

> Deploy link goes here (Vercel / Netlify)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Multilingual (i18n)** | English · Spanish · Basque via `react-i18next` |
| **SEO-friendly routing** | Language-based URLs: `/en` `/es` `/eu` |
| **Interactive World Map** | Real GeoJSON world map with Leaflet, glowing country outlines, clickable location pins |
| **Custom Cursor Trail** | Gold/cream glowing cursor trail + spotlight glow effect |
| **GSAP Animations** | Scroll-triggered entrance animations on every section |
| **Hero Video Background** | Fullscreen looping video with dimmed overlay |
| **Expertise Cards** | Five service pillars with icons and project references |
| **About Section** | Bio with photo, multi-paragraph translated content |
| **Contact Section** | Email + LinkedIn CTAs with translated footer |
| **Logo Carousel** | Smooth infinite-scroll client/partner logo strip |

---

## 🏗️ Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool and dev server
- **react-i18next + i18next** — Internationalization
- **i18next-browser-languagedetector** — Auto-detects user language from URL / localStorage / browser
- **React Router v7** — Client-side routing with `/:lang` segments
- **GSAP 3** — Scroll animations and cursor trail ticker
- **Leaflet + react-leaflet** — Real interactive world map with GeoJSON
- **Vanilla CSS** — No utility framework, full design control

---

## 📁 Project Structure

```
mikel-portfolio/
├── public/
│   └── hero-bg.mp4                  # Background video
├── src/
│   ├── locales/
│   │   ├── en.json                  # English translations
│   │   ├── es.json                  # Spanish translations
│   │   └── eu.json                  # Basque translations
│   ├── components/
│   │   ├── HeroSection.jsx/css      # Hero + Navbar + Language switcher
│   │   ├── IntroSection.jsx/css     # Intro statement
│   │   ├── ProjectsSection.jsx/css  # Stats counter section
│   │   ├── ExpertiseSection.jsx/css # 5 expertise cards
│   │   ├── WorldMapSection.jsx/css  # Leaflet world map with pins
│   │   ├── AboutSection.jsx/css     # Bio section
│   │   ├── ImpactSection.jsx/css    # Impact numbers
│   │   ├── LogoCarousel.jsx/css     # Partner logos strip
│   │   ├── ContactSection.jsx/css   # Contact + footer
│   │   └── CursorTrail.jsx/css      # Custom cursor effect
│   ├── assets/
│   │   └── Hover/                   # Original hover effect reference
│   ├── i18n.js                      # i18next configuration
│   ├── App.jsx                      # Router + language sync
│   └── main.jsx                     # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🌍 Internationalization

The site supports three languages with manual translations (no auto-translate):

| Language | Code | URL |
|---|---|---|
| English | `en` | `/en` |
| Spanish | `es` | `/es` |
| Basque  | `eu` | `/eu` |

**Language persistence:** Selected language is saved in `localStorage` (`i18n_lang`) and restored on page reload.

**Switching languages:** Click `EN | ES | EU` in the top-right navbar. The URL updates and all content translates instantly without a page reload.

---

## 🗺️ World Map

- Built with **Leaflet + react-leaflet** using a real **GeoJSON world dataset** (Natural Earth 110m)
- Dark-green glowing country outline style — no tile server dependency
- **13 location pins** across Europe, Americas, Africa, and Asia
- Click any pin to reveal a project detail card with category, title, country tag, and description
- Map is fully static — no pan or zoom interaction

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mikel-portfolio.git
cd mikel-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/en](http://localhost:5173/en) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--dark-green` | `#0d2012` | Primary background |
| `--cream` | `#f5f0e8` | Primary text |
| `--gold` | `#c4a96a` | Accent / italic headings |
| `--cream-dim` | `rgba(245,240,232,0.6)` | Secondary text |
| Serif font | Playfair Display | All headings |
| Sans font | Inter | Body / UI elements |

---

## 📝 Adding or Editing Translations

1. Open `src/locales/en.json`, `es.json`, or `eu.json`
2. Add your key-value pair under the appropriate namespace
3. Use the key in any component: `const { t } = useTranslation()` → `t('your.key')`

Missing keys fall back to **English** automatically.

---

## 📄 License

© 2026 Mikel Saez de Vicuña. All rights reserved.
