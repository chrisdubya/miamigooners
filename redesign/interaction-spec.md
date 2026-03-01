# Interaction Design Specification - Miami Gooners Redesign

This document defines all animations, 3D effects, micro-interactions, and motion design for the Miami Gooners website redesign. Each effect includes implementation details, code snippets, performance classification, and accessibility notes.

---

## 1. Enhanced 3D Hero Scene

The current `Scene.tsx` is minimal: a single GLB model rotating on Z-axis with ambient + directional lights and OrbitControls. The upgrades below transform it into an atmospheric, Arsenal-themed 3D experience.

### 1.1 Lighting Overhaul

**Concept**: Replace flat white lighting with moody, red-tinted atmospheric lighting that evokes the Arsenal matchday tunnel feel. A deep red key light from below, a cooler fill from above, and subtle rim lighting.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: No (static, not animation)

**Implementation** (replace existing lights in Scene.tsx):

```tsx
// Remove existing ambientLight and directionalLights. Replace with:
<ambientLight intensity={0.3} color="#1a0000" />

{/* Key light - deep Arsenal red from below-front */}
<pointLight
  position={[0, -3, 4]}
  intensity={8}
  color="#cc0000"
  distance={20}
  decay={2}
/>

{/* Fill light - cool blue-white from above-right */}
<directionalLight
  position={[3, 5, 2]}
  intensity={1.2}
  color="#4466aa"
/>

{/* Rim light - warm gold from behind-left for edge definition */}
<spotLight
  position={[-4, 2, -3]}
  intensity={3}
  color="#ff6600"
  angle={Math.PI / 6}
  penumbra={0.8}
  distance={15}
  decay={2}
/>

{/* Subtle ground bounce */}
<pointLight
  position={[0, -5, 0]}
  intensity={1.5}
  color="#330000"
  distance={10}
  decay={2}
/>
```

### 1.2 Environment Map / HDR Lighting

**Concept**: Add an environment map for realistic reflections on the logo model. Use `@react-three/drei`'s `Environment` component with a dark studio preset for subtle metallic reflections.

**Performance tier**: Medium
**Respects prefers-reduced-motion**: No (static)

```tsx
import { Environment } from '@react-three/drei'

// Inside Canvas Suspense:
<Environment preset="night" environmentIntensity={0.4} />
```

The `night` preset provides dark, moody reflections. If the GLB materials are metallic/standard PBR, they will pick up subtle environment reflections automatically. Alternative: use a custom HDR with `<Environment files="/path/to/arsenal-studio.hdr" />` for a branded look.

### 1.3 Bloom / Post-Processing

**Concept**: Add a bloom pass so the red lights create a soft glow halo around the logo. This sells the "lit from within" feel. Subtle -- not overwhelming.

**Performance tier**: Heavy (GPU shader pass)
**Respects prefers-reduced-motion**: Yes -- disable on reduced-motion and mobile

**Dependencies**: `@react-three/postprocessing`, `postprocessing`

```tsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Inside Canvas, after model and lights:
<EffectComposer>
  <Bloom
    luminanceThreshold={0.6}
    luminanceSmoothing={0.9}
    intensity={0.8}
    mipmapBlur
  />
  <Vignette
    offset={0.3}
    darkness={0.7}
    blendFunction={BlendFunction.NORMAL}
  />
</EffectComposer>
```

The `Vignette` darkens edges for a cinematic feel. Both effects combined weigh ~2-3ms per frame on modern GPUs. Disable the entire `EffectComposer` on mobile or reduced-motion.

### 1.4 Particle System (Floating Embers/Dust)

**Concept**: Red-orange embers / dust motes float slowly around the logo, like sparks from a stadium flare. Adds depth and atmosphere. Use instanced points for performance.

**Performance tier**: Medium (instanced geometry, ~200 particles)
**Respects prefers-reduced-motion**: Yes -- disable entirely

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200

