import ParBar from '../components/ParametersBar';
import ControlBar from '../components/ControlBar';
import { DiffusionPlane, SimulationParams } from '../components/Simulation';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';

const SimulatorContainer = styled.div`
  position: relative;
  left: 21rem;
  top: 6rem;
  width: calc(100vw - 22rem);
  height: calc(100vh - 7rem);
  z-index: 0;
  @media (max-width: 760px) {
    position: relative;
    left: 6rem;
    top: 6rem;
    width: calc(100vw - 12rem);
    height: calc(100vh - 6rem);
    z-index: 0;
  }
`;

const Simulator = styled(Canvas)`
  background: transparent;
  z-index: 0;
`;

interface IndexProp {
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  worker: Worker;
}

export default function Home(props: IndexProp): React.ReactElement {
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
