import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ColorPicker, Col, Space, Row, Card } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
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
  text-align: left;
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
          onClick={() => {
            setVisible(!isVisible);
          }}
      >
        {isVisible ? <DoubleLeftOutlined /> : <DoubleRightOutlined />}
      </BackButton>
  );
}

// whether the pane is in expert or easy mode
enum ControlDifficulty {
  Easy,
  Expert,
}

export default function ParametersBar(props: {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}): React.ReactElement {
  const [isPaneVisible, setPaneVisible] = useState<boolean>(true);
  const space: [SpaceSize, SpaceSize] = ['large', 'small'];

  const [controlDifficulty, setControlDifficulty] = useState<ControlDifficulty>(
      ControlDifficulty.Expert, // Set the default mode to Expert
  );

  const [colorLow, setColorLow] = useState<Color | string>('#0000FF');
  const [colorHigh, setColorHigh] = useState<Color | string>('#FF0000');

  const colorLowString = useMemo(
      () => (typeof colorLow === 'string' ? colorLow : rgbaToHex(colorLow)),
      [colorLow],
  );
  const colorHighString = useMemo(
      () => (typeof colorHigh === 'string' ? colorHigh : rgbaToHex(colorLow)),
      [colorHigh],
  );

  useEffect(() => {
    props.setParams((prev) => ({
      ...prev,
      densityLowColour: new ThreeColor(colorLowString),
      densityHighColour: new ThreeColor(colorHighString),
    }));
  }, [colorLowString, colorHighString, props.setParams]);

  const handleEasyModeClick = () => {
    setControlDifficulty(ControlDifficulty.Easy);
  };

  const handleExpertModeClick = () => {
    setControlDifficulty(ControlDifficulty.Expert);
  };

  return (
      <Container direction="vertical" size={space}>
        {/* hide button */}
        <Row justify="end">
          <ShowHideButton isVisible={isPaneVisible} setVisible={setPaneVisible} />
        </Row>

        {/* header */}
        <Title>Parameters</Title>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <ParameterButton label="Easy mode" onClick={handleEasyModeClick} />
          </Col>
          <Col className="gutter-row" span={12}>
            <ParameterButton label="Expert mode" onClick={handleExpertModeClick} />
          </Col>
        </Row>

        {/* render the correct pane based on current control difficulty */}
        {isPaneVisible && (
            <>
              {controlDifficulty === ControlDifficulty.Easy && <EasyControls />}
              {controlDifficulty === ControlDifficulty.Expert && <ExpertControls />}
              <SimulationColour
                  colorLow={colorLow}
                  setColorLow={setColorLow}
                  colorHigh={colorHigh}
                  setColorHigh={setColorHigh}
                  setParams={props.setParams}
              />
            </>
        )}
      </Container>
  );
}


// Define separate components for EasyControls and ExpertControls
function EasyControls() {
  return <div>Easy Controls Here</div>;
}

function ExpertControls() {
  return <div>Expert Controls Here</div>;
}

// Modify SimulationColour component to use props directly
// Utility function to convert RGBA color to HEX string
function rgbaToHex(rgbaColor) {
  const hexColor = rgbaColor
      .replace(/^rgba?\(|\s+|\)$/g, '')
      .split(',')
      .map((x) => {
        const hex = parseInt(x, 10).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  return '#' + hexColor;
}


function SimulationColour(props: {
  colorLow: Color | string;
  setColorLow: React.Dispatch<React.SetStateAction<Color | string>>;
  colorHigh: Color | string;
  setColorHigh: React.Dispatch<React.SetStateAction<Color | string>>;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>; // Add setParams prop
}): React.ReactElement {
  const { colorLow, setColorLow, colorHigh, setColorHigh } = props;

  useEffect(() => {
    const colorLowString =
        typeof colorLow === 'string' ? colorLow : rgbaToHex(colorLow);
    const colorHighString =
        typeof colorHigh === 'string' ? colorHigh : rgbaToHex(colorHigh);

    // Now you can access the setParams function
    props.setParams((prev) => ({
      ...prev,
      densityLowColour: new ThreeColor(colorLowString),
      densityHighColour: new ThreeColor(colorHighString),
    }));
  }, [colorLow, colorHigh, props.setParams]);

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