function Particles() {
  const meshRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12      // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12  // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8   // z
    }
    return pos
  }, [])

  const speeds = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      y: 0.002 + Math.random() * 0.005,
      drift: (Math.random() - 0.5) * 0.001,
    }))
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArray[i * 3] += speeds[i].drift
      posArray[i * 3 + 1] += speeds[i].y
      // Reset particles that float too high
      if (posArray[i * 3 + 1] > 6) {
        posArray[i * 3 + 1] = -6
        posArray[i * 3] = (Math.random() - 0.5) * 12
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ff3300"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
```

### 1.5 Mouse-Tracking Model Tilt

**Concept**: Instead of OrbitControls (which let the user freely rotate -- not ideal for a hero), remove OrbitControls and add subtle mouse-tracking. The logo tilts slightly toward the cursor, giving a parallax-like 3D feel without user needing to click/drag.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- disable tilt, keep static position

```tsx
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF(MODEL_PATH)
  const modelRef = useRef<THREE.Object3D>(null)
  const { pointer } = useThree()

  // Smoothed target rotation
  const target = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    if (!modelRef.current) return

    // Base rotation (slow spin on Z)
    modelRef.current.rotation.z += -0.005

    // Mouse tracking - map pointer (-1..1) to a small tilt range
    target.current.x = pointer.y * 0.15  // vertical mouse -> X tilt
    target.current.y = pointer.x * 0.15  // horizontal mouse -> Y tilt

    // Smooth interpolation (lerp)
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      Math.PI * 0.5 + target.current.x,
      delta * 2
    )
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      target.current.y,
      delta * 2
    )
  })

  return (
    <primitive
      object={scene}
      scale={15}
      rotation-x={Math.PI * 0.5}
      ref={modelRef}
      position={[0, -1, 0]}
    />
  )
}
```

**Important**: Remove `<OrbitControls>` from the scene when using mouse tracking. OrbitControls conflicts with pointer-based tilt.

### 1.6 Scroll-Based Camera Zoom

**Concept**: As user scrolls down from the hero, the camera slowly pulls back (or pushes in), creating a sense of depth transition before the hero scrolls out of view.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- disable, keep static camera

```tsx
import { useFrame, useThree } from '@react-three/fiber'

function ScrollCamera() {
  const { camera } = useThree()

  useFrame(() => {
    // scrollY normalized to 0..1 over the hero height
    const scrollFraction = Math.min(window.scrollY / (window.innerHeight * 0.7), 1)
    camera.position.z = 5 + scrollFraction * 3  // pulls back from z=5 to z=8
    camera.position.y = scrollFraction * -1      // slight downward drift
  })

  return null
}

// Add <ScrollCamera /> inside Canvas Suspense
```

### 1.7 Complete Enhanced Scene Assembly

```tsx
'use client'
import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

export const Scene = ({ height }: { height: number }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="absolute inset-0 z-10" style={{ height: `${height}vh` }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Atmospheric lighting */}
          <ambientLight intensity={0.3} color="#1a0000" />
          <pointLight position={[0, -3, 4]} intensity={8} color="#cc0000" distance={20} decay={2} />
          <directionalLight position={[3, 5, 2]} intensity={1.2} color="#4466aa" />
          <spotLight position={[-4, 2, -3]} intensity={3} color="#ff6600" angle={Math.PI / 6} penumbra={0.8} />
          <pointLight position={[0, -5, 0]} intensity={1.5} color="#330000" distance={10} decay={2} />

          <Environment preset="night" environmentIntensity={0.4} />

          <Model reducedMotion={prefersReducedMotion} />
          {!prefersReducedMotion && <Particles />}
          {!prefersReducedMotion && <ScrollCamera />}

          {/* Post-processing - skip on reduced motion */}
          {!prefersReducedMotion && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur />
              <Vignette offset={0.3} darkness={0.7} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
```

### 1.8 Mobile Considerations for 3D Scene

On mobile devices (detect via viewport width or `navigator.userAgent`):
- Reduce `PARTICLE_COUNT` to 80
- Disable `EffectComposer` entirely (no bloom/vignette)
- Disable mouse-tracking tilt (no pointer on touch devices; could add device orientation tilt as stretch goal)
- Reduce `dpr` to `[1, 1.5]`
- Consider `frameloop="demand"` if the scene is static enough

---

## 2. Page Entrance Animations

### 2.1 Approach: CSS + Intersection Observer

Use CSS `@keyframes` with a custom React hook that adds an `in-view` class when elements enter the viewport. This avoids adding Framer Motion (~30kb) as a dependency. If the team prefers Framer Motion, an alternative approach is provided in section 2.4.

### 2.2 CSS Keyframes (add to globals.css)

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 2.3 Intersection Observer Hook

```tsx
// src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect() // Only trigger once
        }
      },
      { threshold: 0.1, ...options }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}
