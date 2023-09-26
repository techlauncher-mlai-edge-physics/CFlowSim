import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ColorPicker, Col, Space, Row, Card } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Color } from 'antd/es/color-picker';
import { Color as ThreeColor } from 'three';
import { type SimulationParams } from './Simulation';
import { type SpaceSize } from 'antd/es/space';

import ParameterButton from './ParameterComponents/ParameterButton';
import ParameterLabel from './ParameterComponents/ParameterLabel';

const Container = styled(Space)`
  background-color: #797979;
  color: #fff;

  width: 20rem;
  height: calc(100% - 6rem);

  font-size: 2rem;
  position: absolute;
  display: flex;

  text-align: left;

  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

  padding: 12px;

  @media (max-width: 760px) {
    display: none;
  }
`;

const ButtonDiv = styled.span`
  top: calc(6rem - 5px);
  position: absolute;
  left: 10px;
`;

const Title = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Category = styled(Card)`
  font-family: 'Roboto', sans-serif;
  background-color: #797979;
  text-align: 'left';
  font-size: 1rem;
  color: #ffffff;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d9d9d9;
  color: #464646;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

function ShowHideButton(props: {
  isVisible: boolean;
  setVisible: (inp: boolean) => void;
}): React.ReactElement {
  const isVisible = props.isVisible;
  const setVisible = props.setVisible;

  return (
    <BackButton
      data-testid="back"

      onClick={() => {
        setVisible(!isVisible);
      }}
    >
      {isVisible ? <DoubleLeftOutlined data-testid='leftarrow' /> : <DoubleRightOutlined data-testid='rightarrow' />}
    </BackButton>
  );
}

// whether the pane is in expert or easy mode
enum ControlDifficulty {
  Easy,
  Expert,
}

export default function ParametersBar(props: {
  params: SimulationParams | null;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>> | null;
}): React.ReactElement {
  const [isPaneVisible, setPaneVisible] = useState<boolean>(true);
  const space: [SpaceSize, SpaceSize] = ['large', 'small'];

  // for ease of development, we'll default to expert mode for now
  const [controlDifficulty, setControlDifficulty] = useState<ControlDifficulty>(
    ControlDifficulty.Expert,
  );

  if (isPaneVisible) {
    return (
      <Container direction="vertical" size={space} data-testid="pane">
        {/* hide button */}
        <Row justify="end">
          <ShowHideButton
            isVisible={isPaneVisible}
            setVisible={setPaneVisible}
          />
        </Row>

        {/* header */}
        <Title>Parameters</Title>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Easy mode"
              onClick={() => {
                setControlDifficulty(ControlDifficulty.Easy);
              }}
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Expert mode"
              onClick={() => {
                setControlDifficulty(ControlDifficulty.Expert);
              }}
            />
          </Col>
        </Row>

        <Row />
        <Row />

        {/* render the correct pane based on current control difficulty */}
        {
          // add all easy controls here
          controlDifficulty === ControlDifficulty.Easy && <></>
        }

        {
          // add all expert controls here
          controlDifficulty === ControlDifficulty.Expert && <></>
        }

        {/* add controls to be shown to both here */}
        <SimulationColour setParams={props.setParams} />
      </Container>
    );
  } else {
    return (
      <ButtonDiv>
        <ShowHideButton isVisible={isPaneVisible} setVisible={setPaneVisible} />
      </ButtonDiv>
    );
  }
}

// CATEGORIES

// allows the user to change the colour of the simulation
function SimulationColour(props: {
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>> | null;
}): React.ReactElement {
  const setParams = props.setParams;

  const [colorLow, setColorLow] = useState<Color | string>('#0000FF');
  const [colorHigh, setColorHigh] = useState<Color | string>('#FF0000');

  const colorLowString = useMemo(
    () => (typeof colorLow === 'string' ? colorLow : colorLow.toHexString()),
    [colorLow],
  );
  const colorHighString = useMemo(
    () => (typeof colorHigh === 'string' ? colorHigh : colorHigh.toHexString()),
    [colorHigh],
  );

  useEffect(() => {
    if (setParams === null)
      return

    setParams((prev) => {
      return {
        ...prev,
        densityLowColour: new ThreeColor(colorLowString),
        densityHighColour: new ThreeColor(colorHighString),
      };
    })
  }, [colorLowString, colorHighString, setParams]);

  return (
    <Category title={'Simulation Colour'}>
      <Row justify="start" gutter={16}>
        <Col className="gutter-row" span={12}>
          <ParameterLabel
            title="Low"
            tooltip="The colour to shade points of low density"
          />
        </Col>
        <Col className="gutter-row" span={12}>
          <ColorPicker value={colorLow} onChange={setColorLow} />
        </Col>
      </Row>

      <Row justify="start" gutter={16}>
        <Col className="gutter-row" span={12}>
          <ParameterLabel
            title="High"
            tooltip="The colour to shade points of high density"
          />
        </Col>
        <Col className="gutter-row" span={12}>
          <ColorPicker value={colorHigh} onChange={setColorHigh} />
        </Col>
      </Row>
    </Category>
  );
}
