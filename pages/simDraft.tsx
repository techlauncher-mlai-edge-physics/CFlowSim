import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import { DiffusionPlane } from "@components/Simulation";

export default function Home() {
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
        <DiffusionPlane position={[0, 0, 0]} />
        <MapControls />
      </Canvas>
    </div>
  );
}