```

### 2.4 Staggered Event Card Animation

**Concept**: Event cards slide up and fade in, staggered by 80ms per card, as they enter the viewport.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- skip animation, render immediately

Apply to each `<Event>` wrapper in `AllEvents.tsx`:

```tsx
// Wrapper component for animated entrance
function AnimatedCard({ index, children }: { index: number; children: React.ReactNode }) {
  const { ref, isInView } = useInView()
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      ref={ref}
      style={{
        opacity: prefersReducedMotion || isInView ? 1 : 0,
        animation: isInView && !prefersReducedMotion
          ? `fadeSlideUp 0.5s ${index * 0.08}s ease-out forwards`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}
```

Usage in `AllEvents.tsx`:
```tsx
.map((event, index) => (
  <AnimatedCard key={index} index={index}>
    <Event index={index} event={event} />
  </AnimatedCard>
))
```

### 2.5 Shop Product Card Animation

Same pattern as event cards. Stagger by 100ms. Use `scaleIn` keyframe instead for a different feel:

```tsx
style={{
  animation: isInView && !prefersReducedMotion
    ? `scaleIn 0.4s ${index * 0.1}s ease-out forwards`
    : 'none',
}}
```

### 2.6 Section Heading Animation

Section headings ("Upcoming Matches", "Shop", etc.) fade in when entering viewport:

```tsx
style={{
  animation: isInView ? 'fadeIn 0.6s ease-out forwards' : 'none',
}}
```

### 2.7 Framer Motion Alternative

If the team prefers Framer Motion (more powerful, better orchestration, needed for page transitions anyway):

```bash
npm install framer-motion
```

```tsx
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

// In AllEvents.tsx:
<motion.div
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  custom={index}
>
  <Event index={index} event={event} />
</motion.div>
```

---

## 3. Scroll Effects

### 3.1 Hero Parallax

**Concept**: The hero background image moves at 50% scroll speed, creating a parallax depth effect. The 3D canvas moves at normal speed (or slightly slower), adding layered depth.

**Performance tier**: Lightweight (CSS only, GPU-composited)
**Respects prefers-reduced-motion**: Yes -- disable, use static positioning

**Implementation** (CSS approach on Hero):

```tsx
// In Hero.tsx, replace the background Image wrapper:
<div
  className="absolute inset-0"
  style={{
    transform: `translateY(${scrollY * 0.4}px)`,
    willChange: 'transform',
  }}
>
  <Image
    src="/background-2.jpeg"
    fill
    className="object-cover"
    alt="group photo"
    priority
  />
</div>
```

With a scroll listener:
```tsx
const [scrollY, setScrollY] = useState(0)

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

Alternatively, use pure CSS `background-attachment: fixed` for the simplest parallax, though it has iOS issues. The JS approach above is more reliable.

### 3.2 Navigation Bar Reveal on Scroll

**Concept**: A slim top navigation bar is hidden when at the top of the page (hero visible) and slides down into view once the user scrolls past the hero. This pairs with the UX designer's navigation redesign.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- snap instead of animate

```tsx
// In the Navbar component:
const [showNav, setShowNav] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setShowNav(window.scrollY > window.innerHeight * 0.5)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// CSS class approach:
<nav
  className={`
    fixed top-0 left-0 right-0 z-50
    transition-transform duration-300 ease-out
    ${showNav ? 'translate-y-0' : '-translate-y-full'}
  `}
  style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.85)' }}
>
  {/* Nav content */}
</nav>
```

### 3.3 Scroll-Triggered Section Reveals

**Concept**: Each major section (events, shop grid, footer) has a subtle reveal as it enters the viewport -- a fade combined with a slight upward shift.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes

Use the same `useInView` hook from section 2.3:

```tsx
function RevealSection({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useInView({ threshold: 0.05 })

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      {children}
    </div>
  )
}
```

---

## 4. Hover Micro-Interactions

### 4.1 Event Card Hover

**Concept**: On hover, the event card lifts slightly (translateY -4px), gains a deeper shadow, scales to 1.02, and the top border (or left border) glows with the opponent team's primary color.

**Performance tier**: Lightweight (CSS transitions only)
**Respects prefers-reduced-motion**: Partially -- keep color change, skip transform

```tsx
// In Event.tsx, add to Card sx:
<Card
  sx={{
    minWidth: 275,
    position: 'relative',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    borderLeft: `3px solid transparent`,
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 12px ${getTeamColor(event, 'primary')}40`,
      borderLeftColor: getTeamColor(event, 'primary'),
    },
  }}
