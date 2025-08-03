# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Miami Gooners is a Next.js website for the Miami Gooners Arsenal supporters club. The site displays Arsenal match fixtures, allows event RSVPs, and provides Apple Wallet passes for match events.

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
- **Framework**: Next.js 15+ with TypeScript
- **UI**: Material-UI (@mui/material) with Emotion for styling
- **3D Graphics**: Three.js with React Three Fiber
- **Authentication**: Auth0 (@auth0/nextjs-auth0)
- **Date Handling**: Luxon for timezone-aware date formatting
- **Styling**: Tailwind CSS + Emotion CSS-in-JS

### Project Structure

```
src/
├── AllEvents.tsx        # Main events listing component
├── Event.tsx           # Individual event card component
├── Hero.tsx            # Landing page hero section
├── Scene.tsx           # Three.js 3D scene component
├── constants/
│   ├── teamColors.ts   # Premier League team color definitions
│   └── images.ts       # Image asset constants
└── utils/
    └── createEmotionCache.ts  # Emotion cache configuration

pages/
├── api/
│   ├── events/index.ts    # Events API endpoint
│   └── passes/index.ts    # Apple Wallet pass generation
├── index.tsx              # Home page
└── pass/index.tsx         # Apple Wallet pass page

public/
├── fixtures/
│   └── premier-league-25-26.json  # Premier League fixture data
└── images/                        # Static assets
```

### Key Components

**Event.tsx**: Displays individual match cards with:
- Dynamic team colors from teamColors.ts
- Timezone conversion (UTC → America/New_York)
- Win/Loss/Draw result display
- RSVP button integration
- Past/future event styling

**Events API** (pages/api/events/index.ts):
- Combines pre-season friendlies with Premier League fixtures
- Reads fixture data from public/fixtures/premier-league-25-26.json
- Returns unified event structure with competition labels

### Team Colors System

The teamColors.ts file maps team names to primary/secondary colors for dynamic styling. When adding new teams, ensure both primary and secondary colors are defined. The Event component has special handling for light colors (#fff, rgba(255,255,255,1), rgba(108,171,221,1), rgba(253,185,19,1), #FFCD00) to ensure text contrast.

### Date & Time Handling

All match dates are stored in UTC format ("yyyy-MM-dd HH:mm:ss'Z'") and converted to America/New_York timezone for display using Luxon. The formatDuration function calculates days until match kickoff.

### Apple Wallet Integration

The site generates Apple Wallet passes for events using @walletpass/pass-js. Pass generation happens in pages/api/passes/index.ts.

## Environment Variables

Set up these Auth0 variables for authentication:
- AUTH0_SECRET
- AUTH0_BASE_URL  
- AUTH0_ISSUER_BASE_URL
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET

## Development Notes

- Use TypeScript strict mode (enabled in tsconfig.json)
- Material-UI components use Emotion for CSS-in-JS styling
- Three.js scenes are handled in Scene.tsx component
- Event images are stored in public/images/matchday-photos/
- Fixture data updates happen by modifying the JSON file in public/fixtures/