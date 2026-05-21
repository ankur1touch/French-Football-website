# LeFootFR — Documentation Complète du Projet

> **Portail Football Français**
> Repository : Workspace local · `lefoot-fr`
> Stack : **Next.js 15** · **TypeScript** · **Tailwind CSS v4** · **Redux Toolkit** · **Axios**

---

## Table des Matières

1. [Vue d'ensemble du Projet](#1-vue-densemble-du-projet)
2. [Stack Technique — Ce qui est utilisé & Pourquoi](#2-stack-technique--ce-qui-est-utilisé--pourquoi)
3. [Sources de Données — D'où viennent les données](#3-sources-de-données--doù-viennent-les-données)
4. [Routing — Comment fonctionnent les URLs](#4-routing--comment-fonctionnent-les-urls)
5. [Structure des Dossiers & Mapping des Fichiers](#5-structure-des-dossiers--mapping-des-fichiers)
6. [Mapping Page-to-Component](#6-mapping-page-to-component)
7. [Architecture du Flux de Données](#7-architecture-du-flux-de-données)
8. [Gestion d'État Redux](#8-gestion-détat-redux)
9. [Routes API (SSR-Safe)](#9-routes-api-ssr-safe)
10. [Variables d'Environnement](#10-variables-denvironnement)
11. [Système de Design (Couleurs & UI)](#11-système-de-design-couleurs--ui)
12. [Commandes de Développement & Build](#12-commandes-de-développement--build)
13. [Intégration RSS Feeds](#13-intégration-rss-feeds)
14. [Limitations Connues & Roadmap](#14-limitations-connues--roadmap)
15. [Référence Rapide — Quel fichier modifier](#15-référence-rapide--quel-fichier-modifier)

---

## 1. Vue d'ensemble du Projet

| Item | Détail |
|------|--------|
| **Nom** | LeFootFR |
| **Type** | Portail football en français (France + Afrique de l'Ouest) |
| **Langue** | Français (locale unique — multi-langue planifié) |
| **Audience cible** | Fans de football francophones (France, Sénégal, Côte d'Ivoire, Cameroun, etc.) |
| **Données** | RSS Feeds externes + JSON mock pour les données statiques |
| **Build status** | ✅ Passing — 0 erreurs (Next.js 15) |
| **Dev server** | `http://localhost:3000` |

**Ce que ce site délivre :**

- Homepage avec hero article, breaking news ticker, live scores, grille d'actualités, classement Ligue 1, sondage et prochains matchs
- Listing actualités avec filtres par catégorie + layout featured article
- Pages article complètes (slug dynamique)
- Centre des matchs — Live / À venir / Résultats avec filtre par compétition
- Hub Compétitions avec filtre et grille de cards
- Détail compétition — Classement + Meilleurs buteurs
- Classements — Hommes / Femmes avec toggle
- Hub Équipes — Filtre par confédération + recherche
- Détail équipe — Effectif, stats, forme récente
- Hub Joueurs — Filtre par poste + recherche
- Profil joueur — Stats carrière et biographie
- Page Transferts — Rumeurs, arrivées, départs
- Page Équipe de France — Actualités et convocations

---

## 2. Stack Technique — Ce qui est utilisé & Pourquoi

### Framework Principal

| Technologie | Version | Où utilisé | Pourquoi |
|-------------|---------|------------|----------|
| **Next.js** | 15.x | Dossier `app/` entier | App Router, SSR/SSG, pages rapides, déploiement Vercel |
| **React** | 19.x | Tous les composants UI | Standard industrie, intégré avec Next.js |
| **TypeScript** | 5.x | Tous les fichiers `.ts` / `.tsx` | Sécurité des types, moins de bugs runtime, meilleure DX |

### Styling & UI

| Technologie | Où utilisé | Pourquoi |
|-------------|------------|----------|
| **Tailwind CSS v4** | `globals.css`, tous les composants | Utility-first — design bleu/or rapide à construire |
| **@tailwindcss/postcss** | `postcss.config.mjs` | Pipeline de compilation Tailwind v4 |
| **tailwind-merge** | `lib/cn.ts` | Fusion propre des classes Tailwind conflictuelles |
| **clsx** | `lib/cn.ts` | Helper pour les noms de classes conditionnels |
| **Lucide React** | Icônes partout dans l'app | Set d'icônes léger |

### Gestion d'État

| Technologie | Fichiers | Pourquoi |
|-------------|----------|----------|
| **Redux Toolkit (RTK)** | `store/` + `store/features/` | État global centralisé avec async thunks |
| **React-Redux** | Tous les composants client | Hooks `useSelector` / `useDispatch` |
| **Immer** (intégré RTK) | Reducers des slices | Mises à jour immutables avec code style mutable |

### HTTP & API

| Technologie | Fichiers | Pourquoi |
|-------------|----------|----------|
| **Axios** | `lib/client.ts` | Client HTTP avec intercepteurs |
| **rss-parser** | `lib/rss.ts` | Parsing des flux RSS externes (Goal, SofaScore, etc.) |

### Utilitaires

| Package | Utilisation |
|---------|-------------|
| `clsx` + `tailwind-merge` | `cn()` — fusion sécurisée des classes (`lib/cn.ts`) |
| `rss-parser` | Parsing des flux RSS des sources françaises |
| `date-fns` | Formatage des dates en français |

### Configuration Images

| Fichier | But |
|---------|-----|
| `next.config.ts` | Domaines d'images distantes autorisés (Goal CDN, Cloudinary, Unsplash, Placeholder) |

---

## 3. Sources de Données — D'où viennent les données

### Tableau Résumé

| Type de données | Source | Entrées | Route API |
|-----------------|--------|---------|-----------|
| **Articles d'actualités** | RSS Feed + `data/news.json` | 20+ articles | `POST /api/news` |
| **Matchs** | RSS + `data/matches.json` | 15 matchs | `POST /api/matches` |
| **Classements** | `data/rankings.json` | Ligue 1 top 20 + Champions League | `POST /api/rankings` |
| **Compétitions** | `data/tournaments.json` | 8 compétitions | `POST /api/tournaments` |
| **Équipes nationales** | `data/teams.json` | 8 équipes | `POST /api/teams` |
| **Joueurs** | `data/players.json` | 10 joueurs | `POST /api/players` |
| **Transferts** | RSS + `data/transfers.json` | 15 transferts | `POST /api/transfers` |
| **Scores Live** | SofaScore RSS | Temps réel | `POST /api/livescores` |

---

### A) Données Actualités (`data/news.json` + RSS)

**Sources RSS primaires :**
```
Goal FR      : https://www.goal.com/feeds/fr/news
Google News  : https://news.google.com/rss/search?q=football&hl=fr&gl=FR&ceid=FR:fr
90min        : https://www.90min.com/posts.rss
SofaScore    : https://www.sofascore.com/news/feed
Flashscore   : https://www.flashscore.com/news/rss/
```

- 20 articles seed avec : titre, slug, catégorie, image, extrait, corps, date, auteur
- Catégories : `Ligue 1`, `Champions League`, `Transferts`, `Équipe de France`, `Afrique`, `International`
- Pattern URL : `/fr/actualites/[slug]`
- Revalidation ISR : toutes les 5 minutes

---

### B) Données Matchs (`data/matches.json`)

- 15 matchs couvrant les états Live, À venir et Résultats
- Chaque match : équipes, score, statut, compétition, date, stade
- Filtrés côté client par statut (`Live` / `À venir` / `Résultats`) et compétition

---

### C) Données Classements (`data/rankings.json`)

- Classement Ligue 1 (20 équipes) et Champions League (groupes)
- Chaque entrée : position, équipe, points, victoires, nuls, défaites, diff. buts, forme

---

### D) Données Compétitions (`data/tournaments.json`)

- 8 compétitions : Ligue 1, Ligue 2, Coupe de France, Champions League, Europa League, Coupe d'Afrique, AFCON, Ligue des Nations
- Chaque compétition : nom, catégorie, dates, hôte, image, classement de groupe, meilleurs buteurs

---

### E) Données Équipes (`data/teams.json`)

- 8 équipes nationales avec confédération, liste effectif, stats, forme récente
- Filtrables par confédération (UEFA, CAF, CONMEBOL, etc.)

---

### F) Données Joueurs (`data/players.json`)

- 10 joueurs avec poste, nationalité, club, stats carrière, bio
- Filtrables par poste (Attaquant, Milieu, Défenseur, Gardien)

---

### G) Données Transferts (`data/transfers.json`)

- 15 transferts : joueur, club départ, club arrivée, montant, statut (Officiel / Rumeur)
- Filtrables par fenêtre (Été / Hiver) et statut

---

### H) Scores Live (SofaScore RSS)

```
https://www.sofascore.com/news/feed
https://www.flashscore.com/news/rss/
```
- Polling toutes les 60 secondes via Route Handler `/api/livescores`
- Affiché dans le ticker live de la navbar

---

## 4. Routing — Comment fonctionnent les URLs

### Modèle de Routing : Next.js App Router

Toutes les pages utilisateur sont dans `app/fr/` pour la locale française.
Les routes API sont dans `app/api/`.

```
Requête → app/layout.tsx (shell HTML racine)
        → app/fr/layout.tsx (shell locale)
        → composant page spécifique
```

---

### Carte Complète des URLs

| URL | Fichier Page | Ce qu'elle affiche |
|-----|-------------|-------------------|
| `/` | `app/page.tsx` | Redirection root → homepage |
| `/fr` | `app/fr/page.tsx` | Homepage — Hero, Ticker, Actualités, Scores, Classement |
| `/fr/actualites` | `app/fr/actualites/page.tsx` | Listing actualités — filtres + layout featured |
| `/fr/actualites/[slug]` | `app/fr/actualites/[slug]/page.tsx` | Article complet |
| `/fr/matchs` | `app/fr/matchs/page.tsx` | Centre des matchs — Live/À venir/Résultats |
| `/fr/competitions` | `app/fr/competitions/page.tsx` | Hub compétitions — filtre catégorie + grille |
| `/fr/competitions/[id]` | `app/fr/competitions/[id]/page.tsx` | Détail compétition — classement + buteurs |
| `/fr/classements` | `app/fr/classements/page.tsx` | Classements — Ligue 1 / Champions League toggle |
| `/fr/equipes` | `app/fr/equipes/page.tsx` | Hub équipes — filtre confédération + recherche |
| `/fr/equipes/[id]` | `app/fr/equipes/[id]/page.tsx` | Détail équipe — effectif, stats, forme |
| `/fr/joueurs` | `app/fr/joueurs/page.tsx` | Hub joueurs — filtre poste + recherche |
| `/fr/joueurs/[id]` | `app/fr/joueurs/[id]/page.tsx` | Profil joueur — stats, bio, carrière |
| `/fr/transferts` | `app/fr/transferts/page.tsx` | Hub transferts — rumeurs + officiels |
| `/fr/equipe-de-france` | `app/fr/equipe-de-france/page.tsx` | Page dédiée Équipe de France |

### Routes API

| URL | Méthode | Fichier Source | Retourne |
|-----|---------|----------------|----------|
| `/api/news` | POST | `data/news.json` + RSS | Tous les articles |
| `/api/matches` | POST | `data/matches.json` | Tous les matchs |
| `/api/rankings` | POST | `data/rankings.json` | Classements Ligue 1 + CL |
| `/api/tournaments` | POST | `data/tournaments.json` | Toutes les compétitions |
| `/api/teams` | POST | `data/teams.json` | Toutes les équipes |
| `/api/players` | POST | `data/players.json` | Tous les joueurs |
| `/api/transfers` | POST | `data/transfers.json` | Tous les transferts |
| `/api/livescores` | POST | SofaScore/Flashscore RSS | Scores en direct |

### Routes Dynamiques Expliquées

```
app/fr/actualites/[slug]/page.tsx
                  │
                  └── Slug de l'article depuis news.json

app/fr/competitions/[id]/page.tsx
                    │
                    └── ID de compétition depuis tournaments.json

app/fr/equipes/[id]/page.tsx
               │
               └── ID équipe depuis teams.json

app/fr/joueurs/[id]/page.tsx
               │
               └── ID joueur depuis players.json
```

---

## 5. Structure des Dossiers & Mapping des Fichiers

```
lefoot-fr/
│
├── app/                                    # Next.js App Router (pages & routes)
│   ├── layout.tsx                          # Shell HTML racine
│   ├── page.tsx                            # Page racine (entrée homepage)
│   ├── globals.css                         # Tailwind v4 + styles globaux custom
│   ├── favicon.ico                         # Favicon navigateur
│   │
│   ├── api/                                # Routes API Next.js (SSR-safe)
│   │   ├── news/route.ts
│   │   ├── matches/route.ts
│   │   ├── rankings/route.ts
│   │   ├── tournaments/route.ts
│   │   ├── teams/route.ts
│   │   ├── players/route.ts
│   │   ├── transfers/route.ts
│   │   └── livescores/route.ts
│   │
│   └── fr/                                 # Pages locale française
│       ├── layout.tsx                      # Shell locale (Header + Footer)
│       ├── page.tsx                        # Homepage
│       ├── actualites/
│       │   ├── page.tsx                    # Listing actualités
│       │   └── [slug]/page.tsx             # Article detail
│       ├── matchs/page.tsx                 # Centre des matchs
│       ├── competitions/
│       │   ├── page.tsx                    # Hub compétitions
│       │   └── [id]/page.tsx              # Détail compétition
│       ├── classements/page.tsx            # Classements
│       ├── equipes/
│       │   ├── page.tsx                    # Hub équipes
│       │   └── [id]/page.tsx              # Détail équipe
│       ├── joueurs/
│       │   ├── page.tsx                    # Hub joueurs
│       │   └── [id]/page.tsx              # Profil joueur
│       ├── transferts/page.tsx             # Hub transferts
│       └── equipe-de-france/page.tsx       # Page Équipe de France
│
├── components/                             # Composants UI réutilisables
│   ├── home/                               # Sections spécifiques homepage
│   │   ├── HeroSection.tsx                 # Article hero principal
│   │   ├── BreakingTicker.tsx              # Ticker breaking news
│   │   ├── LiveScoreStrip.tsx              # Bande scores en direct
│   │   ├── NewsGrid.tsx                    # Grille 4 actualités
│   │   ├── StandingsWidget.tsx             # Widget classement Ligue 1
│   │   ├── PollWidget.tsx                  # Sondage du jour
│   │   └── FixturesWidget.tsx              # Prochains matchs sidebar
│   ├── layout/                             # Shell global
│   │   ├── Header.tsx                      # Navbar principale
│   │   ├── Footer.tsx                      # Footer
│   │   └── TopBar.tsx                      # Barre supérieure (date, langue)
│   ├── news/                               # Composants page actualités
│   │   ├── NewsCard.tsx
│   │   ├── NewsFilters.tsx
│   │   ├── FeaturedArticle.tsx
│   │   └── NewsListingClient.tsx
│   ├── matches/                            # Composants page matchs
│   │   ├── MatchCard.tsx
│   │   ├── LiveBadge.tsx
│   │   └── MatchesClient.tsx
│   ├── competitions/                       # Composants compétitions
│   │   ├── TournamentCard.tsx
│   │   ├── StandingsTable.tsx
│   │   ├── TopScorersTable.tsx
│   │   └── TournamentsClient.tsx
│   ├── equipes/                            # Composants équipes
│   │   ├── TeamCard.tsx
│   │   └── TeamsClient.tsx
│   ├── joueurs/                            # Composants joueurs
│   │   ├── PlayerCard.tsx
│   │   └── PlayersClient.tsx
│   ├── classements/                        # Composants classements
│   │   └── RankingsClient.tsx
│   ├── transferts/                         # Composants transferts
│   │   ├── TransferCard.tsx
│   │   └── TransfersClient.tsx
│   └── ui/                                 # Primitives UI génériques
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Skeleton.tsx
│       └── Tabs.tsx
│
├── data/                                   # Données JSON mock (source de vérité)
│   ├── news.json
│   ├── matches.json
│   ├── rankings.json
│   ├── tournaments.json
│   ├── teams.json
│   ├── players.json
│   └── transfers.json
│
├── store/                                  # Gestion d'état Redux Toolkit
│   ├── index.ts                            # Configuration du store
│   ├── StoreProvider.tsx                   # Wrapper Redux <Provider>
│   └── features/                           # Slices par domaine
│       ├── newsSlice.ts
│       ├── matchesSlice.ts
│       ├── tournamentsSlice.ts
│       ├── rankingsSlice.ts
│       ├── teamsSlice.ts
│       ├── playersSlice.ts
│       ├── transfersSlice.ts
│       └── livescoresSlice.ts
│
├── lib/                                    # Logique métier / utilitaires
│   ├── client.ts                           # Instance Axios (base URL + intercepteurs)
│   ├── cn.ts                               # cn() — clsx + tailwind-merge
│   ├── rss.ts                              # Parser RSS (rss-parser wrapper)
│   ├── api/                                # Fonctions helpers API
│   └── utils/                              # Fonctions utilitaires pures
│
├── types/                                  # Interfaces TypeScript partagées
│   ├── news.ts
│   ├── match.ts
│   ├── tournament.ts
│   ├── ranking.ts
│   ├── team.ts
│   ├── player.ts
│   └── transfer.ts
│
├── public/                                 # Assets statiques
│   └── images/
│
├── next.config.ts                          # Config Next.js (domaines images)
├── tailwind.config.ts                      # Config thème Tailwind
├── postcss.config.mjs                      # PostCSS pour Tailwind v4
├── tsconfig.json                           # Config TypeScript
├── eslint.config.mjs                       # Config ESLint
└── package.json                            # Dépendances
```

---

## 6. Mapping Page-to-Component

### Homepage (`app/fr/page.tsx`)

| Section | Composant | Source de données |
|---------|-----------|-------------------|
| Barre supérieure | `TopBar` | Statique (date, liens) |
| Navbar principale | `Header` | Statique + config nav |
| Ticker breaking news | `BreakingTicker` | `news.json` (derniers titres) |
| Hero + side articles | `HeroSection` | `news.json` (featured) |
| Bande scores live | `LiveScoreStrip` | RSS SofaScore/Flashscore |
| Grille actualités | `NewsGrid` | `news.json` (derniers 4) |
| Widget classement | `StandingsWidget` | `rankings.json` (top 5) |
| Sondage du jour | `PollWidget` | Statique / local state |
| Prochains matchs | `FixturesWidget` | `matches.json` (à venir) |
| Transferts chauds | Inline dans page | `transfers.json` (top 3) |

### Chaque page (via `layout.tsx`)

| Partie UI | Composant | Données |
|-----------|-----------|---------|
| Topbar + navbar bleue | `TopBar` + `Header` | Liens nav statiques |
| Footer avec liens | `Footer` | Statique |

### Pages Actualités

| Page | Composant Client | Comportement |
|------|-----------------|--------------|
| `/fr/actualites` | `NewsListingClient` | Dispatch `fetchNews` → filtre par catégorie côté client |
| `/fr/actualites/[slug]` | Server Component | Trouve l'article par slug depuis le store Redux |

### Page Matchs

| Filtre | Comportement |
|--------|--------------|
| Tabs Live / À venir / Résultats | `MatchesClient` — filtre le tableau `matches` par `status` |
| Dropdown compétition | Filtre secondaire sur la liste déjà filtrée |

### Page Compétitions

| Filtre | Comportement |
|--------|--------------|
| Tabs catégorie | `TournamentsClient` — filtre par catégorie de compétition |

### Page Équipes

| Filtre | Comportement |
|--------|--------------|
| Tabs confédération | `TeamsClient` — filtre par confédération |
| Input recherche | Filtre texte côté client sur le nom d'équipe |

### Page Joueurs

| Filtre | Comportement |
|--------|--------------|
| Tabs poste | `PlayersClient` — filtre par poste |
| Input recherche | Filtre texte côté client sur le nom de joueur |

### Page Transferts

| Filtre | Comportement |
|--------|--------------|
| Tabs statut | `TransfersClient` — filtre par statut (Officiel / Rumeur) |
| Tabs fenêtre | Filtre secondaire par fenêtre (Été / Hiver) |

---

## 7. Architecture du Flux de Données

```
┌───────────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR UTILISATEUR                      │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────┐
│            app/layout.tsx (shell HTML racine)                      │
│            StoreProvider enveloppe toute l'app                     │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────┐
│            app/fr/... (page.tsx — Server Component)                │
│  Rend les Client Components → dispatch les async thunks            │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                     ┌───────────┴────────────┐
                     ▼                        ▼
            ┌──────────────┐        ┌─────────────────────┐
            │  Redux Store │        │  Next.js API Routes  │
            │  (RTK slice) │◄───────│  /api/news           │
            │              │        │  /api/matches        │
            │  useSelector │        │  /api/rankings       │
            │  useDispatch │        │  /api/tournaments    │
            └──────────────┘        │  /api/teams          │
                     │              │  /api/players        │
                     │              │  /api/transfers      │
                     │              │  /api/livescores     │
                     ▼              └──────────┬───────────┘
            ┌──────────────┐                   │
            │  UI renders  │        ┌──────────┴───────────┐
            │  avec state  │        │  data/*.json (mock)   │
            └──────────────┘        │  + RSS Feeds externes │
                                    └──────────────────────┘
```

**Principe clé :** Les composants n'appellent jamais directement les APIs. Ils `dispatch` un thunk → le thunk appelle la route API via Axios → la réponse va dans le slice Redux → le composant lit via `useSelector`.

---

## 8. Gestion d'État Redux

### Structure du Store

Chaque domaine a son propre slice avec le pattern standard :

```typescript
// Pattern utilisé dans chaque slice
{
  data: T[],               // Les items réels
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

### Slices

| Slice | Fichier | Shape de l'état |
|-------|---------|-----------------|
| `news` | `store/features/newsSlice.ts` | `{ articles, status, error }` |
| `matches` | `store/features/matchesSlice.ts` | `{ matches, status, error }` |
| `tournaments` | `store/features/tournamentsSlice.ts` | `{ tournaments, status, error }` |
| `rankings` | `store/features/rankingsSlice.ts` | `{ ligue1, championsLeague, status, error }` |
| `teams` | `store/features/teamsSlice.ts` | `{ teams, status, error }` |
| `players` | `store/features/playersSlice.ts` | `{ players, status, error }` |
| `transfers` | `store/features/transfersSlice.ts` | `{ transfers, status, error }` |
| `livescores` | `store/features/livescoresSlice.ts` | `{ scores, lastUpdated, status, error }` |

### Pattern Async Thunks

```typescript
// Chaque slice a un async thunk comme :
export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const res = await axiosClient.post('/api/news');
  return res.data;
});
```

### StoreProvider

`store/StoreProvider.tsx` est un composant `"use client"` qui enveloppe `app/layout.tsx` avec Redux `<Provider>`.

---

## 9. Routes API (SSR-Safe)

Toutes les routes API utilisent la méthode `POST` et lisent depuis les fichiers `data/*.json`. L'utilisation de POST évite les problèmes de cache en SSR.

| Route | Fichier | Ce qu'elle retourne |
|-------|---------|---------------------|
| `POST /api/news` | `app/api/news/route.ts` | Tableau de tous les articles |
| `POST /api/matches` | `app/api/matches/route.ts` | Tableau de tous les matchs |
| `POST /api/rankings` | `app/api/rankings/route.ts` | `{ ligue1: [...], championsLeague: [...] }` |
| `POST /api/tournaments` | `app/api/tournaments/route.ts` | Tableau de toutes les compétitions |
| `POST /api/teams` | `app/api/teams/route.ts` | Tableau de toutes les équipes |
| `POST /api/players` | `app/api/players/route.ts` | Tableau de tous les joueurs |
| `POST /api/transfers` | `app/api/transfers/route.ts` | Tableau de tous les transferts |
| `POST /api/livescores` | `app/api/livescores/route.ts` | Scores live depuis RSS |

**Pour passer à une vraie API :** Modifiez `app/api/[route]/route.ts` — remplacez `readFileSync('data/x.json')` par un vrai appel `fetch()`. Aucun changement de composant nécessaire.

---

## 10. Variables d'Environnement

| Variable | Requise ? | But | Exemple |
|----------|-----------|-----|---------|
| `NEXT_PUBLIC_SITE_URL` | Recommandé | SEO, URL de base OpenGraph | `https://lefoot-fr.vercel.app` |
| `NEXT_PUBLIC_RSS_GOAL_FR` | Optionnel | URL RSS Goal.com français | `https://www.goal.com/feeds/fr/news` |
| `NEXT_PUBLIC_RSS_GOOGLE_FR` | Optionnel | URL RSS Google News français | `https://news.google.com/rss/...` |

**Setup local :**

```bash
# Créer .env.local à la racine du projet (non commité dans git)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RSS_GOAL_FR=https://www.goal.com/feeds/fr/news
NEXT_PUBLIC_RSS_GOOGLE_FR=https://news.google.com/rss/search?q=football&hl=fr&gl=FR&ceid=FR:fr
```

---

## 11. Système de Design (Couleurs & UI)

### Tokens Couleurs

| Token | Hex | Utilisation |
|-------|-----|-------------|
| **Bleu Principal** | `#003087` | Primaire — header, boutons, accents |
| **Bleu Secondaire** | `#1a4aa0` | Secondaire — liens, états hover |
| **Or** | `#FFD700` | Highlights, badges featured, CTAs |
| **Rouge Alerte** | `#e63946` | Badges Live, scores, alertes breaking |
| **Surface** | `#f8fafc` | Fond de page |
| **Sombre Navbar** | `#1a1a2e` | Topbar, footer |
| **Vert Victoire** | `#2d6a4f` | Forme équipe — victoire |
| **Gris Nul** | `#888880` | Forme équipe — nul |
| **Rouge Défaite** | `#c1440e` | Forme équipe — défaite |

### Primitives UI Réutilisables (`components/ui/`)

| Composant | Fichier | But |
|-----------|---------|-----|
| `Badge` | `Badge.tsx` | Labels statut (Live, Featured, tags catégorie) |
| `Button` | `Button.tsx` | Variantes primary / secondary / ghost |
| `Skeleton` | `Skeleton.tsx` | Placeholder chargement pour listes/cards |
| `Tabs` | `Tabs.tsx` | Groupes d'onglets filtres (matchs, classements, équipes) |

### États Loading / Empty / Error

Chaque composant client qui fetche des données gère les 3 états :

- **Loading :** Composants `Skeleton` (pas d'écran blanc)
- **Empty :** Message convivial quand la liste filtrée est vide
- **Error :** Message d'erreur avec option retry quand `status === 'failed'`

---

## 12. Commandes de Développement & Build

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev (http://localhost:3000)
npm run dev

# Build de production
npm run build

# Lancer le build de production localement
npm start

# Vérification lint
npm run lint
```

### Domaines Images (`next.config.ts`)

Les images distantes sont autorisées depuis :
- `**.goal.com` — CDN Goal.com
- `**.cloudinary.com` — CDN Cloudinary
- `images.unsplash.com` — Photos stock Unsplash
- `via.placeholder.com` — Images placeholder
- `**.sofascore.com` — Assets SofaScore

---

## 13. Intégration RSS Feeds

### Sources RSS Françaises (Prioritaires)

| Source | Feed URL | Type | Fréquence refresh |
|--------|----------|------|-------------------|
| Goal FR | `https://www.goal.com/feeds/fr/news` | Actualités | 5 min |
| 90min | `https://www.90min.com/posts.rss` | Actualités | 5 min |
| SofaScore | `https://www.sofascore.com/news/feed` | Scores + News | 1 min |
| Flashscore | `https://www.flashscore.com/news/rss/` | Scores + News | 1 min |
| Sportskeeda | `https://www.sportskeeda.com/feed` | Actualités | 10 min |
| Google News FR | `https://news.google.com/rss/search?q=football&hl=fr&gl=FR&ceid=FR:fr` | Découverte | 15 min |
| FIFA | `https://www.fifa.com/fifaplus/en/rss` | Officiel | 30 min |
| Soccerway | `https://int.soccerway.com/rss/` | Scores | 5 min |

### Architecture du Parser RSS (`lib/rss.ts`)

```typescript
import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchRSSFeed(url: string) {
  const feed = await parser.parseURL(url);
  return feed.items.map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    contentSnippet: item.contentSnippet,
    categories: item.categories,
  }));
}
```

### Revalidation ISR dans les Routes API

```typescript
// app/api/news/route.ts
export const revalidate = 300; // 5 minutes

export async function POST() {
  const rssItems = await fetchRSSFeed(process.env.NEXT_PUBLIC_RSS_GOAL_FR!);
  const mockNews = await readLocalJSON('data/news.json');
  return NextResponse.json([...rssItems, ...mockNews]);
}
```

---

## 14. Limitations Connues & Roadmap

### Limitations Actuelles

| Problème | Détail |
|----------|--------|
| **Données mock limitées** | Équipes / Joueurs ont seulement 8/10 entrées — étendre `data/*.json` |
| **Locale unique** | Seulement français (`/fr`) — i18n non encore implémenté |
| **Pas d'authentification** | Pas de système login / utilisateur |
| **Scores semi-live** | Polling RSS toutes les 60s — pas de WebSocket temps réel |
| **Pas de recherche globale** | Recherche limitée aux pages équipes/joueurs |

### Roadmap Future

1. **Intégration API réelle** — Remplacer `data/*.json` par des appels API football-data.org ou RapidAPI Football
2. **Authentification** — Système compte utilisateur (favoris, alertes matchs)
3. **Page Recherche** — `/fr/recherche` avec recherche plein texte sur tout le contenu
4. **Notifications push** — Alertes buts, résultats finaux
5. **WebSocket scores live** — Mises à jour temps réel sans polling
6. **i18n** — Support multi-langue (Anglais, Arabe, Wolof pour Afrique de l'Ouest)
7. **Section Afrique** — Hub dédié football africain (AFCON, CAF Champions League)
8. **Application mobile** — PWA ou React Native
9. **Mode sombre** — Thème dark pour usage nocturne
10. **Plus de données mock** — Étendre chaque `data/*.json` à 30+ entrées

---

## 15. Référence Rapide — Quel fichier modifier

| Si vous voulez changer… | Modifiez ce fichier |
|-------------------------|---------------------|
| Liens navigation header | `components/layout/Header.tsx` |
| Liens / icônes footer | `components/layout/Footer.tsx` |
| Barre topbar (date, langue) | `components/layout/TopBar.tsx` |
| Couleurs / polices | `tailwind.config.ts`, `app/globals.css` |
| Hero homepage | `components/home/HeroSection.tsx` |
| Grille actualités homepage | `components/home/NewsGrid.tsx` |
| Ticker breaking news | `components/home/BreakingTicker.tsx` |
| Scores live strip | `components/home/LiveScoreStrip.tsx` |
| Widget classement sidebar | `components/home/StandingsWidget.tsx` |
| Sondage du jour | `components/home/PollWidget.tsx` |
| Filtres listing actualités | `components/news/NewsFilters.tsx` |
| Filtres / onglets matchs | `components/matches/MatchesClient.tsx` |
| Grille compétitions | `components/competitions/TournamentsClient.tsx` |
| Tableau classements | `components/classements/RankingsClient.tsx` |
| Recherche + filtre équipes | `components/equipes/TeamsClient.tsx` |
| Recherche + filtre joueurs | `components/joueurs/PlayersClient.tsx` |
| Cards transferts | `components/transferts/TransfersClient.tsx` |
| Ajouter des articles | `data/news.json` |
| Ajouter des matchs | `data/matches.json` |
| Mettre à jour classements | `data/rankings.json` |
| Ajouter compétitions | `data/tournaments.json` |
| Ajouter équipes | `data/teams.json` |
| Ajouter joueurs | `data/players.json` |
| Ajouter transferts | `data/transfers.json` |
| Logique route API | `app/api/[domaine]/route.ts` |
| Slice Redux (shape état) | `store/features/[domaine]Slice.ts` |
| Interfaces TypeScript | `types/[domaine].ts` |
| Config client Axios | `lib/client.ts` |
| Parser RSS | `lib/rss.ts` |
| Utilitaire noms de classes | `lib/cn.ts` |
| Domaines images autorisés | `next.config.ts` |
| Ajouter une nouvelle page | `app/fr/votre-page/page.tsx` |

---

## Référence Design

Le design s'inspire des meilleurs portails football français :

- **Header :** Bleu foncé `#003087` avec accents or, hamburger responsive mobile
- **Hero :** Image pleine largeur avec texte superposé + badge catégorie
- **Cards :** Cards blanches propres avec image + badge catégorie + titre + extrait
- **Ticker live :** Bande bleu foncé avec chips de scores jaunes
- **Sidebar widgets :** Classement avec points de forme colorés, sondage, prochains matchs
- **Typographie :** Sans-serif propre, titres gras, style presse sportive
- **Mobile-first :** Toutes les sections s'adaptent à 375px minimum

---

**Version du document :** 1.0
**Projet :** LeFootFR (`lefoot-fr`)
**Dernière mise à jour :** Mai 2026

*Partager ce document avec n'importe quel développeur, client ou reviewer — image technique complète du projet en un seul endroit.*
