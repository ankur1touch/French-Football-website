# French Football Website (LeFootFR)

French football portal focused on **FIFA World Cup 2026**, with live scores, standings, teams, players, news, and FR/EN language support.

## Project structure

| Path | Description |
|------|-------------|
| `lefoot-fr/` | Next.js 16 application (React 19, TypeScript, Tailwind v4, Redux Toolkit) |
| `lefoot-fr-documentation.md` | Architecture and feature documentation |

## Quick start

```bash
cd lefoot-fr
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site redirects to `/fr` by default.

## Environment

Copy `lefoot-fr/.env.local.example` to `lefoot-fr/.env.local` and configure:

- `FOOTBALL_PROXY_BASE_URL` — server-side football API proxy
- `FOOTBALL_SEASON`, `FOOTBALL_PRIMARY_LEAGUE_ID` — World Cup 2026 defaults
- `NEXT_PUBLIC_RSS_*` — news RSS feeds

Never commit `.env.local` — it is gitignored.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **State:** Redux Toolkit
- **Styling:** Tailwind CSS v4
- **Data:** Football proxy API (`api.labenditaec.com`) with JSON mock fallback
- **News:** RSS feeds + local mock data
- **i18n:** French (`/fr`) and English (`/en`) routes

## License

Private project — all rights reserved.
