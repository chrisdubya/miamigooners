# Miami Gooners UX Audit & Information Architecture Redesign

**Date:** February 2026
**Author:** UX Designer
**Scope:** Full UX audit of miamigooners.com with actionable redesign recommendations

---

## 1. Current UX Strengths

### What is working well

- **Cart persistence via localStorage** -- The CartContext already saves to `localStorage` under the key `miami-gooners-cart` and reloads on mount. Cart state survives page refreshes and browser restarts. This is solid.
- **Smart variant selection** -- Product detail pages auto-select the first available variant on load, and out-of-stock variants are visually struck through with `line-through` + reduced opacity. This prevents frustration.
- **Dynamic team color system** -- Event cards dynamically pull opponent colors from `teamColors.ts` for the card header, giving each match visual identity. The light-color detection logic (checking for `#fff`, `rgba(255,255,255,1)`, etc.) to flip text to black is a smart contrast safeguard.
- **Countdown timers** -- Each upcoming event card shows "X days" or "Today" in the top-right, giving fans immediate urgency context.
- **Timezone handling** -- All dates are stored in UTC and converted to `America/New_York` via Luxon. Users always see local Miami times. This is correct.
- **RSVP integration** -- Events with an `rsvpLink` show a clear RSVP button positioned at the top-left of the card.
- **Server Component architecture** -- The home page (`app/page.tsx`) and shop page (`app/shop/page.tsx`) are Server Components that fetch data, then delegate rendering to client components. This keeps the data-fetching fast and SEO-friendly.
- **Loading skeleton** -- `EventsSkeleton` provides a meaningful placeholder during Suspense loading, not a blank screen.
- **Structured data / SEO** -- The root layout includes JSON-LD schema for `SportsClub`, OpenGraph tags, and Twitter cards. Good foundation.

---

## 2. UX Issues Found

### Critical Issues

1. **Icon-only navigation with no labels** -- The Hero and ShopHero components render 4-5 icon buttons (Instagram, X, Mail, Store, Home) in a floating box in the top-right corner. There are no text labels. On mobile, users must hover (impossible on touch) or guess what each icon does. The WhatsApp icon is imported but no WhatsApp link is rendered. The tooltip-only approach fails entirely on touch devices.

2. **No persistent navigation bar** -- There is no global navbar. Navigation lives inside Hero components that are unique to each page. If a user scrolls past the hero, there is no way to navigate without scrolling back up. Shop sub-pages (product detail, cart) inherit `ShopHero` which is 40vh tall -- that is still 40% of the viewport consumed by a decorative hero before any content appears.

3. **No way to filter or search events** -- `AllEvents.tsx` shows all upcoming events in chronological order. There is no filtering by competition (Premier League, UCL, FA Cup, Carabao Cup, friendlies). With 38+ PL matches plus cup competitions, this is a long undifferentiated list.

4. **Past events are invisible** -- The `AllEvents` component filters to only show events where `eventDate >= today`. Past results are completely hidden. There is no "Results" or "Past Matches" section. Users cannot look back at scores.

5. **70vh hero pushes content below the fold** -- The home page hero is 70% of the viewport height. On a 900px-tall screen, that is 630px of background image + rotating 3D logo before any match information appears. The most important content (next match, upcoming fixtures) requires scrolling to see.

6. **No "Next Match" prominence** -- The most important piece of information for a supporters club -- "when is the next match and where are we watching?" -- is buried in the event list below the fold. There should be a prominent next-match callout.

7. **3D scene blocks interaction on mobile** -- The `Scene` component renders a full-viewport Three.js canvas with `OrbitControls`. This intercepts touch events, making it hard to scroll past the hero on mobile. The 3D logo, while visually interesting, is a usability barrier.

8. **Duplicate navigation content** -- Hero.tsx and ShopHero.tsx duplicate almost identical icon navigation code. The links differ slightly (Home page hero has no Home icon; Shop hero has Home but also has Shop). This is fragile and inconsistent.

9. **No breadcrumbs on shop sub-pages** -- Product detail pages have a "Back to Shop" button but no breadcrumb trail. Cart page has the same. The user has no sense of where they are in the site hierarchy.

