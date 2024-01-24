import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  DownOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  ColorPicker,
  Col,
  Space,
  Row,
  Card,
  Dropdown,
  message,
  type MenuProps,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Color } from 'antd/es/color-picker';
import { Color as ThreeColor } from 'three';
import { type SimulationParams } from './Simulation';
import { type SpaceSize } from 'antd/es/space';

import ParameterButton from './ParameterComponents/ParameterButton';
import ParameterLabel from './ParameterComponents/ParameterLabel';

interface Visible {
  hidden: boolean;
}

const Pane = styled.div<Visible>`
  width: 22rem;
  height: calc(100% - 5rem);

  font-size: 2rem;
  position: absolute;
  display: flex;

  text-align: left;

  @media (max-width: 760px) {
    display: none;
  }
  z-index: 1;
`;
const Container = styled(Space)<Visible>`
  background-color: #797979;
  color: #fff;

  width: 20rem;
  height: calc(100% - 25px);

  font-size: 2rem;
  position: absolute;
  left: ${(props) => (props.hidden ? '-20rem' : '0')};
  display: flex;

  text-align: left;

  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

  padding: 12px;

  @media (max-width: 760px) {
    display: none;
  }
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};
  transition:
    left 0.5s linear,
    visibility 0.5s linear;
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

const BackButton = styled.button<Visible>`
  position: absolute;
  top: 0.5rem;
  left: ${(props) => (props.hidden ? '0.5rem' : '22.5rem')};
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background-color: #d9d9d9;
  color: #464646;
  font-size: 16px;
  border: none;
  cursor: pointer;
  z-index: 100;
  transition: left 0.5s linear;
`;

const DropdownMenu = styled.a`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #000000;
`;

function ShowHideButton(props: {
  isVisible: boolean;
  setVisible: (inp: boolean) => void;
}): JSX.Element {
  const isVisible = props.isVisible;
  const setVisible = props.setVisible;

  return (
    <BackButton
      hidden={!isVisible}
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

const onClick: MenuProps['onClick'] = ({ key }) => {
  void message.info(`Click on item ${key}`);
};

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

export default function ParametersBar(props: {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}): JSX.Element {
  const [containerVisible, setContainerVisible] = useState<boolean>(true);
  const space: [SpaceSize, SpaceSize] = ['large', 'small'];

  // for ease of development, we'll default to expert mode for now
  const [controlDifficulty, setControlDifficulty] = useState<ControlDifficulty>(
    ControlDifficulty.Expert,
  );

  const setParams = props.setParams;
  const [renderHeightMap, setRenderHeightMap] = useState(
    props.params.renderHeightMap,
  );
  // try to get the render height map from the params first
  const [isCameraControlMode, setIsCameraControlMode] = useState(
    props.params.isCameraControlMode,
  );

  useEffect(() => {
    setParams((prev) => {
      return {
        ...prev,
        renderHeightMap,
        isCameraControlMode,
      };
    });
  }, [renderHeightMap, isCameraControlMode, setParams]);

  return (
    <Pane hidden={!containerVisible}>
      <ShowHideButton
        isVisible={containerVisible}
        setVisible={setContainerVisible}
      />
      <Container direction="vertical" size={space} hidden={!containerVisible}>
        {/* hide button */}
        <Row justify="end"></Row>

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

        {/* render the correct pane based on current control difficulty */}
        {
          // add all easy controls here
          controlDifficulty === ControlDifficulty.Easy && null
        }

        {
          // add all expert controls here
          controlDifficulty === ControlDifficulty.Expert && null
        }
        {/* add controls to be shown to both here */}
        <SimulationColour params={props.params} setParams={props.setParams} />

        <Row gutter={16}>
          <ParameterLabel title="Rendering mode"></ParameterLabel>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Flat surface"
              onClick={() => {
                setIsCameraControlMode(false);
                setRenderHeightMap(false);
              }}
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Height map"
              onClick={() => {
                setRenderHeightMap(true);
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={renderHeightMap ? {} : { display: 'none' }}>
          <ParameterLabel title="Current Control"></ParameterLabel>
        </Row>
        <Row gutter={16} style={renderHeightMap ? {} : { display: 'none' }}>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Apply force"
              onClick={() => {
                setIsCameraControlMode(false);
              }}
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <ParameterButton
              label="Spin camera"
              onClick={() => {
                setIsCameraControlMode(true);
              }}
            />
          </Col>
        </Row>
        {/* choose initial model */}
        <Dropdown menu={{ items, onClick }}>
          <DropdownMenu
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              Choose Model
              <DownOutlined />
            </Space>
          </DropdownMenu>
        </Dropdown>

        {/* choose initial state */}
        <Dropdown menu={{ items, onClick }}>
          <DropdownMenu
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              Choose Initial State
              <DownOutlined />
            </Space>
          </DropdownMenu>
        </Dropdown>
      </Container>
    </Pane>
  );
}

// CATEGORIES

// allows the user to change the colour of the simulation
function SimulationColour(props: {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}): JSX.Element {
  const setParams = props.setParams;
  // turn the colours into strings for the colour picker
  const initialColorLow = props.params.densityLowColour.getHexString();
  const initialColorHigh = props.params.densityHighColour.getHexString();
  const [colorLow, setColorLow] = useState<Color | string>(
    '#' + initialColorLow,
  );
  const [colorHigh, setColorHigh] = useState<Color | string>(
    '#' + initialColorHigh,
  );

  const colorLowString = useMemo(
    () => (typeof colorLow === 'string' ? colorLow : colorLow.toHexString()),
    [colorLow],
  );
  const colorHighString = useMemo(
    () => (typeof colorHigh === 'string' ? colorHigh : colorHigh.toHexString()),
    [colorHigh],
  );

  useEffect(() => {
    setParams((prev) => {
      return {
        ...prev,
        densityLowColour: new ThreeColor(colorLowString),
        densityHighColour: new ThreeColor(colorHighString),
      };
    });
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
