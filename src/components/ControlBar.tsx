import { Button, Space } from 'antd';
import styled from 'styled-components';

export const ControlBarContainer = styled(Space)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
`;

export const SaveBtn = styled(Button)`
  position: absolute;
  bottom: 4rem;
  right: 11rem;
  color: #eeeeee;
  background-color: #555555;
  height: 3.2rem;
  width: 8rem;
  margin: 0 0.2rem;
  cursor: pointer;
  @media (max-width: 760px) {
    margin-bottom: 0.2rem;
  }
`;

export const RestoreBtn = styled(Button)`
  position: absolute;
  bottom: 4rem;
  right: 2rem;
  color: #eeeeee;
  background-color: #555555;
  height: 3.2rem;
  width: 8rem;
  margin: 0 0.2rem;
  cursor: pointer;
  @media (max-width: 760px) {
    margin-bottom: 0.2rem;
  }
`;

interface ControlBarProps {
  worker: Worker;
}

export default function ControlBar(props: ControlBarProps): React.ReactElement {
  const { worker } = props;
  return (
    <>
      <SaveBtn
        onClick={() => {
          console.log('Click Save');
        }}
      >
        Save Model
      </SaveBtn>
      <RestoreBtn
        onClick={() => {
          console.log('Click Restore');
        }}
      >
        Restore Model
      </RestoreBtn>
      <ControlBarContainer size="small" direction="horizontal">
        <Button
          onClick={() => {
            worker.postMessage({ func: 'start' });
          }}
        >
          Play
        </Button>
        <Button
          onClick={() => {
            worker.postMessage({ func: 'pause' });
          }}
        >
          Pause
        </Button>
        <Button
          onClick={() => {
            worker.postMessage({ func: 'stop' });
          }}
        >
          Stop
        </Button>
        <Button
          onClick={() => {
            worker.terminate();
          }}
        >
          TERMINATE
        </Button>
      </ControlBarContainer>
    </>
  );
}
