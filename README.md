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

## Deploy on AWS Amplify

1. Connect repo: [github.com/ankur1touch/French-Football-website](https://github.com/ankur1touch/French-Football-website) → branch **main**
2. Enable **Monorepo** and set app root to **`lefoot-fr`**
3. Platform must be **Web Compute** (Next.js SSR) — Amplify usually auto-detects this
4. Copy env vars from `lefoot-fr/.env.local.example` into Amplify → **Environment variables**
5. After first deploy, set `NEXT_PUBLIC_SITE_URL` to your Amplify URL (e.g. `https://main.d1234.amplifyapp.com`)
6. Root `amplify.yml` is included for monorepo builds

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
