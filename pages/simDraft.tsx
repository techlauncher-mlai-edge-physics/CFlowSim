import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls, Stats } from "@react-three/drei";
import { DiffusionPlane } from "@components/Simulation"

import { useEffect, useState } from 'react'

export default function Home(): JSX.Element {
  const [enableMapControls, setEnableMapControls] = useState(true)
  useEffect(() => {
    (window as any).testMapControlsToggle = setEnableMapControls
  })
  
  return (
    <div className={css.scene}>
      <Canvas
        shadows
        className={css.canvas}
        camera={{
          position: [1, 10, 1],
        }}
      >
        <ambientLight />
        <Stats />
        <DiffusionPlane position={[0, 0, 0]} />
        <MapControls enabled={enableMapControls} />
      </Canvas>
    </div>
  );
}
