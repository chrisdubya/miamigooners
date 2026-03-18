# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Miami Gooners is a Next.js website for the Miami Gooners Arsenal supporters club. The site displays Arsenal match fixtures, allows event RSVPs, and features an integrated Shopify e-commerce store for official merchandise.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack) with TypeScript
- **UI**: Material-UI v6 (@mui/material) with Emotion for styling
- **Particle Animation**: Three.js with React Three Fiber (@react-three/fiber 9.x) + Drei (@react-three/drei 10.x) — particles only, no 3D models
- **Authentication**: Auth0 v4 (@auth0/nextjs-auth0)
- **E-commerce**: Shopify Storefront API 2026-01 (@shopify/storefront-api-client)
- **Date Handling**: Luxon for timezone-aware date formatting
- **Styling**: Tailwind CSS 4 + Emotion CSS-in-JS

### Project Structure

```
app/
├── layout.tsx              # Root layout (Server Component) — imports Navbar
├── page.tsx                # Home page (Server Component)
├── not-found.tsx           # 404 page
├── ThemeRegistry.tsx       # 'use client' — Emotion cache + MUI ThemeProvider
├── NavigationLoader.tsx    # 'use client' — loading overlay on navigation
├── Providers.tsx           # 'use client' — Auth0Provider + CartProvider
├── shop/
│   ├── page.tsx            # Server Component (fetches products)
│   ├── ShopContent.tsx     # 'use client' — MUI rendering for shop listing
│   ├── cart/page.tsx       # 'use client' — Cart page (no hero, task-focused)
│   └── [productId]/
│       ├── page.tsx        # Server Component
│       └── ProductDetailClient.tsx  # 'use client'
└── api/
    ├── events/route.ts     # Events API
    └── passes/route.ts     # Apple Wallet pass generation

src/
├── Navbar.tsx              # 'use client' — Fixed navbar (always opaque)
├── Hero.tsx                # 'use client' — Home hero section (100vh)
├── ShopHero.tsx            # 'use client' — Shop hero section (50vh)
├── Scene.tsx               # 'use client' — Three.js particle animation (no 3D model)
├── AllEvents.tsx           # 'use client' — Events listing with competition filter chips
├── Event.tsx               # 'use client' — Individual event card (editorial design)
├── Footer.tsx              # 'use client' — 3-column footer
├── EventsSkeleton.tsx      # 'use client' — Loading skeleton for events
├── LoadingOverlay.tsx      # 'use client' — Navigation loading backdrop
├── CartButton.tsx          # 'use client' — Cart icon with badge
├── ProductImageGallery.tsx # 'use client' — Product image carousel
├── PolicyModal.tsx         # 'use client' — Privacy/Return policy modal
├── font.ts                 # Font definitions (Inter, Doppler local, JetBrains Mono)
├── theme.ts                # MUI dark theme (#DB0007 red, #D4A843 gold)
├── context/
│   └── CartContext.tsx     # Cart state provider
├── constants/
│   ├── teamColors.ts       # Premier League + cup team color definitions
│   └── images.ts           # Image asset constants
└── utils/
    ├── events.ts           # Shared event data loading (used by API route and server page)
    └── shopify.ts          # Shopify Storefront API client

lib/
└── auth0.ts                # Auth0Client singleton

proxy.ts                    # Auth0 middleware (replaces middleware.ts)
styles/globals.css          # Tailwind @theme tokens, CSS animations, global styles
public/fixtures/
└── premier-league-25-26.json  # Premier League fixture data
```

### Key Architecture Rules

1. **App Router only** — no `pages/` directory
2. **Client boundaries** — all `src/*.tsx` files using MUI/hooks have `'use client'` directive
3. **Server Components must not import MUI** — `app/shop/page.tsx` delegates rendering to `ShopContent.tsx`
4. **Emotion SSR** — `app/ThemeRegistry.tsx` manually implements `useServerInsertedHTML` emotion cache
5. **`jsxImportSource: "@emotion/react"` must NOT be in tsconfig.json** — causes Server Components to crash
6. **Events data** — `src/utils/events.ts` is imported directly by server pages (avoids SSR self-fetch)

### Design System

**Colors:**
- Primary red: `#DB0007` (Arsenal red)
- Cannon gold: `#D4A843` (secondary accent)
- Background: `#0A0A0B`
- Surface: `#111113`

**Typography:**
- Headings: Doppler (`doppler` from `src/font.ts`) — self-hosted webfont at `public/fonts/doppler-regular-webfont.woff2/.woff`. Licensed from Creative Market (webfont license). **Always `textTransform: 'lowercase'`** — apply this explicitly on any `sx` prop that sets `fontFamily: doppler.style.fontFamily`, since `sx` overrides bypass the theme default.
- Body: Inter (`inter` from `src/font.ts`)
- Scores/countdowns: JetBrains Mono (`jetbrainsMono` from `src/font.ts`)

**Doppler font rule:** The MUI theme sets `textTransform: 'lowercase'` on h1–h4 variants. However, any component that sets `fontFamily: doppler.style.fontFamily` directly via `sx` prop must also explicitly set `textTransform: 'lowercase'` — the theme variant default is overridden by `sx`.