10. **`alert()` for checkout errors** -- The cart page uses `alert('Error creating cart')` and `alert('Your cart is empty')` for error handling. These are jarring, non-branded, and unusable on mobile. Should be inline error messages or toast notifications.

11. **Product detail uses `dangerouslySetInnerHTML`** -- The product description renders raw HTML from Shopify. While this is typical for Shopify integrations, there is no sanitization visible. Additionally, the rendered HTML will inherit page styles unpredictably.

12. **Event cards use `index` as React key** -- In `AllEvents.tsx` line 117: `<Event key={index} ...>`. This causes incorrect re-renders when the event list changes. Should use a unique event identifier.

---

## 3. Navigation Redesign

### Current State

Navigation is a floating box of icon-only links positioned `absolute top-4 right-4` inside each Hero component. Each page has its own hero with its own copy of the navigation.

### Problems
- Not discoverable (icons only, no labels)
- Not persistent (disappears on scroll)
- Duplicated across Hero and ShopHero
- No cart indicator on home page
- No way to access shop from within the events section

### Proposed: Slim Fixed Top Navbar

```
+--------------------------------------------------------------+
| [Logo/Wordmark]    Matches    Shop    About    [Cart Badge]  |
+--------------------------------------------------------------+
```

**Desktop (>=768px):**
- Fixed position, top of viewport, full width
- Height: 56-64px
- Background: `rgba(0, 0, 0, 0.95)` with `backdrop-filter: blur(8px)`
- Left: Miami Gooners logo (small, ~32px) + "MIAMI GOONERS" wordmark
- Center/Right: Text navigation links -- "Matches", "Shop"
- Far Right: Cart icon with badge count (from CartContext) + Social icons (smaller, grouped)
- On scroll: subtle bottom border or shadow appears to indicate the bar is fixed
- The navbar should be a single component in `app/layout.tsx`, not duplicated per page

**Mobile (<768px):**
- Same fixed bar but compressed: Logo on left, hamburger menu icon on right, cart badge next to hamburger
- Hamburger opens a full-screen drawer/overlay with:
  - Navigation links (Matches, Shop) as large touch targets (48px+ height)
  - Social links (Instagram, X, Email) with both icon and label
  - "RSVP to Next Match" prominent CTA if a match is upcoming
- Drawer closes on link click or swipe

**Implementation notes:**
- Extract into `src/Navbar.tsx` as a `'use client'` component
- Uses `useCart()` to display cart badge count
- Uses `usePathname()` to highlight active route
- Renders in `app/layout.tsx` above `{children}` so it is present on every page
- Add `scroll-padding-top: 64px` to body to account for fixed nav

### Social Links
Move social icons (Instagram, X, Email) to the footer as the primary location. In the navbar, optionally include them as small icons (20px) grouped at the far right on desktop, or in the mobile drawer. They are secondary actions and should not compete with primary navigation.

---

## 4. Home Page Flow Improvements

### Current Flow
```
[Hero - 70vh, background image + 3D logo + icon nav]
[Accordion: "Upcoming Matches" - always expanded]
  [Grid of event cards - all upcoming, chronological]
[Footer]
```

### Problems
- Hero is 70vh of visual spectacle with zero information
- Most important content (next match) is below the fold
- No club identity messaging beyond the 3D logo
- No "about" content for new visitors
- No call to action

### Proposed New Home Page Flow

```
[Navbar - 64px, fixed]

[Hero Section - 50vh max]
  - Background: group photo with dark overlay
  - 3D logo scene (reduced height, positioned to one side or centered smaller)
  - Overlay text: "MIAMI GOONERS" + "Official Arsenal Supporters Club"
  - NO navigation icons here (moved to navbar)

[Next Match Callout - prominent strip below hero]
  - Full-width section, dark background with red accent
  - Shows: opponent name + crest colors, date/time, "X days away", venue
  - Large RSVP button
  - Apple Wallet "Add to Wallet" button
  - If match is TODAY: pulsing "MATCHDAY" indicator

[Upcoming Matches Section]
  - Section heading: "Upcoming Matches"
  - Filter chips/tabs: All | Premier League | UCL | FA Cup | Carabao Cup
  - Grid of event cards (6 visible, "Show More" or auto-load)
  - Default: shows next 6 upcoming matches across all competitions

[Recent Results Section - NEW]
  - Section heading: "Recent Results"
  - Shows last 3-5 completed matches with scores (W/L/D badges)
  - Collapsed by default on mobile, visible on desktop
  - "View All Results" link

[About / Join Section - NEW]
  - Brief section: "Who We Are"
  - 2-3 sentences about the club
  - "We watch all matches at The Bar in Coral Gables"
  - Photo from a match day
  - CTA: "Follow us on Instagram" + "Join the WhatsApp Group"

[Footer - expanded]
```

