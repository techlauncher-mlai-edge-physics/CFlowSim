import type React from 'react';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import styled, { ThemeProvider } from 'styled-components';

import './App.css';
import Home from './pages';
import AboutPage from './pages/about';
import { SimulationParams } from './components/Simulation';
import {
  type IncomingMessage,
  type InitArgs,
  RunnerFunc,
} from './workers/modelWorkerMessage';

const Main = styled.main`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) =>
    (props.theme.light as boolean) ? '#ffffff' : '#707070'};
  z-index: 0;
`;

const NavBarContainer = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Titillium Web', sans-serif;
`;

function App(): React.ReactElement {
  // save the current page in state
  // 0 = home(index,simulation) 1 = about
  const [page, setPage] = useState(0);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(
    new SimulationParams(),
  );

  const [lightTheme, setLightTheme] = useState<boolean>(false);
  // TODO: implement auto theme ui switch
  const [curThemeMode, setCurThemeMode] = useState<string>('auto'); // 'dark' or 'light' or 'auto'

  useEffect(() => {
    if (curThemeMode === 'auto') {
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
      darkModeMediaQuery.addEventListener('change', (e) => {
        const newColorScheme = e.matches ? 'dark' : 'light';
        setLightTheme(newColorScheme === 'light');
      });
      setLightTheme(darkModeMediaQuery.matches);
    } else {
      setLightTheme(curThemeMode === 'light');
    }
  }, [curThemeMode]);

  const [simWorker, setSimWorker] = useState<Worker>(null!);
  useEffect(() => {
    const worker = new Worker(
      new URL('./workers/modelWorker', import.meta.url),
      {
        type: 'module',
      },
    );
    setSimWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    const message: IncomingMessage = {
      func: RunnerFunc.INIT,
      args: {
        modelPath: '/model/bno_small_new_web/model.json',
        initConditionPath:
          '/initData/pvf_incomp_44_nonneg/pvf_incomp_44_nonneg_0.json',
      } satisfies InitArgs,
    };
    if (simWorker === null) return;
    simWorker.postMessage(message);
  }, [simWorker]);

  let mainPageComponent;
  switch (page) {
    case 1:
      mainPageComponent = <AboutPage />;
      break;
    case 0:
    default:
      mainPageComponent = (
        <Home
          worker={simWorker}
          simulationParams={simulationParams}
          setSimulationParams={setSimulationParams}
        />
      );
      break;
  }

  return (
    <ThemeProvider theme={{ light: lightTheme }}>
      <Main>
        <NavBarContainer>
          <NavBar setPage={setPage} setCurThemeMode={setCurThemeMode} />
        </NavBarContainer>
        {mainPageComponent}
      </Main>
    </ThemeProvider>
  );
}

export default App;
