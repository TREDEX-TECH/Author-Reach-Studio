# 09 — Visual Redesign (v2), 25 Oct 2026

Owner decisions applied:
1. `Tredex Logo.png` **is** the correct Tredex logo — use it.
2. `Author_reach_studio_logo-removebg-preview.png` is the **official ARS logo and the website favicon**.
3. The three dashboard design boards define the **layout and structure**. The site must feel
   **tech-savvy but simple and easy to navigate**. Brand colours are **orange + white**, with
   shades that work in **both dark and light themes**.
4. The **entire GUI** — including the **invoice** — must adopt the new look.

## Brand system

| Token | Value | Source |
|---|---|---|
| Primary orange | `#F4761F` | Sampled from `Tredex Logo.png` (RGB 244,118,31) |
| Orange light | `#FF9A45` | Gradient start / hover |
| Orange dark | `#C2550B` | Text on light surfaces |
| Orange soft | `#FFF1E5` | Callouts, icon tiles, badges |
| White / canvas | `#FFFFFF` / `#F5F7FA` | Light theme surfaces |
| Dark navy | `#0E1524` | Sidebars and dark bands |
| Brand gradient | `#FF9A45 → #F4761F → #D95F0E` | Buttons, hero banners, progress |

The ARS logo's own dark green (`#294A39`) and cream (`#F9F2E2`) are **retained inside the logo
artwork only** — the surrounding UI now uses orange/white so both brand marks coexist.

## Assets created from your Drive files

| Asset | From | Purpose |
|---|---|---|
| `public/logo-ars.png` | ARS transparent PNG | Header/footer on light surfaces |
| `public/logo-ars-white.png` | recoloured ARS PNG | Header/footer on dark surfaces |
| `public/logo-ars-orange.png` | recoloured ARS PNG | Optional monochrome variant (not used by default) |
| `public/logo-tredex.png` | Tredex Logo.png, downscaled | Footer, About, sign-in, invoice footer |
| `app/icon.png` | AR monogram + book on orange | Favicon (auto-detected by Next.js App Router) |
| `app/apple-icon.png` | same, 180px | iOS home-screen icon |
| `public/favicon.ico` | same, 32px | Legacy/other browsers |

Originals are preserved in `brand-assets/` with a `contact-sheet.jpg` overview.

## Themes

- `html[data-theme="light"|"dark"]` drives every colour token in `app/globals.css`.
- An inline script in `app/layout.tsx` sets the theme **before paint** from `localStorage`
  (`ars-theme`), falling back to the OS `prefers-color-scheme`. No flash of the wrong theme.
- `<ThemeToggle />` appears in the public header, the dashboard topbar, the design-system page
  and the sign-in page. The choice persists in this browser.
- The **sidebar stays dark navy in both themes** — borrowed from the reference boards for a
  consistent product feel. Logos swap automatically via `.logo-on-light` / `.logo-on-dark`.

## Structure borrowed from your three reference boards

| Reference idea | Implementation |
|---|---|
| Coloured gradient hero banner (EduAI) | `.hero-banner` with `.ring` progress on portal, workspace and admin dashboards |
| KPI cards with icon chips + deltas (StudySync / AI Suite) | `.kpi`, `.kpi-icon`, `KpiRow` |
| Quick-action tiles (EduAI / StudySync) | `.quick-grid`, `.quick-card`, `QuickActions` |
| Dense sidebar + top search bar | `.sidebar` grouped nav with active indicator, `.searchbar` |
| Data tables with status chips | `.table-wrap`, `Badge` with text + colour |
| Mobile views in every board | Responsive breakpoints at 1100px and 680px; horizontal nav on mobile |
| Supabase setup panel (StudySync board) | Already covered by `docs/04-supabase-setup-guide.md` |

The public site keeps its editorial serif voice but now uses an orange pill, a product-style
`platform-preview` card, icon-tiled feature cards and quick-action navigation — so it reads as
a technology platform rather than a generic brochure.

## The invoice (explicitly requested)

`app/portal/invoices/[id]/page.tsx` is now a real branded document, not a dashboard widget:

- `.invoice-shell` — document + sticky payment card.
- `.invoice-paper` — ARS logo, `INVOICE` title, status badge, six meta fields, From / Bill to,
  line items table, totals with an orange rule, and a footer with the Tredex mark.
- `.pay-card` — orange amount header, `ProceedToPayment`, billing details and the full
  server-side verification checklist.
- `PrintButton` calls `window.print()`; `@media print` hides the sidebar, topbar, banners,
  role switcher and payment card, sets A4 margins, and prints only the invoice document.
- Line items are derived from the invoice total, so every invoice balances.

`/portal/invoices` was also rebuilt with a hero banner, KPI tiles and a restyled table.

## What changed across the whole app

- `app/globals.css` — fully rewritten (416+ lines): new tokens, both themes, all components,
  dashboard structure, invoice, print styles, responsive rules.
- `components/` — `brand.tsx` (real logos), `theme-toggle.tsx` (new), `site-header.tsx`,
  `site-footer.tsx`, `app-shell.tsx`, `ui.tsx` (new `HeroBanner`, `Ring`, `QuickActions`,
  icon-tiled KPIs), `module-view.tsx`, `print-button.tsx` (new).
- `app/layout.tsx` — theme bootstrap + favicon metadata.
- Rebuilt pages: public home, portal dashboard, workspace dashboard, admin dashboard,
  portal invoice list, invoice detail, design system, About (Tredex mark), sign-in, demo banner.
- All other 30+ screens inherit the new skin automatically through shared class names.
- 3 new tests (14 total) guard the brand tokens, both themes, real assets, absence of stale
  palette references, and the invoice document structure.

## Still open

- Vector (SVG/AI/EPS) ARS logo for crisp retina/favicon rendering — the current source is
  677 × 369 PNG.
- Confirm the sampled `#F4761F` is your official orange; if you have a brand hex, it is a
  one-line change in `:root`.
- Font files, if you have a corporate typeface.
- Whether the **public site itself** should offer a dark theme by default — currently it
  follows the OS/browser choice and the toggle.


## Naming rule (confirmed 25 Oct 2026)

The website's name is **Author Reach Studio** and nothing is appended to it.

- Home page `<title>` is exactly `Author Reach Studio` (previously
  `Author Reach Studio — Tech-savvy book marketing for authors`).
- Subpage titles use the standard `%s | Author Reach Studio` format.
- The header and sidebar show **only the real ARS logo** — no tagline, no
  "Workspace / Client platform" suffix.
- The hero pill keeps only the factual parent-brand line `A Tredex brand`.
- A regression test (`tests/blueprint.test.mjs`) guards this so it cannot creep back in.