### Why this is better
- Next match is visible within the first scroll or without scrolling at all
- New visitors immediately understand what the club is
- Filter chips let returning fans find specific competitions
- Past results give the site ongoing relevance after match days
- Clear information hierarchy: next match > upcoming > results > about

---

## 5. Events Section Improvements

### 5a. Competition Filtering

Add filter tabs or chips above the event grid:

```
[All] [Premier League] [Champions League] [FA Cup] [Carabao Cup]
```

- Each event already has a `competition` field in the data
- Filter chips use MUI `Chip` with `onClick` -- active chip is filled, inactive is outlined
- "All" is selected by default
- Filter state is local (useState), no URL needed
- Count badges on each chip (e.g., "Premier League (32)") are optional but helpful

### 5b. Separate Past and Upcoming

Split into two sections:

**Upcoming Matches** (default expanded)
- Sorted chronologically, soonest first
- Shows RSVP button, countdown timer, Apple Wallet link
- The first card (next match) should be visually larger or highlighted

**Recent Results** (collapsed on mobile, visible on desktop)
- Sorted reverse-chronologically, most recent first
- Shows score with W/L/D badge
- Event image as desaturated background (the existing `past && event.image` grayscale treatment is good, keep it)
- No RSVP button (already past)
- No countdown timer

### 5c. Event Card Improvements

Current cards show:
- Colored header with opponent name + [H]/[A]
- Competition label (italic, small)
- Score (if past)
- Date/time
- Location
- RSVP button (top-left, small)
- Countdown (top-right)

Proposed improvements:
- Make the RSVP button more prominent -- move to the card footer as a full-width or near-full-width button
- Add opponent team crest/badge image if available (future enhancement)
- Show "HOME" or "AWAY" as a small chip/badge instead of `[H]`/`[A]` appended to the name
- Add an "Add to Calendar" or "Add to Wallet" link on each card
- On click/tap, expand the card to show: venue details, a Google Maps link, the Apple Wallet pass button
- Competition label should be a colored chip (e.g., purple for PL, blue for UCL) instead of plain italic text

### 5d. Event List Skeleton

The `EventsSkeleton` renders 6 skeleton cards in a 3-column grid (`xs:12, sm:6, md:4`), but the actual events render in a 2-column grid (`xs:12, md:6`). These should match for a smoother loading transition.

---

## 6. Shop UX Improvements

### 6a. Product Discovery

**Current:** Products are displayed in a simple grid with title, description, variant chips, price, and "View Details" button.

**Issues:**
- No product categories or filtering
- No search
- Description text can be long and pushes the price/button down inconsistently
- Variant chips on the listing page are informational only -- they do not filter or select

**Recommendations:**
- If there are fewer than 10 products, the current grid is fine -- no need for search/filter yet
- Limit product description to 2-3 lines on the listing page with text truncation (`-webkit-line-clamp: 3`)
- Remove variant chips from the listing page -- they add visual noise. Show "X sizes available" as a one-line summary instead
- Make the entire card clickable (wrap in a link), not just the "View Details" button

### 6b. Cart UX

**Current strengths:** Cart persists in localStorage, quantity +/- buttons work, subtotal calculates correctly, order summary sidebar is clean.

**Issues:**
- `alert()` for errors -- replace with MUI `Snackbar` or inline error `Typography`
- No "Continue Shopping" link at the bottom of a non-empty cart (only exists on empty cart)
- The cart page renders a 40vh ShopHero above the cart items. On a small screen, the user scrolls past 40% decorative content to see their cart. Consider removing the hero from the cart page entirely, or reducing to a minimal header strip.
- No estimated shipping information
- Clear Cart button has no confirmation -- one tap destroys the entire cart

