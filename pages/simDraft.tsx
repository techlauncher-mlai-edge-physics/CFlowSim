import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls, Stats } from "@react-three/drei";
import { DiffusionPlane, SimulationParams } from "@components/Simulation"
import { Color } from "three";

export default function Home(): JSX.Element {
  const params: SimulationParams = new SimulationParams()
  params.densityLowColour = new Color("green")

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
        <DiffusionPlane position={[0, 0, 0]} params={params} />
        <MapControls />
      </Canvas>
    </div>
  );
}
