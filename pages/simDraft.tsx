import css from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import Floor from "../components/Floor";

export default function Home() {
  return (
    <div className={css.scene}>
      <Canvas
        shadows
        className={css.canvas}
        camera={{
          position: [-6, 7, 7],
        }}
      >
        <Floor />
      </Canvas>
    </div>
  );
}