**Recommendations:**
- Replace all `alert()` calls with toast notifications (MUI Snackbar with auto-hide)
- Add a "Continue Shopping" link in the cart view
- Add a confirmation dialog before "Clear Cart"
- Reduce or remove the hero on cart pages -- users are in a task flow and want to see their items immediately
- Consider a mini-cart drawer (slide-in from right) instead of a separate cart page, for quicker review without leaving the current page

### 6c. Checkout Flow

The checkout flow redirects to Shopify's hosted checkout. This is good for security and PCI compliance. No changes needed here, but the redirect should be communicated: "You'll be redirected to our secure checkout" messaging before the redirect occurs.

### 6d. Product Detail Page

**Current strengths:** Clean layout, image gallery, variant selector, add-to-cart with success feedback ("Added!" button state).

**Issues:**
- The variant selector label says "Size" but the `InputLabel` says "Size" while the underlying label prop says "Variant" -- these should match
- No "You may also like" or related products section
- No product reviews (acceptable if not available from Shopify)
- The `local-pickup` tag check for hiding "+ shipping" is smart, keep it

---

## 7. Mobile UX

### Critical Mobile Issues

1. **3D Canvas blocks touch scrolling** -- `OrbitControls` on the Three.js canvas captures touch events. Users may struggle to scroll past the hero. Fix: disable `OrbitControls` on mobile (`enableRotate={false}` for touch devices), or use `enablePan={false}` and `enableZoom={false}` (already set) and add touch-action CSS.

2. **70vh hero on mobile is excessive** -- On a phone (e.g., 844px height for iPhone 14), the hero consumes 591px. The entire above-the-fold content is a photo and spinning logo. Reduce to 40-50vh on mobile or use a fixed height like `max(280px, 40vh)`.

3. **Event cards are full-width on mobile (xs:12)** -- This is correct, but with many upcoming matches the page becomes extremely long. Consider showing only the next 4-6 matches on mobile with a "Show All" button.

4. **Cart item layout on mobile** -- The cart item card uses a horizontal flex layout with image (100px), details, and price side by side. On narrow screens (<375px), this can get cramped. The price column (`textAlign: right`) may overlap with the quantity controls.

5. **Touch targets** -- RSVP buttons in event cards use `size="small"` which produces touch targets smaller than the recommended 44x44px minimum. Increase to at least `size="medium"`.

6. **Font sizes** -- The "Upcoming Matches" heading uses `text-xl md:text-3xl`, which is fine. But the opponent name in event card headers uses `h4` variant (`1.5rem` on xs, `2.125rem` on md). On very long team names (e.g., "WOLVERHAMPTON WANDERERS[A]"), this may overflow or wrap awkwardly.

### Mobile Recommendations

- Reduce hero height on mobile to 40vh
- Add `touch-action: pan-y` to the 3D canvas container so vertical scrolling works
- Limit visible events on mobile to 6, with "Load More"
- Ensure all interactive elements are at least 44x44px
- Test on iPhone SE (375px width) -- smallest common viewport

---

## 8. Accessibility Audit

### Color Contrast Issues