>
```

The `40` suffix on the hex color is 25% opacity for the glow. For team colors in rgba format, parse and set alpha accordingly.

### 4.2 Shop Product Card Hover

**Concept**: Image scales up slightly (zoom effect within the card bounds), and a semi-transparent overlay with "View Details" text fades in.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Partially -- keep overlay, skip zoom

```tsx
<Card
  sx={{
    overflow: 'hidden',
    '& .MuiCardMedia-root': {
      transition: 'transform 0.4s ease',
    },
    '&:hover .MuiCardMedia-root': {
      transform: 'scale(1.08)',
    },
    '&:hover .product-overlay': {
      opacity: 1,
    },
  }}
>
  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
    <CardMedia component="img" /* ... existing props */ />
    <Box
      className="product-overlay"
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Typography variant="button" color="white">
        View Details
      </Typography>
    </Box>
  </Box>
</Card>
```

### 4.3 Navigation Icon Hover

**Concept**: Icons smoothly scale up to 1.15 and transition from Arsenal red to white on hover. Already partially implemented; enhance with scale.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: No (subtle enough to keep)

```tsx
sx={{
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    color: 'white',
    transform: 'scale(1.15)',
  },
}}
```

### 4.4 Button Press Animation

**Concept**: All interactive buttons scale down slightly on active press (`:active`), giving tactile feedback.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: No (subtle enough to keep)

Add to MUI theme overrides:

```tsx
// In theme.ts MuiButton styleOverrides:
MuiButton: {
  styleOverrides: {
    root: {
      transition: 'transform 0.1s ease, background-color 0.2s ease',
      '&:active': {
        transform: 'scale(0.97)',
      },
    },
  },
},
```

### 4.5 RSVP Button Pulse

**Concept**: The RSVP button on upcoming event cards has a subtle pulse animation to draw attention.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- disable pulse

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(255, 0, 0, 0); }
}
```

```tsx
<Button
  sx={{
    animation: 'pulse-glow 2s infinite',
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  }}
>
  RSVP
</Button>
```

---

## 5. Glitch Animation Usage

The existing glitch animations in `globals.css` (`glitch-anim-1`, `glitch-anim-2`, `glitch-anim-flash`) are clip-path based distortions. They are aggressive by nature, so usage must be very selective.

### 5.1 Recommended Uses

**A) Score Display on Past Match Results (Primary Use)**

When a past match has a score (W 3-1, L 0-2, etc.), apply the glitch effect as a brief entrance animation that plays once, then stops. This evokes the feel of a stadium scoreboard flickering to life.

```tsx
// In Event.tsx, for the score Typography:
<Typography
  className="glitch-score"
  sx={{ fontSize: 14 }}
  color="text.secondary"
>
  {renderScore(event.HomeTeamScore, event.AwayTeamScore)}
</Typography>
```

```css
/* globals.css */
.glitch-score {
  position: relative;
}

.glitch-score::before,
.glitch-score::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-score::before {
  animation: glitch-anim-1 0.8s 1 linear;
  color: #ff0000;
  z-index: -1;
}

.glitch-score::after {
  animation: glitch-anim-2 0.8s 0.2s 1 linear;
  color: #0000ff;
  z-index: -2;
}
```

Key difference: `1` instead of `infinite` -- plays once on mount, then stops.

**B) Win Celebration Flash**

On a WIN result specifically, add the `glitch-anim-flash` as a brief white flash overlay, like a camera flash from the crowd:

