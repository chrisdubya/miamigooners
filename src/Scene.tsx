'use client'
import {Suspense, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {useGLTF, OrbitControls} from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/images/logos/gooners-inter-logo.glb'

const Model = () => {
  const {scene} = useGLTF(MODEL_PATH)
  const modelRef = useRef<THREE.Object3D>(null)

  useFrame(() => {
    if (modelRef.current) modelRef.current.rotation.z += -0.01
  })

  return (
    <>
      <primitive
        object={scene}
        scale={15}
        rotation-x={Math.PI * 0.5}
        ref={modelRef}
        position={[0, -1, 0]}
      />
    </>
  )
}

export const Scene = ({height}: {height: number}) => {
  return (
    <div className="absolute inset-0 z-10" style={{height: `${height}vh`}}>
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            intensity={1}
            position={[0, 0, 5]} // Adjust position to control the direction of the light
          />
          <Model />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
