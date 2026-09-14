# Mikel Saez de Vicuña — Portfolio

Production-oriented React portfolio with a native English, Spanish and Basque content system, an editable Decap CMS backoffice, and an interactive project map.

## What is included

- Native locale routes: `/en/`, `/es/` and `/eu/`
- Editable copy, interface labels, accessibility labels and SEO for every locale
- Decap CMS at `/admin/`, using the existing Netlify Identity + Git Gateway flow
- One shared source for project coordinates, media, partner logos and contact URLs
- Local GeoJSON map data and 13 CMS-managed project locations
- Expertise cards connected directly to matching map filters
- Responsive navigation with keyboard focus management
- Reduced-motion support, semantic controls and localized accessible names
- Static localized metadata, canonical links, `hreflang`, sitemap and robots rules
- Netlify redirects, security headers and cache policies
- Automated content/CMS contract tests, linting and production builds

## Stack

- React 19
- Vite 8
- GSAP 3
- Leaflet + React Leaflet
- Decap CMS 3.16.2
- Vanilla CSS

The public site no longer depends on Google Translate, Google Sheets or third-party project data at runtime.

## Local setup

Requirements: Node.js 20.19+ or 22.12+ and npm 10 or newer.

```bash
npm ci
npm run dev
```

The development server prints its local URL, normally `http://localhost:5173/en/`.

## Quality commands

```bash
npm run test    # content, locale and CMS-contract tests
npm run lint    # ESLint
npm run check   # complete lint + test + production-build gate
npm run build   # tested production build in dist/
npm run preview # preview the production build
```

`npm run build` generates locale-specific HTML files in `dist/en/`, `dist/es/` and `dist/eu/` after the Vite build.

## Content architecture

### Localized content

`src/data/content.json` has one complete object per locale:

```json
{
  "en": {},
  "es": {},
  "eu": {}
}
```

It contains SEO, UI labels, page copy, expertise content and localized project descriptions. The three locale objects must stay structurally identical; automated tests enforce that contract.

Only `<em>` and `<br />` are allowed in fields whose CMS hints explicitly mention markup. Rendering is handled by a restricted React component rather than raw HTML injection.

### Shared content

`src/data/shared.json` contains values that should not be translated:

- About portrait
- Email and LinkedIn URLs
- Project keys, categories, coordinates and images
- Partner logos and accessible organization names

Every shared project key must have a matching translation in all three locales. The build fails if a project is missing from any language.

## Backoffice

Open `/admin/` on the deployed site and sign in through Netlify Identity.

- **Website translations** edits the EN, ES and EU versions of every public text field.
- **Shared settings** edits contact links, portrait, project map data and partner logos.
- Image uploads are limited to 5 MB per file.
- Direct image URLs are disabled so managed media remains inside the repository.
- The editorial workflow keeps saved drafts separate from production until an editor explicitly publishes them.
- In-editor rendering is intentionally disabled; use the linked Netlify deploy preview for a visual check.

Detailed editor and maintenance instructions are in [`docs/BACKOFFICE_GUIDE.md`](docs/BACKOFFICE_GUIDE.md).

## Main paths

```text
public/
  admin/                 Decap CMS entry and schema
  data/world.geojson     Local map boundaries
  img/                   CMS-managed site media
  _headers               Netlify headers and cache policy
  _redirects             SPA route fallback
scripts/
  build-locales.mjs      Locale-specific static HTML generation
src/
  components/            Page sections and interactions
  data/content.json      Three-language content
  data/shared.json       Shared media, links and map geometry
  i18n/                  Locale routing and content provider
tests/
  cms-config.test.mjs    CMS/data editability contract
  content.test.mjs       Locale/content integrity contract
```

## Deployment contract

The repository is prepared for a static Netlify deployment:

```text
Build command:   npm run build
Publish folder:  dist
```

Keep these existing services enabled on the production site:

- Netlify Identity
- Git Gateway connected to this repository
- HTTPS on `saezdevicuna.eus`

Do not add credentials to this repository. Editor access should be granted through individual Netlify Identity invitations.

## Copyright

© 2026 Mikel Saez de Vicuña. All rights reserved.
