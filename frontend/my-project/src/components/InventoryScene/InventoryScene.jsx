import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Gltf } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
// 1. The Model Loader
function Ship({ url }) {
  // Gltf component from Drei is the fastest way to load
  return <Gltf src={url} scale={1.5} position={[0, 0, 0]} />;
}

export default function InventoryScene({ modelUrl }) {
  return (
    <div className="vh-100 w-100 bg-dark">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={true}>
            {/* Use the dynamic modelUrl prop here! */}
            <Ship url={modelUrl} />
          </Stage>

          {/* This is the "Magic Sauce" for the Sci-Fi look */}
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            <Noise opacity={0.05} /> {/* Adds a subtle digital grain */}
          </EffectComposer>

          <OrbitControls makeDefault autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}