**Navigation:** Fixed `Navbar` component — always opaque (`rgba(10,10,11,0.9)` + blur), never transparent. "miami gooners" wordmark in Doppler (lowercase), MATCHES/SHOP text links in Inter uppercase, social icons on right.

### Key Components

**Navbar.tsx**: Always-dark fixed navbar. "miami gooners" wordmark (Doppler, lowercase), MATCHES/SHOP nav links (Inter, uppercase), social icons, cart badge (shop pages only). Mobile hamburger drawer. No scroll-based style changes.

**Hero.tsx**: 100vh hero with background photo, dark gradient overlay, floating particle Scene, left-aligned editorial headline ("miami / gooners" in Doppler), bold subtitle, CTA buttons (Next Match, Visit Shop), bouncing scroll indicator. Scroll indicator uses two nested Boxes — outer for `translateX(-50%)` centering, inner for the bounce animation — to prevent the animation from overriding the centering transform.

**Scene.tsx**: Three.js canvas — floating red ember particles only (no 3D model). 200 particles, rendered on all devices. Skips rendering when `prefers-reduced-motion` is set. Desktop DPR [1, 1.5].

**AllEvents.tsx**: Competition filter chips (All / Premier League / UEFA Champions League / FA Cup / Carabao Cup). Upcoming matches section + Recent Results accordion (only shown for PL and UCL, collapsed by default). Bottom padding `pb: {xs: 8, md: 12}` for spacing above footer.

**Event.tsx**: Editorial card — opponent-color top band, Doppler opponent name (lowercase), JetBrains Mono score/countdown, competition chip (gold), W/D/L result badge, RSVP button with pulse glow.

**Events data flow**: `src/utils/events.ts` → imported by `app/api/events/route.ts` AND directly by server pages. Combines pre-season friendlies with PL fixtures from `public/fixtures/premier-league-25-26.json`.

### E-commerce Shop System

- `/shop` — Product grid (ShopContent.tsx client component)
- `/shop/[productId]` — Product detail with ShopHero, size selector, add to cart
- `/shop/cart` — Cart page (no hero, task-focused). pt-12 for navbar clearance.
- All Shopify API calls are server-side (no client-side tokens)
- Cart state in `src/context/CartContext.tsx` (localStorage persistence)

### Team Colors System

`src/constants/teamColors.ts` maps team names to `{primary, secondary}` colors. Event.tsx has special handling for light colors to ensure text contrast. When adding new teams, define both primary and secondary.

### Date & Time Handling

Match dates stored in UTC (`"yyyy-MM-dd HH:mm:ss'Z'"`) and converted to `America/New_York` timezone via Luxon.

## Environment Variables

Auth0:
- `AUTH0_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

Shopify:
- `SHOPIFY_STORE_DOMAIN` (your-store.myshopify.com)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (Storefront API token)

## Updating Fixtures

Fixture files live in `public/fixtures/`. Each competition has its own JSON file:

| File | Competition | Loaded by |
|------|-------------|-----------|
| `premier-league-25-26.json` | Premier League | `src/utils/events.ts` (local file read) |
| `fa-cup-25-26.json` | FA Cup | `src/utils/events.ts` (local file read) |
| `carabao-cup-25-26.json` | Carabao Cup | `src/utils/events.ts` (local file read) |
| `ucl-25-26.json` | UEFA Champions League | fetched from fixturedownload.com (fallback only) |

**Fixture object shape:**
```json
{
  "MatchNumber": 3,
  "RoundNumber": 6,
  "DateUtc": "2026-04-04 19:00:00Z",
  "Location": "Emirates Stadium",
  "HomeTeam": "Arsenal",
  "AwayTeam": "Southampton",
  "HomeTeamScore": null,
  "AwayTeamScore": null
}
```

**Time convention:** Match times are given by the user in **ET (Eastern Time)**. Convert to UTC before storing:
- EDT (Mar–Nov): ET + 4h → UTC (e.g. 3PM ET = 19:00 UTC)
- EST (Nov–Mar): ET + 5h → UTC (e.g. 3PM ET = 20:00 UTC)

**Adding a new match:**
1. Open the relevant fixture JSON file.
2. Append a new object. Increment `MatchNumber` sequentially. Set `RoundNumber` to the round (e.g. FA Cup R6 = Quarter-Final).
3. Leave `HomeTeamScore`/`AwayTeamScore` as `null` for upcoming matches (omit entirely for cup fixtures if not present).
4. If the opponent is new, add their colors to `src/constants/teamColors.ts`.

**Entering a result:** Set `HomeTeamScore` and `AwayTeamScore` to integer values.

## Development Notes

- Use TypeScript strict mode (enabled in tsconfig.json)
- Product images uploaded to Shopify admin; placeholder SVG at `public/images/placeholder-tshirt.svg`
- Recent Results section only appears for Premier League and UEFA Champions League events
- Apple Wallet pass feature is no longer linked from the UI (route still exists at `/pass`)
