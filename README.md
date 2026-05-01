# Mikel Saez de Vicuña — Portfolio Website

A premium, production-ready personal portfolio website built with **React + Vite**, featuring a multilingual system, interactive world map with dynamic data-driven pins, custom cursor effects, and smooth GSAP animations.

---

## 🌐 Live Preview

> Deploy link goes here (Vercel / Netlify)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Multilingual** | English · Spanish · Basque via Google Translate integration |
| **Interactive World Map** | Real GeoJSON world map with Leaflet, glowing country outlines, clickable location pins |
| **Dynamic Map Pins** | Hardcoded pins + extra pins fetched live from Google Sheets via PapaParse |
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
- **Google Translate API** — Seamless, non-intrusive website translation
- **GSAP 3** — Scroll animations and cursor trail ticker
- **Leaflet + react-leaflet** — Real interactive world map with GeoJSON
- **PapaParse** — Client-side CSV parsing for dynamic map pins
- **Vanilla CSS** — No utility framework, full design control

---

## 📁 Project Structure

```
mikel-portfolio/
├── public/
│   └── hero-bg.mp4                  # Background video
├── src/
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
│   ├── App.jsx                      # Main application component
│   └── main.jsx                     # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🌍 Internationalization

The site features seamless, non-intrusive Google Translate integration. The default language is English, and it automatically translates to Spanish and Basque through the custom-styled navigation switcher.

**Switching languages:** Click `EN | ES | EU` in the top-right navbar. Content is translated instantly using Google Translate, while the default Google Translate UI, banners, and tooltips are hidden to maintain the site's premium aesthetic.

---

## 🗺️ World Map & Dynamic Pins

The world map has two pin sources that are merged and displayed together:

### 1. Hardcoded Pins (always present)
13 curated project pins are baked into `WorldMapSection.jsx` with local images and precise coordinates. These load instantly with no network dependency.

### 2. Dynamic Pins via Google Sheets
Additional pins are fetched at runtime from a **published Google Sheet** using **PapaParse**. This lets you add new pins without touching the code — just update the spreadsheet.

**Google Sheet columns:**

| Column | Description |
|---|---|
| `Id` | Unique row identifier |
| `City` | City name (must match the built-in 100+ city lookup table) |
| `Title` | Pin card title |
| `Category` | One of: `SEEDS`, `ROOTS`, `BLOOM`, `TERRITORIES`, `ECOSYSTEM`, `HARVEST` |
| `Pin Class` | Displayed as the location badge (e.g. country name) |
| `Description` | Short text shown in the hover card |
| `Image URL` | Direct image URL **or** a Google Drive share link |

**To add a new pin:**
1. Open the Google Sheet and add a new row
2. Set `City` to a recognised city name (e.g. `Tokyo`, `Buenos Aires`)
3. Paste an image URL — Google Drive share links (`/file/d/ID/view`) are automatically converted to embeddable thumbnail URLs
4. Make sure any Google Drive file is shared as **"Anyone with the link → Viewer"**
5. Refresh the site — new pins appear automatically (cached per browser session)

**Supported image sources:**
- ✅ Google Drive share links (auto-converted to thumbnail URLs)
- ✅ Any direct `.jpg` / `.png` / `.webp` URL
- ✅ Wikimedia / Imgur / Cloudinary links
- ❌ Google Images share links (`share.google/...`) — not embeddable

**City lookup:** The component includes a built-in lookup table of 100+ major world cities. If a city name in the sheet is not found, the pin is silently skipped. City names like `"Paris, France"` are also handled — the country suffix is stripped automatically.

**Caching:** Parsed CSV results are stored in `sessionStorage` for the duration of the browser session to avoid re-fetching on every page render.

**Vercel / production:** The CSV fetch is entirely **client-side** (browser → Google Sheets), so it works identically on Vercel, Netlify, or any static host — no server configuration needed.

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

Open [http://localhost:5173](http://localhost:5173) in your browser.

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

## 📄 License

© 2026 Mikel Saez de Vicuña. All rights reserved.