```css
.win-flash::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  animation: glitch-anim-flash 0.5s 1 linear;
  pointer-events: none;
}
```

**C) 404 / Error Pages**

The glitch effect works well on error page headings (e.g., "404" or "Page Not Found"), since glitch aesthetics naturally convey "something went wrong."

### 5.2 Places NOT to Use Glitch

- Navigation elements (confusing, looks broken)
- Product cards or prices (erodes trust)
- RSVP or checkout buttons (looks like a bug)
- Continuously looping on visible headings (annoying)

---

## 6. Page Transitions

### 6.1 Recommended Approach: CSS View Transitions API

The CSS View Transitions API is the right choice for Next.js App Router. It is natively supported in Chrome/Edge (87%+ of users) and degrades gracefully (no transition, instant swap) in unsupported browsers. It avoids the complexity of wrapping the entire app in Framer Motion's `AnimatePresence`, which conflicts with Next.js streaming and server components.

**Performance tier**: Lightweight (browser-native)
**Respects prefers-reduced-motion**: Yes -- browser auto-disables

**Implementation**:

Next.js 15+ supports view transitions via the `viewTransition` option in `next.config.mjs`:

```js
// next.config.mjs
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
}
```

Then define transition animations in CSS:

```css
/* globals.css */
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fadeOut 0.2s ease-out;
}

::view-transition-new(root) {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* fadeIn already defined in section 2.2 */
```

For more sophisticated transitions (e.g., hero image morphing between home and shop page), add `view-transition-name` to shared elements:

```css
.hero-scene {
  view-transition-name: hero-scene;
}

::view-transition-old(hero-scene) {
  animation: scaleOut 0.3s ease-out;
}

::view-transition-new(hero-scene) {
  animation: scaleIn 0.3s ease-in;
}
```

### 6.2 Fallback: Framer Motion (if View Transitions insufficient)

If the team needs more control or cross-browser consistency:

```tsx
// app/template.tsx (NOT layout.tsx -- template re-mounts on navigation)
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

Note: This does NOT support exit animations (the old page is already gone when the new one mounts in App Router). True exit animations require `AnimatePresence` + layout groups, which add significant complexity. The CSS View Transitions API handles this natively and is the recommended path.

---

## 7. Football-Atmosphere Effects

### 7.1 Matchday Countdown with Pulse

**Concept**: The "Next Match" or upcoming match countdown (e.g., "3 days") has a pulsing red glow that intensifies as matchday approaches. On matchday itself, it pulses faster and displays "MATCHDAY" in bold.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- static display, no pulse

```css
@keyframes matchday-pulse {
  0%, 100% { text-shadow: 0 0 4px rgba(255, 0, 0, 0.3); }
  50% { text-shadow: 0 0 16px rgba(255, 0, 0, 0.8), 0 0 32px rgba(255, 0, 0, 0.3); }
}
```

```tsx
<Typography
  sx={{
    animation: daysUntil <= 1
      ? 'matchday-pulse 1s infinite'
      : daysUntil <= 3
        ? 'matchday-pulse 2s infinite'
        : 'none',
    fontWeight: daysUntil <= 1 ? 900 : 700,
    color: daysUntil <= 1 ? '#ff0000' : undefined,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  }}
>
  {daysUntil <= 0 ? 'MATCHDAY' : `${daysUntil} days`}
</Typography>
```

### 7.2 Score Celebration Animation

**Concept**: When viewing a completed match where Arsenal won, a brief confetti or flash effect plays on the card. This should only trigger once (on first viewport entry), not on every scroll.

**Performance tier**: Medium (canvas-based confetti)
**Respects prefers-reduced-motion**: Yes -- disable entirely

Use `canvas-confetti` (lightweight, ~6kb):

```bash
npm install canvas-confetti
```

```tsx
import confetti from 'canvas-confetti'

