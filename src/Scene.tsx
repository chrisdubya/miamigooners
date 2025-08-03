import {Suspense, useRef} from 'react'
import {Canvas, useFrame, useLoader} from '@react-three/fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from '@react-three/drei'
import * as THREE from 'three'

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/images/logos/gooners-inter-logo.glb')
  const modelRef: React.MutableRefObject<THREE.Object3D | undefined> = useRef()

  useFrame(() => {
    if (modelRef.current) modelRef.current.rotation.z += -0.01
  })

  return (
    <>
      <primitive
        object={gltf.scene}
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
    <div className={`absolute h-[${height}vh] inset-0 z-10`}>
      <Canvas>
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
