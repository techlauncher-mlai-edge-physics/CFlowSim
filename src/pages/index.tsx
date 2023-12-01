import ParBar from '../components/ParametersBar';
import ControlBar from '../components/ControlBar';
import {
  DiffusionPlane,
  type SimulationParams,
} from '../components/Simulation';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import {
  type IncomingMessage,
  type OutgoingMessage,
  RunnerFunc,
} from '../workers/modelWorkerMessage';
import { type ModelSave } from '../services/model/modelService';
import { OrbitControls } from '@react-three/drei';
import RestorePopup from '../components/RestoreComponents/RestorePopUp';

const SimulatorContainer = styled.div`
  position: relative;
  left: 21rem;
  top: 1rem;
  width: calc(100% - 22rem);
  height: calc(100% - 7rem);
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
  useEffect(() => {
    const confirmExit = (e: BeforeUnloadEvent): void => {
      console.log('beforeunload event triggered');
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', confirmExit);
    return () => {
      window.removeEventListener('beforeunload', confirmExit);
    };
  }, []);

  // to distribute the worker messages across different components
  // we utilise an observer pattern where components can subscribe
  // their functions to different message types
  const outputSubs: Array<(density: Float32Array) => void> = useMemo(
    () => [],
    [],
  );

  const modelSaveSubs: Array<(save: ModelSave) => void> = useMemo(() => [], []);
  const [restorePopupVisible, setRestorePopupVisible] = useState(false);

  // distribute the worker callback
  useEffect(() => {
    if (worker !== null) {
      worker.onmessage = (e) => {
        const data = e.data as OutgoingMessage;

        switch (data.type) {
          case 'init':
            console.log('worker initialised');
            worker.postMessage({
              func: RunnerFunc.START,
            } satisfies IncomingMessage);
            break;
          case 'output':
            for (const x of outputSubs)
              if (data.density !== undefined) x(data.density);
            break;

          case 'modelSave':
            for (const x of modelSaveSubs) {
              if (data === null)
                throw new Error(
                  'error in calling worker.modelSave, data was null',
                );
              x(data.save!);
            }
            break;
        }
      };
      worker.onerror = (e) => {
        console.log(e);
      };
    }
  }, [worker, outputSubs, modelSaveSubs]);

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
          <OrbitControls
            target={[0, 0, 0]}
            enabled={simulationParams.isCameraControlMode}
          ></OrbitControls>
          <DiffusionPlane
            disableInteraction={simulationParams.isCameraControlMode}
            position={[0, 0, 0]}
            params={simulationParams}
            worker={worker}
            outputSubs={outputSubs}
          />
        </Simulator>
      </SimulatorContainer>
      {restorePopupVisible && (
        <RestorePopup
          worker={worker}
          setRestorePopupVisible={setRestorePopupVisible}
        />
      )}
      <ControlBar
        modelSaveSubs={modelSaveSubs}
        worker={worker}
        setRestorePopupVisible={setRestorePopupVisible}
      />
    </>
  );
}
