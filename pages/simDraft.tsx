import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls, Stats } from "@react-three/drei";
import { DiffusionPlane, SimulationParams } from "@components/Simulation"
import { Color } from "three";
import { useEffect, useState } from "react";

export default function Home(): React.ReactElement {
  const [enableMapControls, setEnableMapControls] = useState(false)
  useEffect(() => {
    (window as any).testMapControlsToggle = setEnableMapControls
  }, [])
  
  const params: SimulationParams = new SimulationParams()
  params.densityLowColour = new Color("green")

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [worker, setWorker] = useState<Worker>(null!)

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/modelWorker", import.meta.url), {
        type: "module",
      }
    );
    setWorker(worker)
  }, [])

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
        <DiffusionPlane position={[0, 0, 0]} params={params} worker={worker} disableInteraction={enableMapControls} />
        <MapControls enabled={enableMapControls} />
      </Canvas>
    </div>
  );
}
