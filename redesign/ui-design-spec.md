# Miami Gooners -- UI Design Specification

**Version:** 1.0
**Date:** 2026-02-28
**Author:** UI Design Team
**Status:** Ready for Engineering Handoff

---

## 1. Design Vision

**Aesthetic:** Premium editorial sports magazine -- inspired by The Athletic, Arsenal.com's matchday experience, and high-end football culture publications. The design should feel like holding a beautifully typeset matchday programme, not a generic sports fan site.

**Core Principles:**
- Bold, confident typography as the primary visual element
- Arsenal red (#FF0000) used as a precise accent, not a flood
- High contrast dark backgrounds with generous white space in content areas
- Editorial grid layouts that give content room to breathe
- Subtle motion and depth without gimmicks

---

## 2. Color Palette

### 2.1 Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `arsenal-red` | `#DB0007` | Primary brand accent -- buttons, links, key highlights. Slightly deeper than pure #FF0000 for better contrast and a more premium feel |
| `arsenal-red-light` | `#FF1A22` | Hover states on red elements, glowing accents |
| `arsenal-red-dark` | `#A30005` | Active/pressed states, dark-mode emphasis borders |
| `cannon-gold` | `#D4A843` | Secondary accent -- premium highlights, member badges, featured labels |
| `cannon-gold-light` | `#E8C96A` | Gold hover states |
| `cannon-gold-dark` | `#B08A2E` | Gold pressed states |

### 2.2 Neutral Scale (Dark Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0A0A0B` | Page background -- near-black with a slight warm undertone |
| `bg-elevated` | `#111113` | Card backgrounds, elevated surfaces |
| `bg-surface` | `#1A1A1E` | Secondary surfaces, input fields, accordions |
| `bg-surface-hover` | `#222228` | Hover state for surfaces |
| `bg-overlay` | `#2A2A32` | Modals, dropdowns, tooltips |
| `border-subtle` | `#2E2E38` | Subtle dividers, card borders |
| `border-default` | `#3A3A46` | Default borders, input outlines |
| `border-strong` | `#4A4A58` | Emphasized borders, active states |

### 2.3 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F5F5F7` | Primary body text, headings |
| `text-secondary` | `#A1A1AA` | Secondary info, captions, metadata |
| `text-tertiary` | `#71717A` | Placeholder text, disabled labels |
| `text-on-red` | `#FFFFFF` | Text placed on red backgrounds |
| `text-on-gold` | `#0A0A0B` | Text placed on gold backgrounds |

### 2.4 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Win indicators, in-stock status |
| `warning` | `#EAB308` | Draw indicators, low stock |
| `error` | `#EF4444` | Loss indicators, error states |
| `info` | `#3B82F6` | Informational badges, links in body text |

### 2.5 Gradient Definitions

```
hero-gradient:      linear-gradient(180deg, transparent 0%, rgba(10,10,11,0.4) 40%, rgba(10,10,11,0.95) 100%)
card-shine:         linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)
red-glow:           radial-gradient(circle at center, rgba(219,0,7,0.15) 0%, transparent 70%)
section-divider:    linear-gradient(90deg, transparent 0%, #DB0007 50%, transparent 100%)
```

---

## 3. Typography System

### 3.1 Font Families

**Primary (Headings):** `"Space Grotesk"` -- a geometric sans-serif with a technical, sporty edge. Bold weights feel commanding; lighter weights are clean and modern.
- Google Fonts: `Space+Grotesk:wght@400;500;600;700`
- Fallback: `system-ui, -apple-system, sans-serif`

**Secondary (Body):** `"Inter"` -- the current body font stays. It's highly legible, has excellent number rendering for scores/dates, and pairs well with Space Grotesk.
- Google Fonts: `Inter:wght@300;400;500;600;700`
- Fallback: `system-ui, -apple-system, sans-serif`

**Monospace (Scores/Countdown):** `"JetBrains Mono"` -- for match scores, countdowns, and data-centric elements. Gives a digital scoreboard feel.
- Google Fonts: `JetBrains+Mono:wght@400;500;700`
- Fallback: `ui-monospace, "Courier New", monospace`

### 3.2 Type Scale

| Level | Font | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing | Usage |
|-------|------|----------------|---------------|--------|-------------|----------------|-------|
| Display | Space Grotesk | 4rem / 64px | 2.5rem / 40px | 700 | 1.05 | -0.03em | Hero headlines, page titles |
| H1 | Space Grotesk | 3rem / 48px | 2rem / 32px | 700 | 1.1 | -0.025em | Section headers ("Upcoming Matches") |
| H2 | Space Grotesk | 2.25rem / 36px | 1.75rem / 28px | 700 | 1.15 | -0.02em | Sub-section headers ("Shop") |
| H3 | Space Grotesk | 1.5rem / 24px | 1.25rem / 20px | 600 | 1.2 | -0.015em | Card titles, product names |
| H4 | Space Grotesk | 1.25rem / 20px | 1.125rem / 18px | 600 | 1.25 | -0.01em | Sub-headings, labels |
| Body Large | Inter | 1.125rem / 18px | 1rem / 16px | 400 | 1.6 | 0 | Lead paragraphs, descriptions |
| Body | Inter | 1rem / 16px | 0.9375rem / 15px | 400 | 1.6 | 0 | Default body text |
| Body Small | Inter | 0.875rem / 14px | 0.8125rem / 13px | 400 | 1.5 | 0.005em | Secondary info, metadata |
| Caption | Inter | 0.75rem / 12px | 0.75rem / 12px | 500 | 1.4 | 0.02em | Labels, timestamps, badges |
| Score | JetBrains Mono | 1.25rem / 20px | 1rem / 16px | 700 | 1.2 | 0.05em | Match scores |
| Countdown | JetBrains Mono | 0.875rem / 14px | 0.75rem / 12px | 500 | 1 | 0.08em | Days until match, timers |

### 3.3 Text Transform Rules

- Section headers (H1): Uppercase with wide letter-spacing (`text-transform: uppercase; letter-spacing: 0.15em`)
- Match opponent names on event cards: Uppercase (already done)
- Navigation links: Uppercase, Caption size, wide letter-spacing
- Button text: Uppercase, 600 weight, 0.05em letter-spacing
- Competition labels: Uppercase, Caption size

---

## 4. Spacing System

**Base unit:** 4px
**Primary scale:** multiples of 8px (8, 16, 24, 32, 40, 48, 64, 80, 96, 120)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight padding, icon gaps |
| `space-2` | 8px | Inline element gaps, compact padding |
| `space-3` | 12px | Small component internal padding |
| `space-4` | 16px | Default component padding, grid gutter (mobile) |
| `space-5` | 20px | -- |
| `space-6` | 24px | Card content padding, section sub-gaps |
| `space-8` | 32px | Grid gutter (desktop), section internal spacing |
| `space-10` | 40px | Medium section spacing |
| `space-12` | 48px | Section padding (mobile) |
| `space-16` | 64px | Section padding (desktop) |
| `space-20` | 80px | Large section breaks |
| `space-24` | 96px | Hero content vertical spacing |
| `space-32` | 128px | Maximum vertical section separation |

### 4.1 Grid System

- **Container max-width:** 1200px (matches current `maxWidth="lg"`)
- **Grid columns:** 12-column grid
- **Gutter:** 24px (mobile), 32px (desktop)
- **Edge padding:** 16px (mobile), 32px (tablet), 48px (desktop)
- **Event cards:** 2 columns on desktop (6/6), 1 column on mobile (12)
- **Shop product cards:** `repeat(auto-fill, minmax(320px, 1fr))` -- slight bump from 300px

---

## 5. Component Specifications

### 5.1 Navigation Bar (NEW)

**Replaces:** The floating icon cluster in top-right corner of hero sections.

**Layout:**
- Fixed position, top of viewport, full width
- Height: 64px (desktop), 56px (mobile)
- Background: `bg-primary` at 90% opacity with `backdrop-filter: blur(12px)`
- Border-bottom: 1px solid `border-subtle`
- Z-index: 50

**Content (left to right):**
- **Left:** "MIAMI GOONERS" wordmark in Space Grotesk 700, 1rem, uppercase, letter-spacing 0.2em. Color: `text-primary`. The "MIAMI" portion is `text-secondary` weight 400 and "GOONERS" is `arsenal-red` weight 700. No logo image -- purely typographic.
- **Right (desktop):** Horizontal nav links: `MATCHES` | `SHOP` | social icons (Instagram, X, Mail) at 20px size. Links in Inter 500, 0.75rem, uppercase, letter-spacing 0.1em, color `text-secondary`, hover `text-primary`. Active link has a 2px `arsenal-red` underline, offset 4px below text.
- **Right (mobile):** Hamburger icon (3 horizontal lines, 20px wide, 2px thick, `text-primary`). Opens a full-screen overlay menu with links stacked vertically, centered, in H3 size.

**Behavior:**
- Transparent on hero sections when scrolled to top (no background, no border)
- Transitions to opaque background after scrolling past hero (transition: 300ms ease)
- Stays fixed on scroll

### 5.2 Hero Section (Redesigned)

**Home Hero:**
- Height: 100vh (full viewport) -- increased from 70vh for more impact
- Background: current photo (`background-2.jpeg`) with `hero-gradient` overlay on top
- 3D Scene stays, rendered at same position but with height adjusted to 100
- Content layout: vertically centered, left-aligned within the container (not centered)
- **Headline:** "MIAMI GOONERS" in Display size, `text-primary`, stacked:
  - Line 1: "MIAMI" -- `text-secondary` color, lighter weight (400)
  - Line 2: "GOONERS" -- `arsenal-red` color, bold (700)
- **Subheadline:** "Arsenal's Official Supporters Club in Miami" -- Body Large, `text-secondary`, positioned below headline with `space-4` gap
- **CTA Section:** Two buttons side by side, `space-4` gap, below subheadline with `space-8` gap:
  - Primary: "NEXT MATCH" -- filled red button
  - Secondary: "VISIT SHOP" -- outlined white button
- **Scroll indicator:** Subtle animated chevron at bottom center, `text-tertiary`, bouncing animation (translateY 0 to 8px, 2s ease infinite)
- Remove the floating social icon cluster entirely -- it moves to the nav bar

**Shop Hero:**
- Height: 50vh (bumped from 40vh)
- Same background treatment as home hero
- 3D Scene with height 50
- Content: "SHOP" in Display size, centered, `text-primary`
- Below it: "Official Miami Gooners Merchandise" in Body Large, `text-secondary`

### 5.3 Event Cards (Redesigned -- Editorial Style)

**Current issues:** Generic MUI Card with flat colored CardMedia header. Functional but bland.

**New Design -- "Matchday Programme" style:**

**Card Container:**
- Background: `bg-elevated`
- Border: 1px solid `border-subtle`
- Border-radius: `radius-lg` (12px)
- Overflow: hidden
- Hover: border transitions to `border-default`, card lifts with `shadow-card-hover`, subtle scale(1.01) transform over 200ms
- Transition: all 200ms ease

**Card Layout (stacked, top to bottom):**

1. **Color Band (top):**
   - Height: 6px
   - Background: opponent's primary team color (from teamColors.ts)
   - Full width, no border radius (card handles clipping)

2. **Match Header Zone:**
   - Padding: `space-6` all sides
   - Layout: flex row, space-between, align-center
   - Left side:
     - Competition badge: `caption` size, uppercase, `cannon-gold` text, `cannon-gold` 10% opacity background, 4px padding horizontal, 2px radius. E.g., "PREMIER LEAGUE"
   - Right side:
     - Countdown (future events): JetBrains Mono `countdown` size, `arsenal-red` color, e.g., "3 DAYS"
     - Result badge (past events): Monospace `score` size. "W" badge has `success` background, "D" has `warning` background, "L" has `error` background. White text, 4px border-radius, padding 4px 8px.

3. **Opponent Name Zone:**
   - Padding: 0 `space-6` `space-4` `space-6`
   - Opponent name: H2 size (Space Grotesk 700), `text-primary`, uppercase
   - Home/Away indicator: Caption size, `text-tertiary`, uppercase, immediately after the name with `space-2` left gap. E.g., "CHELSEA" then small "(H)" or "(A)"

4. **Match Score (past events only):**
   - Padding: 0 `space-6` `space-4` `space-6`
   - JetBrains Mono, `score` size, `text-primary`
   - Format: "3 - 1" with generous spacing between numbers and dash

5. **Match Details Zone:**
   - Padding: 0 `space-6` `space-6` `space-6`
   - Border-top: 1px solid `border-subtle`
   - Margin-top: `space-4`
   - Padding-top: `space-4`
   - Layout: flex row, space-between
   - Left: Date and time in Body Small, `text-secondary`. Format stays "Saturday, 3/15 12:30PM"
   - Right: Location in Body Small, `text-tertiary`

6. **RSVP Action (future events with rsvpLink):**
   - Padding: `space-4` `space-6` `space-6` `space-6`
   - Full-width button: "RSVP FOR THIS MATCH" -- primary filled button, medium size

**Past Event Card Modifications:**
- Overall card opacity: 0.7 (restored to 1.0 on hover)
- Color band still shows team color
- No countdown, shows result badge instead
- If `event.image` exists, render it as a subtle background image behind the card with low opacity (0.08) and grayscale filter

### 5.4 Events Section (Redesigned)

**Section Title:**
- "UPCOMING MATCHES" in H1 style (uppercase, wide letter-spacing)
- Color: `text-primary`
- Below: a thin horizontal line, 80px wide, 2px tall, `arsenal-red`, left-aligned
- Spacing: `space-16` top padding, `space-8` below the red line before content

**Past Matches Accordion:**
- Header: "RECENT RESULTS" in H1 style, same treatment
- Accordion expand icon: `arsenal-red`
- Default: collapsed (changed from expanded)
- Transition: smooth height animation 300ms

**Intro Text Block (above matches):**
- "The official Arsenal Supporters Branch in Miami, FL" -- H3 weight 400, `text-secondary`
- "We watch all matches at **the Bar** in Coral Gables." -- Body Large, `text-secondary`, with "the Bar" as a link in `arsenal-red`
- Social links inline: "Follow us on Instagram or X for the latest info."
- Below: `space-10` before the matches grid

**Layout:**
- Upcoming matches use the 2-column grid (unchanged)
- Consider: if there are 3 or fewer upcoming matches, display them larger (single column, more detail)

### 5.5 Shop Product Cards (Redesigned)

**Card Container:**
- Background: `bg-elevated`
- Border: 1px solid `border-subtle`
- Border-radius: `radius-lg` (12px)
- Overflow: hidden
- Hover: same treatment as event cards

**Layout:**

1. **Image Area:**
   - Aspect ratio: 4:5 (taller product shots look better than square)
   - Object-fit: cover
   - Background: `bg-surface` (placeholder color while loading)
   - On hover: subtle scale(1.05) zoom on the image (overflow hidden on card clips it)
   - Transition: transform 400ms ease

2. **Content Area:**
   - Padding: `space-6`
   - Product title: H3 (Space Grotesk 600), `text-primary`
   - Description: Body Small, `text-secondary`, max 2 lines with `line-clamp-2`
   - Below description, `space-4` gap

3. **Variant Chips:**
   - Only show size chips (not all options) to keep it clean
   - Chip style: `bg-surface` background, `text-secondary`, `border-subtle` border, Caption size
   - Out-of-stock: strikethrough text, 40% opacity
   - Gap between chips: `space-2`

4. **Price + Action Row:**
   - Margin-top: auto (pushes to bottom of flex column)
   - Padding-top: `space-4`
   - Border-top: 1px solid `border-subtle`
   - Left: Price in H4 (Space Grotesk 600), `arsenal-red`
   - Right: "VIEW" text-button style, `text-secondary`, hover `text-primary`, uppercase caption size with right arrow icon

### 5.6 Footer (Expanded)

**Current:** Minimal single-line footer with copyright and two policy links.

**New Layout:**
- Background: `bg-elevated`
- Border-top: 1px solid `border-subtle`
- Padding: `space-16` top, `space-12` bottom

**Content (3-column grid on desktop, stacked on mobile):**

**Column 1 -- Brand:**
- "MIAMI GOONERS" wordmark (same treatment as navbar)
- Below: "Arsenal's Official Supporters Club in Miami, FL" -- Body Small, `text-secondary`
- Below: "We watch all matches at The Bar in Coral Gables" -- Body Small, `text-tertiary`

**Column 2 -- Quick Links:**
- Header: "LINKS" -- Caption, uppercase, `text-tertiary`, letter-spacing 0.1em
- Below, with `space-3` gaps:
  - Matches (anchor to matches section)
  - Shop (/shop)
  - Arsenal America (external link)
  - Apple Wallet Pass (/pass)
- Link style: Body Small, `text-secondary`, hover `text-primary`, transition 200ms

**Column 3 -- Connect:**
- Header: "FOLLOW US" -- Caption, uppercase, `text-tertiary`, letter-spacing 0.1em
- Social icons row: Instagram, X/Twitter, Email -- 24px icons, `text-secondary`, hover `arsenal-red`, `space-4` gaps
- Below: "info@miamigooners.com" -- Body Small, `text-secondary`

**Bottom Bar:**
- Border-top: 1px solid `border-subtle`
- Margin-top: `space-8`
- Padding-top: `space-6`
- Flex row, space-between
- Left: "(c) 2026 Miami Gooners. All rights reserved." -- Caption, `text-tertiary`
- Right: "Privacy Policy" | "Return Policy" -- Caption, `text-tertiary`, hover `text-secondary`, separated by a `border-subtle` colored " | "

### 5.7 Buttons

**Primary (Filled):**
- Background: `arsenal-red`
- Text: `text-on-red`, Inter 600, uppercase, 0.05em letter-spacing
- Padding: 12px 24px (medium), 10px 20px (small)
- Border-radius: `radius-md` (8px)
- Hover: `arsenal-red-light` background, subtle lift shadow
- Active: `arsenal-red-dark` background
- Transition: all 150ms ease
- No MUI ripple effect -- use a subtle brightness change instead

**Secondary (Outlined):**
- Border: 1.5px solid `text-primary`
- Text: `text-primary`, same font treatment
- Background: transparent
- Hover: `text-primary` background, `bg-primary` text (invert)
- Active: `text-secondary` background

**Ghost (Text Button):**
- No border, no background
- Text: `text-secondary`
- Hover: `text-primary`
- Underline on hover (subtle, 1px)

### 5.8 Loading Skeleton

- Background: `bg-surface`
- Shimmer animation: a horizontal gradient sweep of `bg-surface-hover` opacity moving left to right over 1.5s, infinite
- Border-radius should match the element being loaded
- Event card skeleton: full card shape with internal blocks for each zone

---

## 6. Elevation & Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | `none` | Default state for most elements |
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)` | Resting card state |
| `shadow-card-hover` | `0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)` | Hovered cards |
| `shadow-nav` | `0 1px 3px rgba(0,0,0,0.2)` | Navigation bar when opaque |
| `shadow-overlay` | `0 16px 48px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `shadow-red-glow` | `0 0 20px rgba(219,0,7,0.2)` | Red accent glow on important CTAs |

