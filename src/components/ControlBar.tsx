import { Button, Space } from 'antd';
import styled from 'styled-components';
import { type ModelSave } from '../services/model/modelService';
import { useEffect } from 'react';
import fileDialog from 'file-dialog';

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
  modelSaveSubs: Array<(save: ModelSave) => void>;
  worker: Worker;
}

export default function ControlBar(props: ControlBarProps): React.ReactElement {
  const { modelSaveSubs, worker } = props;

  useEffect(() => {
    modelSaveSubs.push((sav: ModelSave) => {
      save(sav);
      console.log('wrote a save');
    });

    // take the json and have the user download it
    function save(sav: ModelSave): void {
      const filename = `${sav.modelType}@${sav.time}.CFSS`;
      const dat = JSON.stringify(sav);
      const blob = new Blob([dat], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log('wrote a save to ' + filename, sav);
    }
  }, [modelSaveSubs]);

  // take a file and send its contents to the worker
  function load(file: File): void {
    console.log('reading file ', file);

    const reader = new FileReader();
    reader.onload = () => {
      const text: string = reader.result?.toString() ?? '';
      const data = JSON.parse(text) as ModelSave;
      console.log('got', data);
      worker.postMessage({ func: 'deserialize', args: data });
    };
    reader.readAsText(file);
  }

  return (
    <>
      <SaveBtn
        onClick={() => {
          worker.postMessage({ func: 'serialize' });
        }}
      >
        Save Model
      </SaveBtn>
      <RestoreBtn
        onClick={() => {
          fileDialog()
            .then((files) => {
              if (files.length > 0) {
                load(files[0]);
              }
            })
            .catch((e) => {
              throw e;
            });
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
