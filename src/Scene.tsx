import {Suspense, useRef} from 'react'
import {Canvas, useFrame, useLoader} from '@react-three/fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {Environment, OrbitControls} from '@react-three/drei'

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/untitled.glb')
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
      />
    </>
  )
}

export const Scene = () => {
  return (
    <div style={{position: 'absolute', height: '80vh', inset: 0, zIndex: 0}}>
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <OrbitControls enableZoom={false} />
          <Environment background={false} preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}