---

## 7. Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Chips, badges, small elements |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Large containers, hero overlays |
| `radius-full` | 9999px | Pills, avatars, circular elements |

---

## 8. MUI Theme Override Map

This maps design tokens to MUI `createTheme` overrides. The engineer should update `src/theme.ts` with these values.

```typescript
// Conceptual structure -- not literal code, but shows what needs to change

createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#DB0007',        // arsenal-red (changed from #FF0000)
      light: '#FF1A22',       // arsenal-red-light
      dark: '#A30005',        // arsenal-red-dark
    },
    secondary: {
      main: '#D4A843',        // cannon-gold
      light: '#E8C96A',
      dark: '#B08A2E',
    },
    background: {
      default: '#0A0A0B',     // bg-primary
      paper: '#111113',       // bg-elevated
    },
    text: {
      primary: '#F5F5F7',     // text-primary
      secondary: '#A1A1AA',   // text-secondary
      disabled: '#71717A',    // text-tertiary
    },
    success: { main: '#22C55E' },
    warning: { main: '#EAB308' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
    divider: '#2E2E38',       // border-subtle
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',       // 48px desktop
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',    // 36px
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',     // 24px
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',    // 20px
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',       // 16px
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',   // 14px
      lineHeight: 1.5,
      letterSpacing: '0.005em',
    },
    caption: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    button: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,          // radius-md as default
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',  // remove MUI default gradient
          backgroundColor: '#111113',
          border: '1px solid #2E2E38',
          borderRadius: 12,
          transition: 'all 200ms ease',
          '&:hover': {
            borderColor: '#3A3A46',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#FF1A22',
          },
        },
        outlinedPrimary: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '0.75rem',
          height: 28,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2A2A32',
          fontSize: '0.75rem',
          borderRadius: 4,
          padding: '6px 12px',
        },
      },
    },
  },
})
```

