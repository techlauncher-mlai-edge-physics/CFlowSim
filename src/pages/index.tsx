import NavBar from "../components/NavBar";
import ParBar from "../components/ParametersBar";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { DiffusionPlane, SimulationParams } from "../components/Simulation";
import { useEffect, useState } from "react";
import ControlBar from "../components/ControlBar";

const SimulatorContainer = styled.div`
  position: absolute;
  left: 21rem;
  top: 6rem;
  width: calc(100vw - 22rem);
  height: calc(100vh - 7rem);
  z-index: 0;
`;

const Simulator = styled(Canvas)`
  background: transparent;
  z-index: 0;
`;

interface indexProp {
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  worker: Worker;
}

export default function Home(props: indexProp): React.ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  const { simulationParams, setSimulationParams, worker } = props;

  return (
    <>
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
      <ControlBar worker={worker} />
    </>
  );
}
