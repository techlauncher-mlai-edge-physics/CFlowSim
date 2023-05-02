import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls, Stats } from "@react-three/drei";
import { DiffusionPlane } from "@components/Simulation"

export default function Home(): JSX.Element {
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
        <MapControls />
      </Canvas>
    </div>
  );
}