---

## 9. Tailwind CSS Token Extensions

Update `styles/globals.css` `@theme` block:

```css
@theme {
  /* Colors */
  --color-arsenal-red: #DB0007;
  --color-arsenal-red-light: #FF1A22;
  --color-arsenal-red-dark: #A30005;
  --color-cannon-gold: #D4A843;
  --color-bg-primary: #0A0A0B;
  --color-bg-elevated: #111113;
  --color-bg-surface: #1A1A1E;
  --color-bg-surface-hover: #222228;
  --color-border-subtle: #2E2E38;
  --color-border-default: #3A3A46;
  --color-text-primary: #F5F5F7;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #71717A;

  /* Fonts */
  --font-heading: "Space Grotesk", system-ui, -apple-system, sans-serif;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "Courier New", monospace;
}
```

Note: Keep `--color-gooner-red` as an alias to `--color-arsenal-red` during migration to avoid breaking existing Tailwind classes, then remove it.

---

## 10. Animation & Motion Guidelines

| Element | Property | Duration | Easing | Notes |
|---------|----------|----------|--------|-------|
| Card hover | transform, border-color, box-shadow | 200ms | ease | translateY(-2px), scale(1.01) |
| Button hover | background-color | 150ms | ease | Brightness shift, no MUI ripple |
| Nav background | background-color, border-color | 300ms | ease | Transparent to opaque on scroll |
| Product image zoom | transform | 400ms | ease | scale(1.05) on card hover |
| Accordion expand | height | 300ms | ease-in-out | Smooth content reveal |
| Link hover | color | 200ms | ease | Color transitions |
| Page transition | opacity | 200ms | ease | Fade between routes |
| Hero scroll indicator | transform | 2000ms | ease | Infinite bounce, translateY(0 to 8px) |
| Skeleton shimmer | background-position | 1500ms | linear | Infinite, horizontal sweep |