// In Event component, for wins:
useEffect(() => {
  if (isWin && isInView && !hasPlayedRef.current) {
    hasPlayedRef.current = true
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff0000', '#ffffff', '#cc0000'],
      gravity: 1.2,
      ticks: 80,
    })
  }
}, [isWin, isInView])
```

Use sparingly -- only on the most recent completed match, not all past wins.

### 7.3 Live Match Indicator

**Concept**: If a match is currently in progress (within kickoff time + ~2 hours), show a pulsing red dot indicator next to the event card. Pure CSS, no API needed -- just time-based detection.

**Performance tier**: Lightweight
**Respects prefers-reduced-motion**: Yes -- static dot, no pulse

```css
@keyframes live-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.live-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff0000;
  animation: live-dot 1.5s infinite;
  display: inline-block;
  margin-right: 6px;
}
```

### 7.4 Stadium Ambient Sound (NOT Recommended)

Auto-playing audio is a UX anti-pattern and violates browser autoplay policies. A toggle-able crowd ambience could be a novelty, but the implementation cost vs. value is poor. **Skip this.**

---

## 8. Performance Considerations

### 8.1 Performance Tiers Summary

| Effect | Tier | Mobile | Reduced Motion |
|--------|------|--------|----------------|
| Atmospheric lighting | Lightweight | Keep | Keep |
| Environment map | Medium | Keep (low res) | Keep |
| Bloom + Vignette | Heavy | DISABLE | DISABLE |
| Particle system | Medium | Reduce to 80 | DISABLE |
| Mouse-tracking tilt | Lightweight | DISABLE (no pointer) | DISABLE |
| Scroll camera zoom | Lightweight | Keep | DISABLE |
| CSS entrance animations | Lightweight | Keep | DISABLE |
| Hero parallax | Lightweight | Keep | DISABLE |
| Nav scroll reveal | Lightweight | Keep | Snap (no animate) |
| Card hover effects | Lightweight | N/A (no hover) | Partial (keep color) |
| Button press | Lightweight | Keep (tap) | Keep |
| RSVP pulse | Lightweight | Keep | DISABLE |
| Glitch (one-shot) | Lightweight | Keep | DISABLE |
| View transitions | Lightweight | Keep | Auto-disabled |
| Matchday pulse | Lightweight | Keep | DISABLE |
| Confetti | Medium | DISABLE | DISABLE |
| Live dot | Lightweight | Keep | Static dot |

### 8.2 Reduced Motion Implementation

Create a shared hook:

```tsx
// src/hooks/useReducedMotion.ts
import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
```

### 8.3 Mobile Detection for 3D Downgrades

```tsx
// src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return isMobile
}
```

### 8.4 Loading Strategy

- The 3D scene loads asynchronously (already in `<Suspense>`). Ensure the GLB is cached with proper headers.
- Entrance animations should not block layout -- elements should have their final dimensions from the start, only opacity/transform are animated.
- Post-processing shaders compile on first render; expect a brief stutter. Warm up by rendering the Canvas early (already done since it is in the hero).
- `canvas-confetti` should be dynamically imported: `const confetti = (await import('canvas-confetti')).default`

### 8.5 Dependencies to Add

```
@react-three/postprocessing  (for bloom/vignette)
postprocessing               (peer dep of above)
canvas-confetti              (optional, for win celebrations)
framer-motion                (optional, only if CSS approach insufficient)
```

---

## Summary of Priorities

**Must-have (implement first)**:
1. Enhanced 3D lighting (section 1.1) -- biggest visual impact, minimal code
2. Mouse-tracking tilt replacing OrbitControls (section 1.5) -- more polished than free orbit
3. Event card entrance animations (section 2.4) -- the content below the hero needs life
4. Card hover micro-interactions (section 4.1) -- immediate tactile feedback
5. Button press animation via theme (section 4.4) -- global, one-time setup

**Should-have (implement second)**:
6. Particle system (section 1.4) -- atmosphere
7. Bloom post-processing (section 1.3) -- cinematic feel
8. Hero parallax (section 3.1) -- depth
9. Nav scroll reveal (section 3.2) -- pairs with nav redesign
10. RSVP pulse (section 4.5) -- draws action

**Nice-to-have (implement if time permits)**:
11. View transitions (section 6.1) -- polish
12. Matchday countdown pulse (section 7.1) -- atmosphere
13. Glitch on scores (section 5.1) -- character
14. Environment map (section 1.2) -- reflections
15. Win confetti (section 7.2) -- delight
