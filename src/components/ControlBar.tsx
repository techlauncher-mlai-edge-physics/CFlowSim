import { Button, Space } from 'antd';
import styled from 'styled-components';
import { type ModelSave } from '../services/model/modelService';
import type React from 'react';
import {useEffect, useRef, type ChangeEvent, useState} from 'react';
import { CaretRightOutlined, PauseOutlined, } from '@ant-design/icons';

export const ControlBarContainer = styled(Space)`
  position: absolute;
  bottom: 4rem;
  right: 30rem;
  z-index: 100;
  display: flex;
  gap: 1.8rem;
  background-color: #C5C5C5;
  padding-top: 0.5rem;
  padding-right: 1.8rem;
  padding-bottom: 0.5rem;
  padding-left: 1.8rem;
  border-radius: 25px;
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

export const ControlBarBtn = styled(Button)`
  shape: circle;
  border: none;
  cursor: pointer;
  outline: none;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #909090;
  font-size: 1rem;
`;

export const ControlBarBtnWithAttr = styled(ControlBarBtn)`
    &[data-icon="square"]::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40%; 
        height: 40%; 
        background-color: white;
        transform: translate(-50%, -50%);
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
    });
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

  const inputFile = useRef<HTMLInputElement | null>(null);
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist();
    load(e.target.files![0]);
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const handleIconClick = (): void => {
    if (isPlaying) {
      worker.postMessage({ func: 'pause' });
    } else {
      worker.postMessage({ func: 'start' });
    }
    setIsPlaying(!isPlaying);

  };


  return (
      <>
        <input
            type="file"
            id="file"
            ref={inputFile}
            style={{display: 'none'}}
            onChange={onChange}
        />
        <SaveBtn
            onClick={() => {
              worker.postMessage({func: 'serialize'});
            }}
        >
          Save Model
        </SaveBtn>
        <RestoreBtn
            onClick={() => {
              inputFile.current?.click();
            }}
        >
          Restore Model
        </RestoreBtn>
        <ControlBarContainer size="small" direction="horizontal">
          <ControlBarBtn
              onClick={handleIconClick}>
                {isPlaying ?
                    <PauseOutlined style={{ color: 'white' }}/>  :
                    <CaretRightOutlined style={{ color: 'white', fontSize: '1.4em', marginLeft: '0.15em' }}/>}
          </ControlBarBtn>
            <ControlBarBtnWithAttr
                data-icon="square"
                onClick={() => {
                    worker.postMessage({ func: 'stop' });
                }}
            />
        </ControlBarContainer>
      </>
  );

}