**General motion rule:** Prefer transform and opacity animations for performance. Never animate width/height directly on complex layouts. Keep all transitions under 400ms for responsiveness.

---

## 11. Responsive Breakpoints

Use the existing MUI/Tailwind breakpoints:

| Breakpoint | Width | Key layout changes |
|------------|-------|-------------------|
| Mobile | < 600px | Single column, hamburger nav, compact cards, reduced type scale |
| Tablet | 600-899px | Two-column event grid, full nav begins |
| Desktop | 900px+ | Full layout, all columns, maximum type scale |
| Wide | 1200px+ | Content constrained to container max-width |

---

## 12. Accessibility Notes

- All color combinations must meet WCAG 2.1 AA contrast ratio (4.5:1 for body text, 3:1 for large text)
- `text-primary` (#F5F5F7) on `bg-primary` (#0A0A0B) = 18.8:1 ratio (passes AAA)
- `text-secondary` (#A1A1AA) on `bg-primary` (#0A0A0B) = 8.3:1 ratio (passes AA)
- `arsenal-red` (#DB0007) on `bg-primary` (#0A0A0B) = 4.7:1 ratio (passes AA for large text; use only for headings/large elements or add underline for links)
- `text-tertiary` (#71717A) on `bg-primary` (#0A0A0B) = 4.6:1 ratio (passes AA for large text; acceptable for decorative/non-essential text only)
- Focus outlines: 2px solid `arsenal-red`, offset 2px
- Interactive elements minimum touch target: 44x44px
- Motion: respect `prefers-reduced-motion` -- disable all non-essential animations

---

## 13. Implementation Priority

1. **Phase 1 -- Foundation:** Theme file updates (colors, typography, MUI overrides), font loading, Tailwind tokens, navigation bar component
2. **Phase 2 -- Core Pages:** Hero section redesign, event cards redesign, events section layout
3. **Phase 3 -- Shop & Polish:** Shop product cards, footer expansion, loading states, hover interactions
4. **Phase 4 -- Refinement:** Animation tuning, responsive testing, accessibility audit

---

## 14. File Change Summary

| File | Change Type | Description |
|------|------------|-------------|
| `src/font.ts` | Modify | Add Space Grotesk and JetBrains Mono font imports |
| `src/theme.ts` | Major rewrite | Full palette, typography, component overrides per Section 8 |
| `styles/globals.css` | Modify | Update @theme tokens per Section 9 |
| `src/Hero.tsx` | Major rewrite | Full-viewport hero, new layout, remove floating icons |
| `src/ShopHero.tsx` | Major rewrite | New layout, remove floating icons |
| `src/Event.tsx` | Major rewrite | Editorial card design per Section 5.3 |
| `src/AllEvents.tsx` | Moderate rewrite | New section headers, intro text, layout adjustments |
| `src/Footer.tsx` | Major rewrite | 3-column footer per Section 5.6 |
| `app/shop/ShopContent.tsx` | Moderate rewrite | Product card updates per Section 5.5 |
| NEW: `src/NavBar.tsx` | Create | New navigation bar component per Section 5.1 |
| `app/layout.tsx` | Modify | Add NavBar, update font className |