1. **Red (#ff0000) on black background** -- The `text-gooner-red` class applies `#ff0000` on a dark/black background. WCAG AA requires a contrast ratio of 4.5:1 for normal text. `#ff0000` on `#000000` has a contrast ratio of only **~3.0:1** -- this **fails** AA for normal text. It passes for large text (3:1 ratio). Either lighten the red for body text (e.g., `#ff3333` or `#ff4444`) or use it only for large headings.

2. **Red on dark card backgrounds** -- MUI's dark theme card backgrounds are typically `#1e1e1e` or `#121212`. Red (`#ff0000`) on these has similar contrast issues.

3. **White text on light team colors** -- The `getCountdownColor` function checks for specific light colors and flips text to black, but the check is brittle (exact string matching for specific rgba values). Any new team with a light primary color that is not in the whitelist will get white text on a light background. Consider a luminance-based check instead: `if (luminance(color) > 0.5) return '#000'`.

4. **Link text colors** -- Links in `AllEvents.tsx` use `text-gooner-red` with no underline (except on hover). Users who cannot perceive color cannot distinguish links from regular text. Add an underline or other non-color indicator.

### Keyboard Navigation

5. **Icon-only nav links lack visible focus indicators** -- The MUI icon links in Hero/ShopHero have hover styles but no custom `:focus-visible` styling. Keyboard users cannot see which link is focused.

6. **Accordion keyboard support** -- MUI Accordion has built-in keyboard support (Enter/Space to toggle), which is good.

7. **Event card RSVP links** -- These open in new tabs (`target="_blank"`). They include `rel="noopener noreferrer"` which is correct. However, screen reader users should be informed the link opens in a new window. Add `aria-label="RSVP (opens in new tab)"`.

### Screen Reader Issues

8. **3D Canvas has no text alternative** -- The Three.js canvas renders a 3D logo. Screen readers see nothing. Add an `aria-label="Miami Gooners 3D animated logo"` to the canvas container and `role="img"`.

9. **Event card structure** -- Cards do not use semantic headings. The opponent name is an `h4` inside `CardMedia`, which is unusual. Consider restructuring so the card has a clear heading hierarchy.

10. **Image alt text** -- The hero background image has `alt="group photo"` which is generic. Should be more descriptive: `alt="Miami Gooners supporters gathered at The Bar for a match day"`.

### Motion

11. **No `prefers-reduced-motion` support** -- The 3D scene continuously rotates (`rotation.z += -0.01` every frame). The glitch animations in globals.css are defined but unused. When animations are added, all continuous motion should respect `prefers-reduced-motion: reduce` by stopping or reducing animation.

---

## 9. Content & Messaging

### Current State
- The site opens with a 70vh hero that has no text -- just a background photo and 3D logo
- The first text a user reads (below the fold) is: "The official Arsenal Supporters Branch in Miami, FL"
- Followed by: "We watch all matches at the Bar in Coral Gables..."
- The metadata/SEO title says "Official Arsenal FC Supporters Club"

### Issues
1. **No above-the-fold value proposition** -- A new visitor sees a photo and a spinning 3D logo. They have to scroll to understand what this site is about. The hero should communicate: who (Miami Gooners), what (Arsenal supporters club), where (Miami/Coral Gables), and what to do next (see upcoming matches, join us).

2. **"The official" claim is a link** -- The word "official" in the intro text links to arsenalamerica.com/branches. This is good for credibility but the link is not obvious (red italic text on dark background, easily missed).

3. **Venue name inconsistency** -- Some places say "the Bar" (lowercase b), the schema says "The Bar Gables", the Instagram handle is `@thebargables`. Standardize to a consistent name.

4. **No onboarding for new visitors** -- A first-time visitor has no context: What is this club? How do I join? Is there a membership? Do I just show up? A brief "About" or "Join Us" section would help.

5. **No WhatsApp link visible** -- The `WhatsApp` icon is imported in `Hero.tsx` but never rendered. If the club has a WhatsApp group, this is a high-value link that should be prominent (WhatsApp is the dominant messaging app in the Miami community).

6. **Shop messaging is minimal** -- The shop page title just says "Shop" with no supporting copy. Consider: "Official Miami Gooners merch. Support the club, rep the cannon."

### Recommendations
- Add a text overlay on the hero: "MIAMI GOONERS" as a large heading, "Official Arsenal Supporters Club in Miami" as a subtitle
- Add a brief "About" section on the home page with 2-3 sentences and a group photo
- Standardize venue name across all references
- If a WhatsApp group exists, add the link prominently (both in nav and in the About section)
- Add personality to shop copy -- this is a supporters club, it should feel passionate

---

## 10. Recommended New Page Structure

### Home Page (`app/page.tsx`)

```
<Navbar />                          -- NEW: persistent, fixed top bar

<HeroSection>                       -- MODIFIED: reduced height (50vh max)
  <BackgroundImage />               -- existing group photo
  <DarkOverlay />                   -- gradient overlay for text readability
  <Scene3D />                       -- existing 3D logo, reduced canvas size
  <HeroContent>                     -- NEW: text overlay
    <h1>"MIAMI GOONERS"</h1>
    <p>"Official Arsenal Supporters Club in Miami"</p>
  </HeroContent>
</HeroSection>

<NextMatchBanner />                 -- NEW: full-width strip, opponent colors
  <OpponentName />
  <DateTime />
  <Countdown />
  <RSVPButton />
  <WalletButton />

<UpcomingMatchesSection>            -- MODIFIED from AllEvents
  <SectionHeader>
    <h2>"Upcoming Matches"</h2>
    <CompetitionFilters />          -- NEW: chip/tab filters
  </SectionHeader>
  <EventGrid>                       -- existing grid, now filterable
    <EventCard />                   -- MODIFIED: improved card layout
    <EventCard />
    ...
    <ShowMoreButton />              -- NEW: pagination/lazy load
  </EventGrid>
</UpcomingMatchesSection>

<RecentResultsSection />            -- NEW
  <h2>"Recent Results"</h2>
  <ResultCards />                   -- compact result cards with scores

<AboutSection />                    -- NEW
  <h2>"Join Us on Match Day"</h2>
  <ClubDescription />
  <VenueInfo />
  <SocialLinks />

<Footer />                          -- MODIFIED: expanded
  <FooterNav />                     -- site links
  <SocialLinks />                   -- primary social link location
  <LegalLinks />                    -- privacy policy, return policy
  <Copyright />
```

### Shop Page (`app/shop/page.tsx`)

```
<Navbar />                          -- same global navbar, "Shop" highlighted

<ShopHeader>                        -- MODIFIED: replace 40vh hero with minimal header
  <h1>"Official Merch"</h1>
  <p>tagline</p>
</ShopHeader>

<ProductGrid>                       -- MODIFIED
  <ProductCard />                   -- cards are fully clickable links
    <ProductImage />
    <ProductTitle />
    <PriceLine />
    <AvailabilitySummary />         -- "5 sizes available" instead of chips
  ...
</ProductGrid>

<Footer />
```

### Product Detail Page (`app/shop/[productId]/page.tsx`)

```
<Navbar />                          -- same global navbar

<Breadcrumbs />                     -- NEW: "Shop > Product Name"

<ProductDetailLayout>               -- existing 2-column layout
  <ProductImageGallery />           -- existing
  <ProductInfo>
    <ProductTitle />
    <Price />
    <Description />
    <VariantSelector />             -- existing
    <AddToCartButton />             -- existing
    <StockStatus />                 -- existing
  </ProductInfo>
</ProductDetailLayout>

<Footer />
```

### Cart Page (`app/shop/cart/page.tsx`)

```
<Navbar />                          -- same global navbar

<Breadcrumbs />                     -- NEW: "Shop > Cart"

<CartLayout>                        -- NO hero section
  <CartItems>                       -- existing item list
    <CartItem />
    ...
    <ContinueShoppingLink />        -- NEW
  </CartItems>
  <OrderSummary>                    -- existing summary sidebar
    <Subtotal />
    <CheckoutButton />
    <ClearCartWithConfirm />        -- MODIFIED: adds confirmation
  </OrderSummary>
</CartLayout>

<Footer />
```

---

## Summary of Priorities

### Must-Have (P0)
1. Add a persistent global navbar with text labels, replacing icon-only hero navigation
2. Reduce hero height, add text overlay with club identity
3. Add a "Next Match" prominent callout above the event list
4. Fix red-on-black contrast ratio for body text (lighten the red or darken the background)
5. Fix 3D canvas touch scrolling issue on mobile
6. Replace `alert()` calls with proper UI notifications

### Should-Have (P1)
7. Add competition filter chips to the events section
8. Add a "Recent Results" section showing past match scores
9. Remove hero from cart page (task-focused flow)
10. Add breadcrumbs to shop sub-pages
11. Make product cards fully clickable
12. Add `prefers-reduced-motion` support for all animations
13. Fix skeleton grid to match actual event grid layout

### Nice-to-Have (P2)
14. Add an "About" / "Join Us" section on the home page
15. Add a mini-cart drawer instead of/alongside a full cart page
16. Add "Clear Cart" confirmation dialog
17. Add opponent team crest images to event cards
18. Add competition-colored badges to event cards
19. Expand the footer with site navigation and social links
