'use client'
import {Suspense, useRef, useMemo, useState, useEffect} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200

function useReducedMotion() {
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

function Particles() {
  const meshRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  const speeds = useMemo(() => {
    return Array.from({length: PARTICLE_COUNT}, () => ({
      y: 0.002 + Math.random() * 0.005,
      drift: (Math.random() - 0.5) * 0.001,
    }))
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const posArray = meshRef.current.geometry.attributes.position
      .array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArray[i * 3] += speeds[i].drift
      posArray[i * 3 + 1] += speeds[i].y
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

export const Scene = ({height}: {height: number}) => {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="absolute inset-0 z-10"
      style={{height: `${height}vh`}}
      aria-hidden="true"
    >
      <Canvas dpr={[1, 1.5]} camera={{position: [0, 0, 5], fov: 50}}>
        <Suspense fallback={null}>
          {!reducedMotion && <Particles />}
        </Suspense>
      </Canvas>
    </div>
  )
}
