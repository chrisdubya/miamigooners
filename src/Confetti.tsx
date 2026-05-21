'use client'
import {useEffect, useRef, useState} from 'react'

type ConfettiProps = {
  active: boolean
  burstCount?: number
  fallRate?: number
}

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  color: string
  rotation: number
  rotationSpeed: number
  flipSpeed: number
  flipPhase: number
}

const COLORS = ['#DB0007', '#FF1A22', '#D4A843', '#E8C96A', '#F5F5F7']
const MAX_PIECES = 250
const GRAVITY = 0.12
const DRAG = 0.99

const rand = (min: number, max: number) => Math.random() * (max - min) + min
const pickColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

const makeBurstPiece = (originX: number, originY: number): Piece => {
  const angle = rand(-Math.PI * 0.9, -Math.PI * 0.1)
  const speed = rand(5, 14)
  return {
    x: originX + rand(-40, 40),
    y: originY + rand(-10, 10),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: rand(6, 10),
    h: rand(10, 16),
    color: pickColor(),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.25, 0.25),
    flipSpeed: rand(0.08, 0.2),
    flipPhase: rand(0, Math.PI * 2),
  }
}

const makeFallPiece = (width: number): Piece => ({
  x: rand(0, width),
  y: -20,
  vx: rand(-0.6, 0.6),
  vy: rand(1, 2.5),
  w: rand(6, 10),
  h: rand(10, 16),
  color: pickColor(),
  rotation: rand(0, Math.PI * 2),
  rotationSpeed: rand(-0.15, 0.15),
  flipSpeed: rand(0.06, 0.15),
  flipPhase: rand(0, Math.PI * 2),
})

export const Confetti = ({active, burstCount = 80, fallRate = 6}: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const piecesRef = useRef<Piece[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const fallAccumulatorRef = useRef<number>(0)
  const activeRef = useRef<boolean>(active)
  const burstFiredRef = useRef<boolean>(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (active) burstFiredRef.current = false
  }, [active])

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = (now: number) => {
      const dtMs = lastTimeRef.current === 0 ? 16 : now - lastTimeRef.current
      lastTimeRef.current = now
      const dt = Math.min(dtMs, 50) / (1000 / 60)

      const cssWidth = canvas.width / dpr
      const cssHeight = canvas.height / dpr

      if (activeRef.current && !burstFiredRef.current) {
        burstFiredRef.current = true
        const originX = cssWidth / 2
        const originY = cssHeight * 0.35
        for (let i = 0; i < burstCount; i++) {
          if (piecesRef.current.length >= MAX_PIECES) break
          piecesRef.current.push(makeBurstPiece(originX, originY))
        }
      }

      if (activeRef.current) {
        fallAccumulatorRef.current += (dtMs / 1000) * fallRate
        while (fallAccumulatorRef.current >= 1) {
          fallAccumulatorRef.current -= 1
          if (piecesRef.current.length < MAX_PIECES) {
            piecesRef.current.push(makeFallPiece(cssWidth))
          }
        }
      }

      ctx.clearRect(0, 0, cssWidth, cssHeight)

      const next: Piece[] = []
      for (const p of piecesRef.current) {
        p.vy += GRAVITY * dt
        p.vx *= Math.pow(DRAG, dt)
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rotation += p.rotationSpeed * dt
        p.flipPhase += p.flipSpeed * dt

        if (p.y > cssHeight + 40) continue
        next.push(p)

        const scaleX = Math.cos(p.flipPhase)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(scaleX, 1)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      piecesRef.current = next

      rafRef.current = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        lastTimeRef.current = 0
      } else if (rafRef.current === null && (activeRef.current || piecesRef.current.length > 0)) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      piecesRef.current = []
      lastTimeRef.current = 0
      fallAccumulatorRef.current = 0
      burstFiredRef.current = false
    }
  }, [burstCount, fallRate, reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1400,
      }}
    />
  )
}
