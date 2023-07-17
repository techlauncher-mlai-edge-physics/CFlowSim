import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import styled from 'styled-components';

import './App.css';
import Home from './pages';
import AboutPage from './pages/about';
import { SimulationParams } from './components/Simulation';

const Main = styled.main`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 0;
`;

const NavBarContainer = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Titillium Web', sans-serif;
`;

function App() {
  // save the current page in state
  // 0 = home(index,simulation) 1 = about
  const [page, setPage] = useState(0);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(
    new SimulationParams(),
  );
  const [lightTheme, setlightTheme] = useState<boolean>(false);
  const [simWorker, setSimWorker] = useState<Worker>(null!);
  useEffect(() => {
    const worker = new Worker(
      new URL('./workers/modelWorker', import.meta.url),
      {
        type: 'module',
      },
    );
    setSimWorker(worker);
  }, []);

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
    <>
      <Main>
        <NavBarContainer>
          <NavBar
            setPage={setPage}
            page={page}
            lightTheme={lightTheme}
            setlightTheme={setlightTheme}
          />
        </NavBarContainer>
        {mainPageComponent}
      </Main>
    </>
  );
}

export default App;
