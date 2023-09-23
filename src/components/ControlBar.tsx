import { Button, Space } from 'antd';
import styled from 'styled-components';
import { type ModelSave } from '../services/model/modelService';
import { useEffect, useRef, type ChangeEvent } from 'react';

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
  initSubs: Array<(w: Worker) => void>;
}

export default function ControlBar(props: ControlBarProps): React.ReactElement {
  const { modelSaveSubs, initSubs } = props;

  const worker = useRef<Worker>()

  useEffect(() => {
    modelSaveSubs.push((sav: ModelSave) => {
      save(sav);
    });

    initSubs.push((w: Worker) => {
      worker.current = w;
    })

    // take the json and have the user download it
    function save(sav: ModelSave): void {
      const filename = `${sav.modelType}@${sav.time}`;
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
  }, [modelSaveSubs, initSubs]);

  // take a file and send its contents to the worker
  function load(file: File): void {
    console.log('reading file ', file);

    const reader = new FileReader();
    reader.onload = () => {
      const text: string = reader.result?.toString() ?? '';
      const data = JSON.parse(text) as ModelSave;
      console.log('got', data);
      worker.current?.postMessage({ func: 'deserialize', args: data });
    };
    reader.readAsText(file);
  }

  const inputFile = useRef<HTMLInputElement | null> (null)
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist()
    load(e.target.files![0])
  }

  return (
    <>
      <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={onChange}/>
      <SaveBtn
        onClick={() => {
          worker.current?.postMessage({ func: 'serialize' });
        }}
      >
        Save Model
      </SaveBtn>
      <RestoreBtn
        onClick={() => {
          inputFile.current?.click()

        }}
      >
        Restore Model
      </RestoreBtn>
      <ControlBarContainer size="small" direction="horizontal">
        <Button
          onClick={() => {
            worker.current?.postMessage({ func: 'start' });
          }}
        >
          Play
        </Button>
        <Button
          onClick={() => {
            worker.current?.postMessage({ func: 'pause' });
          }}
        >
          Pause
        </Button>
        <Button
          onClick={() => {
            worker.current?.postMessage({ func: 'stop' });
          }}
        >
          Stop
        </Button>
        <Button
          onClick={() => {
            worker.current?.terminate();
          }}
        >
          TERMINATE
        </Button>
      </ControlBarContainer>
    </>
  );
}
