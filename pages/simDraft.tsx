import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls, Stats } from "@react-three/drei";
import { DiffusionPlane, SimulationParams } from "@components/Simulation"
import { Vector3 } from "three";

export default function Home(): JSX.Element {
  const e: SimulationParams = new SimulationParams()
  e.densityLowColour = new Vector3(1,1,0)

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
        <DiffusionPlane position={[0, 0, 0]} params={e} />
        <MapControls />
      </Canvas>
    </div>
  );
}
