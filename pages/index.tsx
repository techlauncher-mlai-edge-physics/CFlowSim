import Head from "next/head";
import styles from "styles/Home.module.css";
import NavBar from "@components/NavBar";
import ParBar from "@components/ParametersBar";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { DiffusionPlane, SimulationParams } from "@components/Simulation";
import { useEffect, useState } from "react";

const Simulator = styled.div`
  position: absolute;
  left: 21rem;
  top: 90px;
  width: calc(100% - 22rem);
  height: calc(100% - 100px);
`;

export default function Home(): React.ReactElement {
  const params: SimulationParams = new SimulationParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [worker, setWorker] = useState<Worker>(null!);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/modelWorker", import.meta.url),
      {
        type: "module",
      }
    );
    setWorker(worker);
  }, []);

  return (
    <>
      <Head>
        <title>Physics in the Browser for the People</title>
        <meta name="description" content="PHYS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.navBar}>
          <NavBar />
        </div>
        <ParBar />
        <Simulator>
          <Canvas
            shadows
            className={styles.canvas}
            camera={{
              position: [1, 10, 1],
            }}
          >
            <ambientLight />
            <DiffusionPlane
              position={[0, 0, 0]}
              params={params}
              worker={worker}
            />
          </Canvas>
        </Simulator>
      </main>
    </>
  );
}
