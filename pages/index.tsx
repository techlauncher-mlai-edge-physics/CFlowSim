import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "@components/NavBar";
import ParBar from "@components/ParametersBar";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { DiffusionPlane, SimulationParams } from "@components/Simulation";
import { useEffect, useState } from "react";

const SimulatorContainer = styled.div`
  position: absolute;
  left: 21rem;
  top: 6rem;
  width: calc(100vw - 22rem);
  height: calc(100vh - 7rem);
`;
const Simulator = styled(Canvas)`
  background: transparent;
`;

const Main = styled.main`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
`;

export default function Home(): React.ReactElement {
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(
    new SimulationParams()
  );
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
      <Main>
        <div className={styles.navBar}>
          <NavBar />
        </div>
        <ParBar params={simulationParams} setParams={setSimulationParams} />
        <SimulatorContainer>
          <Simulator
            shadows
            camera={{
              position: [1, 10, 1],
            }}
          >
            <ambientLight />
            <DiffusionPlane
              disableInteraction={false}
              position={[0, 0, 0]}
              params={simulationParams}
              worker={worker}
            />
          </Simulator>
        </SimulatorContainer>
      </Main>
    </>
  );
}
