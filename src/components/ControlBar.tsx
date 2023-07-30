import { Button, Space } from 'antd';
import styled from 'styled-components';

export const ControlBarContainer = styled(Space)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
`;

interface ControlBarProps {
  worker: Worker;
}

export default function ControlBar(props: ControlBarProps): React.ReactElement {
  const { worker } = props;
  return (
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
  );
}
